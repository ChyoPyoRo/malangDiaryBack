import { PrismaClient, Diary } from "@prisma/client";
import {
  diary,
  diaryInterface,
  pageInfo,
  responseObjectForm,
} from "../diary/interface/diaryInterface";

const prisma = new PrismaClient();

class calendarRepository {
  static async findDiary(
    currentUserId: string,
    startDate: Date,
    lastDate: Date
  ) {
    let findDiaryAllInDiary: any = await prisma.diary.findMany({
      where: {
        AND: [
          {
            createAt: {
              //해당 년, 전달, 1은 31 2는 담달 1, 0시 0분 0초
              gt: startDate,
            },
          },
          {
            createAt: {
              lt: lastDate,
            },
          },
          {
            writer_id: currentUserId,
          },
        ],
      },
    });

    return findDiaryAllInDiary;
  }

  static async findDiaryOnDate(
    currentUserId: string,
    startTime: Date,
    lastTime: Date
  ) {
    let findDiaryAllOnDate: any = await prisma.diary.findMany({
      where: {
        AND: [
          {
            createAt: {
              //해당 년, 전달, 1은 31 2는 담달 1, 0시 0분 0초
              gt: startTime,
            },
          },
          {
            createAt: {
              lt: lastTime,
            },
          },
          {
            writer_id: currentUserId,
          },
        ],
      },
    });
    return findDiaryAllOnDate;
  }
}

export { calendarRepository };
