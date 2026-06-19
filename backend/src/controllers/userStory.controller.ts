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
  const stories = await getUserStoriesByTfg(Number(req.params.tfgId));
  res.json(stories);
}

export async function getById(req: AuthRequest, res: Response) {
  const story = await getUserStoryById(Number(req.params.id));
  res.json(story);
}

export async function create(req: AuthRequest, res: Response) {
  const story = await createNewUserStory(
    Number(req.params.tfgId),
    req.body,
    req.user!.id,
    req.user!.role
  );
  res.status(201).json(story);
}

export async function update(req: AuthRequest, res: Response) {
  const story = await updateExistingUserStory(
    Number(req.params.id),
    req.body,
    req.user!.id,
    req.user!.role
  );
  res.json(story);
}

export async function remove(req: AuthRequest, res: Response) {
  await deleteExistingUserStory(
    Number(req.params.id),
    req.user!.id,
    req.user!.role
  );
  res.json({ message: "Historia de usuario eliminada correctamente" });
}
