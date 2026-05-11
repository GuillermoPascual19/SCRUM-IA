import { prisma } from "../lib/prisma";

export async function findRetrospectiveBySprint(sprintId: number) {
  return prisma.retrospective.findUnique({
    where: { sprintId },
  });
}

export async function createRetrospective(data: {
  sprintId: number;
  wentWell?: string;
  toImprove?: string;
  actions?: string;
}) {
  return prisma.retrospective.create({ data });
}

export async function updateRetrospective(sprintId: number, data: {
  wentWell?: string;
  toImprove?: string;
  actions?: string;
}) {
  return prisma.retrospective.update({
    where: { sprintId },
    data,
  });
}