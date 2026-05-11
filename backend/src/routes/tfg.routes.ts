import { Router } from "express";
import { getAll, getById, getMine, create, update, remove } from "../controllers/tfg.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getAll);
router.get("/mine", authenticate, getMine);
router.get("/:id", authenticate, getById);
router.post("/", authenticate, requireRole("profesor", "coordinador", "admin"), create);
router.put("/:id", authenticate, requireRole("profesor", "coordinador", "admin"), update);
router.delete("/:id", authenticate, requireRole("coordinador", "admin"), remove);

export default router;