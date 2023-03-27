import { authRepository } from "../auth/authRepository";
import { chatRepository } from "./chatRepository";
import { loginIdCheck } from "../middlewares/loginIdCheck";

interface LooseObject {
  [key: string]: any;
}
interface LooseArray extends Array<LooseObject> {}

class chatService {
  static async findRoom(userFst: string, userSnd: string) {
    console.log("SocketIO -> chatRoom 확인");
    const findOriginRoom = await chatRepository.findChatRoom(userFst, userSnd);
    console.log(`방 존재 여부 : ${findOriginRoom.message}`);
    if (findOriginRoom.message) {
      //방이 존재 , 방의 값을 그냥 넘겨줌
      return findOriginRoom.id;
    } else {
      //방이 없으면 새로 만듬 -> 동시성 문제로 폐기
      console.log("no Room >>>> make");
      const date = new Date();
      const createNewRoom = await chatRepository.creatChatRoom(
        userFst,
        userSnd,
        date
      );
      console.log(createNewRoom);
      return createNewRoom.id;
    }
  }
  static async creatRoom(userFst: string, userSnd: string, date: Date) {
    console.log("chatservice -> 방생성");
    const createNewRoom: LooseObject = await chatRepository.creatChatRoom(
      userFst,
      userSnd,
      date
    );
    console.log(createNewRoom);
    const userFstData = await loginIdCheck(createNewRoom.userIdFst);
    createNewRoom.userFstName = userFstData?.name;
    const userSndData = await loginIdCheck(createNewRoom.userIdSnd);
    createNewRoom.userSndData = userSndData?.name;
    return createNewRoom;
  }
  static async saveMessage(message: string, writer: string, chatRoom: string) {
    console.log("메시지 저장");
    //리턴값은 필요 없을듯 + 에러처리는 prisma 안에서 됨
    console.log(Date());
    const createMessage = await chatRepository.createMessage(
      writer,
      message,
      chatRoom
    );
    console.log("메시지 생성 완료 : ", createMessage);
    const resultMessage = await chatRepository.updateChatTime(
      new Date(),
      chatRoom
    );
    console.log(resultMessage);
    return;
  }
  static async findRoomList(ownerUser: string) {
    const resultOne = await chatRepository.findRoomByUserInFst(ownerUser);
    const resultTwo = await chatRepository.findRoomByUserInSnd(ownerUser);

    let resultFinal: LooseArray = [...resultOne, ...resultTwo];
    //https://bobbyhadz.com/blog/typescript-type-object-must-have-symbol-iterator-method
    for (const key in resultFinal) {
      // console.log(resultFinal[key])
      let findFstUser = await authRepository.findByLoginId(
        resultFinal[key].userIdFst
      );
      resultFinal[key].userIdFstName = findFstUser?.name || "No Exist User";
      let findSndUser = await authRepository.findByLoginId(
        resultFinal[key].userIdSnd
      );
      resultFinal[key].userIdSndName = findSndUser?.name || "No Exist User";
    }
    // console.log(resultFinal)
    // DB에 Nick자체를 저장하면 접근 자체는 줄을 거 같은데 foreignkey가 아니여서 변경할 때 마다 또 해줘야됨
    // 시간도 없음 -> 나중에 리펙토링 할 때
    resultFinal = resultFinal.sort(
      (one, two) => two.latest.getTime() - one.latest.getTime()
    );
    const aa: LooseArray = [{ currentUserId: ownerUser }];
    let final: LooseArray = [...aa, ...resultFinal];
    return final;
  }
  static async chatList(roomName: string) {
    const chatList: LooseArray = await chatRepository.chatList(roomName);
    console.log(typeof chatList);
    for (const key in chatList) {
      let findWriter = await authRepository.findByLoginId(chatList[key].userId);
      chatList[key].userName = findWriter?.name || "No Exist User";
    }
    console.log(chatList);
    const result = chatList.sort(
      (one, two) => one.createAt.getTime() - two.createAt.getTime()
    );
    console.log(result);
    return chatList;
  }
}

export { chatService };
