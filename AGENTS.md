<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## shadcn conventions

Two fixes applied on top of the shadcn CLI output for the `radix-nova` style. Re-running `npx shadcn add` overwrites `components/ui/*` — re-apply both afterwards.

- **Phosphor icons: import from `@phosphor-icons/react/ssr`, never the root entry.** The root entry re-exports the CSR build, which calls `React.createContext` at module scope with no `"use client"` directive, so it crashes any server component that imports it (e.g. `components/ui/breadcrumb.tsx`, which upstream intentionally ships without `"use client"`). `/ssr` is Phosphor's documented RSC entry point and exports identical names.
- **`TooltipProvider` is mounted once in `app/layout.tsx`.** Do not re-add it to `components/ui/sidebar.tsx`. The `radix-nova` sidebar deliberately ships without it (the legacy `new-york` style embedded it in `SidebarProvider`; the current style does not), and shadcn's tooltip docs specify the app root. `SidebarMenuButton` renders a bare `<Tooltip>` whenever a `tooltip` prop is passed, so without the root provider Radix throws ``Tooltip` must be used within `TooltipProvider``.

## Dashboard architecture

Read `docs/dashboard-api.md` before touching a screen — the meanings live there, not in the types.

- **Server-first.** Pages under `app/dashboard/*` are async Server Components: `await requireSession()`, parse `searchParams` with the zod schemas in `lib/validations/query.ts` (every field `.catch()`es to its default — a bad param never 400s), then compose section components inside `<Suspense>` with a skeleton from `components/skeletons/` that mirrors the real box model. Each route also has a `loading.tsx` built from the same skeletons.
- **Data access is `lib/api/`, server-only.** `opsFetch()` in `lib/api/client.ts` is the only place that talks to the backend: bearer from the `ops_session` cookie, `cache: "no-store"`, NestJS error bodies normalised into `ApiError`, **401 → `redirect("/login?reason=expired")`, 503 → `redirect("/disabled")`**. One thin function per endpoint in `lib/api/ops.ts`; identical calls in one render are memoised by Next, so sections fetch what they need. No client-side data fetching, no data library; the backend URL (`OPS_API_URL`, `lib/env.ts`) never reaches the browser.
- **Auth.** The token is *not* a JWT (`lib/auth/token.ts`: two segments, `exp` in epoch **ms**). `proxy.ts` is the optimistic gate (cookie only); `app/api/auth/{login,logout}/route.ts` are the only route handlers. There is no backend logout — deleting the cookie is the logout.
- **URL is state.** Window, filters, tabs and cursors live in `searchParams`; client controls use `hooks/use-query-params.ts` (`set()` drops the cursor on any filter change). Only ever send back a `nextCursor` the API returned.
- **Types vs validation vs components.** DTOs in `types/ops.ts` (mirrors the OpenAPI), query shapes in `types/query.ts`, zod in `lib/validations/`, plain-language labels/badge variants in `lib/labels.ts`, const enums in `lib/constants.ts`. A component file declares only its own `Props`.
- **Forms** are react-hook-form + zod via shadcn `Field` (`<Controller render={({field, fieldState}) => <Field data-invalid=…>…<FieldError errors={[fieldState.error]} />}`). Feedback is `sonner` toasts (`<Toaster />` in the root layout).
- **RouterRead handling** is shared: `StaleBanner` when `stale` (branch on `stale`, never `available`), `UnavailableState` when `available: false` (show `unavailableReason`; it can mean "no stored payload", not "router down").
- **Charts** (`components/charts/`) use shadcn `chart` + recharts, built with the `dataviz` skill: horizontal bars ≤20 px, 4 px rounded data-ends, solid hairline grid, tip labels on the primary series only, legend only for two series. Categorical slots `#2a78d6`/`#eb6834` (light) and `#3987e5`/`#d95926` (dark) were validated with the skill's `validate_palette.js` against this theme's surfaces; emphasis charts use `var(--chart-2)` + `var(--destructive)`. Don't add hues without re-running the validator.
- **Shell.** `app/dashboard/layout.tsx` holds the shadcn `sidebar-07` block shell verbatim; `components/{app-sidebar,nav-*}.tsx` are the block files with real nav data from `lib/nav.ts` (a section with no children renders flat). The dry-run flag is `components/layout/dry-run-indicator.tsx` in the header's right slot (badge + tooltip). Login is the shadcn `login-02` block: `app/login/page.tsx` + `components/login-form.tsx`. Keep block markup; change data and behaviour only.
- **Language.** All UI copy is pt-BR (`<html lang="pt-BR">`, `LOCALE = "pt-BR"` in `lib/format.ts`). Business terms stay in English: Dry-run, PPPoE, secret, username, webhook, payload, Zoho, RouterOS, BLOQUEIO, enum/code values, "Bridge Ops". Code comments, `aria-label`s, `sr-only` text and `components/ui/*` stay English. Backend (NestJS) error text is shown verbatim; the login route rewrites the 429 message but keeps the `<n>s` the form parses.
- Known: `npm run lint` currently crashes inside `eslint-plugin-react` (ESLint 10 vs `eslint-config-next@16.3.4`); rely on `npm run typecheck` until the plugin is updated.
