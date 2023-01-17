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
exports.authRouter = void 0;
const express_1 = require("express");
const authService_1 = require("./authService");
const loginRequired_1 = require("../middlewares/loginRequired");
// import {generateAccessToken, sendAuthNumber} from '../'
const nodeMailer_1 = require("../middlewares/nodeMailer");
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = req.body;
        if (!req.body.email || !req.body.name || !req.body.password) {
            const message = "Data is missing. Please re-enter. ";
            throw new Error(message);
        }
        const userData = yield authService_1.authService.signUp(email, password, name);
        res.status(201).send(userData);
    }
    catch (error) {
        next(error);
    }
    // const returnData:
}));
authRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!req.body.email || !req.body.password) {
            const message = "Data is missing. Please re-enter. ";
            throw new Error(message);
        }
        const { user, accesstoken } = yield authService_1.authService.login(email, password);
        console.log(user);
        if (!user.emotion) {
            const message = "프로필 젤리를 선택해주세요.";
            res.status(200).send({ message, user, accesstoken });
            return;
        }
        res.status(201).send({ user, accesstoken });
    }
    catch (error) {
        next(error);
    }
}));
authRouter.post("/sendEmail", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email || email.length === 0) {
            return res.status(400).json({ message: "Need accurate informations" });
        }
        yield authService_1.authService.findByEmail(email);
        const authnumber = yield (0, nodeMailer_1.nodeMailer)(email, res);
        const CertiNumber = Number(authnumber);
        yield authService_1.authService.emailAuthSave(email, CertiNumber);
        res.status(201).send("이메일이 정상적으로 발송되었습니다");
    }
    catch (error) {
        next(error);
    }
}));
authRouter.post("/confirmEmail", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { CertiNumber } = req.body;
        const { email } = req.body;
        yield authService_1.authService.emailConfirm(email, CertiNumber);
        res.status(201).send("이메일 인증이 완료되었습니다.");
    }
    catch (error) {
        next(error);
    }
}));
authRouter.post("/getUserList", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const userList = yield authService_1.authService.getUserList(name);
        res.status(201).send(userList);
    }
    catch (error) {
        next(error);
    }
}));
authRouter.get("/getUserProfile/:name", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        const profile = yield authService_1.authService.getUserProfile(name);
        res.status(200).send(profile);
    }
    catch (error) {
        next(error);
    }
}));
authRouter.get("/currentUser", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //🟪🟪🟪 type 에러 =>>> const userId: string | string[] | undefined 3가지 타입에 해당한다
        const userId = req.body["currentUserId"];
        // console.log(userId);
        // const userId: string = req.body.currentUserId!;
        // const userId = "8ee8758b-c680-4d06-a3f3-945ae7a9e8a5";
        const data = yield authService_1.authService.getCurrentUser(userId);
        res.status(200).send(data);
    }
    catch (error) {
        next(error);
    }
}));
authRouter.patch("/userEdit/password", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body["currentUserId"];
        const { password, newPassword } = req.body;
        const editResult = yield authService_1.authService.editPW(userId, password, newPassword);
        res.status(200).send(editResult);
    }
    catch (error) {
        next(error);
    }
}));
authRouter.patch("/userEdit/description", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body["currentUserId"];
        const description = req.body.description;
        const editResult = yield authService_1.authService.editDescription(userId, description);
        res.status(200).send(editResult);
    }
    catch (error) {
        next(error);
    }
}));
authRouter.patch("/userEdit/name", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body["currentUserId"];
        const name = req.body.name;
        const editResult = yield authService_1.authService.editname(userId, name);
        res.status(200).send(editResult);
    }
    catch (error) {
        next(error);
    }
}));
authRouter.patch("/userEdit/emotion", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body["currentUserId"];
        const emotion = req.body.emotion;
        const editResult = yield authService_1.authService.editemotion(userId, emotion);
        res.status(200).send(editResult);
    }
    catch (error) {
        next(error);
    }
}));
authRouter.patch("/userEdit/withdrawal", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body["currentUserId"];
        const editResult = yield authService_1.authService.editWithdrawal(userId);
        res.status(200).send(editResult);
    }
    catch (error) {
        next(error);
    }
}));
//# sourceMappingURL=authRouter.js.map