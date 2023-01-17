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
exports.chatService = void 0;
const authController_1 = require("../auth/authController");
const chatController_1 = require("./chatController");
const nameCheck_1 = require("../middlewares/nameCheck");
class chatService {
    static findRoom(userFst, userSnd) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("SocketIO -> chatRoom 확인");
            const findOriginRoom = yield chatController_1.chatController.findChatRoom(userFst, userSnd);
            console.log(`방 존재 여부 : ${findOriginRoom.message}`);
            if (findOriginRoom.message) {
                //방이 존재 , 방의 값을 그냥 넘겨줌
                return findOriginRoom.id;
            }
            else {
                //방이 없으면 새로 만듬 -> 동시성 문제로 폐기
                console.log('no Room >>>> make');
                const date = new Date();
                const createNewRoom = yield chatController_1.chatController.creatChatRoom(userFst, userSnd, date);
                console.log(createNewRoom);
                return createNewRoom.id;
            }
        });
    }
    static creatRoom(userFst, userSnd, date) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("chatservice -> 방생성");
            const createNewRoom = yield chatController_1.chatController.creatChatRoom(userFst, userSnd, date);
            console.log(createNewRoom);
            const userFstData = yield (0, nameCheck_1.nameCheck)(createNewRoom.userIdFst);
            createNewRoom.userFstName = userFstData === null || userFstData === void 0 ? void 0 : userFstData.name;
            const userSndData = yield (0, nameCheck_1.nameCheck)(createNewRoom.userIdSnd);
            createNewRoom.userSndData = userSndData === null || userSndData === void 0 ? void 0 : userSndData.name;
            return createNewRoom;
        });
    }
    static saveMessage(message, writer, chatRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('메시지 저장');
            //리턴값은 필요 없을듯 + 에러처리는 prisma 안에서 됨
            console.log(Date());
            const createMessage = yield chatController_1.chatController.createMessage(writer, message, chatRoom);
            console.log("메시지 생성 완료 : ", createMessage);
            const resultMessage = yield chatController_1.chatController.updateChatTime(new Date(), chatRoom);
            console.log(resultMessage);
            return;
        });
    }
    static findRoomList(ownerUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOne = yield chatController_1.chatController.findRoomByUserInFst(ownerUser);
            const resultTwo = yield chatController_1.chatController.findRoomByUserInSnd(ownerUser);
            // }
            let resultFinal = [...resultOne, ...resultTwo];
            //https://bobbyhadz.com/blog/typescript-type-object-must-have-symbol-iterator-method
            for (const key in resultFinal) {
                // console.log(resultFinal[key])
                let findFstUser = yield authController_1.authController.findByUserId(resultFinal[key].userIdFst);
                resultFinal[key].userIdFstName = (findFstUser === null || findFstUser === void 0 ? void 0 : findFstUser.name) || "No Exist User";
                let findSndUser = yield authController_1.authController.findByUserId(resultFinal[key].userIdSnd);
                resultFinal[key].userIdSndName = (findSndUser === null || findSndUser === void 0 ? void 0 : findSndUser.name) || "No Exist User";
            }
            // console.log(resultFinal)
            // DB에 Nick자체를 저장하면 접근 자체는 줄을 거 같은데 foreignkey가 아니여서 변경할 때 마다 또 해줘야됨
            // 시간도 없음 -> 나중에 리펙토링 할 때
            resultFinal = resultFinal.sort((one, two) => two.latest.getTime() - one.latest.getTime());
            const aa = [{ currentUserId: ownerUser }];
            let final = [...aa, ...resultFinal];
            return final;
        });
    }
    static chatList(roomName) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatList = yield chatController_1.chatController.chatList(roomName);
            console.log(typeof (chatList));
            for (const key in chatList) {
                let findWriter = yield authController_1.authController.findByUserId(chatList[key].userId);
                chatList[key].userName = (findWriter === null || findWriter === void 0 ? void 0 : findWriter.name) || "No Exist User";
            }
            console.log(chatList);
            const result = chatList.sort((one, two) => one.createAt.getTime() - two.createAt.getTime());
            console.log(result);
            return chatList;
        });
    }
}
exports.chatService = chatService;
//# sourceMappingURL=chatService.js.map