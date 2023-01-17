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
exports.setUpSocket = void 0;
const chatService_1 = require("../chat/chatService");
const socket_io_1 = require("socket.io");
const configModules_1 = require("../configs/configModules");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function setUpSocket(httpServer) {
    const chatServer = new socket_io_1.Server(httpServer, {}); //추후 옵션 추가
    //모듈로 뺏을 때 위에서 선언된 httpServer를 조회할 방법
    chatServer.use((socket, next) => {
        try {
            // console.log(socket)
            const token = socket.handshake.auth.token;
            console.log(token);
            // if(!token){
            //   throw new Error('aaaaaaaaaaaaaaaaaaaa')
            // }
            const accessToken = token;
            console.log('accessToken : ', accessToken);
            const secretkey = configModules_1.JWT_SECRET_KEY;
            console.log('secretkey : ', secretkey);
            const jwtDecoded = jsonwebtoken_1.default.verify(accessToken, secretkey);
            console.log('jwtDecoded : ', jwtDecoded);
            const userId = jwtDecoded.userId;
            console.log(userId);
            socket.handshake.headers.currentUser = userId;
            next();
        }
        catch (error) {
            // socket.emit('error', error) > 작동 안함
            console.log(error);
        }
    })
        .on("connection", (socket) => {
        console.log(socket.rooms);
        // console.log(socket)
        // console.log(socket.handshake.headers.currentUser)
        let roomName = null; //
        console.log('connection');
        socket.on('join', (data) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = socket.handshake.headers.currentUser;
            console.log(`Here comes a NEW CHALLENGER ${currentUser}`);
            console.log(data.otherUser);
            const otherUser = data.otherUser;
            roomName = yield chatService_1.chatService.findRoom(currentUser, otherUser);
            console.log(roomName);
            if (!roomName) {
                socket.emit("error", { "message": "No Room" });
            }
            else {
                socket.join(roomName);
                console.log('new test:', socket.rooms);
                socket.emit("success", { "message": "Join Success" });
            }
            // console.log(socket.rooms);
        }));
        console.log('R :', roomName);
        socket.on('message', (data) => __awaiter(this, void 0, void 0, function* () {
            console.log('R2 :', roomName);
            socket.join(roomName);
            console.log(socket.rooms);
            try {
                // console.log(socket)
                //room없이 메시지 전송은 front적으로 불가능함
                chatServer.sockets.in(roomName).emit('message', data);
                console.log('test2');
                //데이터를 DB에 저장
                const currentUser = socket.handshake.headers.currentUser;
                console.log('Message :', data.message);
                console.log('User :', currentUser);
                console.log('Room :', roomName);
                yield chatService_1.chatService.saveMessage(data.message, currentUser, roomName);
                console.log(`roomName \x1b[34m${roomName}\x1b[0m에서 채팅 발생, 내용 : ${data.message} , 보낸사람 : ${currentUser}`);
                console.log(`전체 데이터 : ${data}`);
            }
            catch (error) {
                console.log('에러는 잡았어요 ', error);
                socket.emit("error", { "message": error });
                // chatServer.sockets.in(socket.rooms).emit('message',data);
                //throw 안됨
            }
        }));
        socket.on("disconnecting", (data) => {
            console.log('disconnect');
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
exports.setUpSocket = setUpSocket;
//# sourceMappingURL=socket.js.map