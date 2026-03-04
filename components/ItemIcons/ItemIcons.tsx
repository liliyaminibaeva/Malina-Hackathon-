interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

const BASE = { stroke: "#1A1814", fill: "none", strokeWidth: 1.2 };

export function SweaterIcon({ width = 48, height = 56, className }: IconProps) {
  return (
    <svg viewBox="0 0 60 70" width={width} height={height} className={className} {...BASE}>
      {/* Body */}
      <path d="M 10 20 L 10 60 L 50 60 L 50 20" />
      {/* Left shoulder + sleeve */}
      <path d="M 10 20 L 5 15 L 0 15 L 0 35 L 10 32" />
      {/* Right shoulder + sleeve */}
      <path d="M 50 20 L 55 15 L 60 15 L 60 35 L 50 32" />
      {/* Neck outer */}
      <path d="M 10 20 Q 30 15 50 20" />
      {/* Neck inner opening */}
      <path d="M 22 20 Q 30 14 38 20" />
    </svg>
  );
}

export function SlipoverIcon({ width = 48, height = 56, className }: IconProps) {
  return (
    <svg viewBox="0 0 60 70" width={width} height={height} className={className} {...BASE}>
      {/* Body */}
      <path d="M 10 25 L 10 60 L 50 60 L 50 25" />
      {/* Left strap */}
      <path d="M 10 25 L 13 15 L 21 15 L 22 25" />
      {/* Right strap */}
      <path d="M 50 25 L 47 15 L 39 15 L 38 25" />
      {/* Scoop neck */}
      <path d="M 21 15 Q 30 20 39 15" />
      {/* Armhole left */}
      <path d="M 10 25 Q 5 32 10 40" />
      {/* Armhole right */}
      <path d="M 50 25 Q 55 32 50 40" />
    </svg>
  );
}

export function TshirtIcon({ width = 48, height = 56, className }: IconProps) {
  return (
    <svg viewBox="0 0 60 70" width={width} height={height} className={className} {...BASE}>
      {/* Body */}
      <path d="M 10 20 L 10 60 L 50 60 L 50 20" />
      {/* Left short sleeve */}
      <path d="M 10 20 L 2 18 L 0 30 L 10 30" />
      {/* Right short sleeve */}
      <path d="M 50 20 L 58 18 L 60 30 L 50 30" />
      {/* Neck outer */}
      <path d="M 10 20 Q 30 15 50 20" />
      {/* Neck inner opening */}
      <path d="M 22 20 Q 30 14 38 20" />
    </svg>
  );
}

export function BeanieIcon({ width = 48, height = 56, className }: IconProps) {
  return (
    <svg viewBox="0 0 60 70" width={width} height={height} className={className} {...BASE}>
      {/* Dome */}
      <path d="M 5 45 Q 5 10 30 8 Q 55 10 55 45 Z" />
      {/* Brim */}
      <rect x="5" y="45" width="50" height="10" />
      {/* Brim ribbing lines */}
      <line x1="5" y1="50" x2="55" y2="50" />
    </svg>
  );
}

export function GlovesIcon({ width = 48, height = 56, className }: IconProps) {
  return (
    <svg viewBox="0 0 60 70" width={width} height={height} className={className} {...BASE}>
      {/* Wrist/cuff */}
      <rect x="15" y="45" width="24" height="15" />
      {/* Palm */}
      <path d="M 15 45 L 15 22 L 39 22 L 39 45" />
      {/* Index finger */}
      <path d="M 15 22 L 15 10 L 21 10 L 21 22" />
      {/* Middle finger */}
      <path d="M 21 22 L 21 8 L 27 8 L 27 22" />
      {/* Ring finger */}
      <path d="M 27 22 L 27 10 L 33 10 L 33 22" />
      {/* Pinky */}
      <path d="M 33 22 L 33 14 L 39 14 L 39 22" />
      {/* Thumb */}
      <path d="M 15 38 Q 5 36 5 28 Q 5 22 11 22 L 15 24" />
    </svg>
  );
}

export function ScarfIcon({ width = 48, height = 56, className }: IconProps) {
  return (
    <svg viewBox="0 0 60 70" width={width} height={height} className={className} {...BASE}>
      {/* Long narrow rectangle — scarf body */}
      <rect x="22" y="2" width="16" height="55" />
      {/* Fold/drape at bottom */}
      <path d="M 22 57 Q 14 62 16 68 L 38 68 Q 42 62 38 57" />
    </svg>
  );
}

export function MittensIcon({ width = 48, height = 56, className }: IconProps) {
  return (
    <svg viewBox="0 0 60 70" width={width} height={height} className={className} {...BASE}>
      {/* Mitten body */}
      <path d="M 15 60 L 15 20 Q 15 10 30 10 Q 45 10 45 20 L 45 60 Z" />
      {/* Thumb */}
      <path d="M 45 35 Q 58 35 58 28 Q 58 20 50 20 L 45 24" />
      {/* Cuff ribbing */}
      <line x1="15" y1="54" x2="45" y2="54" />
    </svg>
  );
}

export function HoodIcon({ width = 48, height = 56, className }: IconProps) {
  return (
    <svg viewBox="0 0 60 70" width={width} height={height} className={className} {...BASE}>
      {/* Hood outer shape — drapes from top down each side */}
      <path d="M 10 65 L 8 30 Q 8 5 30 5 Q 52 5 52 30 L 50 65" />
      {/* Face opening — inner oval */}
      <path d="M 20 60 L 18 34 Q 18 18 30 18 Q 42 18 42 34 L 40 60" />
      {/* Neck band at bottom */}
      <path d="M 10 65 Q 30 68 50 65" />
    </svg>
  );
}
