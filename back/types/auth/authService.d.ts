import { user } from "@prisma/client";
declare class authService {
    static signUp(email: string, password: string, name: string): Promise<user & {
        diary: import(".prisma/client").diary[];
        friend: import(".prisma/client").friend[];
        refreshToken: import(".prisma/client").refreshToken[];
    }>;
    static login(email: string, password: string): Promise<{
        user: user;
        accesstoken: string;
    }>;
    static getCurrentUser(userId: string): Promise<user | null>;
    static editPW(userId: string, password: string, newPassword: string): Promise<user>;
    static getUserList(name: string): Promise<user[]>;
    static getUserProfile(name: string): Promise<user | null>;
    static editDescription(userId: string, description: string): Promise<user>;
    static editname(userId: string, name: string): Promise<user>;
    static editemotion(userId: string, emotion: string): Promise<user>;
    static editWithdrawal(userId: string): Promise<user>;
    static findByEmail(email: string): Promise<void>;
    static emailAuthSave(email: string, CertiNumber: number): Promise<void>;
    static emailConfirm(email: string, CertiNumber: number): Promise<void>;
}
export { authService };
