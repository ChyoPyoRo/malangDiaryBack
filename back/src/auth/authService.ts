// import {  user } from "../utils/Modules";
import { JWT_SECRET_KEY } from "../configs/configModules";
import exp from "constants";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { authRepository } from "./authRepository";
import { user } from "@prisma/client";
class authService {
  static async signUp(email: string, password: string, name: string) {
    // email 존재여부 확인
    const user = await authRepository.findByEmail(email);

    if (user[0]) {
      if (user[0].withdrawal === 0) {
        const errorMessage: string = "Email already exists.";
        throw new Error(errorMessage);
      }
    }

    const hashpassword: string = await bcrypt.hash(password, 10);
    const newUser = await authRepository.signUpUser(email, name, hashpassword);

    return newUser;
  }

  static async login(email: string, password: string) {
    const userList = await authRepository.findByEmail(email);
    const user: user = userList[0];
    //1.  아에 디비에 존재하지 않는경우
    if (!user) {
      const errorMessage: string = "This email doesn't exist";
      throw new Error(errorMessage);
    }

    //2. 가장 최근 계정이 탈퇴된 상태인 경우
    if (user.withdrawal === 1) {
      const errorMessage: string = "a withdrawn member";
      throw new Error(errorMessage);
    }

    const hashpw: string = user.password;
    const isCorrect = await bcrypt.compare(password, hashpw);
    //3. 비밀번호 일치여부 점검
    if (!isCorrect) {
      const errorMessage: string = "Password doesn't match.";
      throw new Error(errorMessage);
    }

    // token 발급
    const userId = user.id;
    const accesstoken: string = jwt.sign({ userId: userId }, JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    const loginData = { user, accesstoken };
    return { user, accesstoken };
  }

  static async getCurrentUser(userId: number) {
    const data: user | null = await authRepository.findByUserId(userId);
    return data;
  }

  static async editPW(userId: number, password: string, newPassword: string) {
    //🟪 user type으로 가면 비밀번호가 계속 null이라서 bcrypt에 사용이 안된다.
    const user: any = await authRepository.findByUserId(userId);
    let isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      const errorMessage: string = "Password doesn't match.";
      throw new Error(errorMessage);
    }
    isCorrect = await bcrypt.compare(newPassword, user.password);

    if (isCorrect) {
      const errorMessage: string =
        "Existing passwords cannot be set to new passwords.";
      throw new Error(errorMessage);
    }
    const hashPW: string = await bcrypt.hash(newPassword, 10);
    const editData = await authRepository.updateUserPW(userId, hashPW);
    return editData;
  }

  static async getUserList(name: string) {
    const userList = await authRepository.getUserList(name);
    return userList;
  }

  static async getUserProfile(name: string) {
    const profile = await authRepository.findByUserName(name);
    return profile;
  }

  static async editDescription(userId: number, description: string) {
    const editData: user = await authRepository.updateUserDescription(
      userId,
      description
    );
    return editData;
  }

  static async editname(userId: number, name: string) {
    const editData: user = await authRepository.updateUserName(userId, name);
    return editData;
  }

  static async editemotion(userId: number, emotion: string) {
    const editData: user = await authRepository.updateUserEmotion(
      userId,
      emotion
    );
    return editData;
  }
  static async editWithdrawal(userId: number) {
    const editData: user = await authRepository.updateWithdrawal(userId);
    return editData;
  }

  static async findByEmail(email: string) {
    const user = await authRepository.findByEmail(email);
    if (user[0]) {
      if (user[0].withdrawal === 0) {
        const errorMessage: string = "Email already exists.";
        throw new Error(errorMessage);
      }
    }
    return;
  }

  static async emailAuthSave(email: string, CertiNumber: number) {
    await authRepository.emailAuthSave(email, CertiNumber);
  }

  static async emailConfirm(email: string, CertiNumber: number) {
    const confirm = await authRepository.findCertiNumber(email, CertiNumber);
    if (!confirm) {
      //인증번호가 일치하지 않음
      const errorMessage: string = "인증번호가 일치하지 않습니다.";
      throw new Error(errorMessage);
    }
    return;
  }
}

export { authService };
