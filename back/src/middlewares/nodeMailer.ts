import * as nodemailer from "nodemailer";
import { nodemailerId, nodemailerPW } from "../configs/configModules";
import * as path from "path";
import { Response } from "express";

async function nodeMailer(email: string) {
  //transport: 메일을 발송할 수  있는 객체
  let smtpTransport = nodemailer.createTransport({
    //naver로 수정
    service: "naver",
    host: "smtp.naver.com",
    port: 587,
    auth: {
      user: nodemailerId,
      // user: "ffff",
      pass: nodemailerPW,
    },
    secure: false, // 587port에서 STARTTLS 암호화를 사용함
    tls: {
      rejectUnauthorized: true, // 인증서 유효성 검사, false : 오류 우회
    },
  });

  //   // 6자리 난수 생성
  const authNumber = Math.floor(Math.random() * 888888) + 111111;

  const mailOptions = {
    from: nodemailerId, // 발송 주체
    to: email, // 인증을 요청한 이메일 주소
    subject: "[ 말랑일기 ] 이메일 확인 인증번호 안내", // 이메일 제목
    text: ` 아래 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n\n
       ✅ 인증번호 6자리 : ${authNumber}`, // 이메일 내용
  };
  console.log("Ready to send Mail ");
  smtpTransport
    .sendMail(mailOptions)
    //sendMail의 return 값은 info 이거나 error 이다
    .then((info) => {
      console.log(info);
    })
    .catch((error) => {
      console.log(error, "\x1b[41m 해당 에러, 전송 처리 아직 못함 \x1b[0m");
      throw new Error(error);
    });
  return authNumber;
}

async function lostPasswordMailer(email: string, password: string) {
  let smtpTransport = nodemailer.createTransport({
    service: "naver",
    host: "smtp.naver.com",
    port: 587,
    auth: {
      user: nodemailerId,
      // user: "ffff",
      pass: nodemailerPW,
    },
    secure: false,
    tls: {
      rejectUnauthorized: true,
    },
  });

  const mailOptions = {
    from: nodemailerId,
    to: email,
    subject: "[ 말랑일기 ] 비밀번호 변경 안내",
    text: ` 해당 비밀번호는 로그인 후 변경부탁드립니다\n\n
       ✅ 새로운 비밀번호 : ${password}`,
  };
  console.log("Ready to send Mail ");
  smtpTransport
    .sendMail(mailOptions)
    .then((info) => {
      console.log(info);
    })
    .catch((error) => {
      console.log(error, "\x1b[41m 해당 에러, 전송 처리 아직 못함 \x1b[0m");
      throw new Error(error);
    });
  return;
}
async function lostIdMailer(email: string, id: string) {
  let smtpTransport = nodemailer.createTransport({
    service: "naver",
    host: "smtp.naver.com",
    port: 587,
    auth: {
      user: nodemailerId,
      // user: "ffff",
      pass: nodemailerPW,
    },
    secure: false,
    tls: {
      rejectUnauthorized: true,
    },
  });

  const mailOptions = {
    from: nodemailerId,
    to: email,
    subject: "[ 말랑일기 ] ID 안내",
    text: ` ID 문의가 들어와서 전달드립니다\n\n
       ✅ ID : ${id}`, // 이메일 내용
  };
  console.log("Ready to send Mail ");
  smtpTransport
    .sendMail(mailOptions)
    //sendMail의 return 값은 info 이거나 error 이다
    .then((info) => {
      console.log(info);
    })
    .catch((error) => {
      console.log(error, "\x1b[41m 해당 에러, 전송 처리 아직 못함 \x1b[0m");
      throw new Error(error);
    });
  return;
}
export { nodeMailer, lostPasswordMailer, lostIdMailer };
