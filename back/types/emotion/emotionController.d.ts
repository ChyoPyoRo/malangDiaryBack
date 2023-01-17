declare class emotionController {
    static getEmotions(userId: string, startDate: Date, endDate: Date, emotion: string): Promise<{
        emotion: number;
        value: string;
    }>;
}
export { emotionController };
