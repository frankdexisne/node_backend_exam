import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import User, { UserProps } from "../models/User";
import { validationResult } from "express-validator";
import bcryptjs from "bcryptjs";

declare module "express-session" {
  interface SessionData {
    user: UserProps;
  }
}

const jwt = require("jsonwebtoken");

export const login = (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(422).send({ errors: result.array() });
  }

  const { email, password } = req.body;
  new User().findByEmail(email).then((user) => {
    if (user) {
      bcryptjs.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          const jwtSecret = process.env.JWT_SECRET;
          if (!jwtSecret) {
            return res
              .status(500)
              .json({ message: "JWT secret is not defined" });
          }
          const token = jwt.sign(user, jwtSecret, {
            expiresIn: "1d",
          });
          req.session.user = user;
          console.log(req.session.user);

          return res.json({ user: user, token: token });
        } else {
          return res.status(422).json({
            message: "Invalid username and password",
          });
        }
      });
    } else {
      return res.status(422).json({
        message: "User not found",
      });
    }
  });
};
