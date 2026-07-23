import {
  findRetrospectiveBySprint,
  createRetrospective,
  updateRetrospective,
} from "../repositories/retrospective.repository";
import { findSprintById } from "../repositories/sprint.repository";
import { isMemberOrTutor } from "../repositories/tfg.repository";

export async function getRetrospectiveBySprint(sprintId: number, requesterId: number, requesterRole: string) {
  const sprint = await findSprintById(sprintId);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");
  if (requesterRole !== "admin" && requesterRole !== "coordinator") {
    const ok = await isMemberOrTutor(sprint.tfgId, requesterId);
    if (!ok) throw new Error("FORBIDDEN");
  }
  return findRetrospectiveBySprint(sprintId);
}

export async function createOrUpdateRetrospective(
  sprintId: number,
  data: {
    wentWell?: string;
    toImprove?: string;
    actions?: string;
  },
  requesterId: number,
  requesterRole: string
) {
  const sprint = await findSprintById(sprintId);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");
  if (requesterRole !== "admin" && requesterRole !== "coordinator") {
    const ok = await isMemberOrTutor(sprint.tfgId, requesterId);
    if (!ok) throw new Error("FORBIDDEN");
  }

  const existing = await findRetrospectiveBySprint(sprintId);

  if (existing) {
    return updateRetrospective(sprintId, data);
  }

  return createRetrospective({ ...data, sprintId });
}