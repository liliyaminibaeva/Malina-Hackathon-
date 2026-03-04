export const PHOTO_ANALYSIS_PROMPT =
  "Analyze this knitting photo and return JSON with style fields: construction, neckline, sleeveLength, fit, hem. Return only valid JSON, no additional text.";

export const SYSTEM_PROMPT =
  "You are an expert knitting pattern designer. Generate clear, detailed, and accurate knitting patterns.";

export function getPatternPrompt(
  itemType: string,
  styleConfig: unknown,
  yarnConfig: unknown
): string {
  return `Generate a knitting pattern for a ${itemType} using the following config: ${JSON.stringify(styleConfig)} and yarn: ${JSON.stringify(yarnConfig)}`;
}
