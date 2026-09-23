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
      <AlertTitle>Roteador inacessível — mostrando uma cópia salva</AlertTitle>
      <AlertDescription>
        Última leitura atualizada em {formatDateTime(read.fetchedAt)}
        {read.ageSeconds !== null && ` (há ${formatDuration(read.ageSeconds)})`}.
        Os números abaixo podem ter mudado desde então.
      </AlertDescription>
    </Alert>
  )
}
