import { diaryRepository } from "./diaryRepository";
import { emotion, Scope } from "../utils/Types";
import { diary } from "@prisma/client";
import {
  emotionAnalysis,
  // sentenceSimilarity,
  // sentenceSimilarityUpdate,
} from "../middlewares/axios";
import { encode } from "querystring";
import { nameCheck } from "../middlewares/nameCheck";

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
    const emotion: any = await emotionAnalysis(contentdata);

    // const emotion: emotion = "자신감";
    // 🤖🤖🤖 2. 문장 유사도 모델  🤖🤖🤖
    //디비에서 친구 스코프 조회할 때 쓸 친구 리스트 가져오기
    // const friends = await diaryRepository.getFriendId(userId);
    //디비 접근해서 내림차순 정렬 후 기간 범위 조건걸기
    // const contentList1 = await diaryController.getContentList(friends);
    // const vector = await diaryRepository.recentVecList(userId);
    // const diary0 = await diaryRepository.recentDiaryList(userId);

    // const vectorList = vector.map((x) => x.encode);
    // const inputData = {
    //   input: content,
    //   vector: vectorList,
    // };

    // console.log("🦄🌈axios 연결 테스트", emotion);
    // const sentSimResult = await sentenceSimilarity(inputData);

    // const SimdiaryList = [
    //   diary0[sentSimResult.result[0]],
    //   diary0[sentSimResult.result[1]],
    //   diary0[sentSimResult.result[2]],
    // ];

    const postingDiary: diary = await diaryRepository.post(
      userId,
      data,
      emotion
    );
    // const postSimList = await diaryRepository.postSimList(
    //   SimdiaryList,
    //   postingDiary
    // );

    // const DiaryReturns = {
    //   currentDiary: postingDiary,
    //   simdiaryList: SimdiaryList,
    // };
    // return SimdiaryList;
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
    const modifyDiary: diary = await diaryRepository.updateDiary(
      newData,
      emotion
      // encode
    );
    return modifyDiary;
  }
  // 내 다이어리
  static async getMyList(userId: string, page: number) {
    const List: any = await diaryRepository.getMyDiary(userId, page);
    const userID: string = List.data[0].userId;
    const user = await nameCheck(userID);
    List["userName"] = user?.name;
    return List;
  }
  // 특정 유저의 다이어리
  static async getUserList(userId: string, page: number, otherName: string) {
    const user: any = await diaryRepository.findByUserName(otherName);
    const friendId = user?.id;
    const isFriend = await diaryRepository.FriendId(userId, friendId);
    const userInfo = await nameCheck(friendId);
    const userName = userInfo?.name;

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
  }

  // 특정 유저 다이어리 비회원
  static async getnonUserList(page: number, otherUserName: string) {
    const otherUser = await diaryRepository.findByUserName(otherUserName);
    const otherId: any = otherUser?.id;
    const List: any = await diaryRepository.getAllScope(otherId, page);

    const userID: string = List.data[0]?.userId;
    const user = await nameCheck(userID);

    List["userName"] = user?.name;
    return List;
  }

  //2수정본 . main- 친구만
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

  static async findOne(postId: number) {
    const one: any = await diaryRepository.getDiaryOne(postId);
    const userID: string = one.userId;
    const user = await nameCheck(userID);
    return { userName: user?.name, diary: one };
  }
  //delete
  static async DeleteOne(postId: number) {
    await diaryRepository.deletepost(postId);

    return;
  }

  static async findSim(postId: number) {
    const result = await diaryRepository.findSimData(postId);
    return result;
  }
}

export { diaryService };

// //2. main- 친구만
// static async getMainListFr(scope: string, page: number, userId: string) {
//   // const friendDiaryList: Array<object> = [];
//   const friendIdList = await diaryController.getFriendId(userId);
//   const friendDiaryList: any = [];

//   const test = await Promise.all(
//     friendIdList.map(async (friendId: any) => {
//       const friend: string = friendId.friendId;

//       const List = await diaryController.getMainDiaryFr(scope, page, friend);

//       const a = List[0].diary;
//       friendDiaryList.push(...a);
//       return friendDiaryList;
//     })
//   );
//   const index = test.length;
//   // console.log("service 3", test[index - 1]);

//   //시간순 정렬 아직 안함! 그거 하기
//   return test[index - 1];
// }

// //3. main- friend + all
// static async getMainList(scope: string, page: number, userId: string) {
//   // const friendDiaryList: Array<object> = [];
//   const friendIdList = await diaryController.getFriendId(userId);
//   const friendDiaryList: any = [];

//   const test = await Promise.all(
//     friendIdList.map(async (friendId: any) => {
//       const friend: string = friendId.friendId;

//       const List = await diaryController.getMainDiaryFr(scope, page, friend);

//       const a = List[0].diary;
//       friendDiaryList.push(...a);
//       return friendDiaryList;
//     })
//   );
//   const index = test.length;
//   // console.log("service 3test", test[index - 1]);

//   const List = await diaryController.getMainAll();
//   // console.log("service 3list", List);
//   const a = test[index - 1];
//   const result = [...a, ...List];
//   console.log("service~~~~~~~", result);

//   //시간순 정렬 아직 안함! 그거 하기
//   return result;
// }
