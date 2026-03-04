"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { usePatternForm } from "@/lib/store";
import type { ItemType, StyleConfig } from "@/lib/store";
import { ITEM_FIELDS } from "./fields";

function ToggleGroup({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#7A7068] mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={[
              "border px-4 py-2 text-sm transition-all",
              value === opt
                ? "border-[#1A1814] bg-[#1A1814] text-white"
                : "border-[#DDD8CF] bg-white text-[#1A1814] hover:border-[#1A1814]",
            ].join(" ")}
            aria-pressed={value === opt}
            data-field={name}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ConfigFormProps {
  defaultValues?: StyleConfig;
  onValuesChange?: (values: StyleConfig) => void;
}

export default function ConfigForm({ defaultValues, onValuesChange }: ConfigFormProps) {
  const router = useRouter();
  const { itemType, setStyleConfig } = usePatternForm();

  const fields = itemType ? ITEM_FIELDS[itemType as Exclude<ItemType, null>] : [];

  const { handleSubmit, watch, setValue } = useForm<StyleConfig>({
    defaultValues: defaultValues ?? {},
  });

  const values = watch();

  useEffect(() => {
    const { unsubscribe } = watch((newValues) => {
      onValuesChange?.(newValues as StyleConfig);
    });
    return unsubscribe;
  }, [watch, onValuesChange]);

  function onSubmit(data: StyleConfig) {
    const filtered = Object.fromEntries(
      fields.map((f) => [f.name, data[f.name] ?? ""])
    ) as StyleConfig;
    setStyleConfig(filtered);
    router.push("/yarn");
  }

  if (!fields || fields.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field) => (
        <ToggleGroup
          key={field.name}
          name={field.name}
          label={field.label}
          options={field.options}
          value={values[field.name] ?? ""}
          onChange={(val) => setValue(field.name, val)}
        />
      ))}

      <button
        type="submit"
        className="w-full bg-[#1A1814] text-white px-8 py-3.5 text-xs font-medium uppercase tracking-[0.1em] transition-opacity hover:opacity-70 mt-6 disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={fields.some((f) => !values[f.name])}
      >
        Continue to yarn selection
      </button>
    </form>
  );
}
