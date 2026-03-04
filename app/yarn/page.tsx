"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import { YarnSearch } from "@/components/YarnSearch";

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
