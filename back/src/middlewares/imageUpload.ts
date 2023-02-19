import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import AWS from "aws-sdk";
import fs from "fs";
import {
  s3AccessKey,
  s3SecretKey,
  bucketName,
  region,
} from "../configs/configModules";

const s3 = new AWS.S3({
  region,
  accessKeyId: s3AccessKey,
  secretAccessKey: s3SecretKey,
});

const uploadFile = multer({
  storage: multerS3({
    s3: new S3Client({
      credentials: {
        accessKeyId: s3AccessKey,
        secretAccessKey: s3SecretKey,
      },
      region: region,
    }),
    bucket: bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileId = randomUUID();
      const extension = path.extname(file.originalname);
      const fileName = `${Date.now()}_${fileId}_${extension}`;
      cb(null, fileName);
    },
    acl: "public-read-write",
  }),
});

const deleteFile = async (imgKey: any) => {
  console.log(imgKey, "imgkey");

  await s3.deleteObject(
    {
      Bucket: bucketName,
      Key: imgKey,
    },
    function (err, data) {}
  );
};
export { uploadFile, deleteFile };
