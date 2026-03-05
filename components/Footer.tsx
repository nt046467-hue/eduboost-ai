import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Twitter",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      className={`pt-20 pb-10 border-t transition-colors duration-300 ${isDark ? "bg-[#050505] border-[#1a1a1a]" : "bg-gray-50 border-gray-200"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-[#00e5ff] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold">E</span>
              </div>
              <span className="text-2xl font-bold tracking-tighter">
                <span className={isDark ? "text-white" : "text-gray-900"}>
                  EduBoost
                </span>{" "}
                <span className="text-[#00e5ff]">AI</span>
              </span>
            </Link>
            <p
              className={`mb-8 leading-relaxed ${isDark ? "text-gray-500" : "text-gray-600"}`}
            >
              Empowering the next generation of scholars through artificial
              intelligence and open educational resources. Accessible to
              everyone, everywhere.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 ${isDark ? "bg-[#111] border-[#1a1a1a] text-gray-400 hover:text-[#00e5ff] hover:border-[#00e5ff]/50" : "bg-white border-gray-300 text-gray-600 hover:text-[#00e5ff] hover:border-[#00e5ff]"} hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4
              className={`font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Platform
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/guides"
                  className={`transition-colors ${isDark ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Study Guides Library
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className={`transition-colors ${isDark ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  EduBoost Journal
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className={`transition-colors ${isDark ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Support Center
                </Link>
              </li>
              <li>
                <Link
                  to="/#impact"
                  className={`transition-colors ${isDark ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Our Global Impact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4
              className={`font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/privacy"
                  className={`transition-colors ${isDark ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/trust"
                  className={`transition-colors ${isDark ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className={`transition-colors ${isDark ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className={`transition-colors ${isDark ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium transition-colors ${isDark ? "border-[#1a1a1a] text-gray-600" : "border-gray-200 text-gray-600"}`}
        >
          <p>© {currentYear} EduBoost AI Global. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Systems Operational
            </span>
            <span>Version 2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
