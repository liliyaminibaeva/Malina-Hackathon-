import { ItemPicker } from "@/components/ItemPicker";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-16">
      <div className="mb-12 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          What would you like to knit?
        </h1>
        <p className="text-stone-500">
          Choose an item type to get started with your custom pattern.
        </p>
      </div>
      <ItemPicker />
    </main>
  );
}
