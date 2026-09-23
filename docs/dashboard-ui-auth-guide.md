# Ops Dashboard — UI guide for auth, account and operator management

Companion to `docs/dashboard-api.md` (the contract). That file says what the
API does; this one says how to build the UI on it. Field names, status codes
and messages below are copied from the running API, not paraphrased.

---

## 1. What changed and why you care

Operators used to be a fixed list in an env var. They now live in the database,
identified by **email**, with one **admin** flag. That unlocks four things the UI
has to expose:

- everyone can change their own password;
- admins can register, list and remove operators and reset anyone's password;
- a password change or reset **ends that operator's other sessions**, and
  removal ends all of them — no restart, no delay;
- login and `/me` tell you `isAdmin`.

Tokens issued before this release are refused, so on the first deploy every
user lands on the login screen once. That is expected, not a bug to chase.

---

## 2. Auth state to keep

Keep exactly what `POST /login` returns:

```json
{
  "token": "eyJ1IjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTg2MjM2MDAwMDAsImV4cCI6MTc1ODY2NjgwMDAwMH0.Ab3...",
  "actor": "alice@example.com",
  "isAdmin": true,
  "expiresAt": "2026-09-23T02:00:00.000Z"
}
```

- `token` → `Authorization: Bearer <token>` on every request.
- `expiresAt` → route guard and "you will be logged out at …" if you want it.
- `actor` → the email to show in the header, and the value to compare against
  rows on the Operators screen to find *yourself*.
- `isAdmin` → whether to mount the Operators route and show its nav entry.

`localStorage` is fine (contract §3). **`isAdmin` is a hint for the UI, not a
permission**: the server re-reads it on every request and answers 403 on admin
routes regardless of what you stored.

Clear all four on any 401 and on explicit logout. There is no logout endpoint —
deleting the token is logging out.

**The token changes more often than before.** Two calls return a new one that
you must swap in immediately (§5, §6). Make "replace the stored session" a
single function and call it from login and from both of those places.

---

## 3. Login screen

`POST /api/ops/login` with `{ username, password }`.

- `username` is an email. Use `type="email"`; do not lower-case or trim
  yourself, the server normalizes. Max 64 characters.
- `password` has no client-side rule on login (old passwords may be anything).
  New passwords are 12–128 characters; say so on the account and register forms,
  not here.

| Status | Show |
|---|---|
| 200 | store the four fields, go to Overview |
| 400 | a field is empty or too long — validation bug in the form |
| 401 | "Invalid email or password." Never say which one; the server does not tell you either |
| 429 | "Too many attempts for this account. Try again in *N* s." Disable the form and count down |
| 503 | the "dashboard is switched off" page, not the login form |

The 429 body is shaped differently from every other error and has **no
`Retry-After` header**:

```json
{ "statusCode": 429, "message": "Too many login attempts — try again in 300s" }
```

Take the seconds out of `message` with `/(\d+)s/`. The throttle is per
**account**, not per device: 5 failures in 5 minutes lock that email for
everyone, and a successful login clears it.

---

## 4. Boot and gating

On app boot, with a stored token:

1. If `expiresAt` is in the past → go to login. Cheap pre-check only.
2. Call `GET /api/ops/me`. 200 → refresh `actor` and `isAdmin` from the
   response and continue. This is how a user learns they were made admin (or
   not) since they logged in.
3. Anything else falls to the global handler below.

```json
{ "actor": "alice@example.com", "isAdmin": true }
```

Global response handling, once, in your HTTP client:

- **401 → clear state, go to login.** Every 401 means the same thing: no
  header, bad or expired token, token older than the operator's last password
  change, or operator removed. There is nothing to retry. One deliberate
  exception in §5.
- **403 → "Admins only." Do NOT redirect to login.** The session is fine; the
  operator is not an admin. Only the `/operators` routes can return it.
- **503 → the "dashboard is switched off" page.** Not an auth failure.

Route guards:

