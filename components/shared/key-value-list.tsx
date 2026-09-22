import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface Props {
  items: { label: string; value: ReactNode }[]
  className?: string
}

export function KeyValueList({ items, className }: Props) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[max-content_1fr]", className)}>
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 break-words font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
