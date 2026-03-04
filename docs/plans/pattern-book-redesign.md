# Plan: Pattern Book Redesign

## Overview

Full redesign to a **Pattern Book** aesthetic — ecru background, charcoal text, sage green accent. Looks and feels like a real printed knitting pattern booklet (Ravelry schematic style). Key additions:

- SVG schematic icons per item in the picker
- Live SVG mockup on the config page that updates as options are chosen
- Size field added to all item types
- Email gate removed from generate page — pattern renders as HTML directly

### Design Tokens
- Background: `#FAF7F2` (ecru)
- Text: `#1A1814` (warm charcoal)
- Accent: `#6B7C6E` (sage green)
- Muted: `#7A7068`
- Border: `#DDD8CF`
- Card: `#FFFFFF`
- Fonts: Cormorant Garamond (headings h1/h2, `font-serif`), Source Serif 4 (body reading text), Inter (UI labels, buttons, captions)

### Layout Principles
- Homepage header: thin top rule, "MALINA" left-aligned small caps, "Pattern Generator" right-aligned, another thin rule below
- Item picker: full-width list rows, each row has a small SVG schematic (~48px) on the left, item name, arrow right
- Config page: sticky two-column — form left (~55%), live schematic mockup right (~45%)
- No rounded corners anywhere except `rounded-full` on spinners
- Buttons: flat, no rounding, uppercase tracking
- Inputs: bottom-border only (underline style)

## Validation Commands

- `cd "/Users/dasha/Documents/t1a/vibecoding projects/hackathon-malina-knitting/git_repo" && npm run build`

### Task 1: Update design system — globals.css and layout.tsx

**globals.css** — replace entire file content:
- `:root` vars: `--background: #FAF7F2`, `--foreground: #1A1814`, `--muted: #7A7068`, `--border: #DDD8CF`, `--accent: #6B7C6E`, `--card: #FFFFFF`
- `@theme inline`: register `--color-background`, `--color-foreground`, `--font-sans` (Inter), `--font-serif` (Cormorant Garamond via `--font-cormorant`), `--font-body` (Source Serif 4 via `--font-source-serif`)
- `body`: `background: var(--background); color: var(--foreground); font-family: var(--font-sans);`
- Keep all existing PatternPreview CSS classes, update colors to use new vars
- Add `.pattern-start-over-button` style (flat button, border border-[--border], uppercase tracking)

**layout.tsx** — add Source Serif 4:
```tsx
import { Inter, Cormorant_Garamond, Source_Serif_4 } from "next/font/google";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
});
```
Add `sourceSerif.variable` to the body className.

- [x] Update globals.css with new design tokens and @theme inline
- [x] Add Source Serif 4 font to layout.tsx

### Task 2: Create SVG item schematic icons

Create `components/ItemIcons/index.ts` and `components/ItemIcons/ItemIcons.tsx`.

Each icon is a simple technical line-drawing SVG (viewBox="0 0 60 70", stroke="#1A1814", fill="none", strokeWidth="1.2"). These are schematic silhouettes, not artistic illustrations — clean technical lines like Ravelry pattern schematics.

Export one React component per item that returns an SVG:

**`SweaterIcon`**: Classic sweater silhouette. Body rectangle (x=10,y=20 w=40 h=40), two sleeves extending diagonally from shoulders (long rectangles at angles), crew neck opening at top center. Use straight lines with slight shoulder shaping. Example paths:
- Body: `M 10 20 L 10 60 L 50 60 L 50 20`
- Left shoulder + sleeve: `M 10 20 L 5 15 L 0 15 L 0 35 L 10 32`
- Right shoulder + sleeve: `M 50 20 L 55 15 L 60 15 L 60 35 L 50 32`
- Neck: `M 10 20 Q 30 15 50 20` with a small `M 22 20 Q 30 14 38 20` inner opening

**`SlipoverIcon`**: Same as sweater but no sleeves — just the body with shoulder straps (~8px wide at top). Scoop neck.

