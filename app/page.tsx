import { ItemPicker } from "@/components/ItemPicker";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-lg px-8 py-14 bg-[#F9F5EF]">
      <header className="mb-16">
        <div className="flex items-baseline justify-between border-b border-t border-[#CCC4B8] py-3">
          <span className="text-xs font-medium uppercase tracking-[0.28em] text-[#1A1814]">Malina</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A9088]">Pattern Generator</span>
        </div>
      </header>
      <h1 className="font-serif mb-14 text-5xl font-light italic leading-[1.15] text-[#1A1814]">
        What shall<br />we make?
      </h1>
      <ItemPicker />
    </main>
  );
}
