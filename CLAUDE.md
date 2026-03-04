# CLAUDE.md

## Stack

Next.js App Router, TypeScript, Tailwind CSS v4, react-hook-form.

## Project Structure

- `app/` — Next.js pages (one `page.tsx` per route)
- `components/` — UI components, one directory per component with an `index.ts` barrel export
- `lib/store.tsx` — Shared React context for cross-step form state
- `docs/plans/` — Per-developer task plans

## Application Flow

4-step linear routing flow (all client components):
1. `/` — Pick item type (ItemPicker)
2. `/configure` — Style config via manual form or photo upload
3. `/yarn` — Yarn search + manual yarn details
4. `/generate` — Email input, pattern generation, preview and print

## State Management

All cross-step state lives in `PatternFormContext` (`lib/store.tsx`). Consume via `usePatternForm()` hook.

Each page guards against missing upstream state by redirecting backward if its required context value is null:
- `/configure` redirects to `/` if `itemType` is null
- `/yarn` redirects to `/configure` if `styleConfig` is null
- `/generate` redirects to `/yarn` if `yarnConfig` is null

State is in-memory only and resets on full page reload.

## Form Conventions

- All forms use react-hook-form
- Style config fields render as toggle-button groups (not selects/dropdowns)
- Field definitions for all item types live in `components/ConfigForms/fields.ts`
- When passing `defaultValues` to ConfigForm from external data (e.g. photo analysis), use a `key` prop to force re-mount when data changes

## Component Conventions

- Each component lives in its own directory with a barrel `index.ts` export
- All pages and components that consume context are client components (`"use client"`)

## Print Styles

- Add class `no-print` to any element that must be hidden on print
- Print media query lives in `app/globals.css`

## Build & Lint

```
npm run dev    # development server
npm run build  # TypeScript compile + Next.js build (run after every change)
npm run lint   # ESLint
```

## API Routes (not yet implemented — built by Dev 2)

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/analyze-photo | Accepts multipart image, returns StyleConfig JSON |
| GET | /api/search-yarn | Accepts ?q= query, returns YarnResult[] |
| POST | /api/generate-pattern | Accepts full config, returns pattern text/sections |

Frontend handles API unavailability via error states (no mocks needed in dev).

## Known Limitations

- State is lost on full page reload (no sessionStorage persistence)
- The "Bottoms" category (socks, pants, shorts) is displayed but disabled — not yet supported
