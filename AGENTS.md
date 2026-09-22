<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## shadcn conventions

Two fixes applied on top of the shadcn CLI output for the `radix-nova` style. Re-running `npx shadcn add` overwrites `components/ui/*` — re-apply both afterwards.

- **Phosphor icons: import from `@phosphor-icons/react/ssr`, never the root entry.** The root entry re-exports the CSR build, which calls `React.createContext` at module scope with no `"use client"` directive, so it crashes any server component that imports it (e.g. `components/ui/breadcrumb.tsx`, which upstream intentionally ships without `"use client"`). `/ssr` is Phosphor's documented RSC entry point and exports identical names.
- **`TooltipProvider` is mounted once in `app/layout.tsx`.** Do not re-add it to `components/ui/sidebar.tsx`. The `radix-nova` sidebar deliberately ships without it (the legacy `new-york` style embedded it in `SidebarProvider`; the current style does not), and shadcn's tooltip docs specify the app root. `SidebarMenuButton` renders a bare `<Tooltip>` whenever a `tooltip` prop is passed, so without the root provider Radix throws ``Tooltip` must be used within `TooltipProvider``.
