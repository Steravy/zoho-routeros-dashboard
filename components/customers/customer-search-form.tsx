"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useQueryParams } from "@/hooks/use-query-params"
import { customerSearchSchema } from "@/lib/validations/auth"
import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr"

interface Props {
  initialQuery?: string
}

interface FormValues {
  q: string
}

export function CustomerSearchForm({ initialQuery = "" }: Props) {
  const { set } = useQueryParams()
  const form = useForm<FormValues>({
    resolver: zodResolver(customerSearchSchema),
    defaultValues: { q: initialQuery },
  })

  return (
    <form onSubmit={form.handleSubmit(({ q }) => set({ q }))} noValidate>
      <Controller
        name="q"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:max-w-md">
                <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  {...field}
                  id={field.name}
                  className="pl-8"
                  placeholder="Id do Zoho, nome, username ou telefone"
                  autoComplete="off"
                  autoFocus
                  aria-label="Search customers"
                  aria-invalid={fieldState.invalid}
                />
              </div>
              <Button type="submit">Buscar</Button>
            </div>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : (
              <FieldDescription>
                Telefones funcionam em qualquer formato — (+238) 9971234, 00238 9971234 e
                9971234 funcionam.
              </FieldDescription>
            )}
          </Field>
        )}
      />
    </form>
  )
}
