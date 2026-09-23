import { StaleBanner } from "@/components/shared/stale-banner"
import { StatCard } from "@/components/shared/stat-card"
import { UnavailableState } from "@/components/shared/unavailable-state"
import { Badge } from "@/components/ui/badge"
import { getCensus, getConfig } from "@/lib/api/ops"
import { formatCount } from "@/lib/format"

/**
 * `blocked` (on the suspension profile) and `disabled` (the RouterOS flag) are
 * different things; a customer can be neither, either or both.
 */
export async function CensusStats() {
  const [census, config] = await Promise.all([getCensus(), getConfig()])
  const data = census.data

  if (!data) {
    return (
      <UnavailableState
        title="Nenhum censo disponível"
        reason={census.unavailableReason ?? "O roteador ainda não respondeu."}
      />
    )
  }

  return (
    <div className="space-y-4">
      <StaleBanner read={census} />
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Secrets"
          value={formatCount(data.secrets)}
          hint="Credenciais PPPoE no roteador — uma por linha de cliente"
        />
        <StatCard
          label="Ativos"
          value={formatCount(data.active)}
          hint="Secrets fora do perfil bloqueado (ignora a flag de desabilitado)"
        />
        <StatCard
          label="Bloqueados"
          value={formatCount(data.blocked)}
          hint={
            <>
              Em <code className="font-mono">{config.blockedProfile}</code>
              {" — suspensos por falta de pagamento, ainda conectando com velocidade reduzida"}
            </>
          }
        />
        <StatCard
          label="Desabilitados"
          value={formatCount(data.disabled)}
          hint="Flag do RouterOS ativa — clientes novos que ainda não pagaram. Não é suspensão."
        />
        <StatCard
          label="Online"
          value={formatCount(data.online)}
          hint="Clientes distintos com sessão ativa agora"
        />
        <StatCard
          label="Bloqueados e online"
          value={formatCount(data.blockedAndOnline)}
          action={<Badge variant="secondary">esperado</Badge>}
          hint="Clientes bloqueados reconectam no perfil com velocidade reduzida — um número alto aqui significa que o sistema está funcionando"
        />
      </div>
    </div>
  )
}
