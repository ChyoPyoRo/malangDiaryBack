import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class authRepository {
  static async signUpUser(email: string, name: string, hashpassword: string) {
    const friendTempid: number = 1;
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashpassword,
        name: name,
        //
        // TODO: 친구 연결하기
        // followers: {
        //   connect: {
        //     followerId: friendTempid,
        //   },
        // },
        // following: {
        //   connect: {
        //     followingId: friendTempid,
        //   },
        // },
      },
      // include: {
      //   refreshToken: true,
      //   diary: true,
      //   friend: true,
      // },
    });
    await prisma.refreshToken.create({
      data: {
        refreshToken: "refresh",
        user: {
          connect: { id: newUser.id },
        },
      },
    });
    return newUser;
  }
  static async findByEmail(email: string) {
    const finduser = await prisma.user.findMany({
      where: {
        email: email,
      },
      orderBy: {
        withdrawal: "asc",
      },
    });
    return finduser;
  }
  static async findByUserId(userId: number) {
    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return findUser;
  }
  static async getUserList(name: string) {
    const userList = await prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
    return userList;
  }
  static async findByUserName(name: string) {
    const findUser = await prisma.user.findUnique({
      where: {
        name: name,
      },
    });
    return findUser;
  }
  static async updateUserPW(userId: number, hashPW: string) {
    const editData = await prisma.user.update({
      data: {
        password: hashPW,
      },
      where: {
        id: userId,
      },
    });
    return editData;
  }
  static async updateUserName(userId: number, name: string) {
    const editData = await prisma.user.update({
      // where 에 withdrawal =0 인 조건을 걸고싶은데 안됨.
      // 디비 세팅 된 상태에서 필터링은 안되는건가?? 따로 불러오고 그거 보고 필터링?? 그럴리가 없는데
      where: {
        id: userId,
      },
      data: {
        name: name,
      },
    });
    return editData;
  }
  static async updateUserDescription(userId: number, description: string) {
    const editData = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        description: description,
      },
    });
    return editData;
  }
  static async updateUserEmotion(userId: number, emotion: string) {
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
  static async updateWithdrawal(userId: number) {
    const editData = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        withdrawal: 1,
      },
    });
    return editData;
  }
  static async emailAuthSave(email: string, CertiNumber: number) {
    await prisma.emailAuthentication.create({
      data: { email, CertiNumber },
    });
    return;
  }
  static async findCertiNumber(email: string, CertiNumber: number) {
    const certinumberResult = await prisma.emailAuthentication.findFirst({
      where: {
        email,
        CertiNumber,
      },
    });
    return certinumberResult;
  }
}
export { authRepository };
