"use client";

import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import type { ItemType } from "@/lib/store";

interface ItemCard {
  id: ItemType;
  label: string;
  icon: string;
}

const TOPS: ItemCard[] = [
  { id: "sweater", label: "Sweater", icon: "🧥" },
  { id: "slipover", label: "Slipover", icon: "🔷" },
  { id: "t-shirt", label: "T-shirt", icon: "👕" },
];

const ACCESSORIES: ItemCard[] = [
  { id: "beanie", label: "Beanie", icon: "🧢" },
  { id: "gloves", label: "Gloves", icon: "🧤" },
  { id: "scarf", label: "Scarf", icon: "🧣" },
  { id: "mittens", label: "Mittens", icon: "🫱" },
  { id: "hood", label: "Hood", icon: "🪡" },
];

const BOTTOMS_COMING_SOON = [
  { label: "Socks", icon: "🧦" },
  { label: "Pants", icon: "👖" },
  { label: "Shorts", icon: "🩳" },
];

function Card({
  label,
  icon,
  onClick,
  disabled = false,
}: {
  label: string;
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "relative flex flex-col items-center justify-center gap-2 rounded-xl border p-5 text-center transition-all",
        disabled
          ? "cursor-not-allowed border-stone-200 bg-stone-50 opacity-50"
          : "cursor-pointer border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm active:scale-95",
      ].join(" ")}
    >
      <span className="text-3xl" role="img" aria-label={label}>
        {icon}
      </span>
      <span className="text-sm font-medium text-stone-700">{label}</span>
      {disabled && (
        <span className="absolute -top-2 right-2 rounded-full bg-stone-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          Soon
        </span>
      )}
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
        {title}
      </h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
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
          <Card
            key={item.id}
            label={item.label}
            icon={item.icon}
            onClick={() => handleSelect(item.id)}
          />
        ))}
      </Section>

      <Section title="Accessories">
        {ACCESSORIES.map((item) => (
          <Card
            key={item.id}
            label={item.label}
            icon={item.icon}
            onClick={() => handleSelect(item.id)}
          />
        ))}
      </Section>

      <Section title="Bottoms">
        {BOTTOMS_COMING_SOON.map((item) => (
          <Card key={item.label} label={item.label} icon={item.icon} disabled />
        ))}
      </Section>
    </div>
  );
}
