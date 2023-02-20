import { loginRequired } from "../middlewares/loginRequired";
import Router, { NextFunction, Request, Response } from "express";
import { diaryService } from "./diaryService";
import { emotion, Scope } from "../utils/Types";
import { celebrate, Joi } from "celebrate";
import exp from "constants";
import { send } from "process";

import multer from "multer";
import { uploadFile, deleteFile } from "../middlewares/imageUpload";
import { diary } from "./interface/diaryInterface";
import { Diary } from "@prisma/client";
const upload = multer({ dest: "uploads/" });
const diaryRouter = Router();

// 다이어리 포스트
diaryRouter.post(
  "/post/:userName",
  uploadFile.single("image"),
  // 이거 없으면 TypeError: Cannot read properties of undefined (reading 'path')
  // 만약 "image" 와 formdata input key값이 다르면 MulterError: Unexpected field 발생
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file: any = req.file;

      const diaryDTO = {
        userId: req.body.currentUserId,
        title: req.body,
        subTitle: req.body,
        content: req.body,
        scope: req.body,
        userName: req.params,
        img: file?.location,
        imgName: file?.key,
      };

      const post: Diary = await diaryService.postingDiary(diaryDTO);
      res.status(201).send(post);
    } catch (error) {
      next(error);
    }
  }
);

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

// TODO:
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
    const DeleteData = await diaryService.DeleteOne(postId);
    // send 로 메세지 출력 안됨+ 삭제는 잘 돌아감
    // console.log(DeleteData, "------data----");
    // const imgKey = DeleteData.userName;
    // TODO: S3 이미지 삭제 마무리 하기
    const imgKey = "1676825899498_0c70ab1c-5db0-4954-b51a-0965d3fe96d8_.jpeg";
    await deleteFile(imgKey);

    res.status(204).send("Deleted successfully.");
  }
);

export { diaryRouter };
