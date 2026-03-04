# Malina — AI Knowledge Base

## Project Overview

Malina is a Next.js 14 App Router application for generating PetiteKnit-style knitting patterns via the Claude API. Backend API routes integrate with Anthropic Claude (vision + text generation) and Ravelry (yarn search).

## Key Files

- `lib/claude.ts` — shared Anthropic client singleton; import this, do not instantiate your own
- `lib/ravelry.ts` — Ravelry API fetch helper with Basic Auth; exports `ravelryFetch` and `RavelryError`
- `lib/prompts.ts` — all Claude prompts centralized here; do not inline prompts in route files
- `components/PatternPreview/PatternPreview.tsx` — pattern display component

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

`SYSTEM_PROMPT` is the source of truth for output format rules. Do not encode format rules elsewhere.

`ItemType` union is the canonical list of supported item types. Must stay in sync with: `ITEM_LABELS`, `CONSTRUCTION_NOTES`, and Dev 1 config forms.

## PatternPreview Component

Located at `components/PatternPreview/PatternPreview.tsx`, exported via `components/PatternPreview/index.ts`.

Props: `{ patternText: string }`

All PatternPreview styles are in `app/globals.css` under `/* PatternPreview styles */`. No CSS module. The `no-print` class hides the print button during `window.print()`. Print CSS uses `visibility: hidden` on body and `visibility: visible` on `.pattern-preview-wrapper` to isolate the pattern for printing.

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
- Throws `RavelryError` (with `.status` number) on non-OK responses; check `error instanceof RavelryError && error.status === 401` for credential errors
- `RavelryYarn.yarn_weight` is nullable — always use optional chaining (`yarn_weight?.name`)

### Error Handling

- All routes return `{ error: string }` with appropriate HTTP status on failure
- Always log errors server-side with `console.error(error)` before returning generic 500
- Never expose raw upstream error messages or env var names to clients

## Environment Variables

Required at runtime:
- `ANTHROPIC_API_KEY` — Anthropic API key
- `RAVELRY_USERNAME` — Ravelry Basic Auth username
- `RAVELRY_PASSWORD` — Ravelry Basic Auth password

## Build Commands

```
npm run dev      # development server
npm run build    # TypeScript compile + Next.js build (run after any TS changes)
node scripts/test-prompts.mjs  # run prompt/parser tests
```
