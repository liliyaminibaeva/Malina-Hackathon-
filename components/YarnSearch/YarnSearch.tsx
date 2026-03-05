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

const WEIGHT_OPTIONS = ["Lace", "Fingering", "Sport", "DK", "Worsted", "Aran", "Bulky", "Super Bulky"];

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

  const WEIGHT_TO_NEEDLE: Record<string, string> = {
    "Lace": "2.25",
    "Fingering": "2.5",
    "Sport": "3.25",
    "DK": "4.0",
    "Worsted": "4.5",
    "Aran": "5.0",
    "Bulky": "6.5",
    "Super Bulky": "10.0",
  };

  function selectYarn(yarn: YarnResult) {
    setSelectedYarn(yarn);
    setQuery(yarn.name);
    setDropdownOpen(false);
    setValue("weight", yarn.weight ?? "");
    if (yarn.gauge != null) setValue("gaugeStitches", String(yarn.gauge));
    if (yarn.gauge != null) setValue("gaugeRows", String(Math.round(yarn.gauge * 1.4)));
    if (yarn.weight && WEIGHT_TO_NEEDLE[yarn.weight]) {
      setValue("needleSize", WEIGHT_TO_NEEDLE[yarn.weight]);
    }
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
        <label className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#7A7068] mb-2 block">
          Search yarn (optional)
        </label>
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Drops Alaska, Sandnes Garn…"
            className="border-b border-[#DDD8CF] bg-transparent px-0 py-2.5 text-sm text-[#1A1814] placeholder-[#C8C2B8] outline-none focus:border-[#1A1814] w-full"
          />
          {searching && (
            <span className="absolute right-0 top-2.5 text-[10px] uppercase tracking-[0.1em] text-[#7A7068]">
              Searching…
            </span>
          )}

          {dropdownOpen && results.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full border border-[#DDD8CF] bg-white shadow-sm">
              {results.map((yarn) => (
                <li key={yarn.id}>
                  <button
                    type="button"
                    onClick={() => selectYarn(yarn)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-[#FAF7F2]"
                  >
                    <span className="font-medium text-[#1A1814]">
                      {yarn.name}
                    </span>
                    <span className="ml-2 text-[10px] uppercase tracking-[0.1em] text-[#7A7068]">
                      {yarn.brand} · {yarn.weight}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {dropdownOpen && results.length === 0 && !searching && (
            <div className="absolute z-10 mt-1 w-full border border-[#DDD8CF] bg-white px-4 py-3 text-sm text-[#7A7068] shadow-sm">
              No yarns found — fill in details below manually.
            </div>
          )}
        </div>

        {searchError && (
          <p className="text-[11px] text-red-500 mt-1">
            Yarn search is unavailable — fill in the details manually below.
          </p>
        )}
      </div>

      {/* Manual entry */}
      <div className="border-t border-[#DDD8CF] pt-8 mt-4 space-y-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#7A7068] mb-6">
          Yarn details
        </p>

        {/* Weight toggle */}
        <div className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#7A7068] mb-2">Weight</p>
          <div className="flex flex-wrap gap-2">
            {WEIGHT_OPTIONS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setValue("weight", w)}
                aria-pressed={weightValue === w}
                className={[
                  "border px-4 py-2 text-sm transition-all",
                  weightValue === w
                    ? "border-[#1A1814] bg-[#1A1814] text-white"
                    : "border-[#DDD8CF] text-[#1A1814] hover:border-[#1A1814]",
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
            <p className="text-[11px] text-red-500 mt-1">{errors.weight.message}</p>
          )}
        </div>

        {/* Gauge */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#7A7068] mb-2 block">
            Gauge per 10 cm
          </label>
          <div className="flex gap-6">
            <div className="flex-1 space-y-1">
              <input
                id="gaugeStitches"
                type="text"
                inputMode="decimal"
                placeholder="stitches (e.g. 22)"
                className="border-b border-[#DDD8CF] bg-transparent px-0 py-2.5 text-sm text-[#1A1814] placeholder-[#C8C2B8] outline-none focus:border-[#1A1814] w-full"
                {...register("gaugeStitches", {
                  required: "Required",
                  pattern: { value: /^\d+(\.\d+)?$/, message: "Must be a number" },
                })}
              />
              {errors.gaugeStitches && (
                <p className="text-[11px] text-red-500 mt-1">{errors.gaugeStitches.message}</p>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <input
                id="gaugeRows"
                type="text"
                inputMode="decimal"
                placeholder="rows (e.g. 30)"
                className="border-b border-[#DDD8CF] bg-transparent px-0 py-2.5 text-sm text-[#1A1814] placeholder-[#C8C2B8] outline-none focus:border-[#1A1814] w-full"
                {...register("gaugeRows", {
                  required: "Required",
                  pattern: { value: /^\d+(\.\d+)?$/, message: "Must be a number" },
                })}
              />
              {errors.gaugeRows && (
                <p className="text-[11px] text-red-500 mt-1">{errors.gaugeRows.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Needle size */}
        <div className="space-y-1">
          <label
            htmlFor="needleSize"
            className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#7A7068] mb-2 block"
          >
            Needle size (mm)
          </label>
          <input
            id="needleSize"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 4.5"
            className="border-b border-[#DDD8CF] bg-transparent px-0 py-2.5 text-sm text-[#1A1814] placeholder-[#C8C2B8] outline-none focus:border-[#1A1814] w-full"
            {...register("needleSize", {
              required: "Needle size is required",
              pattern: {
                value: /^\d+(\.\d+)?$/,
                message: "Must be a number",
              },
            })}
          />
          {errors.needleSize && (
            <p className="text-[11px] text-red-500 mt-1">{errors.needleSize.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#1A1814] text-white px-8 py-3.5 text-xs font-medium uppercase tracking-[0.1em] transition-opacity hover:opacity-70 mt-6"
      >
        Continue to pattern generation
      </button>
    </form>
  );
}
