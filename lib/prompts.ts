// Types for Malina prompt configuration

export type StyleConfig = Record<string, string>;

export interface YarnConfig {
  weight: string;
  gaugeStitches: string;
  gaugeRows: string;
  needleSize: string;
  name?: string;
  brand?: string;
}

export type ItemType =
  | "sweater"
  | "slipover"
  | "t-shirt"
  | "beanie"
  | "gloves"
  | "scarf"
  | "mittens"
  | "hood";

// ---------------------------------------------------------------------------
// SYSTEM PROMPT
// ---------------------------------------------------------------------------

export const SYSTEM_PROMPT = `You are a professional knitting pattern writer. Your output must match the quality and precision of published PetiteKnit patterns exactly.

VOICE AND TONE:
Clear, warm, and technical. Use standard knitting terminology throughout. Be precise with every number. No filler phrases. Write as if this will be printed and sold.

SIZE FORMAT (critical — follow exactly):
- Always include all 6 sizes in this order: XS, S, M, L, XL, 2XL
- Write size variants inline with the smallest first: 84 (88) 92 (96) 100 (108) sts
- Groups of two: XS (S) M (L) XL (2XL)
- Every single stitch count, row count, and measurement in the pattern must follow this format
- In the SIZES section write exactly: XS (S) M (L) XL (2XL)

FORMAT RULES:
- Output plain text only — no markdown, no asterisks, no bullet symbols, no # headers
- Section headings: ALL CAPS followed by a colon on its own line, then a blank line, then content
- One blank line between sections
- Instruction rows are labeled "Row N (RS):" or "Row N (WS):" or "Round N:" on their own line, followed by the instruction
- Numbered steps start with the number followed by a period: "1. Cast on..."
- Do not use markdown of any kind

STITCH COUNT CALCULATION (mandatory):
You are given target finished measurements. You MUST derive every stitch count mathematically:
  stitch count = round(measurement_in_cm x gauge_stitches_per_10cm / 10)
Round to the nearest even number for body pieces worked in the round.
Every stitch count must be consistent with the given gauge and measurements.

CONSTRUCTION:
- State the construction method clearly in the NOTES section
- Work seamlessly in the round wherever possible
- Use German Short Row technique for all short rows
- Reference M1R and M1L for increases, k2tog and ssk for decreases

REQUIRED SECTIONS IN ORDER:
1. PATTERN NAME
2. SIZES
3. FINISHED MEASUREMENTS
4. MATERIALS
5. GAUGE
6. ABBREVIATIONS
7. NOTES
8. INSTRUCTIONS

ABBREVIATIONS section must always include:
k: knit
p: purl
k2tog: knit 2 stitches together (right-leaning decrease)
ssk: slip, slip, knit (left-leaning decrease)
M1R: insert left needle from back to front under the bar between stitches, knit through the front loop (right-leaning increase)
M1L: insert left needle from front to back under the bar between stitches, knit through the back loop (left-leaning increase)
pm: place marker
sm: slip marker
RS: right side
WS: wrong side
GSR (German Short Row): turn work, bring yarn to front, slip first stitch purlwise, pull yarn over needle creating a double stitch (DS); on return, work DS as one stitch
CO: cast on
BO: bind off
st(s): stitch(es)
rnd(s): round(s)

MATERIALS section format:
List needle sizes (two lengths), yarn with approximate grams per size in format: X (X) X (X) X (X) g, darning needle, stitch markers.

FINISHED MEASUREMENTS section format:
Bust circumference: X (X) X (X) X (X) cm
Length (back, excl. collar): X (X) X (X) X (X) cm
Sleeve length (underarm to cuff): X (X) X (X) X (X) cm

INSTRUCTIONS section:
Write separate labeled sub-sections for each construction step. Every row or round written out explicitly with stitch counts in size order. Detailed enough for an intermediate knitter to follow without ambiguity.`;

