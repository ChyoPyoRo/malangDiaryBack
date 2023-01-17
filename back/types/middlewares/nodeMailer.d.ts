import { Response } from "express";
declare function nodeMailer(email: string, res: Response): number;
export { nodeMailer };
