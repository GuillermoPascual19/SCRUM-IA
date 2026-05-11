import { prisma } from "../lib/prisma";

export async function findSprintsByTfg(tfgId: number) {
  return prisma.sprint.findMany({
    where: { tfgId },
    orderBy: { startDate: "asc" },
  });
}

export async function findSprintById(id: number) {
  return prisma.sprint.findUnique({
    where: { id },
    include: {
      tasks: {
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
      },
      retrospective: true,
    },
  });
}

export async function createSprint(data: {
  tfgId: number;
  name: string;
  goal?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  return prisma.sprint.create({ data });
}

export async function updateSprint(id: number, data: {
  name?: string;
  goal?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}) {
  return prisma.sprint.update({ where: { id }, data });
}

export async function deleteSprint(id: number) {
  return prisma.sprint.delete({ where: { id } });
}