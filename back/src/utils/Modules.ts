import { Namespace } from "socket.io";

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

//socket.io에서 가져온 거 -> 뭔지 모름
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

export interface FileInfo {
  link: string;
  filename: string;
}