- every route: token present and `expiresAt` in the future;
- `/operators` route: additionally `isAdmin`. Still handle a 403 from the API on
  that screen — the flag can change underneath a live session if an admin
  removes and re-registers the account.

---

## 5. Account screen — everyone

One form: current password, new password, confirm new password.

Client-side rules, mirroring the server:

- new password 12–128 characters;
- new ≠ current (the server rejects it too, but say it before the round trip);
- confirm matches new.

`POST /api/ops/me/password`:

```json
{ "currentPassword": "…", "newPassword": "…" }
```

**On 200 the response is a full login response. Replace the stored session
with it before you do anything else** — the token you just used is now refused,
because every token issued before this instant is. Then show "Password changed.
Your other sessions were signed out."

| Status | Message in body | Show |
|---|---|---|
| 400 | `Current password is incorrect` | inline on the current-password field |
| 400 | `New password must differ from the current one` | inline on the new-password field |
| 400 | array of validation strings | inline; a form bug |
| 401 | — | the global redirect; the session really is gone |
| 429 | `Too many login attempts — try again in Ns` | disable the form, count down |

**Trap:** a wrong current password is a **400, not a 401**, precisely so your
global 401 handler does not throw the user out of their own account screen.
Do not "fix" that by treating this 400 as an auth failure.

**Trap:** the throttle here is the *same* counter as login, keyed on the
account. Five wrong current passwords lock the login for that email for five
minutes too. The message says "login attempts"; explain it as "too many
attempts for this account".

---

## 6. Operators screen — admins only

Mount it only when `isAdmin`. All four calls are under `/api/ops/operators`
and all of them answer 403 to a non-admin.

### List — `GET /operators`

```json
[
  {
    "username": "alice@example.com",
    "isAdmin": true,
    "createdAt": "2026-09-23T10:00:00.000Z",
    "passwordChangedAt": "2026-09-23T10:00:00.000Z"
  }
]
```

Table: email, an "admin" badge, created, password last changed. Sorted by
email by the server. Mark the row where `username === actor` as *you* — two
actions below behave differently on it.

### Register — `POST /operators`

```json
{ "username": "bob@example.com", "password": "…" }
```

Email (max 64) plus a 12–128 character password. Response is **201** with one
row of the list shape.

**Do not offer an "admin" checkbox.** Whether the new operator is an admin is
decided by the server at this moment, from the `ADMIN_EMAILS` env var. Show the
`isAdmin` badge from the 201 response and, if it matters to your users, a hint:
"Admins are configured on the server."

| Status | Show |
|---|---|
| 201 | add the row, clear the form |
| 400 | inline validation (not an email, password length) |
| 409 | `Operator "bob@example.com" already exists` — inline on the email field |

The password is set by the admin and handed over out of band. The new operator
changes it on their Account screen.

### Reset password — `POST /operators/:username/password`

```json
{ "password": "…" }
```

Per-row action with a confirm dialog: "This signs *bob@example.com* out of every
session." Response is 200 with the row shape, plus one optional field:

```json
{
  "username": "alice@example.com",
  "isAdmin": true,
  "createdAt": "…",
  "passwordChangedAt": "…",
  "session": { "token": "…", "actor": "alice@example.com", "isAdmin": true, "expiresAt": "…" }
}
```

`session` is present **only when you reset your own password**. Swap it into
the stored session immediately, same function as login and §5. For anyone else
the field is absent and nothing changes for you.

| Status | Show |
|---|---|
| 200 | update `passwordChangedAt` in the row; if `session` present, swap it in |
| 400 | password length; or `:username` is not a valid email (`Invalid operator email`) |
| 404 | `Operator "…" not found` — the row is stale; refresh the list |

### Remove — `DELETE /operators/:username`

Per-row action with a confirm dialog. Response `{ "username": "bob@example.com" }`.
Their next request is a 401.

**Hide or disable it on your own row.** The server answers 400
`You cannot remove yourself`; showing the button just to explain that is worse
than not showing it.

