import { prisma } from "../lib/prisma";

export async function findTasksByStory(userStoryId: number) {
  return prisma.task.findMany({
    where: { userStoryId },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function findTasksBySprint(sprintId: number) {
  return prisma.task.findMany({
    where: { sprintId },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      userStory: { select: { id: true, title: true } },
    },
    orderBy: { status: "asc" },
  });
}

export async function findTaskById(id: number) {
  return prisma.task.findUnique({
    where: { id },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      userStory: { select: { id: true, title: true } },
      sprint: { select: { id: true, name: true } },
    },
  });
}

export async function createTask(data: {
  userStoryId: number;
  sprintId: number;
  title: string;
  description?: string;
  assignedTo?: number;
  estimatedHours?: number;
}) {
  return prisma.task.create({
    data,
    include: {
      assignee: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function updateTask(id: number, data: {
  title?: string;
  description?: string;
  status?: string;
  assignedTo?: number;
  estimatedHours?: number;
  actualHours?: number;
}) {
  return prisma.task.update({
    where: { id },
    data,
    include: {
      assignee: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function deleteTask(id: number) {
  return prisma.task.delete({ where: { id } });
}