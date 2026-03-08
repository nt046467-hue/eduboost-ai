import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";

const TypingAnimation: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const words = [
    "VALIDATED ACADEMICS",
    "GLOBAL DEPLOYMENT",
    "NEURAL ARCHITECTURE",
    "AI-POWERED ENGINE",
    "ENTERPRISE-GRADE",
    "PRODUCTION-READY",
    "REAL-TIME SYNC",
    "ADVANCED ANALYTICS",
    "SECURE INFRASTRUCTURE",
    "SCALABLE PLATFORM",
  ];

  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const speed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText.length + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex]);

  return (
    <div
      className={`mt-40 pt-20 border-t border-white/5 flex items-center justify-center min-h-[120px] animate-fade-in delay-500`}
    >
      <div className="text-center">
        <p
          className={`text-xl md:text-3xl font-black uppercase tracking-[0.2em] mb-4 ${
            isDark ? "text-[#00e5ff]" : "text-cyan-600"
          }`}
        >
          {displayText}
          <span
            className={`animate-pulse ml-1 ${isDark ? "text-[#00e5ff]" : "text-cyan-600"}`}
          >
            |
          </span>
        </p>
        <p
          className={`text-[9px] font-black uppercase tracking-[0.4em] ${
            isDark ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Premium Features for Next-Gen Learning
        </p>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="home"
      className={`relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00e5ff]/10 blur-[150px] rounded-full animate-pulse"></div>
        <div
          className={`absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] blur-[120px] rounded-full ${isDark ? "bg-purple-600/10" : "bg-purple-300/10"}`}
        ></div>
        <div
          className={`absolute inset-0 opacity-[0.03] ${isDark ? "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" : ""}`}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`inline-flex items-center px-5 py-2 rounded-full border border-[#00e5ff]/20 bg-[#00e5ff]/5 text-[#00e5ff] text-[10px] font-black uppercase tracking-[0.3em] mb-12 animate-fade-in-up`}
        >
          <span className="relative flex h-2 w-2 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5ff]"></span>
          </span>
          Next-Gen Academic Engine v2.5.4
        </div>

        <h1
          className={`text-6xl sm:text-7xl md:text-9xl font-extrabold tracking-tighter mb-10 leading-[0.95] animate-fade-in ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Evolve Beyond <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00e5ff] via-white to-gray-500">
            Traditional Study
          </span>
        </h1>

        <p
          className={`max-w-3xl mx-auto text-lg md:text-2xl mb-16 leading-relaxed font-medium animate-fade-in delay-200 ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          The world's most sophisticated AI tutoring ecosystem. Context-aware
          learning interfaces designed for rapid cognitive mastery.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-fade-in delay-300">
          <Link
            to="/guides"
            className="w-full sm:w-auto px-16 py-6 bg-[#00e5ff] text-[#0a0a0a] font-black uppercase tracking-[0.2em] text-[11px] rounded-[2rem] hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-cyan/30 flex items-center justify-center group"
          >
            Explore Library
            <svg
              className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
          <a
            href="#ai-tutor"
            className={`w-full sm:w-auto px-16 py-6 font-black uppercase tracking-[0.2em] text-[11px] rounded-[2rem] border transition-all flex items-center justify-center group ${isDark ? "bg-[#111] text-white border-white/10 hover:border-[#00e5ff]/50" : "bg-gray-100 text-gray-900 border-gray-300 hover:border-[#00e5ff]"}`}
          >
            Initialize Tutor
            <div className="ml-3 w-2.5 h-2.5 bg-[#00e5ff] rounded-full group-hover:scale-150 group-hover:shadow-[0_0_10px_#00e5ff] transition-all"></div>
          </a>
        </div>

        {/* Animated Typing Section */}
        <TypingAnimation isDark={isDark} />
      </div>
    </section>
  );
};

export default Hero;
