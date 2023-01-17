import { diary } from "@prisma/client";
declare class diaryService {
    static postingDiary(userId: string, data: any): Promise<{
        currentDiary: diary;
        simdiaryList: diary[];
    }>;
    static modifyDiary(userId: string, newData: any): Promise<diary>;
    static getMyList(userId: string, page: number): Promise<any>;
    static getUserList(userId: string, page: number, otherName: string): Promise<any>;
    static getnonUserList(page: number, otherUserName: string): Promise<any>;
    static getMainListFr(page: number, userId: string): Promise<{
        data: diary[];
        userName: (string | undefined)[];
    }>;
    static getMainList(page: number, userId: string): Promise<{
        data: diary[];
        userName: (string | undefined)[];
    }>;
    static getMainListAll(page: number): Promise<{
        data: diary[];
        userName: (string | undefined)[];
    }>;
    static findOne(postId: number): Promise<{
        userName: string | undefined;
        diary: any;
    }>;
    static DeleteOne(postId: number): Promise<void>;
}
export { diaryService };
