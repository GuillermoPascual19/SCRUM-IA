import { prisma } from "../lib/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  return prisma.user.create({ data });
}