**`TshirtIcon`**: Sweater shape but sleeves are short (end at x=±5 from body at roughly y=30).

**`BeanieIcon`**: Simple rounded hat. Oval base (the brim/ribbing as a rounded rectangle), dome shape above it. `M 5 45 Q 5 10 30 8 Q 55 10 55 45 Z` for dome, `M 5 45 L 55 45 L 55 55 L 5 55 Z` for brim.

**`GlovesIcon`**: Simplified glove shape — rectangular wrist, then four finger outlines at top with a thumb extending to the side.

**`ScarfIcon`**: Long narrow rectangle with slight fold/drape at one end. viewBox="0 0 60 70". A thin elongated shape.

**`MittensIcon`**: Rounded mitten body with a thumb bump on the side. `M 15 60 L 15 20 Q 15 10 30 10 Q 45 10 45 20 L 45 60 Z` for body, small `M 45 35 Q 58 35 58 28 Q 58 20 50 20 L 45 24` for thumb.

**`HoodIcon`**: A hood shape viewed from the front — triangular/rounded top that drapes to sides, open face in the middle.

All icons: `width={48} height={56}` default props, accept optional `className` prop.

- [x] Create `components/ItemIcons/ItemIcons.tsx` with all 8 icon components
- [x] Create `components/ItemIcons/index.ts` barrel export

### Task 3: Redesign homepage and ItemPicker

**`app/page.tsx`**:
```tsx
<main className="mx-auto min-h-screen max-w-xl px-8 py-16">
  {/* Header */}
  <header className="mb-12">
    <div className="flex items-baseline justify-between border-b border-t border-[#DDD8CF] py-3">
      <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#1A1814]">Malina</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068]">Pattern Generator</span>
    </div>
  </header>
  <h1 className="font-serif mb-10 text-4xl font-light leading-snug text-[#1A1814]">
    Select a pattern
  </h1>
  <ItemPicker />
</main>
```

**`components/ItemPicker/ItemPicker.tsx`**:
- Import the 8 icon components
- Each item row: `flex items-center gap-5 py-4 border-b border-[#DDD8CF] hover:bg-[#F3EEE5] transition-colors cursor-pointer`
- Left: icon component at width=40 height=48, `text-[#1A1814] opacity-80`
- Middle: item label `text-base text-[#1A1814] tracking-wide`
- Right: `›` arrow `text-[#7A7068] ml-auto`
- Section labels (TOPS, ACCESSORIES, BOTTOMS): `text-[10px] font-medium uppercase tracking-[0.22em] text-[#7A7068] mt-8 mb-2`
- Coming-soon items: same row layout but `opacity-40 cursor-not-allowed`, label + "Coming soon" badge `text-[9px] uppercase tracking-[0.15em] text-[#7A7068]`
- No outer card/box — just the list directly

- [x] Update `app/page.tsx` with pattern book header and serif h1
- [x] Update `components/ItemPicker/ItemPicker.tsx` with icon rows and new section labels

### Task 4: Add size field to all item types

Update `components/ConfigForms/fields.ts`:

Add a `size` field as the **first** field for every item type:
- For garments (sweater, slipover, t-shirt): `{ name: "size", label: "Size", options: ["XS", "S", "M", "L", "XL", "2XL"] }`
- For accessories (beanie, gloves, mittens, hood): `{ name: "size", label: "Size", options: ["S/M", "M/L", "L/XL"] }`
- For scarf: `{ name: "size", label: "Length", options: ["150 cm", "180 cm", "210 cm", "250 cm"] }`

- [x] Add size field as first field to all 8 item types in `fields.ts`

### Task 5: Create GarmentMockup SVG component

Create `components/GarmentMockup/GarmentMockup.tsx` and `components/GarmentMockup/index.ts`.

This component renders a large (~280×340px) SVG schematic of the garment that updates based on `styleConfig` selections. It is used on the `/configure` page right column.

