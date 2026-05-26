import { Router } from "express";
import {
  generate,
  getByTfg,
  update,
  generateFinal,
  getFinalGrades,
  updateFinal,
  retroInsights,
  tfgSummary,
  getReports,
} from "../controllers/ai.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router({ mergeParams: true });


router.post("/generate", authenticate, requireRole("teacher", "coordinator", "admin"), generate);
router.get("/", authenticate, getByTfg);
router.put("/:id", authenticate, requireRole("teacher", "coordinator", "admin"), update);
router.post("/final/generate", authenticate, requireRole("teacher", "coordinator", "admin"), generateFinal);
router.get("/final", authenticate, getFinalGrades);
router.put("/final/:id", authenticate, requireRole("teacher", "coordinator", "admin"), updateFinal);
router.get("/retro-insights/:sprintId", authenticate, retroInsights);
router.post("/tfg-summary", authenticate, requireRole("teacher", "coordinator", "admin"), tfgSummary);
router.get("/reports", authenticate, requireRole("teacher", "coordinator", "admin"), getReports);

export default router;