"use strict";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import path from "path";
// // import { uuid } from "aws-sdk/clients/customerprofiles";
// import { S3Client } from "@aws-sdk/client-s3";
// import { Client } from "socket.io/dist/client";
// import { randomUUID } from "crypto";
// // import AWS from "aws-sdk";
// // import { MimeType } from "aws-sdk/clients/kendra";
// import mime from "mime-types";
// import {
//   s3AccessKey,
//   s3SecretKey,
//   bucketName,
//   region,
// } from "../configs/configModules";
// import exp from "constants";
// AWS.config.update({
//   region: region,
//   accessKeyId: s3AccessKey,
//   secretAccessKey: s3SecretKey,
// });
// const s3 = new AWS.S3();
// const allowedExtentions = [".png", ".jpg", ".jpeg", ".bmp"];
// const upload = multer({
//   storage: multerS3({
//     s3: new S3Client({
//       credentials: {
//         accessKeyId: s3AccessKey,
//         secretAccessKey: s3SecretKey,
//       },
//       region: region,
//     }),
//     bucket: bucketName,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: function (req, file, cb) {
//       const fileId = randomUUID();
//       //   const type = file.mimetype;
//       const extension = path.extname(file.originalname);
//       const fileName = `${Date.now()}_${file.originalname}`;
//       cb(null, fileName);
//     },
//     acl: "public-read-write",
//   }),
// });
// export { upload };
//# sourceMappingURL=imageUpload.js.map