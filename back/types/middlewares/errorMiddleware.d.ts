import { Request, Response, NextFunction } from "express";
declare function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction): void;
export { errorMiddleware };
