import { friendRepository } from "./friendRepository";
import { nameCheck } from "../middlewares/nameCheck";
import {
  friend,
  friendDTO,
  standByFriend,
  standByFriendDTO,
} from "./interface/friendInterface";

//object에 메시지를 추가하기 위해서 새로운 형태를 선언
interface LooseObject {
  [key: string]: any;
}
interface LooseArray extends Array<LooseObject> {}

class friendService {
  static async sendRequest(standByFriendDTO: standByFriend) {
    //요청 유저, 대상유저 필요
    //기존 요청 존재여부 확인, 역으로 신청한 경우도 확인
    //리팩토링 할 때 요청자와 대상자 중복 여부도 확인하기

    let checkHoldRequest = await friendRepository.checkRequest(
      standByFriendDTO
    );
    if (checkHoldRequest.currentUserRequest) {
      //요청자와 요청 대상자가 일치하는 신청이 존재
      console.log("해당 요청은 존재합니다 - 1.");
      const message: string = "해당 요청은 존재합니다. - 1 ";
      throw new Error(message);
    } else if (checkHoldRequest.respondentRequest) {
      //요청 대상자가 요청자에게 요청한 신청이 존재
      console.log("해당 요청은 존재합니다 - 2.");
      const message: string = "해당 요청은 존재합니다. - 2 ";
      throw new Error(message);
    } else {
      const makeNewRequest: standByFriendDTO =
        await friendRepository.makeRequestOnDB(standByFriendDTO);
      // 신청 성공 커맨트는 왜 포함?
      makeNewRequest.message = "신청 성공";
      const respondentData = await nameCheck(makeNewRequest.respondent);
      makeNewRequest.respondentName = respondentData?.name;
      const requesterData = await nameCheck(makeNewRequest.requester);
      makeNewRequest.requesterName = requesterData?.name;
      console.log("\x1b[46m추가 목록 생성 \x1b[0m : ", makeNewRequest);
      return makeNewRequest;
    }
  }

  static async acceptRequest(standByFriendDTO: Partial<standByFriendDTO>) {
    console.log("friendService - accept");
    const findRequest = await friendRepository.checkRequestById(
      standByFriendDTO
    );
    if (!findRequest) {
      const message: string = "해당 요청은 존재하지 않습니다";
      throw new Error(message);
    } else {
      if (standByFriendDTO.respondent != findRequest.respondent) {
        const message: string = "권한이 없습니다.";
        throw new Error(message);
      } else {
        console.log("유저 확인 완료");
        if (findRequest.relationship != 0) {
          //이미 승인 됬거나, 거절된것들 => 처리가 끝난것들
          //거절된거 재 신청 여부를 논의 후에 가능이면 거절시 데이터 삭제, 불가능이면 그냥 삭제로 둬야 할 듯
          const message: string = "이미 처리된 요청입니다";
          throw new Error(message);
        } else {
          await friendRepository.makeFriend(findRequest);
          //if문으로 거를까 하다가 위에서 에러가 발생하면 밑에까지 오지 않기 때문에 데이터가 바뀌지 않을 것이라고 예상
          const changeReqFinish: standByFriendDTO =
            await friendRepository.changeRequest(standByFriendDTO, 1);
          changeReqFinish.message = "승인 성공";
          const respondentData = await nameCheck(changeReqFinish.respondent);
          changeReqFinish.respondentName = respondentData?.name;
          const requesterData = await nameCheck(changeReqFinish.requester);
          changeReqFinish.requesterName = requesterData?.name;
          return changeReqFinish;
        }
      }
    }
  }

