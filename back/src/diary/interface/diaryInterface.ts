import { diaryEmotion, Diary } from "@prisma/client";
import { int } from "aws-sdk/clients/datapipeline";
import { emotionType } from "../../utils/Types";

export interface diary extends diaryInterface {
  PK_diary: number;
}

export interface diaryInterface {
  img?: string;
  imgName?: string;
  content: string;
  scope: string;
  title: string;
  subTitle?: string;
  userId?: number;
  emotion?: emotionType;
  diaryEmotion?: diaryEmotion;
}

export interface pageInfo {
  page: number;
  userId?: number;
  otherUserName?: string;
  friendId?: number;
}

export interface responseObjectForm {
  diary: Array<Diary>;
  count?: number;
  userName?: string;
}
