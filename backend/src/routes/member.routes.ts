import { Router } from "express";
import { getMembers, addMember, updateRole, removeMember } from "../controllers/member.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router({ mergeParams: true });

router.get("/", authenticate, getMembers);
router.post("/", authenticate, requireRole("profesor", "coordinador", "admin"), addMember);
router.put("/:userId", authenticate, requireRole("profesor", "coordinador", "admin"), updateRole);
router.delete("/:userId", authenticate, requireRole("profesor", "coordinador", "admin"), removeMember);

export default router;