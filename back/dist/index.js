"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_ts_1 = __importDefault(require("cors-ts"));
const configModules_1 = require("./configs/configModules");
const authRouter_1 = require("./auth/authRouter");
const diaryRouter_1 = require("./diary/diaryRouter");
const friendRouter_1 = require("./friend/friendRouter");
const emotionRouter_1 = require("./emotion/emotionRouter");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const chatRouter_1 = require("./chat/chatRouter");
const http_1 = require("http");
const socket_1 = require("./component/socket");
const app = (0, express_1.default)();
app.use((0, cors_ts_1.default)({
    origin: "*",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    res.send("서버에 정상적으로 연결되었습니다.");
});
app.use("/users", authRouter_1.authRouter);
app.use("/diary", diaryRouter_1.diaryRouter);
app.use("/chat", chatRouter_1.chatRouter);
app.use("/friend", friendRouter_1.friendRouter);
app.use("/emotion", emotionRouter_1.emotionRouter);
const httpServer = (0, http_1.createServer)(app);
(0, socket_1.setUpSocket)(httpServer);
app.use(errorMiddleware_1.errorMiddleware);
httpServer.listen(configModules_1.port, () => {
    console.log(`정상적으로 서버를 시작하였습니다. http://localhost:${configModules_1.port}`);
});
//# sourceMappingURL=index.js.map