import { GoogleGenAI } from "@google/genai";
import { readFile } from "fs/promises";
import path from "path";

let _ai: GoogleGenAI | null = null;
let _gridBase64Promise: Promise<string> | null = null;

function getAI(): GoogleGenAI {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

function getGridTemplateBase64(): Promise<string> {
  if (!_gridBase64Promise) {
    const gridPath = path.join(process.cwd(), "public", "2x2_grid.png");
    _gridBase64Promise = readFile(gridPath).then((buf) => buf.toString("base64"));
  }
  return _gridBase64Promise;
}

function getModelId(): string {
  return process.env.GEMINI_MODEL || "gemini-3-pro-image-preview";
}

export interface SpriteResult {
  type: string;
  imageBase64: string;
  mimeType: string;
}

export async function generateSpriteSheet(
  spriteType: string,
  prompt: string,
  characterImageBase64: string,
  characterMimeType: string,
): Promise<SpriteResult> {
  const ai = getAI();
  const gridBase64 = await getGridTemplateBase64();

  const response = await ai.models.generateContent({
    model: getModelId(),
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: characterImageBase64,
              mimeType: characterMimeType,
            },
          },
          {
            inlineData: {
              data: gridBase64,
              mimeType: "image/png",
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ["Text", "Image"],
    },
  });

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error(`No response from Gemini for ${spriteType}`);
  }

  const parts = candidates[0].content?.parts;
  if (!parts) {
    throw new Error(`No content parts for ${spriteType}`);
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      return {
        type: spriteType,
        imageBase64: part.inlineData.data,
        mimeType: part.inlineData.mimeType || "image/png",
      };
    }
  }

  throw new Error(`No image generated for ${spriteType}`);
}
