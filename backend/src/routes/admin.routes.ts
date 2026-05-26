import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { getUsers, patchUser, removeUser } from "../controllers/admin.controller";

const router = Router();

router.get("/users", authenticate, requireRole("admin"), getUsers);
router.patch("/users/:id", authenticate, requireRole("admin"), patchUser);
router.delete("/users/:id", authenticate, requireRole("admin"), removeUser);

export default router;
