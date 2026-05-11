import { prisma } from "../lib/prisma";

export async function findMembersByTfg(tfgId: number) {
  return prisma.tfgMember.findMany({
    where: { tfgId },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
}

export async function findMember(tfgId: number, userId: number) {
  return prisma.tfgMember.findUnique({
    where: { tfgId_userId: { tfgId, userId } },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
}

export async function addMember(data: {
  tfgId: number;
  userId: number;
  scrumRole?: string;
}) {
  return prisma.tfgMember.create({
    data,
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
}

export async function updateMemberRole(tfgId: number, userId: number, scrumRole: string) {
  return prisma.tfgMember.update({
    where: { tfgId_userId: { tfgId, userId } },
    data: { scrumRole },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
}

export async function removeMember(tfgId: number, userId: number) {
  return prisma.tfgMember.delete({
    where: { tfgId_userId: { tfgId, userId } },
  });
}