import { diaryRepository } from "./diaryRepository";
import { Diary, user } from "@prisma/client";
import {
  emotionAnalysis,
  // sentenceSimilarity,
  // sentenceSimilarityUpdate,
} from "../middlewares/axios";
import { encode } from "querystring";
import { nameCheck } from "../middlewares/nameCheck";
import { emotion, emotionType } from "../utils/Types";
import { diary, diaryInterface } from "./interface/diaryInterface";

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
    // const emotion: any = await emotionAnalysis(contentdata);
    const emotion: emotionType = "편안한";

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
  static async getMyList(userId: string, page: number) {
    const List: any = await diaryRepository.getMyDiary(userId, page);
    const userID: number = List.data[0].userId;
    const user = await nameCheck(userID);
    List["userName"] = user?.name;
    return List;
  }

  //   //   FIXME: 친구 관련 🟢 -  조회
  //   // 특정 유저의 다이어리
  static async getUserList(userId: string, page: number, otherName: string) {
    const user: any = await diaryRepository.findByUserName(otherName);
    const friendId = user?.id;
    const isFriend = await diaryRepository.FriendId(userId, friendId);
    const userInfo = await nameCheck(friendId);
    const userName = userInfo?.name;
    console.log("isFriend?? 왜 넘어갈까ㅣ???", isFriend);

    //친구가 있으면 getFriendScope controller
    if (isFriend[0]) {
      const friendScope: any = await diaryRepository.getFriendScope(
        friendId,
        page
      );
      friendScope["userName"] = userName;

      return friendScope;
    }

    const List: any = await diaryRepository.getAllScope(friendId, page);
    List["userName"] = userName;
    return List;
  } //   TODO: 친구 관련 🟢 -  조회

  // 특정 유저 다이어리 비회원
  static async getnonUserList(page: number, otherUserName: string) {
    const otherUser = await diaryRepository.findByUserName(otherUserName);
    const otherId: any = otherUser?.id;
    const List: any = await diaryRepository.getAllScope(otherId, page);

    const userID: number = List.data[0]?.userId;
    const user = await nameCheck(userID);

    List["userName"] = user?.name;
    return List;
  }

  //   FIXME:: 친구 관련 🟢
  //   //2수정본 . main- 친구만
  static async getMainListFr(page: number, userId: string) {
    const friendIdList = await diaryRepository.getFriendId(userId);
    const friendId = friendIdList.map((x) => x.friendId);
    const List = await diaryRepository.getMainDiaryFr(page, friendId);
    const user = await Promise.all(List.map((x) => nameCheck(x.userId)));
    const userName = user.map((x) => x?.name);

    const result = { data: List, userName: userName };
    return result;
  }
  //메인 (all+friend 수정본)
  static async getMainList(page: number, userId: string) {
    const friendIdList = await diaryRepository.getFriendId(userId);
    const friendId = friendIdList.map((x) => x.friendId);

    let LoginUsermain = [];
    const FriendList = await diaryRepository.getMainFr(friendId);
    const AllList = await diaryRepository.getMainAll();

    LoginUsermain = [...FriendList, ...AllList];

    const LoginUsermainSort = LoginUsermain.sort(
      (one, two) => two.createAt.getTime() - one.createAt.getTime()
    );
    const resultThree = LoginUsermainSort.slice(0, 3);
    const user = await Promise.all(resultThree.map((x) => nameCheck(x.userId)));
    const userName = user.map((x) => x?.name);

    const result = { data: resultThree, userName: userName };

    return result;
  }

  //1
  static async getMainListAll(page: number) {
    const List = await diaryRepository.getMainDiaryAll(page);
    const user = await Promise.all(List.map((x) => nameCheck(x.userId)));
    const userName = user.map((x) => x?.name);
    const result = { data: List, userName: userName };

    return result;
  }
  // TODO: 친구 관련 🟢

  static async findOne(postId: number) {
    const one: any = await diaryRepository.getDiaryOne(postId);
    const userID: number = one.userId;
    const user = await nameCheck(userID);
    return { userName: user?.name, diary: one };
  }
  //delete
  // TODO: emotion row도 삭제하기
  static async DeleteOne(postId: number) {
    const data = await diaryRepository.deletepost(postId);

    return data;
  }
}

export { diaryService };

// const emotion: emotion = {
//   Excited: 0,
//   Comfort: 0,
//   Confidence: 0,
//   thanks: 1,
//   Sadness: 0,
//   Anger: 0,
//   Anxiety: 0,
//   hurt: 0,
// };
