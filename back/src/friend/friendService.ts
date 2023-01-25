// import { friendRepository } from "./friendRepository";
// import { nameCheck } from "../middlewares/nameCheck";
// import { standByFriend, friend } from "@prisma/client";
// //object에 메시지를 추가하기 위해서 새로운 형태를 선언

// interface LooseObject {
//   [key: string]: any;
// }
// interface LooseArray extends Array<LooseObject> {}
// class friendService {
//   static async sendRequest(requester: string, respondent: string) {
//     //요청 유저, 대상유저 필요
//     //기존 요청 존재여부 확인, 역으로 신청한 경우도 확인
//     //리팩토링 할 때 요청자와 대상자 중복 여부도 확인하기
//     let checkOriginalRequsetFirst = await friendRepository.checkRequest(
//       requester,
//       respondent
//     );
//     let checkOriginalRequestSecond = await friendRepository.checkRequest(
//       respondent,
//       requester
//     );
//     //    console.log(checkOriginalRequsetFirst,checkOriginalRequestSecond)
//     if (checkOriginalRequsetFirst) {
//       //요청자와 요청 대상자가 일치하는 신청이 존재
//       console.log("해당 요청은 존재합니다 - 1.");
//       const message: string = "해당 요청은 존재합니다. - 1 ";
//       throw new Error(message);
//     } else if (checkOriginalRequestSecond) {
//       //요청 대상자가 요청자에게 요청한 신청이 존재
//       console.log(checkOriginalRequestSecond);
//       console.log("해당 요청은 존재합니다 - 2.");
//       const message: string = "해당 요청은 존재합니다. - 2 ";
//       throw new Error(message);
//     } else {
//       const makeNewRequest: LooseObject =
//         await friendRepository.makeRequestOnDB(requester, respondent);
//       makeNewRequest.message = "신청 성공";
//       const respondentData = await nameCheck(makeNewRequest.respondent);
//       makeNewRequest.respondentName = respondentData?.name;
//       const requesterData = await nameCheck(makeNewRequest.requester);
//       makeNewRequest.requesterName = requesterData?.name;
//       console.log("\x1b[46m추가 목록 생성 \x1b[0m : ", makeNewRequest);
//       return makeNewRequest;
//     }
//   }

//   static async acceptRequest(requsetId: string, currentUser: string) {
//     console.log("friendService - accept");
//     const findRequest = await friendRepository.checkRequestById(requsetId);
//     if (!findRequest) {
//       const message: string = "해당 요청은 존재하지 않습니다";
//       throw new Error(message);
//     } else {
//       if (currentUser != findRequest.respondent) {
//         const message: string = "권한이 없습니다.";
//         throw new Error(message);
//       } else {
//         console.log("유저 확인 완료");
//         if (findRequest.relationship != 0) {
//           //이미 승인 됬거나, 거절된것들 => 처리가 끝난것들
//           //거절된거 재 신청 여부를 논의 후에 가능이면 거절시 데이터 삭제, 불가능이면 그냥 삭제로 둬야 할 듯
//           const message: string = "이미 처리된 요청입니다";
//           throw new Error(message);
//         } else {
//           await friendRepository.makeFriend(
//             findRequest.requester,
//             findRequest.respondent
//           );
//           //if문으로 거를까 하다가 위에서 에러가 발생하면 밑에까지 오지 않기 때문에 데이터가 바뀌지 않을 것이라고 예상
//           const changeReqFinish: LooseObject =
//             await friendRepository.changeRequest(requsetId, 1);
//           changeReqFinish.message = "승인 성공";
//           const respondentData = await nameCheck(changeReqFinish.respondent);
//           changeReqFinish.respondentName = respondentData?.name;
//           const requesterData = await nameCheck(changeReqFinish.requester);
//           changeReqFinish.requesterName = requesterData?.name;
//           return changeReqFinish;
//         }
//       }
//     }
//   }

//   static async declineRequest(requsetId: string, currentUser: string) {
//     console.log("friendService - decline");
//     let findRequest = await friendRepository.checkRequestById(requsetId);

