/** A customer's 360 page, opened on its usage tab. */
export function customerUsageHref(zohoCustomerId: string): string {
  return `/dashboard/customers/${encodeURIComponent(zohoCustomerId)}?tab=consumo`
}