Props: `itemType: ItemType`, `styleConfig: StyleConfig`

The SVG uses `viewBox="0 0 200 240"`, stroke color `#1A1814`, fill `none`, strokeWidth `1`.

**Sweater mockup** — base shape with parametric elements:

Base body: `M 40 80 L 40 200 L 160 200 L 160 80` (torso)

Fit variation (affects body width via transform or different path):
- Oversized: body spans x=30..170
- Relaxed: x=38..162
- Classic: x=43..157
- Fitted: x=48..152

Neckline (top of body at y~80, center x=100):
- Crew neck: small rounded arc `M 70 80 Q 100 72 130 80`
- V-neck: two lines meeting at a point `M 70 80 L 100 100 L 130 80`
- Turtleneck: rectangle above neck `M 75 80 L 75 60 L 125 60 L 125 80` with top `M 75 60 Q 100 55 125 60`
- Boat neck: wide shallow arc `M 55 80 Q 100 75 145 80`

Sleeve length (sleeves attach at shoulders x=40 and x=160, y=80):
- Long: sleeves extend to y=185 (wrist), width ~24px tapering to 18px
- 3/4: sleeves extend to y=150
- Short: sleeves extend to y=110, width ~28px
- Sleeveless: no sleeve paths, just shoulder cap arcs

Left sleeve long: `M 40 80 L 18 90 L 14 185 L 34 185 L 36 90 L 40 80` (roughly)
Left sleeve 3/4: `M 40 80 L 18 90 L 16 150 L 36 150 L 36 90 L 40 80`
Left sleeve short: `M 40 80 L 16 88 L 18 110 L 38 108 L 40 80`

Mirror for right sleeve.

Hem treatment (at y=200):
- Ribbed: add horizontal lines `M 40 200 L 160 200`, then `M 40 205 L 160 205`, `M 40 210 L 160 210` (3 close lines suggesting ribbing)
- Rolled: single curved line `M 40 200 Q 100 208 160 200`
- Straight: just the baseline `M 40 200 L 160 200`
- Curved: `M 40 200 Q 100 210 160 200`

**Slipover mockup** — same as sweater but sleeveless + straps instead:
Shoulder straps: two narrow vertical sections at top, width ~15px each side.

**T-shirt mockup** — sweater with short sleeves only.

**Beanie mockup** — dome + brim, crown shape varies:
- Classic: smooth dome `M 40 160 Q 40 60 100 55 Q 160 60 160 160`
- Slouchy: taller, wider dome `M 35 160 Q 30 40 100 38 Q 170 40 165 160`
- Pointy: pointed top `M 40 160 L 100 45 L 160 160`
- Flat: shallow dome
Brim: `M 38 160 L 162 160 L 162 180 L 38 180 Z` with horizontal ribbing lines

**Scarf mockup** — long rectangle, width varies with `width` option, add some fold at bottom.

**Gloves / Mittens / Hood** — simplified static schematics, not parametric (just show basic shape).

For item types without detailed parametric options, show a centered static schematic.

Export default `GarmentMockup` component. When `styleConfig` is empty (no selections yet), show the base shape with a subtle dashed outline.

- [x] Create `components/GarmentMockup/GarmentMockup.tsx` with all schematic logic
- [x] Create `components/GarmentMockup/index.ts` barrel export

### Task 6: Redesign Configure page with live mockup

Update `app/configure/page.tsx`:

**Remove** the manual/photo path selection step entirely. Instead, show both options together:
- The page goes straight to the config form
- Photo upload is a collapsible secondary option ("Upload a photo to pre-fill" toggle)

