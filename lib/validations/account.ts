import { z } from "zod"

import { EMAIL_MAX, PASSWORD_MAX, PASSWORD_MIN } from "@/lib/constants"
import type {
  ChangePasswordInput,
  RegisterOperatorInput,
  ResetPasswordInput,
} from "@/types/auth"

const passwordLength = `A senha precisa ter entre ${PASSWORD_MIN} e ${PASSWORD_MAX} caracteres`

/** A *new* password. Login has no rule on purpose — old passwords may be anything. */
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, passwordLength)
  .max(PASSWORD_MAX, passwordLength)

export const operatorUsernameSchema = z
  .email("Informe um e-mail válido")
  .max(EMAIL_MAX, `O e-mail pode ter no máximo ${EMAIL_MAX} caracteres`)

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe sua senha atual"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Repita a nova senha"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    error: "As senhas não coincidem",
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ["newPassword"],
    error: "A nova senha precisa ser diferente da atual",
  }) satisfies z.ZodType<ChangePasswordInput>

export const registerOperatorSchema = z.object({
  username: operatorUsernameSchema,
  password: passwordSchema,
}) satisfies z.ZodType<RegisterOperatorInput>

export const resetPasswordSchema = z.object({
  password: passwordSchema,
}) satisfies z.ZodType<ResetPasswordInput>
