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
exports.authController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class authController {
    static signUpUser(email, name, hashpassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield prisma.user.create({
                data: {
                    email: email,
                    password: hashpassword,
                    name: name,
                },
                include: {
                    refreshToken: true,
                    diary: true,
                    friend: true,
                },
            });
            yield prisma.refreshToken.create({
                data: {
                    refreshToken: "refresh",
                    user: {
                        connect: { id: newUser.id },
                    },
                },
            });
            return newUser;
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const finduser = yield prisma.user.findMany({
                where: {
                    email: email,
                },
                orderBy: {
                    withdrawal: "asc",
                },
            });
            return finduser;
        });
    }
    static findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
            return findUser;
        });
    }
    static getUserList(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const userList = yield prisma.user.findMany({
                where: {
                    name: {
                        contains: name,
                    },
                },
            });
            return userList;
        });
    }
    static findByUserName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield prisma.user.findUnique({
                where: {
                    name: name,
                },
            });
            return findUser;
        });
    }
    static updateUserPW(userId, hashPW) {
        return __awaiter(this, void 0, void 0, function* () {
            const editData = yield prisma.user.update({
                data: {
                    password: hashPW,
                },
                where: {
                    id: userId,
                },
            });
            return editData;
        });
    }
    static updateUserName(userId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const editData = yield prisma.user.update({
                // where 에 withdrawal =0 인 조건을 걸고싶은데 안됨.
                // 디비 세팅 된 상태에서 필터링은 안되는건가?? 따로 불러오고 그거 보고 필터링?? 그럴리가 없는데
                where: {
                    id: userId,
                },
                data: {
                    name: name,
                },
            });
            return editData;
        });
    }
    static updateUserDescription(userId, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const editData = yield prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    description: description,
                },
            });
            return editData;
        });
    }
    static updateUserEmotion(userId, emotion) {
        return __awaiter(this, void 0, void 0, function* () {
            const editData = yield prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    emotion: emotion,
                },
            });
            return editData;
        });
    }
    static updateWithdrawal(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const editData = yield prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    withdrawal: 1,
                },
            });
            return editData;
        });
    }
    static emailAuthSave(email, CertiNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.emailAuthentication.create({
                data: { email, CertiNumber },
            });
            return;
        });
    }
    static findCertiNumber(email, CertiNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const certinumberResult = yield prisma.emailAuthentication.findFirst({
                where: {
                    email,
                    CertiNumber,
                },
            });
            return certinumberResult;
        });
    }
}
exports.authController = authController;
//# sourceMappingURL=authController.js.map