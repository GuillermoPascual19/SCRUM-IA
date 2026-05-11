import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getAllTfgs,
  getTfgById,
  getTfgsByUser,
  createNewTfg,
  updateExistingTfg,
  deleteExistingTfg,
} from "../services/tfg.service";

export async function getAll(req: AuthRequest, res: Response) {
  try {
    const tfgs = await getAllTfgs();
    res.json(tfgs);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getById(req: AuthRequest, res: Response) {
  try {
    const tfg = await getTfgById(Number(req.params.id));
    res.json(tfg);
  } catch (e: any) {
    if (e.message === "TFG_NOT_FOUND") {
      res.status(404).json({ error: "TFG no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getMine(req: AuthRequest, res: Response) {
  try {
    const tfgs = await getTfgsByUser(req.user!.id, req.user!.role);
    res.json(tfgs);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const tfg = await createNewTfg(req.body, req.user!.id);
    res.status(201).json(tfg);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const tfg = await updateExistingTfg(
      Number(req.params.id),
      req.body,
      req.user!.id,
      req.user!.role
    );
    res.json(tfg);
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

export async function remove(req: AuthRequest, res: Response) {
  try {
    await deleteExistingTfg(Number(req.params.id), req.user!.id, req.user!.role);
    res.json({ message: "TFG eliminado correctamente" });
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