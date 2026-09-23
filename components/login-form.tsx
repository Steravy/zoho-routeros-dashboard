"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { cn } from "cn"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useRetryCountdown } from "@/hooks/use-retry-countdown"
import { parseRetrySeconds } from "@/lib/auth/retry"
import { DASHBOARD_HOME } from "@/lib/constants"
import { loginSchema } from "@/lib/validations/auth"
import type { LoginInput, LoginSearch } from "@/types/auth"
import {
  ClockCountdownIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/ssr"

type Props = LoginSearch & Omit<React.ComponentProps<"form">, "onSubmit">

export function LoginForm({ next, reason, className, ...props }: Props) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const countdown = useRetryCountdown()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  })

  async function onSubmit(values: LoginInput) {
    setServerError(null)
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).catch(() => null)

    if (!response) {
      toast.error("Não foi possível conectar ao servidor")
      return
    }

    if (response.ok) {
      const { actor } = (await response.json()) as { actor: string }
      toast.success(`Conectado como ${actor}`)
      router.push(next ?? DASHBOARD_HOME)
      router.refresh()
      return
    }

    if (response.status === 503) {
      router.replace("/disabled")
      return
    }

    const { message } = (await response
      .json()
      .catch(() => ({ message: "Falha ao entrar. Tente novamente." }))) as {
      message: string
    }
    if (response.status === 429) countdown.start(parseRetrySeconds(message))
    setServerError(message)
  }

  const submitting = form.formState.isSubmitting
  const locked = countdown.locked

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Entrar</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Painel de operações da ponte Zoho ↔ RouterOS
          </p>
        </div>

        {reason === "expired" && (
          <Alert>
            <ClockCountdownIcon />
            <AlertTitle>Você foi desconectado</AlertTitle>
            <AlertDescription>
              Isso acontece quando a sessão expira, a senha é alterada ou a
              conta é removida.
            </AlertDescription>
          </Alert>
        )}

        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                autoComplete="username"
                autoFocus
                aria-invalid={fieldState.invalid}
                className="bg-background"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                className="bg-background"
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

        <Field>
          <Button type="submit" disabled={submitting || locked}>
            {submitting && <Spinner />}
            {locked ? `Tente novamente em ${countdown.retryIn}s` : "Entrar"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
