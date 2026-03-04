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

  const { itemType, styleConfig, yarnConfig } = body;

  if (!itemType || typeof itemType !== "string" || itemType.trim() === "") {
    return NextResponse.json(
      { error: "Missing required field: itemType" },
      { status: 400 }
    );
  }

  if (itemType.length > 100) {
    return NextResponse.json(
      { error: "itemType must be 100 characters or fewer" },
      { status: 400 }
    );
  }

  if (!/^[a-zA-Z0-9 -]+$/.test(itemType.trim())) {
    return NextResponse.json(
      { error: "itemType contains invalid characters" },
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

  if (JSON.stringify(styleConfig ?? null).length > 2048) {
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

  const userPrompt = getPatternPrompt(itemType, styleConfig, yarnConfig);

  try {
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
