import { EmptyState } from "@/components/shared/empty-state"
import { HourglassIcon, PlugsIcon } from "@phosphor-icons/react/ssr"

/** `samplingSince: null` — the sampler has not written a single hour yet. */
export function UsageNotRecordedYet() {
  return (
    <EmptyState
      icon={<HourglassIcon />}
      title="O registro de consumo ainda não produziu dados"
      description="A ponte lê os contadores do roteador a cada 5 minutos. Os primeiros números aparecem pouco depois da primeira leitura."
    />
  )
}

/** `lines: []` — usage is kept per RouterOS username, and this customer has none. */
export function UsageNoUsername() {
  return (
    <EmptyState
      icon={<PlugsIcon />}
      title="Sem consumo para mostrar"
      description="Este cliente não tem username do RouterOS, então não há consumo registrado para ele."
    />
  )
}
