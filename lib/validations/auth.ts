import { z } from "zod"

import type { LoginSearch } from "@/types/auth"

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Enter your username")
    .max(64, "Username is too long"),
  password: z.string().min(1, "Enter your password"),
})

/** `?next=` must be a same-origin path — never an absolute URL or `//host`. */
export const loginSearchSchema = z.object({
  next: z
    .string()
    .regex(/^\/(?!\/)/)
    .optional()
    .catch(undefined),
  reason: z.enum(["expired"]).optional().catch(undefined),
}) satisfies z.ZodType<LoginSearch>

export const customerSearchSchema = z.object({
  q: z
    .string()
    .trim()
    .min(2, "Type at least 2 characters")
    .max(120, "Keep it under 120 characters"),
})
