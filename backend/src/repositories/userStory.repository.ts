import { prisma } from "../lib/prisma";

export async function findUserStoriesByTfg(tfgId: number) {
  return prisma.userStory.findMany({
    where: { tfgId },
    orderBy: { priority: "asc" },
    include: { tasks: true },
  });
}

export async function findUserStoryById(id: number) {
  return prisma.userStory.findUnique({
    where: { id },
    include: { tasks: true },
  });
}

export async function createUserStory(data: {
  tfgId: number;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number;
  priority?: number;
}) {
  return prisma.userStory.create({ data });
}

export async function updateUserStory(id: number, data: {
  title?: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number;
  priority?: number;
  status?: string;
  completedAt?: Date | null;
}) {
  return prisma.userStory.update({ where: { id }, data });
}

export async function deleteUserStory(id: number) {
  return prisma.userStory.delete({ where: { id } });
}