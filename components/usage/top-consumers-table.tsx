"use client"

import { useState } from "react"

import { ConsumerName } from "@/components/usage/consumer-name"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatBytes, formatShare } from "@/lib/format"
import type { TopConsumer } from "@/types/ops"
import { CaretDownIcon, CaretUpDownIcon, CaretUpIcon } from "@phosphor-icons/react/ssr"

interface Props {
  /** As ranked by the API: `totalBytes`, largest first. */
  items: TopConsumer[]
  /** Network total for the *same* range; absent when the ranges differ, and the share column goes with it. */
  networkTotalBytes?: number
}

type SortKey = "rank" | "name" | "routerosUsername" | "downloadBytes" | "uploadBytes" | "totalBytes"
type Direction = "ascending" | "descending"

const text = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true })

/** The ranking. Rank is always the API's order; sorting by another column only reorders the rows on screen. */
export function TopConsumersTable({ items, networkTotalBytes }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; direction: Direction }>({
    key: "rank",
    direction: "ascending",
  })

  const ranked = items.map((item, index) => ({ ...item, rank: index + 1 }))
  const rows = [...ranked].sort((a, b) => {
    const order =
      sort.key === "name" || sort.key === "routerosUsername"
        ? text.compare(a[sort.key] ?? "", b[sort.key] ?? "")
        : a[sort.key] - b[sort.key]
    return sort.direction === "ascending" ? order : -order
  })

  const toggle = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "ascending" ? "descending" : "ascending" }
        : // Text reads A→Z first; figures are most useful largest first.
          { key, direction: key === "name" || key === "routerosUsername" || key === "rank" ? "ascending" : "descending" }
    )

  const header = (key: SortKey, label: string, className?: string) => {
    const active = sort.key === key
    const Icon = !active ? CaretUpDownIcon : sort.direction === "ascending" ? CaretUpIcon : CaretDownIcon
    return (
      <TableHead className={className} aria-sort={active ? sort.direction : "none"}>
        <button
          type="button"
          onClick={() => toggle(key)}
          className="inline-flex items-center gap-1 rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          {label}
          <Icon className={active ? "size-3.5" : "size-3.5 text-muted-foreground/60"} />
        </button>
      </TableHead>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {header("rank", "#", "w-12")}
            {header("name", "Cliente")}
            {header("routerosUsername", "Username")}
            {header("downloadBytes", "Download", "hidden text-right md:table-cell")}
            {header("uploadBytes", "Upload", "hidden text-right md:table-cell")}
            {header("totalBytes", "Total", "text-right")}
            {networkTotalBytes !== undefined && (
              <TableHead className="hidden text-right sm:table-cell">% da rede</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.routerosUsername}>
              <TableCell className="text-muted-foreground tabular-nums">{item.rank}</TableCell>
              <TableCell>
                <ConsumerName consumer={item} />
              </TableCell>
              <TableCell className="font-mono text-xs">{item.routerosUsername}</TableCell>
              <TableCell className="hidden text-right tabular-nums md:table-cell">
                {formatBytes(item.downloadBytes)}
              </TableCell>
              <TableCell className="hidden text-right tabular-nums md:table-cell">
                {formatBytes(item.uploadBytes)}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {formatBytes(item.totalBytes)}
              </TableCell>
              {networkTotalBytes !== undefined && (
                <TableCell className="hidden text-right text-muted-foreground tabular-nums sm:table-cell">
                  {networkTotalBytes > 0 ? formatShare(item.totalBytes / networkTotalBytes) : "—"}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
