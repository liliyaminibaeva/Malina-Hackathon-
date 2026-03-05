"use client";

import {
  SweaterIcon, SlipoverIcon, TshirtIcon,
  BeanieIcon, GlovesIcon, ScarfIcon, MittensIcon,
} from "@/components/ItemIcons";

const ITEMS = [
  { label: "Sweater", category: "Tops", Icon: SweaterIcon },
  { label: "Slipover", category: "Tops", Icon: SlipoverIcon },
  { label: "T-shirt", category: "Tops", Icon: TshirtIcon },
  { label: "Cardigan", category: "Tops", Icon: null },
  { label: "Beanie", category: "Accessories", Icon: BeanieIcon },
  { label: "Gloves", category: "Accessories", Icon: GlovesIcon },
  { label: "Scarf", category: "Accessories", Icon: ScarfIcon },
  { label: "Mittens", category: "Accessories", Icon: MittensIcon },
  { label: "Hood", category: "Accessories", Icon: null },
];

export default function Preview3() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-lg px-8 py-12">

        <header className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#7A8C72]" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1A1814]">Malina</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#AAAAAA]">Generator</span>
        </header>

        <div className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#7A8C72] font-medium mb-2">New pattern</p>
          <h1 className="text-4xl font-light text-[#1A1814] leading-snug">
            Choose your<br />
            <span className="font-semibold">item type.</span>
          </h1>
        </div>

        <div className="space-y-0">
          {ITEMS.map((item, i) => {
            const soon = !item.Icon;
            const num = String(i + 1).padStart(2, "0");
            const showCategoryLabel = i === 0 || item.category !== ITEMS[i - 1].category;

            return (
              <div key={item.label}>
                {showCategoryLabel && (
                  <div className="flex items-center gap-3 pt-6 pb-3">
                    <div className="w-1 h-4 bg-[#7A8C72] rounded-full" />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-[#AAAAAA]">{item.category}</span>
                  </div>
                )}
                <button
                  disabled={soon}
                  className={`flex w-full items-center gap-4 py-3 border-b border-[#F0F0F0] transition-colors text-left
                    ${soon ? "opacity-25 cursor-not-allowed" : "hover:bg-[#F8FAF8] cursor-pointer group"}`}
                >
                  <span className="text-xs text-[#CCCCCC] font-mono w-6 flex-shrink-0">{num}</span>
                  {item.Icon
                    ? <item.Icon width={36} height={44} className="flex-shrink-0" />
                    : <span className="w-9 h-11 flex-shrink-0 rounded bg-[#F0F0F0]" />
                  }
                  <span className="text-base font-medium text-[#1A1814] tracking-wide">{item.label}</span>
                  {soon
                    ? <span className="ml-auto text-[9px] uppercase tracking-[0.15em] text-[#CCCCCC]">Soon</span>
                    : <span className="ml-auto text-[#CCCCCC] group-hover:text-[#7A8C72] transition-colors">→</span>
                  }
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
