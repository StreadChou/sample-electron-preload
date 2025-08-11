export async function ElectronRequest(route: string, data: any): Promise<any> {
    // @ts-ignore
    const reply = await window.Electron.Request(route, data);
    if (reply.code === 0) return reply.data;
    throw new ElectronError(reply.message, reply.code, reply.data, reply.stack);
}

export async function ElectronSend(route: string, data: any): Promise<void> {
    // @ts-ignore
    await window.Electron.Send(route, data);
}

export async function ElectronOn(route: string, callback: (data: any) => void): Promise<void> {
    // @ts-ignore
    await window.Electron.On(route, callback);
}

export class ElectronError extends Error {
    code: number
    data: any

    constructor(message: string, code: number, data: any, stack?: string) {
        super(message);
        this.code = code;
        this.data = data;
        if (stack) this.stack = stack;
    }
}
