import { Request, Response, NextFunction } from "express";
declare function loginRequired(req: Request, res: Response, next: NextFunction): void;
export { loginRequired };
