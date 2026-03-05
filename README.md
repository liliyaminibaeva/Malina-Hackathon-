# Malina — Knitting Pattern Generator

Malina is a 4-step web app that generates custom, print-ready knitting patterns. Pick a garment, configure the style (manually or by uploading a photo), choose your yarn, and get a full pattern you can print or save as a PDF.

---

## Features

- **8 item types** — sweater, slipover, t-shirt, beanie, gloves, scarf, mittens, hood
- **Live SVG preview** — parametric garment schematic updates as you configure options
- **Photo recognition** — upload a photo of a sweater to auto-fill construction, neckline, fit, sleeve length, hem and cuff
- **Yarn search** — search Ravelry's yarn database or enter gauge details manually
- **Pattern generation** — Claude generates a full, size-graded knitting pattern in PetiteKnit style
- **Size highlighting** — your chosen size is bolded throughout the pattern
- **Print / PDF** — one-click print layout

---

## Prerequisites

- **Node.js** 18 or later
- An [Anthropic](https://console.anthropic.com/) API key
- A [Ravelry](https://www.ravelry.com/api) account with API credentials

---

## Setup

**1. Clone the repo**

```bash
git clone https://github.com/liliyaminibaeva/Malina-Hackathon-.git
cd Malina-Hackathon-/git_repo
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env.local` file in the `git_repo/` directory:

```bash
cp .env.example .env.local
```

Then fill in the values:

```env
ANTHROPIC_API_KEY=sk-ant-...
RAVELRY_USERNAME=your-ravelry-username
RAVELRY_PASSWORD=your-ravelry-password
```

> Never commit `.env.local`.

**4. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Build & Lint

```bash
npm run build   # TypeScript compile + Next.js production build
npm run lint    # ESLint
```

---

## App Flow

| Step | Route | Description |
|------|-------|-------------|
| 1 | `/` | Pick an item type |
| 2 | `/configure` | Set style options — or upload a photo to auto-fill them |
| 3 | `/yarn` | Search Ravelry or enter yarn details manually |
| 4 | `/generate` | Generate, preview, and print the pattern |

State is held in-memory and resets on full page reload.

---

## API Routes

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/analyze-photo` | Accepts a multipart image; returns detected style fields |
| `GET` | `/api/search-yarn` | Accepts `?q=` query; returns yarn results from Ravelry |
| `POST` | `/api/generate-pattern` | Accepts full config; returns generated pattern text |

### POST /api/analyze-photo

- **Body:** `multipart/form-data` with an `image` field (JPEG, PNG, GIF, or WebP; max 10 MB)
- **Returns:** `{ fields: { construction, neckline, sleeveLength, fit, hem, cuff } }` — only keys Claude can confidently identify are included
- **Errors:** `400` for missing/invalid image; `500` on Claude error

### GET /api/search-yarn

- **Query:** `?q=<search term>`
- **Returns:** array of yarn results `{ id, name, brand, weight, gauge, needleSize }`
- **Errors:** `400` if `q` is missing; `500` if Ravelry credentials are invalid

### POST /api/generate-pattern

- **Body:** `{ itemType, styleConfig, yarnConfig }` JSON
- **Returns:** `{ pattern: string }` — full knitting pattern text
- **Errors:** `400` if required fields are missing; `500` on Claude error

---

## Stack

- [Next.js](https://nextjs.org/) 15 — App Router, Turbopack
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [react-hook-form](https://react-hook-form.com/)
- [Anthropic Claude](https://www.anthropic.com/) — photo analysis + pattern generation
- [Ravelry API](https://www.ravelry.com/api) — yarn search

---

## Known Limitations

- State resets on full page reload (no persistence)
- The "Bottoms" category is displayed but not yet supported
