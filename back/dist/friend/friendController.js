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
exports.friendController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class friendController {
    static makeRequestOnDB(requester, respondent) {
        return __awaiter(this, void 0, void 0, function* () {
            //승인대기 0, 수락1, 거절2, 취소됨3
            const newRequest = yield prisma.standByFriend.create({
                data: {
                    requester: requester,
                    respondent: respondent,
                    relationship: 0,
                },
            });
            return newRequest;
        });
    }
    static checkRequest(requester, respondent) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkFristRequest = yield prisma.standByFriend.findFirst({
                where: {
                    requester: requester,
                    respondent: respondent,
                    /*'{ requester: string; }' 형식은 'standByFriendWhereUniqueInput' 형식에 할당할 수 없습니다.
              개체 리터럴은 알려진 속성만 지정할 수 있으며 'standByFriendWhereUniqueInput' 형식에 'requester'이(가) 없습니다.
              findUnique로 하니까 에러 발생 > 일단 findMany로 함
              근데 many로 반환하니까 null값 탐색이 안되서 그냥 findFirst로 함
              */
                },
            });
            return checkFristRequest;
        });
    }
    static checkRequestById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkRequest = yield prisma.standByFriend.findFirst({
                where: {
                    id: id,
                },
            });
            return checkRequest;
        });
    }
    //다른 요청도 처리하기 위해서 아이디로 찾고 관계만 받기
    static changeRequest(id, relationship) {
        return __awaiter(this, void 0, void 0, function* () {
            const changeRequest = yield prisma.standByFriend.update({
                where: {
                    id: id,
                },
                data: {
                    relationship: relationship,
                },
            });
            return changeRequest;
        });
    }
    static makeFriend(requester, respondent) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOne = yield prisma.friend.create({
                data: {
                    userId: requester,
                    user: {
                        connect: {
                            id: respondent,
                        },
                    },
                },
            });
            const resultTwo = yield prisma.friend.create({
                data: {
                    userId: respondent,
                    user: {
                        connect: {
                            id: requester,
                        },
                    },
                },
            });
            console.log(resultOne, resultTwo);
            return 0;
        });
    }
    static readWaitResponse(respondent) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.standByFriend.findMany({
                where: {
                    respondent: respondent,
                    relationship: 0,
                },
            });
            return result;
        });
    }
    static readAcceptRequest(requester) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.standByFriend.findMany({
                where: {
                    requester: requester,
                    relationship: 1,
                },
            });
            return result;
        });
    }
    static findFriend(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.friend.findMany({
                where: {
                    userId: userId,
                },
            });
            return result;
        });
    }
    static findOneFriend(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.friend.findMany({
                where: {
                    userId: userId,
                    friendId: friendId
                }
            });
            return result;
        });
    }
    static deleteFriend(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.friend.delete({
                where: {
                    id: id,
                }
            });
            return result;
        });
    }
}
exports.friendController = friendController;
//# sourceMappingURL=friendController.js.map