import { Router } from "express";
import { getMembers, addMember, updateRole, removeMember } from "../controllers/member.controller";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { addMemberSchema, updateMemberRoleSchema } from "../schemas/tfg.schemas";

const router = Router({ mergeParams: true });

router.get("/", authenticate, getMembers);
router.post("/", authenticate, requireRole("teacher", "coordinator", "admin"), validate(addMemberSchema), addMember);
router.put("/:userId", authenticate, requireRole("teacher", "coordinator", "admin"), validate(updateMemberRoleSchema), updateRole);
router.delete("/:userId", authenticate, requireRole("teacher", "coordinator", "admin"), removeMember);

export default router;
