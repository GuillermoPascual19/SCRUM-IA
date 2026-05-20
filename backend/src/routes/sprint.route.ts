import { Router } from "express";
import { getByTfg, getById, create, update, remove, burndown, planner } from "../controllers/sprint.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router({ mergeParams: true });

router.get("/", authenticate, getByTfg);
router.post("/", authenticate, requireRole("profesor", "coordinador", "admin"), create);
router.get("/planner", authenticate, planner);
router.get("/:id", authenticate, getById);
router.get("/:id/burndown", authenticate, burndown);
router.put("/:id", authenticate, requireRole("profesor", "coordinador", "admin"), update);
router.delete("/:id", authenticate, requireRole("profesor", "coordinador", "admin"), remove);

export default router;