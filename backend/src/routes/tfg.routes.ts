import { Router } from "express";
import { getAll, getById, getMine, create, update, remove } from "../controllers/tfg.controller";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createTfgSchema, updateTfgSchema } from "../schemas/tfg.schemas";

const router = Router();

router.get("/", authenticate, getMine);
router.get("/all", authenticate, requireRole("coordinator", "admin"), getAll);
router.get("/:id", authenticate, getById);
router.post("/", authenticate, requireRole("teacher", "coordinator", "admin"), validate(createTfgSchema), create);
router.put("/:id", authenticate, requireRole("teacher", "coordinator", "admin"), validate(updateTfgSchema), update);
router.delete("/:id", authenticate, requireRole("coordinator", "admin"), remove);

export default router;
