import {
  findMembersByTfg,
  findMember,
  addMember,
  updateMemberRole,
  removeMember,
} from "../repositories/member.repository";
import { findTfgById, isMemberOrTutor } from "../repositories/tfg.repository";
import { findUserById } from "../repositories/user.repository";
import { notify } from "./notification.service";

export async function getMembersByTfg(tfgId: number, requesterId: number, requesterRole: string) {
  const tfg = await findTfgById(tfgId);
  if (!tfg) throw new Error("TFG_NOT_FOUND");
  if (requesterRole !== "admin" && requesterRole !== "coordinator") {
    const ok = await isMemberOrTutor(tfgId, requesterId);
    if (!ok) throw new Error("FORBIDDEN");
  }
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

  const member = await addMember({ tfgId, userId, scrumRole });
  notify(userId, `Has sido añadido al TFG "${tfg.title}".`, "member_added", `/tfgs/${tfgId}`);
  return member;
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