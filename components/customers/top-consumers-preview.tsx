import Link from "next/link"

import { EmptyState } from "@/components/shared/empty-state"
import { ConsumerName } from "@/components/usage/consumer-name"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
import { ApiError } from "@/lib/api/client"
import { getTopConsumers } from "@/lib/api/usage"
import { DEFAULT_TOP_LIMIT, DEFAULT_TOP_PERIOD, TOP_PREVIEW_LIMIT } from "@/lib/constants"
import { formatBytes } from "@/lib/format"
import { resolveTopRange } from "@/lib/usage/range"
import type { TopConsumers } from "@/types/ops"
import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr"

/**
 * What the Clientes page shows before a search: the customers that used the
 * most data in the last 30 days, each one click away from its usage. Falls back
 * to the plain "search to begin" prompt when there is no ranking to show.
 */
export async function TopConsumersPreview() {
  let top: TopConsumers | null = null
  try {
    const range = resolveTopRange({ top: DEFAULT_TOP_PERIOD, limit: DEFAULT_TOP_LIMIT }, new Date())
    top = await getTopConsumers(range, TOP_PREVIEW_LIMIT)
  } catch (error) {
    // A shortcut, not the page's job — search still works without it.
    if (!(error instanceof ApiError)) throw error
  }

  if (!top || top.items.length === 0) {
    return (
      <EmptyState
        icon={<MagnifyingGlassIcon />}
        title="Busque para começar"
        description="Os resultados abrem o cliente 360: identidade, mapeamento, estado ao vivo no roteador, consumo, fila e linha do tempo."
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maiores consumidores</CardTitle>
        <CardDescription>
          Quem mais usou dados nos últimos 30 dias. Abra um cliente para ver o consumo dele.
        </CardDescription>
        <CardAction>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/usage">Ver todos</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden sm:table-cell">Username</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top.items.map((item, index) => (
                <TableRow key={item.routerosUsername}>
                  <TableCell className="text-muted-foreground tabular-nums">{index + 1}</TableCell>
                  <TableCell>
                    <ConsumerName consumer={item} />
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs sm:table-cell">
                    {item.routerosUsername}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatBytes(item.totalBytes)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
