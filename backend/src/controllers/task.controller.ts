import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getTasksByStory,
  getTasksBySprint,
  getTaskById,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
} from "../services/task.service";

export async function getByStory(req: AuthRequest, res: Response) {
  try {
    const tasks = await getTasksByStory(Number(req.params.userStoryId));
    res.json(tasks);
  } catch (e: any) {
    if (e.message === "USER_STORY_NOT_FOUND") {
      res.status(404).json({ error: "Historia de usuario no encontrada" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getBySprint(req: AuthRequest, res: Response) {
  try {
    const tasks = await getTasksBySprint(Number(req.params.sprintId));
    res.json(tasks);
  } catch (e: any) {
    if (e.message === "SPRINT_NOT_FOUND") {
      res.status(404).json({ error: "Sprint no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getById(req: AuthRequest, res: Response) {
  try {
    const task = await getTaskById(Number(req.params.id));
    res.json(task);
  } catch (e: any) {
    if (e.message === "TASK_NOT_FOUND") {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const task = await createNewTask(req.body);
    res.status(201).json(task);
  } catch (e: any) {
    if (e.message === "USER_STORY_NOT_FOUND") {
      res.status(404).json({ error: "Historia de usuario no encontrada" });
      return;
    }
    if (e.message === "SPRINT_NOT_FOUND") {
      res.status(404).json({ error: "Sprint no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const task = await updateExistingTask(Number(req.params.id), req.body);
    res.json(task);
  } catch (e: any) {
    if (e.message === "TASK_NOT_FOUND") {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    await deleteExistingTask(Number(req.params.id));
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (e: any) {
    if (e.message === "TASK_NOT_FOUND") {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}