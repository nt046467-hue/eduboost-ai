import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../hooks/ThemeContext";
import { useLocation } from "react-router-dom";
import { getAIResponse } from "../services/geminiService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const FloatingChatBot: React.FC = () => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      text: "Hi! 👋 How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  // Hide floating chatbot on chatbot page to avoid distraction
  const isChatbotPage = pathname === "/chatbot";

  // Don't render floating chatbot on the main chatbot page
  if (isChatbotPage) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

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
      const response = await getAIResponse(
        inputValue,
        "You are a helpful academic assistant. Answer questions clearly and concisely.",
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
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
    <>
      {/* Floating Button - Responsive positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-40 w-14 h-14 rounded-full font-bold flex items-center justify-center transition-all duration-300 shadow-2xl ${
          isDark
            ? "bg-[#00e5ff] text-[#0a0a0a] hover:scale-110 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            : "bg-cyan-500 text-white hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        } bottom-4 sm:bottom-6 right-4 sm:right-6`}
      >
        <span className="text-2xl">{isOpen ? "✕" : "💬"}</span>
      </button>

      {/* Chat Modal - Fully Responsive */}
      {isOpen && (
        <div
          className={`fixed z-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in border ${
            isDark ? "border-[#00e5ff]/30" : "border-cyan-300/50"
          }
        /* Mobile: Full width with padding */
        w-[calc(100%-2rem)] sm:w-96 max-h-[90vh] sm:max-h-[600px]
        /* Position: bottom for mobile, bottom-right for desktop */
        bottom-20 sm:bottom-24 left-4 right-4 sm:left-auto sm:right-6`}
        >
          {/* Header */}
          <div
            className={`p-4 flex justify-between items-center ${
              isDark ? "bg-[#00e5ff] text-[#0a0a0a]" : "bg-cyan-500 text-white"
            }`}
          >
            <h3 className="font-bold text-lg truncate">EduBoost AI</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl hover:opacity-70 flex-shrink-0 ml-2"
            >
              ✕
            </button>
          </div>

          {/* Messages - Scrollable */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              isDark ? "bg-[#0a0a0a]" : "bg-white"
            }`}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] px-3 py-2 rounded-lg text-sm break-words ${
                    message.sender === "user"
                      ? isDark
                        ? "bg-[#00e5ff]/20 text-[#00e5ff]"
                        : "bg-cyan-100 text-cyan-900"
                      : isDark
                        ? "bg-[#1a1a1a] text-gray-300"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div
                  className={`px-3 py-2 rounded-lg ${
                    isDark ? "bg-[#1a1a1a]" : "bg-gray-100"
                  }`}
                >
                  <div className="flex gap-1">
                    <span
                      className={`w-2 h-2 rounded-full animate-bounce ${
                        isDark ? "bg-[#00e5ff]" : "bg-cyan-500"
                      }`}
                    />
                    <span
                      className={`w-2 h-2 rounded-full animate-bounce delay-100 ${
                        isDark ? "bg-[#00e5ff]" : "bg-cyan-500"
                      }`}
                    />
                    <span
                      className={`w-2 h-2 rounded-full animate-bounce delay-200 ${
                        isDark ? "bg-[#00e5ff]" : "bg-cyan-500"
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Touch-friendly */}
          <form
            onSubmit={handleSendMessage}
            className={`p-3 border-t flex gap-2 ${
              isDark
                ? "border-[#1a1a1a] bg-[#111]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask something..."
              className={`flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none min-h-[2.5rem] ${
                isDark
                  ? "bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder-gray-500 focus:border-[#00e5ff]"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-400"
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all min-h-[2.5rem] flex items-center ${
                isDark
                  ? "bg-[#00e5ff]/20 text-[#00e5ff] hover:bg-[#00e5ff]/30 disabled:opacity-50"
                  : "bg-cyan-100 text-cyan-600 hover:bg-cyan-200 disabled:opacity-50"
              }`}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChatBot;
