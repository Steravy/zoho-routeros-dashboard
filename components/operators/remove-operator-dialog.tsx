"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { removeOperator } from "@/app/dashboard/operators/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"

interface Props {
  username: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RemoveOperatorDialog({ username, open, onOpenChange }: Props) {
  const [pending, startTransition] = useTransition()

  function confirm(event: React.MouseEvent) {
    // Keep the dialog open while the action runs; close it ourselves on completion.
    event.preventDefault()
    startTransition(async () => {
      const result = await removeOperator(username)
      onOpenChange(false)
      if (!result.ok) {
        toast.error(
          result.status === 404
            ? "Operador não encontrado — a lista foi atualizada"
            : result.message
        )
        return
      }
      toast.success(`${result.data.username} foi removido.`)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remover <span className="font-mono text-sm">{username}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            O acesso termina imediatamente: a próxima requisição dessa conta é recusada. Esta
            ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={confirm} disabled={pending}>
            {pending && <Spinner />}
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
