import React, { useState, useRef } from "react";
import { useTheme } from "../hooks/ThemeContext";
import { getAIResponse } from "../services/geminiService";

interface Summary {
  id: string;
  fileName: string;
  summary: string;
  keyPoints: string[];
  timestamp: Date;
}

const PDFSummarizer: React.FC = () => {
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#0a0a0a]" : "bg-white";
  const borderColor = isDark
    ? "border-[#00e5ff]/30 hover:border-[#00e5ff]/60"
    : "border-cyan-200 hover:border-cyan-400";
  const inputBg = isDark ? "bg-[#1a1a1a]" : "bg-gray-50";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // For now, we'll use a basic text extraction method
    // In production, you'd use pdfjs-dist
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          // Since we don't have pdfjs-dist installed, we'll provide a placeholder
          // that tells the AI to work with the file name and handle it gracefully
          const text = `PDF File: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)}KB\n\nNote: This is a placeholder. For production, install pdfjs-dist to extract full text.`;
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleSummarize = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      setExtractedText(text);

      // Get summary from AI
      const prompt = `Please analyze this PDF and provide:
1. A comprehensive summary (2-3 paragraphs)
2. Key points in bullet form
3. Important concepts explained simply

PDF Content: ${text}

Format your response as JSON with keys: "summary", "keyPoints" (array)`;

      const response = await getAIResponse(
        prompt,
        "You are an expert summarizer. Extract key information and summarize content clearly for students.",
        true,
      );

      let parsedResponse = { summary: "", keyPoints: [] };
      try {
        parsedResponse = JSON.parse(response);
      } catch {
        parsedResponse = {
          summary: response,
          keyPoints: [
            "Unable to extract key points",
            "Check PDF format and content",
          ],
        };
      }

      const summary: Summary = {
        id: Date.now().toString(),
        fileName: file.name,
        summary: parsedResponse.summary,
        keyPoints: Array.isArray(parsedResponse.keyPoints)
          ? parsedResponse.keyPoints
          : [],
        timestamp: new Date(),
      };

      setSummaries((prev) => [summary, ...prev]);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error summarizing PDF:", error);
      alert("Error summarizing PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`rounded-lg border ${borderColor} overflow-hidden transition-colors duration-300`}
    >
      {/* Upload Section */}
      <div className={`p-6 ${isDark ? "bg-[#1a1a1a]" : "bg-gray-50"}`}>
        <h3 className="text-xl font-bold mb-4 text-[#00e5ff]">
          📄 PDF Summarizer
        </h3>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDark
              ? "border-[#00e5ff]/30 hover:border-[#00e5ff]/60 bg-[#0a0a0a]/50"
              : "border-cyan-300 hover:border-cyan-400 bg-cyan-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
          />

          <div className="text-4xl mb-2">📋</div>
          <p className={`mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {file ? file.name : "Click or drag PDF here"}
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isDark
                ? "bg-[#00e5ff]/20 text-[#00e5ff] hover:bg-[#00e5ff]/30 disabled:opacity-50 border border-[#00e5ff]/50"
                : "bg-cyan-100 text-cyan-600 hover:bg-cyan-200 disabled:opacity-50 border border-cyan-300"
            }`}
          >
            Choose PDF
          </button>
        </div>

        {file && (
          <button
            onClick={handleSummarize}
            disabled={isLoading}
            className={`w-full mt-4 px-6 py-3 rounded-lg font-bold transition-all ${
              isDark
                ? "bg-[#00e5ff] text-[#0a0a0a] hover:bg-[#00d4e8] disabled:opacity-50"
                : "bg-cyan-400 text-white hover:bg-cyan-500 disabled:opacity-50"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Summarizing...
              </div>
            ) : (
              "Summarize PDF"
            )}
          </button>
        )}
      </div>

      {/* Summaries List */}
      {summaries.length > 0 && (
        <div
          className={`p-6 border-t ${isDark ? "border-[#1a1a1a]" : "border-gray-200"}`}
        >
          <h4 className="text-lg font-bold mb-4">Previous Summaries</h4>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {summaries.map((summary) => (
              <div
                key={summary.id}
                className={`p-4 rounded-lg border ${
                  isDark
                    ? "bg-[#0a0a0a] border-[#00e5ff]/20"
                    : "bg-white border-cyan-200"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h5 className="font-bold text-[#00e5ff]">
                      {summary.fileName}
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
                    <button
                      onClick={() => {
                        const text = `${summary.fileName}\n\n${summary.summary}\n\nKey Points:\n${summary.keyPoints.join("\n")}`;
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
                        const text = `${summary.fileName}\n\n${summary.summary}\n\nKey Points:\n${summary.keyPoints.join("\n")}`;
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: summary.fileName,
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
                        const text = `PDF: ${summary.fileName}\nSummarized on: ${summary.timestamp.toLocaleString()}\n\n${summary.summary}\n\nKey Points:\n${summary.keyPoints.map((p) => `- ${p}`).join("\n")}`;
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

                <div
                  className={`mb-3 p-3 rounded ${
                    isDark ? "bg-[#1a1a1a]" : "bg-gray-50"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{summary.summary}</p>
                </div>

                {summary.keyPoints.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2">Key Points:</p>
                    <ul className="space-y-1">
                      {summary.keyPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="text-sm flex items-start gap-2"
                        >
                          <span className="text-[#00e5ff] font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
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

export default PDFSummarizer;
