import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getRetrospectiveBySprint,
  createOrUpdateRetrospective,
} from "../services/retrospective.service";

export async function getBySprint(req: AuthRequest, res: Response) {
  const retrospective = await getRetrospectiveBySprint(Number(req.params.sprintId), req.user!.id, req.user!.role);
  if (!retrospective) {
    res.status(404).json({ error: "Retrospectiva no encontrada" });
    return;
  }
  res.json(retrospective);
}

export async function upsert(req: AuthRequest, res: Response) {
  const retrospective = await createOrUpdateRetrospective(
    Number(req.params.sprintId),
    req.body,
    req.user!.id,
    req.user!.role
  );
  res.json(retrospective);
}
