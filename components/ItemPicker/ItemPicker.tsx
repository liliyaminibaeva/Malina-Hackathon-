"use client";

import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import type { ItemType } from "@/lib/store";

interface Item {
  id: ItemType;
  label: string;
}

const TOPS: Item[] = [
  { id: "sweater", label: "Sweater" },
  { id: "slipover", label: "Slipover" },
  { id: "t-shirt", label: "T-shirt" },
];

const ACCESSORIES: Item[] = [
  { id: "beanie", label: "Beanie" },
  { id: "gloves", label: "Gloves" },
  { id: "scarf", label: "Scarf" },
  { id: "minnens", label: "Mittens" },
  { id: "hood", label: "Hood" },
];

const BOTTOMS_COMING_SOON = ["Socks", "Pants", "Shorts"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400">
        {title}
      </p>
      <div className="divide-y divide-stone-100 border-t border-stone-100">
        {children}
      </div>
    </section>
  );
}

export default function ItemPicker() {
  const router = useRouter();
  const { setItemType } = usePatternForm();

  function handleSelect(id: ItemType) {
    setItemType(id);
    router.push("/configure");
  }

  return (
    <div className="space-y-10">
      <Section title="Tops">
        {TOPS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className="flex w-full items-center justify-between py-3.5 text-left text-base text-stone-800 transition-colors hover:text-stone-500"
          >
            {item.label}
            <span className="text-stone-300">→</span>
          </button>
        ))}
      </Section>

      <Section title="Accessories">
        {ACCESSORIES.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className="flex w-full items-center justify-between py-3.5 text-left text-base text-stone-800 transition-colors hover:text-stone-500"
          >
            {item.label}
            <span className="text-stone-300">→</span>
          </button>
        ))}
      </Section>

      <Section title="Bottoms">
        {BOTTOMS_COMING_SOON.map((label) => (
          <div
            key={label}
            className="flex w-full items-center justify-between py-3.5 text-base text-stone-300"
          >
            {label}
            <span className="text-[11px] uppercase tracking-widest text-stone-300">
              Soon
            </span>
          </div>
        ))}
      </Section>
    </div>
  );
}
