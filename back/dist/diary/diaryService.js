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
exports.diaryService = void 0;
const diaryController_1 = require("./diaryController");
const axios_1 = require("../middlewares/axios");
const nameCheck_1 = require("../middlewares/nameCheck");
class diaryService {
    static postingDiary(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawContent = data.content;
            const content = rawContent.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/gi, "");
            const contentdata = { content: content };
            // 🤖🤖🤖 1. 감정분석 모델   🤖🤖🤖
            //📌 크론잡 비동기 워커- 면접때 좋다(최적화)
            const emotion = yield (0, axios_1.emotionAnalysis)(contentdata);
            // const emotion: emotion = "자신감";
            // 🤖🤖🤖 2. 문장 유사도 모델  🤖🤖🤖
            //디비에서 친구 스코프 조회할 때 쓸 친구 리스트 가져오기
            const friends = yield diaryController_1.diaryController.getFriendId(userId);
            //디비 접근해서 내림차순 정렬 후 기간 범위 조건걸기
            // const contentList1 = await diaryController.getContentList(friends);
            const vector = yield diaryController_1.diaryController.recentVecList(userId);
            const diary0 = yield diaryController_1.diaryController.recentDiaryList(userId);
            const vectorList = vector.map((x) => x.encode);
            const inputData = {
                input: content,
                vector: vectorList,
            };
            console.log("🦄🌈axios 연결 테스트", emotion);
            const sentSimResult = yield (0, axios_1.sentenceSimilarity)(inputData);
            const SimdiaryList = [
                diary0[sentSimResult.result[0]],
                diary0[sentSimResult.result[1]],
                diary0[sentSimResult.result[2]],
            ];
            const postingDiary = yield diaryController_1.diaryController.post(userId, data, emotion, sentSimResult.vector);
            const DiaryReturns = {
                currentDiary: postingDiary,
                simdiaryList: SimdiaryList,
            };
            // return SimdiaryList;
            return DiaryReturns;
        });
    }
    static modifyDiary(userId, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            // 🤖🤖🤖 1. 감정분석 모델   🤖🤖🤖
            // 모델 output 값 = 감정
            const content = newData.content.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/gi, "");
            const contentdata = { content: content };
            const emotion = yield (0, axios_1.emotionAnalysis)(contentdata);
            const encode = yield (0, axios_1.sentenceSimilarityUpdate)(contentdata);
            yield diaryController_1.diaryController.updateUserEmotion(userId, emotion);
            const modifyDiary = yield diaryController_1.diaryController.updateDiary(newData, emotion, encode);
            return modifyDiary;
        });
    }
    // 내 다이어리
    static getMyList(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const List = yield diaryController_1.diaryController.getMyDiary(userId, page);
            const userID = List.data[0].userId;
            const user = yield (0, nameCheck_1.nameCheck)(userID);
            List["userName"] = user === null || user === void 0 ? void 0 : user.name;
            return List;
        });
    }
    // 특정 유저의 다이어리
    static getUserList(userId, page, otherName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield diaryController_1.diaryController.findByUserName(otherName);
            const friendId = user === null || user === void 0 ? void 0 : user.id;
            const isFriend = yield diaryController_1.diaryController.FriendId(userId, friendId);
            const userInfo = yield (0, nameCheck_1.nameCheck)(friendId);
            const userName = userInfo === null || userInfo === void 0 ? void 0 : userInfo.name;
            //친구가 있으면 getFriendScope controller
            if (isFriend[0]) {
                const friendScope = yield diaryController_1.diaryController.getFriendScope(friendId, page);
                friendScope["userName"] = userName;
                return friendScope;
            }
            const List = yield diaryController_1.diaryController.getAllScope(friendId, page);
            List["userName"] = userName;
            return List;
        });
    }
    // 특정 유저 다이어리 비회원
    static getnonUserList(page, otherUserName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const otherUser = yield diaryController_1.diaryController.findByUserName(otherUserName);
            const otherId = otherUser === null || otherUser === void 0 ? void 0 : otherUser.id;
            const List = yield diaryController_1.diaryController.getAllScope(otherId, page);
            const userID = (_a = List.data[0]) === null || _a === void 0 ? void 0 : _a.userId;
            const user = yield (0, nameCheck_1.nameCheck)(userID);
            List["userName"] = user === null || user === void 0 ? void 0 : user.name;
            return List;
        });
    }
    //2수정본 . main- 친구만
    static getMainListFr(page, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendIdList = yield diaryController_1.diaryController.getFriendId(userId);
            const friendId = friendIdList.map((x) => x.friendId);
            const List = yield diaryController_1.diaryController.getMainDiaryFr(page, friendId);
            const user = yield Promise.all(List.map((x) => (0, nameCheck_1.nameCheck)(x.userId)));
            const userName = user.map((x) => x === null || x === void 0 ? void 0 : x.name);
            const result = { data: List, userName: userName };
            return result;
        });
    }
    //메인 (all+friend 수정본)
    static getMainList(page, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendIdList = yield diaryController_1.diaryController.getFriendId(userId);
            const friendId = friendIdList.map((x) => x.friendId);
            let LoginUsermain = [];
            const FriendList = yield diaryController_1.diaryController.getMainFr(friendId);
            const AllList = yield diaryController_1.diaryController.getMainAll();
            LoginUsermain = [...FriendList, ...AllList];
            const LoginUsermainSort = LoginUsermain.sort((one, two) => two.createAt.getTime() - one.createAt.getTime());
            const resultThree = LoginUsermainSort.slice(0, 3);
            const user = yield Promise.all(resultThree.map((x) => (0, nameCheck_1.nameCheck)(x.userId)));
            const userName = user.map((x) => x === null || x === void 0 ? void 0 : x.name);
            const result = { data: resultThree, userName: userName };
            return result;
        });
    }
    //1
    static getMainListAll(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const List = yield diaryController_1.diaryController.getMainDiaryAll(page);
            const user = yield Promise.all(List.map((x) => (0, nameCheck_1.nameCheck)(x.userId)));
            const userName = user.map((x) => x === null || x === void 0 ? void 0 : x.name);
            const result = { data: List, userName: userName };
            return result;
        });
    }
    static findOne(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const one = yield diaryController_1.diaryController.getDiaryOne(postId);
            const userID = one.userId;
            const user = yield (0, nameCheck_1.nameCheck)(userID);
            return { userName: user === null || user === void 0 ? void 0 : user.name, diary: one };
        });
    }
    //delete
    static DeleteOne(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield diaryController_1.diaryController.deletepost(postId);
            return;
        });
    }
}
exports.diaryService = diaryService;
// //2. main- 친구만
// static async getMainListFr(scope: string, page: number, userId: string) {
//   // const friendDiaryList: Array<object> = [];
//   const friendIdList = await diaryController.getFriendId(userId);
//   const friendDiaryList: any = [];
//   const test = await Promise.all(
//     friendIdList.map(async (friendId: any) => {
//       const friend: string = friendId.friendId;
//       const List = await diaryController.getMainDiaryFr(scope, page, friend);
//       const a = List[0].diary;
//       friendDiaryList.push(...a);
//       return friendDiaryList;
//     })
//   );
//   const index = test.length;
//   // console.log("service 3", test[index - 1]);
//   //시간순 정렬 아직 안함! 그거 하기
//   return test[index - 1];
// }
// //3. main- friend + all
// static async getMainList(scope: string, page: number, userId: string) {
//   // const friendDiaryList: Array<object> = [];
//   const friendIdList = await diaryController.getFriendId(userId);
//   const friendDiaryList: any = [];
//   const test = await Promise.all(
//     friendIdList.map(async (friendId: any) => {
//       const friend: string = friendId.friendId;
//       const List = await diaryController.getMainDiaryFr(scope, page, friend);
//       const a = List[0].diary;
//       friendDiaryList.push(...a);
//       return friendDiaryList;
//     })
//   );
//   const index = test.length;
//   // console.log("service 3test", test[index - 1]);
//   const List = await diaryController.getMainAll();
//   // console.log("service 3list", List);
//   const a = test[index - 1];
//   const result = [...a, ...List];
//   console.log("service~~~~~~~", result);
//   //시간순 정렬 아직 안함! 그거 하기
//   return result;
// }
//# sourceMappingURL=diaryService.js.map