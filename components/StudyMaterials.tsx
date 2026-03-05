import React, { useState, useMemo } from "react";
import { STUDY_MATERIALS } from "../constants";
import { MediaViewer } from "./MediaViewer";
import { useTheme } from "../hooks/ThemeContext";
import { usePDFSummarizer, useVideoSummarizer } from "../hooks/useSummarizer";

const StudyMaterials: React.FC = () => {
  const { theme } = useTheme();
  const [selectedMaterial, setSelectedMaterial] = useState<
    (typeof STUDY_MATERIALS)[0] | null
  >(null);
  const [subjectFilter, setSubjectFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | "PDF" | "VIDEO">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Add summarizers
  const { summaries: pdfSummaries, generateSummary: generatePDFSummary } =
    usePDFSummarizer();
  const { summaries: videoSummaries, generateSummary: generateVideoSummary } =
    useVideoSummarizer();

  // Get unique subjects
  const subjects = useMemo(() => {
    const subs = new Set(STUDY_MATERIALS.map((m) => m.subject));
    return ["All", ...Array.from(subs)];
  }, []);

  // Filter materials
  const filteredMaterials = useMemo(() => {
    return STUDY_MATERIALS.filter((material) => {
      const matchesSubject =
        subjectFilter === "All" || material.subject === subjectFilter;
      const matchesType = typeFilter === "All" || material.type === typeFilter;
      const matchesSearch =
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSubject && matchesType && matchesSearch;
    });
  }, [subjectFilter, typeFilter, searchQuery]);

  const bgClass = theme === "light" ? "bg-white" : "bg-[#0a0a0a]";
  const textClass = theme === "light" ? "text-gray-900" : "text-white";
  const cardClass =
    theme === "light"
      ? "bg-gray-50 border-gray-200 hover:border-[#00e5ff]"
      : "bg-[#1a1a1a] border-[#374151] hover:border-[#00e5ff]";
  const inputClass =
    theme === "light"
      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
      : "bg-[#111827] border-[#374151] text-white placeholder-gray-400";
  const buttonClass = (active: boolean) =>
    active
      ? "bg-[#00e5ff] text-[#0a0a0a] font-bold"
      : theme === "light"
        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
        : "bg-[#1a1a1a] text-gray-300 hover:bg-[#374151]";

  return (
    <>
      <section
        className={`min-h-screen ${bgClass} ${textClass} py-8 sm:py-16 md:py-24 transition-colors`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="text-[#00e5ff] font-bold tracking-widest uppercase text-xs sm:text-sm bg-[#00e5ff]/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                📚 Study Materials Library
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-[#00e5ff] to-cyan-400 bg-clip-text text-transparent">
              Curated Learning Resources
            </h2>
            <p
              className={`text-xs sm:text-base md:text-lg max-w-2xl mx-auto ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
            >
              PDFs, videos, and interactive materials to master every subject
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search by title, chapter, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 sm:px-6 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-[#00e5ff] transition-all text-sm sm:text-base ${inputClass}`}
              />
            </div>

            {/* Subject Filter */}
            <div>
              <label
                className={`block text-xs sm:text-sm font-bold mb-2 sm:mb-3 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
              >
                Subject
              </label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSubjectFilter(subject)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${buttonClass(subjectFilter === subject)}`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label
                className={`block text-xs sm:text-sm font-bold mb-2 sm:mb-3 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
              >
                Type
              </label>
              <div className="flex gap-2">
                {(["All", "PDF", "VIDEO"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${buttonClass(typeFilter === type)}`}
                  >
                    {type === "PDF"
                      ? "📄 PDF"
                      : type === "VIDEO"
                        ? "🎥 Video"
                        : "All"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div
            className={`mb-6 text-xs sm:text-sm font-semibold ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
          >
            Found {filteredMaterials.length} material
            {filteredMaterials.length !== 1 ? "s" : ""}
          </div>

          {/* Materials Grid */}
          {filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <button
                  key={material.id}
                  onClick={() => setSelectedMaterial(material)}
                  className={`border-2 rounded-xl p-4 sm:p-6 transition-all text-left hover:shadow-lg hover:-translate-y-1 ${cardClass}`}
                >
                  {/* Type Badge & Summary Button */}
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <span
                      className={`text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                        material.type === "PDF"
                          ? "bg-red-500/20 text-red-600"
                          : "bg-blue-500/20 text-blue-600"
                      }`}
                    >
                      {material.type === "PDF" ? "📄 PDF" : "🎥 VIDEO"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (material.type === "PDF") {
                          generatePDFSummary(
                            material.id,
                            material.title,
                            material.subject,
                          );
                        } else {
                          generateVideoSummary(
                            material.id,
                            material.title,
                            material.chapter,
                          );
                        }
                      }}
                      disabled={
                        material.type === "PDF"
                          ? pdfSummaries[material.id]?.loading
                          : videoSummaries[material.id]?.loading
                      }
                      className="text-[7px] sm:text-[8px] font-black text-[#00e5ff] uppercase tracking-widest px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00e5ff]/10 rounded-lg hover:bg-[#00e5ff]/20 transition-all border border-[#00e5ff]/20 disabled:opacity-50 whitespace-nowrap"
                    >
                      {material.type === "PDF"
                        ? pdfSummaries[material.id]?.loading
                          ? "Summarizing..."
                          : "AI Summary"
                        : videoSummaries[material.id]?.loading
                          ? "Summarizing..."
                          : "AI Summary"}
                    </button>
                  </div>

                  {/* AI Summary Display */}
                  {(material.type === "PDF"
                    ? pdfSummaries[material.id]?.text
                    : videoSummaries[material.id]?.text) && (
                    <div
                      className={`mb-4 p-2 sm:p-3 rounded-lg border animate-fade-in ${
                        theme === "light"
                          ? "bg-blue-50 border-blue-200"
                          : "bg-blue-500/10 border-blue-500/20"
                      }`}
                    >
                      <p
                        className={`text-[9px] sm:text-[10px] leading-relaxed italic ${
                          theme === "light" ? "text-blue-600" : "text-blue-300"
                        }`}
                      >
                        {material.type === "PDF"
                          ? pdfSummaries[material.id]?.text
                          : videoSummaries[material.id]?.text}
                      </p>
                    </div>
                  )}

                  {/* Offline Badge */}
                  {material.isOfflineReady && (
                    <div className="mb-2">
                      <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-500/20 px-2 py-0.5 rounded">
                        ✓ Offline Ready
                      </span>
                    </div>
                  )}

                  {/* Subject & Chapter */}
                  <div
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                  >
                    {material.subject} • {material.chapter}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2 hover:text-[#00e5ff] transition-colors">
                    {material.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-[12px] sm:text-sm line-clamp-2 mb-4 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                  >
                    {material.description}
                  </p>

                  {/* View Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-current border-opacity-10">
                    <span className="text-[11px] sm:text-xs font-bold uppercase text-[#00e5ff]">
                      View Resource →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p
                className={`text-lg ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
              >
                No materials found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Media Viewer Modal */}
      {selectedMaterial && (
        <MediaViewer
          theme={theme}
          url={selectedMaterial.url}
          title={selectedMaterial.title}
          type={selectedMaterial.type}
          onClose={() => setSelectedMaterial(null)}
        />
      )}
    </>
  );
};

export default StudyMaterials;
