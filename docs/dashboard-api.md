# Ops Dashboard API — frontend contract

Everything needed to build the operations dashboard for the Zoho ↔ RouterOS
bridge, without reading the bridge's source. Read it top to bottom with the API
running beside you.

The machine-readable companion is `docs/openapi.json`, also served live at
`/api/ops/docs` (Swagger UI) and `/api/ops/docs-json`. That file has the exact
field types; **this file has the meanings**, and the meanings are where the
mistakes happen.

---

## 1. What this system does

A customer of a Cape Verde ISP pays their bill in **Zoho** (billing). Their
internet access is a **PPPoE secret** on a **MikroTik RouterOS** router. Those
two systems do not know about each other. This bridge is the wire between them:
Zoho fires a webhook when something happens to a customer, and the bridge
creates, unblocks, blocks or deletes that customer's access on the router.

Every action is written to an audit log, and an email goes to the owner.

Three things then go wrong in real life, and **the dashboard exists for these
three things**:

1. **The router goes down.** Zoho has already been told "200 OK", so the event
   cannot be re-requested. The bridge queues it and replays it when the link
   returns. Someone needs to see that the queue is draining.
2. **The bridge cannot tell which secret belongs to a customer.** Zoho sends a
   name and phone numbers, not a username; the bridge derives the username and
   searches for it. When that fails, the event is a recorded failure and a human
   has to make the link.
3. **The router and the bridge's records drift apart.** Secrets exist that
   nothing claims; mappings point at secrets that are gone.

The dashboard is **read-only**. It shows what happened and what needs a human.
It cannot change anything — see §10.

### Glossary

You will meet these words in field names and error messages.

| Term | Meaning |
|---|---|
| **PPPoE secret** | The router's stored credential for one customer: name, password, profile, `disabled` flag, comment. "The secret" and "the customer's line" are the same thing. |
| **Profile** | The bandwidth/service plan attached to a secret, e.g. `10mbps`. |
| **`disabled` flag** | RouterOS's on/off switch for a credential. Used only for a brand-new customer who has not paid yet. **It is not how suspension works.** |
| **Blocked profile** | Suspension *is* a profile switch: a non-paying customer's secret moves to `BLOQUEIO` (a real, throttled 1M/2M profile). They still connect, just slowly. Their real plan is saved and restored when they pay. |
| **Twin contracts** | One person holding several contracts. The extra secrets are named by appending `0` or `00` to the base username. A secret already claimed by a *different* Zoho id is a twin's line — never take it. |
| **Probe ladder** | How the bridge guesses a username when it has no stored mapping: lowercase first word of the first name + the 7 local phone digits, for **every** phone on the payload, then the same names with `0` and `00` appended. First unclaimed hit wins. |
| **Dry-run** | A safety mode. When on, every router *write* is emailed to the owner instead of executed, and email subjects are prefixed `[DRY-RUN]`. **Reads are unaffected** — the dashboard shows real data either way. |
| **Zoho customer id** | The customer's primary key everywhere in this API. A string. |

---

## 2. Getting started

### Run the API

The config is validated at boot and **fails fast**: every key below is required
even if you only care about the dashboard. Dummy values are fine for the router,
Resend and Zoho keys — nothing connects to them to serve dashboard reads.

```bash
npm install
npm run db:up            # local postgres:16 on :5432, via compose.local.yaml
npx prisma migrate deploy   # YOU run this — see the warning below
npm run dev              # http://localhost:5000
```

> **Point `DATABASE_URL` at your local database before any of this.** Never run
> a second instance of this app against the production database and the live
> router: the replay queue drains on a timer, so a stray instance can apply real
> changes to real customers' internet access.

> **Migrations are never run automatically** — not by the app, not by `npm run
> dev`, not by a hook. A human runs `npx prisma migrate deploy`, always.

Minimum `.env`:

```ini
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/bridge

# required by config validation; dummies are fine for local dashboard work
ZOHO_WEBHOOK_SECRET=dev
ADMIN_API_TOKEN=dev-admin-token-0123456789
ROUTEROS_HOST=127.0.0.1
ROUTEROS_USER=dev
ROUTEROS_PASSWORD=dev
ROUTEROS_DEFAULT_PROFILE=default
RESEND_API_KEY=dev
NOTIFICATION_EMAIL_FROM=dev@example.com
NOTIFICATION_EMAIL_TO=dev@example.com

# the dashboard itself
DASHBOARD_ENABLED=true
DASHBOARD_USERS=<output of npm run dashboard:hash>
DASHBOARD_SESSION_SECRET=<at least 32 characters>
DASHBOARD_CORS_ORIGINS=http://localhost:5173

# keep local runs harmless
ROUTEROS_MUTATIONS_ENABLED=false
NOTIFICATIONS_ENABLED=false
```

