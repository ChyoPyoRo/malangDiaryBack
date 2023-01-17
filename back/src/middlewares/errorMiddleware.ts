import { Request, Response, NextFunction } from "express";

function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);
  console.log(typeof error);

  console.log("\x1b[33m%s\x1b[0m", error);
  res.status(400).send({message : error.message});
}
export { errorMiddleware };
