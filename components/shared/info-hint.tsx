import type { ReactNode } from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "@phosphor-icons/react/ssr"

interface Props {
  /** What the icon explains, for screen readers. */
  label: string
  children: ReactNode
}

/** A small "i" whose explanation is reachable by hover, touch and keyboard focus. */
export function InfoHint({ label, children }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={label}
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <InfoIcon className="size-4" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-pretty">{children}</TooltipContent>
    </Tooltip>
  )
}
