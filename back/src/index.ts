import express, { Request, Response, NextFunction } from "express";
import cors from "cors-ts";
import { port } from "./configs/configModules";
import { authRouter } from "./auth/authRouter";
import { diaryRouter } from "./diary/diaryRouter";
import { friendRouter } from "./friend/friendRouter";
import { emotionRouter } from "./emotion/emotionRouter";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { chatRouter } from "./chat/chatRouter";
import { createServer } from "http";
import { setUpSocket } from "./component/socket";

const app: express.Application = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("서버에 정상적으로 연결되었습니다.");
});

app.use("/users", authRouter);
app.use("/diary", diaryRouter);
app.use("/chat", chatRouter);
app.use("/friend", friendRouter);
app.use("/emotion", emotionRouter);

const httpServer = createServer(app);
// setUpSocket(httpServer);

app.use(errorMiddleware);
httpServer.listen(port, () => {
  console.log(`정상적으로 서버를 시작하였습니다. http://localhost:${port}`);
});
