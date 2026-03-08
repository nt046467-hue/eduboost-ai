import React, { useState, useRef } from "react";
import { useTheme } from "../hooks/ThemeContext";
import { getAIResponse } from "../services/geminiService";

interface Summary {
  id: string;
  fileName: string;
  overview: string;
  summary: string;
  mainConcepts: string[];
  keyPoints: string[];
  definitions: Record<string, string>;
  quickFacts: string[];
  relatedTopics: string[];
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

  // extract text from PDF using pdfjs-dist; this gives a real summary
  // similar to how VideoSummarizer handles a video file, we pull the full
  // transcript and send it to the AI so it has actual content to work with.
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
      // Vite requires worker path to be specified as an absolute URL
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/legacy/build/pdf.worker.js",
        import.meta.url,
      ).toString();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n\n";
      }
      return fullText.trim();
    } catch (error) {
      console.error(
        "PDF extraction failed, falling back to basic info:",
        error,
      );
      return `PDF File: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)}KB\n\n(Unable to extract text automatically)`;
    }
  };

  const handleSummarize = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      setExtractedText(text);

      // Get summary from AI
      const prompt = `Please analyze this PDF and provide the following information in a student-friendly way:
1. A one‑sentence **overview** of the document's main theme
2. A comprehensive **summary** (2–3 paragraphs)
3. A list of **main concepts** with very brief explanations
4. A set of **key points** in bullet form
5. Any important **definitions** mentioned in the text (object of term→definition)
6. A few **quick facts** or takeaways
7. **Related topics** or suggestions for further reading

PDF Content:
${text}

Format your response EXACTLY as JSON using these keys:
{
  "overview": "...",
  "summary": "...",
  "mainConcepts": ["...", "..."],
  "keyPoints": ["...", "..."],
  "definitions": {"term1":"def1", ...},
  "quickFacts": ["...", "..."],
  "relatedTopics": ["...", "..."]
}`;
      const response = await getAIResponse(
        prompt,
        "You are an expert summarizer. Extract key information and summarize content clearly for students.",
        true,
      );

      // the AI is instructed to return a rich JSON object; fall back gracefully
      let parsedResponse: any = {
        overview: "",
        summary: "",
        mainConcepts: [],
        keyPoints: [],
        definitions: {},
        quickFacts: [],
        relatedTopics: [],
      };

      try {
        parsedResponse = JSON.parse(response);
      } catch (err) {
        console.warn(
          "Could not parse AI response as JSON, using raw text",
          err,
        );
        parsedResponse = {
          overview: "",
          summary: response,
          mainConcepts: [],
          keyPoints: [
            "Unable to extract key points",
            "Check PDF format and content",
          ],
          definitions: {},
          quickFacts: [],
          relatedTopics: [],
        };
      }

      const summary: Summary = {
        id: Date.now().toString(),
        fileName: file.name,
        overview: parsedResponse.overview || "",
        summary: parsedResponse.summary || "",
        mainConcepts: Array.isArray(parsedResponse.mainConcepts)
          ? parsedResponse.mainConcepts
          : [],
        keyPoints: Array.isArray(parsedResponse.keyPoints)
          ? parsedResponse.keyPoints
          : [],
        definitions:
          parsedResponse.definitions &&
          typeof parsedResponse.definitions === "object"
            ? parsedResponse.definitions
            : {},
        quickFacts: Array.isArray(parsedResponse.quickFacts)
          ? parsedResponse.quickFacts
          : [],
        relatedTopics: Array.isArray(parsedResponse.relatedTopics)
          ? parsedResponse.relatedTopics
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
          <>
            {extractedText && (
              <div
                className={`mt-4 p-3 rounded text-xs ${
                  isDark ? "bg-[#1a1a1a]" : "bg-gray-100"
                }`}
              >
                <strong>Extracted text preview:</strong>
                <pre className="whitespace-pre-wrap mt-1">{extractedText}</pre>
              </div>
            )}
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
          </>
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
                        const lines = [];
                        lines.push(summary.fileName);
                        if (summary.overview)
                          lines.push(`Overview: ${summary.overview}`);
                        if (summary.summary) lines.push(`\n${summary.summary}`);
                        if (summary.mainConcepts.length)
                          lines.push(
                            `\nMain Concepts:\n${summary.mainConcepts.join("\n")}`,
                          );
                        if (summary.keyPoints.length)
                          lines.push(
                            `\nKey Points:\n${summary.keyPoints.join("\n")}`,
                          );
                        if (Object.keys(summary.definitions).length)
                          lines.push(
                            `\nDefinitions:\n${Object.entries(
                              summary.definitions,
                            )
                              .map(([k, v]) => `${k}: ${v}`)
                              .join("\n")}`,
                          );
                        if (summary.quickFacts.length)
                          lines.push(
                            `\nQuick Facts:\n${summary.quickFacts.join("\n")}`,
                          );
                        if (summary.relatedTopics.length)
                          lines.push(
                            `\nRelated Topics:\n${summary.relatedTopics.join("\n")}`,
                          );
                        const text = lines.join("\n");
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
                        const lines = [];
                        lines.push(summary.fileName);
                        if (summary.overview)
                          lines.push(`Overview: ${summary.overview}`);
                        if (summary.summary) lines.push(`\n${summary.summary}`);
                        if (summary.mainConcepts.length)
                          lines.push(
                            `\nMain Concepts:\n${summary.mainConcepts.join("\n")}`,
                          );
                        if (summary.keyPoints.length)
                          lines.push(
                            `\nKey Points:\n${summary.keyPoints.join("\n")}`,
                          );
                        if (Object.keys(summary.definitions).length)
                          lines.push(
                            `\nDefinitions:\n${Object.entries(
                              summary.definitions,
                            )
                              .map(([k, v]) => `${k}: ${v}`)
                              .join("\n")}`,
                          );
                        if (summary.quickFacts.length)
                          lines.push(
                            `\nQuick Facts:\n${summary.quickFacts.join("\n")}`,
                          );
                        if (summary.relatedTopics.length)
                          lines.push(
                            `\nRelated Topics:\n${summary.relatedTopics.join("\n")}`,
                          );
                        const textToShare = lines.join("\n");
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: summary.fileName,
                              text: textToShare,
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
                        const parts: string[] = [];
                        parts.push(`PDF: ${summary.fileName}`);
                        parts.push(
                          `Summarized on: ${summary.timestamp.toLocaleString()}`,
                        );
                        if (summary.overview)
                          parts.push(`\nOverview: ${summary.overview}`);
                        if (summary.summary) parts.push(`\n${summary.summary}`);
                        if (summary.mainConcepts.length)
                          parts.push(
                            `\nMain Concepts:\n${summary.mainConcepts.join("\n")}`,
                          );
                        if (summary.keyPoints.length)
                          parts.push(
                            `\nKey Points:\n${summary.keyPoints.map((p) => `- ${p}`).join("\n")}`,
                          );
                        if (Object.keys(summary.definitions).length)
                          parts.push(
                            `\nDefinitions:\n${Object.entries(
                              summary.definitions,
                            )
                              .map(([k, v]) => `- ${k}: ${v}`)
                              .join("\n")}`,
                          );
                        if (summary.quickFacts.length)
                          parts.push(
                            `\nQuick Facts:\n${summary.quickFacts.join("\n")}`,
                          );
                        if (summary.relatedTopics.length)
                          parts.push(
                            `\nRelated Topics:\n${summary.relatedTopics.join("\n")}`,
                          );

                        const text = parts.join("\n");
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

                {/* overview text */}
                {summary.overview && (
                  <div
                    className={`mb-1 p-2 rounded ${
                      isDark ? "bg-[#1a1a1a]" : "bg-gray-50"
                    }`}
                  >
                    <p className="text-sm italic">{summary.overview}</p>
                  </div>
                )}

                <div
                  className={`mb-3 p-3 rounded ${
                    isDark ? "bg-[#1a1a1a]" : "bg-gray-50"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{summary.summary}</p>
                </div>

                {summary.mainConcepts.length > 0 && (
                  <div className="mb-3">
                    <p className="font-semibold text-sm mb-1">Main concepts:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {summary.mainConcepts.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

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

                {Object.keys(summary.definitions).length > 0 && (
                  <div className="mt-3">
                    <p className="font-semibold text-sm mb-1">Definitions:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {Object.entries(summary.definitions).map(
                        ([term, def], idx) => (
                          <li key={idx}>
                            <strong>{term}:</strong> {def}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {summary.quickFacts.length > 0 && (
                  <div className="mt-3">
                    <p className="font-semibold text-sm mb-1">Quick facts:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {summary.quickFacts.map((fact, idx) => (
                        <li key={idx}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.relatedTopics.length > 0 && (
                  <div className="mt-3">
                    <p className="font-semibold text-sm mb-1">
                      Related topics:
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {summary.relatedTopics.map((topic, idx) => (
                        <li key={idx}>{topic}</li>
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
