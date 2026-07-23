import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  generateEvaluation,
  getEvaluationsByTfg,
  updateEvaluation,
  generateFinalGrade,
  getFinalGradesByTfg,
  updateFinalGrade,
  generateRetroInsights,
  generateTfgSummary,
  getTfgReports,
  deleteTfgReport,
} from "../services/ai.service";

export async function generate(req: AuthRequest, res: Response) {
  const { sprintId, studentId } = req.body;
  const tfgId = Number(req.params.tfgId);
  if (!sprintId || !studentId) {
    res.status(400).json({ error: "sprintId y studentId son requeridos" });
    return;
  }
  const evaluation = await generateEvaluation(
    tfgId,
    Number(sprintId),
    Number(studentId),
    req.user!.id
  );
  res.status(201).json(evaluation);
}

export async function getByTfg(req: AuthRequest, res: Response) {
  const evaluations = await getEvaluationsByTfg(Number(req.params.tfgId), req.user!.id, req.user!.role);
  res.json(evaluations);
}

export async function update(req: AuthRequest, res: Response) {
  const evaluation = await updateEvaluation(Number(req.params.id), req.body, Number(req.params.tfgId));
  res.json(evaluation);
}

export async function generateFinal(req: AuthRequest, res: Response) {
  const { studentId } = req.body;
  const tfgId = Number(req.params.tfgId);
  if (!studentId) {
    res.status(400).json({ error: "studentId es requerido" });
    return;
  }
  const grade = await generateFinalGrade(tfgId, Number(studentId), req.user!.id);
  res.status(201).json(grade);
}

export async function getFinalGrades(req: AuthRequest, res: Response) {
  const grades = await getFinalGradesByTfg(Number(req.params.tfgId), req.user!.id, req.user!.role);
  res.json(grades);
}

export async function updateFinal(req: AuthRequest, res: Response) {
  const grade = await updateFinalGrade(Number(req.params.id), req.body, Number(req.params.tfgId));
  res.json(grade);
}

export async function retroInsights(req: AuthRequest, res: Response) {
  const tfgId = Number(req.params.tfgId);
  const sprintId = Number(req.params.sprintId);
  const insights = await generateRetroInsights(tfgId, sprintId);
  res.json(insights);
}

export async function tfgSummary(req: AuthRequest, res: Response) {
  const tfgId = Number(req.params.tfgId);
  const { prompt } = req.body;
  const result = await generateTfgSummary(tfgId, req.user!.id, prompt);
  res.status(201).json(result);
}

export async function getReports(req: AuthRequest, res: Response) {
  const reports = await getTfgReports(Number(req.params.tfgId));
  res.json(reports);
}

export async function deleteReport(req: AuthRequest, res: Response) {
  await deleteTfgReport(Number(req.params.reportId), Number(req.params.tfgId));
  res.json({ message: "Informe eliminado" });
}
