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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
// import {  user } from "../utils/Modules";
const configModules_1 = require("../configs/configModules");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authController_1 = require("./authController");
class authService {
    static signUp(email, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            // email 존재여부 확인
            const user = yield authController_1.authController.findByEmail(email);
            if (user[0]) {
                if (user[0].withdrawal === 0) {
                    const errorMessage = "Email already exists.";
                    throw new Error(errorMessage);
                }
            }
            const hashpassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = yield authController_1.authController.signUpUser(email, name, hashpassword);
            return newUser;
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userList = yield authController_1.authController.findByEmail(email);
            const user = userList[0];
            //1.  아에 디비에 존재하지 않는경우
            if (!user) {
                const errorMessage = "This email doesn't exist";
                throw new Error(errorMessage);
            }
            //2. 가장 최근 계정이 탈퇴된 상태인 경우
            if (user.withdrawal === 1) {
                const errorMessage = "a withdrawn member";
                throw new Error(errorMessage);
            }
            const hashpw = user.password;
            const isCorrect = yield bcrypt_1.default.compare(password, hashpw);
            //3. 비밀번호 일치여부 점검
            if (!isCorrect) {
                const errorMessage = "Password doesn't match.";
                throw new Error(errorMessage);
            }
            // token 발급
            const userId = user.id;
            const accesstoken = jsonwebtoken_1.default.sign({ userId: userId }, configModules_1.JWT_SECRET_KEY, {
                expiresIn: "30d",
            });
            const loginData = { user, accesstoken };
            return { user, accesstoken };
        });
    }
    static getCurrentUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield authController_1.authController.findByUserId(userId);
            return data;
        });
    }
    static editPW(userId, password, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            //🟪 user type으로 가면 비밀번호가 계속 null이라서 bcrypt에 사용이 안된다.
            const user = yield authController_1.authController.findByUserId(userId);
            let isCorrect = yield bcrypt_1.default.compare(password, user.password);
            if (!isCorrect) {
                const errorMessage = "Password doesn't match.";
                throw new Error(errorMessage);
            }
            isCorrect = yield bcrypt_1.default.compare(newPassword, user.password);
            if (isCorrect) {
                const errorMessage = "Existing passwords cannot be set to new passwords.";
                throw new Error(errorMessage);
            }
            const hashPW = yield bcrypt_1.default.hash(newPassword, 10);
            const editData = yield authController_1.authController.updateUserPW(userId, hashPW);
            return editData;
        });
    }
    static getUserList(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const userList = yield authController_1.authController.getUserList(name);
            return userList;
        });
    }
    static getUserProfile(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield authController_1.authController.findByUserName(name);
            return profile;
        });
    }
    static editDescription(userId, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const editData = yield authController_1.authController.updateUserDescription(userId, description);
            return editData;
        });
    }
    static editname(userId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const editData = yield authController_1.authController.updateUserName(userId, name);
            return editData;
        });
    }
    static editemotion(userId, emotion) {
        return __awaiter(this, void 0, void 0, function* () {
            const editData = yield authController_1.authController.updateUserEmotion(userId, emotion);
            return editData;
        });
    }
    static editWithdrawal(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const editData = yield authController_1.authController.updateWithdrawal(userId);
            return editData;
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield authController_1.authController.findByEmail(email);
            if (user[0]) {
                if (user[0].withdrawal === 0) {
                    const errorMessage = "Email already exists.";
                    throw new Error(errorMessage);
                }
            }
            return;
        });
    }
    static emailAuthSave(email, CertiNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            yield authController_1.authController.emailAuthSave(email, CertiNumber);
        });
    }
    static emailConfirm(email, CertiNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirm = yield authController_1.authController.findCertiNumber(email, CertiNumber);
            if (!confirm) {
                //인증번호가 일치하지 않음
                const errorMessage = "인증번호가 일치하지 않습니다.";
                throw new Error(errorMessage);
            }
            return;
        });
    }
}
exports.authService = authService;
//# sourceMappingURL=authService.js.map