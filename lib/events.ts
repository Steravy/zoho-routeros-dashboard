import type { EventGroup } from "@/types/ops"

const PREFIXED = /^(customer|recurring_invoice|invoice)\.state\.(.+)$/

/**
 * `customer.state.active` → { group: "customer", state: "active" }.
 * Rows written before the prefix existed carry the short form (`inactive`); those are customer events.
 */
export function splitEventType(eventType: string): {
  group: EventGroup
  state: string
} {
  const match = PREFIXED.exec(eventType)
  if (!match) return { group: "customer", state: eventType }
  return { group: match[1] as EventGroup, state: match[2] }
}
