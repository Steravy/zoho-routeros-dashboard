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
        title="No customers match"
        description={
          <>
            Phone numbers are matched against the RouterOS username, so a customer whose
            resolution <em>failed</em> has no username and cannot be found by phone —
            and those are exactly the ones on the worklist.
          </>
        }
        action={
          <Button asChild variant="outline">
            <Link href="/dashboard/needs-human">Open Needs a human</Link>
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
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Username</TableHead>
              <TableHead>Mapped</TableHead>
              <TableHead className="hidden lg:table-cell">Last event</TableHead>
              <TableHead>Last outcome</TableHead>
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
                    {hit.name ?? "Unnamed customer"}
                  </Link>
                  <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                    {hit.zohoCustomerId}
                    <CopyButton value={hit.zohoCustomerId} label="Zoho id" />
                  </div>
                </TableCell>
                <TableCell className="hidden font-mono text-xs md:table-cell">
                  {hit.routerosUsername ?? <span className="font-sans text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>
                  <Badge variant={hit.mapped ? "secondary" : "outline"}>
                    {hit.mapped ? "mapped" : "no mapping"}
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
