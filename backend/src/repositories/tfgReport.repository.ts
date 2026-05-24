import { prisma } from "../lib/prisma";

export function createTfgReport(data: {
  tfgId: number;
  professorId: number;
  content: string;
  customPrompt?: string | null;
}) {
  return prisma.tfgReport.create({
    data,
    include: {
      professor: { select: { id: true, name: true } },
    },
  });
}

export function getTfgReportsByTfgId(tfgId: number) {
  return prisma.tfgReport.findMany({
    where: { tfgId },
    include: {
      professor: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
