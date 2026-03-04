# Malina — Frontend & UI

## Overview

Build the full user-facing interface for Malina: a 4-step knitting pattern generator. The UI guides users from picking an item type, through configuration (photo upload or manual form), yarn selection, and finally pattern generation and preview. No login, no accounts. Clean Scandinavian aesthetic inspired by PetiteKnit.

Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, react-hook-form.

## Context

- Files involved: `app/` pages, `components/` UI components, `app/globals.css`
- State management: React context to share form data across 4 steps
- API routes are built by Dev 2 — use fetch() to call them, handle loading/error states
- Prompts and PDF template are built by Dev 3 — no dependency on that work
- Step navigation: linear flow, each step as its own page route

## Development Approach

- Complete each task fully before moving to the next
- Run `npm run build` after each task to verify TypeScript compiles without errors
- Use Tailwind for all styling — no custom CSS except `globals.css`
- Use react-hook-form for all form state
- API routes may not exist yet — mock responses where needed during development

## Progress Tracking

- Mark completed items with `[x]` immediately when done
- Add newly discovered tasks with ➕ prefix
- Document blockers with ⚠️ prefix

## Implementation Steps

### Task 1: App layout and step navigation

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/globals.css` (update with base styles)
- Create: `lib/store.tsx` (React context for shared form state)

Steps:
- [ ] Set up global font (Inter or similar clean sans-serif via next/font)
- [ ] Add base Tailwind styles: neutral background, clean typography
- [ ] Create `PatternFormContext` in `lib/store.tsx` with fields: `itemType`, `styleConfig`, `yarnConfig`, `email`
- [ ] Export `usePatternForm()` hook for consuming context in pages
- [ ] Wrap `app/layout.tsx` with the context provider
- [ ] Run `npm run build` — no TypeScript errors

### Task 2: Step 1 — Item type picker

**Files:**
- Modify: `app/page.tsx`
- Create: `components/ItemPicker/ItemPicker.tsx`
- Create: `components/ItemPicker/index.ts`

Steps:
- [ ] Build `ItemPicker` component with two sections: **Tops** and **Accessories**
- [ ] Tops: sweater, slipover, t-shirt (clickable cards with icon/label)
- [ ] Accessories: beanie, gloves, scarf, minnens, hood (clickable cards)
- [ ] Bottoms section: visible but grayed out with "Coming soon" badge
- [ ] On item select: save to context, navigate to `/configure`
- [ ] `app/page.tsx`: render `ItemPicker` with page heading
- [ ] Run `npm run build`

### Task 3: Step 2 — Config forms for all item types

**Files:**
- Create: `components/ConfigForms/ConfigForm.tsx`
- Create: `components/ConfigForms/fields.ts` (field definitions per item type)
- Create: `components/ConfigForms/index.ts`
- Create: `app/configure/page.tsx`

Steps:
- [ ] Create `fields.ts` with field definitions for all 8 item types. Each field has: `name`, `label`, `options[]`. Fields per type:
  - Sweater: construction, neckline, sleeve length, fit, hem
  - Slipover: construction, neckline, fit, hem
  - T-shirt: neckline, fit, hem
  - Beanie: brim, crown shape
  - Gloves: coverage, cuff
  - Scarf: width, length, stitch pattern
  - Minnens: cuff style, thumb type
  - Hood: type, closure
- [ ] Build `ConfigForm` using react-hook-form — renders the correct field set based on `itemType` from context
- [ ] Each field renders as a group of toggle buttons (not a dropdown)
- [ ] On submit: save to context, navigate to `/yarn`
- [ ] `app/configure/page.tsx`: render path selector (photo / manual) + show `ConfigForm` for manual path
- [ ] Redirect to `/` if no `itemType` in context
- [ ] Run `npm run build`

### Task 4: Step 2 — Photo upload path

**Files:**
- Create: `components/ConfigForms/PhotoUpload.tsx`
- Modify: `app/configure/page.tsx`

Steps:
- [ ] Build `PhotoUpload` component: drag-and-drop area + click to browse, shows image preview after selection
- [ ] On upload: POST image to `/api/analyze-photo`, show loading spinner
- [ ] On response: pre-fill `ConfigForm` with returned style fields
- [ ] Show Ravelry placeholder area (static UI, not wired up): card with "Similar patterns on Ravelry" heading and placeholder image grid
- [ ] Layout: photo upload + Ravelry placeholder on left, pre-filled config form on right (or stacked on mobile)
- [ ] Handle error state (API unavailable, bad image)
- [ ] Run `npm run build`

### Task 5: Step 3 — Yarn selection

**Files:**
- Create: `components/YarnSearch/YarnSearch.tsx`
- Create: `components/YarnSearch/index.ts`
- Create: `app/yarn/page.tsx`

Steps:
- [ ] Build `YarnSearch` component with a search input
- [ ] On input change (debounced 300ms): GET `/api/search-yarn?q=...`, show results dropdown
- [ ] Each result shows: yarn name, brand, weight — clicking auto-fills the manual fields below
- [ ] Manual entry section: weight (lace/fingering/DK/worsted/bulky), gauge (stitches per 10cm), needle size (mm)
- [ ] react-hook-form for manual fields with validation (gauge and needle size must be numbers)
- [ ] On submit: save yarn config to context, navigate to `/generate`
- [ ] Redirect to `/configure` if no `styleConfig` in context
- [ ] Run `npm run build`

### Task 6: Step 4 — Generate and preview

**Files:**
- Create: `components/PatternPreview/PatternPreview.tsx`
- Create: `components/PatternPreview/index.ts`
- Create: `app/generate/page.tsx`

Steps:
- [ ] `app/generate/page.tsx`: email input field + "Generate pattern" button
- [ ] On submit: POST to `/api/generate-pattern` with full config from context, show loading state ("Generating your pattern...")
- [ ] On response: render `PatternPreview` with the returned pattern HTML/text
- [ ] `PatternPreview`: display pattern sections clearly — header, materials, gauge, abbreviations, notes, instructions
- [ ] Add "Print / Save as PDF" button that calls `window.print()`
- [ ] Add print CSS in `globals.css`: hide nav/buttons, clean single-column layout for print
- [ ] "Start over" button that clears context and navigates to `/`
- [ ] Redirect to `/yarn` if no yarn config in context
- [ ] Run `npm run build`

### Task 7: Polish and mobile responsiveness

**Files:**
- Modify: various component files

Steps:
- [ ] Verify all pages are responsive on mobile (375px) and desktop (1280px)
- [ ] Add step indicator (1 → 2 → 3 → 4) at top of all pages except `/`
- [ ] Add back navigation on steps 2, 3, 4
- [ ] Consistent button styles: primary (dark fill), secondary (outline), disabled state
- [ ] Loading states on all API calls
- [ ] Empty/error states on yarn search and photo upload
- [ ] Run `npm run build` — clean final build

## Post-Completion

- Test full flow manually: pick item → configure → yarn → generate
- Verify print layout looks correct in browser
- Test photo upload with a real knitting photo
