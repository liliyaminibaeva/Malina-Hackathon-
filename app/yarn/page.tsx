"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import { YarnSearch } from "@/components/YarnSearch";
import { StepIndicator } from "@/components/StepIndicator";

export default function YarnPage() {
  const router = useRouter();
  const { styleConfig } = usePatternForm();

  useEffect(() => {
    if (!styleConfig) {
      router.replace("/configure");
    }
  }, [styleConfig, router]);

  if (!styleConfig) return null;

  return (
    <main className="mx-auto min-h-screen max-w-xl px-8 py-16">
      <header className="mb-10">
        <div className="flex items-baseline justify-between border-b border-t border-[#DDD8CF] py-3">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#1A1814]">Malina</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068]">Pattern Generator</span>
        </div>
      </header>

      <StepIndicator current={3} />

      <Link
        href="/configure"
        className="text-[10px] uppercase tracking-[0.12em] text-[#7A7068] hover:text-[#1A1814] transition-colors mb-8 inline-block"
        aria-label="Back to configuration"
      >
        ← Back
      </Link>

      <h1 className="font-serif text-4xl font-light mb-2 text-[#1A1814]">
        Your yarn
      </h1>
      <p className="mb-8 text-sm text-[#7A7068]">
        Search for your yarn or enter the details manually.
      </p>
      <YarnSearch />
    </main>
  );
}
