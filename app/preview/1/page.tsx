"use client";

import {
  SweaterIcon, SlipoverIcon, TshirtIcon,
  BeanieIcon, GlovesIcon, ScarfIcon, MittensIcon,
} from "@/components/ItemIcons";

const TOPS = [
  { label: "Sweater", Icon: SweaterIcon },
  { label: "Slipover", Icon: SlipoverIcon },
  { label: "T-shirt", Icon: TshirtIcon },
];
const ACCESSORIES = [
  { label: "Beanie", Icon: BeanieIcon },
  { label: "Gloves", Icon: GlovesIcon },
  { label: "Scarf", Icon: ScarfIcon },
  { label: "Mittens", Icon: MittensIcon },
];
const SOON = ["Cardigan", "Hood", "Socks"];

function ComingSoonRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-5 py-4 border-b border-[#DDD8CF] opacity-30 cursor-not-allowed">
      <span className="w-10 h-12 flex-shrink-0 rounded bg-[#E0D9CE]" />
      <span className="font-[family-name:var(--font-cormorant)] text-xl text-[#1A1814] tracking-wide">{label}</span>
      <span className="ml-auto text-[9px] uppercase tracking-[0.18em] text-[#7A7068]">Soon</span>
    </div>
  );
}

export default function Preview1() {
  return (
    <main className="min-h-screen bg-[#F9F5EF]">
      <div className="mx-auto max-w-lg px-8 py-14">

        <header className="mb-16 flex items-baseline justify-between border-b border-t border-[#CCC4B8] py-3">
          <span className="text-xs font-medium uppercase tracking-[0.28em] text-[#1A1814]">Malina</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A9088]">Pattern Generator</span>
        </header>

        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-light italic leading-[1.15] text-[#1A1814] mb-14">
          What shall<br />we make?
        </h1>

        <section className="mb-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#9A9088] mb-1">— Tops</p>
          {TOPS.map(({ label, Icon }) => (
            <button key={label} className="flex w-full items-center gap-5 py-4 border-b border-[#DDD8CF] hover:bg-[#F0EAE0] transition-colors cursor-pointer text-left group">
              <Icon width={40} height={48} className="flex-shrink-0 opacity-75 group-hover:opacity-100 transition-opacity" />
              <span className="font-[family-name:var(--font-cormorant)] text-xl text-[#1A1814] tracking-wide">{label}</span>
              <span className="ml-auto text-[#B0A898] text-lg">›</span>
            </button>
          ))}
          <ComingSoonRow label="Cardigan" />
        </section>

        <section className="mt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#9A9088] mb-1">— Accessories</p>
          {ACCESSORIES.map(({ label, Icon }) => (
            <button key={label} className="flex w-full items-center gap-5 py-4 border-b border-[#DDD8CF] hover:bg-[#F0EAE0] transition-colors cursor-pointer text-left group">
              <Icon width={40} height={48} className="flex-shrink-0 opacity-75 group-hover:opacity-100 transition-opacity" />
              <span className="font-[family-name:var(--font-cormorant)] text-xl text-[#1A1814] tracking-wide">{label}</span>
              <span className="ml-auto text-[#B0A898] text-lg">›</span>
            </button>
          ))}
          <ComingSoonRow label="Hood" />
        </section>

        <section className="mt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#9A9088] mb-1">— Bottoms</p>
          {["Socks", "Pants", "Shorts"].map(label => <ComingSoonRow key={label} label={label} />)}
        </section>

      </div>
    </main>
  );
}
