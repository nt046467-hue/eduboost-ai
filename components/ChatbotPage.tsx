import { useTheme } from "../hooks/ThemeContext";
import AIChatbot from "./AIChatbot";
import React, { useEffect, useState } from "react";

const ChatbotPage = () => {
  const [mounted, setMounted] = useState(false);
  const themeContext = useTheme();
  const isDark = themeContext?.theme === "dark" ?? true;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !themeContext) {
    return (
      <div className="pt-20 min-h-screen bg-[#0a0a0a]">
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
          <p className="text-gray-400">Initializing...</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="pt-16 sm:pt-20">
        {/* Header Section */}
        <section
          className={`py-12 sm:py-16 px-4 ${isDark ? "bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]" : "bg-gradient-to-b from-gray-50 to-white"}`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#00e5ff] to-cyan-400 bg-clip-text text-transparent">
              EduBoost AI Tutor
            </h1>
            <p
              className={`text-xs sm:text-lg ${isDark ? "text-gray-400" : "text-gray-600"} mb-6 sm:mb-8`}
            >
              Your intelligent learning companion powered by advanced AI. Chat,
              summarize PDFs, and learn faster.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm ${isDark ? "bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30" : "bg-cyan-100 text-cyan-700 border border-cyan-300"}`}
              >
                💬 Real-time Chat
              </div>
              <div
                className={`px-4 py-2 rounded-full text-sm ${isDark ? "bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30" : "bg-cyan-100 text-cyan-700 border border-cyan-300"}`}
              >
                📄 PDF Summarizer
              </div>
              <div
                className={`px-4 py-2 rounded-full text-sm ${isDark ? "bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30" : "bg-cyan-100 text-cyan-700 border border-cyan-300"}`}
              >
                🎥 Video Summarizer
              </div>
            </div>
          </div>
        </section>

        {/* Chatbot Section */}
        <section className={`py-12 ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}>
          <React.Suspense
            fallback={
              <div className="text-center py-12 text-gray-400">
                Loading chatbot...
              </div>
            }
          >
            <AIChatbot />
          </React.Suspense>
        </section>

        {/* Benefits Section */}
        <section
          className={`py-16 px-4 ${isDark ? "bg-[#1a1a1a]" : "bg-gray-50"}`}
        >
          <div className="max-w-4xl mx-auto">
            <h2
              className={`text-3xl font-bold mb-12 text-center ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Why Use EduBoost AI Tutor?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Benefit 1 */}
              <div
                className={`p-6 rounded-lg ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}
              >
                <div className="text-3xl mb-4">⚡</div>
                <h3
                  className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Instant Answers
                </h3>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Get immediate responses to any academic question with detailed
                  explanations.
                </p>
              </div>

              {/* Benefit 2 */}
              <div
                className={`p-6 rounded-lg ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}
              >
                <div className="text-3xl mb-4">📚</div>
                <h3
                  className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Smart Summarization
                </h3>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Quickly understand PDFs and videos with AI-powered summaries.
                </p>
              </div>

              {/* Benefit 3 */}
              <div
                className={`p-6 rounded-lg ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}
              >
                <div className="text-3xl mb-4">🎯</div>
                <h3
                  className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Learn Better
                </h3>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Master any subject with personalized AI guidance and
                  explanations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("ChatbotPage Error:", error);
    return (
      <div className="pt-20 min-h-screen bg-[#0a0a0a]">
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400">Failed to load chatbot</p>
        </div>
      </div>
    );
  }
};

export default ChatbotPage;
