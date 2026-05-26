import { Router } from "express";
import { getBySprint, upsert } from "../controllers/retrospective.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router({ mergeParams: true });

router.get("/", authenticate, getBySprint);
router.post("/", authenticate, requireRole("teacher", "coordinator", "admin"), upsert);

export default router;