import { Router } from "express";
import { getByTfg, getById, create, update, remove } from "../controllers/userStory.controller";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createUserStorySchema, updateUserStorySchema } from "../schemas/userStory.schemas";

const router = Router({ mergeParams: true });

router.get("/", authenticate, getByTfg);
router.get("/:id", authenticate, getById);
router.post("/", authenticate, requireRole("teacher", "coordinator", "admin"), validate(createUserStorySchema), create);
router.put("/:id", authenticate, requireRole("teacher", "coordinator", "admin"), validate(updateUserStorySchema), update);
router.delete("/:id", authenticate, requireRole("teacher", "coordinator", "admin"), remove);

export default router;
