import { Suspense } from "react"

import { PageHeader } from "@/components/layout/page-header"
import { OutageTotals } from "@/components/outages/outage-totals"
import { OutagesTable } from "@/components/outages/outages-table"
import { WindowSelect } from "@/components/shared/window-select"
import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { requireSession } from "@/lib/auth/session"
import { windowQuerySchema } from "@/lib/validations/query"
import type { SearchParams } from "@/types/query"

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function OutagesPage({ searchParams }: Props) {
  await requireSession()
  const { window } = windowQuerySchema.parse(await searchParams)

  return (
    <>
      <PageHeader
        title="Quedas"
        description="Todas as vezes que a conexão com o roteador caiu. Eventos adiados são reprocessados quando ela volta."
        actions={<WindowSelect value={window} />}
      />
      <Suspense
        fallback={<StatGridSkeleton count={5} className="grid gap-4 grid-cols-2 lg:grid-cols-5" />}
      >
        <OutageTotals window={window} />
      </Suspense>
      <Suspense fallback={<TableSkeleton columns={5} />}>
        <OutagesTable window={window} />
      </Suspense>
    </>
  )
}