Leaving `ROUTEROS_HOST` pointed at nothing is useful: the router link stays down
and retries with backoff, which is the "router unreachable" state you need to
design for, for free.

### Create an operator

```bash
npm run dashboard:hash -- alice
# prompts for a password on stderr (minimum 12 characters), reads it from stdin
# prints one line to stdout:
alice:scrypt.16384.8.1.<salt>.<hash>
```

Append that line to `DASHBOARD_USERS`, comma-separated for more than one, then
**restart** — the list is parsed once at boot.

### Where the spec lives

| What | Where |
|---|---|
| Swagger UI, "try it out" | `GET /api/ops/docs` |
| Raw OpenAPI JSON, live | `GET /api/ops/docs-json` |
| Raw OpenAPI JSON, committed | `docs/openapi.json` |

Both routes exist **only when `DASHBOARD_ENABLED=true`**, and both are
unauthenticated — they describe the API, they do not expose data.

### First two calls

```bash
# 1. log in
curl -s -X POST http://localhost:5000/api/ops/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"alice","password":"<password>"}'

# 2. use the token
curl -s http://localhost:5000/api/ops/summary?window=24h \
  -H "Authorization: Bearer <token from step 1>"
```

There is no third example with a write, because **there are no write
endpoints**.

---

## 3. Auth, and how to gate pages

### The flow

`POST /api/ops/login` with `{ username, password }` returns a token. Send it as
`Authorization: Bearer <token>` on every other call. That is the whole model.

### The token is not a JWT

It looks like one and it is not. Do not reach for `jwt-decode`.

```
base64url(JSON.stringify({ u, exp })) + "." + base64url(HMAC-SHA256(payload))
```

- Two segments, not three. No header, no `alg`.
- The claims are `u` (username) and `exp`.
- **`exp` is epoch milliseconds**, not seconds. A JWT-trained reader gets this
  wrong and logs users out 1000× too early.

To read it client-side: `JSON.parse(atob(token.split('.')[0]))`, remembering it
is base64url. The login response also returns `expiresAt` as a plain ISO string,
which is easier and is the same instant.

### Lifetime

Absolute, twelve hours by default (`DASHBOARD_SESSION_TTL_MINUTES`, default
720). **No refresh. No sliding window. No logout endpoint** — the token is
stateless and the server cannot revoke one, so "log out" means deleting your
copy of it.

Expiry is enforced server-side on every request, so you cannot extend a session
by ignoring `exp`.

### What 401 means

Every one of these returns an identical body, deliberately — you are not meant
to be able to tell them apart:

- No `Authorization` header, or it does not start with `Bearer ` exactly.
- The token is malformed, or the signature does not verify.
- The token has expired.
- **The operator was removed from `DASHBOARD_USERS`** (takes effect after a
  restart, since that list is parsed once at boot).
- On `/login` only: wrong password, *or* a username that does not exist. Both
  cost the same time, so timing gives nothing away either.

**Treat any 401 as "send them back to the login screen."** There is nothing else
it can mean and nothing to retry.

### Login throttling

**5 failed attempts per 5 minutes, keyed on the username — never the IP.** The
window starts at the first attempt and does not extend. A successful login
clears it immediately.

Two consequences for your UI:

- A user cannot escape a lockout by changing network, and one person hammering
  an account locks it for everyone using it. Say "too many attempts for this
  account", not "for this device".
- The 429 tells you the wait **only inside its message string** (`…try again in
  300s`). There is no `Retry-After` header.

### No roles

> **Superseded.** Operators now live in the database with an `isAdmin` flag, and the
> `/operators` routes answer 403 to non-admins. See `docs/dashboard-ui-auth-guide.md`.
> The paragraph below describes the previous release.


Every operator sees everything. There is no permission model, no 403, nothing to
authorise beyond "is there a valid token". Do not build a roles UI.

### Gating pages

The practical shape:

1. Keep the token and `expiresAt` wherever your framework prefers. It is a
   12-hour credential to a read-only ops tool — `localStorage` is reasonable;
   there is no refresh token to protect.
2. A route guard that checks "do I have a token and is `expiresAt` in the
   future". If not, redirect to login. This only pre-empts the obvious case.
3. **One global response interceptor that redirects to login on any 401.** This
   is the one that actually matters, because a token can stop working before it
   expires (operator removed, server restarted with a new
   `DASHBOARD_SESSION_SECRET`).
4. A separate branch for **503**, which is not an auth failure: it means
   `DASHBOARD_ENABLED=false` and the whole API is switched off. Show "the
   dashboard is disabled", not a login form.

---

## 4. Shared shapes

### Pagination — `Page<T>`

```json
{ "items": [ ... ], "nextCursor": "eyJ...|abc" }
```

