import { Suspense } from "react"

import { PageHeader } from "@/components/layout/page-header"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { UsageSectionSkeleton } from "@/components/skeletons/usage-section-skeleton"
import { NetworkUsage } from "@/components/usage/network-usage"
import { TopConsumers } from "@/components/usage/top-consumers"
import { TopConsumersControls } from "@/components/usage/top-consumers-controls"
import { UsageControls } from "@/components/usage/usage-controls"
import { requireSession } from "@/lib/auth/session"
import { topConsumersQuerySchema, usageQuerySchema } from "@/lib/validations/query"
import type { SearchParams } from "@/types/query"

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function UsagePage({ searchParams }: Props) {
  await requireSession()
  const params = await searchParams
  const usage = usageQuerySchema.parse(params)
  const top = topConsumersQuerySchema.parse(params)

  return (
    <>
      <PageHeader
        title="Consumo"
        description="Quanto de dados a rede movimenta e quem mais consome. Valores aproximados, registrados a cada 5 minutos."
      />
      <UsageControls value={usage} />
      <Suspense
        key={[usage.g, usage.range, usage.from, usage.to].join("|")}
        fallback={<UsageSectionSkeleton network />}
      >
        <NetworkUsage query={usage} />
      </Suspense>

      <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Maiores consumidores</h2>
          <p className="text-sm text-muted-foreground">
            Clique em um cliente para abrir o consumo dele.
          </p>
        </div>
        <TopConsumersControls value={top} />
      </div>
      <Suspense
        key={[top.top, top.topFrom, top.topTo, top.limit].join("|")}
        fallback={<TableSkeleton columns={7} rows={10} />}
      >
        <TopConsumers query={top} />
      </Suspense>
    </>
  )
}
