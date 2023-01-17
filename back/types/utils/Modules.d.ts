/// <reference types="node" />
export interface controllerReturnForm {
    status: number;
    message: string;
    responseData: Object;
}
export interface user {
    name: string;
    description: string;
    emotion: string;
}
export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}
export interface ClientToServerEvents {
    hello: () => void;
}
export interface InterServerEvents {
    ping: () => void;
}
export interface SocketData {
    name: string;
    age: number;
}
