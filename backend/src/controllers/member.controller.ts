import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getMembersByTfg,
  addMemberToTfg,
  updateScrumRole,
  removeMemberFromTfg,
} from "../services/member.service";

export async function getMembers(req: AuthRequest, res: Response) {
  try {
    const members = await getMembersByTfg(Number(req.params.tfgId));
    res.json(members);
  } catch (e: any) {
    if (e.message === "TFG_NOT_FOUND") {
      res.status(404).json({ error: "TFG no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function addMember(req: AuthRequest, res: Response) {
  try {
    const member = await addMemberToTfg(
      Number(req.params.tfgId),
      req.body.userId,
      req.body.scrumRole,
      req.user!.id,
      req.user!.role
    );
    res.status(201).json(member);
  } catch (e: any) {
    if (e.message === "TFG_NOT_FOUND") {
      res.status(404).json({ error: "TFG no encontrado" });
      return;
    }
    if (e.message === "USER_NOT_FOUND") {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    if (e.message === "ALREADY_MEMBER") {
      res.status(400).json({ error: "El usuario ya es miembro del TFG" });
      return;
    }
    if (e.message === "FORBIDDEN") {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateRole(req: AuthRequest, res: Response) {
  try {
    const member = await updateScrumRole(
      Number(req.params.tfgId),
      Number(req.params.userId),
      req.body.scrumRole,
      req.user!.id,
      req.user!.role
    );
    res.json(member);
  } catch (e: any) {
    if (e.message === "TFG_NOT_FOUND") {
      res.status(404).json({ error: "TFG no encontrado" });
      return;
    }
    if (e.message === "MEMBER_NOT_FOUND") {
      res.status(404).json({ error: "Miembro no encontrado" });
      return;
    }
    if (e.message === "FORBIDDEN") {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function removeMember(req: AuthRequest, res: Response) {
  try {
    await removeMemberFromTfg(
      Number(req.params.tfgId),
      Number(req.params.userId),
      req.user!.id,
      req.user!.role
    );
    res.json({ message: "Miembro eliminado correctamente" });
  } catch (e: any) {
    if (e.message === "TFG_NOT_FOUND") {
      res.status(404).json({ error: "TFG no encontrado" });
      return;
    }
    if (e.message === "MEMBER_NOT_FOUND") {
      res.status(404).json({ error: "Miembro no encontrado" });
      return;
    }
    if (e.message === "FORBIDDEN") {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}