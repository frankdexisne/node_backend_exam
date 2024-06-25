import { Request, Response } from "express";
import Task from "../models/Task";
import { validationResult } from "express-validator";
import { UserProps } from "../models/User";

declare module "express-session" {
  interface SessionData {
    user: UserProps;
  }
}

export const index = (req: Request, res: Response) => {
  new Task()
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
  const userId = req.session?.user?.id;
  if (!result.isEmpty()) {
    return res.status(422).send({ errors: result.array() });
  }

  const { title, description, status } = req.body;

  new Task()
    .create({
      title,
      description,
      status,
      user_id: userId,
    })
    .then((data) => {
      return res.json({ task: data });
    });
};

export const show = (req: Request, res: Response) => {
  new Task().find(+req.params.id).then((data) => {
    if (!data)
      return res.status(404).json({
        error: "Not found",
      });
    return res.json({ task: data });
  });
};

export const update = (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(422).send({ errors: result.array() });
  }
  const { title, description, status } = req.body;
  new Task()
    .update(+req.params.id, { title, description, status })
    .then(() => res.status(204).send());
};

export const destroy = (req: Request, res: Response) => {
  new Task().find(+req.params.id).then((data) => {
    if (!data)
      return res.status(404).json({
        error: "Not found",
      });
    new Task().delete(+req.params.id).then(() => res.status(204).send());
  });
};
