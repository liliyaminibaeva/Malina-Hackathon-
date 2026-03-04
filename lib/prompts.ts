// Types for Malina prompt configuration

export type StyleConfig = Record<string, string>;

export interface YarnConfig {
  weight: string;
  gauge: string;
  needleSize: string;
  name?: string;
}

export type ItemType =
  | "sweater"
  | "slipover"
  | "t-shirt"
  | "beanie"
  | "gloves"
  | "scarf"
  | "minnens"
  | "hood";

// Placeholder exports for Dev 2 — will be filled in subsequent tasks

export const SYSTEM_PROMPT = "";

export const PHOTO_ANALYSIS_PROMPT = "";

export function getPatternPrompt(
  itemType: ItemType,
  styleConfig: StyleConfig,
  yarnConfig: YarnConfig
): string {
  return "";
}
