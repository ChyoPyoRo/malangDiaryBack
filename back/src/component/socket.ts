import { chatService } from "../chat/chatService";
import { Server } from "socket.io";
import { loginRequired } from "../middlewares/loginRequired";
import { JWT_SECRET_KEY } from "../configs/configModules";
import Jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Response } from "express";

function setUpSocket(httpServer: object) {
  const chatServer = new Server(httpServer, {}); //추후 옵션 추가
  //모듈로 뺏을 때 위에서 선언된 httpServer를 조회할 방법
  chatServer
    .use((socket, next) => {
      try {
        // console.log(socket)
        const token: any = socket.handshake.auth.token;
        console.log(token);
        // if(!token){
        //   throw new Error('aaaaaaaaaaaaaaaaaaaa')
        // }
        const accessToken: string = token;
        console.log("accessToken : ", accessToken);
        const secretkey: Secret = JWT_SECRET_KEY;
        console.log("secretkey : ", secretkey);
        const jwtDecoded: any = Jwt.verify(accessToken, secretkey);
        console.log("jwtDecoded : ", jwtDecoded);
        const userId = jwtDecoded.userId;
        console.log(userId);
        socket.handshake.headers.currentUser = userId;
        next();
      } catch (error) {
        // socket.emit('error', error) > 작동 안함
        console.log(error);
      }
    })
    .on("connection", (socket) => {
      console.log(socket.rooms);
      // console.log(socket)
      // console.log(socket.handshake.headers.currentUser)
      let roomName: any = null; //
      console.log("connection");

      socket.on("join", async (data) => {
        //data는 json 자체를 받아온다.
        const currentUser: any = socket.handshake.headers.currentUser;
        console.log(`Here comes a NEW CHALLENGER ${currentUser}`);
        console.log(data.otherUser);
        const otherUser = data.otherUser;
        roomName = await chatService.findRoom(currentUser, otherUser);
        console.log(roomName);
        if (!roomName) {
          socket.emit("error", { message: "No Room" });
        } else {
          socket.join(roomName);
          console.log("new test:", socket.rooms);
          socket.emit("success", { message: "Join Success" });
        }
        // console.log(socket.rooms);
      });
      console.log("R :", roomName);
      socket.on("message", async (data) => {
        console.log("R2 :", roomName);
        socket.join(roomName);
        console.log(socket.rooms);
        try {
          // console.log(socket)
          //room없이 메시지 전송은 front적으로 불가능함
          chatServer.sockets.in(roomName).emit("message", data);
          console.log("test2");
          //데이터를 DB에 저장
          const currentUser: any = socket.handshake.headers.currentUser;
          console.log("Message :", data.message);
          console.log("User :", currentUser);
          console.log("Room :", roomName);
          await chatService.saveMessage(data.message, currentUser, roomName);
          console.log(
            `roomName \x1b[34m${roomName}\x1b[0m에서 채팅 발생, 내용 : ${data.message} , 보낸사람 : ${currentUser}`
          );
          console.log(`전체 데이터 : ${data}`);
        } catch (error) {
          console.log("에러는 잡았어요 ", error);
          socket.emit("error", { message: error });
          // chatServer.sockets.in(socket.rooms).emit('message',data);
          //throw 안됨
        }
      });
      socket.on("disconnecting", (data) => {
        console.log("disconnect");
        console.log(socket.rooms);
        for (const room of socket.rooms) {
          console.log("111");
          if (room !== socket.id) {
            socket.to(room).emit("userLeft", "user left");
          }
        }
      });

      // socket.on('chat', (data)) -> 이벤트 발생을 언제 줘야 되지
      socket.on("error", (error) => {
        //에러 처리
        console.log(error);
        socket.emit("error", error);
      });
    });
}

export { setUpSocket };
