import {
  findSprintsByTfg,
  findSprintById,
  createSprint,
  updateSprint,
  deleteSprint,
} from "../repositories/sprint.repository";
import { findTfgById } from "../repositories/tfg.repository";

export async function getSprintsByTfg(tfgId: number) {
  const tfg = await findTfgById(tfgId);
  if (!tfg) throw new Error("TFG_NOT_FOUND");
  return findSprintsByTfg(tfgId);
}

export async function getSprintById(id: number) {
  const sprint = await findSprintById(id);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");
  return sprint;
}

export async function createNewSprint(
  tfgId: number,
  data: {
    name: string;
    goal?: string;
    startDate?: string;
    endDate?: string;
  },
  requesterId: number,
  requesterRole: string
) {
  const tfg = await findTfgById(tfgId);
  if (!tfg) throw new Error("TFG_NOT_FOUND");

  if (requesterRole !== "admin" && requesterRole !== "coordinador" && tfg.tutorId !== requesterId) {
    throw new Error("FORBIDDEN");
  }

  return createSprint({
    tfgId,
    name: data.name,
    goal: data.goal,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  });
}

export async function updateExistingSprint(
  id: number,
  data: {
    name?: string;
    goal?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  },
  requesterId: number,
  requesterRole: string
) {
  const sprint = await findSprintById(id);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");

  const tfg = await findTfgById(sprint.tfgId);
  if (requesterRole !== "admin" && requesterRole !== "coordinador" && tfg!.tutorId !== requesterId) {
    throw new Error("FORBIDDEN");
  }

  return updateSprint(id, data);
}

export async function deleteExistingSprint(
  id: number,
  requesterId: number,
  requesterRole: string
) {
  const sprint = await findSprintById(id);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");

  const tfg = await findTfgById(sprint.tfgId);
  if (requesterRole !== "admin" && requesterRole !== "coordinador" && tfg!.tutorId !== requesterId) {
    throw new Error("FORBIDDEN");
  }

  return deleteSprint(id);
}