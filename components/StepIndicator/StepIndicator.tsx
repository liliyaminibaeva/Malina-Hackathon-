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
      <ol className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const done = step.number < current;
          const active = step.number === current;

          return (
            <li key={step.number} className="flex items-center">
              {done ? (
                <Link
                  href={step.href}
                  className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-800"
                  aria-label={`Step ${step.number}: ${step.label} (completed)`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
                    ✓
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </Link>
              ) : active ? (
                <span
                  className="flex items-center gap-1.5 text-sm font-semibold text-stone-900"
                  aria-current="step"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
                    {step.number}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm text-stone-400">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 text-xs text-stone-400">
                    {step.number}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </span>
              )}

              {i < STEPS.length - 1 && (
                <span
                  className={[
                    "mx-2 h-px w-6 sm:w-10",
                    step.number < current ? "bg-stone-400" : "bg-stone-200",
                  ].join(" ")}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
