import { NextRequest, NextResponse } from "next/server";
import claude from "@/lib/claude";
import { PHOTO_ANALYSIS_PROMPT } from "@/lib/prompts";

function hasValidMagicBytes(bytes: Uint8Array, mimeType: string): boolean {
  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  }
  if (mimeType === "image/gif") {
    return (
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38
    );
  }
  if (mimeType === "image/webp") {
    return (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes.length > 11 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    );
  }
  return false;
}

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const imageFile = formData.get("image");
  if (!imageFile || !(imageFile instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const mimeType = imageFile.type;
  const validMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validMimeTypes.includes(mimeType)) {
    return NextResponse.json(
      { error: "Invalid file type. Must be jpeg, png, gif, or webp" },
      { status: 400 }
    );
  }

  if (imageFile.size === 0) {
    return NextResponse.json(
      { error: "Image file is empty" },
      { status: 400 }
    );
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (imageFile.size > maxSize) {
    return NextResponse.json(
      { error: "Image too large. Maximum size is 10MB" },
      { status: 400 }
    );
  }

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await imageFile.arrayBuffer();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }

  const header = new Uint8Array(arrayBuffer.slice(0, 12));
  if (!hasValidMagicBytes(header, mimeType)) {
    return NextResponse.json(
      { error: "Invalid file type. Must be jpeg, png, gif, or webp" },
      { status: 400 }
    );
  }

  const base64Image = Buffer.from(arrayBuffer).toString("base64");

  try {
    const response = await claude.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType as
                  | "image/jpeg"
                  | "image/png"
                  | "image/gif"
                  | "image/webp",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: PHOTO_ANALYSIS_PROMPT,
            },
          ],
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

    const rawText = (textContent as { type: "text"; text: string }).text;

    let fields: unknown;
    try {
      const jsonMatch = rawText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      const jsonText = jsonMatch ? jsonMatch[1].trim() : rawText.trim();
      fields = JSON.parse(jsonText);
      if (typeof fields !== "object" || fields === null || Array.isArray(fields)) {
        console.error("Unexpected Claude response structure", fields);
        return NextResponse.json(
          { error: "Failed to parse Claude response as JSON" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to parse Claude response as JSON" },
        { status: 500 }
      );
    }

    const ALLOWED_FIELDS: Record<string, string[]> = {
      neckline: ["Crew neck", "V-neck", "Turtleneck", "Boat neck"],
      sleeveLength: ["Sleeveless", "Short", "3/4", "Long"],
      fit: ["Fitted", "Relaxed", "Oversized", "Classic"],
      hem: ["Straight", "Ribbed", "Rolled"],
    };
    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields as Record<string, unknown>)) {
      if (key in ALLOWED_FIELDS && typeof value === "string" && ALLOWED_FIELDS[key].includes(value)) {
        sanitized[key] = value;
      }
    }

    return NextResponse.json({ fields: sanitized });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
