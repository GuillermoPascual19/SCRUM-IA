import { Router } from "express";
import {
  generate,
  getByTfg,
  update,
  generateFinal,
  getFinalGrades,
  updateFinal,
  retroInsights,
  tfgSummary
} from "../controllers/ai.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router({ mergeParams: true });


router.post("/generate", authenticate, requireRole("profesor", "coordinador", "admin"), generate);
router.get("/", authenticate, getByTfg);
router.put("/:id", authenticate, requireRole("profesor", "coordinador", "admin"), update);
router.post("/final/generate", authenticate, requireRole("profesor", "coordinador", "admin"), generateFinal);
router.get("/final", authenticate, getFinalGrades);
router.put("/final/:id", authenticate, requireRole("profesor", "coordinador", "admin"), updateFinal);
router.get("/retro-insights/:sprintId", authenticate, retroInsights);
router.post("/tfg-summary", authenticate, requireRole("profesor", "coordinador", "admin"), tfgSummary);

export default router;