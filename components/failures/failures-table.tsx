import Link from "next/link"

import { CursorPagination } from "@/components/shared/cursor-pagination"
import { EmptyState } from "@/components/shared/empty-state"
import { FailureCodeBadge } from "@/components/shared/failure-code-badge"
import { Time } from "@/components/shared/time"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getFailures } from "@/lib/api/ops"
import { NEEDS_HUMAN_CODES } from "@/lib/constants"
import { ACTION_LABELS } from "@/lib/labels"
import type { FailureItem } from "@/types/ops"
import type { FailuresQuery } from "@/types/query"
import { ConfettiIcon } from "@phosphor-icons/react/ssr"

interface Props {
  query: FailuresQuery
  emptyTitle?: string
  emptyDescription?: string
}

const customerHref = (id: string) => `/dashboard/customers/${encodeURIComponent(id)}`

function needsHuman(item: FailureItem): boolean {
  return (
    item.failureCode !== null &&
    (NEEDS_HUMAN_CODES as readonly string[]).includes(item.failureCode)
  )
}

/** The worklist. `errorMessage` is shown verbatim — it carries what the code cannot. */
export async function FailuresTable({
  query,
  emptyTitle = "Nenhuma falha encontrada",
  emptyDescription = "Nada falhou neste período com estes filtros — boa notícia de verdade.",
}: Props) {
  const page = await getFailures(query)

  if (page.items.length === 0) {
    return <EmptyState icon={<ConfettiIcon />} title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quando</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Ação</TableHead>
              <TableHead>Falha</TableHead>
              <TableHead className="hidden lg:table-cell">Mensagem</TableHead>
              <TableHead className="hidden md:table-cell">Username</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  <Time iso={item.createdAt} format="relative" />
                </TableCell>
                <TableCell>
                  <Link href={customerHref(item.zohoCustomerId)} className="font-medium hover:underline">
                    {item.zohoCustomerName || "Cliente sem nome"}
                  </Link>
                  <div className="font-mono text-xs text-muted-foreground">{item.zohoCustomerId}</div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap md:table-cell">
                  {ACTION_LABELS[item.action]}
                </TableCell>
                <TableCell>
                  <FailureCodeBadge code={item.failureCode} />
                </TableCell>
                <TableCell className="hidden max-w-md lg:table-cell">
                  <span className="block truncate text-muted-foreground" title={item.errorMessage ?? ""}>
                    {item.errorMessage ?? "—"}
                  </span>
                </TableCell>
                <TableCell className="hidden font-mono text-xs md:table-cell">
                  {item.routerosUsername || (
                    <span
                      className="font-sans text-muted-foreground"
                      title="A resolução nunca gerou um username"
                    >
                      —
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {needsHuman(item) && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`${customerHref(item.zohoCustomerId)}/suggestions`}>
                        Sugestões
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CursorPagination nextCursor={page.nextCursor} count={page.items.length} />
    </div>
  )
}
