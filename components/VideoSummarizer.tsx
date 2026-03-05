import React, { useState } from "react";
import { useTheme } from "../hooks/ThemeContext";
import { getAIResponse } from "../services/geminiService";

interface VideoSummary {
  id: string;
  videoUrl: string;
  title: string;
  overview: string;
  mainConcepts: string[];
  keyTakeaways: string[];
  definitions: Record<string, string>;
  quickFacts: string[];
  relatedTopics: string[];
  timestamp: Date;
}

const VideoSummarizer: React.FC = () => {
  const { theme } = useTheme();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<VideoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isDark = theme === "dark";
  const borderColor = isDark
    ? "border-[#00e5ff]/30 hover:border-[#00e5ff]/60"
    : "border-cyan-200 hover:border-cyan-400";
  const inputBg = isDark ? "bg-[#1a1a1a]" : "bg-gray-50";

  const detectPlatform = (url: string): string | null => {
    if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
    if (/vimeo\.com/.test(url)) return "vimeo";
    if (/dailymotion\.com/.test(url)) return "dailymotion";
    if (/ted\.com/.test(url)) return "ted";
    if (/twitch\.tv/.test(url)) return "twitch";
    return null;
  };

  const extractVideoId = (url: string): string | null => {
    const platform = detectPlatform(url);

    if (platform === "youtube") {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    } else if (platform === "vimeo") {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    } else if (platform === "dailymotion") {
      const match = url.match(/dailymotion\.com\/video\/([^_]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  const fetchVideoTitle = async (url: string): Promise<string | null> => {
    try {
      const platform = detectPlatform(url);

      if (platform === "youtube") {
        const videoId = extractVideoId(url);
        if (!videoId) return null;

        // Use YouTube oEmbed API (no key required)
        const response = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        );
        if (response.ok) {
          const data = await response.json();
          return data.title || null;
        }
      } else if (platform === "vimeo") {
        const videoId = extractVideoId(url);
        if (!videoId) return null;

        const response = await fetch(
          `https://vimeo.com/api/v2/video/${videoId}.json`,
        );
        if (response.ok) {
          const data = await response.json();
          return data[0]?.title || null;
        }
      }
    } catch (error) {
      console.error("Error fetching video title:", error);
    }
    return null;
  };

  const handleSummarize = async () => {
    if (!videoTitle.trim()) {
      alert("Please enter a video title");
      return;
    }

    setIsLoading(true);
    try {
      let parsedResponse: any = {
        summary: "",
        keyPoints: [],
        learningOutcomes: [],
      };

      // If a local file is chosen, upload it to the backend for transcription + summarization
      if (localFile) {
        const form = new FormData();
        form.append("video", localFile);
        form.append("title", videoTitle);

        const res = await fetch("/api/summarize-video", {
          method: "POST",
          body: form,
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        parsedResponse = await res.json();
      } else {
        // Support multiple video platforms
        if (!videoUrl.trim()) {
          alert("Please enter a video URL or choose a local video");
          setIsLoading(false);
          return;
        }

        const platform = detectPlatform(videoUrl);
        if (!platform) {
          alert(
            "Invalid video URL. Supported platforms: YouTube, Vimeo, Dailymotion, TED, Twitch",
          );
          setIsLoading(false);
          return;
        }

        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
          alert(`Please enter a valid ${platform.toUpperCase()} URL`);
          setIsLoading(false);
          return;
        }

        const prompt = `Create a student-friendly summary for a video titled: "${videoTitle}"

Format EXACTLY as JSON with these keys:
{
  "overview": "1-2 sentence concise overview of the main topic",
  "mainConcepts": ["concept 1 with brief explanation", "concept 2 with brief explanation", "concept 3..."],
  "keyTakeaways": ["memorable point 1", "memorable point 2", "memorable point 3"],
  "definitions": {"term1": "short definition", "term2": "short definition"},
  "quickFacts": ["important fact 1", "important fact 2"],
  "relatedTopics": ["topic 1", "topic 2"]
}

Keep ALL explanations SHORT (1-2 lines max). Students need quick reference, not paragraphs.`;

        const response = await getAIResponse(
          prompt,
          "You are an expert video summarizer creating student-friendly, concise summaries optimized for learning and memory retention.",
          true,
        );

        try {
          parsedResponse = JSON.parse(response);
        } catch {
          parsedResponse = {
            overview: "Unable to generate summary. Please try again.",
            mainConcepts: [],
            keyTakeaways: [],
            definitions: {},
            quickFacts: [],
            relatedTopics: [],
          };
        }
      }

      const summary: VideoSummary = {
        id: Date.now().toString(),
        videoUrl: localFile ? previewUrl || localFile.name : videoUrl,
        title: videoTitle,
        overview: parsedResponse.overview || "",
        mainConcepts: Array.isArray(parsedResponse.mainConcepts)
          ? parsedResponse.mainConcepts
          : [],
        keyTakeaways: Array.isArray(parsedResponse.keyTakeaways)
          ? parsedResponse.keyTakeaways
          : [],
        definitions: parsedResponse.definitions || {},
        quickFacts: Array.isArray(parsedResponse.quickFacts)
          ? parsedResponse.quickFacts
          : [],
        relatedTopics: Array.isArray(parsedResponse.relatedTopics)
          ? parsedResponse.relatedTopics
          : [],
        timestamp: new Date(),
      };

      setSummaries((prev) => [summary, ...prev]);
      setVideoUrl("");
      setVideoTitle("");
      setLocalFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error summarizing video:", error);
      alert("Error summarizing video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getVideoThumbnail = (url: string): string | null => {
    const platform = detectPlatform(url);
    const videoId = extractVideoId(url);

    if (!videoId) return null;

    switch (platform) {
      case "youtube":
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      case "vimeo":
        // Vimeo thumbnails require API call, fallback to placeholder
        return `https://i.vimeocdn.com/video/${videoId}_960.jpg`;
      case "dailymotion":
        return `https://www.dailymotion.com/thumbnail/video/${videoId}`;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-lg border ${borderColor} overflow-hidden transition-colors duration-300`}
    >
      {/* Input Section */}
      <div className={`p-6 ${isDark ? "bg-[#1a1a1a]" : "bg-gray-50"}`}>
        <h3 className="text-xl font-bold mb-4 text-[#00e5ff]">
          🎥 Video Summarizer
        </h3>

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Choose from Gallery (local video)
            </label>
            <input
              type="file"
              accept="video/*"
              disabled={isLoading}
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setLocalFile(f);
                if (f) {
                  setPreviewUrl(URL.createObjectURL(f));
                  if (!videoTitle) {
                    const name = f.name.replace(/\.[^.]+$/, "");
                    setVideoTitle(name);
                  }
                } else {
                  setPreviewUrl(null);
                }
                // Clear URL input when choosing local file
                if (f) setVideoUrl("");
              }}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                isDark
                  ? "bg-[#0a0a0a] border-[#00e5ff]/30 text-white placeholder-gray-500 focus:border-[#00e5ff] focus:outline-none"
                  : "bg-white border-cyan-200 text-gray-900 placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              }`}
            />
          </div>

          <div className="my-2 text-center text-sm text-gray-500">OR</div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Video URL (YouTube, Vimeo, Dailymotion, TED, Twitch)
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={async (e) => {
                const url = e.target.value;
                setVideoUrl(url);

                // Clear local selection when using URL
                if (url.trim()) {
                  setLocalFile(null);
                  setPreviewUrl(null);

                  // Auto-detect and fetch title
                  const platform = detectPlatform(url);
                  if (platform) {
                    const fetchedTitle = await fetchVideoTitle(url);
                    if (fetchedTitle && !videoTitle) {
                      setVideoTitle(fetchedTitle);
                    }
                  }
                }
              }}
              placeholder="https://www.youtube.com/watch?v=... or Vimeo, Dailymotion link"
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                isDark
                  ? "bg-[#0a0a0a] border-[#00e5ff]/30 text-white placeholder-gray-500 focus:border-[#00e5ff] focus:outline-none"
                  : "bg-white border-cyan-200 text-gray-900 placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              }`}
            />
            <p
              className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-600"}`}
            >
              Title will be auto-detected if available
            </p>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Video Title
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter video title or topic"
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                isDark
                  ? "bg-[#0a0a0a] border-[#00e5ff]/30 text-white placeholder-gray-500 focus:border-[#00e5ff] focus:outline-none"
                  : "bg-white border-cyan-200 text-gray-900 placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              }`}
            />
          </div>

          {/* Video Preview: local file preview (preferred) or YouTube thumbnail */}
          {previewUrl ? (
            <div
              className={`rounded-lg overflow-hidden border ${isDark ? "border-[#00e5ff]/20" : "border-cyan-200"}`}
            >
              <video
                src={previewUrl}
                controls
                className="w-full h-40 object-cover"
              />
            </div>
          ) : (
            videoUrl &&
            extractVideoId(videoUrl) && (
              <div
                className={`rounded-lg overflow-hidden border ${isDark ? "border-[#00e5ff]/20" : "border-cyan-200"}`}
              >
                <img
                  src={getVideoThumbnail(videoUrl) || ""}
                  alt="Video thumbnail"
                  className="w-full h-40 object-cover"
                />
              </div>
            )
          )}

          <button
            onClick={handleSummarize}
            disabled={
              isLoading ||
              (!videoUrl.trim() && !localFile) ||
              !videoTitle.trim()
            }
            className={`w-full px-6 py-3 rounded-lg font-bold transition-all ${
              isDark
                ? "bg-[#00e5ff] text-[#0a0a0a] hover:bg-[#00d4e8] disabled:opacity-50"
                : "bg-cyan-400 text-white hover:bg-cyan-500 disabled:opacity-50"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Creating Summary...
              </div>
            ) : (
              "Summarize Video"
            )}
          </button>
        </div>
      </div>

      {/* Summaries List */}
      {summaries.length > 0 && (
        <div
          className={`p-6 border-t ${
            isDark ? "border-[#1a1a1a]" : "border-gray-200"
          }`}
        >
          <h4 className="text-lg font-bold mb-4">Previous Summaries</h4>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {summaries.map((summary) => (
              <div
                key={summary.id}
                className={`p-4 rounded-lg border ${
                  isDark
                    ? "bg-[#0a0a0a] border-[#00e5ff]/20"
                    : "bg-white border-cyan-200"
                }`}
              >
                {/* Thumbnail: show video preview for local blobs or video files, otherwise YouTube thumbnail */}
                {summary.videoUrl &&
                (summary.videoUrl.startsWith("blob:") ||
                  /\.(mp4|webm|mov|mkv)$/i.test(summary.videoUrl)) ? (
                  <video
                    src={summary.videoUrl}
                    controls
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                ) : (
                  getVideoThumbnail(summary.videoUrl) && (
                    <img
                      src={getVideoThumbnail(summary.videoUrl) || ""}
                      alt={summary.title}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )
                )}

                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h5 className="font-bold text-[#00e5ff] line-clamp-2">
                      {summary.title}
                    </h5>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      {summary.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-2 flex-wrap justify-end">
                    <a
                      href={summary.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                        isDark
                          ? "bg-[#00e5ff]/20 text-[#00e5ff] hover:bg-[#00e5ff]/30"
                          : "bg-cyan-100 text-cyan-600 hover:bg-cyan-200"
                      }`}
                    >
                      Watch
                    </a>
                    <button
                      onClick={() => {
                        const defText = Object.entries(summary.definitions)
                          .map(([term, def]) => `${term}: ${def}`)
                          .join("\n");
                        const text = `${summary.title}\n\n📌 OVERVIEW:\n${summary.overview}\n\n📚 MAIN CONCEPTS:\n${summary.mainConcepts.map((c) => `• ${c}`).join("\n")}\n\n⭐ KEY TAKEAWAYS:\n${summary.keyTakeaways.map((t) => `• ${t}`).join("\n")}\n\n📖 DEFINITIONS:\n${defText}\n\n⚡ QUICK FACTS:\n${summary.quickFacts.map((f) => `• ${f}`).join("\n")}\n\n🔗 RELATED TOPICS:\n${summary.relatedTopics.join(", ")}`;
                        navigator.clipboard.writeText(text);
                        alert("Summary copied to clipboard!");
                      }}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                        isDark
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                      title="Copy to clipboard"
                    >
                      Copy
                    </button>
                    <button
                      onClick={async () => {
                        const defText = Object.entries(summary.definitions)
                          .map(([term, def]) => `${term}: ${def}`)
                          .join("\n");
                        const text = `${summary.title}\n\n📌 OVERVIEW:\n${summary.overview}\n\n📚 MAIN CONCEPTS:\n${summary.mainConcepts.map((c) => `• ${c}`).join("\n")}\n\n⭐ KEY TAKEAWAYS:\n${summary.keyTakeaways.map((t) => `• ${t}`).join("\n")}\n\n📖 DEFINITIONS:\n${defText}\n\n⚡ QUICK FACTS:\n${summary.quickFacts.map((f) => `• ${f}`).join("\n")}\n\n🔗 RELATED TOPICS:\n${summary.relatedTopics.join(", ")}`;
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: summary.title,
                              text: text,
                            });
                          } catch (err) {
                            console.log("Share cancelled");
                          }
                        } else {
                          alert("Share not supported on this device");
                        }
                      }}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                        isDark
                          ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                      title="Share summary"
                    >
                      Share
                    </button>
                    <button
                      onClick={() => {
                        const defText = Object.entries(summary.definitions)
                          .map(([term, def]) => `${term}: ${def}`)
                          .join("\n");
                        const text = `Video: ${summary.title}\nSummarized on: ${summary.timestamp.toLocaleString()}\n\n📌 OVERVIEW:\n${summary.overview}\n\n📚 MAIN CONCEPTS:\n${summary.mainConcepts.map((c) => `• ${c}`).join("\n")}\n\n⭐ KEY TAKEAWAYS:\n${summary.keyTakeaways.map((t) => `• ${t}`).join("\n")}\n\n📖 DEFINITIONS:\n${defText}\n\n⚡ QUICK FACTS:\n${summary.quickFacts.map((f) => `• ${f}`).join("\n")}\n\n🔗 RELATED TOPICS:\n${summary.relatedTopics.join(", ")}`;
                        const element = document.createElement("a");
                        element.setAttribute(
                          "href",
                          `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
                        );
                        element.setAttribute(
                          "download",
                          `summary-${Date.now()}.txt`,
                        );
                        element.style.display = "none";
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                        isDark
                          ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                          : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                      }`}
                      title="Export as .txt"
                    >
                      Export
                    </button>
                  </div>
                </div>

                {/* Overview */}
                <div
                  className={`mb-3 p-3 rounded border-l-4 border-[#00e5ff] ${
                    isDark ? "bg-[#1a1a1a]" : "bg-blue-50"
                  }`}
                >
                  <p className="text-sm font-semibold text-[#00e5ff] mb-1">
                    📌 Overview
                  </p>
                  <p className="text-sm leading-relaxed">{summary.overview}</p>
                </div>

                {/* Main Concepts */}
                {summary.mainConcepts.length > 0 && (
                  <div className="mb-3">
                    <p className="font-semibold text-sm mb-2">
                      📚 Main Concepts:
                    </p>
                    <ul className="space-y-1">
                      {summary.mainConcepts.map((concept, idx) => (
                        <li
                          key={idx}
                          className="text-sm flex items-start gap-2"
                        >
                          <span className="text-[#00e5ff] font-bold">
                            {idx + 1}.
                          </span>
                          <span>{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Takeaways */}
                {summary.keyTakeaways.length > 0 && (
                  <div className="mb-3">
                    <p className="font-semibold text-sm mb-2">
                      ⭐ Key Takeaways:
                    </p>
                    <ul className="space-y-1">
                      {summary.keyTakeaways.map((takeaway, idx) => (
                        <li
                          key={idx}
                          className="text-sm flex items-start gap-2"
                        >
                          <span className="text-[#00e5ff] font-bold">✦</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Definitions */}
                {Object.keys(summary.definitions).length > 0 && (
                  <div className="mb-3">
                    <p className="font-semibold text-sm mb-2">
                      📖 Definitions:
                    </p>
                    <div className="space-y-2">
                      {Object.entries(summary.definitions).map(
                        ([term, definition], idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-semibold text-[#00e5ff]">
                              {term}:
                            </span>{" "}
                            <span>{definition}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Facts */}
                {summary.quickFacts.length > 0 && (
                  <div className="mb-3">
                    <p className="font-semibold text-sm mb-2">
                      ⚡ Quick Facts:
                    </p>
                    <ul className="space-y-1">
                      {summary.quickFacts.map((fact, idx) => (
                        <li
                          key={idx}
                          className="text-sm flex items-start gap-2"
                        >
                          <span className="text-[#00e5ff] font-bold">→</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Related Topics */}
                {summary.relatedTopics.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2">
                      🔗 Related Topics:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {summary.relatedTopics.map((topic, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded text-xs ${
                            isDark
                              ? "bg-[#00e5ff]/20 text-[#00e5ff]"
                              : "bg-cyan-100 text-cyan-700"
                          }`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSummarizer;
