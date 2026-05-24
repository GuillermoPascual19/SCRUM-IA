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
} from "../services/ai.service";

export async function generate(req: AuthRequest, res: Response) {
  const { sprintId, studentId } = req.body;
  const tfgId = Number(req.params.tfgId);

  if (!sprintId || !studentId) {
    res.status(400).json({ error: "sprintId y studentId son requeridos" });
    return;
  }

  try {
    const evaluation = await generateEvaluation(
      tfgId,
      Number(sprintId),
      Number(studentId),
      req.user!.id
    );
    res.status(201).json(evaluation);
  } catch (e: any) {
    if (e.message === "DATA_NOT_FOUND") {
      res.status(404).json({ error: "Datos no encontrados" });
      return;
    }
    if (e.message === "AI_INVALID_RESPONSE" || e.message === "AI_INVALID_JSON") {
      res.status(500).json({ error: "Error al procesar la respuesta de la IA" });
      return;
    }
    res.status(500).json({ error: "Error al generar la evaluación" });
  }
}

export async function getByTfg(req: AuthRequest, res: Response) {
  try {
    const evaluations = await getEvaluationsByTfg(Number(req.params.tfgId));
    res.json(evaluations);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const evaluation = await updateEvaluation(Number(req.params.id), req.body);
    res.json(evaluation);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function generateFinal(req: AuthRequest, res: Response) {
  const { studentId } = req.body;
  const tfgId = Number(req.params.tfgId);

  if (!studentId) {
    res.status(400).json({ error: "studentId es requerido" });
    return;
  }

  try {
    const grade = await generateFinalGrade(tfgId, Number(studentId), req.user!.id);
    res.status(201).json(grade);
  } catch (e: any) {
    if (e.message === "NO_EVALUATIONS") {
      res.status(400).json({ error: "El estudiante no tiene evaluaciones de sprint" });
      return;
    }
    if (e.message === "AI_INVALID_RESPONSE" || e.message === "AI_INVALID_JSON") {
      res.status(500).json({ error: "Error al procesar la respuesta de la IA" });
      return;
    }
    res.status(500).json({ error: "Error al generar la nota final" });
  }
}

export async function getFinalGrades(req: AuthRequest, res: Response) {
  try {
    const grades = await getFinalGradesByTfg(Number(req.params.tfgId));
    res.json(grades);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateFinal(req: AuthRequest, res: Response) {
  try {
    const grade = await updateFinalGrade(Number(req.params.id), req.body);
    res.json(grade);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function retroInsights(req: AuthRequest, res: Response) {
  const tfgId = Number(req.params.tfgId);
  const sprintId = Number(req.params.sprintId);

  try {
    const insights = await generateRetroInsights(tfgId, sprintId);
    res.json(insights);
  } catch (e: any) {
    if (e.message === "SPRINT_NOT_FOUND") {
      res.status(404).json({ error: "Sprint no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error al generar insights" });
  }
}

export async function tfgSummary(req: AuthRequest, res: Response) {
  const tfgId = Number(req.params.tfgId);
  const { prompt } = req.body;
  try {
    const result = await generateTfgSummary(tfgId, prompt);
    res.json(result);
  } catch (e: any) {
    if (e.message === "TFG_NOT_FOUND") {
      res.status(404).json({ error: "TFG no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error al generar el informe" });
  }
}
