import { prisma } from "../lib/prisma";

export async function findAllTfgs() {
  return prisma.tfg.findMany({
    include: { tutor: { select: { id: true, name: true, email: true } } },
  });
}

export async function findTfgById(id: number) {
  return prisma.tfg.findUnique({
    where: { id },
    include: {
      tutor: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      sprints: true,
    },
  });
}

export async function findTfgsByTutor(tutorId: number) {
  return prisma.tfg.findMany({
    where: { tutorId },
    include: {
      tutor: { select: { id: true, name: true, email: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
      },
    },
  });
}

export async function findTfgsByMember(userId: number) {
  return prisma.tfg.findMany({
    where: { members: { some: { userId } } },
    include: { tutor: { select: { id: true, name: true, email: true } } },
  });
}

export async function createTfg(data: {
  title: string;
  description?: string;
  academicYear?: string;
  tutorId: number;
  repositoryUrl?: string;
  githubToken?: string;
}) {
  return prisma.tfg.create({ data });
}

export async function updateTfg(id: number, data: {
  title?: string;
  description?: string;
  academicYear?: string;
  status?: string;
  repositoryUrl?: string;
  githubToken?: string;
}) {
  return prisma.tfg.update({ where: { id }, data });
}

export async function deleteTfg(id: number) {
  return prisma.tfg.delete({ where: { id } });
}