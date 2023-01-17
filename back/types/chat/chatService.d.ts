interface LooseObject {
    [key: string]: any;
}
interface LooseArray extends Array<LooseObject> {
}
declare class chatService {
    static findRoom(userFst: string, userSnd: string): Promise<any>;
    static creatRoom(userFst: string, userSnd: string, date: Date): Promise<LooseObject>;
    static saveMessage(message: string, writer: string, chatRoom: string): Promise<void>;
    static findRoomList(ownerUser: string): Promise<LooseArray>;
    static chatList(roomName: string): Promise<LooseArray>;
}
export { chatService };
