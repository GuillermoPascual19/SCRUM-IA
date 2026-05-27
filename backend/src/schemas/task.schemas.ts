import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  estimatedHours: z.number().min(0).max(999).optional(),
  actualHours: z.number().min(0).max(999).optional(),
  assignedTo: z.number().int().positive().optional(),
  sprintId: z.number().int().positive().optional(),
  userStoryId: z.number().int().positive().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