// ---------------------------------------------------------------------------
// PHOTO ANALYSIS PROMPT
// ---------------------------------------------------------------------------

export const PHOTO_ANALYSIS_PROMPT = `Analyze the knitting photo and identify the following attributes. Return a JSON object only — no explanation, no extra text.

Attributes to detect (use exact values listed):

neckline: "Crew neck" | "V-neck" | "Turtleneck" | "Boat neck" | "Scoop neck"
sleeveLength: "Long" | "3/4" | "Short" | "Sleeveless"
fit: "Fitted" | "Classic" | "Relaxed" | "Oversized"
hem: "Ribbed" | "Rolled" | "Straight"

Rules:
- Only include keys you can confidently identify from the photo.
- Each value must match exactly one of the allowed values (including capitalisation).
- If an attribute is unclear or not visible, omit that key entirely.
- Do not add any keys other than the four listed above.
- Do not include any text outside the JSON object.

Example output:
{
  "neckline": "Crew neck",
  "sleeveLength": "Long",
  "fit": "Relaxed",
  "hem": "Ribbed"
}`;

// ---------------------------------------------------------------------------
// SWEATER MEASUREMENTS
// Standard body-to-garment measurement tables for all 6 sizes (in cm).
// ---------------------------------------------------------------------------

const SIZES = ["XS", "S", "M", "L", "XL", "2XL"];

// Body bust circumference (the wearer's body)
const BODY_BUST_CM = [80, 85, 90, 95, 102, 110];

// Positive ease by fit
const EASE_CM: Record<string, number> = {
  Oversized: 28,
  Relaxed: 14,
  Classic: 8,
  Fitted: 4,
};

// Target body length, back, excluding collar (cm)
const BODY_LENGTH_CM = [53, 55, 57, 59, 61, 63];

// Sleeve length underarm to cuff (cm)
const SLEEVE_LENGTH_CM: Record<string, number[]> = {
  Long:       [44, 44, 45, 45, 46, 46],
  "3/4":      [30, 30, 31, 31, 32, 32],
  Short:      [14, 14, 15, 15, 16, 16],
  Sleeveless: [0,  0,  0,  0,  0,  0],
};

// Upper arm circumference (cm)
const UPPER_ARM_CM = [28, 30, 32, 34, 36, 40];

// Wrist/cuff circumference (cm)
const WRIST_CM = [16, 17, 18, 19, 20, 22];

// Neck opening circumference (cm)
const NECK_CM = [32, 33, 34, 35, 37, 39];

// Yoke depth from neck to underarm (cm)
const YOKE_DEPTH_CM = [20, 21, 22, 23, 24, 25];

// Raglan starting sleeve stitches (before increases)
const RAGLAN_START_SLEEVE = [8, 8, 10, 10, 10, 12];

function fmt(values: number[], unit = "cm"): string {
  return `${values[0]} (${values[1]}) ${values[2]} (${values[3]}) ${values[4]} (${values[5]}) ${unit}`;
}

function computeBust(fit: string): number[] {
  const ease = EASE_CM[fit] ?? EASE_CM["Relaxed"];
  return BODY_BUST_CM.map((b) => Math.round((b + ease) / 2) * 2);
}

function sts(cm: number, g: number): number {
  return Math.round((cm * g) / 10 / 2) * 2;
}

function stsFmt(cms: number[], g: number): string {
  const counts = cms.map((cm) => sts(cm, g));
  return `${counts[0]} (${counts[1]}) ${counts[2]} (${counts[3]}) ${counts[4]} (${counts[5]}) sts`;
}

// ---------------------------------------------------------------------------
// CONSTRUCTION NOTES
// ---------------------------------------------------------------------------

