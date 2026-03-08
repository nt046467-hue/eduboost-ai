import React, { useState, useEffect, useCallback } from "react";
import { Theme } from "../types";

interface WordClashProps {
  theme: Theme;
  onComplete?: (score: number) => void;
}

const STUDY_TERMS = [
  {
    word: "GRAVITY",
    hint: "Universal force attracting bodies proportional to mass",
  },
  {
    word: "POINTER",
    hint: "Variable that stores memory address in C Programming",
  },
  {
    word: "OSMOSIS",
    hint: "Diffusion of solvent through semi-permeable membrane",
  },
  {
    word: "LEDGER",
    hint: "Principal book for recording financial transactions",
  },
  {
    word: "CATALYST",
    hint: "Substance increasing chemical reaction rate without change",
  },
  { word: "MOMENTUM", hint: "Product of mass and velocity of a moving body" },
  { word: "INFLATION", hint: "Sustained increase in general price levels" },
  { word: "POLYMER", hint: "Molecule composed of many repeating subunits" },
  { word: "RECURSION", hint: "Function calling itself in computer science" },
];

export const WordClash: React.FC<WordClashProps> = ({ theme, onComplete }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [current, setCurrent] = useState(STUDY_TERMS[0]);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);

  const nextWord = useCallback(() => {
    const next = STUDY_TERMS[Math.floor(Math.random() * STUDY_TERMS.length)];
    setCurrent(next);
    setGuess("");
    setMsg("");
  }, []);

  const getHintLetters = (): string => {
    const word = current.word;
    const numHints = Math.min(2, Math.ceil(word.length / 4));
    const hintIndices = new Set<number>();
    while (hintIndices.size < numHints) {
      hintIndices.add(Math.floor(Math.random() * word.length));
    }
    return Array.from(hintIndices)
      .map((i) => word[i])
      .join(", ");
  };

  const handleStart = () => {
    setScore(0);
    setTimeLeft(180);
    setMsg("");
    setGuess("");
    nextWord();
    setGameStarted(true);
  };

  useEffect(() => {
    let timer: any;
    if (gameStarted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && gameStarted) {
      setGameStarted(false);
      onComplete?.(score);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, score, onComplete]);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.toUpperCase().trim() === current.word) {
      setScore((s) => s + 50);
      setMsg("✅ CRITICAL HIT!");
      setTimeout(nextWord, 800);
    } else {
      setMsg("❌ ATTACK MISSED!");
    }
  };

  const isLight = theme === "light";
  const cardBg = isLight
    ? "bg-white border-gray-200"
    : "bg-purple-dark border-purple-soft";
  const textColor = isLight ? "text-gray-900" : "text-white";

  return (
    <div
      className={`max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-8 rounded-2xl sm:rounded-[3.5rem] border-2 text-center animate-in zoom-in duration-300 shadow-2xl relative overflow-hidden ${cardBg}`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <div
          className="h-full bg-neon-purple transition-all duration-1000"
          style={{ width: `${(timeLeft / 180) * 100}%` }}
        ></div>
      </div>

      <span
        className="text-4xl sm:text-6xl block mb-6 animate-bounce"
        aria-hidden="true"
      >
        📖
      </span>
      <h2
        className={`text-2xl sm:text-4xl font-black italic uppercase tracking-tighter mb-2 ${textColor}`}
      >
        Word Clash
      </h2>
      <p className="text-gray-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-12 italic">
        Terminology Speed Combat
      </p>

      {!gameStarted ? (
        <div className="space-y-10 animate-in fade-in duration-300">
          <p
            className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"} font-medium max-w-sm mx-auto leading-relaxed`}
          >
            Identify NEB definitions instantly Scholar. Accuracy adds to your
            global profile XP.
          </p>
          {score > 0 && (
            <p className="text-neon-purple font-black text-2xl uppercase italic animate-pulse">
              Victory XP: +{score}
            </p>
          )}
          <button
            onClick={handleStart}
            className="bg-gradient-purple text-white px-16 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-purple-900/60 hover:scale-105 active:scale-95 transition-all focus:ring-4 ring-neon-purple/20"
          >
            Launch Clash
          </button>
        </div>
      ) : (
        <div className="animate-in zoom-in duration-300 space-y-10">
          <div className="flex justify-between items-center mb-8 px-6">
            <div className="text-left">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                Reactor Time
              </p>
              <p
                className={`text-4xl font-black ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-neon-purple"}`}
              >
                {timeLeft}s
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                Combat Score
              </p>
              <p className={`text-4xl font-black ${textColor}`}>{score}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div
              className={`p-10 bg-black/50 rounded-[2.5rem] border-2 border-white/5 shadow-inner`}
            >
              <p
                className={`text-lg md:text-xl font-black italic text-gray-300 leading-relaxed`}
                aria-live="polite"
              >
                Intelligence: {current.hint}
              </p>
              <p
                className={`text-sm md:text-base font-semibold text-[#00e5ff] mt-4 tracking-widest`}
              >
                Hint Letters: {getHintLetters()}
              </p>
            </div>
            <div
              className="flex justify-center flex-wrap gap-3"
              aria-hidden="true"
            >
              {current.word.split("").map((char, i) => (
                <div
                  key={i}
                  className={`w-10 h-14 md:w-14 md:h-18 border-b-4 flex items-center justify-center font-black text-3xl md:text-4xl transition-all ${isLight ? "border-gray-200 text-gray-900" : "border-white/10 text-white"} ${guess[i] ? "border-neon-purple scale-110" : ""}`}
                >
                  {timeLeft === 0
                    ? char
                    : guess[i]
                      ? guess[i].toUpperCase()
                      : ""}
                </div>
              ))}
            </div>
            {timeLeft === 0 && (
              <div
                className={`p-6 rounded-lg font-black text-xl text-[#00e5ff] text-center italic tracking-wider`}
              >
                Answer: {current.word}
              </div>
            )}
          </div>

          <form onSubmit={handleGuess} className="space-y-10 max-w-sm mx-auto">
            {timeLeft > 0 && (
              <>
                <input
                  autoFocus
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className={`w-full bg-transparent border-b-4 text-center text-4xl font-black outline-none py-4 uppercase transition-all ${isLight ? "border-gray-100 text-gray-900" : "border-white/10 text-white focus:border-neon-purple shadow-neon-soft"}`}
                  placeholder="TYPE..."
                />
                {msg && (
                  <p
                    className={`text-xl font-black uppercase italic tracking-widest animate-bounce ${msg.includes("✅") ? "text-green-500" : "text-red-500"}`}
                  >
                    {msg}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-6">
                  <button
                    type="submit"
                    className="bg-gradient-purple text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    STRIKE
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameStarted(false)}
                    className={`${isLight ? "bg-gray-100 text-gray-500" : "bg-white/5 text-gray-400"} py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-red-500/20 hover:text-red-500 transition-all`}
                  >
                    ABORT
                  </button>
                </div>
              </>
            )}
            {timeLeft === 0 && (
              <button
                type="button"
                onClick={() => setGameStarted(false)}
                className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs ${isLight ? "bg-gray-100 text-gray-900" : "bg-gradient-purple text-white"} hover:scale-105 active:scale-95 transition-all`}
              >
                BACK TO MENU
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
