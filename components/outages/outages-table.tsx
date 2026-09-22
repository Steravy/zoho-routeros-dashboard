import { EmptyState } from "@/components/shared/empty-state"
import { Time } from "@/components/shared/time"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getOutages } from "@/lib/api/ops"
import { formatCount, formatDuration } from "@/lib/format"
import type { TimeWindow } from "@/types/ops"
import { CheckCircleIcon } from "@phosphor-icons/react/ssr"

interface Props {
  window: TimeWindow
}

/** `ASSUMED_AT_RESTART` means the end time is an estimate, not an observation. */
export async function OutagesTable({ window }: Props) {
  const { items } = await getOutages(window)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircleIcon />}
        title="No outages in this window"
        description="The router link stayed up the whole time."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Started</TableHead>
            <TableHead>Ended</TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead className="hidden md:table-cell">Reason</TableHead>
            <TableHead className="hidden text-right lg:table-cell">Reconnects</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((outage) => (
            <TableRow key={outage.id}>
              <TableCell className="whitespace-nowrap">
                <Time iso={outage.startedAt} />
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {outage.open ? (
                  <Badge variant="destructive">still down</Badge>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Time iso={outage.endedAt} />
                    {outage.endedBy === "ASSUMED_AT_RESTART" && (
                      <Badge variant="outline" title="The link was already back when the process restarted; the end time is an estimate.">
                        estimated
                      </Badge>
                    )}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatDuration(outage.durationSeconds)}
              </TableCell>
              <TableCell className="hidden max-w-sm md:table-cell">
                <span className="block truncate font-mono text-xs text-muted-foreground" title={outage.reason}>
                  {outage.reason}
                </span>
              </TableCell>
              <TableCell className="hidden text-right tabular-nums lg:table-cell">
                {outage.reconnectAttempts === null ? "—" : formatCount(outage.reconnectAttempts)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
