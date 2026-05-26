import { Router } from "express";
import { getMembers, addMember, updateRole, removeMember } from "../controllers/member.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router({ mergeParams: true });

router.get("/", authenticate, getMembers);
router.post("/", authenticate, requireRole("teacher", "coordinator", "admin"), addMember);
router.put("/:userId", authenticate, requireRole("teacher", "coordinator", "admin"), updateRole);
router.delete("/:userId", authenticate, requireRole("teacher", "coordinator", "admin"), removeMember);

export default router;