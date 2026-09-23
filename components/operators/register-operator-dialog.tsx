"use client"

import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { registerOperator } from "@/app/dashboard/operators/actions"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { PASSWORD_MAX, PASSWORD_MIN } from "@/lib/constants"
import { registerOperatorSchema } from "@/lib/validations/account"
import type { RegisterOperatorInput } from "@/types/auth"
import { UserPlusIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr"

const EMPTY: RegisterOperatorInput = { username: "", password: "" }

export function RegisterOperatorDialog() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<RegisterOperatorInput>({
    resolver: zodResolver(registerOperatorSchema),
    defaultValues: EMPTY,
  })

  function close(next: boolean) {
    if (!next) {
      form.reset(EMPTY)
      setServerError(null)
    }
    setOpen(next)
  }

  function onSubmit(values: RegisterOperatorInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await registerOperator(values)
      if (!result.ok) {
        if (result.status === 403) {
          toast.error(result.message)
          close(false)
          return
        }
        if (result.field) {
          form.setError(result.field as keyof RegisterOperatorInput, {
            message: result.message,
          })
        } else {
          setServerError(result.message)
        }
        return
      }
      const { operator } = result.data
      close(false)
      toast.success(`${operator.username} já pode entrar.`, {
        description: operator.isAdmin ? "Registrado como admin." : undefined,
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlusIcon />
          Registrar operador
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>Registrar operador</DialogTitle>
            <DialogDescription>
              {/* Quem é admin é decidido no servidor (ADMIN_EMAILS), não aqui. */}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="my-6">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`register-${field.name}`}>
                    E-mail
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`register-${field.name}`}
                    type="email"
                    autoComplete="off"
                    autoFocus
                    disabled={pending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`register-${field.name}`}>
                    Senha inicial
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`register-${field.name}`}
                    type="password"
                    autoComplete="new-password"
                    disabled={pending}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Entre {PASSWORD_MIN} e {PASSWORD_MAX} caracteres. Entregue
                    por outro canal; o operador pode trocá-la em Minha conta.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => close(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Spinner />}
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
