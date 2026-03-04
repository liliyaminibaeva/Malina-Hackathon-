# Malina — Knitting Pattern Generator

A 4-step web app that generates custom knitting patterns. Users pick an item type, configure style options (manually or via photo upload), specify their yarn, and receive a generated pattern they can print or save as a PDF.

## Application Flow

1. `/` — Pick an item type (sweater, slipover, t-shirt, beanie, gloves, scarf, mittens, hood)
2. `/configure` — Configure style options via manual toggle-button form or photo upload
3. `/yarn` — Search for yarn by name or enter weight, gauge, and needle size manually
4. `/generate` — Enter email, generate the pattern, preview and print/save as PDF

## Prerequisites

- An [Anthropic](https://console.anthropic.com/) account with an API key
- A [Ravelry](https://www.ravelry.com/api) account with API credentials

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude vision and pattern generation |
| `RAVELRY_USERNAME` | Ravelry API username (Basic Auth) |
| `RAVELRY_PASSWORD` | Ravelry API password (Basic Auth) |

Never commit `.env.local`.

## API Reference

### POST /api/analyze-photo

Accepts `multipart/form-data` with an `image` field (JPEG, PNG, GIF, or WebP; max 10 MB).

Returns `{ fields: { construction, neckline, sleeveLength, fit, hem } }`.

Errors: 400 if no image or invalid file type; 500 on Claude error.

### GET /api/search-yarn

Accepts `?q=<query>` parameter.

Returns `{ yarns: [{ id, name, brand, weight, gauge, needleSize }] }` (up to 10 results from Ravelry).

Errors: 400 if `q` is missing or empty; 500 if Ravelry credentials are invalid or the request fails.

### POST /api/generate-pattern

Accepts `{ itemType: string, styleConfig: object, yarnConfig: { weight: string } }` JSON body.

Returns `{ pattern: string }` — full generated knitting pattern text.

Errors: 400 if `itemType` or `yarnConfig.weight` is missing; 500 on Claude error.

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
