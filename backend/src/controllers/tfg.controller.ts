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
  const tfgs = await getAllTfgs();
  res.json(tfgs);
}

export async function getById(req: AuthRequest, res: Response) {
  const tfg = await getTfgById(Number(req.params.id), req.user!.id, req.user!.role);
  res.json(tfg);
}

export async function getMine(req: AuthRequest, res: Response) {
  const tfgs = await getTfgsByUser(req.user!.id, req.user!.role);
  res.json(tfgs);
}

export async function create(req: AuthRequest, res: Response) {
  const tfg = await createNewTfg(req.body, req.user!.id);
  res.status(201).json(tfg);
}

export async function update(req: AuthRequest, res: Response) {
  const tfg = await updateExistingTfg(
    Number(req.params.id),
    req.body,
    req.user!.id,
    req.user!.role
  );
  res.json(tfg);
}

export async function remove(req: AuthRequest, res: Response) {
  await deleteExistingTfg(Number(req.params.id), req.user!.id, req.user!.role);
  res.json({ message: "TFG eliminado correctamente" });
}
