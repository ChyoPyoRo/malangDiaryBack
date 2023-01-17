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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diaryRouter = void 0;
const loginRequired_1 = require("../middlewares/loginRequired");
const express_1 = __importDefault(require("express"));
const diaryService_1 = require("./diaryService");
const diaryRouter = (0, express_1.default)();
exports.diaryRouter = diaryRouter;
// 다이어리 포스트
diaryRouter.post("/post/:userName", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body["currentUserId"];
        const { title, subTitle, content } = req.body;
        const scope = req.body.scope;
        const data = { title, subTitle, content, scope };
        const post = yield diaryService_1.diaryService.postingDiary(userId, data);
        res.status(201).send(post);
    }
    catch (error) {
        next(error);
    }
}));
// diaryRouter.post(
//   "/test",
//   upload.single("image"),
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       res.status(201).send("업로드 성공?");
//     } catch (error) {
//       next(error);
//     }
//   }
// );
//다이어리 수정
diaryRouter.patch("/modification", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = req.body;
        const userId = req.body["currentUserId"];
        const modification = yield diaryService_1.diaryService.modifyDiary(userId, newData);
        res.status(201).send(modification);
    }
    catch (error) {
        next(error);
    }
}));
//회원) 본인 일기장
diaryRouter.get("/myList/:pageparams", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageparams } = req.params;
        const page = Number(pageparams);
        const userId = req.body["currentUserId"];
        const List = yield diaryService_1.diaryService.getMyList(userId, page);
        // console.log("왜 조회 안함?", List);
        res.status(200).send(List);
    }
    catch (error) {
        next(error);
    }
}));
//회원) 다른 회원 일기장 id ==> name
diaryRouter.get("/UserList/:otherName/:pageparams", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageparams } = req.params;
        const page = Number(pageparams);
        const userId = req.body["currentUserId"];
        const otherName = req.params.otherName;
        const List = yield diaryService_1.diaryService.getUserList(userId, page, otherName);
        res.status(200).send(List);
    }
    catch (error) {
        next(error);
    }
}));
//✨비회원) 다른 회원 일기장 id==> name
diaryRouter.get("/nonUserList/:otherUserName/:pageparams", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageparams } = req.params;
        const page = Number(pageparams);
        const otherUserName = req.params.otherUserName;
        const List = yield diaryService_1.diaryService.getnonUserList(page, otherUserName);
        res.status(200).send(List);
    }
    catch (error) {
        next(error);
    }
}));
//✨비회원) (main) 다이어리 all
diaryRouter.get("/mainListAll/:pageparams", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageparams } = req.params;
        const page = Number(pageparams);
        const List = yield diaryService_1.diaryService.getMainListAll(page);
        res.status(200).send(List);
    }
    catch (error) {
        next(error);
    }
}));
//회원) (main) 친구 다이어리만 보기
diaryRouter.get("/mainListFriend/:pageparams", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageparams } = req.params;
        const page = Number(pageparams);
        const userId = req.body.currentUserId;
        const List = yield diaryService_1.diaryService.getMainListFr(page, userId);
        res.status(200).send(List);
    }
    catch (error) {
        next(error);
    }
}));
//회원) (main)  all + friend
diaryRouter.get("/mainList/:pageparams", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageparams } = req.params;
        const page = Number(pageparams);
        const userId = req.body.currentUserId;
        const List = yield diaryService_1.diaryService.getMainList(page, userId);
        res.status(200).send(List);
    }
    catch (error) {
        next(error);
    }
}));
diaryRouter.get("/detail/:postingId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postingId } = req.params;
        const postId = Number(postingId);
        const diary = yield diaryService_1.diaryService.findOne(postId);
        res.status(200).send(diary);
    }
    catch (error) {
        next(error);
    }
}));
diaryRouter.delete("/delete/:postingId", loginRequired_1.loginRequired, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postingId } = req.params;
    const postId = Number(postingId);
    yield diaryService_1.diaryService.DeleteOne(postId);
    // send 로 메세지 출력 안됨+ 삭제는 잘 돌아감
    res.status(204).send("Deleted successfully.");
}));
//# sourceMappingURL=diaryRouter.js.map