Layout:
```tsx
<main className="mx-auto min-h-screen max-w-5xl px-8 py-16">
  {/* Header same as homepage */}
  <header className="mb-10">
    <div className="flex items-baseline justify-between border-b border-t border-[#DDD8CF] py-3">
      <span className="text-xs font-medium uppercase tracking-[0.25em]">Malina</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068]">Pattern Generator</span>
    </div>
  </header>

  <StepIndicator current={2} />

  <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_420px]">
    {/* Left: form */}
    <div>
      <h1 className="font-serif text-4xl font-light mb-2">{itemLabel}</h1>
      <p className="text-sm text-[#7A7068] mb-8">Configure your pattern options.</p>

      {/* Photo upload toggle */}
      <details className="mb-8 border border-[#DDD8CF] p-4">
        <summary className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068] cursor-pointer">
          Upload a photo to pre-fill options
        </summary>
        <div className="mt-4">
          <PhotoUpload onAnalysisComplete={setPhotoDefaults} onReset={() => setPhotoDefaults(undefined)} />
        </div>
      </details>

      <ConfigForm key={JSON.stringify(photoDefaults)} defaultValues={photoDefaults} />
    </div>

    {/* Right: live mockup — sticky */}
    <div className="hidden lg:block">
      <div className="sticky top-16">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068] mb-4">Preview</p>
        <GarmentMockup itemType={itemType} styleConfig={currentValues} />
      </div>
    </div>
  </div>
</main>
```

The `GarmentMockup` needs the current live form values. Since `ConfigForm` manages its own form state, the configure page needs to lift the current values up. Modify `ConfigForm` to accept an optional `onValuesChange: (values: StyleConfig) => void` prop, and call it with `watch()` values via a `useEffect`. The configure page stores these in a `useState<StyleConfig>` and passes them to `GarmentMockup`.

Update `PhotoUpload.tsx`:
- Remove emoji (📷), replace drop zone content with clean text: "Drop image or click" and "JPEG · PNG · max 10 MB" (small caps)
- Remove `rounded-xl` from drop zone → no border radius
- Done badge: replace `rounded-full bg-green-100` with flat `bg-[#6B7C6E] text-white px-2 py-0.5 text-[10px] uppercase tracking-[0.08em]`
- Error: `border-l-2 border-red-400 pl-3 text-sm text-red-600`

Update `ConfigForm.tsx`:
- Add `onValuesChange?: (values: StyleConfig) => void` prop
- `useEffect(() => { onValuesChange?.(values); }, [values, onValuesChange])`
- Toggle buttons: no rounding, `border border-[#DDD8CF] px-4 py-2 text-sm` unselected, `border border-[#1A1814] bg-[#1A1814] text-white px-4 py-2 text-sm` selected
- Field label: `text-[10px] font-medium uppercase tracking-[0.18em] text-[#7A7068] mb-2`
- Submit button: `w-full bg-[#1A1814] text-white px-8 py-3.5 text-xs font-medium uppercase tracking-[0.1em] transition-opacity hover:opacity-70 mt-6`

Update `StepIndicator.tsx` to pattern-book style:
- No circles. Plain text: `01 · Item  02 · Configure  03 · Yarn  04 · Generate`
- Done: linked, `text-[10px] uppercase tracking-[0.15em] text-[#7A7068] hover:text-[#1A1814]`
- Active: `text-[10px] uppercase tracking-[0.15em] text-[#1A1814] font-semibold`
- Future: `text-[10px] uppercase tracking-[0.15em] text-[#DDD8CF]`
- Separator: `mx-3 text-[#DDD8CF]` with `·` character

- [x] Redesign `app/configure/page.tsx` with two-column layout and photo upload in `<details>`
- [x] Add `onValuesChange` prop to `ConfigForm.tsx` and update toggle/submit styles
- [x] Update `PhotoUpload.tsx` to remove emoji and clean up styles
- [x] Update `StepIndicator.tsx` to text-only pattern-book style

### Task 7: Remove email gate, render pattern as HTML

Update `app/generate/page.tsx`:
- Remove the email `<form>` entirely
- Remove `useForm`, `register`, `handleSubmit`, `errors` for email
- Remove `setEmail` call
- Replace with a single generate button that calls the API directly on click
- `onGenerate` is now a regular async function (not form submit handler)
- Pattern state and error state remain the same

