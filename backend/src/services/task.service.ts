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
import { isMemberOrTutor } from "../repositories/tfg.repository";

async function assertTfgAccess(sprintId: number, requesterId: number, requesterRole: string) {
  if (requesterRole === "admin" || requesterRole === "coordinator") return;
  const sprint = await findSprintById(sprintId);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");
  const ok = await isMemberOrTutor(sprint.tfgId, requesterId);
  if (!ok) throw new Error("FORBIDDEN");
}

export async function getTasksByStory(userStoryId: number, requesterId: number, requesterRole: string) {
  const story = await findUserStoryById(userStoryId);
  if (!story) throw new Error("USER_STORY_NOT_FOUND");
  if (requesterRole !== "admin" && requesterRole !== "coordinator") {
    const ok = await isMemberOrTutor(story.tfgId, requesterId);
    if (!ok) throw new Error("FORBIDDEN");
  }
  return findTasksByStory(userStoryId);
}

export async function getTasksBySprint(sprintId: number, requesterId: number, requesterRole: string) {
  const sprint = await findSprintById(sprintId);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");
  if (requesterRole !== "admin" && requesterRole !== "coordinator") {
    const ok = await isMemberOrTutor(sprint.tfgId, requesterId);
    if (!ok) throw new Error("FORBIDDEN");
  }
  return findTasksBySprint(sprintId);
}

export async function getTaskById(id: number, requesterId: number, requesterRole: string) {
  const task = await findTaskById(id);
  if (!task) throw new Error("TASK_NOT_FOUND");
  if (requesterRole !== "admin" && requesterRole !== "coordinator") {
    await assertTfgAccess(task.sprintId, requesterId, requesterRole);
  }
  return task;
}

export async function createNewTask(
  data: {
    userStoryId: number;
    sprintId: number;
    title: string;
    description?: string;
    assignedTo?: number;
    estimatedHours?: number;
  },
  requesterId: number,
  requesterRole: string
) {
  const story = await findUserStoryById(data.userStoryId);
  if (!story) throw new Error("USER_STORY_NOT_FOUND");

  const sprint = await findSprintById(data.sprintId);
  if (!sprint) throw new Error("SPRINT_NOT_FOUND");

  if (requesterRole !== "admin" && requesterRole !== "coordinator") {
    const ok = await isMemberOrTutor(sprint.tfgId, requesterId);
    if (!ok) throw new Error("FORBIDDEN");
  }

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
  },
  requesterId: number,
  requesterRole: string
) {
  const task = await findTaskById(id);
  if (!task) throw new Error("TASK_NOT_FOUND");
  await assertTfgAccess(task.sprintId, requesterId, requesterRole);
  return updateTask(id, data);
}

export async function deleteExistingTask(id: number, requesterId: number, requesterRole: string) {
  const task = await findTaskById(id);
  if (!task) throw new Error("TASK_NOT_FOUND");
  await assertTfgAccess(task.sprintId, requesterId, requesterRole);
  return deleteTask(id);
}
