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
  const tasks = await getTasksByStory(Number(req.params.userStoryId), req.user!.id, req.user!.role);
  res.json(tasks);
}

export async function getBySprint(req: AuthRequest, res: Response) {
  const tasks = await getTasksBySprint(Number(req.params.sprintId), req.user!.id, req.user!.role);
  res.json(tasks);
}

export async function getById(req: AuthRequest, res: Response) {
  const task = await getTaskById(Number(req.params.id), req.user!.id, req.user!.role);
  res.json(task);
}

export async function create(req: AuthRequest, res: Response) {
  const task = await createNewTask(req.body, req.user!.id, req.user!.role);
  res.status(201).json(task);
}

export async function update(req: AuthRequest, res: Response) {
  const task = await updateExistingTask(Number(req.params.id), req.body, req.user!.id, req.user!.role);
  res.json(task);
}

export async function remove(req: AuthRequest, res: Response) {
  await deleteExistingTask(Number(req.params.id), req.user!.id, req.user!.role);
  res.json({ message: "Tarea eliminada correctamente" });
}
