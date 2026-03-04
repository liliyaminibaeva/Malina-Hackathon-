"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import { ConfigForm } from "@/components/ConfigForms";

type Path = "manual" | "photo";

export default function ConfigurePage() {
  const router = useRouter();
  const { itemType } = usePatternForm();
  const [selectedPath, setSelectedPath] = useState<Path | null>(null);

  useEffect(() => {
    if (!itemType) {
      router.replace("/");
    }
  }, [itemType, router]);

  if (!itemType) return null;

  const itemLabel = itemType.charAt(0).toUpperCase() + itemType.slice(1);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-16">
      <div className="mb-10 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Step 2 of 4
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Configure your {itemLabel}
        </h1>
        <p className="text-stone-500">
          Choose how you'd like to set your style preferences.
        </p>
      </div>

      {!selectedPath && (
        <div className="grid grid-cols-2 gap-4">
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
                We'll analyse your inspiration image
              </p>
            </div>
          </button>
        </div>
      )}

      {selectedPath && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPath(null)}
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
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center text-stone-400">
              <p className="text-sm">Photo upload coming in the next step.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