//     if (!findRequest) {
//       const message: string = "해당 요청은 존재하지 않습니다";
//       throw new Error(message);
//     } else {
//       if (currentUser != findRequest.respondent) {
//         console.log(findRequest.id);
//         const message: string = "권한이 없습니다.";
//         throw new Error(message);
//       } else {
//         if (findRequest.relationship != 0) {
//           console.log(findRequest.id);
//           //이미 승인 됬거나, 거절된것들 => 처리가 끝난것들
//           //거절된거 재 신청 여부를 논의 후에 가능이면 거절시 데이터 삭제, 불가능이면 그냥 삭제로 둬야 할 듯
//           const result: object = { message: "이미 처리된 요청입니다" };
//           //해당 부분을 에러로 던져도 될지
//           return result;
//         } else {
//           console.log(findRequest.id);
//           console.log("유저 확인 완료");
//           const changeReqFinish: LooseObject =
//             await friendRepository.changeRequest(requsetId, 2);
//           changeReqFinish.message = "거절 성공";
//           const respondentData = await nameCheck(changeReqFinish.respondent);
//           changeReqFinish.respondentName = respondentData?.name;
//           const requesterData = await nameCheck(changeReqFinish.requester);
//           changeReqFinish.requesterName = requesterData?.name;
//           return changeReqFinish;
//         }
//       }
//     }
//   }
//   static async checkRequest(targetUser: string, currentUser: string) {
//     console.log("Service - Check");
//     console.log(targetUser, " - targetUser", currentUser, " - currentUser");
//     let findRequest = await friendRepository.checkRequest(
//       currentUser,
//       targetUser
//     );
//     console.log(findRequest);
//     if (!findRequest) {
//       let reverseFindrequest = await friendRepository.checkRequest(
//         targetUser,
//         currentUser
//       );
//       if (!reverseFindrequest) {
//         return { message: "친구 신청 없음" };
//       } else if (reverseFindrequest["relationship"] == 0) {
//         return { message: "친구 신청 수락 여부 대기중" };
//       } else if (reverseFindrequest["relationship"] == 1) {
//         return { message: "친구 신청 수락됨" };
//       } else if (reverseFindrequest["relationship"] == 2) {
//         return { message: "친구 신청 거절됨" };
//       } else if (reverseFindrequest["relationship"] == 3) {
//         return { message: "친구 신청 취소됨" };
//       }
//     } else if (findRequest["relationship"] == 0) {
//       return { message: "친구 신청 대기중" };
//     } else if (findRequest["relationship"] == 1) {
//       return { message: "친구 신청 수락됨" };
//     } else if (findRequest["relationship"] == 2) {
//       return { message: "친구 신청 거절됨" };
//     } else if (findRequest["relationship"] == 3) {
//       return { message: "친구 신청 취소됨" };
//     }
//   }

//   static async readAllRequest(currentUser: string) {
//     console.log("service - read Request");
//     let result: Array<standByFriend> = [];
//     const waitRequest: LooseObject = await friendRepository.readWaitResponse(
//       currentUser
//     );
//     const acceptRequest: LooseObject = await friendRepository.readAcceptRequest(
//       currentUser
//     );
//     for (let key in waitRequest) {
//       const respondentData = await nameCheck(waitRequest[key].respondent);
//       waitRequest[key].respondentName = respondentData?.name;
//       const requesterData = await nameCheck(waitRequest[key].requester);
//       waitRequest[key].requesterName = requesterData?.name;
//       result.push(waitRequest[key]);
//     }
//     for (let key in acceptRequest) {
//       const respondentData = await nameCheck(acceptRequest[key].respondent);
//       acceptRequest[key].respondentName = respondentData?.name;
//       const requesterData = await nameCheck(acceptRequest[key].requester);
//       acceptRequest[key].requesterName = requesterData?.name;
//       result.push(acceptRequest[key]);
//     }
//     // result = [waitRequest, acceptRequest];
//     console.log(typeof result);
//     console.log(result);
//     // console.log(result)
//     result = result.sort(
//       (one, two) => one.createAt.getTime() - two.createAt.getTime()
//     );

//     return result;
//   }

//   static async findAllFriend(currentUser: string) {
//     console.log("service - find All Friend");
//     let result: LooseObject = await friendRepository.findFriend(currentUser);
//     for (let key in result) {
//       const friendData = await nameCheck(result[key].friendId);
//       result[key].friendName = friendData?.name;
//     }
//     return result;
//   }

//   static async findOneFriend(currentUser: string, otherUser: string) {
//     console.log("service - findOneFriend");
//     const result: LooseObject = await friendRepository.findOneFriend(
//       currentUser,
//       otherUser
//     );
//     return result;
//   }

//   static async deleteFriend(
//     currentUser: string,
//     otherUser: string,
//     existId: string
//   ) {
//     console.log("service - delete Friend");

//     let result: Array<friend> = [];
//     const firstFriend = await friendRepository.deleteFriend(existId);
//     result.push(firstFriend);
//     const otherFriend = await friendRepository.findOneFriend(
//       otherUser,
//       currentUser
//     );
//     console.log(otherFriend[0].id);
//     const secondFriend = await friendRepository.deleteFriend(otherFriend[0].id);
//     result.push(secondFriend);
//     console.log(result);
//     console.log("신청 값도 바꾸기");
//     let request = await friendRepository.checkRequest(currentUser, otherUser);
//     if (!request) {
//       request = await friendRepository.checkRequest(otherUser, currentUser);
//     }
//     if (request) {
//       console.log(await friendRepository.changeRequest(request.id, 3));
//     } else {
//       console.log("no stand");
//     }

//     console.log(result);
//     return result;
//   }
// }

// export { friendService };
