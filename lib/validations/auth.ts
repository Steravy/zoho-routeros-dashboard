import { z } from "zod"

import { EMAIL_MAX } from "@/lib/constants"
import type { LoginSearch } from "@/types/auth"

export const loginSchema = z.object({
  // Not trimmed or lower-cased here: the server normalizes the email itself.
  username: z
    .string()
    .min(1, "Informe seu e-mail")
    .max(EMAIL_MAX, "E-mail muito longo"),
  password: z.string().min(1, "Informe sua senha"),
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
    .min(2, "Digite pelo menos 2 caracteres")
    .max(120, "Use no máximo 120 caracteres"),
})
