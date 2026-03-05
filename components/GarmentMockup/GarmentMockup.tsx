"use client";

import type { ItemType, StyleConfig } from "@/lib/store";

const LINE = "#1a1a1a";
const SEAM = "#ff6b6b";

const O: React.SVGAttributes<SVGElement> = {
  stroke: LINE, fill: "white",
  strokeWidth: 1.2, strokeLinejoin: "round", strokeLinecap: "round",
};
const D: React.SVGAttributes<SVGElement> = {
  fill: "none", stroke: LINE, strokeWidth: 1,
};
const S: React.SVGAttributes<SVGElement> = {
  fill: "none", stroke: SEAM, strokeWidth: 1.4,
};

// ── Sweater/Slipover/T-shirt SVG (viewBox "0 0 360 260") ─────────────────────

function SweaterSVG({
  styleConfig,
  sleeveMode = "full",
}: {
  styleConfig: StyleConfig;
  sleeveMode?: "full" | "short" | "none";
}) {
  const fit          = styleConfig.fit          ?? "";
  const construction = styleConfig.construction ?? "";
  const neckline     = styleConfig.neckline     ?? "";
  const sleeveLength = styleConfig.sleeveLength ?? "";
  const hem          = styleConfig.hem          ?? "";
  const cuff         = styleConfig.cuff         ?? "";

  // Canvas: viewBox "0 0 360 260"
  const cx        = 180;
  const shoulderY = 90;
  const hemY      = 220;

  // ── FIT → body half-width ──────────────────────────────────────────────────
  const halfW = fit === "Oversized" ? 68
              : fit === "Relaxed"   ? 58
              : fit === "Fitted"    ? 44
              : 50; // Classic / default
  const x0 = cx - halfW;
  const x1 = cx + halfW;

  // ── NECKLINE ───────────────────────────────────────────────────────────────
  const neckW = neckline === "Boat neck"   ? 32
              : neckline === "Turtleneck"  ? 16
              : neckline === "Scoop neck"  ? 24
              : neckline === "Square neck" ? 22
              : neckline === "V-neck"      ? 18
              : 20; // Crew neck / default
  const neckL = cx - neckW;
  const neckR = cx + neckW;

  // neckSeg: SVG commands from (neckL, shoulderY) to (neckR, shoulderY)
  let neckSeg = "";
  let collarD: string | null = null;

  if (neckline === "V-neck") {
    neckSeg = `L ${cx} ${shoulderY + 28} L ${neckR} ${shoulderY}`;
  } else if (neckline === "Boat neck") {
    neckSeg = `Q ${cx} ${shoulderY + 8} ${neckR} ${shoulderY}`;
  } else if (neckline === "Turtleneck") {
    neckSeg = `L ${neckR} ${shoulderY}`;
    const ty = shoulderY - 28;
    collarD = `M ${neckL} ${shoulderY} L ${neckL} ${ty} Q ${cx} ${ty - 6} ${neckR} ${ty} L ${neckR} ${shoulderY}`;
  } else if (neckline === "Scoop neck") {
    neckSeg = `Q ${cx} ${shoulderY + 22} ${neckR} ${shoulderY}`;
  } else if (neckline === "Square neck") {
    const sqY = shoulderY + 18;
    neckSeg = `L ${neckL} ${sqY} L ${neckR} ${sqY} L ${neckR} ${shoulderY}`;
  } else {
    // Crew neck (default)
    neckSeg = `Q ${cx} ${shoulderY + 14} ${neckR} ${shoulderY}`;
  }

  // ── CONSTRUCTION ───────────────────────────────────────────────────────────
  const isRaglan = construction === "Raglan";
  const isDrop   = construction === "Dropped shoulder";
  const underarmY = shoulderY + 46;

  // ── SLEEVE EFFECTIVE LENGTH ────────────────────────────────────────────────
  type SlEff = "long" | "3/4" | "short" | "none";
  const eff: SlEff =
    sleeveMode === "none"           ? "none"
    : sleeveMode === "short"        ? "short"
    : sleeveLength === "Sleeveless" ? "none"
    : sleeveLength === "Short"      ? "short"
    : sleeveLength === "3/4"        ? "3/4"
    : "long";

  // Sleeve arm: horizontal + vertical extension from body edge
  const slExtH = eff === "long" ? 90 : eff === "3/4" ? 64 : eff === "short" ? 32 : 0;
  const slExtV = eff === "long" ? 50 : eff === "3/4" ? 35 : eff === "short" ? 16 : 0;

  const slTopW   = 28; // sleeve width at shoulder attachment
  const slWristW = 14; // sleeve width at wrist
  const ribH     = 16; // ribbing band depth

  const nodes: React.ReactNode[] = [];

  // ── SLEEVES (drawn first — behind body) ────────────────────────────────────
  if (eff !== "none") {
    if (isRaglan) {
      // Pentagon: neck-attachment → outer-shoulder → wrist-top → wrist-bottom → underarm
      const ragShW = 38; // horizontal from neck to outer-shoulder
      const ragShD = 16; // vertical drop at outer-shoulder

      const lWristX  = x0 - slExtH;
      const lWristTY = shoulderY + slExtV;
      const lWristBY = shoulderY + slExtV + slWristW;
      const rWristX  = x1 + slExtH;

      nodes.push(
        <path key="ls" d={[
          `M ${neckL} ${shoulderY}`,
          `L ${neckL - ragShW} ${shoulderY + ragShD}`,
          `L ${lWristX} ${lWristTY}`,
          `L ${lWristX + slWristW} ${lWristBY}`,
          `L ${x0} ${underarmY} Z`,
        ].join(" ")} {...O} />,
        <path key="rs" d={[
          `M ${neckR} ${shoulderY}`,
          `L ${neckR + ragShW} ${shoulderY + ragShD}`,
          `L ${rWristX} ${lWristTY}`,
          `L ${rWristX - slWristW} ${lWristBY}`,
          `L ${x1} ${underarmY} Z`,
        ].join(" ")} {...O} />,
      );

      if (cuff === "Ribbed") {
        nodes.push(
          <rect key="lcb" x={lWristX} y={lWristTY} width={ribH} height={slWristW}
            fill="white" stroke={LINE} strokeWidth={1} />,
          <rect key="rcb" x={rWristX - ribH} y={lWristTY} width={ribH} height={slWristW}
            fill="white" stroke={LINE} strokeWidth={1} />,
          <line key="lc1" x1={lWristX + 5} y1={lWristTY} x2={lWristX + 5} y2={lWristBY} {...D} />,
          <line key="lc2" x1={lWristX + 10} y1={lWristTY} x2={lWristX + 10} y2={lWristBY} {...D} />,
          <line key="rc1" x1={rWristX - 5} y1={lWristTY} x2={rWristX - 5} y2={lWristBY} {...D} />,
          <line key="rc2" x1={rWristX - 10} y1={lWristTY} x2={rWristX - 10} y2={lWristBY} {...D} />,
        );
      }
    } else {
      // Trapezoid sleeve
      const lWristX  = x0 - slExtH;
      const lWristTY = shoulderY + slExtV;
      const lWristBY = shoulderY + slExtV + slWristW;
      const rWristX  = x1 + slExtH;

      nodes.push(
        <path key="ls" d={[
          `M ${x0} ${shoulderY}`,
          `L ${x0} ${shoulderY + slTopW}`,
          `L ${lWristX + slWristW} ${lWristBY}`,
          `L ${lWristX} ${lWristTY} Z`,
        ].join(" ")} {...O} />,
        <path key="rs" d={[
          `M ${x1} ${shoulderY}`,
          `L ${x1} ${shoulderY + slTopW}`,
          `L ${rWristX - slWristW} ${lWristBY}`,
          `L ${rWristX} ${lWristTY} Z`,
        ].join(" ")} {...O} />,
      );

      if (cuff === "Ribbed") {
        nodes.push(
          <rect key="lcb" x={lWristX} y={lWristTY} width={ribH} height={slWristW}
            fill="white" stroke={LINE} strokeWidth={1} />,
          <rect key="rcb" x={rWristX - ribH} y={lWristTY} width={ribH} height={slWristW}
            fill="white" stroke={LINE} strokeWidth={1} />,
          <line key="lc1" x1={lWristX + 5} y1={lWristTY} x2={lWristX + 5} y2={lWristBY} {...D} />,
          <line key="lc2" x1={lWristX + 10} y1={lWristTY} x2={lWristX + 10} y2={lWristBY} {...D} />,
          <line key="rc1" x1={rWristX - 5} y1={lWristTY} x2={rWristX - 5} y2={lWristBY} {...D} />,
          <line key="rc2" x1={rWristX - 10} y1={lWristTY} x2={rWristX - 10} y2={lWristBY} {...D} />,
        );
      }
    }
  }

  // Slipover shoulder straps (when no sleeves)
  if (sleeveMode === "none") {
    const sw = 18;
    const strapY = shoulderY - 22;
    nodes.push(
      <rect key="lstr" x={x0 + 16} y={strapY} width={sw} height={22} {...O} />,
      <rect key="rstr" x={x1 - 16 - sw} y={strapY} width={sw} height={22} {...O} />,
    );
  }

  // ── BODY ──────────────────────────────────────────────────────────────────
  let bodyD: string;

  if (isRaglan) {
    // Hexagonal: diagonal shoulders between underarm and neck edge
    bodyD = [
      `M ${x0} ${underarmY}`,
      `L ${neckL} ${shoulderY}`,
      neckSeg,
      `L ${x1} ${underarmY}`,
      `L ${x1} ${hemY}`,
      `L ${x0} ${hemY} Z`,
    ].join(" ");
  } else if (fit === "Fitted") {
    // Tapered waist
    const waistY = shoulderY + (hemY - shoulderY) * 0.48;
    const wi = 8;
    bodyD = [
      `M ${x0} ${shoulderY}`,
      `L ${neckL} ${shoulderY}`,
      neckSeg,
      `L ${x1} ${shoulderY}`,
      `L ${x1 - wi} ${waistY}`,
      `L ${x1} ${hemY}`,
      `L ${x0} ${hemY}`,
      `L ${x0 + wi} ${waistY} Z`,
    ].join(" ");
  } else {
    // Standard rectangle
    bodyD = [
      `M ${x0} ${shoulderY}`,
      `L ${neckL} ${shoulderY}`,
      neckSeg,
      `L ${x1} ${shoulderY}`,
      `L ${x1} ${hemY}`,
      `L ${x0} ${hemY} Z`,
    ].join(" ");
  }

  nodes.push(<path key="body" d={bodyD} {...O} />);

  if (collarD) {
    nodes.push(<path key="collar" d={collarD} {...O} />);
  }

  // ── SEAM INDICATORS ────────────────────────────────────────────────────────
  if (eff !== "none") {
    if (isRaglan) {
      nodes.push(
        <line key="sl" x1={neckL} y1={shoulderY} x2={x0} y2={underarmY} {...S} />,
        <line key="sr" x1={neckR} y1={shoulderY} x2={x1} y2={underarmY} {...S} />,
      );
    } else if (isDrop) {
      nodes.push(
        <line key="sl" x1={x0} y1={shoulderY} x2={x0} y2={shoulderY + 30} {...S} />,
        <line key="sr" x1={x1} y1={shoulderY} x2={x1} y2={shoulderY + 30} {...S} />,
      );
    }
  }

  // ── HEM ───────────────────────────────────────────────────────────────────
  if (hem === "Ribbed") {
    const bandY = hemY - ribH;
    nodes.push(
      <rect key="hem" x={x0} y={bandY} width={x1 - x0} height={ribH}
        fill="white" stroke={LINE} strokeWidth={1} />,
    );
    for (let i = 1; i * 6 < (x1 - x0); i++) {
      nodes.push(
        <line key={`h${i}`} x1={x0 + i * 6} y1={bandY} x2={x0 + i * 6} y2={hemY} {...D} />,
      );
    }
  }

  return <>{nodes}</>;
}

