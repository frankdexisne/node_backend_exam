import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { validationResult } from "express-validator";
import bycrypt from "bcryptjs";
export const index = (req: Request, res: Response) => {
  new User()
    .get()
    .then((data) => {
      return res.json({ data: data });
    })
    .catch((err) => {
      console.error(err);
    });
};

export const store = (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(422).send({ errors: result.array() });
  }
  const { email, password, name } = req.body;

  bycrypt.hash(password, 12).then((hashPassword) => {
    new User()
      .create({
        email,
        password: hashPassword,
        name,
      })
      .then((data) => {
        return res.json({ user: data });
      });
  });
};

export const show = (req: Request, res: Response) => {
  new User().find(+req.params.id).then((data) => {
    if (!data)
      return res.status(404).json({
        error: "Not found",
      });
    return res.json({ user: data });
  });
};

export const update = (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(422).send({ errors: result.array() });
  }
  const { email, password, name } = req.body;

  bycrypt.hash(password, 12).then((hashPassword) => {
    new User()
      .update(+req.params.id, { email, password: hashPassword, name })
      .then(() => res.status(204).send());
  });
};

export const destroy = (req: Request, res: Response) => {
  new User().find(+req.params.id).then((data) => {
    if (!data)
      return res.status(404).json({
        error: "Not found",
      });
    new User().delete(+req.params.id).then(() => res.status(204).send());
  });
};