const SWEATER_CONSTRUCTION: Record<string, string> = {
  Raglan: `RAGLAN (top-down, seamless):
Cast on neck stitches. Place 4 raglan markers dividing sts into: front, left sleeve, back, right sleeve. On every RS (increase) round: M1R before each raglan marker, M1L after each raglan marker (8 sts increased per round). Work a plain round between each increase round. Continue until yoke depth is reached and total stitch count matches body + sleeve separation counts. At underarm: place sleeve sts on hold, cast on 2-4 underarm sts using backward loop CO, join body in the round. Work body to hem. For sleeves: return held sts to needle, pick up underarm sts, join in the round, work taper decreases to cuff.`,

  "Circular yoke": `CIRCULAR YOKE (top-down, seamless):
Cast on neck stitches. Work collar section (3-5 cm). Then work yoke with evenly distributed increases — place 8 increase markers evenly around, on increase rounds: M1 after each marker (8 sts per increase round). Alternate increase rounds with plain rounds. Increase until yoke depth is reached. Divide body and sleeves: place sleeve sts on hold, CO 2-4 underarm sts, join body in the round. Work sleeves same as raglan.`,

  "Dropped shoulder": `DROPPED SHOULDER:
Cast on total body stitches. Join in the round. Work body from hem upward in stockinette until body reaches target length. No armhole shaping — the body is a straight tube. At the top, divide front and back, work flat and seam or 3-needle BO at shoulders. With RS facing, pick up sleeve stitches along the straight armhole edge at a rate of 2 sts per 3 rows. Join in the round. Work sleeve taper decreases to cuff.`,
};

// ---------------------------------------------------------------------------
// ITEM LABELS
// ---------------------------------------------------------------------------

const ITEM_LABELS: Record<ItemType, string> = {
  sweater: "pullover sweater",
  slipover: "sleeveless slipover",
  "t-shirt": "short-sleeved knitted t-shirt",
  beanie: "beanie hat",
  gloves: "pair of gloves",
  scarf: "scarf",
  mittens: "pair of mittens",
  hood: "hood",
};

// ---------------------------------------------------------------------------
// getPatternPrompt
// ---------------------------------------------------------------------------

// Accessory item types that use S/M, M/L, L/XL sizing
const ACCESSORY_ITEMS: ItemType[] = ["beanie", "gloves", "mittens", "hood"];

export function getPatternPrompt(
  itemType: ItemType,
  styleConfig: StyleConfig,
  yarnConfig: YarnConfig
): string {
  if (itemType === "sweater") {
    return getSweaterPrompt(styleConfig, yarnConfig);
  }

  const itemLabel = ITEM_LABELS[itemType];
  const yarnName = yarnConfig.name
    ? ` — ${yarnConfig.brand ? yarnConfig.brand + " " : ""}${yarnConfig.name}`
    : "";
  // Exclude the size field from style lines — handled separately in the size section
  const styleLines = Object.entries(styleConfig)
    .filter(([k, v]) => v && k !== "size")
    .map(([k, v]) =>
      `${k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim()}: ${v}`
    )
    .join("\n");

  const selectedSize = styleConfig.size || "";

  let sizeInstruction: string;
  if (ACCESSORY_ITEMS.includes(itemType)) {
    const sizeNote = selectedSize ? `\nThe user is knitting size ${selectedSize}.` : "";
    sizeInstruction = `${sizeNote}
Include stitch counts and row counts for 3 sizes: S/M, M/L, and L/XL. Write size variants inline as: S/M (M/L) L/XL. Use this 3-size format throughout — this overrides the system prompt's 6-size garment format, which does not apply to accessories.`;
  } else if (itemType === "scarf") {
    const lengthNote = selectedSize ? `\nThe user wants a ${selectedSize} long scarf.` : "";
    sizeInstruction = `${lengthNote}
Generate the pattern for the specified length. Do not use the garment size grading (XS, S, M, L, XL, 2XL) — this is a scarf sized by length, not body size. Include a brief note on how to adjust stitch counts for a different length.`;
  } else {
    // slipover, t-shirt — standard 6-size XS–2XL format
    const sizeIdx = selectedSize ? SIZES.indexOf(selectedSize) : -1;
    const sizeNote = sizeIdx >= 0
      ? `\nThe user is knitting size ${selectedSize} — the ${["1st", "2nd", "3rd", "4th", "5th", "6th"][sizeIdx]} value in each size set XS (S) M (L) XL (2XL).`
      : "";
    sizeInstruction = `${sizeNote}
Include realistic stitch counts and row counts for all 6 sizes (XS, S, M, L, XL, 2XL). Every measurement, stitch count, and row count must have all 6 size values written inline in parentheses in PetiteKnit format: XS (S) M (L) XL (2XL).`;
  }

  return `Generate a full knitting pattern for a ${itemLabel}.
${sizeInstruction}

Style choices:
${styleLines}

Yarn:
Weight: ${yarnConfig.weight}
Gauge: ${yarnConfig.gaugeStitches} stitches and ${yarnConfig.gaugeRows} rows per 10 cm
Needle size: ${yarnConfig.needleSize} mm${yarnName}

Follow the system prompt format exactly.`.trim();
}

