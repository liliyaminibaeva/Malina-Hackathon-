# Malina — Architecture Notes for AI Assistants

## Project Overview

Next.js 14 App Router application for knitting pattern generation. Backend API routes integrate with Anthropic Claude (vision + text generation) and Ravelry (yarn search).

## Key Files

- `lib/claude.ts` — shared Anthropic client singleton; import this, do not instantiate your own
- `lib/ravelry.ts` — Ravelry API fetch helper with Basic Auth; exports `ravelryFetch` and `RavelryError`
- `lib/prompts.ts` — all Claude prompts centralized here; do not inline prompts in route files

## Conventions

### Claude API Usage

- All Claude calls use the singleton from `lib/claude.ts`
- Photo analysis: model `claude-opus-4-6`, max_tokens 1024
- Pattern generation: model `claude-opus-4-6`, max_tokens 4096, with system prompt
- Claude response text is always at `response.content.find(b => b.type === "text")`

### Prompt Management

- All prompt strings and prompt builder functions live in `lib/prompts.ts`
- Do not hardcode prompts inside route handlers
- Placeholder prompts are used until Dev 3 delivers final versions

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

Required at runtime (validated at startup):
- `ANTHROPIC_API_KEY` — Anthropic API key
- `RAVELRY_USERNAME` — Ravelry Basic Auth username
- `RAVELRY_PASSWORD` — Ravelry Basic Auth password

## Build Command

```bash
npm run build
```
