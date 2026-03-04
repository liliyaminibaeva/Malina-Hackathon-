"use client";

import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import type { ItemType } from "@/lib/store";
import {
  SweaterIcon,
  SlipoverIcon,
  TshirtIcon,
  BeanieIcon,
  GlovesIcon,
  ScarfIcon,
  MittensIcon,
  HoodIcon,
} from "@/components/ItemIcons";

interface Item {
  id: ItemType;
  label: string;
  Icon: React.ComponentType<{ width?: number; height?: number; className?: string }>;
}

const TOPS: Item[] = [
  { id: "sweater", label: "Sweater", Icon: SweaterIcon },
  { id: "slipover", label: "Slipover", Icon: SlipoverIcon },
  { id: "t-shirt", label: "T-shirt", Icon: TshirtIcon },
];

const ACCESSORIES: Item[] = [
  { id: "beanie", label: "Beanie", Icon: BeanieIcon },
  { id: "gloves", label: "Gloves", Icon: GlovesIcon },
  { id: "scarf", label: "Scarf", Icon: ScarfIcon },
  { id: "minnens", label: "Mittens", Icon: MittensIcon },
  { id: "hood", label: "Hood", Icon: HoodIcon },
];

const BOTTOMS_COMING_SOON = ["Socks", "Pants", "Shorts"];

export default function ItemPicker() {
  const router = useRouter();
  const { setItemType } = usePatternForm();

  function handleSelect(id: ItemType) {
    setItemType(id);
    router.push("/configure");
  }

  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#7A7068] mt-8 mb-2">
        Tops
      </p>
      {TOPS.map((item) => (
        <button
          key={item.id}
          onClick={() => handleSelect(item.id)}
          className="flex w-full items-center gap-5 py-4 border-b border-[#DDD8CF] hover:bg-[#F3EEE5] transition-colors cursor-pointer text-left"
        >
          <item.Icon width={40} height={48} className="text-[#1A1814] opacity-80 flex-shrink-0" />
          <span className="text-base text-[#1A1814] tracking-wide">{item.label}</span>
          <span className="text-[#7A7068] ml-auto">›</span>
        </button>
      ))}

      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#7A7068] mt-8 mb-2">
        Accessories
      </p>
      {ACCESSORIES.map((item) => (
        <button
          key={item.id}
          onClick={() => handleSelect(item.id)}
          className="flex w-full items-center gap-5 py-4 border-b border-[#DDD8CF] hover:bg-[#F3EEE5] transition-colors cursor-pointer text-left"
        >
          <item.Icon width={40} height={48} className="text-[#1A1814] opacity-80 flex-shrink-0" />
          <span className="text-base text-[#1A1814] tracking-wide">{item.label}</span>
          <span className="text-[#7A7068] ml-auto">›</span>
        </button>
      ))}

      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#7A7068] mt-8 mb-2">
        Bottoms
      </p>
      {BOTTOMS_COMING_SOON.map((label) => (
        <div
          key={label}
          className="flex w-full items-center gap-5 py-4 border-b border-[#DDD8CF] opacity-40 cursor-not-allowed"
        >
          <span className="w-10 h-12 flex-shrink-0" />
          <span className="text-base text-[#1A1814] tracking-wide">{label}</span>
          <span className="ml-auto text-[9px] uppercase tracking-[0.15em] text-[#7A7068]">Coming soon</span>
        </div>
      ))}
    </div>
  );
}
