import React from "react";
import { useTheme } from "../hooks/ThemeContext";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen pt-32 pb-24 ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/"
          className="mb-12 inline-flex items-center text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 hover:text-[#00e5ff] transition-all group"
        >
          <svg
            className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back Home
        </Link>

        {/* Header */}
        <h1
          className={`text-4xl md:text-5xl font-black mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          About EduBoost AI
        </h1>
        <p
          className={`text-lg mb-12 ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          Transforming education through intelligent learning technology
        </p>

        {/* Mission */}
        <div className="mb-12">
          <h2
            className={`text-2xl font-bold mb-4 ${isDark ? "text-[#00e5ff]" : "text-blue-600"}`}
          >
            Our Mission
          </h2>
          <p
            className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            EduBoost AI is dedicated to making quality education accessible to
            students worldwide. We combine cutting-edge AI technology with
            proven educational methodologies to create personalized learning
            experiences that adapt to each student's unique needs.
          </p>
        </div>

        {/* Vision */}
        <div className="mb-12">
          <h2
            className={`text-2xl font-bold mb-4 ${isDark ? "text-[#00e5ff]" : "text-blue-600"}`}
          >
            Our Vision
          </h2>
          <p
            className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            We envision a world where every student has access to personalized,
            AI-powered educational tools that help them learn faster, retain
            more, and achieve their academic goals. Our platform is built on the
            belief that technology should enhance, not replace, human learning.
          </p>
        </div>

        {/* What We Offer */}
        <div className="mb-12">
          <h2
            className={`text-2xl font-bold mb-6 ${isDark ? "text-[#00e5ff]" : "text-blue-600"}`}
          >
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: "📚",
                title: "AI Study Guides",
                desc: "Comprehensive, AI-generated study materials for every subject",
              },
              {
                icon: "🤖",
                title: "AI Tutor",
                desc: "24/7 personalized AI tutoring powered by Google Gemini",
              },
              {
                icon: "🎮",
                title: "Interactive Games",
                desc: "Gamified learning experiences like Word Clash and Definer Duel",
              },
              {
                icon: "📹",
                title: "Content Summarizer",
                desc: "AI-powered video and PDF summarization tools",
              },
              {
                icon: "📖",
                title: "Learning Blog",
                desc: "Regular insights and articles on study tips and techniques",
              },
              {
                icon: "🎯",
                title: "Multi-Subject Coverage",
                desc: "Support for mathematics, science, history, programming, and more",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl border ${isDark ? "bg-[#1a1a1a] border-[#2a2a2a]" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3
                  className={`font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-12">
          <h2
            className={`text-2xl font-bold mb-4 ${isDark ? "text-[#00e5ff]" : "text-blue-600"}`}
          >
            Our Team
          </h2>
          <p
            className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            EduBoost AI is built by a passionate team of educators, AI
            engineers, and technology enthusiasts committed to revolutionizing
            how students learn. We continuously innovate to bring the latest AI
            advancements to educational technology.
          </p>
        </div>

        {/* Get Started */}
        <div
          className={`p-8 rounded-xl border ${isDark ? "bg-[#1a1a1a] border-[#00e5ff]/30" : "bg-blue-50 border-blue-200"} text-center`}
        >
          <h3
            className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Ready to Transform Your Learning?
          </h3>
          <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Start exploring our AI-powered study tools today, completely free.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-[#00e5ff] text-black font-bold rounded-lg hover:bg-cyan-400 transition-all"
          >
            Get Started
          </Link>
        </div>

        {/* Contact */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2
            className={`text-2xl font-bold mb-4 ${isDark ? "text-[#00e5ff]" : "text-blue-600"}`}
          >
            Contact Us
          </h2>
          <p
            className={`text-base mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            Have questions? We'd love to hear from you!
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-2 text-[#00e5ff] font-bold hover:underline"
          >
            Contact Us →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

