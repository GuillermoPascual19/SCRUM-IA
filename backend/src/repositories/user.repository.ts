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
  isActive: boolean;
  activationToken: string;
  activationTokenExpires: Date;
}) {
  return prisma.user.create({ data });
}

export async function findUserByActivationToken(token: string) {
  return prisma.user.findFirst({ where: { activationToken: token } });
}

export async function activateUser(id: number) {
  return prisma.user.update({
    where: { id },
    data: { isActive: true, activationToken: null, activationTokenExpires: null },
  });
}
