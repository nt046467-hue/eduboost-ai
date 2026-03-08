import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../hooks/ThemeContext";
import { getAIResponse } from "../services/geminiService";
import PDFSummarizer from "./PDFSummarizer";
import VideoSummarizer from "./VideoSummarizer";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "pdf" | "video";
}

const AIChatbot: React.FC = () => {
  const { theme } = useTheme() || { theme: "dark" };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      text: "Hi! 👋 I'm your EduBoost AI tutor. I can help you with:\n\n📝 Chat about any topic\n📄 Summarize PDFs\n🎥 Summarize videos\n\nWhat would you like to learn today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "pdf" | "video">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use theme directly - don't depend on mounted state
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#0a0a0a]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const borderColor = isDark
    ? "border-[#00e5ff]/30 hover:border-[#00e5ff]/60"
    : "border-cyan-200 hover:border-cyan-400";
  const messageBgUser = isDark ? "bg-[#00e5ff]/20" : "bg-cyan-100";
  const messageBgBot = isDark ? "bg-[#1a1a1a]" : "bg-gray-100";
  const inputBg = isDark ? "bg-[#1a1a1a]" : "bg-gray-50";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Get AI response
      const response = await getAIResponse(
        inputValue,
        "You are an expert academic tutor for EduBoost AI. Help students with their questions clearly and concisely.",
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="chatbot"
      className={`w-full py-12 transition-colors duration-300 ${bgColor} ${textColor}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#00e5ff] to-cyan-400 bg-clip-text text-transparent">
            EduBoost AI Tutor
          </h1>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Your intelligent learning companion
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex gap-2 mb-6 p-1 rounded-lg ${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"}`}
        >
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              activeTab === "chat"
                ? isDark
                  ? "bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50"
                  : "bg-cyan-100 text-cyan-600 border border-cyan-300"
                : isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              activeTab === "pdf"
                ? isDark
                  ? "bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50"
                  : "bg-cyan-100 text-cyan-600 border border-cyan-300"
                : isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📄 PDF Summary
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              activeTab === "video"
                ? isDark
                  ? "bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50"
                  : "bg-cyan-100 text-cyan-600 border border-cyan-300"
                : isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🎥 Video Summary
          </button>
        </div>

        {/* Content Sections */}
        {activeTab === "chat" && (
          <div
            className={`rounded-lg border ${borderColor} ${messageBgBot} overflow-hidden flex flex-col h-[600px] transition-colors duration-300`}
          >
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? `${messageBgUser} ${isDark ? "text-[#00e5ff]" : "text-cyan-700"}`
                        : `${isDark ? "bg-[#1a1a1a] text-gray-300" : "bg-gray-200 text-gray-800"}`
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">
                      {message.text}
                    </p>
                    <span
                      className={`text-xs mt-1 block ${
                        isDark ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isDark ? "bg-[#1a1a1a]" : "bg-gray-200"
                    }`}
                  >
                    <div className="flex space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          isDark ? "bg-[#00e5ff]" : "bg-cyan-500"
                        }`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce delay-100 ${
                          isDark ? "bg-[#00e5ff]" : "bg-cyan-500"
                        }`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce delay-200 ${
                          isDark ? "bg-[#00e5ff]" : "bg-cyan-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className={`border-t ${isDark ? "border-[#1a1a1a]" : "border-gray-200"} p-4 flex gap-2`}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  isDark
                    ? "bg-[#1a1a1a] border-[#00e5ff]/30 text-white placeholder-gray-500 focus:border-[#00e5ff] focus:outline-none"
                    : "bg-gray-50 border-cyan-200 text-gray-900 placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                }`}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  isDark
                    ? "bg-[#00e5ff]/20 text-[#00e5ff] hover:bg-[#00e5ff]/30 disabled:opacity-50 border border-[#00e5ff]/50"
                    : "bg-cyan-100 text-cyan-600 hover:bg-cyan-200 disabled:opacity-50 border border-cyan-300"
                }`}
              >
                Send
              </button>
            </form>
          </div>
        )}

        {activeTab === "pdf" && <PDFSummarizer />}
        {activeTab === "video" && <VideoSummarizer />}
      </div>
    </section>
  );
};

export default AIChatbot;
