"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emotionController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class emotionController {
    static getEmotions(userId, startDate, endDate, emotion) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(userId, startDate, endDate);
            let emotionCount = yield prisma.diary.count({
                where: {
                    userId: userId,
                    emotion: emotion,
                    createAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                select: {
                    emotion: true,
                },
            });
            const result = Object.assign({ value: emotion }, emotionCount);
            return result;
        });
    }
}
exports.emotionController = emotionController;
/* 1차 배포 
Positive
Negative

긍정
부정
*/


/*
Excited
Comfort
Confidence
thanks
Sadness
Anger
Anxiety
hurt

  | "신이 난"
  | "편안한"
  | "감사한"
  | "자신감"
  | "불안"
  | "슬픔"
  | "분노"
  | "상처";
  */
//# sourceMappingURL=emotionController.js.map