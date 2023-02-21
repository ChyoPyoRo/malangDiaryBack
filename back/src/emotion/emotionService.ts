import { emotionRepository } from "./emotionRepository";

class emotionService {
  static async getEmotion(userId: number, startDate: Date, endDate: Date) {
    const Startdate = new Date(startDate);
    const Enddate = new Date(endDate);
    const emotionType = [
      "신이 난",
      "편안한",
      "감사한",
      "자신감",
      "불안",
      "슬픔",
      "분노",
      "상처",
    ];
    const emotionResult = await Promise.all(
      emotionType.map((emotion) =>
        emotionRepository.getEmotions(userId, Startdate, Enddate, emotion)
      )
    );
    console.log("emotionResult", emotionResult);

    const percentList = emotionResult.map((x) => x!.emotion);
    const total = percentList.reduce((a, b) => a + b);
    const percent = percentList.map((x) => (x / total) * 100);
    console.log("total?", total);
    const res = {
      percentage: percent,
      emotionResult,
    };
    console.log("res", res);
    return res;
  }
}

export { emotionService };
