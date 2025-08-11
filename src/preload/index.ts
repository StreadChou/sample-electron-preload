import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld('Electron', {
    Request: (route: string, data: any) => ipcRenderer.invoke('Electron:Request', {route, data}),
    Send: (route: string, data: any) => ipcRenderer.send('Electron:Send', {route, data}),
    On: (route: string, callback: (data: any) => void) => ipcRenderer.on(route, callback),
});
