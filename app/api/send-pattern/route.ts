import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: { pattern?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { pattern } = body;

  if (!pattern || typeof pattern !== "string" || pattern.trim() === "") {
    return NextResponse.json(
      { error: "Missing required field: pattern" },
      { status: 400 }
    );
  }

  try {
    const escaped = pattern
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Knitting Pattern</title>
  <style>
    body { font-family: serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.8; color: #333; }
    pre { white-space: pre-wrap; word-wrap: break-word; font-family: serif; font-size: 1rem; }
  </style>
</head>
<body>
  <pre>${escaped}</pre>
</body>
</html>`;

    return NextResponse.json({ html });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
