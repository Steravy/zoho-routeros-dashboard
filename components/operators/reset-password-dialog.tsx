"use client"

import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { resetOperatorPassword } from "@/app/dashboard/operators/actions"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { resetPasswordSchema } from "@/lib/validations/account"
import type { ResetPasswordInput } from "@/types/auth"
import { WarningCircleIcon } from "@phosphor-icons/react/ssr"

interface Props {
  username: string
  isSelf: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResetPasswordDialog({ username, isSelf, open, onOpenChange }: Props) {
  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  })

  function close(next: boolean) {
    if (!next) {
      form.reset()
      setServerError(null)
    }
    onOpenChange(next)
  }

  function onSubmit(values: ResetPasswordInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await resetOperatorPassword(username, values)
      if (!result.ok) {
        if (result.status === 404) {
          // Stale row: the action already re-rendered the list.
          toast.error("Operador não encontrado — a lista foi atualizada")
          close(false)
          return
        }
        if (result.status === 403) {
          toast.error(result.message)
          close(false)
          return
        }
        if (result.field) {
          form.setError(result.field as keyof ResetPasswordInput, { message: result.message })
        } else {
          setServerError(result.message)
        }
        return
      }
      close(false)
      toast.success(
        result.data.self
          ? "Senha alterada. Suas outras sessões foram encerradas."
          : `Senha redefinida. ${username} foi desconectado em todos os lugares.`
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>Redefinir senha</DialogTitle>
            <DialogDescription>
              {isSelf ? (
                <>
                  Isso desconecta você de todas as <em>outras</em> sessões. Esta continua ativa.
                </>
              ) : (
                <>
                  Isso desconecta <span className="font-mono text-xs">{username}</span> de todas
                  as sessões.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="my-6">
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`reset-${field.name}`}>Nova senha</FieldLabel>
                  <Input
                    {...field}
                    id={`reset-${field.name}`}
                    type="password"
                    autoComplete="new-password"
                    autoFocus
                    disabled={pending}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Entre {PASSWORD_MIN} e {PASSWORD_MAX} caracteres.
                    {!isSelf && " Entregue a senha ao operador por outro canal."}
                  </FieldDescription>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => close(false)} disabled={pending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Spinner />}
              Redefinir senha
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
