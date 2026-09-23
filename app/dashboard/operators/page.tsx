import { Suspense } from "react"

import { PageHeader } from "@/components/layout/page-header"
import { OperatorsTable } from "@/components/operators/operators-table"
import { RegisterOperatorDialog } from "@/components/operators/register-operator-dialog"
import { ForbiddenState } from "@/components/shared/forbidden-state"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { getMe } from "@/lib/api/auth"

const DESCRIPTION =
  "Quem entra neste painel. Redefinir uma senha encerra as sessões daquele operador."

export default async function OperatorsPage() {
  // Server-side gate. The nav hides this route from non-admins, but a typed URL
  // must land on a 403 state with the session intact — never on the login page.
  const me = await getMe()

  if (!me.isAdmin) {
    return (
      <>
        <PageHeader title="Operadores" description={DESCRIPTION} />
        <ForbiddenState />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Operadores"
        description={DESCRIPTION}
        actions={<RegisterOperatorDialog />}
      />
      <Suspense fallback={<TableSkeleton columns={4} rows={4} />}>
        <OperatorsTable actor={me.actor} />
      </Suspense>
    </>
  )
}
