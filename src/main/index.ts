import {ipcMain, type IpcMainInvokeEvent} from "electron";

type HandlerFn = (event: IpcMainInvokeEvent, data: any) => Promise<any> | any;

export const InjectRequest: Record<string, HandlerFn> = {};
export const InjectSend: Record<string, HandlerFn> = {};

// 单例实例缓存：类构造函数 -> 实例
const singletonInstances = new Map<Function, any>();

function getSingletonInstance(target: any) {
    const ctor = target.constructor;
    if (!singletonInstances.has(ctor)) {
        singletonInstances.set(ctor, new ctor());
    }
    return singletonInstances.get(ctor);
}

function createMethodDecorator(storage: Record<string, HandlerFn>) {
    return () => (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;
        if (typeof originalMethod !== 'function') {
            throw new Error('Decorator can only be used on methods');
        }

        const className = target.constructor.name;
        const route = `${className}.${propertyKey}`;

        if (storage[route]) {
            throw new Error(`Duplicate route detected: ${route}`);
        }

        // 绑定到单例实例，确保 this 指向唯一实例
        const instance = getSingletonInstance(target);
        storage[route] = originalMethod.bind(instance);
    };
}

export const Request = createMethodDecorator(InjectRequest);
export const Send = createMethodDecorator(InjectSend);

export function StartListen() {
    ipcMain.handle("Electron:Request", async (event, {route, data}) => {
        const handler = InjectRequest[route];
        if (!handler) return {code: 404, message: `No handler found for route: ${route}`, data: {route},};

        try {
            const reply = await handler(event, data);
            return {code: 0, data: reply};
        } catch (error) {
            return {code: 500, message: (error as Error).message, data: error, stack: (error as Error).stack,};
        }
    });

    ipcMain.on("Electron:Send", async (event, {route, data}) => {
        const handler = InjectSend[route];
        if (!handler) return {code: 404, message: `No handler found for route: ${route}`, data: {route},};

        try {
            await handler(event, data);
        } catch (error) {
            console.error({code: 500, message: (error as Error).message, data: error, stack: (error as Error).stack,});
        }
    });
}
