import { NextRequest, NextResponse } from "next/server";
import claude from "@/lib/claude";

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

  const userPrompt = `Generate a knitting pattern for a ${itemType} using the following config: ${JSON.stringify(styleConfig)} and yarn: ${JSON.stringify(yarnConfig)}`;

  try {
    const response = await claude.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: "You are an expert knitting pattern designer. Generate clear, detailed, and accurate knitting patterns.",
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
