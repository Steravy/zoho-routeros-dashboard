import { badgeVariants } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ApiError } from "@/lib/api/client"
import { getConfig } from "@/lib/api/ops"
import { FlaskIcon } from "@phosphor-icons/react/ssr"

/**
 * Live flag, not a row property: while dry-run is on, every "success" the bridge
 * records changed nothing on the router. Compact by design — the explanation is
 * in the tooltip, reachable by hover, touch and keyboard focus.
 */
export async function DryRunIndicator() {
  let dryRun: boolean
  try {
    dryRun = (await getConfig()).dryRun
  } catch (error) {
    // Informational only — an unreachable API must not take the header down.
    if (error instanceof ApiError) return null
    throw error
  }

  return (
    <Tooltip>
      <TooltipTrigger
        className={badgeVariants({ variant: dryRun ? "destructive" : "outline" })}
        aria-label={`Dry-run ${dryRun ? "on" : "off"}`}
      >
        <FlaskIcon />
        Dry-run {dryRun ? "ligado" : "desligado"}
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end" className="max-w-xs text-pretty">
        {dryRun
          ? "As escritas no roteador estão sendo enviadas por e-mail ao responsável em vez de executadas. Nenhum sucesso registrado agora alterou algo no roteador."
          : "As escritas no roteador são executadas de verdade."}
      </TooltipContent>
    </Tooltip>
  )
}
