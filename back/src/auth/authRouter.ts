import { Router, Response, Request, NextFunction } from "express";
import { authService } from "./authService";
import { loginRequired } from "../middlewares/loginRequired";
import { user } from "../utils/Modules";
import { describe } from "node:test";
import { stringify } from "node:querystring";
// import {generateAccessToken, sendAuthNumber} from '../'
import { nodeMailer } from "../middlewares/nodeMailer";

const authRouter = Router();
authRouter.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { loginId, email, name, password, gender } = req.body;

      if (
        !req.body.loginId ||
        !req.body.email ||
        !req.body.name ||
        !req.body.password ||
        !req.body.gender
      ) {
        //gender는 나중에 사용할 것
        const message: string = "Data is missing. Please re-enter. ";
        throw new Error(message);
      }
      //가입할 때는 userId, email, password, name, gender가 필요함
      const userData = await authService.signUp(
        loginId,
        email,
        password,
        name,
        gender
      );

      res.status(201).send(userData);
    } catch (error) {
      next(error);
    }
    // const returnData:
  }
);

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { loginId, password } = req.body;
      if (!req.body.loginId || !req.body.password) {
        const message: string = "Data is missing. Please re-enter. ";
        throw new Error(message);
      }
      const { user, accesstoken } = await authService.login(loginId, password);
      console.log(user);
      if (!user.emotion) {
        const message = "프로필 젤리를 선택해주세요.";
        res.status(200).send({ message, user, accesstoken });
        return;
      }
      res.status(201).send({ user, accesstoken });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/sendEmail",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email || email.length === 0) {
        return res.status(400).json({ message: "Need accurate informations" });
      }
      await authService.findByEmail(email);
      const authnumber = await nodeMailer(email, res);
      const CertiNumber = Number(authnumber);
      await authService.emailAuthSave(email, CertiNumber);

      res.status(201).send("이메일이 정상적으로 발송되었습니다");
    } catch (error) {
      next(error);
    }
  }
);
authRouter.post(
  "/confirmEmail",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { CertiNumber, email } = req.body;
      await authService.emailConfirm(email, CertiNumber);
      res.status(201).send("이메일 인증이 완료되었습니다.");
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/getUserList",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.body;
      const userList = await authService.getUserList(id);
      res.status(201).send(userList);
    } catch (error) {
      next(error);
    }
  }
);

authRouter.get(
  "/getUserProfile/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const profile = await authService.getUserProfile(id);
      res.status(200).send(profile);
    } catch (error) {
      next(error);
    }
  }
);

authRouter.get(
  "/currentUser",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //🟪🟪🟪 type 에러 =>>> const userId: string | string[] | undefined 3가지 타입에 해당한다
      //id를 int 값으로 수정해서 number 타입으로 선언해줌
      const id: string = req.body["currentUserId"];
      console.log("authRouter : 현재 로그인 한 사람", id);
      // console.log(req.body);
      // const userId: string = req.body.currentUserId!;
      // const userId = "8ee8758b-c680-4d06-a3f3-945ae7a9e8a5";
      const data = await authService.getCurrentUser(id);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }
);

authRouter.patch(
  "/userEdit/password",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body["currentUserId"];
      type obj = {
        password: "string";
        newPassword: "string";
      };
      const { password, newPassword }: obj = req.body;
      const editResult = await authService.editPW(
        userId,
        password,
        newPassword
      );
      res.status(200).send(editResult);
    } catch (error) {
      next(error);
    }
  }
);

authRouter.patch(
  "/userEdit/description",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body["currentUserId"];
      const description: string = req.body.description;

      const editResult = await authService.editDescription(userId, description);
      res.status(200).send(editResult);
    } catch (error) {
      next(error);
    }
  }
);
authRouter.patch(
  "/userEdit/name",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body["currentUserId"];
      const name: string = req.body.name;

      const editResult = await authService.editname(userId, name);
      res.status(200).send(editResult);
    } catch (error) {
      next(error);
    }
  }
);
authRouter.patch(
  "/userEdit/emotion",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body["currentUserId"];
      const emotion: string = req.body.emotion;

      const editResult = await authService.editemotion(userId, emotion);
      res.status(200).send(editResult);
    } catch (error) {
      next(error);
    }
  }
);
authRouter.patch(
  "/userEdit/withdrawal",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body["currentUserId"];

      const editResult = await authService.editWithdrawal(userId);
      res.status(200).send(editResult);
    } catch (error) {
      next(error);
    }
  }
);

export { authRouter };
