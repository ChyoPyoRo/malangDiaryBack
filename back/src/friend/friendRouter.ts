import { Router, Response, Request, NextFunction } from "express";
import { friendService } from "./friendService";
import { loginRequired } from "../middlewares/loginRequired";
import { chatService } from "../chat/chatService";
import { friendRepository } from "./friendRepository";

const friendRouter = Router();
//친구 신청
friendRouter.get(
  "/request/:id",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("\x1b[35m친구 요청 들어옴\x1b[0m");
    try {
      //요청 유저 와 대상 유저를 req에서 식별해야함
      // const currentUser : String = req.currentUser;

      const { currentUserId } = req.body;
      const { id } = req.params;
      console.log("신청자 : ", currentUserId, "대상자 : ", id);
      if (!currentUserId) {
        const message: string = " don't login";
        throw new Error(message);
      } else if (!id) {
        const message: string = "target user is missing";
        throw new Error(message);
      }
      const friendRequest = await friendService.sendRequest(currentUserId, id);
      res.status(201).json(friendRequest);
    } catch (error) {
      next(error);
    }
  }
);

//친구 승인
friendRouter.patch(
  "/accept/",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("\x1b[35m친구 신청 승인 요청 들어옴\x1b[0m");
    try {
      //해당 요청의 id 값을 통해 해당 값을 특정하고, 그 부분의 상태값을 변경
      // const currentUser : string = '3';
      const { id, currentUserId } = req.body;
      console.log(currentUserId);

      if (!currentUserId) {
        const message: string = " don't login ";
        throw new Error(message);
      }
      const acceptRequest = await friendService.acceptRequest(
        id,
        currentUserId
      );
      res.status(202).json(acceptRequest);
    } catch (error) {
      next(error);
    }
  }
);

//친구 거절
friendRouter.patch(
  "/decline",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("\x1b[35m친구 신청 거절 요청 들어옴\x1b[0m");
    try {
      //해당 요청의 id 값을 통해 해당 값을 특정하고, 그 부분의 상태값을 변경
      // const currentUser : string = '3';
      const { id, currentUserId } = req.body;
      if (!currentUserId) {
        const message: string = " don't login ";
        throw new Error(message);
      }
      const acceptRequest = await friendService.declineRequest(
        id,
        currentUserId
      );
      res.status(202).json(acceptRequest);
    } catch (error) {
      next(error);
    }
  }
);

friendRouter.get(
  "/status/:id",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("친구 상태 전송 요청 들어옴");
    try {
      const { currentUserId } = req.body;
      const { id } = req.params;
      if (!currentUserId) {
        const message: string = " don't login ";
        throw new Error(message);
      }
      const checkRequest = await friendService.checkRequest(id, currentUserId);
      console.log(checkRequest);
      res.status(200).json(checkRequest);
    } catch (error) {
      next(error);
    }
  }
);

friendRouter.get(
  "/request",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("친구 신청 조회");
    try {
      const { currentUserId } = req.body;
      const checkAllRequest = await friendService.readAllRequest(currentUserId);
      res.status(200).json(checkAllRequest);
    } catch (error) {
      next(error);
    }
  }
);

friendRouter.get(
  "/list",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentUserId } = req.body;
      if (!currentUserId) {
        const message: string = "please login";
        throw new Error(message);
      }
      const readFriend = await friendService.findAllFriend(currentUserId);
      res.status(200).send(readFriend);
    } catch (error) {
      next(error);
    }
  }
);

friendRouter.delete(
  "/delete/:userId",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { currentUserId } = req.body;
      console.log("currentUser", currentUserId, "otherUser", userId);
      if (!currentUserId) {
        const message: string = "please login";
        throw new Error(message);
      }
      const existCheck = await friendService.findOneFriend(
        currentUserId,
        userId
      );
      console.log(existCheck);
      if (existCheck[0] == undefined) {
        res.status(203).send({ message: "already deleted" });
      } else {
        console.log(existCheck);
        const deletedFriend = await friendService.deleteFriend(
          currentUserId,
          userId,
          existCheck[0].id
        );
        res.status(201).send(deletedFriend);
      }
    } catch (error) {
      next(error);
    }
  }
);
friendRouter.get(
  "/test",
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export { friendRouter };
