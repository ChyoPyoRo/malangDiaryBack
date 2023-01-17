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
exports.diaryController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class diaryController {
    static post(userId, data, emotion, encode) {
        return __awaiter(this, void 0, void 0, function* () {
            const diary = yield prisma.diary.create({
                data: {
                    title: data.title,
                    content: data.content,
                    subTitle: data.subTitle,
                    scope: data.scope,
                    emotion: emotion,
                    encode: encode,
                    user: {
                        connect: { id: userId },
                    },
                },
            });
            return diary;
        });
    }
    static updateDiary(newData, emotion, encode) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateDiary = yield prisma.diary.update({
                where: {
                    id: newData.id,
                },
                data: {
                    title: newData.title,
                    content: newData.content,
                    subTitle: newData.subTitle,
                    scope: newData.scope,
                    emotion: emotion,
                    encode: encode,
                },
            });
            return updateDiary;
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
    static getMyDiary(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const diary0 = yield prisma.diary.findMany({
                where: { userId },
                orderBy: {
                    createAt: "desc",
                },
                skip: (page - 1) * 5,
                take: 5,
            });
            const count = yield prisma.diary.count({
                where: { userId },
            });
            const resultObject = { data: diary0, count: count };
            return resultObject;
        });
    }
    static getFriendId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const diaryfriend = yield prisma.friend.findMany({
                where: { userId: userId },
                select: {
                    friendId: true,
                },
            });
            return diaryfriend;
        });
    }
    static FriendId(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            const diaryfriend = yield prisma.friend.findMany({
                where: { userId: userId, friendId: friendId },
            });
            return diaryfriend;
        });
    }
    // 유저 다이어리 친구스코프
    static getFriendScope(otherId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const diary = yield prisma.diary.findMany({
                where: { userId: otherId, scope: { in: ["friend", "all"] } },
                orderBy: {
                    createAt: "desc",
                },
                skip: (page - 1) * 5,
                take: 5,
            });
            const count = yield prisma.diary.count({
                where: { userId: otherId, scope: { in: ["friend", "all"] } },
            });
            const resultObject = { data: diary, count: count };
            return resultObject;
        });
    }
    // 유저 다이어리 all 스코프
    static getAllScope(otherId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const diary = yield prisma.diary.findMany({
                where: {
                    userId: otherId,
                    scope: "all",
                },
                orderBy: {
                    createAt: "desc",
                },
                skip: (page - 1) * 5,
                take: 5,
            });
            const count = yield prisma.diary.count({
                where: { userId: otherId, scope: "all" },
            });
            const resultObject = { data: diary, count: count };
            return resultObject;
        });
    }
    // main) friend+ all 스코프 추출
    static getMainDiaryFr(page, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            const diary = yield prisma.diary.findMany({
                where: {
                    userId: { in: friendId },
                    scope: { in: ["all", "friend"] },
                },
                orderBy: {
                    createAt: "desc",
                },
                skip: (page - 1) * 3,
                take: 3,
            });
            return diary;
        });
    }
    // main) 친구스코프 다이어리 (service-getMainList)
    static getMainFr(friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            const diary = yield prisma.diary.findMany({
                where: {
                    userId: { in: friendId },
                    scope: "friend",
                },
            });
            return diary;
        });
    }
    // main) all스코프 다이어리 (service-getMainList)
    static getMainAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const diary = yield prisma.diary.findMany({
                where: { scope: "all" },
            });
            return diary;
        });
    }
    //1. 비회원이 볼 수 있는 다이어리 조회(스코프-all)
    static getMainDiaryAll(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const diary = yield prisma.diary.findMany({
                where: { scope: "all" },
                orderBy: {
                    createAt: "desc",
                },
                skip: (page - 1) * 3,
                take: 3,
            });
            return diary;
        });
    }
    //delete
    static deletepost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteOne = yield prisma.diary.delete({
                where: { id: postId },
            });
            return deleteOne;
        });
    }
    static getContentList(friends) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataList = yield prisma.diary.findMany({});
            return dataList;
        });
    }
    //🟪🟪🟪🟪 ㅁㅣ완성
    // 시간 관련 내용 utils로 빼기
    static recentVecList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let date = new Date();
            let term = new Date(date);
            term.setDate(date.getDate() - 1);
            const recentData = yield prisma.diary.findMany({
                where: {
                    // createAt: {
                    //   lt: term,
                    // },
                    scope: "all",
                    // NOT: {
                    //   userId: userId,
                    // },
                },
                orderBy: {
                    createAt: "desc",
                },
                take: 10,
                select: {
                    encode: true,
                },
            });
            // console.log("diaryController- 시간", term);
            // console.log("diaryController- 시간 필터링 결과", recentData);
            return recentData;
        });
    }
    static recentDiaryList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let date = new Date();
            let term = new Date(date);
            term.setDate(date.getDate() - 1);
            const recentData = yield prisma.diary.findMany({
                where: {
                    // createAt: {
                    //   lt: term,
                    // },
                    scope: "all",
                    // NOT: {
                    //   userId: userId,
                    // },
                },
                orderBy: {
                    createAt: "desc",
                },
                take: 10,
            });
            // console.log("diaryController- 시간", term);
            // console.log("diaryController- 시간 필터링 결과", recentData);
            return recentData;
        });
    }
    static getDiaryOne(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const diary = yield prisma.diary.findUnique({
                where: {
                    id: postId,
                },
            });
            return diary;
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
}
exports.diaryController = diaryController;
//# sourceMappingURL=diaryController.js.map