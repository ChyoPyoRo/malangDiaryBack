import { diaryEmotion } from "@prisma/client";

export interface diary extends diaryDTO {
  PK_diary: number;
}

export interface diaryDTO {
  img?: string;
  imgName?: string;
  content: string;
  scope: string;
  title: string;
  subTitle?: string;
  userId?: number;
  diaryEmotion?: diaryEmotion;
}
