import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { PlugsIcon } from "@phosphor-icons/react/ssr"

interface Props {
  /** `unavailableReason` from the API — written for humans; show it verbatim. */
  reason?: string
  title?: string
}

/**
 * `available: false` is an empty state, not an error. On per-customer reads it can
 * mean "no username" or "no stored payload" while the router is perfectly healthy.
 */
export function UnavailableState({
  reason,
  title = "Nothing to show from the router",
}: Props) {
  return (
    <Empty className="flex-none border border-dashed py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PlugsIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {reason && <EmptyDescription>{reason}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  )
}
