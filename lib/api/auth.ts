import "server-only"

import { cache } from "react"

import { opsFetch } from "@/lib/api/client"
import type { LoginInput, LoginResponse, Me } from "@/types/auth"

/** The only unauthenticated dashboard call. Throws `ApiError` on 400/401/429/503. */
export const login = (input: LoginInput) =>
  opsFetch<LoginResponse>("/login", {
    method: "POST",
    body: input,
    auth: false,
  })

/**
 * Who the token belongs to and whether they are an admin, straight from the
 * server. Memoised per request: the layout, the pages and the sections can all
 * ask. A 401 here is the "you were signed out" path (redirect in `opsFetch`).
 */
export const getMe = cache(() => opsFetch<Me>("/me"))

/** Returns a fresh session; every token issued before this call is now refused. */
export const changeMyPassword = (body: {
  currentPassword: string
  newPassword: string
}) => opsFetch<LoginResponse>("/me/password", { method: "POST", body })