`nextCursor` is `null` on the last page. Pass it back as `?cursor=`.

**There are two different kinds of cursor and they look identical.** Getting
this wrong produces an empty screen with no error:

| Endpoints | Cursor | A bad cursor does |
|---|---|---|
| `/failures`, `/customers/:id` timeline | opaque base64 of `createdAt\|id` | restarts from the top |
| `/customers/search`, `/router/drift` | the raw last value (a Zoho id / a username) | starts *after* that string — can return nothing, forever |

Only ever send back a `nextCursor` you were given.

### Router-backed reads — `RouterRead<T>`

Four endpoints talk to the router live. The router is often unreachable, so
**they never fail with a 5xx** — they answer 200 and describe their own
freshness.

```json
{
  "available": true,
  "stale": false,
  "fetchedAt": "2026-09-22T14:05:00.000Z",
  "ageSeconds": 0,
  "data": { ... }
}
```

**Read `stale`, not `available`, to detect "the router is down".** This is the
single most common way to build this wrong:

| `available` | `stale` | What actually happened | Show |
|---|---|---|---|
| `true` | `false` | Fresh read, router healthy | The data |
| `true` | **`true`** | **Router unreachable**; this is a remembered copy | The data **plus a stale warning with `ageSeconds`** |
| `false` | `false` | Nothing to show; read `unavailableReason` | An empty state, not an error |

`available: false` does **not** always mean the router is down. On the two
per-customer reads it also covers "this customer has no username" and "no stored
payload to work from" — cases where the router was never contacted and is
perfectly healthy. Always surface `unavailableReason`; it is written for humans.

The per-customer reads (`/customers/:id` → `router`, and `/suggestions` →
`router`) are **never stale** — they are fresh or unavailable, deliberately. An
operator is about to act on that one line, and a remembered profile is what makes
them act on the wrong state. The fleet-wide reads (census, drift) prefer stale
data over none.

### Errors

Status codes this API can return — **these five, and no others**:

| Code | Means | Do |
|---|---|---|
| **400** | Validation failed on a query param or body | Fix the request; it is a bug in your client |
| **401** | Not authenticated (see §3) | Redirect to login |
| **404** | No such customer (only the two customer routes) | Empty state |
| **429** | Login throttled | Show the wait, block the form |
| **503** | `DASHBOARD_ENABLED=false` | "Dashboard is switched off" |

There is **no 403** (no roles) and **no 409** (nothing to conflict with).

Bodies are NestJS defaults:

```json
// 401, 404, 503 — message is a string
{ "message": "Invalid or missing bearer token", "error": "Unauthorized", "statusCode": 401 }

// 400 — message is an ARRAY of validation failures
{ "message": ["window must be one of ..."], "error": "Bad Request", "statusCode": 400 }

// 429 — NO "error" key. This one is shaped differently from all the others.
{ "statusCode": 429, "message": "Too many login attempts — try again in 300s" }
```

If you write a shared error parser, handle `message` being either a string or an
array, and do not assume `error` exists.

### Which error wins

Guards run before validation, so on any authenticated route:

- Dashboard disabled beats everything → **503**
- Bad token beats a bad query param → **401**, not 400

`POST /api/ops/login` is the exception: it has no guard, so a malformed body
returns **400 even when the dashboard is disabled**, while a well-formed one
returns 503.

### Unknown query parameters are silently ignored

Not rejected — stripped. A typo'd filter name looks like it worked and quietly
returns unfiltered data. Check your parameter names against §6.

---

## 5. CORS

Configured only when `DASHBOARD_ENABLED=true` **and**
`DASHBOARD_CORS_ORIGINS` is non-empty.

- Origins: an exact-match allowlist, comma-separated. No wildcards, no regex.
  Scheme and port must match exactly — `http://localhost:5173` does not cover
  `http://127.0.0.1:5173`.
- Methods: `GET, POST, PATCH, DELETE, OPTIONS`. Headers: `Content-Type,
  Authorization`.
- **`credentials: false`.** Cookies and `credentials: 'include'` will not work.
  The bearer token goes in the header.

**If your origin is not on the list, you do not get a 403.** The server runs the
request normally and simply omits the CORS headers, so the browser blocks the
response and your code sees a network failure with status `0`. In devtools this
is indistinguishable from the API being down. If every call fails but `curl`
works, this is why.

---

## 6. The endpoints

Thirteen, all `GET` except login. Base path `/api/ops`. All require
`Authorization: Bearer` except `/login` and the two docs routes.

Every `window` accepts `24h | 7d | 30d | 90d` and defaults to `24h`. Every
`limit` is an integer 1–200 and defaults to 50.

