declare class authController {
    static signUpUser(email: string, name: string, hashpassword: string): Promise<import(".prisma/client").user & {
        diary: import(".prisma/client").diary[];
        friend: import(".prisma/client").friend[];
        refreshToken: import(".prisma/client").refreshToken[];
    }>;
    static findByEmail(email: string): Promise<import(".prisma/client").user[]>;
    static findByUserId(userId: string): Promise<import(".prisma/client").user | null>;
    static getUserList(name: string): Promise<import(".prisma/client").user[]>;
    static findByUserName(name: string): Promise<import(".prisma/client").user | null>;
    static updateUserPW(userId: string, hashPW: string): Promise<import(".prisma/client").user>;
    static updateUserName(userId: string, name: string): Promise<import(".prisma/client").user>;
    static updateUserDescription(userId: string, description: string): Promise<import(".prisma/client").user>;
    static updateUserEmotion(userId: string, emotion: string): Promise<import(".prisma/client").user>;
    static updateWithdrawal(userId: string): Promise<import(".prisma/client").user>;
    static emailAuthSave(email: string, CertiNumber: number): Promise<void>;
    static findCertiNumber(email: string, CertiNumber: number): Promise<import(".prisma/client").emailAuthentication | null>;
}
export { authController };
