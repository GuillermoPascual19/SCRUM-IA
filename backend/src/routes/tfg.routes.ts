import { Router } from "express";
import { getAll, getById, getMine, create, update, remove } from "../controllers/tfg.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getAll);
router.get("/mine", authenticate, getMine);
router.get("/:id", authenticate, getById);
router.post("/", authenticate, requireRole("teacher", "coordinator", "admin"), create);
router.put("/:id", authenticate, requireRole("teacher", "coordinator", "admin"), update);
router.delete("/:id", authenticate, requireRole("coordinator", "admin"), remove);

export default router;