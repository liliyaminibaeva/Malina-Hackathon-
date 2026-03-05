"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";

interface PatternPreviewProps {
  patternText: string;
}

interface PatternSection {
  heading: string;
  content: string;
}

// ── Size highlighting ─────────────────────────────────────────────────────────

const GARMENT_SIZES  = ["XS", "S", "M", "L", "XL", "2XL"];
const ACCESSORY_SIZES = ["S/M", "M/L", "L/XL"];

type SizeInfo = { type: "6size" | "3size"; index: number } | null;

function parseSizeInfo(size: string | undefined): SizeInfo {
  if (!size) return null;
  const g = GARMENT_SIZES.indexOf(size);
  if (g >= 0) return { type: "6size", index: g };
  const a = ACCESSORY_SIZES.indexOf(size);
  if (a >= 0) return { type: "3size", index: a };
  return null;
}

// Matches PetiteKnit 6-size inline format: N (N) N (N) N (N)
const SIX_SIZE_RE  = /(\d+(?:\.\d+)?) \((\d+(?:\.\d+)?)\) (\d+(?:\.\d+)?) \((\d+(?:\.\d+)?)\) (\d+(?:\.\d+)?) \((\d+(?:\.\d+)?)\)/g;

// Matches 3-size inline format: N (N) N — not followed by another " (N)" group
const THREE_SIZE_RE = /(\d+(?:\.\d+)?) \((\d+(?:\.\d+)?)\) (\d+(?:\.\d+)?)(?! \()/g;

function highlightSizeInText(text: string, sizeInfo: SizeInfo): React.ReactNode {
  if (!sizeInfo) return text;

  const { type, index } = sizeInfo;
  const pattern = type === "6size"
    ? new RegExp(SIX_SIZE_RE.source, "g")
    : new RegExp(THREE_SIZE_RE.source, "g");

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

    const vals = match.slice(1);
    const b = (v: string, i: number) =>
      index === i ? <strong key={`s-${k}-${i}`}>{v}</strong> : v;

    if (type === "6size") {
      const [v0, v1, v2, v3, v4, v5] = vals;
      parts.push(
        <React.Fragment key={k++}>
          {b(v0, 0)} ({b(v1, 1)}) {b(v2, 2)} ({b(v3, 3)}) {b(v4, 4)} ({b(v5, 5)})
        </React.Fragment>
      );
    } else {
      const [v0, v1, v2] = vals;
      parts.push(
        <React.Fragment key={k++}>
          {b(v0, 0)} ({b(v1, 1)}) {b(v2, 2)}
        </React.Fragment>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? <>{parts}</> : text;
}

// ── Pattern parser ─────────────────────────────────────────────────────────────

function parsePattern(text: string): PatternSection[] {
  const sectionHeaderRegex = /^([A-Z][A-Z\s]+):?\s*$/m;
  const lines = text.split("\n");
  const sections: PatternSection[] = [];

  let currentHeading = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (sectionHeaderRegex.test(line.trim()) && line.trim().length > 0) {
      if (currentHeading || currentLines.some((l) => l.trim())) {
        sections.push({
          heading: currentHeading,
          content: currentLines.join("\n").trim(),
        });
      }
      currentHeading = line.trim().replace(/:$/, "");
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentHeading || currentLines.some((l) => l.trim())) {
    sections.push({
      heading: currentHeading,
      content: currentLines.join("\n").trim(),
    });
  }

  return sections.filter((s) => s.heading || s.content);
}

// ── Section renderers (each accepts hl for size highlighting) ─────────────────

type Hl = (text: string) => React.ReactNode;

function renderMaterials(content: string, hl: Hl) {
  const items = content.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <ul className="pattern-materials-list">
      {items.map((item, i) => <li key={i}>{hl(item)}</li>)}
    </ul>
  );
}

function renderMeasurements(content: string, hl: Hl) {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <table className="pattern-measurements-table">
      <tbody>
        {lines.map((line, i) => {
          const colonIdx = line.indexOf(":");
          if (colonIdx > -1) {
            const label = line.slice(0, colonIdx).trim();
            const value = line.slice(colonIdx + 1).trim();
            return (
              <tr key={i}>
                <td className="pattern-measurements-label">{label}</td>
                <td className="pattern-measurements-value">{hl(value)}</td>
              </tr>
            );
          }
          return (
            <tr key={i}>
              <td colSpan={2}>{hl(line)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function renderInstructions(content: string, hl: Hl) {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <div className="pattern-instructions">
      {lines.map((line, i) => (
        <p key={i} className="pattern-instruction-line">{hl(line)}</p>
      ))}
    </div>
  );
}

function renderAbbreviations(content: string, hl: Hl) {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <dl className="pattern-abbreviations">
      {lines.map((line, i) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx > -1) {
          const abbr = line.slice(0, colonIdx).trim();
          const def  = line.slice(colonIdx + 1).trim();
          return (
            <div key={i} className="pattern-abbreviation-row">
              <dt>{abbr}</dt>
              <dd>{hl(def)}</dd>
            </div>
          );
        }
        return (
          <div key={i} style={{ gridColumn: "1 / -1" }}>
            <p className="pattern-line">{hl(line)}</p>
          </div>
        );
      })}
    </dl>
  );
}

function renderDefaultContent(content: string, hl: Hl) {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <div>
      {lines.map((line, i) => (
        <p key={i} className="pattern-line">{hl(line)}</p>
      ))}
    </div>
  );
}

function renderSection(section: PatternSection, hl: Hl) {
  const heading = section.heading.toUpperCase();
  if (heading === "MATERIALS")              return renderMaterials(section.content, hl);
  if (heading === "FINISHED MEASUREMENTS" ||
      heading === "SIZES")                  return renderMeasurements(section.content, hl);
  if (heading === "INSTRUCTIONS")           return renderInstructions(section.content, hl);
  if (heading === "ABBREVIATIONS")          return renderAbbreviations(section.content, hl);
  return renderDefaultContent(section.content, hl);
}

// ── Main component ─────────────────────────────────────────────────────────────

export function PatternPreview({ patternText }: PatternPreviewProps) {
  const router = useRouter();
  const { reset, styleConfig } = usePatternForm();

  const sizeInfo = parseSizeInfo(styleConfig?.size);
  const hl: Hl = (text) => highlightSizeInText(text, sizeInfo);

  if (!patternText.trim()) return null;

  function handleStartOver() {
    reset();
    router.push("/");
  }

  const sections = parsePattern(patternText);

  return (
    <div className="pattern-preview-wrapper">
      <div className="pattern-preview-toolbar no-print">
        <button onClick={() => window.print()} className="pattern-print-button">
          Print / Save as PDF
        </button>
        <button onClick={handleStartOver} className="pattern-start-over-button">
          Start over
        </button>
      </div>

      <div className="pattern-preview-content" id="pattern-preview-content">
        {sections.map((section, i) => (
          <div key={i} className="pattern-section">
            {section.heading && (
              <h2 className="pattern-section-heading">{section.heading}</h2>
            )}
            <div className="pattern-section-body">
              {renderSection(section, hl)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
