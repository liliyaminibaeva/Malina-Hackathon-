"use client";

import {
  SweaterIcon, SlipoverIcon, TshirtIcon,
  BeanieIcon, GlovesIcon, ScarfIcon, MittensIcon,
} from "@/components/ItemIcons";

const TOPS = [
  { label: "Sweater", Icon: SweaterIcon },
  { label: "Slipover", Icon: SlipoverIcon },
  { label: "T-shirt", Icon: TshirtIcon },
  { label: "Cardigan", Icon: null },
];
const ACCESSORIES = [
  { label: "Beanie", Icon: BeanieIcon },
  { label: "Gloves", Icon: GlovesIcon },
  { label: "Scarf", Icon: ScarfIcon },
  { label: "Mittens", Icon: MittensIcon },
  { label: "Hood", Icon: null },
];

export default function Preview2() {
  return (
    <main className="min-h-screen bg-[#1A1814] text-[#F3EEE5]">
      <div className="mx-auto max-w-xl px-8 py-12">

        <header className="mb-12 flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#F3EEE5]">Malina</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068]">Pattern Generator</span>
        </header>

        <h1 className="font-[family-name:var(--font-cormorant)] text-6xl font-light leading-none text-[#F3EEE5] mb-3">
          Select
        </h1>
        <h1 className="font-[family-name:var(--font-cormorant)] text-6xl font-light leading-none text-[#C4856A] italic mb-12">
          a pattern.
        </h1>

        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#5A5450] mb-4">Tops</p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {TOPS.map(({ label, Icon }) => {
            const soon = !Icon;
            return (
              <button
                key={label}
                disabled={soon}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border py-6 px-4 transition-all text-center
                  ${soon
                    ? "border-[#2E2A27] opacity-30 cursor-not-allowed"
                    : "border-[#2E2A27] hover:border-[#C4856A] hover:bg-[#221E1A] cursor-pointer group"
                  }`}
              >
                {Icon
                  ? <Icon width={44} height={52} className="opacity-80 group-hover:opacity-100 transition-opacity" style={{ filter: "invert(1) sepia(0.2)" }} />
                  : <span className="w-11 h-14 rounded bg-[#2E2A27]" />
                }
                <span className="text-sm tracking-wide text-[#F3EEE5]">{label}</span>
                {soon && <span className="text-[9px] uppercase tracking-[0.15em] text-[#5A5450]">Soon</span>}
              </button>
            );
          })}
        </div>

        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#5A5450] mb-4">Accessories</p>
        <div className="grid grid-cols-2 gap-3">
          {ACCESSORIES.map(({ label, Icon }) => {
            const soon = !Icon;
            return (
              <button
                key={label}
                disabled={soon}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border py-6 px-4 transition-all text-center
                  ${soon
                    ? "border-[#2E2A27] opacity-30 cursor-not-allowed"
                    : "border-[#2E2A27] hover:border-[#C4856A] hover:bg-[#221E1A] cursor-pointer group"
                  }`}
              >
                {Icon
                  ? <Icon width={44} height={52} className="opacity-80 group-hover:opacity-100 transition-opacity" style={{ filter: "invert(1) sepia(0.2)" }} />
                  : <span className="w-11 h-14 rounded bg-[#2E2A27]" />
                }
                <span className="text-sm tracking-wide text-[#F3EEE5]">{label}</span>
                {soon && <span className="text-[9px] uppercase tracking-[0.15em] text-[#5A5450]">Soon</span>}
              </button>
            );
          })}
        </div>

      </div>
    </main>
  );
}
