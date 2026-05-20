import { Router } from "express";
import { getByTfg, getById, create, update, remove, burndown } from "../controllers/sprint.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router({ mergeParams: true });

router.get("/", authenticate, getByTfg);
router.get("/:id", authenticate, getById);
router.post("/", authenticate, requireRole("profesor", "coordinador", "admin"), create);
router.put("/:id", authenticate, requireRole("profesor", "coordinador", "admin"), update);
router.delete("/:id", authenticate, requireRole("profesor", "coordinador", "admin"), remove);
router.get("/:id/burndown", authenticate, burndown);
    
export default router;