> **About the examples.** Every envelope and error body below was executed
> against a running instance and matches. The *values* inside `items` are
> invented — no real customer name, phone number or Zoho id appears in this
> file, deliberately. Field names and nesting are guaranteed by the response
> classes, which the compiler checks against what each endpoint returns.

### `POST /login`

Body `{ username, password }`. `username` max 64 chars; both required.

```json
{
  "token": "eyJ1IjoiYWxpY2UiLCJleHAiOjE3NjQ4MjA4MDAwMDB9.Ab3...",
  "actor": "alice",
  "expiresAt": "2026-09-23T02:00:00.000Z"
}
```

Errors: `400` malformed body · `401` wrong credentials · `429` throttled ·
`503` dashboard disabled (only for a well-formed body — see §4).

### `GET /me`

Confirms a token still works. Cheap enough to call on app boot.

```json
{ "actor": "alice" }
```

### `GET /config`

Live operational flags. **Poll this or read it at boot — it is not static.**

```json
{
  "dryRun": false,
  "notificationsEnabled": true,
  "defaultProfile": "Plano_Livre",
  "blockedProfile": "BLOQUEIO",
  "sessionTtlMinutes": 720
}
```

`dryRun: true` means router writes are currently being **emailed instead of
executed**. Show a persistent banner when it is on — every "success" the bridge
records in that state changed nothing on the router. It is a property of *right
now*, never of a historical row.

### `GET /summary?window=`

The overview screen in one call.

```json
{
  "window": "24h",
  "from": "2026-09-21T14:00:00.000Z",
  "to": "2026-09-22T14:00:00.000Z",
  "events": {
    "total": 128,
    "byOutcome": { "SUCCESS": 96, "NOOP": 18, "IGNORED": 9, "DEFERRED": 0, "FAILURE": 5, "UNKNOWN": 0 }
  },
  "effectiveSuccessRate": 0.9579,
  "ignoredEventTypes": [
    { "eventType": "subscription.renewed", "count": 9, "lastSeenAt": "2026-09-22T11:12:00.000Z" }
  ],
  "queue": { "byStatus": { "PENDING": 0, "REPLAYED": 14, "GAVE_UP": 0 }, "oldestPendingAt": null },
  "router": { "connected": true, "outages": 1, "downtimeSeconds": 412, "currentOutageSince": null }
}
```

`effectiveSuccessRate` is `(SUCCESS + NOOP) / (SUCCESS + NOOP + FAILURE)`, to 4
decimal places. It is **`null`, never `0`**, when nothing was decided — see §8.

`ignoredEventTypes` is a Zoho event nobody mapped. A name showing up here
repeatedly is usually a missing mapping, not noise. Worth surfacing.

### `GET /failures?window=&failureCode=&action=&source=&q=&cursor=&limit=`

The worklist: one row per failed event, newest first. Returns `Page<FailureItem>`.

```json
{
  "items": [
    {
      "id": "clx0a1b2c3d4e5f6g7h8",
      "createdAt": "2026-09-22T09:41:03.221Z",
      "eventType": "created",
      "action": "CREATE_USER",
      "source": "ZOHO",
      "failureCode": "NO_SECRET_FOR_CANDIDATES",
      "errorMessage": "No secret found for customer (tried: maria9971234, maria99712340)",
      "zohoCustomerId": "460000000123456",
      "zohoCustomerName": "Maria Example",
      "routerosUsername": "",
      "payload": { "firstName": "Maria", "lastName": "Example", "phone": "9971234", "id": "460000000123456", "state": "created" },
      "actor": null
    }
  ],
  "nextCursor": "MjAyNi0wOS0yMlQwOTo0MTowMy4yMjFafGNseDBhMWIy"
}
```

- `q` is free text over customer name, RouterOS username and Zoho id. **It
  treats `%` and `_` as SQL wildcards** — unlike `/customers/search`. Escape or
  strip them before sending.
- `payload` is the original Zoho event, kept **only on failure rows**, so a human
  can act on it. It is `null` on paths that carry none.
- `routerosUsername` is `""` when there was no username to act on — resolution
  failed, or the queue write failed, or a replay gave up.
- `actor` is always `null`. See §8.

### `GET /failures/by-reason?window=`

The same failures grouped, for a triage chart.

```json
{
  "window": "7d",
  "from": "2026-09-15T14:00:00.000Z",
  "to": "2026-09-22T14:00:00.000Z",
  "reasons": [
    {
      "failureCode": "NO_SECRET_FOR_CANDIDATES",
      "count": 14,
      "customers": 11,
      "lastSeenAt": "2026-09-22T09:41:03.221Z",
      "sampleMessage": "No secret found for customer (tried: maria9971234, maria99712340)"
    }
  ]
}
```

`customers` is distinct customers affected. **14 failures from one customer is a
different problem from 14 customers failing once** — show both numbers.

### `GET /pending`

