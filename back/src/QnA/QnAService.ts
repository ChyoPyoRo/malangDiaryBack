import {
  diaryQuestion,
  diaryAnswer,
  pagenation,
  page,
} from "./interface/QnAinterface";
import { DiaryQuestion, DiaryAnswer, user } from "@prisma/client";
import { Inject, Service, Container } from "typedi";
import "reflect-metadata";
import {
  EventDispatcher,
  EventDispatcherInterface,
} from "../decorators/eventDispatcher";
import { QnARepository } from "./QnARepository";
import { number } from "joi";

@Service()
export default class QnAService {
  public dateTime: Date;
  constructor(
    public questionId: number = 0,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
  ) {
    this.dateTime = new Date();
  }

  public async postQuestion(question: Pick<diaryQuestion, "question">) {
    const QnARepositoryInstance = Container.get(QnARepository);
    const savedData = await QnARepositoryInstance.addQuestion(question);

    return savedData;
  }
  public async getQuestion(userId: string): Promise<diaryQuestion | null> {
    const QnARepositoryInstance = Container.get(QnARepository);
    // new instance  ==== get count 관련
    const count: number = await QnARepositoryInstance.CountOfQuestion(userId);

    //  new instance  ==== get Date 관련
    const answerRecord = await QnARepositoryInstance.getDate(userId);

    if (!answerRecord) {
      //  기존 작성 대답 없으면 1번부터
      this.questionId = 1;
    } else if (answerRecord.createAt.getDate() < this.dateTime.getDate()) {
      //  최근 답변의 질문번호 +1을 리턴 혹은 최대 질문 수 오버시 1로 초기화
      answerRecord.diaryQuestion.id >= count
        ? (this.questionId = 1)
        : (this.questionId = answerRecord.diaryQuestion.id + 1);
    } else {
      // 최근 답변 일시 == 오늘
      this.questionId = answerRecord.diaryQuestion.id;
    }

    const getOneQuestion = await QnARepositoryInstance.getOneQuestion(
      this.questionId
    );
    return getOneQuestion;
  }

  public async postAnswer(
    QnA: Pick<diaryAnswer, "questionNumber" | "userId" | "content">
  ): Promise<diaryAnswer | null> {
    const QnARepositoryInstance = Container.get(QnARepository);
    const postAnswer = await QnARepositoryInstance.postAnswerQnA(QnA);
    return postAnswer;
  }

  public async getAnswer(
    data: Pick<diaryAnswer, "userId"> & pagenation
  ): Promise<
    (diaryAnswer & {
      user: user;
    } & { diaryQuestion: diaryQuestion })[]
  > {
    let getAnswersList;
    const QnARepositoryInstance = Container.get(QnARepository);
    if (Number.isNaN(data.page)) {
      return (getAnswersList = await QnARepositoryInstance.getAppAnswersList(
        data
      ));
    } else {
      getAnswersList = await QnARepositoryInstance.getWebAnswersList(data);
    }
    return getAnswersList;
  }
}
