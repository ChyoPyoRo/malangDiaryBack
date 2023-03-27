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
  scope: string; //off : 아무도 조회 못함 , all: 모두 조회, friend : 친구만 조회
  title: string;
  subTitle?: string;
  writer_id?: string;
  emotion?: emotionType;
  diaryEmotion?: diaryEmotion;
}

export interface pageInfo {
  page: number;
  userId?: string; // loginId
  otherUserName?: string;
  friendId?: string; // loginId
}

export interface responseObjectForm {
  diary: Array<Diary>;
  count?: number;
  userName?: string;
}
