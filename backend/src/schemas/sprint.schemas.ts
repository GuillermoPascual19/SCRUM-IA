import { z } from "zod";

export const createSprintSchema = z.object({
  name: z.string().min(1).max(100),
  goal: z.string().max(500).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(["planned", "active", "completed"]).optional(),
});

export const updateSprintSchema = createSprintSchema.partial();