// ---------------------------------------------------------------------------
// SWEATER PATTERN PROMPT — measurement-driven
// ---------------------------------------------------------------------------

function getSweaterPrompt(styleConfig: StyleConfig, yarnConfig: YarnConfig): string {
  const fit = styleConfig.fit || "Relaxed";
  const construction = styleConfig.construction || "Raglan";
  const sleeveLength = styleConfig.sleeveLength || "Long";
  const neckline = styleConfig.neckline || "Crew neck";
  const hem = styleConfig.hem || "Ribbed";
  const cuff = styleConfig.cuff || "Ribbed";
  const selectedSize = styleConfig.size || "M";

  const g = parseFloat(yarnConfig.gaugeStitches) || 20;  // sts per 10cm
  const gr = parseFloat(yarnConfig.gaugeRows) || 28;     // rows per 10cm
  const needleSize = yarnConfig.needleSize;
  const yarnRef = yarnConfig.name
    ? `${yarnConfig.brand ? yarnConfig.brand + " " : ""}${yarnConfig.name} (${yarnConfig.weight} weight)`
    : `${yarnConfig.weight} weight yarn`;

  const bustCm = computeBust(fit);
  const sleeveCm = SLEEVE_LENGTH_CM[sleeveLength] ?? SLEEVE_LENGTH_CM["Long"];

  const bodyStitches = bustCm.map((cm) => sts(cm, g));
  const halfBody = bodyStitches.map((s) => s / 2);
  const upperArmSts = UPPER_ARM_CM.map((cm) => sts(cm, g));
  const wristSts = WRIST_CM.map((cm) => Math.max(sts(cm, g), 8));
  const neckSts = NECK_CM.map((cm) => sts(cm, g));

  const bodyRows = BODY_LENGTH_CM.map((cm) => Math.round((cm * gr) / 10));
  const yokeRows = YOKE_DEPTH_CM.map((cm) => Math.round((cm * gr) / 10));
  const sleeveRows = sleeveCm.map((cm) => Math.round((cm * gr) / 10));

  const sleeveDecRnds = upperArmSts.map((ua, i) => Math.max(Math.floor((ua - wristSts[i]) / 2), 0));
  const sleeveDecEvery = sleeveRows.map((rows, i) => {
    if (sleeveDecRnds[i] === 0 || rows === 0) return 0;
    return Math.floor(rows / (sleeveDecRnds[i] + 1));
  });

  const raglanFrontBack = neckSts.map((ns, i) =>
    Math.max(Math.floor((ns - RAGLAN_START_SLEEVE[i] * 2) / 2), 8)
  );
  const raglanIncRnds = bodyStitches.map((bs, i) => {
    const start = raglanFrontBack[i] * 2 + RAGLAN_START_SLEEVE[i] * 2;
    return Math.ceil((bs - start) / 8);
  });

  // Rough yarn estimate
  const yarnGrams = bustCm.map((bust, i) => {
    const bodyArea = bust * BODY_LENGTH_CM[i];
    const sleeveArea = sleeveLength !== "Sleeveless"
      ? 2 * ((UPPER_ARM_CM[i] + WRIST_CM[i]) / 2) * sleeveCm[i]
      : 0;
    const densityFactor = Math.max(0.5, (g / 10) * 0.8);
    return Math.ceil(((bodyArea + sleeveArea) * densityFactor) / 50) * 50;
  });

  const sizeIdx = SIZES.indexOf(selectedSize);
  const sizeNote = sizeIdx >= 0
    ? `\nThe user is knitting size ${selectedSize} — the ${["1st", "2nd", "3rd", "4th", "5th", "6th"][sizeIdx]} value in each size set XS (S) M (L) XL (2XL).`
    : "";

  const constructionNotes = SWEATER_CONSTRUCTION[construction] ?? SWEATER_CONSTRUCTION["Raglan"];

  return `Generate a complete, publishable knitting pattern for a ${fit.toLowerCase()}-fit ${construction.toLowerCase()} sweater.
${sizeNote}

STYLE:
Construction: ${construction}
Fit: ${fit} (positive ease: ${EASE_CM[fit] ?? 14} cm)
Neckline: ${neckline}
Sleeve length: ${sleeveLength}
Cuff: ${cuff}
Hem: ${hem}

YARN:
Weight: ${yarnConfig.weight}
Gauge: ${g} stitches and ${gr} rows per 10 cm on ${needleSize} mm needles
Yarn: ${yarnRef}
Estimated yarn needed: ${fmt(yarnGrams, "g")}

TARGET FINISHED MEASUREMENTS — use these to derive all stitch counts:
Bust circumference:          ${fmt(bustCm)}
Body length (back, no coll): ${fmt(BODY_LENGTH_CM)}
Sleeve length (underarm–cuff):${fmt(sleeveCm)}
Upper arm circumference:     ${fmt(UPPER_ARM_CM)}
Wrist/cuff circumference:    ${fmt(WRIST_CM)}
Neck circumference:          ${fmt(NECK_CM)}
Yoke depth:                  ${fmt(YOKE_DEPTH_CM)}

PRE-CALCULATED STITCH COUNTS — use these numbers directly in the pattern:
Total body stitches (in rnd): ${stsFmt(bustCm, g)}
Front stitches (= back sts):  ${halfBody[0]} (${halfBody[1]}) ${halfBody[2]} (${halfBody[3]}) ${halfBody[4]} (${halfBody[5]}) sts
Upper arm sts (sleeve CO):    ${stsFmt(UPPER_ARM_CM, g)}
Wrist/cuff sts:               ${wristSts[0]} (${wristSts[1]}) ${wristSts[2]} (${wristSts[3]}) ${wristSts[4]} (${wristSts[5]}) sts
Neck cast-on sts:             ${neckSts[0]} (${neckSts[1]}) ${neckSts[2]} (${neckSts[3]}) ${neckSts[4]} (${neckSts[5]}) sts
Body length in rows:          ${bodyRows[0]} (${bodyRows[1]}) ${bodyRows[2]} (${bodyRows[3]}) ${bodyRows[4]} (${bodyRows[5]}) rows
Yoke depth in rows:           ${yokeRows[0]} (${yokeRows[1]}) ${yokeRows[2]} (${yokeRows[3]}) ${yokeRows[4]} (${yokeRows[5]}) rows
Sleeve length in rows:        ${sleeveRows[0]} (${sleeveRows[1]}) ${sleeveRows[2]} (${sleeveRows[3]}) ${sleeveRows[4]} (${sleeveRows[5]}) rows
Sleeve decrease rounds:       ${sleeveDecRnds[0]} (${sleeveDecRnds[1]}) ${sleeveDecRnds[2]} (${sleeveDecRnds[3]}) ${sleeveDecRnds[4]} (${sleeveDecRnds[5]}) times
Decrease every N rounds:      ${sleeveDecEvery[0]} (${sleeveDecEvery[1]}) ${sleeveDecEvery[2]} (${sleeveDecEvery[3]}) ${sleeveDecEvery[4]} (${sleeveDecEvery[5]}) rounds
${construction === "Raglan" ? `Raglan increase rounds:       ${raglanIncRnds[0]} (${raglanIncRnds[1]}) ${raglanIncRnds[2]} (${raglanIncRnds[3]}) ${raglanIncRnds[4]} (${raglanIncRnds[5]}) rounds
Raglan start sleeve sts:      ${RAGLAN_START_SLEEVE[0]} (${RAGLAN_START_SLEEVE[1]}) ${RAGLAN_START_SLEEVE[2]} (${RAGLAN_START_SLEEVE[3]}) ${RAGLAN_START_SLEEVE[4]} (${RAGLAN_START_SLEEVE[5]}) sts
Raglan start front/back sts:  ${raglanFrontBack[0]} (${raglanFrontBack[1]}) ${raglanFrontBack[2]} (${raglanFrontBack[3]}) ${raglanFrontBack[4]} (${raglanFrontBack[5]}) sts` : ""}

CONSTRUCTION:
${constructionNotes}

NECKLINE (${neckline}):
${getNecklineNotes(neckline)}

HEM (${hem}):
${getHemNotes(hem)}

CUFF (${cuff}):
${getCuffNotes(cuff)}

Write the full pattern now. Use the pre-calculated stitch counts above throughout — do not invent new numbers. Every instruction must include all 6 sizes. Write out every row, round, and repeat explicitly.`.trim();
}

