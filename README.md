This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
