interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

const BASE = {
  stroke: "#1A1814",
  fill: "white",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const IMG_FILTER = "contrast(12) brightness(0.92)";

// Renders an image scaled up inside a clipping container so the icon fills the space
// despite padding in the source image. scale > 1 zooms in.
function ImgIcon({ src, alt, width, height, className, scale = 1, filter }: {
  src: string; alt: string; width: number; height: number;
  className?: string; scale?: number; filter?: string;
}) {
  return (
    <div className={className} style={{ width, height, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ width: `${scale * 100}%`, height: `${scale * 100}%`, objectFit: "contain", filter }} />
    </div>
  );
}

export function SweaterIcon({ width = 48, height = 56, className }: IconProps) {
  return <ImgIcon src="/sweater.png" alt="Sweater" width={width} height={height} className={className} />;
}

export function SlipoverIcon({ width = 48, height = 56, className }: IconProps) {
  return <ImgIcon src="/slipover.png" alt="Slipover" width={width} height={height} className={className} />;
}

export function TshirtIcon({ width = 48, height = 56, className }: IconProps) {
  return <ImgIcon src="/tshirt.png" alt="T-shirt" width={width} height={height} className={className} />;
}

export function BeanieIcon({ width = 48, height = 56, className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={width} height={height} className={className} {...BASE}>
      {/* Pom-pom */}
      <circle cx="32" cy="8" r="6" />
      {/* Dome + band outline */}
      <path d="M 8 56 L 8 46 Q 6 20 32 14 Q 58 20 56 46 L 56 56 Z" />
      {/* Band ribbing */}
      <line x1="8" y1="51" x2="56" y2="51" />
    </svg>
  );
}

export function GlovesIcon({ width = 48, height = 56, className }: IconProps) {
  return <ImgIcon src="/gloves.png" alt="Gloves" width={width} height={height} className={className} filter={IMG_FILTER} />;
}

export function ScarfIcon({ width = 48, height = 56, className }: IconProps) {
  return <ImgIcon src="/scarf.png" alt="Scarf" width={width} height={height} className={className} filter={IMG_FILTER} />;
}

export function MittensIcon({ width = 48, height = 56, className }: IconProps) {
  return <ImgIcon src="/mittens.png" alt="Mittens" width={width} height={height} className={className} filter={IMG_FILTER} />;
}

export function HoodIcon({ width = 48, height = 56, className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={width} height={height} className={className} {...BASE}>
      {/* Hood outer edge */}
      <path d="M 8 62 L 8 30 Q 8 4 32 4 Q 56 4 56 30 L 56 62" />
      {/* Face opening */}
      <path d="M 20 58 L 18 34 Q 18 16 32 16 Q 46 16 46 34 L 44 58" />
      {/* Bottom edges connecting outer to inner */}
      <line x1="8" y1="62" x2="20" y2="58" />
      <line x1="44" y1="58" x2="56" y2="62" />
      {/* Face opening bottom curve */}
      <path d="M 20 58 Q 32 60 44 58" />
    </svg>
  );
}
