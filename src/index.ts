import {getSingletonInstance, InjectRequest, InjectSend, Request, Send, StartListen} from "./main";
import {ElectronOn, ElectronRequest, ElectronSend} from "./renderer";

export const main = {
    InjectRequest,
    InjectSend,
    Request,
    Send,
    StartListen,
    getSingletonInstance,
}
export const preload = {}
export const renderer = {
    ElectronRequest,
    ElectronSend,
    ElectronOn,
}