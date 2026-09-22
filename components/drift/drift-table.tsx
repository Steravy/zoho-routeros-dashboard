import Link from "next/link"

import { CopyButton } from "@/components/shared/copy-button"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DRIFT_BUCKET_LABELS } from "@/lib/labels"
import type { DriftBucket, DriftItem } from "@/types/ops"
import { CheckCircleIcon } from "@phosphor-icons/react/ssr"

interface Props {
  bucket: DriftBucket
  items: DriftItem[]
}

/** Orphans carry router fields; missing and ambiguous carry the Zoho ids that claim the name. */
export function DriftTable({ bucket, items }: Props) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircleIcon />}
        title={`No ${DRIFT_BUCKET_LABELS[bucket].toLowerCase()}`}
        description="The router and the mapping table agree here."
      />
    )
  }

  const orphans = bucket === "orphans"

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            {orphans ? (
              <>
                <TableHead>Profile</TableHead>
                <TableHead>Disabled</TableHead>
                <TableHead className="hidden md:table-cell">Comment</TableHead>
              </>
            ) : (
              <TableHead>Claimed by Zoho ids</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.username}>
              <TableCell>
                <span className="inline-flex items-center gap-1 font-mono text-xs">
                  {item.username}
                  <CopyButton value={item.username} label="username" />
                </span>
              </TableCell>
              {orphans ? (
                <>
                  <TableCell className="font-mono text-xs">{item.profile ?? "—"}</TableCell>
                  <TableCell>
                    {item.disabled ? (
                      <Badge variant="outline">disabled</Badge>
                    ) : (
                      <span className="text-muted-foreground">no</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden max-w-sm truncate text-muted-foreground md:table-cell">
                    {item.comment || "—"}
                  </TableCell>
                </>
              ) : (
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {(item.zohoCustomerIds ?? []).map((id) => (
                      <Link
                        key={id}
                        href={`/dashboard/customers/${encodeURIComponent(id)}`}
                        className="font-mono text-xs hover:underline"
                      >
                        {id}
                      </Link>
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