  static async declineRequest(standByFriendDTO: Partial<standByFriendDTO>) {
    console.log("friendService - decline");
    let findRequest = await friendRepository.checkRequestById(standByFriendDTO);

    if (!findRequest) {
      const message: string = "해당 요청은 존재하지 않습니다";
      throw new Error(message);
    } else {
      if (standByFriendDTO.respondent != findRequest.respondent) {
        console.log(findRequest.PK_standByFriend);
        const message: string = "권한이 없습니다.";
        throw new Error(message);
      } else {
        if (findRequest.relationship != 0) {
          console.log(findRequest.PK_standByFriend);
          //이미 승인 됬거나, 거절된것들 => 처리가 끝난것들
          //거절된거 재 신청 여부를 논의 후에 가능이면 거절시 데이터 삭제, 불가능이면 그냥 삭제로 둬야 할 듯
          const result: object = { message: "이미 처리된 요청입니다" };
          //해당 부분을 에러로 던져도 될지
          return result;
        } else {
          console.log(findRequest.PK_standByFriend);
          console.log("유저 확인 완료");
          const changeReqFinish: standByFriendDTO =
            await friendRepository.changeRequest(standByFriendDTO, 2);
          changeReqFinish.message = "거절 성공";
          const respondentData = await nameCheck(changeReqFinish.respondent);
          changeReqFinish.respondentName = respondentData?.name;
          const requesterData = await nameCheck(changeReqFinish.requester);
          changeReqFinish.requesterName = requesterData?.name;
          return changeReqFinish;
        }
      }
    }
  }
  static async checkRequest(standByFriendDTO: Partial<standByFriendDTO>) {
    console.log("Service - Check");
    const { currentUserRequest, respondentRequest } =
      await friendRepository.checkRequest(standByFriendDTO);
    if (!respondentRequest) {
      if (!currentUserRequest) {
        return { message: "친구 신청 없음" };
      } else if (currentUserRequest["relationship"] == 0) {
        return { message: "친구 신청 수락 여부 대기중" };
      } else if (currentUserRequest["relationship"] == 1) {
        return { message: "친구 신청 수락됨" };
      } else if (currentUserRequest["relationship"] == 2) {
        return { message: "친구 신청 거절됨" };
      } else if (currentUserRequest["relationship"] == 3) {
        return { message: "친구 신청 취소됨" };
      }
    } else if (respondentRequest["relationship"] == 0) {
      return { message: "친구 신청 대기중" };
    } else if (respondentRequest["relationship"] == 1) {
      return { message: "친구 신청 수락됨" };
    } else if (respondentRequest["relationship"] == 2) {
      return { message: "친구 신청 거절됨" };
    } else if (respondentRequest["relationship"] == 3) {
      return { message: "친구 신청 취소됨" };
    }
  }

  static async readAllRequest(currentUserId: Partial<friend>) {
    console.log("service - read Request");

    let result: Array<standByFriendDTO> = [];
    const waitRequest: Array<standByFriendDTO> =
      await friendRepository.readWaitResponse(currentUserId);
    const acceptRequest: Array<standByFriendDTO> =
      await friendRepository.readAcceptRequest(currentUserId);

    for (let key in waitRequest) {
      const respondentData = await nameCheck(waitRequest[key].respondent);
      waitRequest[key].respondentName = respondentData?.name;
      const requesterData = await nameCheck(waitRequest[key].requester);
      waitRequest[key].requesterName = requesterData?.name;
      result.push(waitRequest[key]);
    }
    for (let key in acceptRequest) {
      const respondentData = await nameCheck(acceptRequest[key].respondent);
      acceptRequest[key].respondentName = respondentData?.name;
      const requesterData = await nameCheck(acceptRequest[key].requester);
      acceptRequest[key].requesterName = requesterData?.name;
      result.push(acceptRequest[key]);
    }
    result = [...waitRequest, ...acceptRequest];
    console.log(typeof result);
    console.log(result);
    result = result.sort(
      (one, two) => one.createAt.getTime() - two.createAt.getTime()
    );

    return result;
  }

  static async findAllFriend(friendObject: Partial<friend>) {
    console.log("service - find All Friend");
    let result: Array<friendDTO> = await friendRepository.findFriend(
      friendObject
    );
    for (let key in result) {
      const friendData = await nameCheck(result[key].friendId);
      result[key].friendName = friendData?.name;
    }
    return result;
  }

  static async findOneFriend(friendObject: friend) {
    console.log("service - findOneFriend");
    const result: Array<friendDTO> = await friendRepository.findOneFriend(
      friendObject
    );
    return result;
  }

  static async deleteFriend(
    friendObject: friend,
    existId: Pick<friendDTO, "friendId" | "userId">
  ) {
    console.log("service - delete Friend");

    // let result: Array<friend> = [];
    const firstFriend = await friendRepository.deleteFriend(existId);

    // result.push(firstFriend);
    // const otherFriend: Array<friendDTO> = await friendRepository.findOneFriend(
    //   friendObject
    // );
    // console.log("🐱 otherFriend", otherFriend);
    // console.log(otherFriend[0].id);
    // let anotherExistId: Pick<friendDTO, "id"> = otherFriend[0];
    // const secondFriend = await friendRepository.deleteFriend(anotherExistId);
    // console.log("🐰 second delete", otherFriend);
    // result.push(secondFriend);
    // console.log(result);
    const standByFriendObject: standByFriend = {
      requester: friendObject.friendId,
      respondent: friendObject.userId,
    };
    console.log("신청 값도 바꾸기");

    let { currentUserRequest, respondentRequest } =
      await friendRepository.checkRequest(standByFriendObject);

    const request = currentUserRequest ? currentUserRequest : respondentRequest;

    if (request) {
      console.log(await friendRepository.changeRequest(request, 3));
    } else {
      console.log("no stand");
    }

    return;
  }
}

export { friendService };
