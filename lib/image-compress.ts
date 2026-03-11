const DEFAULT_MAX_SIZE = 1024;
const DEFAULT_QUALITY = 0.8;

export async function compressImage(
  file: File,
  maxSize = DEFAULT_MAX_SIZE,
  quality = DEFAULT_QUALITY,
): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  let targetWidth = width;
  let targetHeight = height;

  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height);
    targetWidth = Math.round(width * ratio);
    targetHeight = Math.round(height * ratio);
  }

  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  let blob = await canvas.convertToBlob({ type: "image/webp", quality });

  if (blob.size === 0) {
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
  }

  const ext = blob.type === "image/webp" ? ".webp" : ".jpg";
  const name = file.name.replace(/\.[^.]+$/, ext);

  return new File([blob], name, { type: blob.type });
}
