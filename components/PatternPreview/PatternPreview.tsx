"use client";

import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";

interface PatternSection {
  title: string;
  content: string;
}

interface PatternData {
  sections?: PatternSection[];
  raw?: string;
}

interface PatternPreviewProps {
  pattern: PatternData | string;
}

function parseRawPattern(raw: string): PatternSection[] {
  const lines = raw.split("\n");
  const sections: PatternSection[] = [];
  let current: PatternSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    // Detect section headers: all-caps lines or lines ending with ":"
    const isHeader =
      /^[A-Z][A-Z\s&]{3,}$/.test(trimmed) ||
      (trimmed.endsWith(":") && trimmed.length < 50 && !trimmed.includes("."));

    if (isHeader && trimmed.length > 0) {
      if (current) sections.push(current);
      current = { title: trimmed.replace(/:$/, ""), content: "" };
    } else if (current) {
      current.content += (current.content ? "\n" : "") + line;
    } else if (trimmed) {
      current = { title: "Pattern", content: line };
    }
  }
  if (current) sections.push(current);
  return sections;
}

export default function PatternPreview({ pattern }: PatternPreviewProps) {
  const router = useRouter();
  const { reset } = usePatternForm();

  const sections: PatternSection[] =
    typeof pattern === "string"
      ? parseRawPattern(pattern)
      : pattern.sections ??
        (pattern.raw ? parseRawPattern(pattern.raw) : []);

  const rawText =
    typeof pattern === "string"
      ? pattern
      : pattern.raw ?? sections.map((s) => `${s.title}\n${s.content}`).join("\n\n");

  function handleStartOver() {
    reset();
    router.push("/");
  }

  return (
    <div>
      {/* Action bar — hidden on print */}
      <div className="no-print mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => window.print()}
          className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition-all hover:border-stone-400 hover:bg-stone-50 active:scale-95"
        >
          Print / Save as PDF
        </button>
        <button
          onClick={handleStartOver}
          className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-500 transition-all hover:border-stone-300 hover:text-stone-700 active:scale-95"
        >
          Start over
        </button>
      </div>

      {/* Pattern content */}
      {sections.length > 0 ? (
        <div className="space-y-8 print:space-y-6">
          {sections.map((section, i) => (
            <section key={`${section.title}-${i}`}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-stone-500 print:text-black">
                {section.title}
              </h2>
              <div className="whitespace-pre-wrap rounded-2xl border border-stone-100 bg-white p-5 text-sm leading-relaxed text-stone-800 print:rounded-none print:border-0 print:p-0">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <pre className="whitespace-pre-wrap rounded-2xl border border-stone-100 bg-white p-6 text-sm leading-relaxed text-stone-800">
          {rawText}
        </pre>
      )}
    </div>
  );
}
