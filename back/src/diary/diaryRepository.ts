import { PrismaClient } from "@prisma/client";
import { Diary } from "@prisma/client";
import { number } from "joi";
import { encode } from "punycode";
import { user } from "../utils/Modules";
const prisma = new PrismaClient();
import { emotion, Scope, emotionType } from "../utils/Types";
import { diary, diaryInterface } from "./interface/diaryInterface";

class diaryRepository {
  static async post(diaryDTO: diaryInterface, emotion: emotionType) {
    const diary = await prisma.diary.create({
      data: {
        emotion: emotion,
        title: diaryDTO.title,
        content: diaryDTO.content,
        subTitle: diaryDTO.subTitle,
        scope: diaryDTO.scope,
        imgName: diaryDTO?.imgName,
        img: diaryDTO?.img,
        user: {
          connect: { id: Number(diaryDTO.userId) },
        },
      },
    });

    // const emotionData = await prisma.diaryEmotion.create({
    //   data: {
    //     Excited: emotion.Excited,
    //     Comfort: emotion.Comfort,
    //     Confidence: emotion.Confidence,
    //     thanks: emotion.Confidence,
    //     Sadness: emotion.Sadness,
    //     Anger: emotion.Anger,
    //     Anxiety: emotion.Anxiety,
    //     hurt: emotion.hurt,
    //     diary: {
    //       connect: { PK_diary: diary.PK_diary },
    //     },
    //   },
    // });
    return diary;
  }

  static async updateDiary(diaryDTO: Partial<diary>, emotion: emotionType) {
    const updateDiary = await prisma.diary.update({
      where: {
        PK_diary: diaryDTO.PK_diary,
      },
      data: {
        title: diaryDTO.title,
        subTitle: diaryDTO.subTitle,
        content: diaryDTO.content,
        scope: diaryDTO.scope,
        imgName: diaryDTO?.imgName,
        img: diaryDTO?.img,
        emotion: emotion,
      },
    });

    // const emotionData = await prisma.diaryEmotion.update({
    //   where: {},
    //   data: {
    //     Excited: emotion.Excited,
    //     Comfort: emotion.Comfort,
    //     Confidence: emotion.Confidence,
    //     thanks: emotion.Confidence,
    //     Sadness: emotion.Sadness,
    //     Anger: emotion.Anger,
    //     Anxiety: emotion.Anxiety,
    //     hurt: emotion.hurt,
    //     diary: {
    //       connect: { PK_diary: updateDiary.PK_diary },
    //     },
    //   },
    // });
    return updateDiary;
  }

  static async updateUserEmotion(
    diaryDTO: Partial<diaryInterface>,
    emotion: emotionType
  ) {
    const editData = await prisma.user.update({
      where: {
        id: diaryDTO.userId,
      },
      data: {
        emotion: emotion,
      },
    });

    return editData;
  }

  static async getMyDiary(userId: string, page: number) {
    const diary0 = await prisma.diary.findMany({
      where: { userId: Number(userId) },
      orderBy: {
        createAt: "desc",
      },
      skip: (page - 1) * 5,
      take: 5,
    });
    const count = await prisma.diary.count({
      where: { userId: Number(userId) },
    });
    const resultObject = { data: diary0, count: count };
    return resultObject;
  }
  // TODO: 친구 scope 설정 관련해서 친구를 조회해야함 -> 친구 먼저 해결하긴 해야할 듯 🟢
  static async getFriendId(userId: string) {
    const diaryfriend = await prisma.friend.findMany({
      where: { userId: Number(userId) },
      select: {
        friendId: true,
      },
    });
    return diaryfriend;
  }
  //   // TODO: 친구 scope 설정 관련해서 친구를 조회해야함 -> 친구 먼저 해결하긴 해야할 듯 🟢
  static async FriendId(userId: string, friendId: string) {
    const diaryfriend = await prisma.friend.findMany({
      where: { userId: Number(userId), friendId: Number(friendId) },
    });

    return diaryfriend;
  }
  // 유저 다이어리 친구스코프
  static async getFriendScope(otherId: string, page: number) {
    const diary = await prisma.diary.findMany({
      where: { userId: Number(otherId), scope: { in: ["friend", "all"] } },
      orderBy: {
        createAt: "desc",
      },
      skip: (page - 1) * 5,
      take: 5,
    });
    const count = await prisma.diary.count({
      where: { userId: Number(otherId), scope: { in: ["friend", "all"] } },
    });
    const resultObject = { data: diary, count: count };
    return resultObject;
  }
  // 유저 다이어리 all 스코프
  static async getAllScope(otherId: string, page: number) {
    const diary = await prisma.diary.findMany({
      where: {
        userId: Number(otherId),
        scope: "all",
      },
      orderBy: {
        createAt: "desc",
      },
      skip: (page - 1) * 5,
      take: 5,
    });
    const count = await prisma.diary.count({
      where: { userId: Number(otherId), scope: "all" },
    });
    const resultObject = { data: diary, count: count };

    return resultObject;
  }

  // main) friend+ all 스코프 추출
  static async getMainDiaryFr(page: number, friendId: any) {
    const diary = await prisma.diary.findMany({
      where: {
        userId: { in: friendId },
        scope: { in: ["all", "friend"] },
      },
      orderBy: {
        createAt: "desc",
      },
      skip: (page - 1) * 3,
      take: 3,
    });
    return diary;
  }

  // main) 친구스코프 다이어리 (service-getMainList)
  static async getMainFr(friendId: any) {
    const diary = await prisma.diary.findMany({
      where: {
        userId: { in: friendId },
        scope: "friend",
      },
    });
    return diary;
  }

  // main) all스코프 다이어리 (service-getMainList)
  static async getMainAll() {
    const diary = await prisma.diary.findMany({
      where: { scope: "all" },
    });
    return diary;
  }

  //1. 비회원이 볼 수 있는 다이어리 조회(스코프-all)
  static async getMainDiaryAll(page: number) {
    const diary = await prisma.diary.findMany({
      where: { scope: "all" },
      orderBy: {
        createAt: "desc",
      },
      skip: (page - 1) * 3,
      take: 3,
    });
    return diary;
  }

  //delete
  static async deletepost(postId: number) {
    // const deleteEmotion = await prisma.diaryEmotion.delete({
    //   // where:{FK_diary: postId}
    //   where: {
    //     diaryId: postId,
    //   },
    // });
    const deleteOne = await prisma.diary.delete({
      where: { PK_diary: postId },
    });
    return deleteOne;
  }

  static async getContentList(friends: object) {
    const dataList = await prisma.diary.findMany({});
    return dataList;
  }

  static async recentDiaryList(userId: string) {
    let date = new Date();
    let term = new Date(date);
    term.setDate(date.getDate() - 1);
    const recentData = await prisma.diary.findMany({
      where: {
        // createAt: {
        //   lt: term,
        // },
        scope: "all",
        // NOT: {
        //   userId: userId,
        // },
      },
      orderBy: {
        createAt: "desc",
      },
      take: 10,
    });
    // console.log("diaryController- 시간", term);
    // console.log("diaryController- 시간 필터링 결과", recentData);
    return recentData;
  }

  static async getDiaryOne(postId: number) {
    const diary = await prisma.diary.findUnique({
      where: {
        PK_diary: postId,
      },
    });
    return diary;
  }

  static async findByUserName(name: string) {
    const findUser = await prisma.user.findUnique({
      where: {
        name: name,
      },
    });
    return findUser;
  }
}

export { diaryRepository };
