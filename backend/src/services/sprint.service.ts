import {
  findSprintsByTfg,
  findSprintById,
  createSprint,
  updateSprint,
  deleteSprint,
} from "../repositories/sprint.repository";
import { findTfgById } from "../repositories/tfg.repository";
import { prisma } from "../lib/prisma";



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

export async function getBurndownData(sprintId: number) {
  const sprint = await findSprintById(sprintId);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");
  if (!sprint.startDate || !sprint.endDate) {
    return { days: [], totalPoints: 0, sprintName: sprint.name };
  }

  const userStories = await prisma.userStory.findMany({
    where: {
      tasks: { some: { sprintId } },
    },
    select: {
      storyPoints: true,
      status: true,
      completedAt: true,
    },
  });

  const totalPoints = userStories.reduce((acc, s) => acc + (s.storyPoints || 0), 0);

  const start = new Date(sprint.startDate);
  const end = new Date(sprint.endDate);
  const today = new Date();
  const limitDate = today < end ? today : end;

  const days: { day: string; real: number | null; ideal: number }[] = [];
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dayLabel = `D${i + 1}`;
    const ideal = Math.max(0, totalPoints - (totalPoints / (totalDays - 1)) * i);

    const isPast = date <= limitDate;
    let real: number | null = null;

    if (isPast) {
      const completedPoints = userStories
        .filter((s) => s.completedAt && new Date(s.completedAt) <= date)
        .reduce((acc, s) => acc + (s.storyPoints || 0), 0);
      real = Math.max(0, totalPoints - completedPoints);
    }

    days.push({ day: dayLabel, real, ideal: Math.round(ideal) });
  }

  return { days, totalPoints, sprintName: sprint.name };
}