The replay queue: events that arrived while the router was unreachable.

```json
{
  "byStatus": { "PENDING": 2, "REPLAYED": 14, "GAVE_UP": 0 },
  "items": [
    {
      "id": "clx9z8y7x6w5v4u3t2s1",
      "zohoCustomerId": "460000000123456",
      "eventType": "active",
      "attempts": 3,
      "lastError": "RouterOS connection is not available",
      "queuedAt": "2026-09-22T13:02:11.004Z",
      "waitingSeconds": 3529
    }
  ]
}
```

`byStatus` counts everything ever queued; `items` is the **live queue only**
(status `PENDING`), oldest first, **capped at 200**. A row gives up after 50
attempts or 72 hours and becomes `GAVE_UP`, which is an audited failure.

### `GET /outages?window=`

```json
{
  "window": "30d",
  "from": "2026-08-23T14:00:00.000Z",
  "to": "2026-09-22T14:00:00.000Z",
  "totals": {
    "outages": 3,
    "downtimeSeconds": 1240,
    "longestSeconds": 900,
    "meanTimeToRecoverySeconds": 413,
    "uptimeRatio": 0.999521
  },
  "items": [
    {
      "id": "clxoutage000000000001",
      "startedAt": "2026-09-03T02:14:00.000Z",
      "endedAt": "2026-09-03T02:29:00.000Z",
      "endedBy": "RESTORED",
      "open": false,
      "durationSeconds": 900,
      "reason": "read ECONNRESET",
      "reconnectAttempts": 7
    }
  ]
}
```

- `downtimeSeconds` and `uptimeRatio` count **only the part of each outage inside
  the window**. `durationSeconds` and `longestSeconds` are the outage's real
  length. An open outage is measured to now.
- `endedBy: "ASSUMED_AT_RESTART"` means the link was already back when the
  process restarted — **the end time is an estimate**, so do not present it as
  observed.
- `meanTimeToRecoverySeconds` is `null` when no outage in the window ended.
- **All totals share the 200-row cap with `items`.** See §8.

### `GET /router/census`

Fleet counts, live from the router. `RouterRead<Census>`.

```json
{
  "available": true, "stale": false,
  "fetchedAt": "2026-09-22T14:05:00.000Z", "ageSeconds": 0,
  "data": {
    "secrets": 596, "blocked": 41, "active": 555, "disabled": 12,
    "online": 468, "blockedAndOnline": 33,
    "byProfile": [ { "profile": "10mbps", "count": 302 }, { "profile": "BLOQUEIO", "count": 41 } ]
  }
}
```

- `blocked` = sitting on the blocked profile. `disabled` = the RouterOS flag.
  **These are different things** and a customer can be neither, either or both.
- `active` is simply `secrets − blocked`; it does not consider `disabled`.
- **`blockedAndOnline` is expected to be non-zero.** See §8.
- `online` counts distinct customers with a live session.

### `GET /router/drift?bucket=&cursor=&limit=`

Where the router and the mapping table disagree. `bucket` is
`orphans | missing | ambiguous`, default `orphans`.

```json
{
  "available": true, "stale": false,
  "fetchedAt": "2026-09-22T14:05:02.000Z", "ageSeconds": 0,
  "data": {
    "totals": { "secrets": 596, "mappings": 1042 },
    "counts": { "orphans": 88, "missing": 3, "ambiguous": 2 },
    "bucket": "orphans",
    "page": {
      "items": [ { "username": "maria9971234", "profile": "10mbps", "disabled": false, "comment": "" } ],
      "nextCursor": "maria9971234"
    }
  }
}
```

- **orphans** — on the router, claimed by no mapping. Carry `profile`,
  `disabled`, `comment`.
- **missing** — a mapping points at a secret the router does not have. Carry
  `zohoCustomerIds`.
- **ambiguous** — one username claimed by more than one Zoho id. The twin-contract
  case. Carry `zohoCustomerIds`.
- All three counts come back whichever bucket you page. `totals` is there for
  proportion: **mappings are written lazily**, so early on a big orphan count
  means a sparse table, not real drift.

### `GET /customers/search?q=&cursor=&limit=`

`q` is required, 2–120 chars. Matches Zoho id, customer name, RouterOS username,
or a phone number in any format — `(+238) 9971234`, `00238 9971234` and
`9971234` all match.

```json
{
  "items": [
    {
      "zohoCustomerId": "460000000123456",
      "name": "Maria Example",
      "routerosUsername": "maria9971234",
      "mapped": true,
      "lastEventAt": "2026-09-22T09:41:03.221Z",
      "lastOutcome": "FAILURE"
    }
  ],
  "nextCursor": "460000000123456"
}
```

Ordered by Zoho id, **not relevance** — a relevance sort is not stable under
concurrent writes and a cursor over an unstable sort silently skips rows. `%`
and `_` are escaped here and matched literally.

