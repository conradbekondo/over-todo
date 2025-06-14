import { z } from 'zod';

export const CredentialSignUpSchema = z.object({
  names: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const CredentialSignInSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const NewTaskSchema = z.object({
  title: z.string(),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val === undefined || val === '') return null;
      const date = new Date(val);
      return isNaN(date.getTime()) ? null : date;
    }),
  priority: z.string().nullable().optional(),
  reminder: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});
