import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getSprintsByTfg,
  getSprintById,
  createNewSprint,
  updateExistingSprint,
  deleteExistingSprint,
  getBurndownData,
  getSprintPlanner,
} from "../services/sprint.service";

export async function getByTfg(req: AuthRequest, res: Response) {
  const sprints = await getSprintsByTfg(Number(req.params.tfgId));
  res.json(sprints);
}

export async function getById(req: AuthRequest, res: Response) {
  const sprint = await getSprintById(Number(req.params.id));
  res.json(sprint);
}

export async function create(req: AuthRequest, res: Response) {
  const sprint = await createNewSprint(
    Number(req.params.tfgId),
    req.body,
    req.user!.id,
    req.user!.role
  );
  res.status(201).json(sprint);
}

export async function update(req: AuthRequest, res: Response) {
  const sprint = await updateExistingSprint(
    Number(req.params.id),
    req.body,
    req.user!.id,
    req.user!.role
  );
  res.json(sprint);
}

export async function remove(req: AuthRequest, res: Response) {
  await deleteExistingSprint(
    Number(req.params.id),
    req.user!.id,
    req.user!.role
  );
  res.json({ message: "Sprint eliminado correctamente" });
}

export async function burndown(req: AuthRequest, res: Response) {
  const data = await getBurndownData(Number(req.params.id));
  res.json(data);
}

export async function planner(req: AuthRequest, res: Response) {
  const data = await getSprintPlanner(Number(req.params.tfgId));
  res.json(data);
}
