import { PrismaClient } from "@prisma/client";
import { encode } from "punycode";
const prisma = new PrismaClient();
import { emotion, Scope } from "../utils/Types";

class diaryRepository {
  static async post(
    userId: string,
    data: any,
    emotion: emotion,
    encode: string
  ) {
    const diary = await prisma.diary.create({
      data: {
        title: data.title,
        content: data.content,
        subTitle: data.subTitle,
        scope: data.scope,
        // img: data?.location,
        emotion: emotion,
        encode: encode,
        user: {
          connect: { id: userId },
        },
      },
    });
    return diary;
  }

  static async updateDiary(newData: any, emotion: emotion, encode: string) {
    const updateDiary = await prisma.diary.update({
      where: {
        id: newData.id,
      },
      data: {
        title: newData.title,
        content: newData.content,
        subTitle: newData.subTitle,
        scope: newData.scope,
        emotion: emotion,
        encode: encode,
      },
    });
    return updateDiary;
  }

  static async updateUserEmotion(userId: string, emotion: string) {
    const editData = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emotion: emotion,
      },
    });

    return editData;
  }

  static async getMyDiary(userId: string, page: number) {
    const diary0 = await prisma.diary.findMany({
      where: { userId },
      orderBy: {
        createAt: "desc",
      },
      skip: (page - 1) * 5,
      take: 5,
    });
    const count = await prisma.diary.count({
      where: { userId },
    });
    const resultObject = { data: diary0, count: count };
    return resultObject;
  }
  static async getFriendId(userId: string) {
    const diaryfriend = await prisma.friend.findMany({
      where: { userId: userId },
      select: {
        friendId: true,
      },
    });
    return diaryfriend;
  }

  static async FriendId(userId: string, friendId: string) {
    const diaryfriend = await prisma.friend.findMany({
      where: { userId: userId, friendId: friendId },
    });

    return diaryfriend;
  }
  // 유저 다이어리 친구스코프
  static async getFriendScope(otherId: string, page: number) {
    const diary = await prisma.diary.findMany({
      where: { userId: otherId, scope: { in: ["friend", "all"] } },
      orderBy: {
        createAt: "desc",
      },
      skip: (page - 1) * 5,
      take: 5,
    });
    const count = await prisma.diary.count({
      where: { userId: otherId, scope: { in: ["friend", "all"] } },
    });
    const resultObject = { data: diary, count: count };
    return resultObject;
  }
  // 유저 다이어리 all 스코프
  static async getAllScope(otherId: string, page: number) {
    const diary = await prisma.diary.findMany({
      where: {
        userId: otherId,
        scope: "all",
      },
      orderBy: {
        createAt: "desc",
      },
      skip: (page - 1) * 5,
      take: 5,
    });
    const count = await prisma.diary.count({
      where: { userId: otherId, scope: "all" },
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
    const deleteOne = await prisma.diary.delete({
      where: { id: postId },
    });
    return deleteOne;
  }

  static async getContentList(friends: object) {
    const dataList = await prisma.diary.findMany({});
    return dataList;
  }

  //🟪🟪🟪🟪 ㅁㅣ완성
  // 시간 관련 내용 utils로 빼기
  static async recentVecList(userId: string) {
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

      select: {
        encode: true,
      },
    });
    // console.log("diaryController- 시간", term);
    // console.log("diaryController- 시간 필터링 결과", recentData);
    return recentData;
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
        id: postId,
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

  static async postSimList(SimdiaryList: any, postingDiary: any) {
    const SimList = await prisma.sim.create({
      data: {
        currentPost: postingDiary.id,
        one: SimdiaryList[0].id,
        two: SimdiaryList[1].id,
        three: SimdiaryList[2].id,
      },
    });
    return;
  }

  static async findSimData(postId: number) {
    const result = await prisma.sim.findFirst({
      where: {
        currentPost: postId,
      },
    });
    return result;
  }
}

export { diaryRepository };
