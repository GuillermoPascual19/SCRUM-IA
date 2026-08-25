import { z } from "zod";

export const createUserStorySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.number().int().min(1).optional(),
  storyPoints: z.number().int().min(0).max(100).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
});

export const updateUserStorySchema = createUserStorySchema.partial();
