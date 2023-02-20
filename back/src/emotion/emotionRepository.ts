import { PrismaClient } from "@prisma/client";
import { emotion } from "../utils/Types";
const prisma = new PrismaClient();

class emotionRepository {
  static async getEmotions(
    userId: number,
    startDate: Date,
    endDate: Date,
    emotion: string
  ) {
    // console.log(userId, startDate, endDate);

    let emotionCount = await prisma.diary.count({
      //   where: {
      //     userId: userId,
      //     emotion: emotion,
      //     createAt: {
      //       gte: startDate,
      //       lte: endDate,
      //     },
      //   },
      //   select: {
      //     emotion: true,
      //   },
    });
    // const result = {
    //   value: emotion,
    //   ...emotionCount,
    // };

    // return result;
    return;
  }
}

export { emotionRepository };

/*
Excited
Comfort
Confidence
thanks
Sadness
Anger
Anxiety
hurt

  | "신이 난"
  | "편안한"
  | "감사한"
  | "자신감"
  | "불안"
  | "슬픔"
  | "분노"
  | "상처";
  */
