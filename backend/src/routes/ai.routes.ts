import { Router } from "express";
import {
  generate, getByTfg, update, generateFinal, getFinalGrades,
  updateFinal, retroInsights, tfgSummary, getReports, deleteReport,
} from "../controllers/ai.controller";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { generateEvaluationSchema, generateFinalSchema, updateEvaluationSchema, tfgSummarySchema } from "../schemas/ai.schemas";

const router = Router({ mergeParams: true });

router.post("/generate", authenticate, requireRole("teacher", "coordinator", "admin"), validate(generateEvaluationSchema), generate);
router.get("/", authenticate, getByTfg);
router.put("/:id", authenticate, requireRole("teacher", "coordinator", "admin"), validate(updateEvaluationSchema), update);
router.post("/final/generate", authenticate, requireRole("teacher", "coordinator", "admin"), validate(generateFinalSchema), generateFinal);
router.get("/final", authenticate, getFinalGrades);
router.put("/final/:id", authenticate, requireRole("teacher", "coordinator", "admin"), updateFinal);
router.get("/retro-insights/:sprintId", authenticate, retroInsights);
router.post("/tfg-summary", authenticate, requireRole("teacher", "coordinator", "admin"), validate(tfgSummarySchema), tfgSummary);
router.get("/reports", authenticate, requireRole("teacher", "coordinator", "admin"), getReports);
router.delete("/reports/:reportId", authenticate, requireRole("teacher", "coordinator", "admin"), deleteReport);

export default router;
