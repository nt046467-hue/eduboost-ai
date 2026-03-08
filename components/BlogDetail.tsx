import React, { useState, useEffect, useRef } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { BLOG_POSTS } from "../constants";
import { getAIResponse } from "../services/geminiService";
import { useTheme } from "../hooks/ThemeContext";
import { GoogleGenAI, Modality } from "@google/genai";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "ne", name: "Nepali" },
];

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

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const post = BLOG_POSTS.find((p) => p.id === id);
  const isDark = theme === "dark";

  const [personalNotes, setPersonalNotes] = useState<string>("");

  // Translation state
  const [selectedLang, setSelectedLang] = useState("en");
  const [displayContent, setDisplayContent] = useState(post?.content || "");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({
    en: post?.content || "",
  });

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
  const [showGlossary, setShowGlossary] = useState(false);

  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      setPersonalNotes(localStorage.getItem(`eduboost_blog_notes_${id}`) || "");
      const storedGlossary = localStorage.getItem(
        `eduboost_blog_glossary_${id}`,
      );
      if (storedGlossary) setGlossary(JSON.parse(storedGlossary));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      localStorage.setItem(`eduboost_blog_notes_${id}`, personalNotes);
      localStorage.setItem(
        `eduboost_blog_glossary_${id}`,
        JSON.stringify(glossary),
      );
    }
  }, [personalNotes, glossary, id]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

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
                text: `Narrate the following blog article clearly and naturally: ${plainText}`,
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

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === selectedLang || isTranslating) return;
    setSelectedLang(langCode);
    if (translations[langCode]) {
      setDisplayContent(translations[langCode]);
      return;
    }
    setIsTranslating(true);
    try {
      const prompt = `Translate this blog article HTML to ${LANGUAGES.find((l) => l.code === langCode)?.name}. KEEP TAGS. Content: ${post?.content}`;
      const result = await getAIResponse(prompt, "Academic translator.");
      setTranslations((prev) => ({ ...prev, [langCode]: result }));
      setDisplayContent(result);
    } catch (err) {
    } finally {
      setIsTranslating(false);
    }
  };

  const performLookup = async () => {
    if (!lookupText) return;
    setLookupResult({ entry: null, loading: true });

    const prompt = `Define "${lookupText}" in the context of a ${post?.category} article. JSON ONLY. Schema: { word: string, definition: string, partOfSpeech: string, usage: string, synonyms: string[] }`;

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

  const handleTextSelection = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".lookup-bubble")) return;
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 1 && text.length < 50) {
      const rect = selection?.getRangeAt(0).getBoundingClientRect();
      if (rect) {
        setLookupPos({ x: rect.left + rect.width / 2, y: rect.top - 15 });
        setLookupText(text);
        setLookupResult(null);
      }
    } else {
      setLookupPos(null);
    }
  };

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div
      className={`pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 relative transition-colors duration-300 ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}
      onMouseUp={handleTextSelection}
    >
      <style>{`
        .lookup-bubble { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes popIn { from { opacity: 0; transform: translate(-50%, 15px) scale(0.9); } to { opacity: 1; transform: translate(-50%, 0) scale(1); } }
        .blog-content p::selection { background: #00e5ff; color: #000; }
        .blog-content h3 { color: #fff; font-weight: 800; font-size: 2rem; margin-top: 4rem; margin-bottom: 1.5rem; border-left: 4px solid #00e5ff; padding-left: 1.2rem; }
        .glossary-drawer { transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>

      {/* Dictionary Bubble */}
      {lookupPos && (
        <div
          className="fixed z-[100] lookup-bubble"
          style={{
            top: lookupPos.y - (lookupResult ? 320 : 60),
            left: lookupPos.x,
            transform: "translateX(-50%)",
          }}
        >
          {!lookupResult ? (
            <button
              onClick={performLookup}
              className="bg-[#00e5ff] text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-110 transition-all border border-white/20"
              aria-label={`Define term: ${lookupText}`}
            >
              Define Term
            </button>
          ) : (
            <div className="w-80 bg-[#111] border border-[#00e5ff]/30 rounded-[32px] shadow-2xl p-8 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase text-[#00e5ff] tracking-widest">
                  Academic Definition
                </span>
                <button
                  onClick={() => setLookupPos(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label="Close definition"
                >
                  ✕
                </button>
              </div>
              {lookupResult.loading ? (
                <div className="py-10 flex flex-col items-center justify-center gap-4">
                  <div className="w-6 h-6 border-2 border-t-[#00e5ff] rounded-full animate-spin"></div>
                </div>
              ) : lookupResult.entry ? (
                <div className="animate-fade-in">
                  <h4 className="text-xl font-black text-white mb-1">
                    {lookupResult.entry.word}
                  </h4>
                  <p className="text-[10px] text-[#00e5ff] font-bold uppercase mb-4">
                    {lookupResult.entry.partOfSpeech}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6 italic">
                    "{lookupResult.entry.definition}"
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={addToGlossary}
                      className="flex-1 py-3 bg-[#00e5ff] text-black text-[10px] font-black uppercase rounded-xl"
                      aria-label={`Save ${lookupResult.entry!.word} to glossary`}
                    >
                      Save Meaning
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
                      className="px-4 py-3 bg-white/5 text-gray-400 text-[10px] font-black rounded-xl border border-white/5 transition-all"
                      aria-label={`Add ${lookupResult.entry!.word} to notebook`}
                    >
                      Notebook
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Glossary Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#0d0d0d] border-l border-white/5 z-[60] glossary-drawer shadow-[-20px_0_80px_rgba(0,0,0,0.5)] p-8 ${showGlossary ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-10">
          <h4 className="text-[11px] font-black uppercase text-[#00e5ff] tracking-[0.3em]">
            Reading Glossary
          </h4>
          <button
            onClick={() => setShowGlossary(false)}
            className="text-gray-500 hover:text-white"
            aria-label="Close glossary"
          >
            ✕
          </button>
        </div>
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 custom-scrollbar">
          {glossary.length === 0 ? (
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest text-center py-20">
              Highlight words to build <br /> your knowledge base.
            </p>
          ) : (
            glossary.map((e, i) => (
              <div
                key={i}
                className="group/item border-b border-white/5 pb-4 last:border-0"
              >
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-bold text-white">{e.word}</span>
                  <span className="text-[8px] font-black text-gray-600 uppercase">
                    {e.partOfSpeech}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {e.definition}
                </p>
                <button
                  onClick={() =>
                    setGlossary((prev) => prev.filter((g) => g.word !== e.word))
                  }
                  className="mt-3 opacity-0 group-hover/item:opacity-100 transition-opacity text-[8px] font-black uppercase text-red-500/40 hover:text-red-500"
                  aria-label={`Remove ${e.word} from glossary`}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        {glossary.length > 0 && (
          <button
            onClick={() => setShowGlossary(false)}
            className="w-full mt-10 py-4 bg-[#00e5ff] text-black text-[10px] font-black uppercase rounded-2xl"
            aria-label="Close glossary and continue reading"
          >
            Continue Reading
          </button>
        )}
      </div>

      {/* Floating Glossary Trigger */}
      <button
        onClick={() => setShowGlossary(true)}
        className="fixed bottom-10 right-10 z-[55] w-16 h-16 bg-[#00e5ff] text-black rounded-full shadow-2xl shadow-cyan/40 flex items-center justify-center hover:scale-110 transition-all group"
        aria-label={`Reading Glossary ${glossary.length > 0 ? `(${glossary.length} words saved)` : ""}`}
        aria-pressed={showGlossary}
      >
        <svg
          className="w-6 h-6 group-hover:rotate-12 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {glossary.length > 0 && (
          <span
            className="absolute -top-1 -right-1 w-6 h-6 bg-white border-2 border-[#00e5ff] rounded-full text-[10px] font-black flex items-center justify-center animate-bounce"
            aria-label={`${glossary.length} words`}
          >
            {glossary.length}
          </span>
        )}
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#00e5ff] transition-all group"
          aria-label="Back to Journal"
        >
          <svg
            className="w-4 h-4 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Journal
        </button>
        <div className="flex bg-[#111] p-1 rounded-2xl border border-[#1a1a1a]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isTranslating}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${selectedLang === lang.code ? "bg-[#00e5ff] text-[#0a0a0a]" : "text-gray-500 hover:text-white"}`}
              aria-label={`Translate to ${lang.name}`}
              aria-pressed={selectedLang === lang.code}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      <header className="mb-20">
        <div className="mb-12 rounded-[56px] overflow-hidden border border-[#1a1a1a] shadow-2xl h-[400px]">
          <img
            src={post.imageUrl}
            alt={post.title}
            loading="lazy"
            decoding="async"
            width={1200}
            height={400}
            className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
          />
        </div>
        <h1 className="text-5xl md:text-8xl font-extrabold leading-tight mb-10 tracking-tighter text-white">
          {selectedLang === "en"
            ? post.title
            : isTranslating
              ? "Processing..."
              : post.title}
        </h1>
      </header>

      {/* AI Narration Control Bar */}
      <div className="mb-12 flex items-center gap-6 p-4 bg-[#0d0d0d] border border-white/5 rounded-[24px] shadow-xl animate-fade-in">
        <button
          onClick={startNarration}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isNarrating ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-[#00e5ff] text-[#0a0a0a]"}`}
          aria-label={isNarrating ? "Stop Narration" : "Listen to Article"}
          aria-pressed={isNarrating}
        >
          {isNarrating ? (
            <>
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Listen to Article
            </>
          )}
        </button>

        {isNarrating && (
          <div className="flex items-end gap-1 h-4 px-2">
            <div
              className="audio-wave-bar"
              style={{
                animationDelay: "0s",
                width: "3px",
                height: "4px",
                background: "#00e5ff",
                borderRadius: "2px",
                animation: "audioWave 1s ease-in-out infinite",
              }}
            ></div>
            <div
              className="audio-wave-bar"
              style={{
                animationDelay: "0.2s",
                width: "3px",
                height: "4px",
                background: "#00e5ff",
                borderRadius: "2px",
                animation: "audioWave 1s ease-in-out infinite",
              }}
            ></div>
            <div
              className="audio-wave-bar"
              style={{
                animationDelay: "0.4s",
                width: "3px",
                height: "4px",
                background: "#00e5ff",
                borderRadius: "2px",
                animation: "audioWave 1s ease-in-out infinite",
              }}
            ></div>
            <div
              className="audio-wave-bar"
              style={{
                animationDelay: "0.1s",
                width: "3px",
                height: "4px",
                background: "#00e5ff",
                borderRadius: "2px",
                animation: "audioWave 1s ease-in-out infinite",
              }}
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
      <style>{`
        @keyframes audioWave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.5); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <article className="blog-content prose prose-invert max-w-none mb-32 leading-relaxed">
        <style
          dangerouslySetInnerHTML={{
            __html: `.blog-content p { color: #cfcfcf; line-height: 2.2; font-size: 1.45rem; margin-bottom: 2.5rem; }`,
          }}
        />
        {isTranslating ? (
          <div className="py-24 text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-[#00e5ff]/20 border-t-[#00e5ff] rounded-full animate-spin mx-auto mb-8"></div>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: displayContent }} />
        )}
      </article>

      <section className="p-10 bg-[#050505] rounded-[48px] border border-[#1a1a1a] shadow-inner mb-24 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <h2 className="text-3xl font-black mb-1">Journal Reflections</h2>
          <button
            onClick={() => {
              const b = new Blob([personalNotes], { type: "text/plain" });
              const u = URL.createObjectURL(b);
              const a = document.createElement("a");
              a.href = u;
              a.download = `${post.title}_Journal.txt`;
              a.click();
            }}
            className="px-6 py-3 bg-[#111] border border-[#222] text-[10px] font-black uppercase rounded-xl hover:text-[#00e5ff] transition-all"
            aria-label="Export journal reflections as text file"
          >
            Export .TXT
          </button>
        </div>
        <textarea
          value={personalNotes}
          onChange={(e) => setPersonalNotes(e.target.value)}
          placeholder="Reflect on this article here..."
          className="w-full h-80 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[32px] p-8 text-gray-300 outline-none focus:border-[#00e5ff]/30 resize-none text-lg leading-relaxed font-medium transition-all shadow-xl"
        />
      </section>
    </div>
  );
};

export default BlogDetail;
