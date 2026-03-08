import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { STUDY_GUIDES } from "../constants";
import { useTheme } from "../hooks/ThemeContext";

const StudyGuides: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isDedicatedPage = location.pathname === "/guides";
  const isDark = theme === "dark";

  const [sharedId, setSharedId] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<
    "All" | "Beginner" | "Intermediate" | "Advanced"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleQuickShare = async (e: React.MouseEvent, guide: any) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#/guides/${guide.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: guide.title, url: shareUrl });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setSharedId(guide.id);
      setTimeout(() => setSharedId(null), 2000);
    }
  };

  const filteredGuides = useMemo(() => {
    return STUDY_GUIDES.filter((guide) => {
      const matchesDifficulty =
        difficultyFilter === "All" || guide.difficulty === difficultyFilter;
      const matchesSearch =
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDifficulty && matchesSearch;
    });
  }, [difficultyFilter, searchQuery]);

  const displayGuides = useMemo(() => {
    return isDedicatedPage ? filteredGuides : filteredGuides.slice(0, 3);
  }, [filteredGuides, isDedicatedPage]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.className = e.currentTarget.className + " opacity-40";
  };

  return (
    <section
      id="study-guides"
      className={`py-24 transition-all duration-700 ${isDark ? "bg-[#0a0a0a]" : "bg-white"} ${isDedicatedPage ? "pt-40" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isDedicatedPage && (
          <button
            onClick={() => navigate("/")}
            className="mb-12 flex items-center text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 hover:text-[#00e5ff] transition-all group"
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
            Command Dashboard
          </button>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
          <div className="text-left max-w-2xl">
            <h2 className="text-[#00e5ff] font-bold tracking-[0.3em] uppercase text-[10px] mb-4">
              Subject Repositories
            </h2>
            <p className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-none">
              {isDedicatedPage ? "Knowledge Collective" : "High-Impact Guides"}
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-64 group">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00e5ff]/50 transition-all ${isDark ? "bg-[#111] border-white/5 text-gray-200" : "bg-white border-gray-300 text-gray-900"}`}
              />
              <svg
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00e5ff] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Difficulty Filter Buttons */}
            <div
              className={`flex p-1.5 rounded-[1.5rem] border shadow-2xl overflow-x-auto max-w-full ${isDark ? "bg-[#111] border-white/5" : "bg-gray-100 border-gray-300"}`}
            >
              {["All", "Beginner", "Intermediate", "Advanced"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDifficultyFilter(opt as any)}
                  className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] rounded-xl whitespace-nowrap transition-all duration-500 ${difficultyFilter === opt ? "bg-[#00e5ff] text-[#0a0a0a] shadow-[0_10px_30px_rgba(0,229,255,0.3)]" : isDark ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {displayGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fade-in">
            {displayGuides.map((guide) => (
              <div
                key={guide.id}
                className={`group relative border rounded-[3rem] overflow-hidden hover:border-[#00e5ff]/30 transition-all duration-500 flex flex-col shadow-2xl hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)] ${isDark ? "bg-[#0d0d0d] border-white/5" : "bg-gray-50 border-gray-200"}`}
              >
                <Link
                  to={`/guides/${guide.id}`}
                  className="absolute inset-0 z-10"
                />

                <div className="relative h-64 overflow-hidden">
                  <img
                    src={guide.imageUrl}
                    alt={guide.title}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={256}
                    onError={handleImageError}
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t to-transparent ${isDark ? "from-[#0d0d0d] via-[#0d0d0d]/40" : "from-gray-50 via-gray-50/40"}`}
                  ></div>

                  <div className="absolute bottom-6 left-8 z-20">
                    <div
                      className={`px-4 py-2 backdrop-blur-xl border rounded-xl ${isDark ? "bg-black/60 border-white/10" : "bg-white/60 border-gray-300/50"}`}
                    >
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00e5ff]">
                        {guide.subject}
                      </span>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 z-20">
                    <button
                      onClick={(e) => handleQuickShare(e, guide)}
                      className={`w-10 h-10 backdrop-blur-xl rounded-full flex items-center justify-center transition-all hover:text-[#00e5ff] hover:border-[#00e5ff]/30 ${isDark ? "bg-black/40 text-white/50 border-white/5" : "bg-white/40 text-gray-600/50 border-gray-300/30"} border`}
                    >
                      {sharedId === guide.id ? (
                        <span className="text-[#00e5ff] font-bold">✓</span>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-10 flex-1 flex flex-col">
                  <h3
                    className={`text-2xl font-bold mb-5 group-hover:text-white transition-colors leading-[1.1] ${isDark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {guide.title}
                  </h3>
                  <p
                    className={`text-sm mb-10 flex-1 line-clamp-3 leading-relaxed font-medium ${isDark ? "text-gray-500" : "text-gray-600"}`}
                  >
                    {guide.summary}
                  </p>

                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${guide.difficulty === "Advanced" ? "bg-red-500 shadow-red-500" : guide.difficulty === "Intermediate" ? "bg-yellow-500 shadow-yellow-500" : "bg-green-500 shadow-green-500"}`}
                      ></div>
                      <span
                        className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? "text-gray-500" : "text-gray-600"}`}
                      >
                        {guide.difficulty} • {guide.readTime}
                      </span>
                    </div>
                    <div
                      className={`font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 group-hover:text-[#00e5ff] ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Initialize
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`py-20 text-center rounded-[3rem] border-dashed ${isDark ? "bg-[#111] border-white/10" : "bg-gray-100 border-gray-300/50"} border`}
          >
            <p
              className={`font-bold uppercase tracking-widest text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
            >
              No matching resources found
            </p>
            <button
              onClick={() => {
                setDifficultyFilter("All");
                setSearchQuery("");
              }}
              className="mt-4 text-[#00e5ff] font-black text-xs uppercase tracking-widest border-b border-[#00e5ff]/30 hover:border-[#00e5ff] transition-all pb-1"
            >
              Reset Filters
            </button>
          </div>
        )}

        {!isDedicatedPage && (
          <div className="mt-24 text-center">
            <Link
              to="/guides"
              className={`inline-block px-16 py-6 font-black uppercase tracking-[0.3em] text-[11px] rounded-[2.5rem] shadow-2xl transition-all active:scale-95 ${isDark ? "bg-white text-[#0a0a0a] hover:bg-[#00e5ff]" : "bg-gray-900 text-white hover:bg-[#00e5ff] hover:text-gray-900"}`}
            >
              Access Complete Archive
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyGuides;