**Phone search has a real blind spot** — see §8.

### `GET /customers/:zohoCustomerId?cursor=&limit=`

Everything about one customer in one request. The cursor pages **the timeline
only**.

```json
{
  "zohoCustomerId": "460000000123456",
  "identity": { "name": "Maria Example", "phones": ["9971234"], "phonesFrom": "last-failed-event" },
  "mapping": { "routerosUsername": "maria9971234", "lastActiveProfile": "10mbps" },
  "router": {
    "available": true, "stale": false,
    "fetchedAt": "2026-09-22T14:06:00.000Z", "ageSeconds": 0,
    "data": {
      "username": "maria9971234", "exists": true, "profile": "BLOQUEIO",
      "disabled": false, "comment": "", "lastLoggedOut": "sep/22/2026 08:31:02", "online": true
    }
  },
  "counts": { "SUCCESS": 6, "NOOP": 1, "IGNORED": 0, "DEFERRED": 0, "FAILURE": 1, "UNKNOWN": 0 },
  "queue": [],
  "timeline": {
    "items": [
      {
        "id": "clx0a1b2c3d4e5f6g7h8",
        "createdAt": "2026-09-22T09:41:03.221Z",
        "eventType": "inactive", "action": "BLOCK_USER", "source": "ZOHO",
        "outcome": "SUCCESS", "failureCode": null, "errorMessage": null,
        "routerosUsername": "maria9971234", "actor": null, "emailSent": true
      }
    ],
    "nextCursor": null
  }
}
```

- `mapping: null` means the bridge has no stored username for this customer —
  either it never resolved one, or the customer came through the legacy webhook
  path, which writes no mapping.
- `router` is **fresh or unavailable, never stale**.
- `identity.phones` comes from a stored payload, so it is empty for customers
  nothing has gone wrong for. `phonesFrom` says which payload.
- `queue` is **capped at 50** with no cursor.
- The timeline carries **every outcome**, not just failures.
- `404` when there is no mapping, no audit row and nothing queued for that id.

### `GET /customers/:zohoCustomerId/suggestions`

The needs-a-human payload: why the bridge could not place this customer, and
which secrets could be theirs.

```json
{
  "zohoCustomerId": "460000000123456",
  "currentMapping": null,
  "failureCode": "NO_SECRET_FOR_CANDIDATES",
  "basis": { "firstName": "Maria", "phones": ["9971234"], "from": "last-failed-event", "at": "2026-09-22T09:41:03.221Z" },
  "router": {
    "available": true, "stale": false,
    "fetchedAt": "2026-09-22T14:07:00.000Z", "ageSeconds": 0,
    "data": {
      "tried": [
        { "username": "maria9971234", "exists": false, "claimedBy": [] },
        { "username": "maria99712340", "exists": false, "claimedBy": [] }
      ],
      "suggestions": [
        {
          "username": "mariapatricia9971234", "source": "digit-match",
          "profile": "10mbps", "disabled": false, "comment": "",
          "lastLoggedOut": "sep/21/2026 22:04:11", "online": true,
          "claimedBy": [], "linkable": true
        }
      ]
    }
  }
}
```

- `tried` is the bridge's **actual probe ladder**, re-derived by the same
  function that ran — not scraped from an error string.
- `source: "ladder"` means the bridge probed that name. `source: "digit-match"`
  means the secret's name contains the phone digits but was not on the ladder —
  usually the customer's name on the router differs from the name Zoho holds.
- **`linkable: false` means do not offer it.** See §8.
- **Nothing here writes a mapping.** There is no link endpoint. This screen tells
  an operator what to fix by hand.

---

## 7. Enum reference

Use these as your label sets and filter options. They come from the database
schema, so this list is exhaustive.

### `ActionOutcome` — what happened

| Value | Plain language |
|---|---|
| `SUCCESS` | A router change was attempted and worked |
| `NOOP` | Already in the desired state — nothing was written, nothing kicked |
| `IGNORED` | A Zoho event nothing is mapped to; deliberately not acted on |
| `DEFERRED` | Router was down; the event is queued for replay |
| `FAILURE` | Something went wrong — see `failureCode` |
| `UNKNOWN` | Written only by an older build during a deploy window. Rare, historical |

### `FailureCode` — why a `FAILURE` failed

