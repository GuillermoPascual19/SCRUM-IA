import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getRetrospectiveBySprint,
  createOrUpdateRetrospective,
} from "../services/retrospective.service";

export async function getBySprint(req: AuthRequest, res: Response) {
  try {
    const retrospective = await getRetrospectiveBySprint(Number(req.params.sprintId));
    if (!retrospective) {
      res.status(404).json({ error: "Retrospectiva no encontrada" });
      return;
    }
    res.json(retrospective);
  } catch (e: any) {
    if (e.message === "SPRINT_NOT_FOUND") {
      res.status(404).json({ error: "Sprint no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function upsert(req: AuthRequest, res: Response) {
  try {
    const retrospective = await createOrUpdateRetrospective(
      Number(req.params.sprintId),
      req.body
    );
    res.json(retrospective);
  } catch (e: any) {
    if (e.message === "SPRINT_NOT_FOUND") {
      res.status(404).json({ error: "Sprint no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}