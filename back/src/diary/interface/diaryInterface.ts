import { diaryEmotion } from "@prisma/client";

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
  diaryEmotion?: diaryEmotion;
}
