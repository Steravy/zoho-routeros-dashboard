import Link from "next/link"

import { CopyButton } from "@/components/shared/copy-button"
import { CursorPagination } from "@/components/shared/cursor-pagination"
import { EmptyState } from "@/components/shared/empty-state"
import { OutcomeBadge } from "@/components/shared/outcome-badge"
import { Time } from "@/components/shared/time"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { searchCustomers } from "@/lib/api/ops"
import type { CustomerSearchQuery } from "@/types/query"
import { UserFocusIcon } from "@phosphor-icons/react/ssr"

interface Props {
  query: CustomerSearchQuery
}

/** Ordered by Zoho id, not relevance — a stable order is what makes the cursor safe. */
export async function CustomerResults({ query }: Props) {
  const page = await searchCustomers(query)

  if (page.items.length === 0) {
    return (
      <EmptyState
        icon={<UserFocusIcon />}
        title="Nenhum cliente encontrado"
        description={
          <>
            Telefones são comparados com o username do RouterOS, então um cliente cuja
            resolução <em>falhou</em> não tem username e não pode ser encontrado pelo
            telefone — e são exatamente esses que estão na lista de trabalho.
          </>
        }
        action={
          <Button asChild variant="outline">
            <Link href="/dashboard/needs-human">Abrir Ação manual</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Username</TableHead>
              <TableHead>Mapeado</TableHead>
              <TableHead className="hidden lg:table-cell">Último evento</TableHead>
              <TableHead>Último resultado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.items.map((hit) => (
              <TableRow key={hit.zohoCustomerId}>
                <TableCell>
                  <Link
                    href={`/dashboard/customers/${encodeURIComponent(hit.zohoCustomerId)}`}
                    className="font-medium hover:underline"
                  >
                    {hit.name ?? "Cliente sem nome"}
                  </Link>
                  <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                    {hit.zohoCustomerId}
                    <CopyButton value={hit.zohoCustomerId} label="id do Zoho" />
                  </div>
                </TableCell>
                <TableCell className="hidden font-mono text-xs md:table-cell">
                  {hit.routerosUsername ?? <span className="font-sans text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>
                  <Badge variant={hit.mapped ? "secondary" : "outline"}>
                    {hit.mapped ? "mapeado" : "sem mapeamento"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-muted-foreground lg:table-cell">
                  <Time iso={hit.lastEventAt} format="relative" />
                </TableCell>
                <TableCell>
                  <OutcomeBadge outcome={hit.lastOutcome} />
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
