import {ipcMain, type IpcMainInvokeEvent} from "electron";

type HandlerFn = (event: IpcMainInvokeEvent, data: any) => Promise<any> | any;

// 单例实例缓存：类构造函数 -> 实例
const singletonInstances = new Map<Function, any>();

export function getSingletonInstance(target: any) {
    const ctor = target.constructor;
    if (!singletonInstances.has(ctor)) {
        singletonInstances.set(ctor, new ctor());
    }
    return singletonInstances.get(ctor);
}

export const InjectRequest: Record<string, HandlerFn> = {};

export function Request(config: RequestSendConfig): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const originalMethod = descriptor.value;
        if (typeof originalMethod !== 'function') throw new Error('Decorator can only be used on methods');
        if (InjectRequest[config.route]) throw new Error(`Duplicate route detected: ${config.route}`);
        // 绑定到单例实例，确保 this 指向唯一实例
        const instance = getSingletonInstance(target);
        InjectRequest[config.route] = originalMethod.bind(instance);
        console.log(`Request Registered route: ${config.route}`)
    };
}

export const InjectSend: Record<string, HandlerFn> = {};

export function Send(config: RequestSendConfig): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const originalMethod = descriptor.value;
        if (typeof originalMethod !== 'function') throw new Error('Decorator can only be used on methods');
        if (InjectSend[config.route]) throw new Error(`Duplicate route detected: ${config.route}`);
        // 绑定到单例实例，确保 this 指向唯一实例
        const instance = getSingletonInstance(target);
        InjectSend[config.route] = originalMethod.bind(instance);
        console.log(`Request Registered route: ${config.route}`)
    };
}

export interface RequestSendConfig {
    route: string;
}

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
