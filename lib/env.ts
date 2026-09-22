import "server-only"

import { z } from "zod"

const schema = z.object({
  OPS_API_URL: z
    .url({ error: "OPS_API_URL must be a full URL, e.g. http://localhost:5000" })
    .transform((url) => url.replace(/\/+$/, "")),
})

type Env = z.infer<typeof schema>

// Local dev works without a .env file; production must set it explicitly.
const devFallback =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : undefined

let cached: Env | undefined

/**
 * Validated on first use, not at import: `next build` evaluates server modules
 * without runtime env, and no request is made during that pass.
 */
export function env(): Env {
  cached ??= schema.parse({ OPS_API_URL: process.env.OPS_API_URL ?? devFallback })
  return cached
}
