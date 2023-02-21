import { Router, Response, Request, NextFunction } from "express";
import { friendService } from "./friendService";
import { loginRequired } from "../middlewares/loginRequired";
import { chatService } from "../chat/chatService";
import { friendRepository } from "./friendRepository";
import {
  friend,
  friendDTO,
  standByFriend,
  standByFriendDTO,
} from "./interface/friendInterface";
import { celebrate, Joi } from "celebrate";

const friendRouter = Router();
//친구 신청
friendRouter.get(
  "/request/:id",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("\x1b[35m친구 요청 들어옴\x1b[0m");
    try {
      //요청 유저 와 대상 유저를 req에서 식별해야함
      const standByFriendDTO: standByFriend = {
        requester: Number(req.params.id),
        respondent: req.body.currentUserId,
      };

      const friendRequest = await friendService.sendRequest(standByFriendDTO);
      console.log("router2", friendRequest);
      res.status(201).json(friendRequest);
    } catch (error) {
      next(error);
    }
  }
);

// //친구 승인 FIXME: 친구신청 한 사람이 수락하게 됨 수정하기
friendRouter.patch(
  "/accept/",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("\x1b[35m친구 신청 승인 요청 들어옴\x1b[0m");
    try {
      //해당 요청의 id 값을 통해 해당 값을 특정하고, 그 부분의 상태값을 변경

      const standByFriendDTO: Partial<standByFriendDTO> = {
        PK_standByFriend: req.body.id,
        respondent: req.body.currentUserId,
      };
      if (!standByFriendDTO) {
        const message: string = " don't login ";
        throw new Error(message);
      }
      const acceptRequest = await friendService.acceptRequest(standByFriendDTO);
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
      const standByFriendDTO: Partial<standByFriendDTO> = {
        PK_standByFriend: req.body.id,
        respondent: req.body.currentUserId,
      };
      if (!standByFriendDTO) {
        const message: string = " don't login ";
        throw new Error(message);
      }
      const acceptRequest = await friendService.declineRequest(
        standByFriendDTO
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
      const standByFriendDTO: Partial<standByFriendDTO> = {
        requester: Number(req.params.id),
        respondent: req.body.currentUserId,
      };
      if (!standByFriendDTO.respondent) {
        const message: string = " don't login ";
        throw new Error(message);
      }
      const checkRequest = await friendService.checkRequest(standByFriendDTO);
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
      const currentUserId: Partial<friend> = req.body.currentUserId;
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
      const currentUserId: Partial<friend> = req.body.currentUserId;
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
      const friendDTO: friend = {
        friendId: Number(req.params.userId),
        userId: req.body.currentUserId,
      };
      console.log(
        "currentUser",
        friendDTO.userId,
        "otherUser",
        friendDTO.friendId
      );
      if (!friendDTO.userId) {
        const message: string = "please login";
        throw new Error(message);
      }
      const existCheck: Array<friendDTO> = await friendService.findOneFriend(
        friendDTO
      );
      if (existCheck[0] == undefined) {
        res.status(203).send({ message: "already deleted" });
      } else {
        console.log(existCheck);
        let existId: Pick<friendDTO, "friendId" | "userId"> = existCheck[0];

        const deletedFriend = await friendService.deleteFriend(
          friendDTO,
          existId
        );
        res.status(201).send({ message: "친구 삭제가 완료되었습니다." });
      }
    } catch (error) {
      next(error);
    }
  }
);
// friendRouter.get(
//   "/test",
//   async (req: Request, res: Response, next: NextFunction) => {
//     // Reset = "\x1b[0m"
//     // Bright = "\x1b[1m"
//     // Dim = "\x1b[2m"
//     // Underscore = "\x1b[4m"
//     // Blink = "\x1b[5m"
//     // Reverse = "\x1b[7m"
//     // Hidden = "\x1b[8m"

//     // FgBlack = "\x1b[30m"
//     // FgRed = "\x1b[31m"
//     // FgGreen = "\x1b[32m"
//     // FgYellow = "\x1b[33m"
//     // FgBlue = "\x1b[34m"
//     // FgMagenta = "\x1b[35m"
//     // FgCyan = "\x1b[36m"
//     // FgWhite = "\x1b[37m"

//     // BgBlack = "\x1b[40m"
//     // BgRed = "\x1b[41m"
//     // BgGreen = "\x1b[42m"
//     // BgYellow = "\x1b[43m"
//     // BgBlue = "\x1b[44m"
//     // BgMagenta = "\x1b[45m"
//     // BgCyan = "\x1b[46m"
//     // BgWhite = "\x1b[47m"
//     console.log("\x1b[45mtest sentence\x1b[0m");
//     res.send("hi");
//   }
// );

export { friendRouter };
