"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import type { YarnConfig } from "@/lib/store";

interface YarnResult {
  id: string;
  name: string;
  brand: string;
  weight: string;
  gauge: number | null;
  needleSize: number | null;
}

const WEIGHT_OPTIONS = ["lace", "fingering", "DK", "worsted", "bulky"];

type FormValues = {
  weight: string;
  gaugeStitches: string;
  gaugeRows: string;
  needleSize: string;
};

export default function YarnSearch() {
  const router = useRouter();
  const { setYarnConfig } = usePatternForm();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YarnResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedYarn, setSelectedYarn] = useState<YarnResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { weight: "", gaugeStitches: "", gaugeRows: "", needleSize: "" },
  });

  const weightValue = watch("weight");

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setDropdownOpen(false);
      setSearchError(false);
      setSearching(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setSearching(true);
      setSearchError(false);
      try {
        const res = await fetch(
          `/api/search-yarn?q=${encodeURIComponent(query.trim())}`,
          { signal: abortRef.current.signal }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.yarns)) {
            setResults(data.yarns as YarnResult[]);
            setDropdownOpen(true);
          } else {
            setSearchError(true);
            setDropdownOpen(false);
          }
        } else {
          setSearchError(true);
          setDropdownOpen(false);
        }
        setSearching(false);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setSearching(false);
          return;
        }
        setSearchError(true);
        setDropdownOpen(false);
        setSearching(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectYarn(yarn: YarnResult) {
    setSelectedYarn(yarn);
    setQuery(yarn.name);
    setDropdownOpen(false);
    setValue("weight", yarn.weight ?? "");
    if (yarn.gauge != null) setValue("gaugeStitches", String(yarn.gauge));
    if (yarn.needleSize != null) setValue("needleSize", String(yarn.needleSize));
  }

  function onSubmit(data: FormValues) {
    const config: YarnConfig = {
      weight: data.weight,
      gaugeStitches: data.gaugeStitches,
      gaugeRows: data.gaugeRows,
      needleSize: data.needleSize,
      ...(selectedYarn
        ? { name: selectedYarn.name, brand: selectedYarn.brand }
        : {}),
    };
    setYarnConfig(config);
    router.push("/generate");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Yarn search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700">
          Search yarn (optional)
        </label>
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Drops Alaska, Sandnes Garn…"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
          />
          {searching && (
            <span className="absolute right-3 top-2.5 text-xs text-stone-400">
              Searching…
            </span>
          )}

          {dropdownOpen && results.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-xl border border-stone-200 bg-white shadow-md">
              {results.map((yarn) => (
                <li key={yarn.id}>
                  <button
                    type="button"
                    onClick={() => selectYarn(yarn)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-stone-50"
                  >
                    <span className="font-medium text-stone-800">
                      {yarn.name}
                    </span>
                    <span className="ml-2 text-stone-500">
                      {yarn.brand} · {yarn.weight}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {dropdownOpen && results.length === 0 && !searching && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-500 shadow-md">
              No yarns found — fill in details below manually.
            </div>
          )}
        </div>

        {searchError && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Yarn search is unavailable — fill in the details manually below.
          </p>
        )}
      </div>

      {/* Manual entry */}
      <div className="space-y-6 rounded-2xl border border-stone-100 bg-stone-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Yarn details
        </p>

        {/* Weight toggle */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-stone-700">Weight</p>
          <div className="flex flex-wrap gap-2">
            {WEIGHT_OPTIONS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setValue("weight", w)}
                aria-pressed={weightValue === w}
                className={[
                  "rounded-lg border px-3 py-1.5 text-sm transition-all",
                  weightValue === w
                    ? "border-stone-800 bg-stone-800 text-white"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-400",
                ].join(" ")}
              >
                {w}
              </button>
            ))}
          </div>
          {/* hidden input for react-hook-form validation */}
          <input
            type="hidden"
            {...register("weight", { required: "Select a weight" })}
          />
          {errors.weight && (
            <p className="text-xs text-red-500">{errors.weight.message}</p>
          )}
        </div>

        {/* Gauge */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">
            Gauge per 10 cm
          </label>
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <input
                id="gaugeStitches"
                type="text"
                inputMode="decimal"
                placeholder="stitches (e.g. 22)"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                {...register("gaugeStitches", {
                  required: "Required",
                  pattern: { value: /^\d+(\.\d+)?$/, message: "Must be a number" },
                })}
              />
              {errors.gaugeStitches && (
                <p className="text-xs text-red-500">{errors.gaugeStitches.message}</p>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <input
                id="gaugeRows"
                type="text"
                inputMode="decimal"
                placeholder="rows (e.g. 30)"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                {...register("gaugeRows", {
                  required: "Required",
                  pattern: { value: /^\d+(\.\d+)?$/, message: "Must be a number" },
                })}
              />
              {errors.gaugeRows && (
                <p className="text-xs text-red-500">{errors.gaugeRows.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Needle size */}
        <div className="space-y-1">
          <label
            htmlFor="needleSize"
            className="text-sm font-medium text-stone-700"
          >
            Needle size (mm)
          </label>
          <input
            id="needleSize"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 4.5"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
            {...register("needleSize", {
              required: "Needle size is required",
              pattern: {
                value: /^\d+(\.\d+)?$/,
                message: "Must be a number",
              },
            })}
          />
          {errors.needleSize && (
            <p className="text-xs text-red-500">{errors.needleSize.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-stone-700 active:scale-95"
      >
        Continue to pattern generation
      </button>
    </form>
  );
}
