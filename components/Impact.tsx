import React, { useState, useEffect } from "react";
import { useTheme } from "../hooks/ThemeContext";

const TypingText: React.FC<{ text: string; isDark: boolean }> = ({
  text,
  isDark,
}) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (displayText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length + 1));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [displayText, text]);

  return (
    <span>
      {displayText}
      {displayText.length < text.length && (
        <span
          className={`animate-pulse ${isDark ? "text-[#00e5ff]" : "text-[#00e5ff]"}`}
        >
          |
        </span>
      )}
    </span>
  );
};

const Impact: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const stats = [
    {
      label: "Students Helped",
      value: "2.5M+",
      description: "Students from all academic levels.",
    },
    {
      label: "Hours Saved",
      value: "10M+",
      description: "Reduced study time through efficiency.",
    },
    {
      label: "Exam Success Rate",
      value: "94%",
      description: "Higher pass rates reported by users.",
    },
    {
      label: "Global Presence",
      value: "180",
      description: "Countries utilizing EduBoost AI.",
    },
  ];

  const steps = [
    { step: "01", text: "Select your subject and current learning goals." },
    { step: "02", text: "Receive a personalized curriculum path instantly." },
    { step: "03", text: "Learn interactively with our AI tutor support." },
    { step: "04", text: "Validate your knowledge with smart assessments." },
  ];

  return (
    <section
      id="impact"
      className={`py-24 relative transition-colors duration-300 ${isDark ? "bg-[#0a0a0a] border-[#1a1a1a]" : "bg-white border-gray-200"} border-y`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#00e5ff] font-bold tracking-widest uppercase text-sm mb-4">
            Our Global Footprint
          </h2>
          <p
            className={`text-3xl md:text-4xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Measurable Impact in Education
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-5xl font-black text-[#00e5ff] mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div
                className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {stat.label}
              </div>
              <p
                className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
              >
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-20 pt-20 border-t transition-colors ${isDark ? "border-[#1a1a1a]" : "border-gray-200"}`}
        >
          <div className="text-center mb-16">
            <h3
              className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              <TypingText text="How to Get Started" isDark={isDark} />
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {steps.map((item, idx) => (
              <div
                key={item.step}
                className="flex items-start gap-4 animate-fade-in-up p-6 rounded-2xl transition-all"
                style={{
                  animationDelay: `${idx * 150}ms`,
                  ...(!isDark
                    ? { backgroundColor: "#f3f4f6" }
                    : { backgroundColor: "#111" }),
                }}
              >
                <span
                  className={`text-2xl font-black flex-shrink-0 ${isDark ? "text-[#00e5ff]/20" : "text-[#00e5ff]/30"}`}
                >
                  {item.step}
                </span>
                <p
                  className={`font-medium pt-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
