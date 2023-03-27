import Router, { Request, Response, NextFunction } from "express";
import {
  diaryAnswer,
  diaryQuestion,
  pagenation,
} from "./interface/QnAinterface";
import { Container } from "typedi";

const QnARouter = Router();
import { celebrate, Joi } from "celebrate";
// import { Logger } from "winston";
import { loginRequired } from "../middlewares/loginRequired";
import QnAService from "./QnAService";
import { number } from "joi";

// 질문 등록
QnARouter.post(
  "/question",
  celebrate({
    body: Joi.object({
      question: Joi.string().required(),
    }),
  }),

  async (req: Request, res: Response, next: NextFunction) => {
    // const logger: Logger = Container.get("logger");
    // logger.debug("Calling Sign-Up endpoint with body: %o", req.body);
    try {
      const question: Pick<diaryQuestion, "question"> = {
        question: req.body.question,
      };
      const QnAInstance = Container.get(QnAService);
      const storedResult = await QnAInstance.postQuestion(question);
      res.status(201).send(storedResult);
    } catch (error) {
      next(error);
    }
  }
);

// 질문 한개 가져오기
QnARouter.get(
  "/getOneQuestion",
  loginRequired,
  celebrate({
    body: Joi.object({
      currentUserId: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = String(req.body.currentUserId);
      const QnAInstance = Container.get(QnAService);

      const getOneQuestion = await QnAInstance.getQuestion(userId);
      res.status(200).send(getOneQuestion);
    } catch (error) {
      next(error);
    }
  }
);

// 답변 등록하기
QnARouter.post(
  "/answer/:questionNumber",
  loginRequired,
  celebrate({
    body: Joi.object({
      currentUserId: Joi.required(),
      content: Joi.string().required(),
    }),
    params: Joi.object({
      questionNumber: Joi.required(),
    }),
  }),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const QnA: Pick<diaryAnswer, "questionNumber" | "userId" | "content"> = {
        questionNumber: Number(req.params.questionNumber),
        userId: String(req.body.currentUserId),
        content: req.body.content,
      };
      const QnAInstance = Container.get(QnAService);
      const storedResult = await QnAInstance.postAnswer(QnA);
      res.status(201).send(storedResult);
    } catch (error) {
      next(error);
    }
  }
);

// 질문들 가져오기 -> 질문 + 대답 + 답변
QnARouter.get(
  "/getAnswersList/:page?/:startDate?/:endDate?",
  loginRequired,
  celebrate({
    body: Joi.object({
      currentUserId: Joi.required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: Pick<diaryAnswer, "userId"> & pagenation = {
        userId: String(req.body.currentUserId),
        page: Number(req.params.page),
        startDate: new Date(req.params.startDate),
        endDate: new Date(req.params.endDate),
      };

      const QnAInstance = Container.get(QnAService);
      const getOneQuestion = await QnAInstance.getAnswer(data);
      res.status(200).send(getOneQuestion);
    } catch (error) {
      next(error);
    }
  }
);

export { QnARouter };
