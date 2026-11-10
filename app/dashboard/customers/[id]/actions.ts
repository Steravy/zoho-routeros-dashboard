"use server"

import { toActionFailure } from "@/lib/actions/result"
import { getCustomerLiveUsage } from "@/lib/api/usage"
import { zohoCustomerIdSchema } from "@/lib/validations/customer"
import type { ActionResult } from "@/types/actions"
import type { LiveUsageData, RouterRead } from "@/types/ops"

/*
 * The one read that is a Server Action: the live panel polls it from the
 * browser (see `hooks/use-live-usage.ts`), and an action keeps the backend URL
 * and the bearer on the server while reusing `opsFetch`'s 401/503 redirects.
 * It changes nothing, so there is no `refresh()`.
 */

export async function readLiveUsage(
  zohoCustomerId: string
): Promise<ActionResult<RouterRead<LiveUsageData>>> {
  const parsed = zohoCustomerIdSchema.safeParse(zohoCustomerId)
  if (!parsed.success) {
    return { ok: false, status: 400, message: "Id de cliente inválido." }
  }

  try {
    return { ok: true, data: await getCustomerLiveUsage(parsed.data) }
  } catch (error) {
    return toActionFailure(error)
  }
}
