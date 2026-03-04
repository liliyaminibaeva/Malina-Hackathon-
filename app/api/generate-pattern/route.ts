import { NextRequest, NextResponse } from "next/server";
import claude from "@/lib/claude";
import { SYSTEM_PROMPT, getPatternPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  let body: { itemType?: unknown; styleConfig?: unknown; yarnConfig?: unknown; email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { itemType, styleConfig, yarnConfig } = body;

  if (!itemType || typeof itemType !== "string") {
    return NextResponse.json(
      { error: "Missing required field: itemType" },
      { status: 400 }
    );
  }

  if (!yarnConfig || typeof yarnConfig !== "object") {
    return NextResponse.json(
      { error: "Missing required field: yarnConfig" },
      { status: 400 }
    );
  }

  if (!("weight" in (yarnConfig as Record<string, unknown>)) || !(yarnConfig as Record<string, unknown>).weight) {
    return NextResponse.json(
      { error: "yarnConfig must include at least a weight field" },
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
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json(
        { error: "No text response from Claude" },
        { status: 500 }
      );
    }

    return NextResponse.json({ pattern: textContent.text });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
