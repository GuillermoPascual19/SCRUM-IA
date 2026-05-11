import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getSprintsByTfg,
  getSprintById,
  createNewSprint,
  updateExistingSprint,
  deleteExistingSprint,
} from "../services/sprint.service";

export async function getByTfg(req: AuthRequest, res: Response) {
  try {
    const sprints = await getSprintsByTfg(Number(req.params.tfgId));
    res.json(sprints);
  } catch (e: any) {
    if (e.message === "TFG_NOT_FOUND") {
      res.status(404).json({ error: "TFG no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getById(req: AuthRequest, res: Response) {
  try {
    const sprint = await getSprintById(Number(req.params.id));
    res.json(sprint);
  } catch (e: any) {
    if (e.message === "SPRINT_NOT_FOUND") {
      res.status(404).json({ error: "Sprint no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const sprint = await createNewSprint(
      Number(req.params.tfgId),
      req.body,
      req.user!.id,
      req.user!.role
    );
    res.status(201).json(sprint);
  } catch (e: any) {
    if (e.message === "TFG_NOT_FOUND") {
      res.status(404).json({ error: "TFG no encontrado" });
      return;
    }
    if (e.message === "FORBIDDEN") {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const sprint = await updateExistingSprint(
      Number(req.params.id),
      req.body,
      req.user!.id,
      req.user!.role
    );
    res.json(sprint);
  } catch (e: any) {
    if (e.message === "SPRINT_NOT_FOUND") {
      res.status(404).json({ error: "Sprint no encontrado" });
      return;
    }
    if (e.message === "FORBIDDEN") {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    await deleteExistingSprint(
      Number(req.params.id),
      req.user!.id,
      req.user!.role
    );
    res.json({ message: "Sprint eliminado correctamente" });
  } catch (e: any) {
    if (e.message === "SPRINT_NOT_FOUND") {
      res.status(404).json({ error: "Sprint no encontrado" });
      return;
    }
    if (e.message === "FORBIDDEN") {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}