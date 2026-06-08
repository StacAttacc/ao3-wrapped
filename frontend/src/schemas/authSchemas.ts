import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(150, 'Username too long'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(150, 'Username must be 150 characters or fewer')
    .regex(/^[\w.@+-]+$/, 'Letters, numbers, and @/./+/-/_ only'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords don't match", path: ['confirmPassword'] },
);

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
