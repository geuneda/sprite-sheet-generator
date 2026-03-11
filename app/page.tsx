"use client";

import { useState } from "react";
import SpriteGenerator from "@/components/SpriteGenerator";
import SpriteSplitter from "@/components/SpriteSplitter";

type TopTab = "generator" | "splitter";

const TOP_TABS: readonly { key: TopTab; label: string; description: string }[] = [
  { key: "generator", label: "Generate", description: "AI Sprite Sheet" },
  { key: "splitter", label: "Split", description: "2x2 Sheet to 4 Images" },
];

export default function Home() {
  const [activeTopTab, setActiveTopTab] = useState<TopTab>("generator");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top-level Tab Navigation */}
      <div className="flex gap-2 justify-center pt-8 px-4">
        {TOP_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTopTab(tab.key)}
            className={`
              px-8 py-3 rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer
              ${
                activeTopTab === tab.key
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#999] hover:border-[#6366f1] hover:text-white"
              }
            `}
          >
            <span className="block">{tab.label}</span>
            <span className="block text-xs mt-0.5 opacity-70">{tab.description}</span>
          </button>
        ))}
      </div>

      {activeTopTab === "generator" && <SpriteGenerator />}
      {activeTopTab === "splitter" && <SpriteSplitter />}
    </div>
  );
}
