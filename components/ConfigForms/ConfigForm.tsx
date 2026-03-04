"use client";

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
      <p className="text-sm font-medium text-stone-700">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={[
              "rounded-lg border px-3 py-1.5 text-sm transition-all",
              value === opt
                ? "border-stone-800 bg-stone-800 text-white"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-400",
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
}

export default function ConfigForm({ defaultValues }: ConfigFormProps) {
  const router = useRouter();
  const { itemType, setStyleConfig } = usePatternForm();

  const fields = itemType ? ITEM_FIELDS[itemType as Exclude<ItemType, null>] : [];

  const { handleSubmit, watch, setValue } = useForm<StyleConfig>({
    defaultValues: defaultValues ?? {},
  });

  const values = watch();

  function onSubmit(data: StyleConfig) {
    setStyleConfig(data);
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
        className="mt-4 w-full rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-stone-700 active:scale-95 disabled:opacity-50"
        disabled={fields.some((f) => !values[f.name])}
      >
        Continue to yarn selection
      </button>
    </form>
  );
}
