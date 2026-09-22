import { EmptyState } from "@/components/shared/empty-state"
import { Time } from "@/components/shared/time"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getSummary } from "@/lib/api/ops"
import { formatCount } from "@/lib/format"
import type { TimeWindow } from "@/types/ops"
import { CheckCircleIcon } from "@phosphor-icons/react/ssr"

interface Props {
  window: TimeWindow
}

/** How a missing mapping is discovered: an event name that keeps showing up here. */
export async function IgnoredEventTypes({ window }: Props) {
  const { ignoredEventTypes } = await getSummary(window)
  const rows = [...ignoredEventTypes].sort((a, b) => b.count - a.count)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ignored event types</CardTitle>
        <CardDescription>
          Zoho events nothing is mapped to. A name that keeps appearing is usually a
          missing mapping, not noise.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <EmptyState
            icon={<CheckCircleIcon />}
            title="No unmapped events"
            description="Every Zoho event in this window had a mapping."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event type</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="hidden sm:table-cell">Last seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.eventType}>
                  <TableCell className="font-mono text-xs">{row.eventType}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCount(row.count)}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    <Time iso={row.lastSeenAt} format="relative" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
