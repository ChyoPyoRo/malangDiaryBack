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
exports.chatRouter = void 0;
const chatService_1 = require("../chat/chatService");
const express_1 = require("express");
const loginRequired_1 = require("../middlewares/loginRequired");
const chatRouter = (0, express_1.Router)();
exports.chatRouter = chatRouter;
chatRouter.get("/room-list", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //들어가 있는 채팅 리스트를 읽어오기
    try {
        const { currentUserId } = req.body;
        let roomList = yield chatService_1.chatService.findRoomList(currentUserId);
        console.log("배열의 첫 번째 : ", roomList[0]);
        console.log("현재 유저 값 읽어오는 법 : ", roomList[0].currentUserId);
        console.log(typeof (roomList));
        res.status(200).send(roomList);
    }
    catch (error) {
        next(error);
    }
}));
chatRouter.get("/chat-list", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 현재 유저 값을 조회할 필요는 없는데, 로그인 확인은 해야 하니까 loginRequired 추가
        const roomId = req.body.id;
        const chatList = yield chatService_1.chatService.chatList(roomId);
        console.log(chatList);
        res.status(201).send(chatList);
    }
    catch (error) {
        next(error);
    }
}));
chatRouter.post('/make', loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentUserId, otherUserId } = req.body;
        const noRoom = yield chatService_1.chatService.findRoom(currentUserId, otherUserId);
        const date = new Date();
        if (noRoom) {
            res.status(403).send({ "message": "alread Room exist" });
        }
        else {
            const creatRoom = yield chatService_1.chatService.creatRoom(currentUserId, otherUserId, date);
            res.status(201).send(creatRoom);
        }
    }
    catch (error) {
        next(error);
    }
}));
chatRouter.get('/test', loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const aa = new Date();
    const bb = aa.toLocaleString();
    console.log(typeof (aa));
    console.log(aa);
    console.log(bb);
    res.status(200).send('j');
}));
//# sourceMappingURL=chatRouter.js.map