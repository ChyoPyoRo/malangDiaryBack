declare class chatController {
    static findChatRoom(userFst: string, userSnd: string): Promise<any>;
    static creatChatRoom(userFst: string, userSnd: string, date: Date): Promise<import(".prisma/client").chatRoom>;
    static updateChatTime(date: Date, chatRoom: string): Promise<import(".prisma/client").chatRoom>;
    static createMessage(writer: string, message: string, chatRoom: string): Promise<import(".prisma/client").message>;
    static findRoomByUserInFst(user: string): Promise<import(".prisma/client").chatRoom[]>;
    static findRoomByUserInSnd(user: string): Promise<import(".prisma/client").chatRoom[]>;
    static chatList(roomName: string): Promise<import(".prisma/client").message[]>;
}
export { chatController };
