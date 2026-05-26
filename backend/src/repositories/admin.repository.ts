import { prisma } from "../lib/prisma";

export function findAllUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export function updateUser(id: number, data: { role?: string; isActive?: boolean }) {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });
}

export function deleteUser(id: number) {
  return prisma.user.delete({ where: { id } });
}
