// Types for Malina prompt configuration

export type StyleConfig = Record<string, string>;

export interface YarnConfig {
  weight: string;
  gaugeStitches: string;
  gaugeRows: string;
  needleSize: string;
  name?: string;
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

// Placeholder exports for Dev 2 — will be filled in subsequent tasks

export const SYSTEM_PROMPT = `You are a professional knitting pattern writer trained in the PetiteKnit style.

VOICE AND TONE:
Write in the PetiteKnit style: clear, structured, warm but technical. Use standard knitting terminology throughout. Be precise with numbers and instructions. Avoid filler phrases.

FORMAT RULES:
- Output plain text only — no markdown, no asterisks, no bullet symbols, no headers with # signs
- Section headings must be in ALL CAPS followed by a colon, then a blank line, then the content
- Leave one blank line between sections
- Each numbered instruction step starts on its own line with the step number followed by a period
- Do not use markdown formatting of any kind

SIZE GRADING RULE:
- Always include all 6 sizes: XS, S, M, L, XL, XXL
- Write size variants inline in parentheses, smallest size first: 80 (88, 96, 104, 112, 120)
- The first number is XS, then S, M, L, XL, XXL in order — always all 6
- Apply size grading to every stitch count, measurement, and row count in the pattern
- For the SIZES line write exactly: XS (S, M, L, XL, XXL)

CONSTRUCTION:
- Default construction: top-down, worked in the round, unless the item type requires otherwise
- State the construction method clearly in the NOTES section
- Seamless construction preferred for garments

REQUIRED SECTIONS IN ORDER:
Every pattern must contain these sections in exactly this order:
1. PATTERN NAME
2. SIZES
3. FINISHED MEASUREMENTS
4. MATERIALS
5. GAUGE
6. ABBREVIATIONS
7. NOTES
8. INSTRUCTIONS

Do not add extra sections or change the order. Do not omit any section.`;


export const PHOTO_ANALYSIS_PROMPT = `Analyze the knitting photo and identify the following attributes of the garment or accessory shown. Return your answer as a JSON object only — no explanation, no extra text, just the JSON.

Attributes to detect:

construction: The construction method. Allowed values: "Top-down", "Bottom-up", "Seamless", "Seamed"
neckline: The shape of the neckline. Allowed values: "Crew neck", "V-neck", "Turtleneck", "Boat neck", "Scoop neck"
sleeveLength: The length of the sleeves. Allowed values: "Sleeveless", "Short", "3/4", "Long"
fit: How the garment fits the body. Allowed values: "Fitted", "Relaxed", "Oversized"
hem: The shape or style of the hem. Allowed values: "Straight", "Curved", "Ribbed"

Rules:
- Only include keys you can confidently identify from the photo.
- Each value must be exactly one of the allowed values listed above (case-sensitive).
- If an attribute is unclear or not applicable, omit that key from the JSON entirely.
- Do not add any keys other than the five listed above.
- Do not include any explanation or text outside the JSON object.

Example output:
{
  "construction": "Top-down",
  "neckline": "Crew neck",
  "sleeveLength": "Long",
  "fit": "Relaxed",
  "hem": "Ribbed"
}`;

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

const CONSTRUCTION_NOTES: Record<ItemType, string> = {
  sweater: `Construction notes specific to this sweater:
- Use the construction method specified in the style config (raglan, yoke, or dropped shoulder)
- For raglan: begin with neckline cast-on, place raglan markers, increase every other round until body and sleeves reach target width, separate at underarms, work body and sleeves in the round separately
- For circular yoke: cast on neckline stitches, work yoke flat or in the round with evenly distributed increases, separate body and sleeves at underarms
- For dropped shoulder: work body in the round to underarm, work front and back flat separately, pick up stitches for sleeves from the armhole edge
- Include body length from underarm to hem, sleeve length from underarm to cuff
- Include waist shaping if fit is fitted or semi-fitted`,

  slipover: `Construction notes specific to this slipover:
- Worked in the round from the neckline or hem, no sleeves
- Cast on at neckline if top-down, or at hem if bottom-up
- Shape armhole openings by binding off or placing on hold and working front and back separately if needed
- Include armhole depth and edging (ribbing or i-cord)
- Body length measured from underarm to hem`,

  "t-shirt": `Construction notes specific to this knitted t-shirt:
- Short sleeves, minimal or no shaping in the body
- Worked top-down in the round
- Sleeve length: typically 5–15 cm from underarm, specify in cm for all 6 sizes
- Body is relaxed or slightly fitted — minimal waist shaping
- Hem and cuffs finished with a short rib (1x1 or 2x2)`,

  beanie: `Construction notes specific to this beanie:
- Worked in the round from the cast-on edge (brim) upward
- Begin with ribbed brim (1x1 or 2x2, typically 3–5 cm)
- Work body in main stitch pattern
- Crown shaping: decrease evenly using paired decreases (k2tog and ssk) every other round, reducing to a small number of stitches, then break yarn and draw through remaining stitches
- Include total hat height in cm for all 6 sizes (head circumference XS–XXL)`,

  gloves: `Construction notes specific to these gloves:
- Worked in the round from the cuff upward
- Cuff: ribbed (1x1 or 2x2), typically 5–8 cm
- Thumb gusset: begin gusset increases at the appropriate point, place thumb stitches on hold, continue with hand
- Hand: work in the round to the base of the fingers
- Fingers: work each finger individually in the round, beginning with index or little finger
- Thumb: pick up held stitches plus a few extra at the gap, work in the round to tip, decrease to close
- Include stitch counts for each finger and thumb for all 6 sizes`,

  scarf: `Construction notes specific to this scarf:
- Worked flat (back and forth), not in the round
- Begin with a cast-on edge and work the full length
- Use a simple stitch repeat pattern (e.g. 2x2 rib, seed stitch, or a cable repeat)
- Specify the stitch repeat unit and how many repeats to cast on
- Include total length in cm and stitch count (does not need to be size-graded, but if width varies note it)
- Bind off loosely, block to measurements`,

  mittens: `Construction notes specific to these mittens:
- Worked in the round from the cuff upward
- Cuff: ribbed (1x1 or 2x2), typically 6–10 cm
- Thumb opening: either a thumb hole worked with waste yarn (afterthought thumb) or a thumb gusset with increases
- Hand: work in the round to the tip of the mitten
- Tip shaping: decrease at each side every other round to form a rounded tip
- Thumb: pick up stitches around the thumb opening, work in the round, decrease to close the tip
- Include stitch counts for hand and thumb for all 6 sizes`,

  hood: `Construction notes specific to this hood:
- Can be worked flat in two pieces with a center back seam, or in the round with shaping
- If flat: cast on at the face opening edge, work toward the crown, seam at center back
- If in the round: cast on at the face opening, join, and work in the round to the crown, shaping the top with short rows or decreases
- Include a front border (ribbing or i-cord) around the face opening
- Specify whether the hood attaches to a neckline or is a standalone piece
- Include depth (face-to-back) and height (chin-to-crown) measurements`,
};

function formatStyleConfig(styleConfig: StyleConfig): string {
  if (Object.keys(styleConfig).length === 0) return "";
  const lines = Object.entries(styleConfig)
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
      return `${label}: ${value}`;
    })
    .join("\n");
  return `Style options for this item:\n${lines}`;
}

export function getPatternPrompt(
  itemType: ItemType,
  styleConfig: StyleConfig,
  yarnConfig: YarnConfig
): string {
  const itemLabel = ITEM_LABELS[itemType];
  const styleSection = formatStyleConfig(styleConfig);
  const yarnName = yarnConfig.name ? ` (${yarnConfig.name})` : "";

  return `Generate a full knitting pattern for a ${itemLabel}.

${styleSection ? styleSection + "\n\n" : ""}Yarn details:
Weight: ${yarnConfig.weight}
Gauge: ${yarnConfig.gaugeStitches} stitches and ${yarnConfig.gaugeRows} rows per 10 cm
Needle size: ${yarnConfig.needleSize} mm

${CONSTRUCTION_NOTES[itemType]}

Include realistic stitch counts and row counts for all 6 sizes (XS, S, M, L, XL, XXL) throughout the pattern. Every measurement, stitch count, and row count must have all 6 size values written inline in parentheses.

Follow the system prompt format exactly: plain text, section headings in ALL CAPS followed by a colon, all 8 required sections in order.

Yarn to reference in MATERIALS section: ${yarnConfig.weight} weight yarn${yarnName}, calculate and include the approximate yarn amount in grams for each size based on gauge and item dimensions.`.trim();
}
