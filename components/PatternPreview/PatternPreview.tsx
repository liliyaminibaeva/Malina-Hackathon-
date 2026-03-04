"use client";

import React from "react";

interface PatternPreviewProps {
  patternText: string;
}

interface PatternSection {
  heading: string;
  content: string;
}

function parsePattern(text: string): PatternSection[] {
  // Split on lines that are ALL CAPS followed by optional colon (section headers)
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

function renderMaterials(content: string) {
  const items = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <ul className="pattern-materials-list">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function renderMeasurements(content: string) {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
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
                <td className="pattern-measurements-value">{value}</td>
              </tr>
            );
          }
          return (
            <tr key={i}>
              <td colSpan={2}>{line}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function renderInstructions(content: string) {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <div className="pattern-instructions">
      {lines.map((line, i) => (
        <p key={i} className="pattern-instruction-line">
          {line}
        </p>
      ))}
    </div>
  );
}

function renderAbbreviations(content: string) {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <dl className="pattern-abbreviations">
      {lines.map((line, i) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx > -1) {
          const abbr = line.slice(0, colonIdx).trim();
          const def = line.slice(colonIdx + 1).trim();
          return (
            <div key={i} className="pattern-abbreviation-row">
              <dt>{abbr}</dt>
              <dd>{def}</dd>
            </div>
          );
        }
        return (
          <div key={i} style={{ gridColumn: "1 / -1" }}>
            <p className="pattern-line">{line}</p>
          </div>
        );
      })}
    </dl>
  );
}

function renderDefaultContent(content: string) {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <div>
      {lines.map((line, i) => (
        <p key={i} className="pattern-line">
          {line}
        </p>
      ))}
    </div>
  );
}

function renderSection(section: PatternSection) {
  const heading = section.heading.toUpperCase();

  if (heading === "MATERIALS") {
    return renderMaterials(section.content);
  }
  if (heading === "FINISHED MEASUREMENTS" || heading === "SIZES") {
    return renderMeasurements(section.content);
  }
  if (heading === "INSTRUCTIONS") {
    return renderInstructions(section.content);
  }
  if (heading === "ABBREVIATIONS") {
    return renderAbbreviations(section.content);
  }
  return renderDefaultContent(section.content);
}

export function PatternPreview({ patternText }: PatternPreviewProps) {
  if (!patternText.trim()) {
    return null;
  }

  const sections = parsePattern(patternText);

  return (
    <div className="pattern-preview-wrapper">
      <div className="pattern-preview-toolbar no-print">
        <button onClick={() => window.print()} className="pattern-print-button">
          Print / Save as PDF
        </button>
      </div>

      <div className="pattern-preview-content" id="pattern-preview-content">
        {sections.map((section, i) => (
          <div key={i} className="pattern-section">
            {section.heading && (
              <h2 className="pattern-section-heading">{section.heading}</h2>
            )}
            <div className="pattern-section-body">
              {renderSection(section)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
