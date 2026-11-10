import { formatBucketLabel, formatBytes, formatCount } from "@/lib/format"
import type { Granularity } from "@/types/ops"
import type { UsageChartRow } from "@/types/ui"

interface Props {
  /** The hovered bucket; nothing renders without one. */
  row: UsageChartRow | undefined
  granularity: Granularity
  /** The response's `timezone` — bucket labels are never in the browser's zone. */
  timeZone: string
  /** Show the active-users count instead of bytes (the network's small chart). */
  metric?: "bytes" | "activeUsers"
}

/** Tooltip body shared by the usage charts: bucket label, then the figures in ink — the dots carry the series colour. */
export function UsageTooltip({ row, granularity, timeZone, metric = "bytes" }: Props) {
  if (!row) return null

  return (
    <div className="grid min-w-44 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <p className="font-medium">
        {formatBucketLabel(row.start, granularity, timeZone)}
        {row.inProgress && (
          <span className="font-normal text-muted-foreground"> (em andamento)</span>
        )}
      </p>
      {row.noData ? (
        <p className="text-muted-foreground">Sem dados — antes do início do registro.</p>
      ) : metric === "activeUsers" ? (
        <Line label="Usuários ativos" value={formatCount(row.activeUsers)} />
      ) : (
        <>
          <Line label="Download" value={formatBytes(row.download)} dot="bg-usage-download" />
          <Line label="Upload" value={formatBytes(row.upload)} dot="bg-usage-upload" />
          <Line label="Total" value={formatBytes(row.total)} strong />
          {row.lines && (
            <div className="mt-0.5 grid gap-1 border-t pt-1.5">
              {row.lines.map((line) => (
                <Line
                  key={line.username}
                  label={<span className="font-mono">{line.username}</span>}
                  value={formatBytes(line.total)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface LineProps {
  label: React.ReactNode
  value: string
  /** Tailwind background class of the series dot. */
  dot?: string
  strong?: boolean
}

function Line({ label, value, dot, strong }: LineProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {dot && <span className={`size-2 shrink-0 rounded-[2px] ${dot}`} />}
        {label}
      </span>
      <span className={`tabular-nums ${strong ? "font-medium" : ""}`}>{value}</span>
    </div>
  )
}
