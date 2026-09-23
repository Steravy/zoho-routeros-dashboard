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

/** `POST /login`, and the body of every call that rotates the token. */
export interface LoginResponse {
  token: string
  actor: string
  isAdmin: boolean
  expiresAt: string
}

/** `GET /me` — re-read on every dashboard render; `isAdmin` is a hint, the server decides. */
export interface Me {
  actor: string
  isAdmin: boolean
}

export interface Operator {
  username: string
  isAdmin: boolean
  createdAt: string
  passwordChangedAt: string
}

/** `POST /operators/:username/password` — `session` is present only when you reset your own. */
export interface OperatorResetResponse extends Operator {
  session?: LoginResponse
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface RegisterOperatorInput {
  username: string
  password: string
}

export interface ResetPasswordInput {
  password: string
}
