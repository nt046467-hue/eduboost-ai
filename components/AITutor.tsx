import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../hooks/ThemeContext";
import { getAIResponse } from "../services/geminiService";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp?: Date;
}

const AITutor: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "🎓 Hello! I'm your EduBoost AI Tutor. I'm here to help you understand any concept, solve problems, and ace your exams. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    await sendMessage(userMessage);
  };

  const sendMessage = async (userMessage: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);
    setIsLoading(true);

    const aiResponse = await getAIResponse(userMessage);
    setMessages((prev) => [
      ...prev,
      { role: "ai", content: aiResponse, timestamp: new Date() },
    ]);
    setIsLoading(false);
  };

  const suggestedQuestions = [
    "Explain photosynthesis",
    "How do I solve quadratic equations?",
    "What is the theory of evolution?",
    "Help me with essay writing",
  ];

  return (
    <section
      className={`py-24 transition-colors duration-300 ${isDark ? "bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]" : "bg-gradient-to-b from-white to-gray-50"}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span
              className={`text-[#00e5ff] font-bold tracking-widest uppercase text-sm px-4 py-2 rounded-full transition-colors duration-300 ${isDark ? "bg-[#00e5ff]/10" : "bg-cyan-100"}`}
            >
              ✨ Instant AI Tutoring
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#00e5ff] to-cyan-400 bg-clip-text text-transparent">
            Learn Smarter with AI
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Get instant answers, personalized explanations, and expert guidance
            24/7
          </p>
        </div>

        {/* Main Chat Container */}
        <div
          className={`rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 border ${isDark ? "bg-gradient-to-br from-[#0f0f0f] via-[#111] to-[#0a0a0a] border-[#1a1a1a] hover:border-[#00e5ff]/20" : "bg-gradient-to-br from-white via-gray-50 to-gray-100 border-gray-200 hover:border-cyan-300"}`}
        >
          {/* Chat Header */}
          <div
            className={`px-8 py-6 border-b flex items-center justify-between transition-colors duration-300 ${isDark ? "border-[#1a1a1a] bg-gradient-to-r from-[#151515] to-[#0f0f0f]" : "border-gray-200 bg-gradient-to-r from-gray-50 to-white"}`}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 bg-gradient-to-br from-[#00e5ff] to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <h3
                  className={`font-bold text-lg transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  EduBoost AI Tutor
                </h3>
                <p className="text-xs text-[#00e5ff] uppercase font-bold tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00e5ff] rounded-full animate-pulse"></span>
                  Active & Ready to Help
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-lg transition-all ${isDark ? "hover:bg-[#1a1a1a]" : "hover:bg-gray-200"}`}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <svg
                className={`w-5 h-5 text-[#00e5ff] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div
            className={`overflow-y-auto p-8 space-y-6 transition-all duration-300 ${isExpanded ? "h-[700px]" : "h-[600px]"} ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}
          >
            {messages.length === 1 && (
              <div className="mb-8 space-y-3">
                <p
                  className={`text-sm font-semibold transition-colors duration-300 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Try asking about:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(q)}
                      className={`p-3 text-left text-sm rounded-lg transition-all group border ${isDark ? "bg-[#1a1a1a] hover:bg-[#222] border-[#222] hover:border-[#00e5ff]/50" : "bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-cyan-400"}`}
                    >
                      <span
                        className={`transition-colors ${isDark ? "group-hover:text-[#00e5ff]" : "group-hover:text-cyan-600"}`}
                      >
                        {q}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                {msg.role === "ai" && (
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#00e5ff] to-cyan-500 rounded-full flex items-center justify-center text-xs shadow-lg">
                      🤖
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-6 py-4 rounded-2xl text-sm leading-relaxed transition-all ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#00e5ff] to-cyan-400 text-[#0a0a0a] font-medium shadow-lg shadow-cyan-500/20"
                      : isDark
                        ? "bg-[#1a1a1a] text-gray-100 border border-[#222] hover:border-[#00e5ff]/30"
                        : "bg-gray-100 text-gray-900 border border-gray-200 hover:border-cyan-300"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="mr-3 flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#00e5ff] to-cyan-500 rounded-full flex items-center justify-center text-xs shadow-lg shadow-cyan-500/50 animate-pulse">
                    🤖
                  </div>
                </div>
                <div className="bg-[#1a1a1a] px-6 py-4 rounded-2xl border-2 border-[#00e5ff]/40 shadow-xl shadow-cyan-500/30 flex gap-3 items-center">
                  <div className="flex gap-3 items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#00e5ff] rounded-full blur-md opacity-70 animate-pulse"></div>
                      <div className="w-3 h-3 bg-[#00e5ff] rounded-full shadow-lg shadow-cyan-500/60 animate-pulse"></div>
                    </div>
                    <div
                      className="relative"
                      style={{ animationDelay: "0.15s" }}
                    >
                      <div
                        className="absolute inset-0 bg-[#00e5ff] rounded-full blur-md opacity-70 animate-pulse"
                        style={{ animationDelay: "0.15s" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-[#00e5ff] rounded-full shadow-lg shadow-cyan-500/60 animate-pulse"
                        style={{ animationDelay: "0.15s" }}
                      ></div>
                    </div>
                    <div
                      className="relative"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <div
                        className="absolute inset-0 bg-[#00e5ff] rounded-full blur-md opacity-70 animate-pulse"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-[#00e5ff] rounded-full shadow-lg shadow-cyan-500/60 animate-pulse"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs text-[#00e5ff] font-bold tracking-widest ml-2 animate-pulse">
                    THINKING...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div
            className={`p-6 border-t transition-colors duration-300 ${isDark ? "bg-gradient-to-r from-[#151515] to-[#0f0f0f] border-[#1a1a1a]" : "bg-gradient-to-r from-gray-50 to-white border-gray-200"}`}
          >
            <div className="relative flex items-end gap-3">
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                  placeholder="Ask me anything... (Shift+Enter for new line)"
                  className={`w-full border-2 rounded-xl pl-6 pr-6 py-4 focus:outline-none transition-all resize-none ${isDark ? "bg-[#0a0a0a] border-[#222] group-hover:border-[#00e5ff]/30 focus:border-[#00e5ff] text-white placeholder-gray-500" : "bg-white border-gray-300 group-hover:border-cyan-400 focus:border-cyan-500 text-gray-900 placeholder-gray-400"}`}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-8 py-4 bg-gradient-to-r from-[#00e5ff] to-cyan-400 text-[#0a0a0a] font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2 group"
              >
                <span>Send</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.488 5.951 1.488a1 1 0 001.169-1.409l-7-14z" />
                </svg>
              </button>
            </div>
            <p className="mt-3 text-[11px] text-center text-gray-500 font-bold uppercase tracking-widest">
              💡 Powered by Advanced AI • Instant Answers • Always Learning
            </p>
          </div>
        </div>

        {/* Features Below Chat */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`text-center p-6 rounded-xl border transition-all ${isDark ? "bg-[#1a1a1a]/50 border-[#222] hover:border-[#00e5ff]/30" : "bg-gray-100/50 border-gray-200 hover:border-cyan-300"}`}
          >
            <div className="text-3xl mb-2">⚡</div>
            <h3
              className={`font-bold mb-2 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Instant Answers
            </h3>
            <p
              className={`text-sm transition-colors duration-300 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Get accurate, detailed responses in seconds
            </p>
          </div>
          <div
            className={`text-center p-6 rounded-xl border transition-all ${isDark ? "bg-[#1a1a1a]/50 border-[#222] hover:border-[#00e5ff]/30" : "bg-gray-100/50 border-gray-200 hover:border-cyan-300"}`}
          >
            <div className="text-3xl mb-2">🎯</div>
            <h3
              className={`font-bold mb-2 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Personalized Learning
            </h3>
            <p
              className={`text-sm transition-colors duration-300 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Explanations tailored to your level
            </p>
          </div>
          <div
            className={`text-center p-6 rounded-xl border transition-all ${isDark ? "bg-[#1a1a1a]/50 border-[#222] hover:border-[#00e5ff]/30" : "bg-gray-100/50 border-gray-200 hover:border-cyan-300"}`}
          >
            <div className="text-3xl mb-2">🚀</div>
            <h3
              className={`font-bold mb-2 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              24/7 Available
            </h3>
            <p
              className={`text-sm transition-colors duration-300 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Study anytime, anywhere you need help
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default AITutor;
