import { ActiveUsersChart } from "@/components/charts/active-users-chart"
import { UsageChart } from "@/components/charts/usage-chart"
import { EmptyState } from "@/components/shared/empty-state"
import { InfoHint } from "@/components/shared/info-hint"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatZonedDateTime } from "@/lib/format"
import { GRANULARITY_UNIT_LABELS, USAGE_APPROXIMATE_HINT, timezoneLabel } from "@/lib/labels"
import { hasTraffic, recordingStartedAt } from "@/lib/usage/series"
import type { Granularity, UsageRange } from "@/types/ops"
import type { UsageChartRow } from "@/types/ui"
import { MoonStarsIcon } from "@phosphor-icons/react/ssr"

interface Props {
  rows: UsageChartRow[]
  granularity: Granularity
  /** The response's range — `from` is already widened to its bucket. */
  range: UsageRange
  /** Draw active users per bucket in a small chart underneath (network only). */
  activeUsers?: boolean
}

/** The chart with everything a reader needs around it: range, timezone, freshness and the "approximate" caveat. */
export function UsageChartCard({ rows, granularity, range, activeUsers = false }: Props) {
  const zone = range.timezone
  const live = rows.at(-1)?.inProgress ?? false
  // Sibling charts on the same buckets share hover.
  const syncId = activeUsers ? "network-usage" : undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumo por {GRANULARITY_UNIT_LABELS[granularity]}</CardTitle>
        <CardDescription>
          De {formatZonedDateTime(range.from, zone)} a {formatZonedDateTime(range.to, zone)}, no
          horário de {timezoneLabel(zone)}. Os dados podem ter até ~5 minutos de atraso
          {live && "; o último período ainda está em andamento"}.
        </CardDescription>
        <CardAction>
          <InfoHint label="About these figures">{USAGE_APPROXIMATE_HINT}</InfoHint>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasTraffic(rows) ? (
          <>
            <UsageChart
              rows={rows}
              granularity={granularity}
              timeZone={zone}
              recordingStartedAt={recordingStartedAt(rows)}
              syncId={syncId}
            />
            {activeUsers && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Usuários ativos</p>
                <ActiveUsersChart rows={rows} granularity={granularity} timeZone={zone} syncId={syncId} />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={<MoonStarsIcon />}
            title="Sem tráfego neste período"
            description="Nenhum byte foi registrado no intervalo escolhido. Tente um intervalo maior."
          />
        )}
      </CardContent>
    </Card>
  )
}
