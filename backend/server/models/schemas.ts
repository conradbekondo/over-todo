import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const TaskFetchParamsSchema = z.object({
  after: z
    .union([z.string().date().optional(), z.date().optional()])
    .transform((v) => {
      if (!v) return new Date(Date.now() - 3_600_000 * 48);
      else if (typeof v == "string") return new Date(Date.parse(v));
      return v;
    }),
  limit: z
    .union([
      z
        .string()
        .regex(/^[0-9]+$/, "Invalid number")
        .optional(),
      z.number().positive().optional(),
    ])
    .transform((v) => {
      if (!v) return 10;
      else if (typeof v == "string") return Math.abs(parseInt(v, 10));
      return v;
    }),
});

export const TaskDtoSchema = createSelectSchema(tasks).omit({
  fcmSend: true,
  fcmSentAt: true,
  fcmStatus: true,
  owner: true,
});

export const CredentialSignUpSchema = z.object({
  names: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const CredentialSignInSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const NewTodoSchema = z.object({
  title: z.string().nonempty(),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      const date = new Date(val);
      return isNaN(date.getTime()) ? null : date;
    }),
  priority: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) =>
        val === "high" || val === "low" || val === null || val === undefined
    )
    .transform((v) => v as "low" | "high"),
  reminder: z
    .string()
    .optional()
    .refine((val) => val === null || /^([0-9]+[dmh])+$/i.test(val))
    .nullable(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});