New page structure (pre-pattern):
```tsx
<main className="mx-auto min-h-screen max-w-xl px-8 py-16">
  {/* Same header as other pages */}
  <header className="mb-10">
    <div className="flex items-baseline justify-between border-b border-t border-[#DDD8CF] py-3">
      <span className="text-xs font-medium uppercase tracking-[0.25em]">Malina</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068]">Pattern Generator</span>
    </div>
  </header>

  <StepIndicator current={4} />

  <Link href="/yarn" className="text-[10px] uppercase tracking-[0.12em] text-[#7A7068] hover:text-[#1A1814] transition-colors mb-8 inline-block">← Back</Link>

  <h1 className="font-serif text-4xl font-light mb-3 text-[#1A1814]">Generate pattern</h1>
  <p className="text-sm text-[#7A7068] mb-10">Your custom knitting pattern, ready to print.</p>

  {error && (
    <div className="border-l-2 border-red-400 pl-3 py-2 text-sm text-red-600 mb-6">{error}</div>
  )}

  <button
    onClick={onGenerate}
    disabled={loading}
    className="w-full bg-[#1A1814] text-white px-8 py-3.5 text-xs font-medium uppercase tracking-[0.1em] transition-opacity hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
  >
    {loading ? "Generating…" : "Generate pattern"}
  </button>
</main>
```

`onGenerate` function:
```tsx
async function onGenerate() {
  setError(null);
  setLoading(true);
  try {
    const res = await fetch("/api/generate-pattern", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType, styleConfig, yarnConfig }),
    });
    if (!res.ok) throw new Error("Pattern generation failed. Please try again.");
    const result = await res.json();
    if (typeof result.pattern === "string") {
      setPattern(result.pattern);
    } else {
      throw new Error("Unexpected response format.");
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong.");
  } finally {
    setLoading(false);
  }
}
```

Pattern display (when pattern is set): same `<PatternPreview>` but wrapped in the same page header layout. Remove `StepIndicator` when pattern is showing.

- [ ] Remove email form from `app/generate/page.tsx`
- [ ] Replace with direct generate button and `onGenerate` function

### Task 8: Redesign Yarn page and YarnSearch

Update `app/yarn/page.tsx`:
- Same page header (MALINA / Pattern Generator rule)
- `<h1 className="font-serif text-4xl font-light mb-2 text-[#1A1814]">Your yarn</h1>`
- Back link: `text-[10px] uppercase tracking-[0.12em] text-[#7A7068] hover:text-[#1A1814]`

Update `components/YarnSearch/YarnSearch.tsx`:
- Yarn search input: underline style `border-b border-[#DDD8CF] bg-transparent px-0 py-2.5 text-sm text-[#1A1814] placeholder-[#C8C2B8] outline-none focus:border-[#1A1814] w-full`
- Search label: `text-[10px] font-medium uppercase tracking-[0.18em] text-[#7A7068] mb-2`
- Dropdown: `border border-[#DDD8CF] bg-white shadow-sm` no rounding
- Manual section: remove `rounded-2xl bg-stone-50`, use `border-t border-[#DDD8CF] pt-8 mt-4`
- "Yarn details" label: `text-[10px] font-medium uppercase tracking-[0.22em] text-[#7A7068] mb-6`
- Weight toggle buttons: same pattern as ConfigForm (no rounding, border-based)
- Gauge/needle inputs: same underline style
- Field labels: `text-[10px] font-medium uppercase tracking-[0.18em] text-[#7A7068] mb-2`
- Submit button: same primary button style as other pages
- Errors: `text-[11px] text-red-500 mt-1`

- [ ] Update `app/yarn/page.tsx` header and typography
- [ ] Update `components/YarnSearch/YarnSearch.tsx` input and layout styles
