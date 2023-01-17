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
exports.emotionService = void 0;
const emotionController_1 = require("./emotionController");
class emotionService {
    static getEmotion(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const emotionResult = yield Promise.all(emotionType.map((emotion) => emotionController_1.emotionController.getEmotions(userId, Startdate, Enddate, emotion)));
            const percentList = emotionResult.map((x) => x.emotion);
            const total = percentList.reduce((a, b) => a + b);
            const percent = percentList.map((x) => (x / total) * 100);
            console.log("total?", total);
            const res = {
                percentage: percent,
                emotionResult,
            };
            console.log("res", res);
            return res;
        });
    }
}
exports.emotionService = emotionService;
//# sourceMappingURL=emotionService.js.map