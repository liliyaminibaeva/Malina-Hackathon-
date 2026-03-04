"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import type { StyleConfig } from "@/lib/store";
import { ConfigForm } from "@/components/ConfigForms";
import PhotoUpload from "@/components/ConfigForms/PhotoUpload";
import { StepIndicator } from "@/components/StepIndicator";

type Path = "manual" | "photo";

// Static placeholder images for the Ravelry-like section
const RAVELRY_PLACEHOLDERS = [
  { id: 1, bg: "bg-stone-200", label: "Pattern A" },
  { id: 2, bg: "bg-stone-300", label: "Pattern B" },
  { id: 3, bg: "bg-stone-200", label: "Pattern C" },
  { id: 4, bg: "bg-stone-300", label: "Pattern D" },
];

function RavelryPlaceholder() {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg" role="img" aria-label="Ravelry">
          🧶
        </span>
        <p className="font-semibold text-stone-800">Similar patterns on Ravelry</p>
      </div>
      <p className="mb-4 text-sm text-stone-400">
        Inspiration picked from patterns matching your style.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {RAVELRY_PLACEHOLDERS.map((p) => (
          <div
            key={p.id}
            className={`${p.bg} flex h-24 items-end rounded-lg p-2`}
          >
            <span className="rounded bg-white/80 px-1.5 py-0.5 text-xs text-stone-600">
              {p.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-stone-300 italic">
        Ravelry integration coming soon
      </p>
    </div>
  );
}

export default function ConfigurePage() {
  const router = useRouter();
  const { itemType } = usePatternForm();
  const [selectedPath, setSelectedPath] = useState<Path | null>(null);
  const [photoDefaults, setPhotoDefaults] = useState<StyleConfig | undefined>(
    undefined
  );

  useEffect(() => {
    if (!itemType) {
      router.replace("/");
    }
  }, [itemType, router]);

  if (!itemType) return null;

  const itemLabel = itemType.charAt(0).toUpperCase() + itemType.slice(1);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <StepIndicator current={2} />

      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800"
            aria-label="Back to item selection"
          >
            ← Back
          </Link>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Configure your {itemLabel}
        </h1>
        <p className="text-stone-500">
          Choose how you&apos;d like to set your style preferences.
        </p>
      </div>

      {!selectedPath && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => setSelectedPath("manual")}
            className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-6 text-center transition-all hover:border-stone-400 hover:shadow-sm active:scale-95"
          >
            <span className="text-3xl" role="img" aria-label="Manual entry">
              ✍️
            </span>
            <div>
              <p className="font-semibold text-stone-800">Manual entry</p>
              <p className="mt-1 text-sm text-stone-500">
                Pick your style options yourself
              </p>
            </div>
          </button>

          <button
            onClick={() => setSelectedPath("photo")}
            className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-6 text-center transition-all hover:border-stone-400 hover:shadow-sm active:scale-95"
          >
            <span className="text-3xl" role="img" aria-label="Photo upload">
              📷
            </span>
            <div>
              <p className="font-semibold text-stone-800">Upload a photo</p>
              <p className="mt-1 text-sm text-stone-500">
                We&apos;ll analyse your inspiration image
              </p>
            </div>
          </button>
        </div>
      )}

      {selectedPath && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedPath(null);
                setPhotoDefaults(undefined);
              }}
              className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800"
              aria-label="Change path"
            >
              ← Back
            </button>
            <span className="text-sm text-stone-400">
              {selectedPath === "manual" ? "Manual entry" : "Photo upload"}
            </span>
          </div>

          {selectedPath === "manual" && <ConfigForm />}

          {selectedPath === "photo" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left column: photo upload + Ravelry placeholder */}
              <div className="space-y-6">
                <PhotoUpload onAnalysisComplete={setPhotoDefaults} />
                <RavelryPlaceholder />
              </div>

              {/* Right column: pre-filled config form */}
              <div>
                {photoDefaults ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-stone-600">
                      Style options detected from your photo — adjust as needed:
                    </p>
                    <ConfigForm key={JSON.stringify(photoDefaults)} defaultValues={photoDefaults} />
                  </div>
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50 p-8 text-center">
                    <p className="text-sm text-stone-400">
                      Upload a photo and we&apos;ll pre-fill your style options here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
