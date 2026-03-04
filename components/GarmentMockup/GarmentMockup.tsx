"use client";

import type { ItemType, StyleConfig } from "@/lib/store";

interface GarmentMockupProps {
  itemType: ItemType;
  styleConfig: StyleConfig;
  className?: string;
}

const STROKE = "#1A1814";
const STROKE_WIDTH = 1;

function SweaterMockup({ styleConfig, sleeveMode }: { styleConfig: StyleConfig; sleeveMode: "full" | "short" | "none" }) {
  const fit = styleConfig.fit ?? "";
  const neckline = styleConfig.neckline ?? "";
  const sleeveLength = styleConfig.sleeveLength ?? "";
  const hem = styleConfig.hem ?? "";

  // Body x bounds based on fit
  let x0 = 43, x1 = 157;
  if (fit === "Oversized") { x0 = 30; x1 = 170; }
  else if (fit === "Relaxed") { x0 = 38; x1 = 162; }
  else if (fit === "Fitted") { x0 = 48; x1 = 152; }

  const bodyTop = 80;
  const bodyBottom = 200;
  const cx = 100;

  // Effective sleeve mode: slipover/sleeveless override
  let effectiveSleeve = sleeveMode;
  if (sleeveMode === "full") {
    if (sleeveLength === "Short") effectiveSleeve = "short";
    else if (sleeveLength === "Sleeveless") effectiveSleeve = "none";
  }

  // Sleeve y bottom
  let sleeveEndY = 185;
  if (sleeveLength === "3/4") sleeveEndY = 150;
  else if (sleeveLength === "Short" || sleeveMode === "short") sleeveEndY = 115;

  // Build SVG paths
  const paths: React.ReactNode[] = [];

  // Left sleeve
  if (effectiveSleeve === "full" || effectiveSleeve === "short") {
    const sleeveTopOuter = x0 - 14;
    const sleeveTopInner = x0;
    const sleeveBottomOuter = sleeveTopOuter + 4;
    const sleeveBottomInner = sleeveTopInner + 2;
    paths.push(
      <path
        key="lsleeve"
        d={`M ${sleeveTopInner} ${bodyTop} L ${sleeveTopOuter} ${bodyTop + 10} L ${sleeveBottomOuter} ${sleeveEndY} L ${sleeveBottomInner} ${sleeveEndY} L ${sleeveTopInner + 2} ${bodyTop + 10} Z`}
        stroke={STROKE}
        fill="none"
        strokeWidth={STROKE_WIDTH}
      />
    );
    paths.push(
      <path
        key="rsleeve"
        d={`M ${x1} ${bodyTop} L ${x1 + 14} ${bodyTop + 10} L ${x1 + 14 - 4} ${sleeveEndY} L ${x1 - 2} ${sleeveEndY} L ${x1 - 2} ${bodyTop + 10} Z`}
        stroke={STROKE}
        fill="none"
        strokeWidth={STROKE_WIDTH}
      />
    );
  }

  // Shoulder straps for slipover / sleeveless
  if (effectiveSleeve === "none") {
    const strapW = 12;
    const lStrap0 = x0 + 8;
    const rStrap0 = x1 - 8 - strapW;
    paths.push(
      <rect key="lstrapbox" x={lStrap0} y={bodyTop - 20} width={strapW} height={20} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />,
      <rect key="rstrapbox" x={rStrap0} y={bodyTop - 20} width={strapW} height={20} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  }

  // Body trapezoid (slight taper at top)
  const bodyTopL = x0 + (effectiveSleeve === "none" ? 4 : 0);
  const bodyTopR = x1 - (effectiveSleeve === "none" ? 4 : 0);
  paths.push(
    <path
      key="body"
      d={`M ${bodyTopL} ${bodyTop} L ${x0} ${bodyBottom} L ${x1} ${bodyBottom} L ${bodyTopR} ${bodyTop}`}
      stroke={STROKE}
      fill="none"
      strokeWidth={STROKE_WIDTH}
    />
  );

  // Neckline
  if (neckline === "V-neck") {
    paths.push(
      <path key="neck" d={`M ${cx - 22} ${bodyTop} L ${cx} ${bodyTop + 22} L ${cx + 22} ${bodyTop}`} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  } else if (neckline === "Turtleneck") {
    paths.push(
      <path key="neck" d={`M ${cx - 16} ${bodyTop} L ${cx - 16} ${bodyTop - 22} Q ${cx} ${bodyTop - 27} ${cx + 16} ${bodyTop - 22} L ${cx + 16} ${bodyTop}`} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  } else if (neckline === "Boat neck") {
    paths.push(
      <path key="neck" d={`M ${cx - 34} ${bodyTop} Q ${cx} ${bodyTop + 8} ${cx + 34} ${bodyTop}`} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  } else if (neckline === "Scoop neck") {
    paths.push(
      <path key="neck" d={`M ${cx - 26} ${bodyTop} Q ${cx} ${bodyTop + 18} ${cx + 26} ${bodyTop}`} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  } else if (neckline === "Square neck") {
    paths.push(
      <path key="neck" d={`M ${cx - 20} ${bodyTop} L ${cx - 20} ${bodyTop + 16} L ${cx + 20} ${bodyTop + 16} L ${cx + 20} ${bodyTop}`} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  } else {
    // Crew neck default
    paths.push(
      <path key="neck" d={`M ${cx - 18} ${bodyTop} Q ${cx} ${bodyTop + 10} ${cx + 18} ${bodyTop}`} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  }

  // Hem treatment
  if (hem === "Ribbed") {
    paths.push(
      <line key="h1" x1={x0} y1={bodyBottom + 5} x2={x1} y2={bodyBottom + 5} stroke={STROKE} strokeWidth={STROKE_WIDTH} />,
      <line key="h2" x1={x0} y1={bodyBottom + 10} x2={x1} y2={bodyBottom + 10} stroke={STROKE} strokeWidth={STROKE_WIDTH} />,
      <line key="h3" x1={x0} y1={bodyBottom + 15} x2={x1} y2={bodyBottom + 15} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
    );
  } else if (hem === "Rolled") {
    paths.push(
      <path key="hem" d={`M ${x0} ${bodyBottom} Q ${cx} ${bodyBottom + 10} ${x1} ${bodyBottom}`} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  } else if (hem === "Curved") {
    paths.push(
      <path key="hem" d={`M ${x0} ${bodyBottom} Q ${cx} ${bodyBottom + 12} ${x1} ${bodyBottom}`} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  }

  return <>{paths}</>;
}

function BeanieMockup({ styleConfig }: { styleConfig: StyleConfig }) {
  const crown = styleConfig.crownShape ?? "";
  const brim = styleConfig.brim ?? "";

  const paths: React.ReactNode[] = [];

  // Crown dome
  if (crown === "Slouchy") {
    paths.push(
      <path key="dome" d="M 35 160 Q 30 40 100 38 Q 170 40 165 160" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  } else if (crown === "Pointy") {
    paths.push(
      <path key="dome" d="M 40 160 L 100 42 L 160 160" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  } else if (crown === "Flat") {
    paths.push(
      <path key="dome" d="M 40 160 Q 38 95 100 90 Q 162 95 160 160" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />,
      <line key="flat-top" x1={70} y1={90} x2={130} y2={90} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
    );
  } else {
    // Classic
    paths.push(
      <path key="dome" d="M 40 160 Q 40 60 100 55 Q 160 60 160 160" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  }

  // Brim
  const hasBrim = brim !== "No brim" && brim !== "";
  const brimH = brim === "Wide ribbed" ? 28 : brim === "Folded" ? 22 : 16;
  paths.push(
    <rect key="brimbox" x={38} y={160} width={124} height={brimH > 0 ? brimH : 16} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
  );

  if (hasBrim && (brim === "Short ribbed" || brim === "Wide ribbed")) {
    const ribY1 = 160 + Math.round(brimH / 3);
    const ribY2 = 160 + Math.round((brimH * 2) / 3);
    paths.push(
      <line key="rib1" x1={38} y1={ribY1} x2={162} y2={ribY1} stroke={STROKE} strokeWidth={STROKE_WIDTH} />,
      <line key="rib2" x1={38} y1={ribY2} x2={162} y2={ribY2} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
    );
  } else if (brim === "Folded") {
    const foldY = 160 + Math.round(brimH / 2);
    paths.push(
      <line key="fold" x1={38} y1={foldY} x2={162} y2={foldY} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
    );
  }

  return <>{paths}</>;
}

function ScarfMockup({ styleConfig }: { styleConfig: StyleConfig }) {
  const width = styleConfig.width ?? "";
  let rectW = 36;
  if (width === "Narrow") rectW = 22;
  else if (width === "Wide") rectW = 50;
  else if (width === "Shawl") rectW = 70;

  const x0 = 100 - rectW / 2;
  const x1 = 100 + rectW / 2;

  return (
    <>
      <rect x={x0} y={20} width={rectW} height={190} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
      <path d={`M ${x0} ${200} Q ${100} ${215} ${x1} ${205}`} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    </>
  );
}

function GlovesMockup() {
  return (
    <>
      {/* Wrist */}
      <rect x={70} y={140} width={60} height={50} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
      {/* Palm */}
      <rect x={68} y={90} width={64} height={52} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
      {/* Four fingers */}
      <rect x={68} y={52} width={13} height={40} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
      <rect x={83} y={46} width={13} height={46} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
      <rect x={98} y={48} width={13} height={44} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
      <rect x={113} y={54} width={13} height={38} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
      {/* Thumb */}
      <path d="M 68 110 L 50 100 L 48 120 L 68 124" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    </>
  );
}

function MittensMockup() {
  return (
    <>
      {/* Body */}
      <path d="M 55 200 L 55 100 Q 55 58 100 55 Q 145 58 145 100 L 145 200 Z" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
      {/* Thumb */}
      <path d="M 145 115 Q 162 112 163 98 Q 163 82 152 80 L 145 84" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
      {/* Cuff ribbing */}
      <line x1={55} y1={190} x2={145} y2={190} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <line x1={55} y1={200} x2={145} y2={200} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
    </>
  );
}

function HoodMockup({ styleConfig }: { styleConfig: StyleConfig }) {
  const type = styleConfig.type ?? "";
  const closure = styleConfig.closure ?? "";

  const paths: React.ReactNode[] = [];

  if (type === "Gnome") {
    paths.push(
      <path key="outer" d="M 60 200 L 100 30 L 140 200 Z" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />,
      <path key="face" d="M 72 170 Q 100 155 128 170" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  } else if (type === "Cowl") {
    paths.push(
      <path key="outer" d="M 40 200 Q 38 80 100 70 Q 162 80 160 200" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />,
      <path key="face" d="M 55 200 Q 55 110 100 100 Q 145 110 145 200" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  } else if (type === "Oversized") {
    paths.push(
      <path key="outer" d="M 30 200 Q 28 60 100 50 Q 172 60 170 200" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />,
      <path key="face" d="M 55 200 Q 55 100 100 90 Q 145 100 145 200" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  } else {
    // Standard
    paths.push(
      <path key="outer" d="M 40 200 Q 40 70 100 62 Q 160 70 160 200" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />,
      <path key="face" d="M 60 200 Q 60 108 100 100 Q 140 108 140 200" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  }

  if (closure === "Drawstring") {
    paths.push(
      <path key="drawstring" d="M 90 62 Q 100 55 110 62" stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />,
      <circle key="ds-l" cx={90} cy={62} r={3} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />,
      <circle key="ds-r" cx={110} cy={62} r={3} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  }

  return <>{paths}</>;
}

export default function GarmentMockup({ itemType, styleConfig, className }: GarmentMockupProps) {
  const isEmpty = Object.keys(styleConfig).length === 0;

  const svgClass = `w-full max-w-[280px] ${className ?? ""}`;

  function renderContent() {
    switch (itemType) {
      case "sweater":
        return <SweaterMockup styleConfig={styleConfig} sleeveMode="full" />;
      case "slipover":
        return <SweaterMockup styleConfig={styleConfig} sleeveMode="none" />;
      case "t-shirt":
        return <SweaterMockup styleConfig={styleConfig} sleeveMode="short" />;
      case "beanie":
        return <BeanieMockup styleConfig={styleConfig} />;
      case "scarf":
        return <ScarfMockup styleConfig={styleConfig} />;
      case "gloves":
        return <GlovesMockup />;
      case "minnens":
        return <MittensMockup />;
      case "hood":
        return <HoodMockup styleConfig={styleConfig} />;
      default:
        return null;
    }
  }

  return (
    <svg
      viewBox="0 0 200 240"
      className={svgClass}
      style={{ opacity: isEmpty ? 0.4 : 1 }}
      aria-hidden="true"
    >
      {renderContent()}
    </svg>
  );
}
