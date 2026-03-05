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

const TOPS_COMING_SOON = ["Cardigan"];

const ACCESSORIES: Item[] = [
  { id: "beanie", label: "Beanie", Icon: BeanieIcon },
  { id: "gloves", label: "Gloves", Icon: GlovesIcon },
  { id: "scarf", label: "Scarf", Icon: ScarfIcon },
  { id: "mittens", label: "Mittens", Icon: MittensIcon },
];

const ACCESSORIES_COMING_SOON = ["Hood"];

const BOTTOMS_COMING_SOON = ["Socks", "Pants", "Shorts"];

function ComingSoonRow({ label }: { label: string }) {
  return (
    <div className="flex w-full items-center gap-5 py-4 border-b border-[#DDD8CF] opacity-30 cursor-not-allowed">
      <span className="w-10 h-12 flex-shrink-0 rounded bg-[#E0D9CE]" />
      <span className="font-serif text-xl text-[#1A1814] tracking-wide">{label}</span>
      <span className="ml-auto text-[9px] uppercase tracking-[0.18em] text-[#7A7068]">Soon</span>
    </div>
  );
}

function CategoryLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#9A9088] mt-8 mb-1">
      — {children}
    </p>
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
    <div>
      <CategoryLabel>Tops</CategoryLabel>
      {TOPS.map((item) => (
        <button
          key={item.id}
          onClick={() => handleSelect(item.id)}
          className="flex w-full items-center gap-5 py-4 border-b border-[#DDD8CF] hover:bg-[#F0EAE0] transition-colors cursor-pointer text-left group"
        >
          <item.Icon width={40} height={48} className="flex-shrink-0 opacity-75 group-hover:opacity-100 transition-opacity" />
          <span className="font-serif text-xl text-[#1A1814] tracking-wide">{item.label}</span>
          <span className="ml-auto text-[#B0A898] text-lg">›</span>
        </button>
      ))}
      {TOPS_COMING_SOON.map((label) => (
        <ComingSoonRow key={label} label={label} />
      ))}

      <CategoryLabel>Accessories</CategoryLabel>
      {ACCESSORIES.map((item) => (
        <button
          key={item.id}
          onClick={() => handleSelect(item.id)}
          className="flex w-full items-center gap-5 py-4 border-b border-[#DDD8CF] hover:bg-[#F0EAE0] transition-colors cursor-pointer text-left group"
        >
          <item.Icon width={40} height={48} className="flex-shrink-0 opacity-75 group-hover:opacity-100 transition-opacity" />
          <span className="font-serif text-xl text-[#1A1814] tracking-wide">{item.label}</span>
          <span className="ml-auto text-[#B0A898] text-lg">›</span>
        </button>
      ))}
      {ACCESSORIES_COMING_SOON.map((label) => (
        <ComingSoonRow key={label} label={label} />
      ))}

      <CategoryLabel>Bottoms</CategoryLabel>
      {BOTTOMS_COMING_SOON.map((label) => (
        <ComingSoonRow key={label} label={label} />
      ))}
    </div>
  );
}
