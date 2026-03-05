import { NextRequest, NextResponse } from "next/server";
import claude from "@/lib/claude";
import { SYSTEM_PROMPT, getPatternPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  let body: { itemType?: unknown; styleConfig?: unknown; yarnConfig?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { itemType: rawItemType, styleConfig, yarnConfig } = body;

  if (!rawItemType || typeof rawItemType !== "string" || rawItemType.trim() === "") {
    return NextResponse.json(
      { error: "Missing required field: itemType" },
      { status: 400 }
    );
  }

  const itemType = rawItemType.trim();

  if (itemType.length > 100) {
    return NextResponse.json(
      { error: "itemType must be 100 characters or fewer" },
      { status: 400 }
    );
  }

  if (!/^[a-zA-Z0-9 -]+$/.test(itemType)) {
    return NextResponse.json(
      { error: "itemType contains invalid characters" },
      { status: 400 }
    );
  }

  const VALID_ITEM_TYPES = ["sweater", "slipover", "t-shirt", "beanie", "gloves", "scarf", "mittens", "hood"];
  if (!VALID_ITEM_TYPES.includes(itemType)) {
    return NextResponse.json(
      { error: "Invalid itemType" },
      { status: 400 }
    );
  }

  if (!yarnConfig || typeof yarnConfig !== "object" || Array.isArray(yarnConfig)) {
    return NextResponse.json(
      { error: "Missing required field: yarnConfig" },
      { status: 400 }
    );
  }

  const yarnWeight = (yarnConfig as Record<string, unknown>).weight;
  if (
    !("weight" in (yarnConfig as Record<string, unknown>)) ||
    yarnWeight == null ||
    typeof yarnWeight !== "string" ||
    yarnWeight.trim() === ""
  ) {
    return NextResponse.json(
      { error: "yarnConfig must include at least a weight field" },
      { status: 400 }
    );
  }

  if (!styleConfig || typeof styleConfig !== "object" || Array.isArray(styleConfig)) {
    return NextResponse.json(
      { error: "Missing required field: styleConfig" },
      { status: 400 }
    );
  }

  for (const [k, v] of Object.entries(styleConfig as Record<string, unknown>)) {
    if (typeof k !== "string" || typeof v !== "string") {
      return NextResponse.json(
        { error: "styleConfig values must be strings" },
        { status: 400 }
      );
    }
    if (k.length > 50 || v.length > 100) {
      return NextResponse.json(
        { error: "styleConfig contains oversized fields" },
        { status: 400 }
      );
    }
    if (/[\n\r]/.test(k) || /[\n\r]/.test(v)) {
      return NextResponse.json(
        { error: "styleConfig fields must not contain newlines" },
        { status: 400 }
      );
    }
  }

  if (JSON.stringify(styleConfig).length > 2048) {
    return NextResponse.json(
      { error: "styleConfig is too large" },
      { status: 400 }
    );
  }

  if (JSON.stringify(yarnConfig).length > 2048) {
    return NextResponse.json(
      { error: "yarnConfig is too large" },
      { status: 400 }
    );
  }

  const yarnConfigRecord = yarnConfig as Record<string, unknown>;
  for (const field of ["name", "brand"] as const) {
    const val = yarnConfigRecord[field];
    if (val !== undefined) {
      if (typeof val !== "string") {
        return NextResponse.json({ error: `yarnConfig.${field} must be a string` }, { status: 400 });
      }
      if (val.length > 100) {
        return NextResponse.json({ error: `yarnConfig.${field} must be 100 characters or fewer` }, { status: 400 });
      }
      if (/[\n\r]/.test(val)) {
        return NextResponse.json({ error: `yarnConfig.${field} must not contain newlines` }, { status: 400 });
      }
    }
  }

  const VALID_YARN_WEIGHTS = ["Lace", "Fingering", "Sport", "DK", "Worsted", "Aran", "Bulky", "Super Bulky"];
  const weightVal = yarnConfigRecord.weight as string;
  if (!VALID_YARN_WEIGHTS.includes(weightVal)) {
    return NextResponse.json({ error: "Invalid yarnConfig.weight value" }, { status: 400 });
  }

  for (const field of ["gaugeStitches", "gaugeRows", "needleSize"] as const) {
    const val = yarnConfigRecord[field];
    if (val !== undefined) {
      if (typeof val !== "string") {
        return NextResponse.json({ error: `yarnConfig.${field} must be a string` }, { status: 400 });
      }
      if (val.length > 20) {
        return NextResponse.json({ error: `yarnConfig.${field} must be 20 characters or fewer` }, { status: 400 });
      }
      if (!/^\d+(\.\d+)?$/.test(val)) {
        return NextResponse.json({ error: `yarnConfig.${field} must be a positive number` }, { status: 400 });
      }
    }
  }

  try {
    const userPrompt = getPatternPrompt(
      itemType as import("@/lib/prompts").ItemType,
      styleConfig as import("@/lib/prompts").StyleConfig,
      yarnConfig as import("@/lib/prompts").YarnConfig
    );

    const response = await claude.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent) {
      return NextResponse.json(
        { error: "No text response from Claude" },
        { status: 500 }
      );
    }

    return NextResponse.json({ pattern: (textContent as { type: "text"; text: string }).text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
