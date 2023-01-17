"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRequired = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configModules_1 = require("../configs/configModules");
function loginRequired(req, res, next) {
    const reqToken = req.headers["authorization"];
    const accessToken = reqToken.split(" ")[1];
    if (accessToken) {
        try {
            const secretkey = configModules_1.JWT_SECRET_KEY;
            /*
            //🟪 TODO 여기 jwt 일단 any로 가되, 꼭 형식 고치기
            //🟪 currentUserId도 config파일하고 추가 파일 넣어서 한번 해보기
            
            const jwtDecoded: string|JwtPayload  = Jwt.verify(accessToken, secretkey);
            const verifyJwt = <T>(accessToken: string): T | null => {
              try {
                return Jwt.verify(accessToken, secretkey) as T;
              } catch (e) {
                return null;
              }
            };
            const jwtDecoded = verifyJwt<{ sub: string }>(accessToken);
            console.log(jwtDecoded);
            console.log(jwtDecoded(accessToken));
            */
            const jwtDecoded = jsonwebtoken_1.default.verify(accessToken, secretkey);
            const userId = jwtDecoded.userId;
            req.body["currentUserId"] = userId;
            // console.log("middleware--", userId);
            // currentUserId 타입 정의 조금 더 공부해보기
            next();
        }
        catch (error) {
            next(error);
        }
    }
    else {
        res.status(400).send("Access token is not valid");
    }
}
exports.loginRequired = loginRequired;
//# sourceMappingURL=loginRequired.js.map