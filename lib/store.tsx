"use client";

import { createContext, useContext, useState } from "react";

export type ItemType =
  | "sweater"
  | "slipover"
  | "t-shirt"
  | "beanie"
  | "gloves"
  | "scarf"
  | "minnens"
  | "hood"
  | null;

export type StyleConfig = Record<string, string>;

export interface YarnConfig {
  name?: string;
  brand?: string;
  weight: string;
  gaugeStitches: string;
  gaugeRows: string;
  needleSize: string;
}

interface PatternFormState {
  itemType: ItemType;
  styleConfig: StyleConfig | null;
  yarnConfig: YarnConfig | null;
}

interface PatternFormContextValue extends PatternFormState {
  setItemType: (itemType: ItemType) => void;
  setStyleConfig: (config: StyleConfig) => void;
  setYarnConfig: (config: YarnConfig) => void;
  reset: () => void;
}

const defaultState: PatternFormState = {
  itemType: null,
  styleConfig: null,
  yarnConfig: null,
};

const PatternFormContext = createContext<PatternFormContextValue | null>(null);

export function PatternFormProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PatternFormState>(defaultState);

  const setItemType = (itemType: ItemType) =>
    setState((prev) => ({ ...prev, itemType, styleConfig: null, yarnConfig: null }));

  const setStyleConfig = (styleConfig: StyleConfig) =>
    setState((prev) => ({ ...prev, styleConfig, yarnConfig: null }));

  const setYarnConfig = (yarnConfig: YarnConfig) =>
    setState((prev) => ({ ...prev, yarnConfig }));

  const reset = () => setState(defaultState);

  return (
    <PatternFormContext.Provider
      value={{ ...state, setItemType, setStyleConfig, setYarnConfig, reset }}
    >
      {children}
    </PatternFormContext.Provider>
  );
}

export function usePatternForm(): PatternFormContextValue {
  const ctx = useContext(PatternFormContext);
  if (!ctx) {
    throw new Error("usePatternForm must be used within a PatternFormProvider");
  }
  return ctx;
}
