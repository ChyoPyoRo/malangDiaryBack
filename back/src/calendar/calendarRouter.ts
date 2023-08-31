import { Router, Response, Request, NextFunction } from "express";
import { loginRequired } from "../middlewares/loginRequired";
import { calendarService } from "../calendar/calendarService";

const calendarRouter = Router();

calendarRouter.get(
  "/month/:year&:month",
  loginRequired,
  async (req, res, next) => {
    try {
      //인원을 확인, 달 확인 >> 해당 인원이 해당 달에 작성했던 게시글 전달
      //작성 제목, 감정, 다이어리 PK 값
      const { currentUserId } = req.body;
      const { month, year } = req.params;

      if (!month) {
        throw Error("month doesn't exist!");
      } else if (!year) {
        throw Error("year doesn't exist!");
      }
      //service에서 값을 전달시켜줘야됨
      const result = await calendarService.findDiaryInMonth(
        currentUserId,
        month,
        year
      );

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

calendarRouter.get(
  "/date/:year&:month&:date",
  loginRequired,
  async (req, res, next) => {
    try {
      const { currentUserId } = req.body;
      const { year, month, date } = req.params;

      if (!month) {
        throw Error("month doesn't exist!");
      } else if (!year) {
        throw Error("year doesn't exist!");
      } else if (!date) {
        throw Error(" date doesn't exist!");
      }

      const result = await calendarService.findDiaryOnDate(
        currentUserId,
        month,
        year,
        date
      );

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

export { calendarRouter };
