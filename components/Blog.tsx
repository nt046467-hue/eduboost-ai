import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BLOG_POSTS } from "../constants";
import { useTheme } from "../hooks/ThemeContext";

const Blog: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isDedicatedPage = location.pathname === "/blog";
  const isDark = theme === "dark";
  const [sharedId, setSharedId] = useState<string | null>(null);

  const displayPosts = useMemo(() => {
    return isDedicatedPage ? BLOG_POSTS : BLOG_POSTS.slice(0, 3);
  }, [isDedicatedPage]);

  const handleQuickShare = async (e: React.MouseEvent, post: any) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#/blog/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url: shareUrl });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setSharedId(post.id);
      setTimeout(() => setSharedId(null), 2000);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.className = e.currentTarget.className + " opacity-40";
  };

  return (
    <section
      id="blog"
      className={`py-24 transition-all duration-500 ${isDark ? "bg-[#0a0a0a] border-[#1a1a1a]" : "bg-white border-gray-200"} border-t ${isDedicatedPage ? "pt-32" : ""}`}
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
            Back to Dashboard
          </button>
        )}

        <div className="text-center mb-16">
          <h2 className="text-[#00e5ff] font-bold tracking-widest uppercase text-xs mb-4">
            Journal Reflections
          </h2>
          <p
            className={`text-3xl md:text-5xl font-extrabold tracking-tighter ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Academic Insights & Musings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {displayPosts.map((post, idx) => (
            <div
              key={post.id}
              className={`flex flex-col md:flex-row gap-6 group relative ${idx === 0 && isDedicatedPage ? "lg:col-span-2" : ""}`}
            >
              <div
                className={`rounded-3xl overflow-hidden border transition-all ${isDark ? "bg-[#111] border-[#1a1a1a] group-hover:border-[#00e5ff]/20" : "bg-gray-100 border-gray-200 group-hover:border-[#00e5ff]/50"} ${idx === 0 && isDedicatedPage ? "md:w-1/2 aspect-video" : "w-full md:w-48 h-48 flex-shrink-0"}`}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  onError={handleImageError}
                  loading="lazy"
                  decoding="async"
                  width={idx === 0 && isDedicatedPage ? 600 : 192}
                  height={idx === 0 && isDedicatedPage ? 336 : 192}
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 py-2 flex flex-col relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#00e5ff]">
                    <span className="bg-[#00e5ff]/10 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-gray-500">{post.date}</span>
                  </div>
                  <button
                    onClick={(e) => handleQuickShare(e, post)}
                    className="p-2 text-gray-500 hover:text-[#00e5ff] transition-colors relative z-20"
                  >
                    {sharedId === post.id ? (
                      <span className="text-[#00e5ff] font-black text-xs">
                        ✓
                      </span>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <h3
                  className={`${idx === 0 && isDedicatedPage ? "text-3xl" : "text-xl"} font-bold mb-4 group-hover:text-[#00e5ff] transition-colors leading-tight ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {post.title}
                </h3>
                <p
                  className={`line-clamp-2 mb-6 leading-relaxed text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1a1a1a] rounded-full border border-[#333] flex items-center justify-center text-[10px] font-bold text-[#00e5ff]">
                      {post.author.charAt(0)}
                    </div>
                    <span
                      className={`text-xs font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {post.author}
                    </span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-transparent text-[#00e5ff] rounded-xl border border-[#00e5ff]/30 hover:bg-[#00e5ff] hover:text-[#0a0a0a] transition-all shadow-lg"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isDedicatedPage && (
          <div className="mt-20 text-center">
            <Link
              to="/blog"
              className={`inline-block px-12 py-5 border font-black uppercase tracking-widest text-[10px] rounded-2xl hover:border-[#00e5ff] hover:text-[#00e5ff] transition-all ${isDark ? "bg-[#0a0a0a] border-[#1a1a1a] text-white" : "bg-gray-50 border-gray-300 text-gray-900"}`}
            >
              Enter Journal Archive
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
