import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getUserStoriesByTfg,
  getUserStoryById,
  createNewUserStory,
  updateExistingUserStory,
  deleteExistingUserStory,
} from "../services/userStory.service";

export async function getByTfg(req: AuthRequest, res: Response) {
  try {
    const stories = await getUserStoriesByTfg(Number(req.params.tfgId));
    res.json(stories);
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
    const story = await getUserStoryById(Number(req.params.id));
    res.json(story);
  } catch (e: any) {
    if (e.message === "USER_STORY_NOT_FOUND") {
      res.status(404).json({ error: "Historia de usuario no encontrada" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const story = await createNewUserStory(
      Number(req.params.tfgId),
      req.body,
      req.user!.id,
      req.user!.role
    );
    res.status(201).json(story);
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
    const story = await updateExistingUserStory(
      Number(req.params.id),
      req.body,
      req.user!.id,
      req.user!.role
    );
    res.json(story);
  } catch (e: any) {
    if (e.message === "USER_STORY_NOT_FOUND") {
      res.status(404).json({ error: "Historia de usuario no encontrada" });
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
    await deleteExistingUserStory(
      Number(req.params.id),
      req.user!.id,
      req.user!.role
    );
    res.json({ message: "Historia de usuario eliminada correctamente" });
  } catch (e: any) {
    if (e.message === "USER_STORY_NOT_FOUND") {
      res.status(404).json({ error: "Historia de usuario no encontrada" });
      return;
    }
    if (e.message === "FORBIDDEN") {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}