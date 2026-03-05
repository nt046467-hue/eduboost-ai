import React, { useState } from "react";
import { useTheme } from "../hooks/ThemeContext";
import VideoSummarizer from "./VideoSummarizer";
import PDFSummarizer from "./PDFSummarizer";
import AdPlacement from "./AdPlacement";

const Summarizer: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"video" | "pdf">("video");

  const isDark = theme === "dark";
  const tabBgInactive = isDark ? "bg-[#1a1a1a]" : "bg-gray-100";
  const textColor = isDark ? "text-white" : "text-gray-900";

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-[#0a0a0a]" : "bg-white"} pt-20 sm:pt-24`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1
            className={`text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 ${textColor}`}
          >
            Content Summarizer
          </h1>
          <p
            className={`text-sm sm:text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Summarize videos and PDFs instantly with AI-powered insights
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("video")}
            style={
              activeTab === "video"
                ? { backgroundColor: "#00e5ff", color: "#000" }
                : undefined
            }
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
              activeTab === "video"
                ? ""
                : `${tabBgInactive} ${textColor} hover:opacity-80`
            }`}
          >
            📹 Video Summarizer
          </button>
          <button
            onClick={() => setActiveTab("pdf")}
            style={
              activeTab === "pdf"
                ? { backgroundColor: "#00e5ff", color: "#000" }
                : undefined
            }
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "pdf"
                ? ""
                : `${tabBgInactive} ${textColor} hover:opacity-80`
            }`}
          >
            📄 PDF Summarizer
          </button>
        </div>

        <AdPlacement position="content" className="my-6" />

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "video" && <VideoSummarizer />}
          {activeTab === "pdf" && <PDFSummarizer />}
        </div>

        <AdPlacement position="content" className="my-6" />
      </div>
    </div>
  );
};

export default Summarizer;
