"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { usePatternForm } from "@/lib/store";
import { PatternPreview } from "@/components/PatternPreview";
import { StepIndicator } from "@/components/StepIndicator";

type EmailFormValues = { email: string };

export default function GeneratePage() {
  const router = useRouter();
  const { itemType, styleConfig, yarnConfig, setEmail } = usePatternForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pattern, setPattern] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>();

  useEffect(() => {
    if (!yarnConfig) {
      router.replace("/yarn");
    }
  }, [yarnConfig, router]);

  if (!yarnConfig) return null;

  async function onSubmit(data: EmailFormValues) {
    setEmail(data.email);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate-pattern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, styleConfig, yarnConfig, email: data.email }),
      });
      if (!res.ok) {
        throw new Error("Pattern generation failed. Please try again.");
      }
      const result = await res.json();
      if (typeof result.pattern === "string") {
        setPattern(result.pattern);
      } else {
        throw new Error("Unexpected response format. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      {!pattern && <StepIndicator current={4} />}

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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                placeholder="you@example.com"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
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
          <PatternPreview patternText={pattern} />
        </>
      )}
    </main>
  );
}
