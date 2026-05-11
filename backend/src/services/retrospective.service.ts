import {
  findRetrospectiveBySprint,
  createRetrospective,
  updateRetrospective,
} from "../repositories/retrospective.repository";
import { findSprintById } from "../repositories/sprint.repository";

export async function getRetrospectiveBySprint(sprintId: number) {
  const sprint = await findSprintById(sprintId);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");
  return findRetrospectiveBySprint(sprintId);
}

export async function createOrUpdateRetrospective(
  sprintId: number,
  data: {
    wentWell?: string;
    toImprove?: string;
    actions?: string;
  }
) {
  const sprint = await findSprintById(sprintId);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");

  const existing = await findRetrospectiveBySprint(sprintId);

  if (existing) {
    return updateRetrospective(sprintId, data);
  }

  return createRetrospective({ ...data, sprintId });
}