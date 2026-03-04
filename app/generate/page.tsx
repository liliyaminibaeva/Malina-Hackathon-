"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import { PatternPreview } from "@/components/PatternPreview";
import { StepIndicator } from "@/components/StepIndicator";

export default function GeneratePage() {
  const router = useRouter();
  const { itemType, styleConfig, yarnConfig } = usePatternForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pattern, setPattern] = useState<string | null>(null);

  useEffect(() => {
    if (!yarnConfig) {
      router.replace("/yarn");
    }
  }, [yarnConfig, router]);

  if (!yarnConfig) return null;

  async function onGenerate() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate-pattern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, styleConfig, yarnConfig }),
      });
      if (!res.ok) throw new Error("Pattern generation failed. Please try again.");
      const result = await res.json();
      if (typeof result.pattern === "string") {
        setPattern(result.pattern);
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-8 py-16">
      <header className="mb-10">
        <div className="flex items-baseline justify-between border-b border-t border-[#DDD8CF] py-3">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#1A1814]">Malina</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068]">Pattern Generator</span>
        </div>
      </header>

      {!pattern && <StepIndicator current={4} />}

      {!pattern ? (
        <>
          <Link
            href="/yarn"
            className="text-[10px] uppercase tracking-[0.12em] text-[#7A7068] hover:text-[#1A1814] transition-colors mb-8 inline-block no-print"
          >
            ← Back
          </Link>

          <h1 className="font-serif text-4xl font-light mb-3 text-[#1A1814]">Generate pattern</h1>
          <p className="text-sm text-[#7A7068] mb-10">Your custom knitting pattern, ready to print.</p>

          {error && (
            <div className="border-l-2 border-red-400 pl-3 py-2 text-sm text-red-600 mb-6">{error}</div>
          )}

          <button
            onClick={onGenerate}
            disabled={loading}
            className="w-full bg-[#1A1814] text-white px-8 py-3.5 text-xs font-medium uppercase tracking-[0.1em] transition-opacity hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "Generating…" : "Generate pattern"}
          </button>
        </>
      ) : (
        <>
          <h1 className="font-serif text-4xl font-light mb-3 text-[#1A1814] print:text-black">
            Your knitting pattern
          </h1>
          <p className="text-sm text-[#7A7068] mb-10 no-print">
            Your pattern is ready. Print or save it as a PDF to keep it.
          </p>
          <PatternPreview patternText={pattern} />
        </>
      )}
    </main>
  );
}
