import { Router } from "express";
import { generate, getByTfg, update } from "../controllers/ai.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router({ mergeParams: true });

router.post("/generate", authenticate, requireRole("profesor", "coordinador", "admin"), generate);
router.get("/", authenticate, getByTfg);
router.put("/:id", authenticate, requireRole("profesor", "coordinador", "admin"), update);

export default router;