"use client";

import Link from "next/link";

const STEPS = [
  { number: 1, label: "Item", href: "/" },
  { number: 2, label: "Configure", href: "/configure" },
  { number: 3, label: "Yarn", href: "/yarn" },
  { number: 4, label: "Generate", href: "/generate" },
];

interface StepIndicatorProps {
  current: 1 | 2 | 3 | 4;
}

export default function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="no-print mb-8">
      <ol className="flex items-center flex-wrap gap-0">
        {STEPS.map((step, i) => {
          const done = step.number < current;
          const active = step.number === current;
          const num = String(step.number).padStart(2, "0");

          return (
            <li key={step.number} className="flex items-center">
              {done ? (
                <Link
                  href={step.href}
                  className="text-[10px] uppercase tracking-[0.15em] text-[#7A7068] hover:text-[#1A1814] transition-colors"
                  aria-label={`Step ${step.number}: ${step.label} (completed)`}
                >
                  {num} · {step.label}
                </Link>
              ) : active ? (
                <span
                  className="text-[10px] uppercase tracking-[0.15em] text-[#1A1814] font-semibold"
                  aria-current="step"
                >
                  {num} · {step.label}
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#DDD8CF]">
                  {num} · {step.label}
                </span>
              )}

              {i < STEPS.length - 1 && (
                <span className="mx-3 text-[#DDD8CF]" aria-hidden="true">·</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
