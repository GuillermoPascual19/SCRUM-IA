import { Router } from "express";
import { getByTfg, getById, create, update, remove } from "../controllers/userStory.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router({ mergeParams: true });

router.get("/", authenticate, getByTfg);
router.get("/:id", authenticate, getById);
router.post("/", authenticate, requireRole("teacher", "coordinator", "admin"), create);
router.put("/:id", authenticate, requireRole("teacher", "coordinator", "admin"), update);
router.delete("/:id", authenticate, requireRole("teacher", "coordinator", "admin"), remove);

export default router;