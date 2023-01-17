declare class emotionService {
    static getEmotion(userId: string, startDate: Date, endDate: Date): Promise<{
        percentage: number[];
        emotionResult: {
            emotion: number;
            value: string;
        }[];
    }>;
}
export { emotionService };
