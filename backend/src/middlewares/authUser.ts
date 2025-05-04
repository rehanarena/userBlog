import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const authUser: RequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: "Missing auth token" });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string; email: string };

    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};