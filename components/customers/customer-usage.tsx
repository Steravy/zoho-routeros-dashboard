import { SectionError } from "@/components/shared/section-error"
import { UsageChartCard } from "@/components/usage/usage-chart-card"
import { UsageNoUsername, UsageNotRecordedYet } from "@/components/usage/usage-empty"
import { UsageSummaryCards } from "@/components/usage/usage-summary-cards"
import { ApiError } from "@/lib/api/client"
import { getCustomerUsage } from "@/lib/api/usage"
import { exceedsBucketLimit, resolveUsageRange } from "@/lib/usage/range"
import { TOO_MANY_BUCKETS_MESSAGE } from "@/lib/labels"
import { toChartRows } from "@/lib/usage/series"
import type { CustomerUsage as CustomerUsageData } from "@/types/ops"
import type { UsageQuery } from "@/types/query"

interface Props {
  zohoCustomerId: string
  query: UsageQuery
  /** RouterOS username of one line; absent or unknown = all lines summed. */
  line?: string
}

/** A customer's recorded usage for the selected range: totals, then the chart. */
export async function CustomerUsage({ zohoCustomerId, query, line }: Props) {
  const range = resolveUsageRange(query, new Date())
  if (exceedsBucketLimit(range.buckets)) {
    return <SectionError title="Intervalo longo demais" messages={[TOO_MANY_BUCKETS_MESSAGE]} />
  }

  let usage: CustomerUsageData
  try {
    usage = await getCustomerUsage(zohoCustomerId, range)
  } catch (error) {
    // Rendered in place: a refused range must not take the customer page down.
    if (error instanceof ApiError) {
      return <SectionError title="Não foi possível carregar o consumo" messages={error.messages} />
    }
    throw error
  }

  if (usage.lines.length === 0) return <UsageNoUsername />
  if (usage.samplingSince === null) return <UsageNotRecordedYet />

  const selected = usage.lines.find((item) => item.routerosUsername === line)
  const series = selected ?? usage.total
  const rows = toChartRows(series.points, usage, {
    live: range.live,
    lines: selected ? undefined : usage.lines,
  })

  return (
    <>
      <UsageSummaryCards totals={series.totals} />
      <UsageChartCard rows={rows} granularity={usage.granularity} range={usage} />
    </>
  )
}
