import { emotion } from "../utils/Types";
declare class diaryController {
    static post(userId: string, data: any, emotion: emotion, encode: string): Promise<import(".prisma/client").diary>;
    static updateDiary(newData: any, emotion: emotion, encode: string): Promise<import(".prisma/client").diary>;
    static updateUserEmotion(userId: string, emotion: string): Promise<import(".prisma/client").user>;
    static getMyDiary(userId: string, page: number): Promise<{
        data: import(".prisma/client").diary[];
        count: number;
    }>;
    static getFriendId(userId: string): Promise<{
        friendId: string;
    }[]>;
    static FriendId(userId: string, friendId: string): Promise<import(".prisma/client").friend[]>;
    static getFriendScope(otherId: string, page: number): Promise<{
        data: import(".prisma/client").diary[];
        count: number;
    }>;
    static getAllScope(otherId: string, page: number): Promise<{
        data: import(".prisma/client").diary[];
        count: number;
    }>;
    static getMainDiaryFr(page: number, friendId: any): Promise<import(".prisma/client").diary[]>;
    static getMainFr(friendId: any): Promise<import(".prisma/client").diary[]>;
    static getMainAll(): Promise<import(".prisma/client").diary[]>;
    static getMainDiaryAll(page: number): Promise<import(".prisma/client").diary[]>;
    static deletepost(postId: number): Promise<import(".prisma/client").diary>;
    static getContentList(friends: object): Promise<import(".prisma/client").diary[]>;
    static recentVecList(userId: string): Promise<{
        encode: string | null;
    }[]>;
    static recentDiaryList(userId: string): Promise<import(".prisma/client").diary[]>;
    static getDiaryOne(postId: number): Promise<import(".prisma/client").diary | null>;
    static findByUserName(name: string): Promise<import(".prisma/client").user | null>;
}
export { diaryController };
