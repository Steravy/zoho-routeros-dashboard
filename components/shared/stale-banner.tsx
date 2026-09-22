import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatDateTime, formatDuration } from "@/lib/format"
import type { RouterRead } from "@/types/ops"
import { CloudSlashIcon } from "@phosphor-icons/react/ssr"

interface Props {
  read: RouterRead<unknown>
}

/**
 * `stale: true` is the "router is down" signal — the data shown is a remembered copy.
 * (`available` is not that signal; see the API contract §4.)
 */
export function StaleBanner({ read }: Props) {
  if (!read.stale) return null

  return (
    <Alert>
      <CloudSlashIcon />
      <AlertTitle>Router unreachable — showing a remembered copy</AlertTitle>
      <AlertDescription>
        Last fresh read {formatDateTime(read.fetchedAt)}
        {read.ageSeconds !== null && ` (${formatDuration(read.ageSeconds)} ago)`}.
        Counts below may have moved since.
      </AlertDescription>
    </Alert>
  )
}
