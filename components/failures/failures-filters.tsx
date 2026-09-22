"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQueryParams } from "@/hooks/use-query-params"
import { ACTIONS, FAILURE_CODES, SOURCES } from "@/lib/constants"
import { ACTION_LABELS, FAILURE_CODE_LABELS, SOURCE_LABELS } from "@/lib/labels"
import type { FailuresQuery } from "@/types/query"
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/ssr"

interface Props {
  value: FailuresQuery
}

/** Radix Select cannot hold an empty value, so "all" stands in for "no filter". */
const ALL = "all"

/** One filter row above everything it scopes; each change rewrites the URL. */
export function FailuresFilters({ value }: Props) {
  const { set } = useQueryParams()
  const [q, setQ] = useState(value.q ?? "")

  // Keep the box in sync when the URL changes from elsewhere (back button, Clear).
  useEffect(() => setQ(value.q ?? ""), [value.q])

  const hasFilters = Boolean(value.q || value.failureCode || value.action || value.source)

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        set({ q: q.trim() || undefined })
      }}
    >
      <div className="relative w-full sm:w-72">
        <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Name, username or Zoho id"
          aria-label="Search failures"
          className="pl-8"
        />
      </div>

      <Select
        value={value.failureCode ?? ALL}
        onValueChange={(next) => set({ failureCode: next === ALL ? undefined : next })}
      >
        <SelectTrigger className="w-full sm:w-48" aria-label="Failure code">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All failure codes</SelectItem>
          {FAILURE_CODES.map((code) => (
            <SelectItem key={code} value={code}>
              {FAILURE_CODE_LABELS[code]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.action ?? ALL}
        onValueChange={(next) => set({ action: next === ALL ? undefined : next })}
      >
        <SelectTrigger className="w-full sm:w-40" aria-label="Action">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All actions</SelectItem>
          {ACTIONS.map((action) => (
            <SelectItem key={action} value={action}>
              {ACTION_LABELS[action]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.source ?? ALL}
        onValueChange={(next) => set({ source: next === ALL ? undefined : next })}
      >
        <SelectTrigger className="w-full sm:w-40" aria-label="Source">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All sources</SelectItem>
          {SOURCES.map((source) => (
            <SelectItem key={source} value={source}>
              {SOURCE_LABELS[source]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" variant="outline" size="sm">
        Search
      </Button>
      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            set({ q: undefined, failureCode: undefined, action: undefined, source: undefined })
          }
        >
          <XIcon />
          Clear
        </Button>
      )}
    </form>
  )
}