| Value | Plain language |
|---|---|
| `NO_USABLE_PHONE` | Zoho sent no phone number the bridge could use |
| `ALL_CANDIDATES_CLAIMED` | Every matching secret belongs to another customer (twin contract) |
| `NO_SECRET_FOR_CANDIDATES` | No secret exists under any name the bridge derived |
| `PROBE_FAILED` | The router query itself errored while searching |
| `DUPLICATE_SECRET` | A secret already exists under another of the customer's numbers |
| `USER_ALREADY_EXISTS` | Tried to create a secret that is already there |
| `SECRET_NOT_FOUND` | Tried to change a secret that does not exist |
| `ROUTEROS_UNAVAILABLE` | The router was unreachable and the event could not be deferred |
| `REPLAY_GAVE_UP` | Queued 50 attempts or 72 hours without succeeding |
| `QUEUE_WRITE_FAILED` | Router was down **and** the event could not be queued — this one is lost |
| `INVALID_CUSTOM_FIELDS` | Legacy webhook path: the Zoho custom fields were unusable |
| `UNKNOWN` | Unclassified |

`QUEUE_WRITE_FAILED` is the most serious: it is the only case where an event is
genuinely gone. Worth styling louder than the rest.

### `ActionType` — what was attempted

| Value | Plain language |
|---|---|
| `CREATE_USER` | New secret created, disabled until first payment |
| `ENABLE_USER` | Cleared the `disabled` flag |
| `DISABLE_USER` | Set the `disabled` flag |
| `ACTIVATE_USER` | Paid: plan profile restored, session kicked |
| `BLOCK_USER` | Unpaid: moved to the blocked profile, session kicked |
| `DELETE_USER` | Secret removed and session kicked |
| `UPDATE_USER` | Fields changed on an existing secret |
| `KICK_SESSION` | Live session dropped, nothing else |
| `IGNORED` | No action taken |

### `TriggerSource` — who caused it

`ZOHO` (a billing webhook) · `MANUAL` (the admin API, not this dashboard).

### `PendingEventStatus`

`PENDING` (still waiting) · `REPLAYED` (applied on a later attempt) · `GAVE_UP`
(abandoned after 50 attempts or 72 h).

### `OutageEndReason`

`RESTORED` (the reconnect was observed) · `ASSUMED_AT_RESTART` (the link was
already back when the process restarted — **the end time is an estimate**).

---

## 8. Semantics the schema cannot express

The list of things that are true, non-obvious, and will produce a wrong UI if
guessed. Each says what to do instead.

**`available` is not the router-is-down signal — `stale` is.**
On the fleet reads, an unreachable router returns `available: true, stale: true`
with a remembered copy. Branching on `available === false` renders minutes-old
counts as live. Branch on `stale`, and show `ageSeconds`. See §4.

**`actor` is always `null`.** Nothing populates it — it is scaffolding for a
write API that was deferred. **Do not build an "actioned by" column**; it will
be permanently empty.

**`emailSent` means a notification was dispatched, not delivered.** It is a
fixed value recorded at the time of the action. It is unaffected by
`NOTIFICATIONS_ENABLED` and by dry-run, so on a muted deployment `emailSent:
true` while no mail was sent. Label it "notification raised", not "email sent".

**`effectiveSuccessRate` is `null`, never `0`, when nothing was decided.**
`IGNORED`, `DEFERRED` and `UNKNOWN` are excluded from the denominator: an
unmapped Zoho event is not a failure we control, and a deferred event has not
been decided yet. A window full of `IGNORED` rows therefore yields `null`, not a
0% success rate. **Render `null` as "no data", never as 0%** — the difference is
"quiet day" versus "everything is broken".

**"Blocked but online" is expected, not an anomaly.** Blocking switches the
profile and kicks the session once; the customer immediately reconnects into the
throttled profile. `blockedAndOnline` being large is the system working. Do not
flag it as an error.

**A claimed link candidate is non-linkable, not lower-ranked.** `linkable: false`
means another Zoho id already maps to that secret — it is a twin contract, and
taking it would cut off a real paying customer. Render it as unavailable with
the claiming ids visible. Never as a slightly worse option.

**Phone search misses exactly the customers you are looking for.** It matches the
digits against the *RouterOS username*, which is how mapped customers are found.
A customer whose resolution **failed** has no username, so **they cannot be found
by phone at all** — and they are the ones on the worklist. Reach them through
`/failures` and `/customers/:id/suggestions` instead, and say so in the search
UI's empty state.

**The two search boxes escape differently.** `/customers/search` treats `%` and
`_` literally. `/failures?q=` treats them as SQL wildcards. Sanitise before
sending to `/failures`, or a customer named `100%` returns nonsense.

**Several lists are silently truncated.** `/pending` items and `/outages` items
cap at 200; a customer's `queue` caps at 50. None carries a "there are more"
flag. **`/outages` totals are computed from the same 200-row slice**, so in a
window with more than 200 outages the downtime under-reports and `uptimeRatio`
is inflated. Treat those totals as approximate at high volume.

**Unknown query parameters are silently dropped.** A typo'd filter name returns
unfiltered data and looks like it worked. There is no 400 to catch it.

