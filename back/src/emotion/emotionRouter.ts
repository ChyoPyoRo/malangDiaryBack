import Router, { Request, Response, NextFunction } from "express";
import { loginRequired } from "../middlewares/loginRequired";
import { emotionService } from "./emotionService";
import { emotion } from "../utils/Types";

const emotionRouter = Router();
emotionRouter.post(
  "/getEmotion",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body["currentUserId"];
      const { startDate, endDate } = req.body;
      const emotion = await emotionService.getEmotion(
        userId,
        startDate,
        endDate
      );
      res.status(201).send(emotion);
    } catch (error) {
      next(error);
    }
  }
);

export { emotionRouter };
