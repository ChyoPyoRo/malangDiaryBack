"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeMailer = void 0;
const nodemailer = __importStar(require("nodemailer"));
const configModules_1 = require("../configs/configModules");
function nodeMailer(email, res) {
    //transport: 메일을 발송할 수  있는 객체
    const smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: configModules_1.nodemailerId,
            pass: configModules_1.nodemailerPW,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    //   // 6자리 난수 생성
    const authNumber = Math.floor(Math.random() * 888888) + 111111;
    const mailOptions = {
        from: "Emotion diary",
        to: email,
        subject: "[ 감정일기 ] 이메일 확인 인증번호 안내",
        text: ` 아래 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n\n
       ✅ 인증번호 6자리 : ${authNumber}`, // 이메일 내용
    };
    smtpTransport.sendMail(mailOptions, (error, responses) => {
        if (error) {
            res.status(500).json({
                message: `Failed to send authentication email to ${email}`,
            });
        }
        else {
            res.status(200).json({
                authNumber,
                message: `Authentication mail is sent to ${email}`,
            });
        }
        smtpTransport.close();
    });
    return authNumber;
}
exports.nodeMailer = nodeMailer;
//# sourceMappingURL=nodeMailer.js.map