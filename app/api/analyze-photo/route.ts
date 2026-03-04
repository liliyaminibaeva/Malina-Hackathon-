import { NextRequest, NextResponse } from "next/server";
import claude from "@/lib/claude";
import { PHOTO_ANALYSIS_PROMPT } from "@/lib/prompts";

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

  let base64Image: string;
  try {
    const arrayBuffer = await imageFile.arrayBuffer();
    base64Image = Buffer.from(arrayBuffer).toString("base64");
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }

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
      const jsonText = rawText.replace(/```json\n?|\n?```/g, "").trim();
      fields = JSON.parse(jsonText);
      if (typeof fields !== "object" || fields === null || Array.isArray(fields)) {
        console.error("Unexpected Claude response structure:", rawText.slice(0, 200));
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

    return NextResponse.json({ fields });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
