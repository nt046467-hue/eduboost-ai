import React, { useState, useEffect, useRef } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { STUDY_GUIDES } from "../constants";
import { GoogleGenAI, Modality } from "@google/genai";
import { getAIResponse } from "../services/geminiService";
import { useTheme } from "../hooks/ThemeContext";
import { QuizQuestion } from "../types";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "ne", name: "Nepali" },
];

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface Definition {
  word: string;
  definition: string;
  partOfSpeech: string;
  usage: string;
  synonyms: string[];
}

// Helper for Base64 decoding
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper for raw PCM decoding to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const GuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const guide = STUDY_GUIDES.find((g) => g.id === id);
  const isDark = theme === "dark";

  const [personalNotes, setPersonalNotes] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Content & TOC state
  const [selectedLang, setSelectedLang] = useState("en");
  const [displayContent, setDisplayContent] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [sections, setSections] = useState<TOCItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  // Audio / TTS state
  const [isNarrating, setIsNarrating] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Smart Dictionary state
  const [lookupPos, setLookupPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [lookupText, setLookupText] = useState("");
  const [lookupResult, setLookupResult] = useState<{
    entry: Definition | null;
    loading: boolean;
  } | null>(null);
  const [glossary, setGlossary] = useState<Definition[]>([]);

  // Quiz state
  const [dynamicQuiz, setDynamicQuiz] = useState<QuizQuestion[] | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const bubbleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.className = e.currentTarget.className + " opacity-40";
  };

  useEffect(() => {
    if (guide) {
      setPersonalNotes(
        localStorage.getItem(`eduboost_notes_${guide.id}`) || "",
      );
      const storedGlossary = localStorage.getItem(
        `eduboost_glossary_${guide.id}`,
      );
      if (storedGlossary) setGlossary(JSON.parse(storedGlossary));

      const bookmarks = JSON.parse(
        localStorage.getItem("eduboost_bookmarks") || "[]",
      );
      setIsBookmarked(bookmarks.includes(guide.id));

      const parser = new DOMParser();
      const doc = parser.parseFromString(guide.content, "text/html");
      const headings = doc.querySelectorAll("h2, h3");
      const tocItems: TOCItem[] = [];

      headings.forEach((h, i) => {
        const id = `heading-${i}`;
        h.id = id;
        tocItems.push({
          id,
          text: h.textContent || "",
          level: parseInt(h.tagName[1]),
        });
      });

      const processedHtml = doc.body.innerHTML;
      setDisplayContent(processedHtml);
      setTranslations({ en: processedHtml });
      setSections(tocItems);

      const storedQuiz = localStorage.getItem(`eduboost_quiz_${guide.id}`);
      if (storedQuiz) setDynamicQuiz(JSON.parse(storedQuiz));
      else generateDynamicQuiz();
    }
  }, [guide?.id]);

  useEffect(() => {
    if (guide && glossary.length > 0) {
      localStorage.setItem(
        `eduboost_glossary_${guide.id}`,
        JSON.stringify(glossary),
      );
    }
  }, [glossary, guide?.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-10% 0% -80% 0%" },
    );
    const headings = contentRef.current?.querySelectorAll("h2, h3");
    headings?.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [displayContent]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  const toggleBookmark = () => {
    if (!guide) return;
    const bookmarks = JSON.parse(
      localStorage.getItem("eduboost_bookmarks") || "[]",
    );
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((bid: string) => bid !== guide.id);
    } else {
      newBookmarks = [...bookmarks, guide.id];
    }
    localStorage.setItem("eduboost_bookmarks", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const generateDynamicQuiz = async () => {
    if (!guide) return;
    setIsGeneratingQuiz(true);
    const prompt = `Create a 5-question multiple-choice quiz based on: "${guide.content}". JSON format only. Schema: Array<{ question: string, options: string[], correctIndex: number, explanation: string }>`;
    try {
      const result = await getAIResponse(
        prompt,
        "Expert assessment designer.",
        true,
      );
      const parsedQuiz = JSON.parse(result);
      setDynamicQuiz(parsedQuiz);
      localStorage.setItem(
        `eduboost_quiz_${guide.id}`,
        JSON.stringify(parsedQuiz),
      );
    } catch (err) {
      if (guide.quiz) setDynamicQuiz(guide.quiz);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const startNarration = async () => {
    if (isNarrating) {
      stopNarration();
      return;
    }

    setIsNarrating(true);
    try {
      // Extract plain text from the HTML content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = displayContent;
      const plainText = tempDiv.innerText.substring(0, 3000); // Limit length for TTS prompt safety

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [
          {
            parts: [
              {
                text: `Narrate the following educational material clearly and academically: ${plainText}`,
              },
            ],
          },
        ],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Charon" },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("No audio data received");

      const ctx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({ sampleRate: 24000 });
      audioContextRef.current = ctx;

      const audioBuffer = await decodeAudioData(
        decodeBase64(base64Audio),
        ctx,
        24000,
        1,
      );

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsNarrating(false);

      audioSourceRef.current = source;
      source.start();
    } catch (error) {
      console.error("TTS Error:", error);
      setIsNarrating(false);
    }
  };

  const stopNarration = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsNarrating(false);
  };

  const getAIHint = async () => {
    if (!dynamicQuiz || isHintLoading) return;
    setIsHintLoading(true);
    const question = dynamicQuiz[currentQuestion];
    const prompt = `Provide a subtle, helpful academic hint for this question: "${question.question}". DO NOT reveal the correct answer. Concise.`;
    try {
      const hint = await getAIResponse(prompt, "Supportive AI Tutor.");
      setShowHint(hint);
    } catch (err) {
      setShowHint("Review the relevant sections in the guide above.");
    } finally {
      setIsHintLoading(false);
    }
  };

  const performLookup = async () => {
    if (!lookupText) return;
    setLookupResult({ entry: null, loading: true });

    const isSingleWord = lookupText.trim().split(/\s+/).length === 1;
    const prompt = isSingleWord
      ? `Provide a professional dictionary entry for the word "${lookupText}" in the context of ${guide?.subject}. Return JSON ONLY. Schema: { word: string, definition: string, partOfSpeech: string, usage: string, synonyms: string[] }`
      : `Explain the concept "${lookupText}" in the context of ${guide?.subject}. Return JSON ONLY. Schema: { word: "${lookupText}", definition: string, partOfSpeech: "Concept", usage: "Example usage in sentence", synonyms: [] }`;

    try {
      const result = await getAIResponse(
        prompt,
        "Academic Lexicographer.",
        true,
      );
      const entry: Definition = JSON.parse(result);
      setLookupResult({ entry, loading: false });
    } catch (err) {
      setLookupResult({ entry: null, loading: false });
    }
  };

  const handleLanguageChange = async (langCode: string) => {
    if (!guide || langCode === selectedLang || isTranslating) return;
    setSelectedLang(langCode);
    if (translations[langCode]) {
      setDisplayContent(translations[langCode]);
      return;
    }
    setIsTranslating(true);
    try {
      const prompt = `Translate this study guide HTML content to ${LANGUAGES.find((l) => l.code === langCode)?.name}. KEEP ALL HTML TAGS AND IDS. Content: ${guide.content}`;
      const result = await getAIResponse(prompt, "Academic translator.");
      setTranslations((prev) => ({ ...prev, [langCode]: result }));
      setDisplayContent(result);
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const addToGlossary = () => {
    if (lookupResult?.entry) {
      setGlossary((prev) => {
        if (
          prev.find(
            (i) =>
              i.word.toLowerCase() === lookupResult.entry!.word.toLowerCase(),
          )
        )
          return prev;
        return [lookupResult.entry!, ...prev];
      });
      setLookupPos(null);
    }
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - 100,
        behavior: "smooth",
      });
    }
  };

  const handleTextSelection = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".lookup-bubble") || target.closest("button")) return;
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 1 && text.length < 50) {
      const rect = selection?.getRangeAt(0).getBoundingClientRect();
      if (rect) {
        setLookupPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
        setLookupText(text);
        setLookupResult(null);
      }
    } else {
      setLookupPos(null);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (!dynamicQuiz || isCorrect === true) return;
    setSelectedOption(idx);
    const correct = idx === dynamicQuiz[currentQuestion].correctIndex;
    setIsCorrect(correct);
    if (correct) {
      setShowHint(null);
      setTimeout(() => {
        if (currentQuestion < dynamicQuiz.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
        } else {
          setQuizFinished(true);
        }
      }, 3000);
    }
  };

  if (!guide) return <Navigate to="/guides" replace />;

  return (
    <div
      className={`pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative transition-colors duration-300 ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}
      onMouseUp={handleTextSelection}
    >
      <style>{`
        .lookup-bubble { animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards; }
        @keyframes popIn { from { opacity: 0; transform: translate(-50%, 15px) scale(0.9); } to { opacity: 1; transform: translate(-50%, 0) scale(1); } }
        .toc-indicator { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); } }
        .animate-pulse-green { animation: pulse-green 1.5s infinite; }
        @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        @keyframes heartBeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.15); }
          28% { transform: scale(1); }
          42% { transform: scale(1.15); }
          70% { transform: scale(1); }
        }
        .animate-heart-beat { animation: heartBeat 0.8s ease-in-out; }

        @keyframes audioWave {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .audio-wave-bar {
          width: 3px;
          background: #00e5ff;
          border-radius: 2px;
          animation: audioWave 1s ease-in-out infinite;
        }
      `}</style>

      {/* Lookup Tooltip (Smart Dictionary) */}
      {lookupPos && (
        <div
          ref={bubbleRef}
          className="fixed z-[100] lookup-bubble"
          style={{
            top: lookupPos.y - (lookupResult ? 340 : 50),
            left: lookupPos.x,
            transform: "translateX(-50%)",
          }}
        >
          {!lookupResult ? (
            <button
              onClick={performLookup}
              className="bg-[#00e5ff] text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-110 transition-all border border-white/20"
            >
              Define "
              {lookupText.length > 15
                ? lookupText.substring(0, 12) + "..."
                : lookupText}
              "
            </button>
          ) : (
            <div className="w-[340px] bg-[#0d0d0d] border border-[#00e5ff]/30 rounded-[32px] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase text-[#00e5ff] tracking-widest">
                  Real-time Definition
                </span>
                <button
                  onClick={() => setLookupPos(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {lookupResult.loading ? (
                <div className="py-12 text-center flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-[#00e5ff]/20 border-t-[#00e5ff] rounded-full animate-spin"></div>
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">
                    Querying Core Node
                  </span>
                </div>
              ) : lookupResult.entry ? (
                <div className="animate-fade-in">
                  <div className="flex items-baseline gap-3 mb-4">
                    <h4 className="text-2xl font-black text-white leading-none">
                      {lookupResult.entry.word}
                    </h4>
                    <span className="text-[9px] italic text-[#00e5ff] font-bold uppercase">
                      {lookupResult.entry.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6 font-medium border-l-2 border-[#00e5ff]/20 pl-4">
                    {lookupResult.entry.definition}
                  </p>
                  <div className="mb-6">
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-2">
                      Usage Context
                    </p>
                    <p className="text-xs text-gray-400 italic">
                      "{lookupResult.entry.usage}"
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addToGlossary}
                      className="flex-1 py-3 bg-[#00e5ff] text-black text-[10px] font-black uppercase rounded-xl hover:scale-[1.02] transition-all"
                    >
                      Add to Glossary
                    </button>
                    <button
                      onClick={() => {
                        setPersonalNotes(
                          (p) =>
                            p +
                            `\n\n📌 [${lookupResult.entry!.word}]: ${lookupResult.entry!.definition}`,
                        );
                        setLookupPos(null);
                      }}
                      className="px-4 py-3 bg-white/5 text-gray-400 text-[10px] font-black uppercase rounded-xl border border-white/5 hover:text-white transition-all"
                    >
                      Notebook
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-red-400">
                  Unable to retrieve definition.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
            <button
              onClick={() => navigate("/guides")}
              className="flex items-center text-[10px] font-black uppercase text-gray-500 hover:text-[#00e5ff] transition-all group"
            >
              <svg
                className="w-4 h-4 mr-3"
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
            <div className="flex bg-[#111] p-1 rounded-2xl border border-[#1a1a1a]">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  disabled={isTranslating}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${selectedLang === lang.code ? "bg-[#00e5ff] text-[#0a0a0a]" : "text-gray-500 hover:text-white"}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <header className="mb-10">
            <div className="mb-12 rounded-[56px] overflow-hidden border border-[#1a1a1a] shadow-2xl h-[400px]">
              <img
                src={guide.imageUrl}
                alt={guide.title}
                onError={handleImageError}
                loading="lazy"
                decoding="async"
                width={1200}
                height={400}
                className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tighter text-white mb-6">
              {selectedLang === "en"
                ? guide.title
                : isTranslating
                  ? "Decrypting..."
                  : guide.title}
            </h1>
          </header>

          {/* AI Narration Control Bar */}
          <div className="mb-12 flex items-center gap-6 p-4 bg-[#0d0d0d] border border-white/5 rounded-[24px] shadow-xl animate-fade-in">
            <button
              onClick={startNarration}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isNarrating ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-[#00e5ff] text-[#0a0a0a]"}`}
            >
              {isNarrating ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  Stop Narration
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Listen to Guide
                </>
              )}
            </button>

            {isNarrating && (
              <div className="flex items-end gap-1 h-4 px-2">
                <div
                  className="audio-wave-bar"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="audio-wave-bar"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="audio-wave-bar"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <div
                  className="audio-wave-bar"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <span className="ml-4 text-[9px] font-black text-[#00e5ff] uppercase tracking-widest animate-pulse">
                  Neural Audio Active
                </span>
              </div>
            )}

            {!isNarrating && !isTranslating && (
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                Gemini High-Fidelity Speech Engine
              </span>
            )}
          </div>

          <article
            ref={contentRef}
            className="guide-content prose prose-invert max-w-none mb-32 relative"
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `.guide-content h2 { color: #00e5ff; font-weight: 900; font-size: 2.5rem; margin-top: 5rem; scroll-margin-top: 100px; } .guide-content h3 { color: #fff; font-weight: 800; font-size: 1.8rem; margin-top: 3.5rem; scroll-margin-top: 100px; } .guide-content p { color: #aaa; line-height: 2; font-size: 1.25rem; margin-bottom: 2rem; } .guide-content p::selection { background: #00e5ff; color: #000; }`,
              }}
            />
            {isTranslating ? (
              <div className="py-20 text-center animate-pulse">
                <div className="w-12 h-12 border-4 border-[#00e5ff]/20 border-t-[#00e5ff] rounded-full animate-spin mx-auto mb-8"></div>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: displayContent }} />
            )}
          </article>

          {/* Quiz */}
          <section className="mb-32 p-10 bg-[#0d0d0d] border border-white/5 rounded-[48px] shadow-2xl overflow-hidden">
            <h2 className="text-3xl font-black text-white mb-10">
              Mastery Assessment
            </h2>
            {isGeneratingQuiz ? (
              <div className="py-20 text-center animate-pulse">
                <div className="w-10 h-10 border-2 border-t-[#00e5ff] rounded-full animate-spin mx-auto mb-6"></div>
              </div>
            ) : dynamicQuiz && !quizFinished ? (
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold mb-10 text-white leading-relaxed">
                  {dynamicQuiz[currentQuestion].question}
                </h3>
                <div className="grid gap-3">
                  {dynamicQuiz[currentQuestion].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isCorrect === true}
                      className={`p-6 text-left rounded-2xl border transition-all ${selectedOption === idx ? (isCorrect ? "bg-green-500/10 border-green-500 animate-pulse-green" : "bg-red-500/10 border-red-500 animate-shake") : "bg-white/5 border-white/5 hover:border-[#00e5ff]/30"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Hint and Explanation Logic */}
                <div className="mt-8 flex flex-col gap-4">
                  {isCorrect === true && (
                    <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-3xl animate-fade-in">
                      <p className="text-sm text-green-100 italic leading-relaxed">
                        "{dynamicQuiz[currentQuestion].explanation}"
                      </p>
                    </div>
                  )}

                  {isCorrect === false && !showHint && (
                    <button
                      onClick={getAIHint}
                      disabled={isHintLoading}
                      className="self-start px-6 py-3 bg-[#00e5ff]/10 text-[#00e5ff] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#00e5ff] hover:text-[#0a0a0a] transition-all border border-[#00e5ff]/20 animate-fade-in"
                    >
                      {isHintLoading ? "Consulting Tutor..." : "Show Hint"}
                    </button>
                  )}

                  {showHint && isCorrect !== true && (
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl animate-fade-in relative">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black text-[#00e5ff] uppercase tracking-widest">
                          Neural Nudge
                        </span>
                        <button
                          onClick={() => setShowHint(null)}
                          className="text-gray-500 hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-gray-300 text-sm italic leading-relaxed">
                        "{showHint}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              quizFinished && (
                <div className="py-16 text-center">
                  <h3 className="text-3xl font-black text-white mb-4">
                    Module Mastered
                  </h3>
                  <button
                    onClick={() => navigate("/guides")}
                    className="px-12 py-4 bg-[#00e5ff] text-black text-[10px] font-black uppercase rounded-2xl"
                  >
                    Library
                  </button>
                </div>
              )
            )}
          </section>

          {/* Notebook */}
          <section className="p-10 bg-[#050505] rounded-[48px] border border-white/5">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-white">Notebook</h2>
              <button
                onClick={() => {
                  const b = new Blob([personalNotes], { type: "text/plain" });
                  const u = URL.createObjectURL(b);
                  const a = document.createElement("a");
                  a.href = u;
                  a.download = `${guide.title}_Notes.txt`;
                  a.click();
                }}
                className="px-6 py-2.5 bg-white/5 text-[10px] font-black uppercase border border-white/10 rounded-xl"
              >
                Export
              </button>
            </div>
            <textarea
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="Definitions will synchronize here..."
              className="w-full h-80 bg-[#0d0d0d] border border-white/5 rounded-3xl p-8 text-gray-400 focus:outline-none focus:border-[#00e5ff]/30 resize-none font-medium leading-relaxed"
            />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-32 space-y-8">
            {/* Share & Bookmark Actions */}
            <div className="flex gap-4">
              <button
                onClick={toggleBookmark}
                className={`flex-1 py-4 border transition-all rounded-[24px] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest group ${
                  isBookmarked
                    ? "bg-[#00e5ff] text-[#0a0a0a] border-[#00e5ff] shadow-[0_15px_40px_rgba(0,229,255,0.4)]"
                    : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:border-white/20"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-all duration-300 ${isBookmarked ? "animate-heart-beat fill-[#0a0a0a] text-[#0a0a0a]" : "fill-none text-gray-400 group-hover:scale-110"}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                {isBookmarked ? "Saved" : "Bookmark"}
              </button>

              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                }}
                className={`flex-1 py-4 bg-white/5 border border-white/10 text-[10px] font-black uppercase rounded-[24px] transition-all flex items-center justify-center gap-3 ${copySuccess ? "text-[#00e5ff] border-[#00e5ff]/50" : "text-gray-300 hover:text-white"}`}
              >
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
                {copySuccess ? "Copied" : "Share"}
              </button>
            </div>

            {/* Active Glossary */}
            <div className="p-8 bg-[#0d0d0d] border border-[#00e5ff]/20 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff]/5 blur-3xl -z-10"></div>
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00e5ff]">
                  Mastery Glossary
                </h4>
                <span className="bg-[#00e5ff]/10 text-[#00e5ff] text-[9px] font-black px-2 py-1 rounded">
                  {glossary.length} Items
                </span>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {glossary.length === 0 ? (
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic text-center py-10 leading-loose">
                    Highlight any word to <br /> build your lexicon.
                  </p>
                ) : (
                  glossary.map((entry, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-[#00e5ff]/40 transition-all animate-fade-in group/item"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-black text-white">
                          {entry.word}
                        </span>
                        <span className="text-[8px] font-black text-[#00e5ff]/60 uppercase">
                          {entry.partOfSpeech}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">
                        {entry.definition}
                      </p>
                      <button
                        onClick={() =>
                          setGlossary((prev) =>
                            prev.filter((g) => g.word !== entry.word),
                          )
                        }
                        className="mt-3 opacity-0 group-hover/item:opacity-100 transition-opacity text-[8px] font-black uppercase text-red-500/50 hover:text-red-500"
                      >
                        Remove Entry
                      </button>
                    </div>
                  ))
                )}
              </div>
              {glossary.length > 0 && (
                <button
                  onClick={() => setGlossary([])}
                  className="w-full mt-6 py-3 border border-dashed border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-red-400 hover:border-red-400/30 transition-all rounded-xl"
                >
                  Flush Glossary Cache
                </button>
              )}
            </div>

            <div className="p-8 bg-[#0d0d0d] border border-white/5 rounded-[40px] shadow-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00e5ff] mb-8">
                Intellectual Map
              </h4>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToHeading(s.id)}
                    className={`w-full text-left group flex items-center gap-4 py-3 px-4 rounded-xl transition-all ${activeSection === s.id ? "bg-[#00e5ff]/5 text-white" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${activeSection === s.id ? "bg-[#00e5ff] scale-150 shadow-[0_0_8px_#00e5ff]" : "bg-gray-700"}`}
                    ></div>
                    <span
                      className={`text-[11px] font-black uppercase tracking-widest ${s.level === 3 ? "ml-4 opacity-60" : ""}`}
                    >
                      {s.text}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GuideDetail;
