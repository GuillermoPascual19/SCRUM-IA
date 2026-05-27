import { z } from "zod";

export const createTfgSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["active", "completed", "revision"]).optional(),
  academicYear: z.string().max(10).optional(),
  repoUrl: z.string().url().optional().or(z.literal("")),
});

export const updateTfgSchema = createTfgSchema.partial();

export const addMemberSchema = z.object({
  userId: z.number().int().positive(),
  scrumRole: z.string().max(50).optional(),
});

export const updateMemberRoleSchema = z.object({
  scrumRole: z.string().max(50),
});
