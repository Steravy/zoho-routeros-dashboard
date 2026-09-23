import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { DASHBOARD_HOME } from "@/lib/constants"
import { ShieldWarningIcon } from "@phosphor-icons/react/ssr"

/**
 * A 403 is not an auth failure: the session is valid, the operator is not an
 * admin. Rendered in place — never a redirect to login.
 */
export function ForbiddenState() {
  return (
    <Empty className="flex-none border border-dashed py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldWarningIcon />
        </EmptyMedia>
        <EmptyTitle>Esta área é para admins.</EmptyTitle>
        <EmptyDescription>
          Sua sessão continua válida — só admins gerenciam operadores.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant="outline">
          <Link href={DASHBOARD_HOME}>Voltar para a visão geral</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
