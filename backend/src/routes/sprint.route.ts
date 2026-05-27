import { Router } from "express";
import { getByTfg, getById, create, update, remove, burndown, planner } from "../controllers/sprint.controller";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createSprintSchema, updateSprintSchema } from "../schemas/sprint.schemas";

const router = Router({ mergeParams: true });

router.get("/", authenticate, getByTfg);
router.post("/", authenticate, requireRole("teacher", "coordinator", "admin"), validate(createSprintSchema), create);
router.get("/planner", authenticate, planner);
router.get("/:id", authenticate, getById);
router.get("/:id/burndown", authenticate, burndown);
router.put("/:id", authenticate, requireRole("teacher", "coordinator", "admin"), validate(updateSprintSchema), update);
router.delete("/:id", authenticate, requireRole("teacher", "coordinator", "admin"), remove);

export default router;
