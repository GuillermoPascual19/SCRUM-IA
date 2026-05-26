import {
  findUserStoriesByTfg,
  findUserStoryById,
  createUserStory,
  updateUserStory,
  deleteUserStory,
} from "../repositories/userStory.repository";
import { findTfgById } from "../repositories/tfg.repository";

export async function getUserStoriesByTfg(tfgId: number) {
  const tfg = await findTfgById(tfgId);
  if (!tfg) throw new Error("TFG_NOT_FOUND");
  return findUserStoriesByTfg(tfgId);
}

export async function getUserStoryById(id: number) {
  const story = await findUserStoryById(id);
  if (!story) throw new Error("USER_STORY_NOT_FOUND");
  return story;
}

export async function createNewUserStory(
  tfgId: number,
  data: {
    title: string;
    description?: string;
    acceptanceCriteria?: string;
    storyPoints?: number;
    priority?: number;
  },
  requesterId: number,
  requesterRole: string
) {
  const tfg = await findTfgById(tfgId);
  if (!tfg) throw new Error("TFG_NOT_FOUND");

  if (requesterRole !== "admin" && requesterRole !== "coordinator" && tfg.tutorId !== requesterId) {
    throw new Error("FORBIDDEN");
  }

  return createUserStory({ ...data, tfgId });
}

export async function updateExistingUserStory(
  id: number,
  data: {
    title?: string;
    description?: string;
    acceptanceCriteria?: string;
    storyPoints?: number;
    priority?: number;
    status?: string;
  },
  requesterId: number,
  requesterRole: string
) {
  const story = await findUserStoryById(id);
  if (!story) throw new Error("USER_STORY_NOT_FOUND");

  const tfg = await findTfgById(story.tfgId);
  if (requesterRole !== "admin" && requesterRole !== "coordinator" && tfg!.tutorId !== requesterId) {
    throw new Error("FORBIDDEN");
  }

  const updateData: any = { ...data };
  if (data.status === "completada" && story.status !== "completada") {
    updateData.completedAt = new Date();
  } else if (data.status && data.status !== "completada") {
    updateData.completedAt = null;
  }

  return updateUserStory(id, updateData);
}

export async function deleteExistingUserStory(
  id: number,
  requesterId: number,
  requesterRole: string
) {
  const story = await findUserStoryById(id);
  if (!story) throw new Error("USER_STORY_NOT_FOUND");

  const tfg = await findTfgById(story.tfgId);
  if (requesterRole !== "admin" && requesterRole !== "coordinator" && tfg!.tutorId !== requesterId) {
    throw new Error("FORBIDDEN");
  }

  return deleteUserStory(id);
}