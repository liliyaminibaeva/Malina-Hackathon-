"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import { PatternPreview } from "@/components/PatternPreview";
import { StepIndicator } from "@/components/StepIndicator";

type PatternResult = { sections?: { title: string; content: string }[]; raw?: string } | string;

export default function GeneratePage() {
  const router = useRouter();
  const { itemType, styleConfig, yarnConfig, email, setEmail } = usePatternForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pattern, setPattern] = useState<PatternResult | null>(null);

  useEffect(() => {
    if (!yarnConfig) {
      router.replace("/yarn");
    }
  }, [yarnConfig, router]);

  if (!yarnConfig) return null;

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate-pattern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, styleConfig, yarnConfig, email }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Server error ${res.status}`);
      }
      const data = await res.json();
      // Support { pattern: "..." }, { sections: [...] }, or raw string
      if (typeof data === "string") {
        setPattern(data);
      } else if (data.pattern) {
        setPattern(data.pattern);
      } else {
        setPattern(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <StepIndicator current={4} />

      {!pattern ? (
        <>
          <div className="mb-6 no-print">
            <Link
              href="/yarn"
              className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800"
              aria-label="Back to yarn selection"
            >
              ← Back
            </Link>
          </div>

          <h1 className="mb-2 text-2xl font-semibold text-stone-900">
            Generate your pattern
          </h1>
          <p className="mb-8 text-stone-500">
            Enter your email to receive the pattern, then click generate.
          </p>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-stone-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-stone-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Generating your pattern…" : "Generate pattern"}
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="mb-2 text-2xl font-semibold text-stone-900 print:text-black">
            Your knitting pattern
          </h1>
          <p className="mb-8 text-stone-500 no-print">
            Your pattern is ready. Print or save it as a PDF to keep it.
          </p>
          <PatternPreview pattern={pattern} />
        </>
      )}
    </main>
  );
}