| Status | Show |
|---|---|
| 200 | drop the row |
| 400 | you targeted yourself |
| 404 | stale row; refresh the list |

---

## 7. Error matrix

Bodies are NestJS defaults. `message` is a **string** for 401/403/404/409/503
and for the two hand-written 400s, an **array of strings** for validation 400s,
and the 429 has **no `error` key**:

```json
{ "message": "Admin only", "error": "Forbidden", "statusCode": 403 }
{ "message": ["newPassword must be longer than or equal to 12 characters"], "error": "Bad Request", "statusCode": 400 }
{ "statusCode": 429, "message": "Too many login attempts — try again in 300s" }
```

| Endpoint | 400 | 401 | 403 | 404 | 409 | 429 | 503 |
|---|---|---|---|---|---|---|---|
| `POST /login` | form bug | wrong credentials → generic message | — | — | — | countdown | switched-off page |
| `GET /me` | — | global redirect | — | — | — | — | switched-off page |
| `POST /me/password` | wrong current / unchanged / validation → inline | global redirect | — | — | — | countdown | switched-off page |
| `GET /operators` | — | global redirect | "admins only" | — | — | — | switched-off page |
| `POST /operators` | validation → inline | global redirect | "admins only" | — | exists → inline | — | switched-off page |
| `POST /operators/:u/password` | validation → inline | global redirect | "admins only" | stale row → refresh | — | — | switched-off page |
| `DELETE /operators/:u` | targeted yourself | global redirect | "admins only" | stale row → refresh | — | — | switched-off page |

Guards run before validation, so on authenticated routes 503 beats 401 beats
403 beats 400. `POST /login` has no guard: a malformed body is 400 even when
the dashboard is disabled.

---

## 8. Copy that must not drift

| Moment | Say |
|---|---|
| any 401 after being logged in | "You were signed out. This happens when your session expires, your password was changed, or your account was removed." |
| 403 | "This area is for admins." |
| own password changed | "Password changed. Your other sessions were signed out." |
| reset someone's password | "Password reset. *email* has been signed out everywhere." |
| register success | "*email* can now sign in." plus the admin badge if `isAdmin` |
| remove button on own row | not shown |
| 429 anywhere | "Too many attempts for this account. Try again in *N* s." |

---

## 9. Test script against a local API

Bring the API up as in contract §2, with two additions in `.env`: your email
in `ADMIN_EMAILS`, and a seed line for it in `DASHBOARD_USERS` from
`npm run dashboard:hash -- you@example.com`. Boot logs `Seeded 1 operator(s)`.

1. Log in as the seeded admin. `/me` shows `isAdmin: true`; the Operators nav
   entry is visible.
2. Register `bob@example.com`. The 201 shows `isAdmin: false`.
3. In a second browser, log in as Bob. No Operators entry. Navigate to
   `/operators` by URL anyway → 403 screen, still logged in.
4. As Bob, change password with a wrong current password → inline 400, still
   logged in. Then with the right one → 200, token swapped, still logged in.
5. Open a third browser as Bob with the *old* password → 401 at login (expected;
   the password changed). Log in with the new one.
6. As admin, reset Bob's password → in both of Bob's browsers the next request
   is a 401 and they land on login.
7. As admin, reset **your own** password → response has `session`, token
   swapped, you stay logged in.
8. As admin, try to remove yourself → the button is not there (or, by URL,
   400 `You cannot remove yourself`).
9. Remove Bob → 200; Bob's next request anywhere is a 401.
10. Hit login six times with a wrong password for one email → 429 with a
    countdown; the sixth wrong attempt on `/me/password` for the same email
    counts toward the same window.

---

## 10. Deploy note

- The release refuses tokens without an issue time: **everyone logs in once**.
- `ADMIN_EMAILS` must be set **before** the server seeds operators. A seeded
  admin whose `/me` says `isAdmin: false` means the environment was booted
  without it; the fix is on the server side (delete the row, set the variable,
  restart), not in the UI.
