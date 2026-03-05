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
  const cuff = styleConfig.cuff ?? "";
  const construction = styleConfig.construction ?? "";

  const cx = 100;

  // Body half-width and sleeve width at shoulder based on fit
  let halfW = 48, sleeveW = 38;
  if (fit === "Oversized")  { halfW = 62; sleeveW = 30; }
  else if (fit === "Relaxed") { halfW = 54; sleeveW = 34; }
  else if (fit === "Fitted")  { halfW = 42; sleeveW = 40; }
  const wristW = 20;

  const x0 = cx - halfW;
  const x1 = cx + halfW;
  const bodyTop = 78;
  const bodyBottom = 208;
  const sleeveDropY = 10; // how much sleeve top drops from shoulder

  // Effective sleeve mode
  let eff: "full" | "short" | "none" = sleeveMode;
  if (sleeveMode === "full") {
    if (sleeveLength === "Short") eff = "short";
    else if (sleeveLength === "Sleeveless") eff = "none";
  }

  // Sleeve end Y
  let sleeveEndY = 185;
  if (eff === "short") sleeveEndY = 112;
  else if (sleeveLength === "3/4") sleeveEndY = 148;

  const paths: React.ReactNode[] = [];

  // --- SLEEVES (drawn first, behind body) ---
  if (eff === "full" || eff === "short") {
    // Each sleeve is a trapezoid: wide at shoulder, narrowing to wrist
    // Left: inner-top(x0,bodyTop) → outer-top → outer-wrist → inner-wrist(x0,sleeveEndY)
    paths.push(
      <path
        key="lsleeve"
        d={`M ${x0} ${bodyTop} L ${x0 - sleeveW} ${bodyTop + sleeveDropY} L ${x0 - wristW} ${sleeveEndY} L ${x0} ${sleeveEndY} Z`}
        stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH}
      />,
      <path
        key="rsleeve"
        d={`M ${x1} ${bodyTop} L ${x1 + sleeveW} ${bodyTop + sleeveDropY} L ${x1 + wristW} ${sleeveEndY} L ${x1} ${sleeveEndY} Z`}
        stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH}
      />
    );
  }

  // --- SHOULDER STRAPS (slipover only) ---
  if (sleeveMode === "none") {
    const strapW = 14;
    paths.push(
      <rect key="lstrap" x={x0 + 10} y={bodyTop - 22} width={strapW} height={22} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />,
      <rect key="rstrap" x={x1 - 10 - strapW} y={bodyTop - 22} width={strapW} height={22} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  }

  // --- BODY with neckline carved into top edge ---
  // Neckline parameters: leftX, rightX, and the SVG path segment between them
  let neckLeft: number, neckRight: number, neckSeg: string;
  let collarPath: string | null = null;

  if (neckline === "V-neck") {
    neckLeft = cx - 22; neckRight = cx + 22;
    neckSeg = `L ${cx} ${bodyTop + 28} L ${neckRight} ${bodyTop}`;
  } else if (neckline === "Boat neck") {
    neckLeft = cx - 38; neckRight = cx + 38;
    neckSeg = `Q ${cx} ${bodyTop + 8} ${neckRight} ${bodyTop}`;
  } else if (neckline === "Scoop neck") {
    neckLeft = cx - 26; neckRight = cx + 26;
    neckSeg = `Q ${cx} ${bodyTop + 22} ${neckRight} ${bodyTop}`;
  } else if (neckline === "Square neck") {
    neckLeft = cx - 20; neckRight = cx + 20;
    neckSeg = `L ${cx - 20} ${bodyTop + 18} L ${neckRight} ${bodyTop + 18} L ${neckRight} ${bodyTop}`;
  } else if (neckline === "Turtleneck") {
    neckLeft = cx - 16; neckRight = cx + 16;
    neckSeg = `L ${neckRight} ${bodyTop}`;
    collarPath = `M ${neckLeft} ${bodyTop} L ${neckLeft} ${bodyTop - 26} Q ${cx} ${bodyTop - 32} ${neckRight} ${bodyTop - 26} L ${neckRight} ${bodyTop}`;
  } else {
    // Crew neck (default)
    neckLeft = cx - 18; neckRight = cx + 18;
    neckSeg = `Q ${cx} ${bodyTop + 14} ${neckRight} ${bodyTop}`;
  }

  // Body: rectangle with neckline opening cut into the top edge
  paths.push(
    <path
      key="body"
      d={`M ${x0} ${bodyTop} L ${neckLeft} ${bodyTop} ${neckSeg} L ${x1} ${bodyTop} L ${x1} ${bodyBottom} L ${x0} ${bodyBottom} Z`}
      stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH}
    />
  );

  // Turtleneck collar tube (drawn above body)
  if (collarPath) {
    paths.push(<path key="collar" d={collarPath} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />);
  }

  // --- CONSTRUCTION SEAM INDICATORS (sweater only) ---
  if (eff === "full") {
    const yokeY = bodyTop + 58;
    if (construction === "Raglan") {
      // Diagonal dashed seams from each neck edge down to underarm
      paths.push(
        <line key="rag-l" x1={neckLeft} y1={bodyTop} x2={x0} y2={yokeY}
          stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeDasharray="4 3" />,
        <line key="rag-r" x1={neckRight} y1={bodyTop} x2={x1} y2={yokeY}
          stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeDasharray="4 3" />
      );
    } else if (construction === "Circular yoke") {
      // Curved dashed yoke line
      paths.push(
        <path key="yoke"
          d={`M ${x0} ${yokeY} Q ${cx} ${yokeY - 18} ${x1} ${yokeY}`}
          fill="none" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeDasharray="4 3" />
      );
    }
    // Dropped shoulder: straight horizontal shoulder is already implied by the body rectangle
  }

  // --- HEM ---
  if (hem === "Ribbed") {
    for (let i = 1; i <= 3; i++) {
      paths.push(
        <line key={`h${i}`} x1={x0} y1={bodyBottom + i * 5} x2={x1} y2={bodyBottom + i * 5}
          stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      );
    }
  } else if (hem === "Rolled" || hem === "Curved") {
    paths.push(
      <path key="hem"
        d={`M ${x0} ${bodyBottom} Q ${cx} ${bodyBottom + 12} ${x1} ${bodyBottom}`}
        fill="none" stroke={STROKE} strokeWidth={STROKE_WIDTH} />
    );
  }

  // --- CUFF RIBBING ---
  if ((eff === "full" || eff === "short") && cuff === "Ribbed") {
    for (let i = 1; i <= 3; i++) {
      paths.push(
        <line key={`lcuff${i}`} x1={x0 - wristW} y1={sleeveEndY + i * 4} x2={x0} y2={sleeveEndY + i * 4}
          stroke={STROKE} strokeWidth={STROKE_WIDTH} />,
        <line key={`rcuff${i}`} x1={x1} y1={sleeveEndY + i * 4} x2={x1 + wristW} y2={sleeveEndY + i * 4}
          stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      );
    }
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
  if (hasBrim) {
    paths.push(
      <rect key="brimbox" x={38} y={160} width={124} height={brimH} stroke={STROKE} fill="none" strokeWidth={STROKE_WIDTH} />
    );
  }

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
      case "mittens":
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
