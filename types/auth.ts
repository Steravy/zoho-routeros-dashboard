export interface DecodedSession {
  actor: string
  expiresAt: Date
}

export interface Session extends DecodedSession {
  token: string
}

export interface LoginInput {
  username: string
  password: string
}

export interface LoginSearch {
  /** Same-origin path to return to after sign-in. */
  next?: string
  reason?: "expired"
}

export interface LoginResponse {
  token: string
  actor: string
  expiresAt: string
}
