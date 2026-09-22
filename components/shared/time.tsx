import { formatDateTime, formatRelative } from "@/lib/format"

interface Props {
  iso: string | null | undefined
  /** Which reading is shown; the other is in the title tooltip. */
  format?: "absolute" | "relative"
  className?: string
}

export function Time({ iso, format = "absolute", className }: Props) {
  if (!iso) return <span className={className}>—</span>

  const absolute = formatDateTime(iso)
  const relative = formatRelative(iso)
  return (
    <time
      dateTime={iso}
      title={format === "absolute" ? relative : absolute}
      className={className}
    >
      {format === "absolute" ? absolute : relative}
    </time>
  )
}
