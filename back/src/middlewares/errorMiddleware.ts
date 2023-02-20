import { Request, Response, NextFunction } from "express";
import { logger } from "../configs/winston";

function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("\x1b[33m%s\x1b[0m", error);
  logger.error(error.message);
  res.status(400).send({ message: error.message });
}
export { errorMiddleware };
