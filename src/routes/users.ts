import { Router } from "express";
import {
  index,
  store,
  show,
  update,
  destroy,
} from "../controllers/UserController";

const router = Router();

router.get("/", index);
router.post("/", store);
router.get("/:id", show);
router.put("/:id", update);
router.delete("/:id", destroy);

export default router;
