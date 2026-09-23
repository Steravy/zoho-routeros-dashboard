"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { CopyIcon } from "@phosphor-icons/react/ssr"

interface Props {
  value: string
  /** What is being copied, for the tooltip and toast: "username", "id do Zoho". */
  label: string
}

/** The dashboard cannot write — operators fix things by hand, so copying ids and usernames must be effortless. */
export function CopyButton({ value, label }: Props) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`Copiado: ${label}`)
    } catch {
      toast.error(`Não foi possível copiar: ${label}`)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-6 text-muted-foreground"
      onClick={copy}
      aria-label={`Copy ${label}`}
      title={`Copiar ${label}`}
    >
      <CopyIcon />
    </Button>
  )
}