**`dryRun` is live configuration, not a row property.** There is no `dryRun`
column and historical rows carry no such flag. `GET /config` tells you whether
mutations are being executed **right now** and says nothing about the past.

---

## 9. The seven screens

The API was shaped around these seven questions. Layout is yours; the mapping
from question to endpoint is the part worth keeping.

All seven are equal priority. Every screen needs the auth gate from §3, and
every screen should handle 503 as "the dashboard is switched off".

### 1. Overview — "is the bridge healthy?"

`GET /summary` · `GET /config` · `GET /health` (unauthenticated)

Outcome mix, `effectiveSuccessRate`, queue depth, router connected, current
outage. A dry-run banner from `/config`. `ignoredEventTypes` deserves a slot —
it is how a missing mapping is discovered.

*Empty:* `effectiveSuccessRate: null` → "no events in this window".
*Traps:* the null rate; `dryRun`.
*Polling:* 30–60 s is plenty.

### 2. Failures — "who needs a human, and why?"

`GET /failures` (worklist) · `GET /failures/by-reason` (triage)

The main working screen. Filter by `failureCode`, `action`, `source`, free text.
Row → customer 360. Show `errorMessage` verbatim; it carries the detail
`failureCode` cannot.

*Empty:* genuinely good news — say so.
*Traps:* `%` in `q`; `actor` always null; `routerosUsername` empty means
resolution never got that far.
*Polling:* on demand.

### 3. Queue — "is the replay queue draining?"

`GET /pending`

Only interesting when the router has been down. `waitingSeconds` and `attempts`
are the fields that matter; a row near 50 attempts is about to be abandoned.

*Empty:* the normal state.
*Traps:* 200-row cap; `byStatus` counts history, `items` is the live queue.
*Polling:* 30 s while non-empty.

### 4. Needs a human — "which secret is this customer's?"

`GET /failures?failureCode=NO_SECRET_FOR_CANDIDATES` (and
`ALL_CANDIDATES_CLAIMED`) → `GET /customers/:id/suggestions`

The highest-value screen. Show `basis` (what the bridge had to work with),
`tried` (what it looked for and what was there), then the candidates. Make
`linkable: false` visually unavailable with its `claimedBy` ids shown.

**There is no link button.** The operator fixes the mapping by hand outside this
tool. The screen's job is to give them everything needed to decide.

*Traps:* `linkable`; `available: false` here can mean "no stored payload", not
"router down" — show `unavailableReason`.

### 5. Drift — "where do the two systems disagree?"

`GET /router/drift?bucket=`

Three tabs: orphans, missing, ambiguous. Show `totals` beside the counts so a
big orphan number is read in proportion.

*Traps:* raw-string cursor; `stale`.
*Polling:* on demand — it reads the whole router.

### 6. Customer 360 — "what is the whole story for this customer?"

`GET /customers/:id` (one request) · `GET /customers/search` to get here

Identity, mapping, live router state, outcome counts, queued events, timeline.
The router block is fresh or unavailable — if it is unavailable, **say so
loudly**, because an operator is about to act on this line.

*Empty:* 404 → "no customer with that Zoho id".
*Traps:* `mapping: null` is normal for legacy customers; `queue` caps at 50;
`emailSent`.

### 7. Census — "how many customers, and how many are cut off?"

`GET /router/census`

Fleet totals and the profile breakdown. A good place for the stale banner, since
this is the screen most likely to be served from a remembered copy.

*Traps:* `blockedAndOnline` is expected; `blocked` ≠ `disabled`.

---

## 10. What does not exist

Said plainly, so nothing gets built against it.

- **No write endpoints of any kind.** No link, unlink, replay, enable, disable,
  block, activate or delete. This API only reads. Buttons that change state will
  404. A write API was specified and deliberately deferred.
- **No bulk operations**, and none are planned. Every action emails the owner and
  there is no transaction across router writes, so a 40-customer bulk change
  would send 40 emails and could leave a half-applied change with no rollback.
  Do not build multi-select expecting one to arrive.
- **No trend or time-series endpoint.** Nothing returns per-hour or per-day
  buckets, so the overview cannot have a chart over time yet. It is a known
  future task.
- **No roles or permissions.** Every operator sees everything; there is no 403.
- **No logout endpoint and no token revocation.** Deleting the token client-side
  is logging out. Removing an operator needs a server restart.
- **No `Retry-After` header** on the 429. The wait is inside the message string.
- **No websockets or server-sent events.** Poll.

One more thing that looks broken and is not: **`POST /webhook/zoho` always
returns 401.** It is the legacy billing webhook and it has been deliberately
switched off — an unconditional rejection sits ahead of its token check. Zero
traffic on that path is expected. The live path is `POST /webhook/zoho/customer`.
