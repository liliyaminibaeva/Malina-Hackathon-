# Malina — Development Plan

Knitting pattern generator web app built with Next.js 14, Claude API, Ravelry API, and Resend.

---

## Dev 1 — Frontend & UI

- Create app layout with step-based navigation (steps 1–4) and shared state via React context
- Build Step 1: item type picker with categories (Tops, Accessories) and item cards
- Build Step 2 Path B: configuration forms for all 8 item types (sweater, slipover, t-shirt, beanie, gloves, scarf, minnens, hood) using react-hook-form
- Build Step 2 Path A: photo upload component with drag-and-drop, preview, and form pre-fill from API response
- Build Step 2 combined view: Ravelry placeholder area + pre-filled config form side by side
- Build Step 3: yarn search input with autocomplete results from API, plus manual entry fallback for weight/gauge/needle size
- Build Step 4: email input field, loading state during generation, pattern preview display on screen
- Polish overall UI with Tailwind: clean Scandinavian aesthetic matching PetiteKnit style

## Dev 2 — Backend & Integrations

- Set up environment variables and validate on startup
- Build POST /api/analyze-photo: accept image upload (multipart), send to Claude vision API, return mapped config form fields
- Build GET /api/search-yarn: proxy Ravelry yarn search, return name/weight/gauge/needle size
- Build POST /api/generate-pattern: accept full config object, call Claude with pattern generation prompt, return pattern text
- Build POST /api/send-pattern: accept pattern text + email, generate PDF with @react-pdf/renderer, send via Resend with PDF attachment, return success
- Add error handling and input validation to all API routes

## Dev 3 — Prompts & PDF Template

- Write system prompt for pattern generation: PetiteKnit style brief, output structure (header/materials/gauge/abbreviations/notes/instructions), example excerpt
- Write item-specific generation prompts for all 8 item types incorporating config fields and size grading XS–XXL
- Write photo analysis prompt: define what visual attributes to detect (neckline, silhouette, texture, colorwork, construction) and how to map them to form fields
- Build PDF template component using @react-pdf/renderer: sections for header, materials, gauge, abbreviations, notes, numbered instructions with inline size variants in brackets
- Test all prompts manually via Claude API and iterate on output quality
