// import {  user } from "../utils/Modules";
import { JWT_SECRET_KEY } from "../configs/configModules";
import exp from "constants";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { authRepository } from "./authRepository";
import { user } from "@prisma/client";
class authService {
  static async signUp(
    loginId: string,
    email: string,
    password: string,
    name: string,
    gender: string
  ) {
    // email 존재여부 확인 + 나중에 닉네임 중복에도 같은 변수 사용하기 위해서 var 타입으로 선언
    // 메모리 활용을 위해서 인데 진짜 그거인지 확인
    var user = await authRepository.findByEmail(email);

    if (user[0]) {
      if (user[0].withdrawal === 1) {
        const errorMessage: string = "email is already exists.";
        throw new Error(errorMessage);
      }
    }
    // name 확인
    user = await authRepository.findByUserName(name);

    if (user[0]) {
      if (user[0].withdrawal === 1) {
        const errorMessage: string = "nickname is already exists.";
        throw new Error(errorMessage);
      }
    }

    // 아이디 중복 확인 ( unique 값으로 걸러지긴 하는데 1차적으로 한번 더 거름)
    // 위의 2개는 findMany라서 배열의 특성을 가지기 때문에 null 값이 들어갈 수 있는데
    // 아래거는 unique라서 null 값이 안되나
    const loginIdCheck = await authRepository.findByLoginId(loginId);
    if (loginIdCheck) {
      if (loginIdCheck.withdrawal === 1) {
        const errorMessage: string = "id is already exists.";
        throw new Error(errorMessage);
      }
    }

    //로그인용id(loginId), 닉네임, 이메일 중복확인 완료 했으니 bcrypt로 패스워드 암호화 하고 회원가입
    const hashpassword: string = await bcrypt.hash(password, 10);
    const newUser = await authRepository.signUpUser(
      loginId,
      email,
      name,
      hashpassword,
      gender
    );
    return newUser;
  }

  static async login(loginId: string, password: string) {
    // 기존에 이메일로 유저를 찾을 때는 unique가 아니여서 탈퇴유저가 동일 이메일을 가질 우려가 있었는데 그걸 다 걸러버림
    const user = await authRepository.findByLoginId(loginId);
    //1.  아에 디비에 존재하지 않는경우
    if (!user) {
      const errorMessage: string = "This id doesn't exist";
      throw new Error(errorMessage);
    }
    //2. 가장 최근 계정이 탈퇴된 상태인 경우 >> 탈퇴한 유저의 값으로 우회해서 로그인 요청 줄 수 있으니 이건 그대로 두기
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
    // 기존에 난수화된 id 값을 사용했었는데 그 대신 로그인아이디를 사용해서 jwt 발급
    // 후에 보안성 강화
    const id = user.loginId;
    const accesstoken: string = jwt.sign({ loginId: id }, JWT_SECRET_KEY, {
      expiresIn: "30d",
    });
    // const loginData = { user, accesstoken }; >> 이거 없어도 되는거 같은데
    return { user, accesstoken };
  }
  static async getCurrentUser(loginId: string) {
    //jwt안에 들어있는 id가 loginId
    const data: user | null = await authRepository.findByLoginId(loginId);
    return data;
  }
  static async editPW(loginId: string, password: string, newPassword: string) {
    //jwt안에 들어있는 id가 loginId = loginId
    //🟪 user type으로 가면 비밀번호가 계속 null이라서 bcrypt에 사용이 안된다.
    const user: any = await authRepository.findByLoginId(loginId);
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
    const editData = await authRepository.updateUserPW(loginId, hashPW);
    return editData;
  }
  static async getUserList(id: string) {
    let result = [];
    const userIdList = await authRepository.getUserListById(id);
    const userNameList = await authRepository.getUserListByName(id);
    result = [...userIdList, ...userNameList];
    return result;
  }
  static async getUserProfile(id: string) {
    const profile = await authRepository.findByLoginId(id);
    return profile;
  }
  static async editDescription(loginId: string, description: string) {
    const editData: user = await authRepository.updateUserDescription(
      loginId,
      description
    );
    return editData;
  }

  static async editname(loginId: string, name: string) {
    const editData: user = await authRepository.updateUserName(loginId, name);
    return editData;
  }
  static async editemotion(loginId: string, emotion: string) {
    const editData: user = await authRepository.updateUserEmotion(
      loginId,
      emotion
    );
    return editData;
  }
  static async editWithdrawal(loginId: string) {
    const editData: user = await authRepository.updateWithdrawal(loginId);
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
