import React, { useState, useEffect } from "react";
import { useTheme } from "../hooks/ThemeContext";
import { FAQS } from "../constants";

const FAQItem: React.FC<{
  question: string;
  answer: string;
  theme: string;
}> = ({ question, answer, theme }) => {
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border-b last:border-0 transition-colors ${isDark ? "border-[#1a1a1a]" : "border-gray-200"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-[#00e5ff] transition-colors focus:outline-none"
      >
        <span
          className={`text-lg font-bold pr-8 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {question}
        </span>
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"}`}
      >
        <p
          className={`leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    // Force page to scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <section
      id="faq"
      className={`w-full min-h-screen py-24 transition-colors duration-300 ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#00e5ff] font-bold tracking-widest uppercase text-sm mb-4">
            Support Center
          </h2>
          <p
            className={`text-3xl md:text-4xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Common Questions
          </p>
        </div>

        <div
          className={`border rounded-3xl p-8 shadow-2xl transition-colors ${isDark ? "bg-[#111] border-[#1a1a1a]" : "bg-gray-50 border-gray-200"}`}
        >
          {FAQS.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
