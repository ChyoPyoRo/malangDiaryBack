import Jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../configs/configModules";
import { Request, Response, NextFunction } from "express";
import { access } from "fs";
import exp from "constants";

function loginRequired(req: Request, res: Response, next: NextFunction) {
  const reqToken: any = req.headers["authorization"];

  const accessToken: string = reqToken.split(" ")[1];

  if (accessToken) {
    try {
      const secretkey: Secret = JWT_SECRET_KEY;

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
      const jwtDecoded: any = Jwt.verify(accessToken, secretkey);
      const userId = jwtDecoded.userId;

      req.body["currentUserId"] = userId;
      // console.log("middleware--", userId);

      // currentUserId 타입 정의 조금 더 공부해보기
      next();
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).send("Access token is not valid");
  }
}

export { loginRequired };
