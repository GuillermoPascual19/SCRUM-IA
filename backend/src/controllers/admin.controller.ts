import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { findAllUsers, updateUser, deleteUser } from "../repositories/admin.repository";

export async function getUsers(_req: AuthRequest, res: Response) {
  try {
    res.json(await findAllUsers());
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function patchUser(req: AuthRequest, res: Response) {
  const targetId = Number(req.params.id);
  const { role, isActive } = req.body;
  try {
    const user = await updateUser(targetId, { role, isActive });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function removeUser(req: AuthRequest, res: Response) {
  const targetId = Number(req.params.id);
  if (targetId === req.user!.id) {
    res.status(400).json({ error: "No puedes eliminar tu propia cuenta" });
    return;
  }
  try {
    await deleteUser(targetId);
    res.json({ message: "Usuario eliminado" });
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