// ── Beanie (viewBox "0 0 200 250") ────────────────────────────────────────────

function BeanieSVG({ styleConfig }: { styleConfig: StyleConfig }) {
  const crown = styleConfig.crownShape ?? "";
  const brim  = styleConfig.brim ?? "";
  const nodes: React.ReactNode[] = [];

  if (crown === "Slouchy") {
    nodes.push(<path key="dome" d="M 35 160 Q 30 40 100 38 Q 170 40 165 160" {...D} />);
  } else if (crown === "Pointy") {
    nodes.push(<path key="dome" d="M 40 160 L 100 42 L 160 160" {...D} />);
  } else if (crown === "Flat") {
    nodes.push(
      <path key="dome" d="M 40 160 Q 38 95 100 90 Q 162 95 160 160" {...D} />,
      <line key="top" x1={70} y1={90} x2={130} y2={90} {...D} />,
    );
  } else {
    nodes.push(<path key="dome" d="M 40 160 Q 40 60 100 55 Q 160 60 160 160" {...D} />);
  }

  const hasBrim = brim !== "No brim" && brim !== "";
  const brimH   = brim === "Wide ribbed" ? 28 : brim === "Folded" ? 22 : 16;
  if (hasBrim) {
    nodes.push(<rect key="brim" x={38} y={160} width={124} height={brimH} {...O} />);
    if (brim === "Short ribbed" || brim === "Wide ribbed") {
      const r1 = 160 + Math.round(brimH / 3);
      const r2 = 160 + Math.round((brimH * 2) / 3);
      nodes.push(
        <line key="r1" x1={38} y1={r1} x2={162} y2={r1} {...D} />,
        <line key="r2" x1={38} y1={r2} x2={162} y2={r2} {...D} />,
      );
    } else if (brim === "Folded") {
      nodes.push(<line key="fold" x1={38} y1={160 + Math.round(brimH / 2)} x2={162} y2={160 + Math.round(brimH / 2)} {...D} />);
    }
  }

  return <>{nodes}</>;
}

