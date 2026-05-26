import {
  findMembersByTfg,
  findMember,
  addMember,
  updateMemberRole,
  removeMember,
} from "../repositories/member.repository";
import { findTfgById } from "../repositories/tfg.repository";
import { findUserById } from "../repositories/user.repository";

export async function getMembersByTfg(tfgId: number) {
  const tfg = await findTfgById(tfgId);
  if (!tfg) throw new Error("TFG_NOT_FOUND");
  return findMembersByTfg(tfgId);
}

export async function addMemberToTfg(
  tfgId: number,
  userId: number,
  scrumRole: string | undefined,
  requesterId: number,
  requesterRole: string
) {
  const tfg = await findTfgById(tfgId);
  if (!tfg) throw new Error("TFG_NOT_FOUND");

  if (requesterRole !== "admin" && requesterRole !== "coordinator" && tfg.tutorId !== requesterId) {
    throw new Error("FORBIDDEN");
  }

  const user = await findUserById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  const existing = await findMember(tfgId, userId);
  if (existing) throw new Error("ALREADY_MEMBER");

  return addMember({ tfgId, userId, scrumRole });
}

export async function updateScrumRole(
  tfgId: number,
  userId: number,
  scrumRole: string,
  requesterId: number,
  requesterRole: string
) {
  const tfg = await findTfgById(tfgId);
  if (!tfg) throw new Error("TFG_NOT_FOUND");

  if (requesterRole !== "admin" && requesterRole !== "coordinator" && tfg.tutorId !== requesterId) {
    throw new Error("FORBIDDEN");
  }

  const member = await findMember(tfgId, userId);
  if (!member) throw new Error("MEMBER_NOT_FOUND");

  return updateMemberRole(tfgId, userId, scrumRole);
}

export async function removeMemberFromTfg(
  tfgId: number,
  userId: number,
  requesterId: number,
  requesterRole: string
) {
  const tfg = await findTfgById(tfgId);
  if (!tfg) throw new Error("TFG_NOT_FOUND");

  if (requesterRole !== "admin" && requesterRole !== "coordinator" && tfg.tutorId !== requesterId) {
    throw new Error("FORBIDDEN");
  }

  const member = await findMember(tfgId, userId);
  if (!member) throw new Error("MEMBER_NOT_FOUND");

  return removeMember(tfgId, userId);
}