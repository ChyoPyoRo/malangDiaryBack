import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class authRepository {
  static async signUpUser(
    loginId: string,
    email: string,
    name: string,
    hashpassword: string,
    gender: string
  ) {
    const friendTempid: number = 1;
    const newUser = await prisma.user.create({
      data: {
        loginId: loginId,
        email: email,
        password: hashpassword,
        name: name,
        gender: gender,
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
          //기존에는 backend에서 사용하던 id(값의 위치를 나타내는 id)를 사용했는데
          //현재에선 그냥 로그인하던 아이디를 그대로 사용
          connect: { loginId: newUser.loginId },
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
  static async findByUserName(name: string) {
    const findUser = await prisma.user.findMany({
      where: {
        name: name,
      },
      orderBy: {
        withdrawal: "asc",
      },
    });
    return findUser;
  }
  static async findById(Id: number) {
    const findUser = await prisma.user.findUnique({
      //autoincrement니까 값이 하나밖에 없음 + 탈퇴여부도 따질 필요 없음
      where: {
        PK_user: Id,
      },
    });
    return findUser;
  }
  static async findByLoginId(loginId: string) {
    const findUser = await prisma.user.findUnique({
      where: {
        loginId: loginId,
      },
    });
    return findUser;
  }
  static async getUserListById(id: string) {
    const userList = await prisma.user.findMany({
      where: {
        loginId: {
          contains: id,
        },
      },
    });
    return userList;
  }
  static async getUserListByName(id: string) {
    const userList = await prisma.user.findMany({
      where: {
        name: {
          contains: id,
        },
      },
    });
    return userList;
  }

  static async updateUserPW(loginId: string, hashPW: string) {
    const editData = await prisma.user.update({
      data: {
        password: hashPW,
      },
      where: {
        loginId: loginId,
      },
    });
    return editData;
  }
  static async updateUserName(loginId: string, name: string) {
    const editData = await prisma.user.update({
      // where 에 withdrawal =0 인 조건을 걸고싶은데 안됨.
      // 디비 세팅 된 상태에서 필터링은 안되는건가?? 따로 불러오고 그거 보고 필터링?? 그럴리가 없는데
      where: {
        loginId: loginId,
      },
      data: {
        name: name,
      },
    });
    return editData;
  }
  static async updateUserDescription(loginId: string, description: string) {
    const editData = await prisma.user.update({
      where: {
        loginId: loginId,
      },
      data: {
        description: description,
      },
    });
    return editData;
  }
  static async updateUserEmotion(loginId: string, emotion: string) {
    const editData = await prisma.user.update({
      where: {
        loginId: loginId,
      },
      data: {
        emotion: emotion,
      },
    });
    return editData;
  }
  static async updateWithdrawal(loginId: string) {
    const editData = await prisma.user.update({
      where: {
        loginId: loginId,
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
