import Link from "next/link"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { UserMinusIcon } from "@phosphor-icons/react/ssr"

export default function CustomerNotFound() {
  return (
    <EmptyState
      icon={<UserMinusIcon />}
      title="Nenhum cliente com esse id do Zoho"
      description="A ponte não tem mapeamento, nenhum registro de auditoria e nada na fila para ele. Confira o id ou busque por nome ou telefone."
      action={
        <Button asChild variant="outline">
          <Link href="/dashboard/customers">Voltar para a busca</Link>
        </Button>
      }
    />
  )
}
