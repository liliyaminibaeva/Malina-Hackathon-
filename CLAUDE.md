# Malina — AI Knowledge Base

## Project Overview

Malina is a Next.js app for generating PetiteKnit-style knitting patterns via the Claude API.

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

`PHOTO_ANALYSIS_PROMPT` construction allowed values must match what `CONSTRUCTION_NOTES` handles in `getPatternPrompt`.

## PatternPreview Component

Located at `components/PatternPreview/PatternPreview.tsx`, exported via `components/PatternPreview/index.ts`.

Props: `{ patternText: string }`

All PatternPreview styles are in `app/globals.css` under `/* PatternPreview styles */`. No CSS module. The `no-print` class hides the print button during `window.print()`. Print CSS uses `visibility: hidden` on body and `visibility: visible` on `.pattern-preview-wrapper` to isolate the pattern for printing.

## Test Script

`scripts/test-prompts.mjs` is a standalone Node.js script (no build step needed) that validates prompt string construction and `parsePattern` logic against realistic sample patterns. Run with:

```
node scripts/test-prompts.mjs
```

Note: the script contains inline copies of production functions to avoid TS compilation. These copies must be kept in sync with `lib/prompts.ts` and `PatternPreview.tsx` when those files change.

The script does not call the Claude API — it uses hardcoded sample patterns.

## Build Commands

```
npm run dev      # development server
npm run build    # TypeScript compile + Next.js build (run after any TS changes)
node scripts/test-prompts.mjs  # run prompt/parser tests
```