// ── Scarf (viewBox "0 0 200 250") ─────────────────────────────────────────────

function ScarfSVG({ styleConfig }: { styleConfig: StyleConfig }) {
  const width = styleConfig.width ?? "";
  let w = 36;
  if (width === "Narrow") w = 22;
  else if (width === "Wide") w = 50;
  else if (width === "Shawl") w = 70;
  const sx0 = 100 - w / 2, sx1 = 100 + w / 2;
  return (
    <>
      <rect x={sx0} y={20} width={w} height={190} {...O} />
      <path d={`M ${sx0} ${200} Q 100 215 ${sx1} ${205}`} {...D} />
    </>
  );
}

// ── Gloves (viewBox "0 0 200 250") ────────────────────────────────────────────

function GlovesSVG() {
  return (
    <>
      <rect x={70}  y={140} width={60} height={50} {...O} />
      <rect x={68}  y={90}  width={64} height={52} {...O} />
      <rect x={68}  y={52}  width={13} height={40} {...O} />
      <rect x={83}  y={46}  width={13} height={46} {...O} />
      <rect x={98}  y={48}  width={13} height={44} {...O} />
      <rect x={113} y={54}  width={13} height={38} {...O} />
      <path d="M 68 110 L 50 100 L 48 120 L 68 124" {...O} />
    </>
  );
}

