import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


import { Secret } from "jsonwebtoken";
const port: number = parseInt(process.env.SERVER_PORT as string, 10);
const JWT_SECRET_KEY: Secret = process.env.JWT_SECRET_KEY as string;
const DATABASE_URL: string = process.env.DATABASE_URL as string;


// const port: number = 5000;
// const JWT_SECRET_KEY: Secret = "SgO17Xz$80wVuF6&@GJQigfojITRouno8F";
// const DATABASE_URL: string = "mysql://elice:elice111@eliceproject-3.cfcebwrqudl4.ap-northeast-1.rds.amazonaws.com:3306/eliceproject-3";

const s3AccessKey: string = process.env.S3_ACCESS_KEY as string;
const s3SecretKey: string = process.env.S3_SECRET_KEY as string;
const bucketName: string = process.env.BUCKET_NAME as string;
const region: string = "ap-northeast-1";

const nodemailerId: string = process.env.NODEMAILER_USER as string;
const nodemailerPW: string = process.env.NODEMAILER_PASS as string;

export {
  port,
  JWT_SECRET_KEY,
  DATABASE_URL,
  s3AccessKey,
  s3SecretKey,
  bucketName,
  region,
  nodemailerId,
  nodemailerPW,
};