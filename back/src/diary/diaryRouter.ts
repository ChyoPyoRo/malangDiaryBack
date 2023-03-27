import { loginRequired } from "../middlewares/loginRequired";
import Router, { NextFunction, Request, Response } from "express";
import { diaryService } from "./diaryService";
import { emotion, Scope } from "../utils/Types";
import { celebrate, Joi } from "celebrate";
import exp from "constants";
import { send } from "process";

import multer from "multer";
import { uploadFile, deleteFile } from "../middlewares/imageUpload";
import { diary, diaryInterface, pageInfo } from "./interface/diaryInterface";
import { Diary, user } from "@prisma/client";
import { File } from "aws-sdk/clients/codecommit";
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
      const diaryDTO: diaryInterface = {
        writer_id: req.body.currentUserId,
        title: req.body.title,
        subTitle: req.body.subTitle,
        content: req.body.content,
        scope: req.body.scope,
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
  uploadFile.single("image"),
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file: any = req.file;
      const diaryDTO: Partial<diary> = {
        writer_id: req.body.currentUserId,
        PK_diary: req.body.id,
        title: req.body.title,
        subTitle: req.body.subTitle,
        content: req.body.content,
        scope: req.body.scope,
        img: file?.location,
        imgName: file?.key,
        emotion: req.body.emotion,
      };
      const modification = await diaryService.modifyDiary(diaryDTO);

      res.status(201).send(modification);
    } catch (error) {
      next(error);
    }
  }
);

//회원) 본인 일기장
diaryRouter.get(
  "/myList/:page",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pageDTO: pageInfo = {
        page: Number(req.params.page),
        userId: req.body.currentUserId,
      };

      const List = await diaryService.getMyList(pageDTO);

      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);

//회원) 다른 회원 일기장 id ==> name
diaryRouter.get(
  "/UserList/:otherName/:page",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pageDTO: pageInfo = {
        userId: req.body.currentUserId,
        page: Number(req.params.page),
        otherUserName: req.params.otherName,
      };

      const List = await diaryService.getUserList(pageDTO);
      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);
//✨비회원) 다른 회원 일기장 id==> name
diaryRouter.get(
  "/nonUserList/:otherUserName/:page",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let pageDTO: pageInfo = {
        page: Number(req.params.page),
        otherUserName: req.params.otherUserName,
      };

      const List = await diaryService.getnonUserList(pageDTO);

      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);

//✨비회원) (main) 다이어리 all
diaryRouter.get(
  "/mainListAll/:page",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.params.page);
      const List = await diaryService.getMainListAll(page);
      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);

//회원) (main) 친구 다이어리만 보기
diaryRouter.get(
  "/mainListFriend/:page",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let pageDTO: pageInfo = {
        page: Number(req.params.page),
        userId: req.body.currentUserId,
      };
      const List = await diaryService.getMainListFr(pageDTO);
      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);
//회원) (main)  all + friend
diaryRouter.get(
  "/mainList/:page",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let pageDTO: pageInfo = {
        page: Number(req.params.page),
        userId: req.body.currentUserId,
      };
      const List = await diaryService.getMainList(pageDTO);
      res.status(200).send(List);
    } catch (error) {
      next(error);
    }
  }
);

// 다이어리 상세
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

    // TODO: S3 이미지 삭제 마무리 하기
    await deleteFile(DeleteData.imgName);

    res.status(204).send({ message: "Deleted successfully." });
  }
);

export { diaryRouter };
