import {
  findAllTfgs,
  findTfgById,
  findTfgsByTutor,
  findTfgsByMember,
  createTfg,
  updateTfg,
  deleteTfg,
  hasGradeOrReport,
} from "../repositories/tfg.repository";

export async function getAllTfgs() {
  return findAllTfgs();
}

export async function getTfgById(id: number) {
  const tfg = await findTfgById(id);
  if (!tfg) throw new Error("TFG_NOT_FOUND");
  return tfg;
}

export async function getTfgsByUser(userId: number, role: string) {
  if (role === "coordinator" || role === "admin") return findAllTfgs();
  if (role === "teacher") return findTfgsByTutor(userId);
  return findTfgsByMember(userId);
}

export async function createNewTfg(
  data: {
    title: string;
    description?: string;
    academicYear?: string;
    repositoryUrl?: string;
    githubToken?: string;
  },
  tutorId: number
) {
  return createTfg({ ...data, tutorId });
}

export async function updateExistingTfg(
  id: number,
  data: {
    title?: string;
    description?: string;
    academicYear?: string;
    status?: string;
    repositoryUrl?: string;
    githubToken?: string;
  },
  userId: number,
  userRole: string
) {
  const tfg = await findTfgById(id);
  if (!tfg) throw new Error("TFG_NOT_FOUND");

  if (userRole !== "admin" && userRole !== "coordinator" && tfg.tutorId !== userId) {
    throw new Error("FORBIDDEN");
  }

  if (data.status === "completed" && tfg.status !== "completed") {
    const hasGrade = await hasGradeOrReport(id);
    if (!hasGrade) throw new Error("TFG_NO_GRADE_OR_REPORT");
  }

  return updateTfg(id, data);
}

export async function deleteExistingTfg(id: number, userId: number, userRole: string) {
  const tfg = await findTfgById(id);
  if (!tfg) throw new Error("TFG_NOT_FOUND");

  if (userRole !== "admin" && userRole !== "coordinator" && tfg.tutorId !== userId) {
    throw new Error("FORBIDDEN");
  }

  return deleteTfg(id);
}