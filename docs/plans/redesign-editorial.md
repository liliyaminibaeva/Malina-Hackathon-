# Plan: Editorial Scandinavian Luxury Redesign

## Overview

Redesign all UI components to achieve an Editorial Scandinavian luxury aesthetic — PetiteKnit meets high-end fashion magazine. The foundation is already laid:

- `app/layout.tsx` — Cormorant Garamond serif font added (--font-cormorant CSS variable)
- `app/globals.css` — Warm cream background (#F8F4EE), `font-serif` registered in @theme inline, new PatternPreview styles

Design principles to apply everywhere:
- **Typography**: Use `font-serif` (Cormorant Garamond) for all h1/h2 headings, `font-light` weight. Keep Inter for labels, body, buttons.
- **Corners**: Remove all `rounded-xl`, `rounded-2xl`, `rounded-lg` from non-input elements. Use `rounded-none` (implicit) or at most `rounded-sm`. Toggle buttons: no rounding.
- **Buttons (primary)**: `bg-stone-900 text-white px-8 py-3.5 text-xs uppercase tracking-[0.1em] font-medium transition-opacity hover:opacity-70 w-full` — no rounded corners.
- **Buttons (back/ghost)**: `text-xs uppercase tracking-[0.12em] text-stone-400 hover:text-stone-900 transition-colors`
- **Toggle buttons (selected)**: `border border-stone-900 bg-stone-900 text-white px-4 py-2 text-sm transition-all`
- **Toggle buttons (unselected)**: `border border-stone-200 bg-white text-stone-800 px-4 py-2 text-sm hover:border-stone-600 transition-all`
- **Inputs**: `w-full border-b border-stone-200 bg-transparent px-0 py-2.5 text-sm text-stone-900 placeholder-stone-300 outline-none transition-colors focus:border-stone-700` — underline style, no box.
- **Section labels (eyebrow)**: `text-[10px] font-medium uppercase tracking-[0.22em] text-stone-400`
- **No emojis anywhere** — replace with clean text or Unicode symbols (✓ is fine).
- **Whitespace**: generous padding (py-20 to py-24 on main pages), mb-16 to mb-20 for hero sections.
- **Cards/panels**: Replace `rounded-xl border border-stone-200 bg-white p-6 shadow-sm` with flat `border border-stone-200 bg-white p-7` (no shadow, no rounding).

## Validation Commands

- `cd "/Users/dasha/Documents/t1a/vibecoding projects/hackathon-malina-knitting/git_repo" && npm run build`

### Task 1: Redesign homepage (app/page.tsx)

Update `app/page.tsx`:

- [ ] Increase top padding: `py-20` → `py-24` on the main element
- [ ] Brand eyebrow "Malina": `text-[10px] font-medium uppercase tracking-[0.25em] text-stone-400 mb-6`
- [ ] H1: add `font-serif` class, change to `text-5xl font-light leading-[1.1] tracking-tight text-stone-900`, keep mb-4. Full text: "What would you\nlike to knit?" — split with `<br />` tag.
- [ ] Subtitle: `text-sm text-stone-400 leading-relaxed`
- [ ] Increase mb on the header div: `mb-16` → `mb-20`

### Task 2: Redesign ItemPicker component

Update `components/ItemPicker/ItemPicker.tsx`:

- [ ] Section label (the `<p>` with title): `text-[10px] font-medium uppercase tracking-[0.22em] text-stone-400 mb-4`
- [ ] The section wrapper div for items: keep `divide-y divide-stone-100 border-t border-stone-100` but change to `divide-stone-100 border-t border-stone-100` — same is fine
- [ ] Active item buttons: `flex w-full items-center justify-between py-4 text-left text-base text-stone-900 transition-colors hover:text-stone-400 group`
- [ ] Arrow span on active items: `text-stone-300 text-sm transition-colors group-hover:text-stone-400`
- [ ] Coming soon items div: `flex w-full items-center justify-between py-4 text-base text-stone-300`
- [ ] "Soon" span: `text-[9px] uppercase tracking-[0.18em] text-stone-300`
- [ ] Space between sections: `space-y-12` instead of `space-y-10`

### Task 3: Redesign StepIndicator component

Completely rewrite `components/StepIndicator/StepIndicator.tsx` for an editorial text-only indicator:

- [ ] Remove all circle/rounded elements
- [ ] Layout: horizontal flex row, items separated by `·` character (a small muted dot)
- [ ] Each step: step number formatted as `0{n}` (padStart), then step label (hidden on mobile with `hidden sm:inline`)
- [ ] Done steps: `text-[10px] uppercase tracking-[0.15em] text-stone-400 hover:text-stone-700 transition-colors` — wrap in Link with href
- [ ] Active step: `text-[10px] uppercase tracking-[0.15em] text-stone-900 font-semibold` — not a link, has `aria-current="step"` on the outer span
- [ ] Future steps: `text-[10px] uppercase tracking-[0.15em] text-stone-300`
- [ ] Separator between steps: `<span className="mx-3 text-stone-200 text-[10px]" aria-hidden="true">·</span>` — no connector after last item
- [ ] Outer nav: `no-print mb-12` (increase from mb-8)
- [ ] Step number and label in same `<span>` with `gap-1.5 flex items-baseline`

Example final output should look like: `01 Item  ·  02 Configure  ·  03 Yarn  ·  04 Generate`

### Task 4: Redesign Configure page

Update `app/configure/page.tsx`:

- [ ] H1: add `font-serif font-light` classes, change size to `text-4xl`, keep `tracking-tight text-stone-900`
- [ ] Subtitle p: `text-sm text-stone-400 leading-relaxed`
- [ ] Back link: `text-[10px] uppercase tracking-[0.12em] text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2`
- [ ] Path selection card grid: `grid grid-cols-1 gap-3 sm:grid-cols-2`
- [ ] Path selection buttons: replace `rounded-xl border border-stone-200 bg-white p-6 text-center ... active:scale-95` with `group border border-stone-200 bg-white p-7 text-left transition-colors hover:border-stone-500` — flat, no rounding, left-aligned text, no emoji
- [ ] Inside each path button, replace emoji+label structure with:
  - Eyebrow label (p): `text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400 mb-2` — "Configure manually" for manual, "AI analysis" for photo
  - Title (p): `font-serif text-xl font-light text-stone-900 mb-2` — "Style options" for manual, "Upload a photo" for photo
  - Description (p): `text-sm text-stone-400 leading-relaxed` — "Choose your style preferences from curated options." for manual, "Claude analyses your inspiration image and pre-fills the form." for photo
  - Select arrow (p): `mt-5 text-[11px] text-stone-400 transition-colors group-hover:text-stone-700 tracking-wide` with text `Select →`
- [ ] The "back" button shown when selectedPath is set: same ghost style as above, no `←` HTML entity but use `← ` literal or keep `← Back` text
- [ ] The `<span>` showing current path name: `text-[10px] uppercase tracking-[0.12em] text-stone-400`
- [ ] Remove emoji from RavelryPlaceholder: replace `🧶` emoji span with nothing, change title to plain "Similar patterns on Ravelry", remove `rounded-xl shadow-sm`, add `border border-stone-200 p-6`
- [ ] The pattern grid inside RavelryPlaceholder: the colored boxes have `bg-stone-200`/`bg-stone-300` — change to `bg-stone-100`/`bg-stone-150` or keep stone-100/stone-200. Remove `rounded-lg` from boxes.
- [ ] "Ravelry integration coming soon" italic text: `text-xs text-stone-300 mt-3`
- [ ] "Style options detected from photo" p: `text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-4 font-medium`

### Task 5: Redesign ConfigForm toggle buttons

Update `components/ConfigForms/ConfigForm.tsx`:

- [ ] ToggleGroup label p: `text-[10px] font-medium uppercase tracking-[0.15em] text-stone-500`
- [ ] Toggle buttons wrapper: `flex flex-wrap gap-2 mt-2`
- [ ] Selected toggle button classes: `border border-stone-900 bg-stone-900 text-white px-4 py-2 text-sm transition-all` — no rounding
- [ ] Unselected toggle button classes: `border border-stone-200 bg-white text-stone-800 px-4 py-2 text-sm hover:border-stone-600 transition-all` — no rounding
- [ ] Submit button: `mt-6 w-full bg-stone-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30` — no `rounded-xl`

### Task 6: Redesign PhotoUpload component

Update `components/ConfigForms/PhotoUpload.tsx`:

- [ ] Drop zone div: replace `rounded-xl border-2 border-dashed` with `border border-dashed` — remove rounded corners. Change hover state: `border-stone-300 bg-stone-50 hover:border-stone-500`
- [ ] Remove the `📷` camera emoji span entirely
- [ ] Replace emoji area with a clean text block:
  ```tsx
  <div className="space-y-1 text-center">
    <p className="text-sm text-stone-600">Drop image or click to browse</p>
    <p className="text-xs text-stone-400">JPEG, PNG — max 10 MB</p>
  </div>
  ```
- [ ] Loading overlay: keep same but update spinner styling — remove `rounded-full` from the spinner circle... actually keep the spinner as-is (the small spinning circle is fine functionally). Remove `rounded-xl` from the overlay div if present.
- [ ] "Analysed" badge: `absolute right-3 top-3 bg-stone-900 text-white px-2.5 py-1 text-[10px] uppercase tracking-[0.1em]` — remove `rounded-full`, make it sharp
- [ ] "Replace photo" button: `text-[11px] uppercase tracking-[0.12em] text-stone-400 hover:text-stone-900 transition-colors`
- [ ] Error paragraph: remove `rounded-lg`, use `border-l-2 border-red-400 pl-3 py-1 text-sm text-red-600 bg-transparent`

### Task 7: Redesign Yarn page and YarnSearch component

Update `app/yarn/page.tsx`:
- [ ] H1: `font-serif text-4xl font-light text-stone-900 mb-2 tracking-tight`
- [ ] Subtitle p: `text-sm text-stone-400 leading-relaxed mb-10`
- [ ] Back link: `text-[10px] uppercase tracking-[0.12em] text-stone-400 hover:text-stone-900 transition-colors`

Update `components/YarnSearch/YarnSearch.tsx`:
- [ ] Yarn search input: replace `rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm ... focus:ring-2 focus:ring-stone-200` with underline style: `w-full border-b border-stone-200 bg-transparent px-0 py-2.5 text-sm text-stone-900 placeholder-stone-300 outline-none transition-colors focus:border-stone-700`
- [ ] Search label: `text-[10px] font-medium uppercase tracking-[0.15em] text-stone-500 mb-2`
- [ ] Dropdown list: `absolute z-10 mt-1 w-full border border-stone-200 bg-white shadow-sm` — remove `rounded-xl`
- [ ] Dropdown list items button: `flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-stone-50`
- [ ] "No yarns found" div: remove `rounded-xl`, use `absolute z-10 mt-1 w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-400`
- [ ] Search error: remove `rounded-lg bg-amber-50`, use `border-l-2 border-amber-400 pl-3 py-1 text-sm text-amber-600`
- [ ] Manual entry section: remove `rounded-2xl border border-stone-100 bg-stone-50 p-5`, replace with `border-t border-stone-100 pt-7 mt-2` (just a top separator)
- [ ] "Yarn details" section label p: `text-[10px] font-medium uppercase tracking-[0.22em] text-stone-400 mb-6`
- [ ] Weight toggle buttons: same as ConfigForm — no rounding, same border/bg pattern
- [ ] Gauge and needle size inputs: underline style same as yarn search input
- [ ] Gauge label: `text-[10px] font-medium uppercase tracking-[0.15em] text-stone-500`
- [ ] Needle size label: `text-[10px] font-medium uppercase tracking-[0.15em] text-stone-500`
- [ ] Weight error, gauge errors, needle error: `text-[11px] text-red-500 mt-1`
- [ ] Submit button: `w-full bg-stone-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-70` — no `rounded-xl`

### Task 8: Redesign Generate page

Update `app/generate/page.tsx`:

- [ ] H1 (generate form): `font-serif text-4xl font-light text-stone-900 mb-2 tracking-tight`
- [ ] H1 (pattern ready): same serif treatment
- [ ] Subtitle paragraphs: `text-sm text-stone-400 leading-relaxed mb-10`
- [ ] Back link: `text-[10px] uppercase tracking-[0.12em] text-stone-400 hover:text-stone-900 transition-colors`
- [ ] Email label: `text-[10px] font-medium uppercase tracking-[0.15em] text-stone-500`
- [ ] Email input: underline style: `w-full border-b border-stone-200 bg-transparent px-0 py-2.5 text-sm text-stone-900 placeholder-stone-300 outline-none transition-colors focus:border-stone-700`
- [ ] Email error: `text-[11px] text-red-500 mt-1`
- [ ] Error alert div: remove `rounded-xl`, use `border-l-2 border-red-400 pl-3 py-2 text-sm text-red-600`
- [ ] Generate button: `w-full bg-stone-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30` — no `rounded-xl`
- [ ] "Your pattern is ready" subtitle: `text-sm text-stone-400 no-print`
