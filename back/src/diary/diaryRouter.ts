import { loginRequired } from "../middlewares/loginRequired";
import Router, { NextFunction, Request, Response } from "express";
import { diaryService } from "./diaryService";
import { emotion, Scope } from "../utils/Types";
// import { upload } from "../middlewares/imageUpload";

import exp from "constants";
import { send } from "process";
const diaryRouter = Router();

// 다이어리 포스트
diaryRouter.post(
  "/post/:userName",
  loginRequired,
  // upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body["currentUserId"];
      const { title, subTitle, content } = req.body;
      const scope: Scope = req.body.scope;
      // const img = req.file;
      const data = {
        title,
        subTitle,
        content,
        scope,
        // img
      };
      // console.log(data);

      const post = await diaryService.postingDiary(userId, data);
      res.status(201).send(post);
    } catch (error) {
      next(error);
    }
  }
);

// diaryRouter.post(
//   "/test",
//   upload.single("image"),
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const image = req.file;
//       // const img = upload.single("image");
//       console.log("img??", image);

//       res.status(201).send(image);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

//다이어리 수정
diaryRouter.patch(
  "/modification",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newData = req.body;
      const userId = req.body["currentUserId"];

      const modification = await diaryService.modifyDiary(userId, newData);

      res.status(201).send(modification);
    } catch (error) {
      next(error);
    }
  }
);

//회원) 본인 일기장
diaryRouter.get(
  "/myList/:pageparams",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageparams } = req.params;
      const page: number = Number(pageparams);
      const userId = req.body["currentUserId"];

      const List = await diaryService.getMyList(userId, page);
      // console.log("왜 조회 안함?", List);

      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);

//회원) 다른 회원 일기장 id ==> name
diaryRouter.get(
  "/UserList/:otherName/:pageparams",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageparams } = req.params;
      const page: number = Number(pageparams);

      const userId = req.body["currentUserId"];
      const otherName = req.params.otherName;

      const List = await diaryService.getUserList(userId, page, otherName);
      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);
//✨비회원) 다른 회원 일기장 id==> name
diaryRouter.get(
  "/nonUserList/:otherUserName/:pageparams",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageparams } = req.params;
      const page: number = Number(pageparams);
      const otherUserName = req.params.otherUserName;

      const List = await diaryService.getnonUserList(page, otherUserName);

      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);

//✨비회원) (main) 다이어리 all
diaryRouter.get(
  "/mainListAll/:pageparams",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageparams } = req.params;
      const page: number = Number(pageparams);
      const List = await diaryService.getMainListAll(page);
      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);

//회원) (main) 친구 다이어리만 보기
diaryRouter.get(
  "/mainListFriend/:pageparams",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageparams } = req.params;
      const page: number = Number(pageparams);
      const userId: string = req.body.currentUserId;
      const List = await diaryService.getMainListFr(page, userId);
      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);
//회원) (main)  all + friend
diaryRouter.get(
  "/mainList/:pageparams",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageparams } = req.params;
      const page: number = Number(pageparams);
      const userId: string = req.body.currentUserId;
      const List = await diaryService.getMainList(page, userId);
      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);

diaryRouter.get(
  "/detail/:postingId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postingId } = req.params;
      const postId = Number(postingId);
      const diary = await diaryService.findOne(postId);
      res.status(200).send(diary);
    } catch (error) {
      next(error);
    }
  }
);

diaryRouter.delete(
  "/delete/:postingId",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    const { postingId } = req.params;
    const postId = Number(postingId);
    await diaryService.DeleteOne(postId);
    // send 로 메세지 출력 안됨+ 삭제는 잘 돌아감
    res.status(204).send("Deleted successfully.");
  }
);

diaryRouter.get(
  "/SimList/:diaryId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { diaryId } = req.params;
      const postId = Number(diaryId);

      const result = await diaryService.findSim(postId);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

export { diaryRouter };
