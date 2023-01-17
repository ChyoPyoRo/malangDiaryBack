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
exports.friendRouter = void 0;
const express_1 = require("express");
const friendService_1 = require("./friendService");
const loginRequired_1 = require("../middlewares/loginRequired");
const friendRouter = (0, express_1.Router)();
exports.friendRouter = friendRouter;
//친구 신청
friendRouter.get("/request/:id", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\x1b[35m친구 요청 들어옴\x1b[0m");
    try {
        //요청 유저 와 대상 유저를 req에서 식별해야함
        // const currentUser : String = req.currentUser;
        const { currentUserId } = req.body;
        const { id } = req.params;
        console.log("신청자 : ", currentUserId, "대상자 : ", id);
        if (!currentUserId) {
            const message = " don't login";
            throw new Error(message);
        }
        else if (!id) {
            const message = "target user is missing";
            throw new Error(message);
        }
        const friendRequest = yield friendService_1.friendService.sendRequest(currentUserId, id);
        res.status(201).json(friendRequest);
    }
    catch (error) {
        next(error);
    }
}));
//친구 승인
friendRouter.patch("/accept/", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\x1b[35m친구 신청 승인 요청 들어옴\x1b[0m");
    try {
        //해당 요청의 id 값을 통해 해당 값을 특정하고, 그 부분의 상태값을 변경
        // const currentUser : string = '3';
        const { id, currentUserId } = req.body;
        console.log(currentUserId);
        if (!currentUserId) {
            const message = " don't login ";
            throw new Error(message);
        }
        const acceptRequest = yield friendService_1.friendService.acceptRequest(id, currentUserId);
        res.status(202).json(acceptRequest);
    }
    catch (error) {
        next(error);
    }
}));
//친구 거절
friendRouter.patch("/decline", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\x1b[35m친구 신청 거절 요청 들어옴\x1b[0m");
    try {
        //해당 요청의 id 값을 통해 해당 값을 특정하고, 그 부분의 상태값을 변경
        // const currentUser : string = '3';
        const { id, currentUserId } = req.body;
        if (!currentUserId) {
            const message = " don't login ";
            throw new Error(message);
        }
        const acceptRequest = yield friendService_1.friendService.declineRequest(id, currentUserId);
        res.status(202).json(acceptRequest);
    }
    catch (error) {
        next(error);
    }
}));
friendRouter.get('/status/:id', loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('친구 상태 전송 요청 들어옴');
    try {
        const { currentUserId } = req.body;
        const { id } = req.params;
        if (!currentUserId) {
            const message = " don't login ";
            throw new Error(message);
        }
        const checkRequest = yield friendService_1.friendService.checkRequest(id, currentUserId);
        console.log(checkRequest);
        res.status(200).json(checkRequest);
    }
    catch (error) {
        next(error);
    }
}));
friendRouter.get('/request', loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('친구 신청 조회');
    try {
        const { currentUserId } = req.body;
        const checkAllRequest = yield friendService_1.friendService.readAllRequest(currentUserId);
        res.status(200).json(checkAllRequest);
    }
    catch (error) {
        next(error);
    }
}));
friendRouter.get('/list', loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentUserId } = req.body;
        if (!currentUserId) {
            const message = "please login";
            throw new Error(message);
        }
        const readFriend = yield friendService_1.friendService.findAllFriend(currentUserId);
        res.status(200).send(readFriend);
    }
    catch (error) {
        next(error);
    }
}));
friendRouter.delete('/delete/:userId', loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { currentUserId } = req.body;
        console.log('currentUser', currentUserId, 'otherUser', userId);
        if (!currentUserId) {
            const message = "please login";
            throw new Error(message);
        }
        const existCheck = yield friendService_1.friendService.findOneFriend(currentUserId, userId);
        console.log(existCheck);
        if (existCheck[0] == undefined) {
            res.status(203).send({ "message": "already deleted" });
        }
        else {
            console.log(existCheck);
            const deletedFriend = yield friendService_1.friendService.deleteFriend(currentUserId, userId, existCheck[0].id);
            res.status(201).send(deletedFriend);
        }
    }
    catch (error) {
        next(error);
    }
}));
friendRouter.get("/test", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Reset = "\x1b[0m"
    // Bright = "\x1b[1m"
    // Dim = "\x1b[2m"
    // Underscore = "\x1b[4m"
    // Blink = "\x1b[5m"
    // Reverse = "\x1b[7m"
    // Hidden = "\x1b[8m"
    // FgBlack = "\x1b[30m"
    // FgRed = "\x1b[31m"
    // FgGreen = "\x1b[32m"
    // FgYellow = "\x1b[33m"
    // FgBlue = "\x1b[34m"
    // FgMagenta = "\x1b[35m"
    // FgCyan = "\x1b[36m"
    // FgWhite = "\x1b[37m"
    // BgBlack = "\x1b[40m"
    // BgRed = "\x1b[41m"
    // BgGreen = "\x1b[42m"
    // BgYellow = "\x1b[43m"
    // BgBlue = "\x1b[44m"
    // BgMagenta = "\x1b[45m"
    // BgCyan = "\x1b[46m"
    // BgWhite = "\x1b[47m"
    console.log("\x1b[45mtest sentence\x1b[0m");
    res.send("hi");
}));
//# sourceMappingURL=friendRouter.js.map