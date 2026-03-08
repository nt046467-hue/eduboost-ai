import React, { useState, useEffect, useCallback } from "react";
import { Theme } from "../types";

interface FormulaScrambleProps {
  theme: Theme;
  onComplete?: (score: number) => void;
}

const FORMULAS = [
  {
    name: "Einstein's Energy",
    parts: ["E", "=", "m", "c²"],
    description: "Mass-Energy Equivalence",
  },
  {
    name: "Newton's Second Law",
    parts: ["F", "=", "m", "a"],
    description: "Force equals mass times acceleration",
  },
  {
    name: "Ideal Gas Law",
    parts: ["P", "V", "=", "n", "R", "T"],
    description: "Pressure, Volume, Temperature relationship",
  },
  {
    name: "Kinetic Energy",
    parts: ["K.E", "=", "½", "m", "v²"],
    description: "Energy of motion",
  },
  {
    name: "Ohm's Law",
    parts: ["V", "=", "I", "R"],
    description: "Voltage, Current, Resistance",
  },
  {
    name: "Quadratic Equation",
    parts: ["x", "=", "-b", "±", "√D", "/", "2a"],
    description: "Finding roots of a quadratic",
  },
];

export const FormulaScramble: React.FC<FormulaScrambleProps> = ({
  theme,
  onComplete,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [feedback, setFeedback] = useState("");

  const shuffle = (array: string[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (JSON.stringify(arr) === JSON.stringify(array)) return shuffle(array);
    return arr;
  };

  const nextFormula = useCallback(() => {
    const next = FORMULAS[Math.floor(Math.random() * FORMULAS.length)];
    setShuffled(shuffle(next.parts));
    setUserSequence([]);
    setFeedback("");
    setCurrentIdx(FORMULAS.indexOf(next));
  }, []);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(45);
    setIsActive(true);
    nextFormula();
  };

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      onComplete?.(score);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, onComplete]);

  const handleBlockClick = (part: string, index: number) => {
    const newSeq = [...userSequence, part];
    const newShuffled = shuffled.filter((_, i) => i !== index);

    setUserSequence(newSeq);
    setShuffled(newShuffled);

    if (newShuffled.length === 0) {
      if (
        JSON.stringify(newSeq) === JSON.stringify(FORMULAS[currentIdx].parts)
      ) {
        setScore((s) => s + 50);
        setFeedback("EXCELLENT! +50 XP");
        setTimeout(nextFormula, 800);
      } else {
        setFeedback("WRONG ORDER! TRY AGAIN");
        setTimeout(() => {
          setShuffled(shuffle(FORMULAS[currentIdx].parts));
          setUserSequence([]);
          setFeedback("");
        }, 1000);
      }
    }
  };

  const isLight = theme === "light";
  const cardBg = isLight
    ? "bg-white border-gray-200"
    : "bg-purple-dark border-purple-soft";
  const textColor = isLight ? "text-gray-900" : "text-white";

  return (
    <div
      className={`max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6 rounded-2xl sm:rounded-[3rem] border text-center animate-in slide-in-from-left duration-500 shadow-2xl ${cardBg}`}
    >
      <span className="text-4xl sm:text-5xl block mb-4" aria-hidden="true">
        🧪
      </span>
      <h2
        className={`text-2xl sm:text-4xl font-black italic uppercase tracking-tighter mb-2 ${textColor}`}
      >
        Formula Scramble
      </h2>
      <p className="text-gray-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-6 sm:mb-10 italic">
        Reconstruct NEB Laws Under Pressure
      </p>

      {!isActive ? (
        <div className="space-y-8">
          <p
            className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"} font-medium max-w-sm mx-auto`}
          >
            Reorder the shuffled blocks to form the correct scientific or
            mathematical law. Accuracy earns high XP!
          </p>
          {score > 0 && (
            <p className="text-neon-purple font-black text-2xl uppercase italic">
              Total: {score} XP Earned
            </p>
          )}
          <button
            onClick={handleStart}
            className="bg-gradient-purple text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl focus:ring-2 ring-neon-purple outline-none"
            aria-label="Start Formula Scramble"
          >
            Enter Lab Arena
          </button>
        </div>
      ) : (
        <div className="space-y-10 animate-in zoom-in duration-300">
          <div className="flex justify-between items-center px-6">
            <div className="text-left">
              <p className="text-[10px] text-gray-500 uppercase font-black">
                Seconds
              </p>
              <p
                className={`text-3xl font-black ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-neon-purple"}`}
              >
                {timeLeft}s
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-black">
                Score
              </p>
              <p className={`text-3xl font-black ${textColor}`}>{score}</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-neon-purple text-[10px] font-black uppercase tracking-[0.2em]">
              {FORMULAS[currentIdx].name}
            </p>
            <p
              className={`text-xs font-medium italic ${isLight ? "text-gray-500" : "text-gray-400"}`}
            >
              {FORMULAS[currentIdx].description}
            </p>
          </div>

          <div
            className={`min-h-[100px] flex items-center justify-center gap-3 p-6 bg-black/30 rounded-[2rem] border-2 border-dashed ${isLight ? "border-gray-200" : "border-white/10"}`}
          >
            {userSequence.map((part, i) => (
              <div
                key={i}
                className="w-12 h-16 md:w-16 md:h-20 bg-neon-purple text-white flex items-center justify-center font-black text-2xl md:text-3xl rounded-2xl shadow-lg animate-in zoom-in duration-200"
              >
                {part}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 py-4">
            {shuffled.map((part, i) => (
              <button
                key={`${i}-${part}`}
                onClick={() => handleBlockClick(part, i)}
                className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-black text-xl md:text-2xl rounded-2xl border-2 transition-all hover:scale-110 active:scale-90 focus:ring-2 ring-neon-purple outline-none ${
                  isLight
                    ? "bg-gray-50 border-gray-200 text-gray-800"
                    : "bg-white/5 border-white/10 text-white"
                }`}
              >
                {part}
              </button>
            ))}
          </div>

          {feedback && (
            <p
              className={`text-lg font-black uppercase italic ${feedback.includes("WRONG") ? "text-red-500" : "text-green-500 animate-bounce"}`}
              role="status"
            >
              {feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
