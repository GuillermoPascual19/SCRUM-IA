import {
  findTasksByStory,
  findTasksBySprint,
  findTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../repositories/task.repository";
import { findSprintById } from "../repositories/sprint.repository";
import { findUserStoryById } from "../repositories/userStory.repository";

export async function getTasksByStory(userStoryId: number) {
  const story = await findUserStoryById(userStoryId);
  if (!story) throw new Error("USER_STORY_NOT_FOUND");
  return findTasksByStory(userStoryId);
}

export async function getTasksBySprint(sprintId: number) {
  const sprint = await findSprintById(sprintId);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");
  return findTasksBySprint(sprintId);
}

export async function getTaskById(id: number) {
  const task = await findTaskById(id);
  if (!task) throw new Error("TASK_NOT_FOUND");
  return task;
}

export async function createNewTask(data: {
  userStoryId: number;
  sprintId: number;
  title: string;
  description?: string;
  assignedTo?: number;
  estimatedHours?: number;
}) {
  const story = await findUserStoryById(data.userStoryId);
  if (!story) throw new Error("USER_STORY_NOT_FOUND");

  const sprint = await findSprintById(data.sprintId);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");

  return createTask(data);
}

export async function updateExistingTask(
  id: number,
  data: {
    title?: string;
    description?: string;
    status?: string;
    assignedTo?: number;
    estimatedHours?: number;
    actualHours?: number;
  }
) {
  const task = await findTaskById(id);
  if (!task) throw new Error("TASK_NOT_FOUND");
  return updateTask(id, data);
}

export async function deleteExistingTask(id: number) {
  const task = await findTaskById(id);
  if (!task) throw new Error("TASK_NOT_FOUND");
  return deleteTask(id);
}