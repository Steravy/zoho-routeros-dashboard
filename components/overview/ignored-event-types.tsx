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
        <CardTitle>Eventos ignorados</CardTitle>
        <CardDescription>
          Eventos do Zoho sem mapeamento. Um nome que continua aparecendo geralmente é
          um mapeamento faltando, não ruído.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <EmptyState
            icon={<CheckCircleIcon />}
            title="Nenhum evento sem mapeamento"
            description="Todo evento do Zoho neste período tinha mapeamento."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de evento</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="hidden sm:table-cell">Visto por último</TableHead>
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
