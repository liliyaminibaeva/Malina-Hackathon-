"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import type { StyleConfig } from "@/lib/store";
import { ConfigForm, PhotoUpload } from "@/components/ConfigForms";
import { StepIndicator } from "@/components/StepIndicator";
import { GarmentMockup } from "@/components/GarmentMockup";

export default function ConfigurePage() {
  const router = useRouter();
  const { itemType } = usePatternForm();
  const [photoDefaults, setPhotoDefaults] = useState<StyleConfig | undefined>(undefined);
  const [currentValues, setCurrentValues] = useState<StyleConfig>({});

  useEffect(() => {
    if (!itemType) {
      router.replace("/");
    }
  }, [itemType, router]);

  const handleValuesChange = useCallback((values: StyleConfig) => {
    setCurrentValues(values);
  }, []);

  if (!itemType) return null;

  const ITEM_DISPLAY_NAMES: Record<string, string> = {
    sweater: "Sweater",
    slipover: "Slipover",
    "t-shirt": "T-shirt",
    beanie: "Beanie",
    gloves: "Gloves",
    scarf: "Scarf",
    minnens: "Mittens",
    hood: "Hood",
  };
  const itemLabel = ITEM_DISPLAY_NAMES[itemType] ?? itemType.charAt(0).toUpperCase() + itemType.slice(1);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-16">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-baseline justify-between border-b border-t border-[#DDD8CF] py-3">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#1A1814]">Malina</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068]">Pattern Generator</span>
        </div>
      </header>

      <StepIndicator current={2} />

      <Link
        href="/"
        className="text-[10px] uppercase tracking-[0.12em] text-[#7A7068] hover:text-[#1A1814] transition-colors mb-8 inline-block"
      >
        ← Back
      </Link>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_420px]">
        {/* Left: form */}
        <div>
          <h1 className="font-serif text-4xl font-light mb-2 text-[#1A1814]">{itemLabel}</h1>
          <p className="text-sm text-[#7A7068] mb-8">Configure your pattern options.</p>

          {/* Photo upload toggle */}
          <details className="mb-8 border border-[#DDD8CF] p-4">
            <summary className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068] cursor-pointer">
              Upload a photo to pre-fill options
            </summary>
            <div className="mt-4">
              <PhotoUpload
                onAnalysisComplete={setPhotoDefaults}
                onReset={() => setPhotoDefaults(undefined)}
              />
            </div>
          </details>

          <ConfigForm
            key={JSON.stringify(photoDefaults)}
            defaultValues={photoDefaults}
            onValuesChange={handleValuesChange}
          />
        </div>

        {/* Right: live mockup — sticky */}
        <div className="hidden lg:block">
          <div className="sticky top-16">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A7068] mb-4">Preview</p>
            <GarmentMockup itemType={itemType} styleConfig={currentValues} />
          </div>
        </div>
      </div>
    </main>
  );
}
