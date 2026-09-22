import "server-only"

import { opsFetch } from "@/lib/api/client"
import type { LoginInput, LoginResponse } from "@/types/auth"

/** The only unauthenticated dashboard call. Throws `ApiError` on 400/401/429/503. */
export const login = (input: LoginInput) =>
  opsFetch<LoginResponse>("/login", { method: "POST", body: input, auth: false })
