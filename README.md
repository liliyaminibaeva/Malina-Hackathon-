# Malina — Knitting Pattern Generator

A 4-step web app that generates custom knitting patterns. Users pick an item type, configure style options (manually or via photo upload), specify their yarn, and receive a generated pattern they can print or save as a PDF.

## Application Flow

1. `/` — Pick an item type (sweater, slipover, t-shirt, beanie, gloves, scarf, mittens, hood)
2. `/configure` — Configure style options via manual toggle-button form or photo upload
3. `/yarn` — Search for yarn by name or enter weight, gauge, and needle size manually
4. `/generate` — Enter email, generate the pattern, preview and print/save as PDF

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build & Lint

```bash
npm run build   # TypeScript compile + Next.js build
npm run lint    # ESLint
```

## API Routes (required by backend — Dev 2)

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/analyze-photo | Accepts multipart image, returns StyleConfig JSON |
| GET | /api/search-yarn | Accepts ?q= query, returns array of yarn results |
| POST | /api/generate-pattern | Accepts full config object, returns pattern text/sections |

## Notes

- Photo upload accepts JPEG and PNG images up to 10 MB
- The "Bottoms" category (socks, pants, shorts) is displayed but not yet supported
- Cross-step state is held in a React context and resets on full page reload
