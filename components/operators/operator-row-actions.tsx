"use client"

import { useState } from "react"

import { RemoveOperatorDialog } from "@/components/operators/remove-operator-dialog"
import { ResetPasswordDialog } from "@/components/operators/reset-password-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DotsThreeIcon, KeyIcon, TrashIcon } from "@phosphor-icons/react/ssr"

interface Props {
  username: string
  /** Your own row: reset swaps your session; remove is not offered (the server refuses it anyway). */
  isSelf: boolean
}

type Dialog = "reset" | "remove" | null

export function OperatorRowActions({ username, isSelf }: Props) {
  // Dialogs live outside the menu: Radix unmounts a Dialog whose trigger sits in a closing item.
  const [dialog, setDialog] = useState<Dialog>(null)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${username}`}>
            <DotsThreeIcon weight="bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setDialog("reset")}>
            <KeyIcon />
            Redefinir senha
          </DropdownMenuItem>
          {!isSelf && (
            <DropdownMenuItem variant="destructive" onSelect={() => setDialog("remove")}>
              <TrashIcon />
              Remover
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ResetPasswordDialog
        username={username}
        isSelf={isSelf}
        open={dialog === "reset"}
        onOpenChange={(open) => setDialog(open ? "reset" : null)}
      />
      {!isSelf && (
        <RemoveOperatorDialog
          username={username}
          open={dialog === "remove"}
          onOpenChange={(open) => setDialog(open ? "remove" : null)}
        />
      )}
    </>
  )
}
