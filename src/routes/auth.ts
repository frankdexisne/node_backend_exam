import { Router } from "express";
import { login, index } from "../controllers/AuthController";

const router = Router();

router.get("/", index);
router.get("/login", login);

export default router;