// ── Mittens (viewBox "0 0 200 250") ───────────────────────────────────────────

function MittensSVG() {
  return (
    <>
      <path d="M 55 200 L 55 100 Q 55 58 100 55 Q 145 58 145 100 L 145 200 Z" {...O} />
      <path d="M 145 115 Q 162 112 163 98 Q 163 82 152 80 L 145 84" {...O} />
      <line x1={55} y1={190} x2={145} y2={190} {...D} />
      <line x1={55} y1={200} x2={145} y2={200} {...D} />
    </>
  );
}

// ── Hood (viewBox "0 0 200 250") ──────────────────────────────────────────────

function HoodSVG({ styleConfig }: { styleConfig: StyleConfig }) {
  const type    = styleConfig.type    ?? "";
  const closure = styleConfig.closure ?? "";
  const nodes: React.ReactNode[] = [];

  if (type === "Gnome") {
    nodes.push(
      <path key="o" d="M 60 200 L 100 30 L 140 200 Z" {...O} />,
      <path key="f" d="M 72 170 Q 100 155 128 170" {...D} />,
    );
  } else if (type === "Cowl") {
    nodes.push(
      <path key="o" d="M 40 200 Q 38 80 100 70 Q 162 80 160 200" {...O} />,
      <path key="f" d="M 55 200 Q 55 110 100 100 Q 145 110 145 200" {...D} />,
    );
  } else if (type === "Oversized") {
    nodes.push(
      <path key="o" d="M 30 200 Q 28 60 100 50 Q 172 60 170 200" {...O} />,
      <path key="f" d="M 55 200 Q 55 100 100 90 Q 145 100 145 200" {...D} />,
    );
  } else {
    nodes.push(
      <path key="o" d="M 40 200 Q 40 70 100 62 Q 160 70 160 200" {...O} />,
      <path key="f" d="M 60 200 Q 60 108 100 100 Q 140 108 140 200" {...D} />,
    );
  }

  if (closure === "Drawstring") {
    nodes.push(
      <path   key="ds"  d="M 90 62 Q 100 55 110 62" {...D} />,
      <circle key="dsl" cx={90}  cy={62} r={3} {...O} />,
      <circle key="dsr" cx={110} cy={62} r={3} {...O} />,
    );
  }

  return <>{nodes}</>;
}

