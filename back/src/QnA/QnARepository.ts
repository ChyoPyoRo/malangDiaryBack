import { user, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Inject, Service } from "typedi";
import {
  diaryQuestion,
  diaryAnswer,
  pagenation,
} from "./interface/QnAinterface";
import {
  EventDispatcher,
  EventDispatcherInterface,
} from "../decorators/eventDispatcher";

@Service()
export class QnARepository {
  constructor(
    // @Inject("DiaryQuestion") private question: DiaryQuestion,
    // @Inject("DiaryAnswer") private AnswerDto: DiaryAnswer,
    // @Inject("logger") private logger: Logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
  ) {}

  public async addQuestion({
    question,
  }: Pick<diaryQuestion, "question">): Promise<diaryQuestion> {
    const saveData = await prisma.diaryQuestion.create({
      data: {
        question: question,
      },
    });
    return saveData;
  }

  public async getOneQuestion(id: number): Promise<diaryQuestion | null> {
    const getOneQuestion = await prisma.diaryQuestion.findFirst({
      where: { id: id },
    });
    return getOneQuestion;
  }

  public async postAnswerQnA(
    QnA: Pick<diaryAnswer, "questionNumber" | "userId" | "content">
  ): Promise<diaryAnswer | null> {
    const postAnswer = await prisma.diaryAnswer.create({
      data: {
        content: QnA.content,
        user: {
          connect: { loginId: QnA.userId },
        },
        diaryQuestion: {
          connect: {
            id: QnA.questionNumber,
          },
        },
      },
    });
    return postAnswer;
  }

  // web
  public async getWebAnswersList(
    data: Pick<diaryAnswer, "userId"> & pagenation
  ): Promise<
    (diaryAnswer & {
      user: user;
    } & { diaryQuestion: diaryQuestion })[]
  > {
    const answerList = await prisma.diaryAnswer.findMany({
      where: { userId: data.userId },
      include: { user: true, diaryQuestion: true },
      orderBy: {
        createAt: "desc",
      },
      skip: (data.page - 1) * 5,
      take: 5,
    });
    return answerList;
  }

  // app
  public async getAppAnswersList(
    data: Pick<diaryAnswer, "userId"> & pagenation
  ): Promise<
    (diaryAnswer & {
      user: user;
    } & { diaryQuestion: diaryQuestion })[]
  > {
    const answerList = await prisma.diaryAnswer.findMany({
      where: {
        userId: data.userId,
        createAt: {
          gte: data.startDate,
          lte: data.endDate,
        },
      },
      include: { user: true, diaryQuestion: true },
      orderBy: {
        createAt: "desc",
      },
    });

    return answerList;
  }

  public async getDate(userId: string) {
    const latestAnswer = await prisma.diaryAnswer.findFirst({
      where: { userId },
      orderBy: {
        createAt: "desc",
      },
      include: {
        diaryQuestion: true,
      },
    });
    return latestAnswer;
  }
  public async CountOfQuestion(userId: string) {
    const questionInfo = await prisma.diaryAnswer.count({
      where: { userId },
    });
    return questionInfo;
  }
}
