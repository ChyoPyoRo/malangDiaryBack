import { diaryRepository } from "./diaryRepository";
import { Diary } from "@prisma/client";
import {
  emotionAnalysis,
  // sentenceSimilarity,
  // sentenceSimilarityUpdate,
} from "../middlewares/axios";
import { encode } from "querystring";
import { nameCheck } from "../middlewares/nameCheck";
import { emotion } from "../utils/Types";

class diaryService {
  static async postingDiary(userId: string, data: any) {
    const rawContent = data.content;
    const content = rawContent.replace(
      /<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/gi,
      ""
    );
    const contentdata = { content: content };
    // 🤖🤖🤖 1. 감정분석 모델   🤖🤖🤖
    //📌 크론잡 비동기 워커- 면접때 좋다(최적화)
    // const emotion: any = await emotionAnalysis(contentdata);

    const emotion: emotion = {
      Excited: 0.1,
      Comfort: 0.2,
      Confidence: 0.01,
      thanks: 0.2,
      Sadness: 0.3,
      Anger: 0.1,
      Anxiety: 0.1,
      hurt: 0.1,
    };

    const postingDiary: Diary = await diaryRepository.post(
      userId,
      data,
      emotion
    );

    return postingDiary;
  }

  static async modifyDiary(userId: string, newData: any) {
    // 🤖🤖🤖 1. 감정분석 모델   🤖🤖🤖
    // 모델 output 값 = 감정
    const content = newData.content.replace(
      /<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/gi,
      ""
    );
    const contentdata = { content: content };
    const emotion: any = await emotionAnalysis(contentdata);
    // const encode = await sentenceSimilarityUpdate(contentdata);
    await diaryRepository.updateUserEmotion(userId, emotion);
    const modifyDiary: Diary = await diaryRepository.updateDiary(
      newData,
      emotion
      // encode
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
  //   static async getUserList(userId: string, page: number, otherName: string) {
  //     const user: any = await diaryRepository.findByUserName(otherName);
  //     const friendId = user?.id;
  //     const isFriend = await diaryRepository.FriendId(userId, friendId);
  //     const userInfo = await nameCheck(friendId);
  //     const userName = userInfo?.name;

  //     //친구가 있으면 getFriendScope controller
  //     if (isFriend[0]) {
  //       const friendScope: any = await diaryRepository.getFriendScope(
  //         friendId,
  //         page
  //       );
  //       friendScope["userName"] = userName;

  //       return friendScope;
  //     }

  //     const List: any = await diaryRepository.getAllScope(friendId, page);
  //     List["userName"] = userName;
  //     return List;
  //   }  //   TODO: 친구 관련 🟢 -  조회

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
  //   static async getMainListFr(page: number, userId: string) {
  //     const friendIdList = await diaryRepository.getFriendId(userId);
  //     const friendId = friendIdList.map((x) => x.friendId);
  //     const List = await diaryRepository.getMainDiaryFr(page, friendId);
  //     const user = await Promise.all(List.map((x) => nameCheck(x.userId)));
  //     const userName = user.map((x) => x?.name);

  //     const result = { data: List, userName: userName };
  //     return result;
  //   }
  //   //메인 (all+friend 수정본)
  //   static async getMainList(page: number, userId: string) {
  //     const friendIdList = await diaryRepository.getFriendId(userId);
  //     const friendId = friendIdList.map((x) => x.friendId);

  //     let LoginUsermain = [];
  //     const FriendList = await diaryRepository.getMainFr(friendId);
  //     const AllList = await diaryRepository.getMainAll();

  //     LoginUsermain = [...FriendList, ...AllList];

  //     const LoginUsermainSort = LoginUsermain.sort(
  //       (one, two) => two.createAt.getTime() - one.createAt.getTime()
  //     );
  //     const resultThree = LoginUsermainSort.slice(0, 3);
  //     const user = await Promise.all(resultThree.map((x) => nameCheck(x.userId)));
  //     const userName = user.map((x) => x?.name);

  //     const result = { data: resultThree, userName: userName };

  //     return result;
  //   }

  //   //1
  //   static async getMainListAll(page: number) {
  //     const List = await diaryRepository.getMainDiaryAll(page);
  //     const user = await Promise.all(List.map((x) => nameCheck(x.userId)));
  //     const userName = user.map((x) => x?.name);
  //     const result = { data: List, userName: userName };

  //     return result;
  //   }
  // TODO: 친구 관련 🟢

  static async findOne(postId: number) {
    const one: any = await diaryRepository.getDiaryOne(postId);
    const userID: number = one.userId;
    const user = await nameCheck(userID);
    return { userName: user?.name, diary: one };
  }
  //delete
  static async DeleteOne(postId: number) {
    await diaryRepository.deletepost(postId);

    return;
  }
}

export { diaryService };
