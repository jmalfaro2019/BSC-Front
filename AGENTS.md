# AGENTS.md

## Project

Balanced Scorecard (BSC) dashboard — React 19 + TypeScript + Vite + Tailwind CSS v4. Based on TailAdmin template.

## Commands

```bash
npm run dev        # Start Vite dev server (proxies /api → localhost:3000)
npm run build      # tsc -b && vite build (typecheck runs as part of build)
npm run lint       # ESLint (eslint . — uses flat config in eslint.config.js)
npm run preview    # Preview production build locally
```

No test runner is configured. No test files exist in the repo.

## Architecture

- **Entrypoint**: `src/main.tsx` → `App.tsx` (React Router)
- **Provider stack** (outer→inner): `QueryClientProvider` → `AuthProvider` → `ThemeProvider` → `AppWrapper` → `App`
- **Routing**: `react-router` v7. Dashboard routes nested under `ProtectedRoute` + `AppLayout` (sidebar + header)
  - `/` — Strategic Lines tab
  - `/proyectos` — Projects tab
  - `/acciones` — Actions tab
  - `/ingreso-datos` — Data Entry tab
  - `/ponderaciones` — Weightings page
  - `/signin` — Login page (public)

## Data flow

- **API client**: `src/services/api.ts` — axios instance with JWT interceptor and auto-refresh on 401
- **Service layer**: `src/services/bscService.ts` (CRUD) + `src/services/authService.ts` (login/logout/refresh)
- **Server state**: TanStack Query via custom hooks (`src/hooks/usePerspectives.ts`, `src/hooks/useUpdateProgress.ts`)
- **Auth state**: `src/context/AuthContext.tsx` — stores user in localStorage (token, refreshToken, username, role)
- **Types**: Re-exported from `bsc-shared` via `src/types/bsc.ts`
- **Backend**: All data comes from the REST API at `/api/perspectives/**` (see `bsc-api/`). No local JSON data source.

## Key patterns

- **Auth**: `AuthProvider` wraps the entire app. `ProtectedRoute` component guards dashboard routes. Tokens in `localStorage`. Axios interceptor auto-refreshes expired JWT tokens and queues concurrent requests.
- **Theme**: Dark mode via `ThemeContext.tsx` toggling `.dark` class on `<html>`. Tailwind v4 `@custom-variant dark (&:is(.dark *))` pattern.
- **SVGs**: Import as `?react` named export (`vite-plugin-svgr` configured in `vite.config.ts`). See `src/svg.d.ts` for the type declaration.
- **Icons**: `src/icons/index.ts` — barrel export for all SVG icon components.
- **CSS utilities**: Custom Tailwind v4 `@utility` directives defined in `src/index.css` (`menu-item`, `menu-item-active`, etc.).
- **Peer dependency overrides**: `react-helmet-async` and `@react-jvectormap` have peer dep overrides in `package.json` for React 19 compat.

## Build verification order

```bash
npm run lint && npm run build
```

Typecheck is part of `build` only. There is no separate `typecheck` script.

## Style conventions

- Tailwind CSS v4 (not v3). Uses `@theme`, `@custom-variant`, `@utility`, `@layer base` — not `tailwind.config.js`.
- Color tokens are brand-, gray-, blue-light-, success-, error-, warning- prefixed.
- Font: Outfit (loaded via Google Fonts CDN in `index.css`).
- React components use `"use client"` directive at top (Next.js-style, though this is a Vite SPA).

## Prerequisites

- **API server must be running** on port 3000 for the app to function. Vite proxies `/api` requests to `http://localhost:3000` (see `vite.config.ts`).
- **Auth required**: Default seed creates `admin` / `admin123`. Login at `/signin`.