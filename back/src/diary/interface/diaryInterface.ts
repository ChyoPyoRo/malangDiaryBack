import { diaryEmotion } from "@prisma/client";
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
