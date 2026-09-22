import Link from "next/link"

import { Badge } from "@/components/ui/badge"
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
import type { ProbedName } from "@/types/ops"

interface Props {
  tried: ProbedName[]
}

/** The actual probe ladder, re-derived by the same function that ran — not scraped from an error string. */
export function ProbeLadder({ tried }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Names the bridge probed</CardTitle>
        <CardDetail count={tried.length} />
      </CardHeader>
      <CardContent>
        {tried.length === 0 ? (
          <p className="text-sm text-muted-foreground">No names could be derived.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>On router</TableHead>
                <TableHead>Claimed by</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tried.map((probe) => (
                <TableRow key={probe.username}>
                  <TableCell className="font-mono text-xs">{probe.username}</TableCell>
                  <TableCell>
                    <Badge variant={probe.exists ? "secondary" : "outline"}>
                      {probe.exists ? "exists" : "not found"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {probe.claimedBy.length === 0 ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {probe.claimedBy.map((id) => (
                          <Link
                            key={id}
                            href={`/dashboard/customers/${encodeURIComponent(id)}`}
                            className="font-mono text-xs hover:underline"
                          >
                            {id}
                          </Link>
                        ))}
                      </div>
                    )}
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

function CardDetail({ count }: { count: number }) {
  return (
    <CardDescription>
      Lowercase first word of the first name + the 7 local digits of every phone, then
      the same with <code className="font-mono">0</code> and{" "}
      <code className="font-mono">00</code> appended. {count} names tried.
    </CardDescription>
  )
}
