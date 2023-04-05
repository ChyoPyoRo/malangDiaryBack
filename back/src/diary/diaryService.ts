import { diaryRepository } from "./diaryRepository";
import { Diary, user } from "@prisma/client";
import {
  emotionAnalysis,
  // sentenceSimilarity,
  // sentenceSimilarityUpdate,
} from "../middlewares/axios";
import { encode } from "querystring";
import { loginIdCheck } from "../middlewares/loginIdCheck";
import { emotion, emotionType } from "../utils/Types";
import {
  diary,
  diaryInterface,
  pageInfo,
  responseObjectForm,
} from "./interface/diaryInterface";

class diaryService {
  static async postingDiary(diaryDTO: diaryInterface) {
    const rawContent = diaryDTO.content;

    // content raw data 추출을 위한 정규화 식
    const content = rawContent?.replace(
      /<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/gi,
      ""
    );
    const contentdata = { content: content };
    // 🤖🤖🤖 1. 감정분석 모델   🤖🤖🤖
    const emotion: any = await emotionAnalysis(contentdata);
    // const emotion: emotionType = "편안한";

    const postingDiary: Diary = await diaryRepository.post(diaryDTO, emotion);

    return postingDiary;
  }

  static async modifyDiary(diaryDTO: Partial<diary>) {
    // 🤖🤖🤖 1. 감정분석 모델   🤖🤖🤖
    // 모델 output 값 = 감정
    const content = diaryDTO.content?.replace(
      /<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/gi,
      ""
    );
    const contentdata = { content: content };
    // const emotion: any = await emotionAnalysis(contentdata);
    const emotionAnalysis: emotionType = "감사한";
    const emotion: emotionType = diaryDTO.emotion
      ? diaryDTO.emotion
      : emotionAnalysis;
    await diaryRepository.updateUserEmotion(diaryDTO, emotion);
    const modifyDiary: Diary = await diaryRepository.updateDiary(
      diaryDTO,
      emotion
    );
    return modifyDiary;
  }

  // 내 다이어리
  static async getMyList(pageDTO: pageInfo) {
    const List: any = await diaryRepository.getMyDiary(pageDTO);
    const userID: string = List.data[0].userId;
    const user = await loginIdCheck(userID);
    List["userName"] = user?.name;
    return List;
  }

  // 특정 유저의 다이어리
  static async getUserList(pageDTO: pageInfo) {
    const user = await diaryRepository.findByUserLodinId(pageDTO);
    pageDTO = {
      ...pageDTO,
      friendId: user?.loginId,
    };
    const isFriend = await diaryRepository.FriendId(pageDTO);

    const userInfo = await loginIdCheck(pageDTO.friendId!);
    const userName = userInfo?.name;

    //친구가 있으면 getFriendScope controller
    if (isFriend[0]) {
      let friendScope: responseObjectForm =
        await diaryRepository.getFriendScope(pageDTO);
      friendScope = { ...friendScope, userName };

      return friendScope;
    }

    let List: responseObjectForm = await diaryRepository.getAllScope(pageDTO);
    List = {
      ...List,
      userName,
    };
    return List;
  }

  // 특정 유저 다이어리 비회원
  static async getnonUserList(pageDTO: pageInfo) {
    const otherUser = await diaryRepository.findByUserLodinId(pageDTO);
    pageDTO = {
      ...pageDTO,
      friendId: otherUser?.loginId,
    };
    let List: responseObjectForm = await diaryRepository.getAllScope(pageDTO);

    const user = await loginIdCheck(List.diary[0]?.writer_id);

    List = {
      ...List,
      userName: user?.name,
    };
    return List;
  }

  //   FIXME:: 친구 관련 🟢
  //   //2수정본 . main- 친구만
  static async getMainListFr(pageDTO: pageInfo) {
    const friendIdList = await diaryRepository.getFriendId(pageDTO);
    const friendId = friendIdList.map((x) => x.friendId);
    const List = await diaryRepository.getMainDiaryFr(pageDTO, friendId);
    const user = await Promise.all(List.map((x) => loginIdCheck(x.writer_id)));
    const userName = user.map((x) => x?.name);

    const result = { data: List, userName: userName };
    return result;
  }

  //메인 (all+friend 수정본)
  static async getMainList(pageDTO: pageInfo) {
    const friendIdList = await diaryRepository.getFriendId(pageDTO);
    const friendId = friendIdList.map((x) => x.friendId);

    let LoginUsermain = [];
    const FriendList = await diaryRepository.getMainFr(friendId);
    const AllList = await diaryRepository.getMainAll();

    LoginUsermain = [...FriendList, ...AllList];

    const LoginUsermainSort = LoginUsermain.sort(
      (one, two) => two.createAt.getTime() - one.createAt.getTime()
    );
    const resultThree = LoginUsermainSort.slice(0, 3);
    const user = await Promise.all(
      resultThree.map((x) => loginIdCheck(x.writer_id))
    );
    const userName = user.map((x) => x?.name);

    const result = { data: resultThree, userName: userName };

    return result;
  }

  // 비회원 mainpage
  static async getMainListAll(page: number) {
    const List = await diaryRepository.getMainDiaryAll(page);
    const user = await Promise.all(List.map((x) => loginIdCheck(x.writer_id)));
    const userName = user.map((x) => x?.name);
    const result = { data: List, userName: userName };

    return result;
  }

  static async findOne(postId: number) {
    const one: any = await diaryRepository.getDiaryOne(postId);
    const userID: string = one.userId;
    const user = await loginIdCheck(userID);
    return { userName: user?.name, diary: one };
  }

  //delete
  // emotion row도 삭제하기 - 보류
  static async DeleteOne(postId: number) {
    const data = await diaryRepository.deletepost(postId);

    return data;
  }
}

export { diaryService };
