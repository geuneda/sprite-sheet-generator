import { NextRequest } from "next/server";
import { generateSpriteSheet } from "@/lib/gemini";
import { SPRITE_PROMPTS } from "@/lib/prompts";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { success: false, error: "GEMINI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const image = formData.get("image") as File | null;
  const spriteType = formData.get("spriteType") as string | null;

  if (!image) {
    return Response.json(
      { success: false, error: "No image provided" },
      { status: 400 },
    );
  }

  if (!spriteType || !SPRITE_PROMPTS[spriteType]) {
    return Response.json(
      { success: false, error: `Invalid spriteType: ${spriteType}` },
      { status: 400 },
    );
  }

  if (image.size > MAX_FILE_SIZE) {
    return Response.json(
      { success: false, error: "Image too large. Maximum 4MB." },
      { status: 413 },
    );
  }

  if (!ALLOWED_TYPES.includes(image.type)) {
    return Response.json(
      { success: false, error: "Unsupported image type. Use PNG, JPEG, WebP, or GIF." },
      { status: 400 },
    );
  }

  try {
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const characterBase64 = imageBuffer.toString("base64");

    const result = await generateSpriteSheet(
      spriteType,
      SPRITE_PROMPTS[spriteType],
      characterBase64,
      image.type,
    );

    return Response.json({
      success: true,
      type: result.type,
      image: `data:${result.mimeType};base64,${result.imageBase64}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
