import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { success: false, error: "N8N_WEBHOOK_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    const n8nFormData = new FormData();
    n8nFormData.append("data", image, image.name);

    const response = await fetch(webhookUrl, {
      method: "POST",
      body: n8nFormData,
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { success: false, error: `n8n responded with ${response.status}: ${text}` },
        { status: 502 }
      );
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { executionId: text.trim() };
    }

    return NextResponse.json({
      success: true,
      executionId: data.executionId || "unknown",
      status: "processing",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
