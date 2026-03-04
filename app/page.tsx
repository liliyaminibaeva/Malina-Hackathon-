import { ItemPicker } from "@/components/ItemPicker";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-lg px-6 py-20">
      <div className="mb-16">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400">
          Malina
        </p>
        <h1 className="mb-3 text-[2rem] font-light leading-tight tracking-tight text-stone-900">
          What would you like to knit?
        </h1>
        <p className="text-sm text-stone-400">
          Select an item to generate a custom PetiteKnit-style pattern.
        </p>
      </div>
      <ItemPicker />
    </main>
  );
}
