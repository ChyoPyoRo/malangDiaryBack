"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class chatController {
    static findChatRoom(userFst, userSnd) {
        return __awaiter(this, void 0, void 0, function* () {
            //처음 chatRoom의 정보를 찾아봄
            let checkRequest = yield prisma.chatRoom.findFirst({
                where: {
                    userIdFst: userFst,
                    userIdSnd: userSnd
                }
            });
            //존재하면 return, 없으면 순서를 바꿔서 한번 더 찾아보기
            if (checkRequest) {
                //방이 없으면 false, 있으면 true
                checkRequest.message = true;
                return checkRequest;
            }
            else {
                checkRequest = yield prisma.chatRoom.findFirst({
                    where: {
                        userIdFst: userSnd,
                        userIdSnd: userFst
                    }
                });
                if (checkRequest) {
                    //방이 없으면 false, 있으면 true
                    checkRequest.message = true;
                    return checkRequest;
                }
                let result = {
                    message: false
                };
                return result;
            }
        });
    }
    static creatChatRoom(userFst, userSnd, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRoom = yield prisma.chatRoom.create({
                data: {
                    userIdFst: userFst,
                    userIdSnd: userSnd,
                    latest: date
                }
            });
            return createRoom;
        });
    }
    static updateChatTime(date, chatRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.chatRoom.update({
                where: {
                    id: chatRoom
                },
                data: {
                    latest: date
                }
            });
            return result;
        });
    }
    static createMessage(writer, message, chatRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.message.create({
                data: {
                    userId: writer,
                    text: message,
                    room: chatRoom,
                }
            });
            return result;
        });
    }
    static findRoomByUserInFst(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("chatController",user)
            const resultOne = yield prisma.chatRoom.findMany({
                where: {
                    userIdFst: user
                }
            });
            // console.log('chatController Out')
            return resultOne;
        });
    }
    static findRoomByUserInSnd(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("chatController",user)
            const resultTwo = yield prisma.chatRoom.findMany({
                where: {
                    userIdSnd: user
                }
            });
            // console.log('chatController Out')
            return resultTwo;
        });
    }
    static chatList(roomName) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('chatController');
            const result = yield prisma.message.findMany({
                where: {
                    room: roomName
                }
            });
            return result;
        });
    }
}
exports.chatController = chatController;
//default붙이면 왜 안되지?
//# sourceMappingURL=chatController.js.map