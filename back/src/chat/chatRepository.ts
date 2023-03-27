import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
interface LooseObject {
  [key: string]: any;
}

class chatRepository {
  static async findChatRoom(userFst: string, userSnd: string) {
    //처음 chatRoom의 정보를 찾아봄
    let checkRequest: any = await prisma.chatRoom.findFirst({
      where: {
        userIdFst: userFst,
        userIdSnd: userSnd,
      },
    });
    //존재하면 return, 없으면 순서를 바꿔서 한번 더 찾아보기
    if (checkRequest) {
      //방이 없으면 false, 있으면 true
      checkRequest.message = true;
      return checkRequest;
    } else {
      checkRequest = await prisma.chatRoom.findFirst({
        where: {
          userIdFst: userSnd,
          userIdSnd: userFst,
        },
      });
      if (checkRequest) {
        //방이 없으면 false, 있으면 true
        checkRequest.message = true;
        return checkRequest;
      }
      let result = {
        message: false,
      };
      return result;
    }
  }
  static async creatChatRoom(userFst: string, userSnd: string, date: Date) {
    const createRoom = await prisma.chatRoom.create({
      data: {
        userIdFst: userFst,
        userIdSnd: userSnd,
        latest: date,
      },
    });
    return createRoom;
  }

  static async updateChatTime(date: Date, chatRoom: string) {
    const result = await prisma.chatRoom.update({
      where: {
        id: chatRoom,
      },
      data: {
        latest: date,
      },
    });
    return result;
  }

  static async createMessage(
    writer: string,
    message: string,
    chatRoom: string
  ) {
    const result = await prisma.message.create({
      data: {
        userId: writer,
        text: message,
        room: chatRoom,
      },
    });
    return result;
  }

  static async findRoomByUserInFst(user: string) {
    // console.log("chatController",user)
    const resultOne = await prisma.chatRoom.findMany({
      where: {
        userIdFst: user,
      },
    });
    // console.log('chatController Out')
    return resultOne;
  }
  static async findRoomByUserInSnd(user: string) {
    // console.log("chatController",user)
    const resultTwo = await prisma.chatRoom.findMany({
      where: {
        userIdSnd: user,
      },
    });
    // console.log('chatController Out')
    return resultTwo;
  }

  static async chatList(roomName: string) {
    console.log("chatController");
    const result = await prisma.message.findMany({
      where: {
        room: roomName,
      },
    });
    return result;
  }
}

export { chatRepository };
//default붙이면 왜 안되지?
