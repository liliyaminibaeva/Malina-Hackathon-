import { ItemPicker } from "@/components/ItemPicker";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-xl px-8 py-16">
      <header className="mb-12">
        <div className="flex items-baseline justify-between border-b border-t border-[#DDD8CF] py-3">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#1A1814]">Malina</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068]">Pattern Generator</span>
        </div>
      </header>
      <h1 className="font-serif mb-10 text-4xl font-light leading-snug text-[#1A1814]">
        Select a pattern
      </h1>
      <ItemPicker />
    </main>
  );
}
