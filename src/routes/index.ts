import { Router } from "express";
import auth from "./auth";
import users from "./users";
import tasks from "./users";

const router = Router();

router.use("auth", auth);
router.use("users", users);
router.use("tasks", tasks);

export default router;
