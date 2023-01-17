declare class friendController {
    static makeRequestOnDB(requester: string, respondent: string): Promise<import(".prisma/client").standByFriend>;
    static checkRequest(requester: string, respondent: string): Promise<import(".prisma/client").standByFriend | null>;
    static checkRequestById(id: string): Promise<import(".prisma/client").standByFriend | null>;
    static changeRequest(id: string, relationship: number): Promise<import(".prisma/client").standByFriend>;
    static makeFriend(requester: string, respondent: string): Promise<number>;
    static readWaitResponse(respondent: string): Promise<import(".prisma/client").standByFriend[]>;
    static readAcceptRequest(requester: string): Promise<import(".prisma/client").standByFriend[]>;
    static findFriend(userId: string): Promise<import(".prisma/client").friend[]>;
    static findOneFriend(userId: string, friendId: string): Promise<import(".prisma/client").friend[]>;
    static deleteFriend(id: string): Promise<import(".prisma/client").friend>;
}
export { friendController };
