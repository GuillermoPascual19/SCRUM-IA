import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getMembersByTfg,
  addMemberToTfg,
  updateScrumRole,
  removeMemberFromTfg,
} from "../services/member.service";

export async function getMembers(req: AuthRequest, res: Response) {
  const members = await getMembersByTfg(Number(req.params.tfgId), req.user!.id, req.user!.role);
  res.json(members);
}

export async function addMember(req: AuthRequest, res: Response) {
  const member = await addMemberToTfg(
    Number(req.params.tfgId),
    req.body.userId,
    req.body.scrumRole,
    req.user!.id,
    req.user!.role
  );
  res.status(201).json(member);
}

export async function updateRole(req: AuthRequest, res: Response) {
  const member = await updateScrumRole(
    Number(req.params.tfgId),
    Number(req.params.userId),
    req.body.scrumRole,
    req.user!.id,
    req.user!.role
  );
  res.json(member);
}

export async function removeMember(req: AuthRequest, res: Response) {
  await removeMemberFromTfg(
    Number(req.params.tfgId),
    Number(req.params.userId),
    req.user!.id,
    req.user!.role
  );
  res.json({ message: "Miembro eliminado correctamente" });
}
