"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQueryParams } from "@/hooks/use-query-params"

interface Props {
  /** RouterOS usernames of the customer's lines. */
  usernames: string[]
  /** Selected username; absent = all lines summed. */
  value?: string
}

/** Radix Select cannot hold an empty value, so "all" stands in for "every line". */
const ALL = "all"

/** Which line the chart shows — only rendered for customers with more than one. */
export function LineSelect({ usernames, value }: Props) {
  const { set } = useQueryParams()

  return (
    <Select
      value={value && usernames.includes(value) ? value : ALL}
      onValueChange={(next) => set({ line: next === ALL ? undefined : next })}
    >
      <SelectTrigger size="sm" aria-label="Line" className="font-mono text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL} className="font-sans">
          Todas as linhas
        </SelectItem>
        {usernames.map((username) => (
          <SelectItem key={username} value={username} className="font-mono text-xs">
            {username}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
