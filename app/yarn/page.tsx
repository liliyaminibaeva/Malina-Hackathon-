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
    <main className="mx-auto max-w-lg px-4 py-12">
      <StepIndicator current={3} />

      <div className="mb-6">
        <Link
          href="/configure"
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800"
          aria-label="Back to configuration"
        >
          ← Back
        </Link>
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-stone-900">
        Your yarn
      </h1>
      <p className="mb-8 text-stone-500">
        Search for your yarn or enter the details manually.
      </p>
      <YarnSearch />
    </main>
  );
}
