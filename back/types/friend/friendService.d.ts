import { standByFriend, friend } from "@prisma/client";
interface LooseObject {
    [key: string]: any;
}
declare class friendService {
    static sendRequest(requester: string, respondent: string): Promise<LooseObject>;
    static acceptRequest(requsetId: string, currentUser: string): Promise<LooseObject>;
    static declineRequest(requsetId: string, currentUser: string): Promise<object>;
    static checkRequest(targetUser: string, currentUser: string): Promise<{
        message: string;
    } | undefined>;
    static readAllRequest(currentUser: string): Promise<standByFriend[]>;
    static findAllFriend(currentUser: string): Promise<LooseObject>;
    static findOneFriend(currentUser: string, otherUser: string): Promise<LooseObject>;
    static deleteFriend(currentUser: string, otherUser: string, existId: string): Promise<friend[]>;
}
export { friendService };