// ── Main component ────────────────────────────────────────────────────────────

interface GarmentMockupProps {
  itemType: ItemType;
  styleConfig: StyleConfig;
  className?: string;
}

export default function GarmentMockup({ itemType, styleConfig, className }: GarmentMockupProps) {
  const isEmpty = Object.values(styleConfig).filter(Boolean).length === 0;

  const isSweaterShape =
    itemType === "sweater" || itemType === "slipover" || itemType === "t-shirt";

  const viewBox = isSweaterShape ? "0 0 360 260" : "0 0 200 250";

  function renderContent() {
    switch (itemType) {
      case "sweater":  return <SweaterSVG styleConfig={styleConfig} sleeveMode="full" />;
      case "slipover": return <SweaterSVG styleConfig={styleConfig} sleeveMode="none" />;
      case "t-shirt":  return <SweaterSVG styleConfig={styleConfig} sleeveMode="short" />;
      case "beanie":   return <BeanieSVG  styleConfig={styleConfig} />;
      case "scarf":    return <ScarfSVG   styleConfig={styleConfig} />;
      case "gloves":   return <GlovesSVG />;
      case "mittens":  return <MittensSVG />;
      case "hood":     return <HoodSVG    styleConfig={styleConfig} />;
      default:         return null;
    }
  }

  return (
    <svg
      viewBox={viewBox}
      className={`w-full max-w-[380px] ${className ?? ""}`}
      style={{ opacity: isEmpty ? 0.3 : 1 }}
      aria-hidden="true"
    >
      {renderContent()}
    </svg>
  );
}
