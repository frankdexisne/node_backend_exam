import { Request, Response, NextFunction } from "express";
import { UserProps } from "../models/User";
const jwt = require("jsonwebtoken");
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: Error, user: UserProps) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      // req.user_id = user.id;
      next();
    }
  );
};
