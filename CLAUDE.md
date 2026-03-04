# CLAUDE.md

## Stack

Next.js App Router, TypeScript, Tailwind CSS v4, react-hook-form.

## Project Structure

- `app/` — Next.js pages (one `page.tsx` per route)
- `app/api/` — API routes (analyze-photo, search-yarn, generate-pattern)
- `components/` — UI components, one directory per component with an `index.ts` barrel export
- `lib/store.tsx` — Shared React context for cross-step form state
- `lib/claude.ts` — Shared Anthropic client singleton; import this, do not instantiate your own
- `lib/ravelry.ts` — Ravelry API fetch helper with Basic Auth
- `lib/prompts.ts` — All Claude prompts centralized here; do not inline prompts in route files
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

## Pattern Text Format (shared contract)

`lib/prompts.ts` and `components/PatternPreview/PatternPreview.tsx` share a plain-text pattern format. Format rules are encoded in `SYSTEM_PROMPT`; the parser lives in `parsePattern()` in `PatternPreview.tsx`. Changes to section names or heading syntax must be updated in both places.

Section heading detection regex: `/^([A-Z][A-Z\s]+):?\s*$/m`

Required sections, in order: PATTERN NAME, SIZES, FINISHED MEASUREMENTS, MATERIALS, GAUGE, ABBREVIATIONS, NOTES, INSTRUCTIONS.

Sections with special rendering in PatternPreview:
- MATERIALS: unordered list
- FINISHED MEASUREMENTS, SIZES: two-column table (colon-split lines)
- INSTRUCTIONS: paragraph per line with left indent
- ABBREVIATIONS: `<dl>` definition list (colon-split lines)
- All others: default paragraph renderer

## Prompt Architecture

All Claude prompt logic lives in `lib/prompts.ts`. Exports:
- `SYSTEM_PROMPT`: always passed as system turn; encodes PetiteKnit voice, format rules, size grading, required sections
- `PHOTO_ANALYSIS_PROMPT`: used by photo analysis API route; returns JSON with keys: construction, neckline, sleeveLength, fit, hem
- `getPatternPrompt(itemType, styleConfig, yarnConfig)`: builds user-turn prompt for pattern generation

## Print Styles

- Add class `no-print` to any element that must be hidden on print
- Print media query lives in `app/globals.css`
- All PatternPreview styles are in `app/globals.css` under `/* PatternPreview styles */`

## Backend Conventions

### Claude API Usage

- All Claude calls use the singleton from `lib/claude.ts`
- Photo analysis: model `claude-opus-4-6`, max_tokens 1024
- Pattern generation: model `claude-opus-4-6`, max_tokens 4096, with system prompt
- Claude response text is always at `response.content.find(b => b.type === "text")`

### Ravelry Integration

- Base URL: `https://api.ravelry.com`
- Auth: HTTP Basic Auth via `RAVELRY_USERNAME` and `RAVELRY_PASSWORD` env vars
- Use `ravelryFetch(path, params)` from `lib/ravelry.ts` — handles auth and URL construction
- Throws `RavelryError` (with `.status` number) on non-OK responses
- `RavelryYarn.yarn_weight` is nullable — always use optional chaining (`yarn_weight?.name`)

### Error Handling

- All routes return `{ error: string }` with appropriate HTTP status on failure
- Always log errors server-side with `console.error(error)` before returning generic 500
- Never expose raw upstream error messages or env var names to clients

## API Routes

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/analyze-photo | Accepts multipart image, returns StyleConfig JSON |
| GET | /api/search-yarn | Accepts ?q= query, returns YarnResult[] |
| POST | /api/generate-pattern | Accepts full config, returns `{ pattern: string }` |

## Environment Variables

Required at runtime:
- `ANTHROPIC_API_KEY` — Anthropic API key
- `RAVELRY_USERNAME` — Ravelry Basic Auth username
- `RAVELRY_PASSWORD` — Ravelry Basic Auth password

## Build Commands

```
npm run dev      # development server
npm run build    # TypeScript compile + Next.js build (run after any TS changes)
npm run lint     # ESLint
```

## Known Limitations

- State is lost on full page reload (no sessionStorage persistence)
- The "Bottoms" category is displayed but disabled — not yet supported
