import { DriftTable } from "@/components/drift/drift-table"
import { DriftTabs } from "@/components/drift/drift-tabs"
import { CursorPagination } from "@/components/shared/cursor-pagination"
import { StaleBanner } from "@/components/shared/stale-banner"
import { UnavailableState } from "@/components/shared/unavailable-state"
import { getDrift } from "@/lib/api/ops"
import { formatCount } from "@/lib/format"
import { DRIFT_BUCKET_DESCRIPTIONS } from "@/lib/labels"
import type { DriftQuery } from "@/types/query"

interface Props {
  query: DriftQuery
}

/** One router read feeds tabs, proportion line and table, so they always agree. */
export async function DriftSection({ query }: Props) {
  const drift = await getDrift(query)
  const data = drift.data

  if (!data) {
    return (
      <UnavailableState
        title="Sem dados de divergência"
        reason={drift.unavailableReason ?? "O roteador ainda não respondeu."}
      />
    )
  }

  return (
    <div className="space-y-4">
      <StaleBanner read={drift} />
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{formatCount(data.totals.secrets)}</span>{" "}
        secrets no roteador,{" "}
        <span className="font-medium text-foreground">{formatCount(data.totals.mappings)}</span>{" "}
        mapeamentos salvos. Os mapeamentos são gravados sob demanda, então muitos órfãos
        no início significam uma tabela incompleta, não uma divergência real.
      </p>
      <div className="space-y-1">
        <DriftTabs value={data.bucket} counts={data.counts} />
        <p className="text-sm text-muted-foreground">{DRIFT_BUCKET_DESCRIPTIONS[data.bucket]}</p>
      </div>
      <DriftTable bucket={data.bucket} items={data.page.items} />
      <CursorPagination nextCursor={data.page.nextCursor} count={data.page.items.length} />
    </div>
  )
}
