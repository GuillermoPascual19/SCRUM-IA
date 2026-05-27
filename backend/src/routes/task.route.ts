import { Router } from "express";
import { getByStory, getBySprint, getById, create, update, remove } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schemas";

const router = Router({ mergeParams: true });

router.get("/story/:userStoryId", authenticate, getByStory);
router.get("/sprint/:sprintId", authenticate, getBySprint);
router.get("/:id", authenticate, getById);
router.post("/", authenticate, validate(createTaskSchema), create);
router.put("/:id", authenticate, validate(updateTaskSchema), update);
router.delete("/:id", authenticate, remove);

export default router;
