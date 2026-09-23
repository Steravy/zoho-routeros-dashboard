"use client"

import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { changePassword } from "@/app/dashboard/account/actions"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useRetryCountdown } from "@/hooks/use-retry-countdown"
import { PASSWORD_MAX, PASSWORD_MIN } from "@/lib/constants"
import { changePasswordSchema } from "@/lib/validations/account"
import type { ChangePasswordInput } from "@/types/auth"
import { WarningCircleIcon } from "@phosphor-icons/react/ssr"

const EMPTY: ChangePasswordInput = { currentPassword: "", newPassword: "", confirmPassword: "" }

export function ChangePasswordForm() {
  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const countdown = useRetryCountdown()

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY,
  })

  function onSubmit(values: ChangePasswordInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await changePassword(values)
      if (!result.ok) {
        if (result.field) {
          form.setError(result.field as keyof ChangePasswordInput, { message: result.message })
        } else {
          setServerError(result.message)
        }
        // Same throttle as login, keyed on this account: five wrong current passwords lock it.
        if (result.status === 429) countdown.start(result.retryInSeconds)
        return
      }
      form.reset(EMPTY)
      toast.success("Senha alterada. Suas outras sessões foram encerradas.")
    })
  }

  const disabled = pending || countdown.locked

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar senha</CardTitle>
        <CardDescription>
          A nova senha vale a partir de agora; as outras sessões desta conta são encerradas.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <CardContent>
          <FieldGroup>
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Senha atual</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    autoComplete="current-password"
                    disabled={disabled}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nova senha</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    autoComplete="new-password"
                    disabled={disabled}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Entre {PASSWORD_MIN} e {PASSWORD_MAX} caracteres, diferente da atual.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Confirmar nova senha</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    autoComplete="new-password"
                    disabled={disabled}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {serverError && (
              <Alert variant="destructive">
                <WarningCircleIcon />
                <AlertTitle>{serverError}</AlertTitle>
              </Alert>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-6">
          <Button type="submit" disabled={disabled}>
            {pending && <Spinner />}
            {countdown.locked ? `Tente novamente em ${countdown.retryIn}s` : "Alterar senha"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
