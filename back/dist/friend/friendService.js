"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendService = void 0;
const friendController_1 = require("./friendController");
const nameCheck_1 = require("../middlewares/nameCheck");
class friendService {
    static sendRequest(requester, respondent) {
        return __awaiter(this, void 0, void 0, function* () {
            //요청 유저, 대상유저 필요
            //기존 요청 존재여부 확인, 역으로 신청한 경우도 확인
            //리팩토링 할 때 요청자와 대상자 중복 여부도 확인하기
            let checkOriginalRequsetFirst = yield friendController_1.friendController.checkRequest(requester, respondent);
            let checkOriginalRequestSecond = yield friendController_1.friendController.checkRequest(respondent, requester);
            //    console.log(checkOriginalRequsetFirst,checkOriginalRequestSecond)
            if (checkOriginalRequsetFirst) {
                //요청자와 요청 대상자가 일치하는 신청이 존재
                console.log("해당 요청은 존재합니다 - 1.");
                const message = "해당 요청은 존재합니다. - 1 ";
                throw new Error(message);
            }
            else if (checkOriginalRequestSecond) {
                //요청 대상자가 요청자에게 요청한 신청이 존재
                console.log(checkOriginalRequestSecond);
                console.log("해당 요청은 존재합니다 - 2.");
                const message = "해당 요청은 존재합니다. - 2 ";
                throw new Error(message);
            }
            else {
                const makeNewRequest = yield friendController_1.friendController.makeRequestOnDB(requester, respondent);
                makeNewRequest.message = "신청 성공";
                const respondentData = yield (0, nameCheck_1.nameCheck)(makeNewRequest.respondent);
                makeNewRequest.respondentName = respondentData === null || respondentData === void 0 ? void 0 : respondentData.name;
                const requesterData = yield (0, nameCheck_1.nameCheck)(makeNewRequest.requester);
                makeNewRequest.requesterName = requesterData === null || requesterData === void 0 ? void 0 : requesterData.name;
                console.log("\x1b[46m추가 목록 생성 \x1b[0m : ", makeNewRequest);
                return makeNewRequest;
            }
        });
    }
    static acceptRequest(requsetId, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("friendService - accept");
            const findRequest = yield friendController_1.friendController.checkRequestById(requsetId);
            if (!findRequest) {
                const message = "해당 요청은 존재하지 않습니다";
                throw new Error(message);
            }
            else {
                if (currentUser != findRequest.respondent) {
                    const message = "권한이 없습니다.";
                    throw new Error(message);
                }
                else {
                    console.log("유저 확인 완료");
                    if (findRequest.relationship != 0) {
                        //이미 승인 됬거나, 거절된것들 => 처리가 끝난것들
                        //거절된거 재 신청 여부를 논의 후에 가능이면 거절시 데이터 삭제, 불가능이면 그냥 삭제로 둬야 할 듯
                        const message = "이미 처리된 요청입니다";
                        throw new Error(message);
                    }
                    else {
                        yield friendController_1.friendController.makeFriend(findRequest.requester, findRequest.respondent);
                        //if문으로 거를까 하다가 위에서 에러가 발생하면 밑에까지 오지 않기 때문에 데이터가 바뀌지 않을 것이라고 예상
                        const changeReqFinish = yield friendController_1.friendController.changeRequest(requsetId, 1);
                        changeReqFinish.message = "승인 성공";
                        const respondentData = yield (0, nameCheck_1.nameCheck)(changeReqFinish.respondent);
                        changeReqFinish.respondentName = respondentData === null || respondentData === void 0 ? void 0 : respondentData.name;
                        const requesterData = yield (0, nameCheck_1.nameCheck)(changeReqFinish.requester);
                        changeReqFinish.requesterName = requesterData === null || requesterData === void 0 ? void 0 : requesterData.name;
                        return changeReqFinish;
                    }
                }
            }
        });
    }
    static declineRequest(requsetId, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("friendService - decline");
            let findRequest = yield friendController_1.friendController.checkRequestById(requsetId);
            if (!findRequest) {
                const message = "해당 요청은 존재하지 않습니다";
                throw new Error(message);
            }
            else {
                if (currentUser != findRequest.respondent) {
                    console.log(findRequest.id);
                    const message = "권한이 없습니다.";
                    throw new Error(message);
                }
                else {
                    if (findRequest.relationship != 0) {
                        console.log(findRequest.id);
                        //이미 승인 됬거나, 거절된것들 => 처리가 끝난것들
                        //거절된거 재 신청 여부를 논의 후에 가능이면 거절시 데이터 삭제, 불가능이면 그냥 삭제로 둬야 할 듯
                        const result = { message: "이미 처리된 요청입니다" };
                        //해당 부분을 에러로 던져도 될지
                        return result;
                    }
                    else {
                        console.log(findRequest.id);
                        console.log("유저 확인 완료");
                        const changeReqFinish = yield friendController_1.friendController.changeRequest(requsetId, 2);
                        changeReqFinish.message = "거절 성공";
                        const respondentData = yield (0, nameCheck_1.nameCheck)(changeReqFinish.respondent);
                        changeReqFinish.respondentName = respondentData === null || respondentData === void 0 ? void 0 : respondentData.name;
                        const requesterData = yield (0, nameCheck_1.nameCheck)(changeReqFinish.requester);
                        changeReqFinish.requesterName = requesterData === null || requesterData === void 0 ? void 0 : requesterData.name;
                        return changeReqFinish;
                    }
                }
            }
        });
    }
    static checkRequest(targetUser, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Service - Check");
            console.log(targetUser, " - targetUser", currentUser, " - currentUser");
            let findRequest = yield friendController_1.friendController.checkRequest(currentUser, targetUser);
            console.log(findRequest);
            if (!findRequest) {
                let reverseFindrequest = yield friendController_1.friendController.checkRequest(targetUser, currentUser);
                if (!reverseFindrequest) {
                    return { message: "친구 신청 없음" };
                }
                else if (reverseFindrequest["relationship"] == 0) {
                    return { message: "친구 신청 수락 여부 대기중" };
                }
                else if (reverseFindrequest["relationship"] == 1) {
                    return { message: "친구 신청 수락됨" };
                }
                else if (reverseFindrequest["relationship"] == 2) {
                    return { message: "친구 신청 거절됨" };
                }
                else if (reverseFindrequest["relationship"] == 3) {
                    return { message: "친구 신청 취소됨" };
                }
            }
            else if (findRequest["relationship"] == 0) {
                return { message: "친구 신청 대기중" };
            }
            else if (findRequest["relationship"] == 1) {
                return { message: "친구 신청 수락됨" };
            }
            else if (findRequest["relationship"] == 2) {
                return { message: "친구 신청 거절됨" };
            }
            else if (findRequest["relationship"] == 3) {
                return { message: "친구 신청 취소됨" };
            }
        });
    }
    static readAllRequest(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("service - read Request");
            let result = [];
            const waitRequest = yield friendController_1.friendController.readWaitResponse(currentUser);
            const acceptRequest = yield friendController_1.friendController.readAcceptRequest(currentUser);
            for (let key in waitRequest) {
                const respondentData = yield (0, nameCheck_1.nameCheck)(waitRequest[key].respondent);
                waitRequest[key].respondentName = respondentData === null || respondentData === void 0 ? void 0 : respondentData.name;
                const requesterData = yield (0, nameCheck_1.nameCheck)(waitRequest[key].requester);
                waitRequest[key].requesterName = requesterData === null || requesterData === void 0 ? void 0 : requesterData.name;
                result.push(waitRequest[key]);
            }
            for (let key in acceptRequest) {
                const respondentData = yield (0, nameCheck_1.nameCheck)(acceptRequest[key].respondent);
                acceptRequest[key].respondentName = respondentData === null || respondentData === void 0 ? void 0 : respondentData.name;
                const requesterData = yield (0, nameCheck_1.nameCheck)(acceptRequest[key].requester);
                acceptRequest[key].requesterName = requesterData === null || requesterData === void 0 ? void 0 : requesterData.name;
                result.push(acceptRequest[key]);
            }
            // result = [waitRequest, acceptRequest];
            console.log(typeof result);
            console.log(result);
            // console.log(result)
            result = result.sort((one, two) => one.createAt.getTime() - two.createAt.getTime());
            return result;
        });
    }
    static findAllFriend(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("service - find All Friend");
            let result = yield friendController_1.friendController.findFriend(currentUser);
            for (let key in result) {
                const friendData = yield (0, nameCheck_1.nameCheck)(result[key].friendId);
                result[key].friendName = friendData === null || friendData === void 0 ? void 0 : friendData.name;
            }
            return result;
        });
    }
    static findOneFriend(currentUser, otherUser) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('service - findOneFriend');
            const result = yield friendController_1.friendController.findOneFriend(currentUser, otherUser);
            return result;
        });
    }
    static deleteFriend(currentUser, otherUser, existId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('service - delete Friend');
            let result = [];
            const firstFriend = yield friendController_1.friendController.deleteFriend(existId);
            result.push(firstFriend);
            const otherFriend = yield friendController_1.friendController.findOneFriend(otherUser, currentUser);
            console.log(otherFriend[0].id);
            const secondFriend = yield friendController_1.friendController.deleteFriend(otherFriend[0].id);
            result.push(secondFriend);
            console.log(result);
            console.log('신청 값도 바꾸기');
            let request = yield friendController_1.friendController.checkRequest(currentUser, otherUser);
            if (!request) {
                request = yield friendController_1.friendController.checkRequest(otherUser, currentUser);
            }
            if (request) {
                console.log(yield friendController_1.friendController.changeRequest(request.id, 3));
            }
            else {
                console.log('no stand');
            }
            console.log(result);
            return result;
        });
    }
}
exports.friendService = friendService;
//# sourceMappingURL=friendService.js.map