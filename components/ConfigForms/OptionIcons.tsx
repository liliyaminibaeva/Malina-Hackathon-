import type { JSX } from "react";

interface IconProps {
  selected?: boolean;
}

type IconComponent = (props: IconProps) => JSX.Element;

// ── Construction ──────────────────────────────────────────────────────────────

function RaglanIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 160 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M50 110 V60 L65 25 H95 L110 60 V110 Z" />
      <path fill="none" stroke={line} strokeWidth="1" d="M65 25 Q80 35 95 25" />
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M65 25 L10 65 L25 75 L50 60" />
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M95 25 L150 65 L135 75 L110 60" />
      <line stroke="#ff6b6b" strokeWidth="1.4" x1="65" y1="25" x2="50" y2="60" />
      <line stroke="#ff6b6b" strokeWidth="1.4" x1="95" y1="25" x2="110" y2="60" />
    </svg>
  );
}

function DroppedShoulderIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 160 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M50 110 V30 L65 25 H95 L110 30 V110 Z" />
      <path fill="none" stroke={line} strokeWidth="1" d="M65 25 Q80 35 95 25" />
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M50 30 L10 65 L25 75 L50 60" />
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M110 30 L150 65 L135 75 L110 60" />
      <line stroke="#ff6b6b" strokeWidth="1.4" x1="50" y1="30" x2="50" y2="60" />
      <line stroke="#ff6b6b" strokeWidth="1.4" x1="110" y1="30" x2="110" y2="60" />
    </svg>
  );
}

function SetInSleeveIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 160 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M50 110 V60 C55 60, 65 55, 65 25 H95 C95 55, 105 60, 110 60 V110 Z" />
      <path fill="none" stroke={line} strokeWidth="1" d="M65 25 Q80 35 95 25" />
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M65 25 L10 65 L25 75 L50 60" />
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M95 25 L150 65 L135 75 L110 60" />
      <path fill="none" stroke="#ff6b6b" strokeWidth="1.4" d="M65 25 C65 55, 55 60, 50 60" />
      <path fill="none" stroke="#ff6b6b" strokeWidth="1.4" d="M95 25 C95 55, 105 60, 110 60" />
    </svg>
  );
}

// ── Fit ───────────────────────────────────────────────────────────────────────

function OversizedIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M35 10 H125 V90 H35 Z" />
    </svg>
  );
}

function RelaxedIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M45 10 H115 V90 H45 Z" />
    </svg>
  );
}

function ClassicIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M55 10 H105 V90 H55 Z" />
    </svg>
  );
}

function FittedIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M60 10 H100 L95 50 L100 90 H60 L65 50 Z" />
    </svg>
  );
}

// ── Neckline ──────────────────────────────────────────────────────────────────

function CrewNeckIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 160 60" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M60 10 Q80 35 100 10" />
    </svg>
  );
}

function VNeckIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 160 60" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M60 10 L80 45 L100 10" />
    </svg>
  );
}

function TurtleneckIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 160 60" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" x="65" y="5" width="30" height="15" />
      <line stroke={line} strokeWidth="1.2" strokeLinecap="round" x1="60" y1="20" x2="100" y2="20" />
    </svg>
  );
}

function BoatNeckIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 160 60" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M55 15 Q80 22 105 15" />
    </svg>
  );
}

// ── Sleeve length ─────────────────────────────────────────────────────────────

function LongSleeveIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M30 20 L10 80 L25 85 L40 30" />
    </svg>
  );
}

function ThreeQuarterSleeveIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M30 20 L15 60 L30 65 L40 30" />
    </svg>
  );
}

function ShortSleeveIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill={fill} stroke={line} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" d="M30 20 L22 40 L35 45 L40 30" />
    </svg>
  );
}

function SleevelessIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <circle cx="50" cy="40" r="15" fill={fill} stroke={line} strokeWidth="1.2" strokeDasharray="4" />
    </svg>
  );
}

// ── Cuff / Hem ────────────────────────────────────────────────────────────────

function RibbedIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 100 40" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect fill={fill} stroke={line} strokeWidth="1.2" x="10" y="10" width="80" height="20" />
      <path fill="none" stroke={line} strokeWidth="1" d="M20 10 V30 M30 10 V30 M40 10 V30 M50 10 V30 M60 10 V30 M70 10 V30 M80 10 V30" />
    </svg>
  );
}

function StraightIcon({ selected }: IconProps) {
  const line = selected ? "white" : "#1a1a1a";
  const fill = selected ? "#1A1814" : "white";
  return (
    <svg viewBox="0 0 100 40" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect fill={fill} stroke={line} strokeWidth="1.2" x="10" y="10" width="80" height="20" />
    </svg>
  );
}

// ── Map ───────────────────────────────────────────────────────────────────────

export const OPTION_ICONS: Record<string, Record<string, IconComponent>> = {
  construction: {
    "Raglan": RaglanIcon,
    "Dropped shoulder": DroppedShoulderIcon,
    "Set-in sleeve": SetInSleeveIcon,
  },
  fit: {
    "Oversized": OversizedIcon,
    "Relaxed": RelaxedIcon,
    "Classic": ClassicIcon,
    "Fitted": FittedIcon,
  },
  neckline: {
    "Crew neck": CrewNeckIcon,
    "V-neck": VNeckIcon,
    "Turtleneck": TurtleneckIcon,
    "Boat neck": BoatNeckIcon,
  },
  sleeveLength: {
    "Long": LongSleeveIcon,
    "3/4": ThreeQuarterSleeveIcon,
    "Short": ShortSleeveIcon,
    "Sleeveless": SleevelessIcon,
  },
  cuff: {
    "Ribbed": RibbedIcon,
    "Straight": StraightIcon,
  },
  hem: {
    "Ribbed": RibbedIcon,
    "Straight": StraightIcon,
  },
};