// ---------------------------------------------------------------------------
// NECKLINE / HEM / CUFF helpers
// ---------------------------------------------------------------------------

function getNecklineNotes(neckline: string): string {
  switch (neckline) {
    case "V-neck":
      return `Work V-neck: cast on minimal front sts (2-4 sts at V point). Increase 1 st each side of V on every other round during yoke. After completing body, pick up sts around V opening, work 2-3 cm of 1x1 rib, decreasing 1 st each side of V point every other round. Bind off in rib.`;
    case "Turtleneck":
      return `After completing yoke/body, work turtleneck: pick up neck sts, join in the round, work 1x1 rib for 20-25 cm. Bind off very loosely in rib. The neck folds over on itself.`;
    case "Boat neck":
      return `Wide shallow neck — cast on approximately 65% of front stitch count at neck. Work a 2 cm 1x1 rib band. Bind off in rib. No V shaping.`;
    default: // Crew neck
      return `After completing yoke/body, pick up neck sts, join in the round, work 1x1 rib for 3-4 cm. Bind off loosely in rib.`;
  }
}

function getHemNotes(hem: string): string {
  switch (hem) {
    case "Rolled":
      return `Work 5 rounds of stockinette after reaching target body length. Bind off loosely. The hem rolls naturally to the RS.`;
    case "Straight":
      return `Bind off all sts in pattern at target body length. Optional: work 1 purl round before bind-off as a turning ridge.`;
    case "Curved":
      return `Add 2-3 cm extra length at sides using German Short Rows. Work GSR turns at side seam points, extending 4 sts further each time for 3-4 turns each side. Work one full round across all sts. Then work hem treatment.`;
    default: // Ribbed
      return `Work 1x1 rib (k1, p1) for 4-5 cm. Adjust stitch count to even number if needed. Bind off loosely in rib.`;
  }
}

function getCuffNotes(cuff: string): string {
  switch (cuff) {
    case "Rolled":
      return `Work 5 rounds of stockinette. Bind off loosely. Cuff rolls to RS naturally.`;
    case "Straight":
      return `Bind off all sleeve sts in pattern at target cuff length.`;
    default: // Ribbed
      return `Work 1x1 rib (k1, p1) for 5-6 cm. Bind off loosely in rib.`;
  }
}
