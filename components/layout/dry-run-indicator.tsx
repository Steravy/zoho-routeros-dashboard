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
        Dry-run {dryRun ? "on" : "off"}
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end" className="max-w-xs text-pretty">
        {dryRun
          ? "Router writes are being emailed to the owner instead of executed. Every success recorded right now changed nothing on the router."
          : "Router writes are executed for real."}
      </TooltipContent>
    </Tooltip>
  )
}
