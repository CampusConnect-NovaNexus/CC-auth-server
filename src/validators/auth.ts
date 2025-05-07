import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
  name: z.string().optional(),
  role: z.enum(['PHD', 'STUDENT', 'FACULTY', 'STAFF', 'ADMIN']).optional(),
});
export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});
export type LoginSchema = z.infer<typeof loginSchema>;
