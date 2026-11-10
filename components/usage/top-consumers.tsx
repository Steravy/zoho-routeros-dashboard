import { EmptyState } from "@/components/shared/empty-state"
import { SectionError } from "@/components/shared/section-error"
import { TopConsumersTable } from "@/components/usage/top-consumers-table"
import { UsageNotRecordedYet } from "@/components/usage/usage-empty"
import { ApiError } from "@/lib/api/client"
import { formatZonedDateTime } from "@/lib/format"
import { timezoneLabel } from "@/lib/labels"
import { loadTopConsumers, type TopConsumersResult } from "@/lib/usage/top"
import type { TopConsumersQuery } from "@/types/query"
import { MoonStarsIcon } from "@phosphor-icons/react/ssr"

interface Props {
  query: TopConsumersQuery
}

/** Who used the most data in the period, with each row's share of the network when the ranges match. */
export async function TopConsumers({ query }: Props) {
  let result: TopConsumersResult
  try {
    result = await loadTopConsumers(query)
  } catch (error) {
    if (error instanceof ApiError) {
      return <SectionError title="Não foi possível carregar o ranking" messages={error.messages} />
    }
    throw error
  }

  const { top, networkTotalBytes } = result
  if (top.samplingSince === null) return <UsageNotRecordedYet />
  if (top.items.length === 0) {
    return (
      <EmptyState
        icon={<MoonStarsIcon />}
        title="Sem tráfego neste período"
        description="Nenhum username registrou consumo no intervalo escolhido."
      />
    )
  }

  return (
    <div className="space-y-3">
      <TopConsumersTable items={top.items} networkTotalBytes={networkTotalBytes} />
      <p className="text-sm text-muted-foreground">
        De {formatZonedDateTime(top.from, top.timezone)} a{" "}
        {formatZonedDateTime(top.to, top.timezone)}, no horário de {timezoneLabel(top.timezone)}.
        {networkTotalBytes === undefined &&
          " A participação na rede não é mostrada porque o total da rede não cobre exatamente este intervalo."}
      </p>
    </div>
  )
}
