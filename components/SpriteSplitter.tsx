"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SplitImage {
  dataUrl: string;
  label: string;
}

function splitImageIntoQuadrants(file: File): Promise<readonly SplitImage[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const halfW = Math.floor(img.width / 2);
      const halfH = Math.floor(img.height / 2);
      const remainW = img.width - halfW;
      const remainH = img.height - halfH;

      const labels = ["Top-Left", "Top-Right", "Bottom-Left", "Bottom-Right"];
      const quadrants = [
        { x: 0, y: 0, w: halfW, h: halfH },
        { x: halfW, y: 0, w: remainW, h: halfH },
        { x: 0, y: halfH, w: halfW, h: remainH },
        { x: halfW, y: halfH, w: remainW, h: remainH },
      ];

      const results: SplitImage[] = [];
      for (let i = 0; i < quadrants.length; i++) {
        const { x, y, w, h } = quadrants[i];
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to acquire canvas 2D context"));
          return;
        }
        ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
        results.push({
          dataUrl: canvas.toDataURL("image/png"),
          label: labels[i],
        });
      }

      resolve(results);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

export default function SpriteSplitter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [splitImages, setSplitImages] = useState<readonly SplitImage[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setSelectedFile(file);
    setPreviewUrl(url);
    setSplitImages([]);
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleSplit = async () => {
    if (!selectedFile) return;

    setIsSplitting(true);
    setError(null);
    setSplitImages([]);

    try {
      const results = await splitImageIntoQuadrants(selectedFile);
      setSplitImages(results);
    } catch {
      setError("Failed to split image. Please try a different image.");
    } finally {
      setIsSplitting(false);
    }
  };

  const handleDownload = (dataUrl: string, label: string) => {
    const baseName = selectedFile?.name.replace(/\.[^.]+$/, "") ?? "sprite";
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${baseName}_${label.toLowerCase().replace(/\s+/g, "_")}.png`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    splitImages.forEach((img, index) => {
      setTimeout(() => {
        handleDownload(img.dataUrl, img.label);
      }, index * 300);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Sprite Sheet Splitter</h1>
        <p className="text-[#737373] text-lg">
          Upload a 2x2 sprite sheet to split it into 4 individual images
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-colors duration-200 mb-8
          ${previewUrl ? "border-[#6366f1]" : "border-[#2a2a2a] hover:border-[#6366f1]"}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />

        {previewUrl ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 rounded-lg object-contain"
            />
            <p className="text-sm text-[#737373]">
              {selectedFile?.name} - Click or drop to change
            </p>
          </div>
        ) : (
          <div className="py-8">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-[#737373]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg mb-1">Drop your sprite sheet here</p>
            <p className="text-sm text-[#737373]">or click to browse (2x2 grid image)</p>
          </div>
        )}
      </div>

      {/* Split Button */}
      <div className="text-center mb-10">
        <button
          onClick={handleSplit}
          disabled={!selectedFile || isSplitting}
          className={`
            px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200
            ${
              !selectedFile || isSplitting
                ? "bg-[#2a2a2a] text-[#737373] cursor-not-allowed"
                : "bg-[#6366f1] hover:bg-[#818cf8] text-white cursor-pointer"
            }
          `}
        >
          {isSplitting ? "Splitting..." : "Split into 4 Images"}
        </button>
      </div>

      {/* Splitting Spinner */}
      {isSplitting && (
        <div className="text-center py-4 mb-6">
          <div className="inline-block w-10 h-10 border-4 border-[#2a2a2a] border-t-[#6366f1] rounded-full animate-spin mb-4" />
          <p className="text-[#737373]">Splitting sprite sheet...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-8 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Split Results */}
      {splitImages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Split Results</h2>
            <button
              onClick={handleDownloadAll}
              className="px-6 py-2 rounded-lg bg-[#6366f1] hover:bg-[#818cf8] transition-colors text-sm font-medium cursor-pointer text-white"
            >
              Download All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {splitImages.map((img) => (
              <div
                key={img.label}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden"
              >
                <div className="p-4 border-b border-[#2a2a2a]">
                  <h3 className="font-semibold text-lg">{img.label}</h3>
                </div>
                <div className="p-4 bg-[#111] flex items-center justify-center min-h-[200px]">
                  <img
                    src={img.dataUrl}
                    alt={img.label}
                    className="max-w-full max-h-[300px] object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div className="p-3 border-t border-[#2a2a2a]">
                  <button
                    onClick={() => handleDownload(img.dataUrl, img.label)}
                    className="w-full py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors text-sm font-medium cursor-pointer"
                  >
                    Download {img.label}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
