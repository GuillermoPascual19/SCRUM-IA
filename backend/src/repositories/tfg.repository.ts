import { prisma } from "../lib/prisma";

export async function findAllTfgs() {
  return prisma.tfg.findMany({
    include: {
      tutor: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
    },
    orderBy: { createdAt: "desc" },
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

export async function hasGradeOrReport(tfgId: number): Promise<boolean> {
  const [gradeCount, reportCount] = await Promise.all([
    prisma.tfgFinalGrade.count({ where: { tfgId } }),
    prisma.tfgReport.count({ where: { tfgId } }),
  ]);
  return gradeCount > 0 || reportCount > 0;
export async function isMemberOrTutor(tfgId: number, userId: number): Promise<boolean> {
  const count = await prisma.tfg.count({
    where: {
      id: tfgId,
      OR: [
        { tutorId: userId },
        { members: { some: { userId } } },
      ],
    },
  });
  return count > 0;
}