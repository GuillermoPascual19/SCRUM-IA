import { z } from "zod";

export const generateEvaluationSchema = z.object({
  sprintId: z.number().int().positive(),
  studentId: z.number().int().positive(),
});

export const generateFinalSchema = z.object({
  studentId: z.number().int().positive(),
});

export const updateEvaluationSchema = z.object({
  finalScore: z.number().min(0).max(10).optional(),
  comments: z.string().max(2000).optional(),
  weight: z.number().min(0).max(100).optional(),
});

export const tfgSummarySchema = z.object({
  prompt: z.string().max(1000).optional(),
});

export const adminPatchUserSchema = z.object({
  role: z.enum(["student", "teacher", "coordinator", "admin"]).optional(),
  isActive: z.boolean().optional(),
});
