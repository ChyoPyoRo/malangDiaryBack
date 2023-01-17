// import { Request } from "express";
// import multer, { FileFilterCallback } from "multer";

// type FileNameCallback = (error: Error | null, filename: string) => void;

// export const multerConfig = {
//   storage: multer.diskStorage({
//     //destination: 파일을 어디에 저장할지 지정하는 함수 (옵션: 어느폴더에 저장할지 결정)
//     destination: "uploads/",
//     filename: function (
//       req: Request,
//       file: Express.Multer.File,
//       cb: FileNameCallback
//     ) {
//       cb(null, file.originalname);
//     },
//   }),
// };
