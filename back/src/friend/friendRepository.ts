import { PrismaClient } from "@prisma/client";
import { userInfo } from "os";
const prisma = new PrismaClient();

class friendRepository {
  static async makeRequestOnDB(requester: number, respondent: number) {
    //승인대기 0, 수락1, 거절2, 취소됨3
    const newRequest = await prisma.standByFriend.create({
      data: {
        requester: requester,
        respondent: respondent,
        relationship: 0,
      },
    });
    return newRequest;
  }

  static async checkRequest(requester: number, respondent: number) {
    const checkFristRequest = await prisma.standByFriend.findFirst({
      where: {
        requester: requester,
        respondent: respondent,
        /*'{ requester: string; }' 형식은 'standByFriendWhereUniqueInput' 형식에 할당할 수 없습니다.
  개체 리터럴은 알려진 속성만 지정할 수 있으며 'standByFriendWhereUniqueInput' 형식에 'requester'이(가) 없습니다.
  findUnique로 하니까 에러 발생 > 일단 findMany로 함
  근데 many로 반환하니까 null값 탐색이 안되서 그냥 findFirst로 함
  */
      },
    });
    return checkFristRequest;
  }
  static async checkRequestById(id: number) {
    const checkRequest = await prisma.standByFriend.findFirst({
      where: {
        PK_standByFriend: id,
      },
    });
    return checkRequest;
  }
  //다른 요청도 처리하기 위해서 아이디로 찾고 관계만 받기
  static async changeRequest(id: number, relationship: number) {
    const changeRequest = await prisma.standByFriend.update({
      where: {
        PK_standByFriend: id,
      },
      data: {
        relationship: relationship,
      },
    });
    return changeRequest;
  }

  static async readWaitResponse(respondent: string) {
    const result = await prisma.standByFriend.findMany({
      where: {
        respondent: Number(respondent),
        relationship: 0,
      },
    });
    return result;
  }
  static async readAcceptRequest(requester: string) {
    const result = await prisma.standByFriend.findMany({
      where: {
        requester: Number(requester),
        relationship: 1,
      },
    });
    return result;
  }

  //   TODO: freind 외래키 수정됨에 따라 관련 로직 수정해야함
  // 🔳  follower: 본인을 팔로우하는 사람 (친구신청 응답자)
  // 🔳  following: 내가 팔로우하는 사람 (친구신청 요청자)
  static async makeFriend(requester: number, respondent: number) {
    const resultOne: object = await prisma.friend.create({
      data: {
        followerId: {
          connect: {
            id: respondent,
          },
        },
        followingId: {
          connect: {
            id: requester,
          },
        },
      },
    });
    const addFriend1 = await prisma.user.update({
      where: {
        id: requester,
      },
      data: {
        followers: {
          connect: { followerId: requester, follwingId: respondent },
        },
      },
    });
    const addFriend2 = await prisma.user.update({
      where: {
        id: respondent,
      },
      data: {
        following: {
          connect: { followerId: respondent, follwingId: requester },
        },
      },
    });

    // const resultTwo: object = await prisma.friend.create({
    //   data: {
    //     followingId: respondent,
    //     user: {
    //       connect: {
    //         id: requester,
    //       },
    //     },
    //   },
    // });
    // console.log(resultOne, resultTwo);
    return 0;
  }

  static async findFriend(userId: number) {
    const result = await prisma.friend.findMany({
      where: {
        userId: userId,
      },
    });
    return result;
  }
  static async findOneFriend(userId: number, friendId: number) {
    const result = await prisma.friend.findMany({
      where: {
        userId: userId,
        friendId: friendId,
      },
    });
    return result;
  }

  static async deleteFriend(id: number) {
    const result = await prisma.friend.delete({
      where: {
        id: id,
      },
    });
    return result;
  }
}

export { friendRepository };
