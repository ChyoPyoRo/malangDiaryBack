import { friend, PrismaClient } from "@prisma/client";
import { userInfo } from "os";
const prisma = new PrismaClient();
import {
  friendDTO,
  standByFriend,
  standByFriendDTO,
} from "./interface/friendInterface";

class friendRepository {
  static async makeRequestOnDB(standByFriendDTO: standByFriend) {
    //승인대기 0, 수락1, 거절2, 취소됨3
    const newRequest = await prisma.standByFriend.create({
      data: {
        requesterId: standByFriendDTO.requesterId,
        respondentId: standByFriendDTO.respondentId,
        // relationship: 0, sended : false -> default
      },
    });
    return newRequest;
  }

  static async checkRequest(standByFriendDTO: Partial<standByFriend>) {
    const currentUserRequest = await prisma.standByFriend.findFirst({
      where: {
        requesterId: standByFriendDTO.requesterId,
        respondentId: standByFriendDTO.respondentId,
      },
    });
    const respondentRequest = await prisma.standByFriend.findFirst({
      where: {
        requesterId: standByFriendDTO.respondentId,
        respondentId: standByFriendDTO.requesterId,
      },
    });

    return { currentUserRequest, respondentRequest };
  }
  static async checkRequestById(standByFriendDTO: Partial<standByFriendDTO>) {
    const checkRequest = await prisma.standByFriend.findFirst({
      where: {
        respondentId: standByFriendDTO.respondentId,
        requesterId: standByFriendDTO.requesterId,
      },
    });
    return checkRequest;
  }
  //다른 요청도 처리하기 위해서 아이디로 찾고 관계만 받기
  static async changeRequest(
    data: Partial<standByFriendDTO>,
    relationship: number
  ) {
    const changeRequest = await prisma.standByFriend.update({
      where: {
        PK_standByFriend: data.PK_standByFriend,
      },
      data: {
        relationship: relationship,
      },
    });
    return changeRequest;
  }

  static async readWaitResponse(respondent: Partial<friend>) {
    const result = await prisma.standByFriend.findMany({
      where: {
        respondentId: String(respondent),
        relationship: 0,
      },
    });
    console.log("repo", result);
    return result;
  }
  static async readAcceptedRequest(requester: Partial<friend>) {
    const result = await prisma.standByFriend.findMany({
      where: {
        requesterId: String(requester),
        relationship: 1,
        sended: false,
      },
    });
    console.log("repo", result);
    return result;
  }
  //알림 등록해준 사람 sended값 true로 바꾸기
  static async updateAcceptedRequest(requsetPK: number) {
    await prisma.standByFriend.update({
      where: {
        PK_standByFriend: requsetPK,
      },
      data: {
        sended: true,
      },
    });
  }

  static async findRequestByPK(requestPK: number) {
    const result = await prisma.standByFriend.findUnique({
      where: {
        PK_standByFriend: requestPK,
      },
    });
    return result;
  }

  //   TODO: freind 외래키 수정됨에 따라 관련 로직 수정해야함
  static async makeFriend(standByFriendDTO: standByFriend) {
    const resultOne: object = await prisma.friend.create({
      data: {
        userId: standByFriendDTO.requesterId,
        user: {
          connect: {
            loginId: standByFriendDTO.respondentId,
          },
        },
      },
    });
    const resultTwo: object = await prisma.friend.create({
      data: {
        userId: standByFriendDTO.respondentId,
        user: {
          connect: {
            loginId: standByFriendDTO.requesterId,
          },
        },
      },
    });
    console.log(resultOne, resultTwo);
    return 0;
  }

  static async findFriend(userId: Partial<friend>) {
    const result = await prisma.friend.findMany({
      where: {
        userId: String(userId),
      },
    });
    return result;
  }
  static async findOneFriend(friendDTO: Partial<friend>) {
    const result = await prisma.friend.findMany({
      where: {
        userId: friendDTO.userId,
        friendId: friendDTO.friendId,
      },
    });
    return result;
  }

  static async deleteFriend(existId: Pick<friendDTO, "friendId" | "userId">) {
    const firstValue = await prisma.friend.deleteMany({
      where: {
        userId: existId.friendId,
        friendId: existId.userId,
      },
    });
    const secondValue = await prisma.friend.deleteMany({
      where: {
        userId: existId.userId,
        friendId: existId.friendId,
      },
    });

    return;
  }
}

export { friendRepository };
