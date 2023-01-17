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
exports.nodemailerPW = exports.nodemailerId = exports.region = exports.bucketName = exports.s3SecretKey = exports.s3AccessKey = exports.DATABASE_URL = exports.JWT_SECRET_KEY = exports.port = void 0;
const dotenv = __importStar(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const port = parseInt(process.env.SERVER_PORT, 10);
exports.port = port;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
exports.JWT_SECRET_KEY = JWT_SECRET_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
exports.DATABASE_URL = DATABASE_URL;
// const port: number = 5000;
// const JWT_SECRET_KEY: Secret = "SgO17Xz$80wVuF6&@GJQigfojITRouno8F";
// const DATABASE_URL: string = "mysql://elice:elice111@eliceproject-3.cfcebwrqudl4.ap-northeast-1.rds.amazonaws.com:3306/eliceproject-3";
const s3AccessKey = process.env.S3_ACCESS_KEY;
exports.s3AccessKey = s3AccessKey;
const s3SecretKey = process.env.S3_SECRET_KEY;
exports.s3SecretKey = s3SecretKey;
const bucketName = process.env.BUCKET_NAME;
exports.bucketName = bucketName;
const region = "ap-northeast-1";
exports.region = region;
const nodemailerId = process.env.NODEMAILER_USER;
exports.nodemailerId = nodemailerId;
const nodemailerPW = process.env.NODEMAILER_PASS;
exports.nodemailerPW = nodemailerPW;
//# sourceMappingURL=configModules.js.map