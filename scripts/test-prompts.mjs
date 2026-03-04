/**
 * End-to-end test for prompt validation and PatternPreview parser.
 *
 * Tests:
 * 1. getPatternPrompt output contains required elements for each item type
 * 2. parsePattern correctly identifies all 8 sections in sample patterns
 * 3. Size grading format is present in patterns
 * 4. Section order matches PetiteKnit spec
 * 5. Crown decreases appear in beanie patterns
 * 6. Stitch repeat appears in scarf patterns
 *
 * Run with: node scripts/test-prompts.mjs
 */

// ---- Inline copies of the key functions so we can test without TS compilation ----

const ITEM_LABELS = {
  sweater: "pullover sweater",
  slipover: "sleeveless slipover",
  "t-shirt": "short-sleeved knitted t-shirt",
  beanie: "beanie hat",
  gloves: "pair of gloves",
  scarf: "scarf",
  minnens: "pair of mittens (minnens)",
  hood: "hood",
};

const CONSTRUCTION_NOTES = {
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
- Sleeve length: typically 5-15 cm from underarm, specify in cm for all 6 sizes
- Body is relaxed or slightly fitted - minimal waist shaping
- Hem and cuffs finished with a short rib (1x1 or 2x2)`,

  beanie: `Construction notes specific to this beanie:
- Worked in the round from the cast-on edge (brim) upward
- Begin with ribbed brim (1x1 or 2x2, typically 3-5 cm)
- Work body in main stitch pattern
- Crown shaping: decrease evenly using paired decreases (k2tog and ssk) every other round, reducing to a small number of stitches, then break yarn and draw through remaining stitches
- Include total hat height in cm for all 6 sizes (head circumference XS-XXL)`,

  gloves: `Construction notes specific to these gloves:
- Worked in the round from the cuff upward
- Cuff: ribbed (1x1 or 2x2), typically 5-8 cm
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

  minnens: `Construction notes specific to these mittens:
- Worked in the round from the cuff upward
- Cuff: ribbed (1x1 or 2x2), typically 6-10 cm
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

function formatStyleConfig(styleConfig) {
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

function getPatternPrompt(itemType, styleConfig, yarnConfig) {
  const itemLabel = ITEM_LABELS[itemType];
  const styleSection = formatStyleConfig(styleConfig);
  const yarnName = yarnConfig.name ? ` (${yarnConfig.name})` : "";

  return `Generate a full knitting pattern for a ${itemLabel}.

${styleSection ? styleSection + "\n\n" : ""}Yarn details:
Weight: ${yarnConfig.weight}
Gauge: ${yarnConfig.gauge} stitches per 10 cm
Needle size: ${yarnConfig.needleSize} mm

${CONSTRUCTION_NOTES[itemType]}

Include realistic stitch counts and row counts for all 6 sizes (XS, S, M, L, XL, XXL) throughout the pattern. Every measurement, stitch count, and row count must have all 6 size values written inline in parentheses.

Follow the system prompt format exactly: plain text, section headings in ALL CAPS followed by a colon, all 8 required sections in order.

Yarn to reference in MATERIALS section: ${yarnConfig.weight} weight yarn${yarnName}, approximately [calculate amount] g per size.`.trim();
}

/**
 * Parser: replicated from PatternPreview.tsx
 */
function parsePattern(text) {
  const sectionHeaderRegex = /^([A-Z][A-Z\s]+):?\s*$/m;
  const lines = text.split("\n");
  const sections = [];

  let currentHeading = "";
  let currentLines = [];

  for (const line of lines) {
    if (sectionHeaderRegex.test(line.trim()) && line.trim().length > 0) {
      if (currentHeading || currentLines.some((l) => l.trim())) {
        sections.push({
          heading: currentHeading,
          content: currentLines.join("\n").trim(),
        });
      }
      currentHeading = line.trim().replace(/:$/, "");
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentHeading || currentLines.some((l) => l.trim())) {
    sections.push({
      heading: currentHeading,
      content: currentLines.join("\n").trim(),
    });
  }

  return sections.filter((s) => s.heading || s.content);
}

// ---- Sample patterns (realistic PetiteKnit-format output) ----

const SWEATER_PATTERN = `PATTERN NAME:
Classic Raglan Sweater

SIZES:
XS (S, M, L, XL, XXL)

FINISHED MEASUREMENTS:
Chest circumference: 80 (88, 96, 104, 112, 120) cm
Body length: 56 (57, 58, 59, 60, 61) cm
Sleeve length: 50 (51, 52, 53, 54, 55) cm
Yoke depth: 22 (23, 24, 25, 26, 27) cm

MATERIALS:
Yarn: DK weight yarn, approximately 400 (440, 480, 520, 570, 620) g
Needles: 4.0 mm circular needle, 80 cm
Needles: 3.5 mm circular needle, 40 cm for sleeves
Stitch markers: 4
Tapestry needle

GAUGE:
22 sts and 30 rows = 10 x 10 cm in stockinette stitch, after blocking

ABBREVIATIONS:
k: knit
p: purl
k2tog: knit two stitches together (right-leaning decrease)
ssk: slip, slip, knit (left-leaning decrease)
pm: place marker
sm: slip marker
sts: stitches
rnd: round
RS: right side

NOTES:
Worked in the round from the top down, seamlessly. The sweater begins at the neckline with a ribbed collar, then increases are made at four raglan points every other round to shape the yoke. Sleeves are placed on hold at the underarms and the body is worked in the round to the hem. Sleeves are picked up and worked in the round from the underarm down to the cuff.

INSTRUCTIONS:
1. COLLAR
Using 3.5 mm needle, cast on 80 (84, 88, 92, 96, 100) sts. Join to work in the round, being careful not to twist. Place marker for beginning of round.
Work 2x2 rib (k2, p2) for 3 cm.
Change to 4.0 mm needle.

2. YOKE SETUP
Setup round: k10 (10, 11, 11, 12, 12), pm, k20 (22, 22, 24, 24, 26), pm, k10 (10, 11, 11, 12, 12), pm, k40 (42, 44, 46, 48, 50), pm.
These markers separate the four raglan sections: front, sleeve, back, sleeve.

3. RAGLAN INCREASES
Increase round: *k to 1 st before marker, kfb, sm, kfb, repeat from * 4 times. 8 sts increased.
Work 1 round plain.
Repeat these 2 rounds until you have 240 (264, 288, 312, 336, 360) sts total, ending after a plain round.

4. SEPARATE BODY AND SLEEVES
Next round: k60 (66, 72, 78, 84, 90) body sts, place 60 (66, 72, 78, 84, 90) sleeve sts on waste yarn, cast on 4 (4, 4, 4, 4, 4) sts for underarm, k120 (132, 144, 156, 168, 180) back sts, place 60 (66, 72, 78, 84, 90) sleeve sts on waste yarn, cast on 4 (4, 4, 4, 4, 4) sts for underarm.
You now have 188 (206, 224, 242, 260, 278) body sts on needles.

5. BODY
Work body in the round in stockinette stitch until body measures 36 (37, 38, 39, 40, 41) cm from underarm, or 8 cm less than desired length.
Change to 3.5 mm needle.
Work 2x2 rib for 8 cm. Bind off loosely in rib pattern.

6. SLEEVES
Place 60 (66, 72, 78, 84, 90) sleeve sts on 4.0 mm needle. Pick up and k 4 (4, 4, 4, 4, 4) sts from underarm cast-on. 64 (70, 76, 82, 88, 94) sts.
Work in the round in stockinette stitch, decreasing 1 st at each side of underarm marker every 10th round 6 (7, 8, 9, 10, 11) times. 52 (56, 60, 64, 68, 72) sts.
Continue until sleeve measures 42 (43, 44, 45, 46, 47) cm from underarm, or 8 cm less than desired length.
Change to 3.5 mm needle.
Work 2x2 rib for 8 cm. Bind off loosely in rib pattern.

7. FINISHING
Weave in all ends. Seam underarm gaps if needed. Block to measurements.`;

const BEANIE_PATTERN = `PATTERN NAME:
Simple Ribbed Beanie

SIZES:
XS (S, M, L, XL, XXL)
Head circumference: 48 (50, 52, 54, 56, 58) cm

FINISHED MEASUREMENTS:
Head circumference: 46 (48, 50, 52, 54, 56) cm (10% negative ease)
Hat height: 22 (22, 23, 23, 24, 24) cm

MATERIALS:
Yarn: Worsted weight yarn, approximately 80 (85, 90, 95, 100, 105) g
Needles: 5.0 mm circular needle, 40 cm (or DPNs for crown)
Stitch markers: 1

GAUGE:
18 sts and 24 rows = 10 x 10 cm in stockinette stitch, after blocking

ABBREVIATIONS:
k: knit
p: purl
k2tog: knit two stitches together (right-leaning decrease)
ssk: slip, slip, knit (left-leaning decrease)
pm: place marker
sm: slip marker
sts: stitches
rnd: round

NOTES:
Worked in the round from the cast-on edge (brim) upward. The brim is worked in 2x2 rib for elasticity. The body is worked in stockinette stitch. Crown shaping uses evenly distributed paired decreases, reducing the stitch count every other round until only a small number remain, then yarn is drawn through for a neat finish.

INSTRUCTIONS:
1. BRIM
Using 5.0 mm needle, cast on 84 (88, 92, 96, 100, 104) sts. Join to work in the round, being careful not to twist. Place marker for beginning of round.
Work 2x2 rib (k2, p2) for 5 cm.

2. BODY
Work in stockinette stitch (knit every round) until hat measures 15 (15, 16, 16, 17, 17) cm from cast-on edge.

3. CROWN DECREASES
Begin crown shaping. Change to DPNs or magic loop when stitches become too few for circular needle.
Decrease round 1: *k12 (13, 14, 15, 16, 17), k2tog, repeat from * 6 times. 78 (82, 86, 90, 94, 98) sts.
Work 1 round plain.
Decrease round 2: *k11 (12, 13, 14, 15, 16), k2tog, repeat from * 6 times. 72 (76, 80, 84, 88, 92) sts.
Work 1 round plain.
Continue decreasing in this way, working 1 less stitch between decreases each decrease round, until 12 (12, 12, 12, 12, 12) sts remain.

4. FINISHING
Break yarn, leaving a 20 cm tail. Draw tail through remaining 12 sts and pull tight to close the crown. Weave in ends on the inside. Block lightly if desired.`;

const SCARF_PATTERN = `PATTERN NAME:
Seed Stitch Scarf

SIZES:
XS (S, M, L, XL, XXL)
Note: Scarf is one size fits all. Size grading does not apply to this item.

FINISHED MEASUREMENTS:
Width: 20 cm
Length: 160 cm

MATERIALS:
Yarn: Bulky weight yarn, approximately 150 g
Needles: 6.0 mm straight or circular needle
Tapestry needle

GAUGE:
14 sts and 20 rows = 10 x 10 cm in seed stitch, after blocking

ABBREVIATIONS:
k: knit
p: purl
RS: right side
WS: wrong side
sts: stitches
rep: repeat

NOTES:
Worked flat (back and forth on straight or circular needles). The stitch pattern is seed stitch, formed by alternating knit and purl stitches and offsetting them on each row. The stitch repeat unit is 2 stitches (k1, p1). Cast on a multiple of 2 stitches plus 0. Seed stitch is reversible, making it ideal for a scarf where both sides are visible. Bind off loosely for best drape.

INSTRUCTIONS:
1. CAST ON
Using 6.0 mm needle, cast on 28 sts. This gives a fabric approximately 20 cm wide.

2. STITCH PATTERN SETUP
The stitch repeat for seed stitch is 2 sts: (k1, p1).
Row 1 (RS): *k1, p1, repeat from * to end.
Row 2 (WS): *p1, k1, repeat from * to end.
These 2 rows form the seed stitch pattern repeat. Repeat rows 1 and 2 throughout.

3. BODY
Repeat the 2-row seed stitch pattern until scarf measures 160 cm from cast-on edge, or desired length.

4. BIND OFF
Bind off loosely in pattern: k the k sts and p the p sts as they face you.

5. FINISHING
Weave in ends. Block to measurements by soaking in lukewarm water, pressing flat, and pinning to dimensions. Allow to dry completely before removing pins.`;

// ---- Test helpers ----

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

function testSection(label, fn) {
  console.log(`\n${label}`);
  fn();
}

// ---- Tests ----

testSection("1. getPatternPrompt output for sweater", () => {
  const prompt = getPatternPrompt(
    "sweater",
    { construction: "raglan", neckline: "crew neck", fit: "relaxed" },
    { weight: "DK", gauge: "22", needleSize: "4.0" }
  );

  assert(
    prompt.includes("pullover sweater"),
    "Contains correct item description"
  );
  assert(
    prompt.includes("Construction: raglan"),
    "styleConfig key is formatted as readable label"
  );
  assert(
    prompt.includes("Neckline: crew neck"),
    "styleConfig neckline key is formatted correctly"
  );
  assert(prompt.includes("Gauge: 22 stitches per 10 cm"), "Gauge is included");
  assert(prompt.includes("Needle size: 4.0 mm"), "Needle size is included");
  assert(prompt.includes("XS, S, M, L, XL, XXL"), "All 6 sizes are mentioned");
  assert(
    prompt.includes("plain text"),
    "Format reminder (plain text) is present"
  );
  assert(
    prompt.includes("ALL CAPS"),
    "Format reminder (ALL CAPS sections) is present"
  );
});

testSection("2. getPatternPrompt output for beanie", () => {
  const prompt = getPatternPrompt(
    "beanie",
    {},
    { weight: "worsted", gauge: "18", needleSize: "5.0", name: "Drops Lima" }
  );

  assert(prompt.includes("beanie hat"), "Contains correct item description");
  assert(prompt.includes("Drops Lima"), "Yarn name is included");
  assert(
    prompt.toLowerCase().includes("crown"),
    "Beanie construction note mentions crown decreases"
  );
  assert(
    prompt.toLowerCase().includes("brim"),
    "Beanie construction note mentions brim/cast-on edge"
  );
});

testSection("3. getPatternPrompt output for scarf", () => {
  const prompt = getPatternPrompt(
    "scarf",
    {},
    { weight: "bulky", gauge: "14", needleSize: "6.0" }
  );

  assert(prompt.includes("scarf"), "Contains correct item description");
  assert(
    prompt.includes("flat"),
    "Scarf construction note mentions flat knitting"
  );
  assert(
    prompt.includes("stitch repeat"),
    "Scarf construction note mentions stitch repeat"
  );
});

testSection("4. parsePattern — sweater has all 8 required sections", () => {
  const sections = parsePattern(SWEATER_PATTERN);
  const headings = sections.map((s) => s.heading.toUpperCase());

  const requiredSections = [
    "PATTERN NAME",
    "SIZES",
    "FINISHED MEASUREMENTS",
    "MATERIALS",
    "GAUGE",
    "ABBREVIATIONS",
    "NOTES",
    "INSTRUCTIONS",
  ];

  for (const req of requiredSections) {
    assert(headings.includes(req), `Section "${req}" is present`);
  }

  // Check order
  const indices = requiredSections.map((req) => headings.indexOf(req));
  const sorted = [...indices].sort((a, b) => a - b);
  assert(
    JSON.stringify(indices) === JSON.stringify(sorted),
    "Sections appear in required order"
  );
});

testSection("5. parsePattern — sweater size grading format", () => {
  const sections = parsePattern(SWEATER_PATTERN);
  const fullText = sections.map((s) => s.content).join("\n");

  assert(
    /\d+\s*\(\d+,\s*\d+,\s*\d+,\s*\d+,\s*\d+\)/.test(fullText),
    "Size grading parenthesis format present (5 values in parens)"
  );
  assert(
    /XS \(S, M, L, XL, XXL\)/.test(fullText),
    "SIZES section has all 6 size labels"
  );

  // Check for 6-value grading (e.g. 80 (88, 96, 104, 112, 120))
  const sixSizePattern = /\d+\s*\(\d+,\s*\d+,\s*\d+,\s*\d+,\s*\d+\)/;
  assert(sixSizePattern.test(fullText), "Six-value size grading format found");
});

testSection("6. parsePattern — beanie crown decrease instructions", () => {
  const sections = parsePattern(BEANIE_PATTERN);
  const instrSection = sections.find(
    (s) => s.heading.toUpperCase() === "INSTRUCTIONS"
  );

  assert(instrSection !== undefined, "INSTRUCTIONS section found");
  assert(
    instrSection.content.toLowerCase().includes("crown"),
    "Crown section mentioned in instructions"
  );
  assert(
    instrSection.content.toLowerCase().includes("decrease"),
    "Decrease instructions present"
  );
  assert(
    instrSection.content.toLowerCase().includes("k2tog"),
    "k2tog decrease used in crown"
  );
  assert(
    /\d+\s*\(\d+,\s*\d+,\s*\d+,\s*\d+,\s*\d+\)/.test(
      instrSection.content
    ),
    "Size grading present in instructions"
  );
});

testSection("7. parsePattern — scarf stitch repeat pattern", () => {
  const sections = parsePattern(SCARF_PATTERN);
  const instrSection = sections.find(
    (s) => s.heading.toUpperCase() === "INSTRUCTIONS"
  );
  const notesSection = sections.find(
    (s) => s.heading.toUpperCase() === "NOTES"
  );

  assert(instrSection !== undefined, "INSTRUCTIONS section found");
  assert(notesSection !== undefined, "NOTES section found");
  assert(
    notesSection.content.toLowerCase().includes("stitch repeat"),
    "Stitch repeat mentioned in NOTES"
  );
  assert(
    instrSection.content.toLowerCase().includes("row 1"),
    "Pattern rows defined in instructions"
  );
  assert(
    instrSection.content.toLowerCase().includes("row 2"),
    "Pattern repeat has at least 2 rows"
  );
  assert(
    instrSection.content.toLowerCase().includes("repeat"),
    "Stitch repeat instruction present"
  );
});

testSection("8. PatternPreview parser — section content is not empty", () => {
  for (const [name, pattern] of [
    ["sweater", SWEATER_PATTERN],
    ["beanie", BEANIE_PATTERN],
    ["scarf", SCARF_PATTERN],
  ]) {
    const sections = parsePattern(pattern);
    assert(sections.length >= 8, `${name}: parsed at least 8 sections`);
    for (const section of sections) {
      if (section.heading) {
        assert(
          section.content.trim().length > 0,
          `${name}: section "${section.heading}" has non-empty content`
        );
      }
    }
  }
});

testSection("9. MATERIALS section — parsed as list items", () => {
  const sections = parsePattern(SWEATER_PATTERN);
  const materials = sections.find(
    (s) => s.heading.toUpperCase() === "MATERIALS"
  );
  assert(materials !== undefined, "MATERIALS section found");
  const lines = materials.content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  assert(lines.length >= 3, "Materials has at least 3 lines (yarn, needles...)");
  assert(
    lines.some((l) => l.toLowerCase().includes("yarn")),
    "Materials contains yarn line"
  );
  assert(
    lines.some((l) => l.toLowerCase().includes("needle")),
    "Materials contains needle line"
  );
});

testSection("10. ABBREVIATIONS section — colon-separated format", () => {
  const sections = parsePattern(SWEATER_PATTERN);
  const abbr = sections.find(
    (s) => s.heading.toUpperCase() === "ABBREVIATIONS"
  );
  assert(abbr !== undefined, "ABBREVIATIONS section found");
  const lines = abbr.content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  assert(
    lines.every((l) => l.includes(":")),
    "All abbreviation lines contain colon separating term from definition"
  );
});

// ---- Summary ----

console.log("\n--------------------------------------------");
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error("Some tests FAILED.");
  process.exit(1);
} else {
  console.log("All tests PASSED.");
  process.exit(0);
}
