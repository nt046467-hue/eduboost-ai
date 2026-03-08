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

const TypingStepText: React.FC<{
  text: string;
  isDark: boolean;
  delay: number;
}> = ({ text, isDark, delay }) => {
  const [displayText, setDisplayText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  // Start the animation after delay
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  // Type out the text character by character
  useEffect(() => {
    if (!hasStarted) return;

    if (displayText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length + 1));
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [displayText, text, hasStarted]);

  return <span>{displayText}</span>;
};

const FeatureCard = ({
  title,
  description,
  icon,
  theme,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  theme: string;
}) => {
  const isDark = theme === "dark";
  return (
    <div
      className={`p-8 rounded-2xl border transition-all group ${isDark ? "bg-[#111] border-[#1a1a1a] hover:border-[#00e5ff]/50" : "bg-white border-gray-200 hover:border-[#00e5ff]"}`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00e5ff] transition-all duration-500 ${isDark ? "bg-[#00e5ff]/10" : "bg-cyan-100"}`}
      >
        <div
          className={`group-hover:text-[#0a0a0a] transition-colors ${isDark ? "text-[#00e5ff]" : "text-[#00e5ff]"}`}
        >
          {icon}
        </div>
      </div>
      <h3
        className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
      >
        {title}
      </h3>
      <p
        className={`leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
      >
        {description}
      </p>
    </div>
  );
};

const Features: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="features"
      className={`py-24 transition-colors duration-300 ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#00e5ff] font-bold tracking-widest uppercase text-sm mb-4">
            Core Capabilities
          </h2>
          <p
            className={`text-3xl md:text-4xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Next-Gen Tools for Modern Students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="AI Guidance"
            description="Our neural-network powered tutor breaks down complex topics into bite-sized, understandable components tailored to your learning speed."
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
            theme={theme}
          />
          <FeatureCard
            title="Smart Quizzes"
            description="Adaptive testing that evolves with you. The more you learn, the smarter the questions become, ensuring you're always challenged but never overwhelmed."
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            }
            theme={theme}
          />
          <FeatureCard
            title="Progress Tracking"
            description="Visualize your mastery with granular analytics. Identify precisely which sub-topics need more focus before your next big exam."
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
            theme={theme}
          />
        </div>

        <div
          className={`mt-16 border rounded-3xl p-8 md:p-12 transition-colors ${isDark ? "bg-[#111] border-[#1a1a1a]" : "bg-gray-50 border-gray-200"}`}
        >
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h3
                className={`text-2xl md:text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <TypingText text="How It Works" isDark={isDark} />
              </h3>
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    text: "Select your subject and current learning goals.",
                  },
                  {
                    step: "02",
                    text: "Receive a personalized curriculum path instantly.",
                  },
                  {
                    step: "03",
                    text: "Learn interactively with our AI tutor support.",
                  },
                  {
                    step: "04",
                    text: "Validate your knowledge with smart assessments.",
                  },
                ].map((item, idx) => (
                  <div
                    key={item.step}
                    className="flex items-center gap-4 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 200}ms` }}
                  >
                    <span
                      className={`text-2xl font-black ${isDark ? "text-[#00e5ff]/20" : "text-[#00e5ff]/30"}`}
                    >
                      {item.step}
                    </span>
                    <p
                      className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      <TypingStepText
                        text={item.text}
                        isDark={isDark}
                        delay={idx * 2500}
                      />
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div
                className={`aspect-video rounded-2xl border flex items-center justify-center p-8 overflow-hidden transition-colors ${isDark ? "bg-[#0a0a0a] border-[#1a1a1a]" : "bg-white border-gray-200"}`}
              >
                <div
                  className={`w-full h-full rounded-lg border p-4 font-mono text-sm overflow-hidden ${isDark ? "bg-[#111] border-[#00e5ff]/10" : "bg-gray-50 border-cyan-200"}`}
                >
                  <div className="text-cyan-400 mb-2">
                    // Analyzing learning patterns...
                  </div>
                  <div className={isDark ? "text-gray-500" : "text-gray-600"}>
                    User_ID: std_8923
                  </div>
                  <div className={isDark ? "text-gray-500" : "text-gray-600"}>
                    Status: Mastery increasing
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div
                      className={`h-4 rounded w-full overflow-hidden ${isDark ? "bg-[#00e5ff]/20" : "bg-cyan-200"}`}
                    >
                      <div className="h-full bg-[#00e5ff] w-[75%]"></div>
                    </div>
                    <span className="text-xs text-[#00e5ff]">75%</span>
                  </div>
                  <div
                    className={`mt-4 text-xs leading-tight ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    "Great job! You've mastered 3D Vectors. Moving to Matrix
                    Transformations..."
                  </div>
                </div>
                <div
                  className={`absolute inset-0 bg-gradient-to-t to-transparent ${isDark ? "from-[#00e5ff]/5" : "from-[#00e5ff]/10"}`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
