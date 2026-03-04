"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SpriteResult {
  success: boolean;
  sprites?: Record<string, string>;
  error?: string;
}

const SPRITE_TYPES = [
  { key: "attack", label: "Attack", description: "4-frame attack animation" },
  { key: "jump", label: "Jump", description: "4-frame jump animation" },
  { key: "idle", label: "Idle", description: "4-frame idle/breathing animation" },
  { key: "walk", label: "Walk", description: "4-frame walk cycle" },
] as const;

type GenerationPhase = "idle" | "uploading" | "processing" | "completed" | "error";

export default function SpriteGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<SpriteResult | null>(null);
  const [phase, setPhase] = useState<GenerationPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setPhase("idle");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const pollStatus = useCallback((executionId: string) => {
    const startTime = Date.now();

    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/status?executionId=${executionId}`);
        const data = await res.json();

        if (data.status === "completed" && data.sprites) {
          stopPolling();
          setResult({ success: true, sprites: data.sprites });
          setPhase("completed");
          return;
        }

        if (data.status === "error") {
          stopPolling();
          setError(data.error || "Generation failed");
          setPhase("error");
          return;
        }
      } catch {
        // Polling error - keep trying
      }
    }, 5000);
  }, [stopPolling]);

  const handleGenerate = async () => {
    if (!selectedFile) return;

    stopPolling();
    setPhase("uploading");
    setError(null);
    setResult(null);
    setElapsed(0);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to start generation");
        setPhase("error");
        return;
      }

      setPhase("processing");
      pollStatus(data.executionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      setPhase("error");
    }
  };

  const handleDownload = (dataUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${name}_sprite_sheet.png`;
    link.click();
  };

  const isLoading = phase === "uploading" || phase === "processing";

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Sprite Sheet Generator</h1>
        <p className="text-[#737373] text-lg">
          Upload a character reference image to generate 4 animation sprite sheets
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
            <p className="text-lg mb-1">Drop your character image here</p>
            <p className="text-sm text-[#737373]">or click to browse</p>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="text-center mb-10">
        <button
          onClick={handleGenerate}
          disabled={!selectedFile || isLoading}
          className={`
            px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200
            ${
              !selectedFile || isLoading
                ? "bg-[#2a2a2a] text-[#737373] cursor-not-allowed"
                : "bg-[#6366f1] hover:bg-[#818cf8] text-white cursor-pointer"
            }
          `}
        >
          {isLoading ? "Generating..." : "Generate Sprite Sheets"}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block w-10 h-10 border-4 border-[#2a2a2a] border-t-[#6366f1] rounded-full animate-spin mb-4" />
          <p className="text-[#737373] mb-2">
            {phase === "uploading"
              ? "Uploading image..."
              : "Generating 4 sprite sheets with AI..."}
          </p>
          <p className="text-[#525252] text-sm">
            {elapsed > 0 && `${elapsed}s elapsed`}
            {phase === "processing" && " - Checking every 5 seconds"}
          </p>
          <div className="mt-4 w-64 mx-auto bg-[#1a1a1a] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-[#6366f1] rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((elapsed / 120) * 100, 95)}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-8 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      {result?.sprites && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Generated Sprite Sheets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SPRITE_TYPES.map(({ key, label, description }) => {
              const spriteData = result.sprites?.[key];
              if (!spriteData) return null;

              return (
                <div
                  key={key}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-[#2a2a2a]">
                    <h3 className="font-semibold text-lg">{label}</h3>
                    <p className="text-sm text-[#737373]">{description}</p>
                  </div>
                  <div className="p-4 bg-[#111] flex items-center justify-center min-h-[200px]">
                    <img
                      src={spriteData}
                      alt={`${label} sprite sheet`}
                      className="max-w-full max-h-[300px] object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <div className="p-3 border-t border-[#2a2a2a]">
                    <button
                      onClick={() => handleDownload(spriteData, key)}
                      className="w-full py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors text-sm font-medium cursor-pointer"
                    >
                      Download {label} Sheet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
