import { chatService } from "../chat/chatService";
import { Router, Response, Request, NextFunction } from "express";
import { loginRequired } from "../middlewares/loginRequired";

interface LooseObject {
  [key: string]: any;
}

const chatRouter = Router()

chatRouter.get(
  "/room-list",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    //들어가 있는 채팅 리스트를 읽어오기
    try {
      const { currentUserId } = req.body;
      let roomList: LooseObject = await chatService.findRoomList(
        currentUserId
      );
      console.log("배열의 첫 번째 : ", roomList[0])
      console.log("현재 유저 값 읽어오는 법 : ", roomList[0].currentUserId)
      console.log(typeof (roomList))
      res.status(200).send(roomList);
    } catch (error) {
      next(error);
    }
  }
);

chatRouter.get(
  "/chat-list",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 현재 유저 값을 조회할 필요는 없는데, 로그인 확인은 해야 하니까 loginRequired 추가
      const roomId = req.body.id;
      const chatList = await chatService.chatList(roomId);
      console.log(chatList);
      res.status(201).send(chatList);
    } catch (error) {
      next(error);
    }
  })

chatRouter.post('/make', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentUserId, otherUserId } = req.body;
    const noRoom = await chatService.findRoom(currentUserId, otherUserId);
    const date = new Date()
    if (noRoom) {
      res.status(403).send({ "message": "alread Room exist" })
    }
    else {
      const creatRoom = await chatService.creatRoom(currentUserId, otherUserId, date);
      res.status(201).send(creatRoom)
    }
  } catch (error) {
    next(error)
  }
})

chatRouter.get('/test', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  const aa = new Date();
  const bb = aa.toLocaleString();
  console.log(typeof (aa))
  console.log(aa)
  console.log(bb)
  res.status(200).send('j')
})
export { chatRouter }
