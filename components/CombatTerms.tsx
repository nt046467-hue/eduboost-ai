import React, { useState, useEffect, useCallback } from "react";
import { Theme } from "../types";

interface CombatTermsProps {
  theme: Theme;
  onComplete?: (score: number) => void;
}

const WORD_PAIRS = [
  { word: "Happy", syn: "Joyful", ant: "Sad" },
  { word: "Big", syn: "Large", ant: "Small" },
  { word: "Fast", syn: "Quick", ant: "Slow" },
  { word: "Beautiful", syn: "Gorgeous", ant: "Ugly" },
  { word: "Bright", syn: "Luminous", ant: "Dark" },
  { word: "Common", syn: "Frequent", ant: "Rare" },
  { word: "Honest", syn: "Truthful", ant: "Dishonest" },
  { word: "Ancient", syn: "Old", ant: "Modern" },
  { word: "Rough", syn: "Coarse", ant: "Smooth" },
  { word: "Difficult", syn: "Hard", ant: "Easy" },
];

export const CombatTerms: React.FC<CombatTermsProps> = ({
  theme,
  onComplete,
}) => {
  const [gameActive, setGameActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<
    { text: string; isCorrect: boolean }[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [type, setType] = useState<"synonym" | "antonym" | null>(null);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12);

  const isLight = theme === "light";
  const cardBg = isLight
    ? "bg-white border-gray-200"
    : "bg-purple-dark border-purple-soft";
  const textColor = isLight ? "text-gray-900" : "text-white";

  const generateRound = useCallback(() => {
    // choose synonym or antonym round
    const isSynonym = Math.random() > 0.5;
    setType(isSynonym ? "synonym" : "antonym");
    const word = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    const correct = isSynonym ? word.syn : word.ant;

    // build distractors from other word pairs (same type)
    const pool = WORD_PAIRS.filter((w) => w.word !== word.word)
      .map((w) => (isSynonym ? w.syn : w.ant))
      .filter(Boolean);

    // shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // pick up to 3 distractors that are not equal to correct
    const distractors: string[] = [];
    for (const p of pool) {
      if (p !== correct && distractors.length < 3) distractors.push(p);
    }

    const opts = [correct, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(
      opts.map((opt) => ({
        text: opt,
        isCorrect: opt === correct,
      })),
    );

    setSelectedIndex(null);
    setLastCorrect(null);
    setFeedback(null);
    setTimeLeft(12);
  }, []);

  const endGame = () => {
    setGameActive(false);
    onComplete?.(score);
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setCurrentIdx(0);
    setSelectedIndex(null);
    setLastCorrect(null);
    setFeedback(null);
    setStreak(0);
    setTimeLeft(12);
    generateRound();
  };

  useEffect(() => {
    if (gameActive && currentIdx > 0 && currentIdx <= 4) {
      generateRound();
    }
  }, [currentIdx, gameActive, generateRound]);

  // timer per round
  useEffect(() => {
    if (!gameActive) return;
    if (selectedIndex !== null) return; // pause timer after answer
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          // time out -> treat as wrong
          handleAnswer(false, null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [gameActive, selectedIndex]);

  const handleAnswer = (isCorrect: boolean, idx: number | null) => {
    // prevent double answers
    if (selectedIndex !== null) return;

    setSelectedIndex(idx);
    setLastCorrect(isCorrect);
    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      setFeedback("✅ CORRECT!");
    } else {
      setFeedback("❌ Wrong!");
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIdx < 4) {
        setCurrentIdx((c) => c + 1);
        setSelectedIndex(null);
        setLastCorrect(null);
      } else {
        endGame();
      }
    }, 900);
  };

  if (!gameActive) {
    return (
      <div
        className={`max-w-2xl mx-auto py-12 px-8 rounded-[3rem] border shadow-2xl text-center ${cardBg}`}
      >
        <span className="text-6xl block mb-4" aria-hidden="true">
          ⚔️
        </span>
        <h2
          className={`text-4xl font-black italic uppercase tracking-tighter mb-2 ${textColor}`}
        >
          Combat Terms
        </h2>
        <p className="text-neon-purple font-black text-[10px] uppercase tracking-[0.4em] mb-10 italic">
          Synonyms & Antonyms Battle
        </p>

        <div className="space-y-8">
          <p
            className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"} font-medium leading-relaxed`}
          >
            Match words with their synonyms or antonyms. <br />5 fast-paced
            rounds. Quick reflexes earn points and streak bonuses!
          </p>
          {score > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 py-3 rounded-2xl animate-pulse">
              <p className="text-red-400 font-black text-xl uppercase italic">
                BATTLE SCORE: {score}
              </p>
              <p className="text-xs text-gray-400 mt-1">Streak: {streak}</p>
            </div>
          )}
          <button
            onClick={startGame}
            className="bg-red-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-900/40 focus:ring-4 ring-red-500/20"
          >
            Enter Combat
          </button>
        </div>
      </div>
    );
  }

  const currentWord = WORD_PAIRS[currentIdx];

  return (
    <div
      className={`max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-8 rounded-2xl sm:rounded-[3rem] border shadow-2xl text-center animate-in zoom-in duration-300 ${cardBg}`}
    >
      <div className="mb-6 sm:mb-8">
        <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
          Round {currentIdx + 1}/5
        </p>
        <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-red-500 h-full transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3
        className={`text-2xl sm:text-3xl font-black mb-3 sm:mb-4 ${textColor}`}
      >
        {currentWord.word}
      </h3>
      <p className="text-yellow-400 font-black text-xs sm:text-sm uppercase tracking-widest mb-6 sm:mb-8">
        Find the {type === "synonym" ? "SYNONYM" : "ANTONYM"}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 px-2 sm:px-0">
        {options.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          const showCorrect = selectedIndex !== null && opt.isCorrect;
          const showIncorrectSelected =
            selectedIndex !== null && !opt.isCorrect && isSelected;

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(opt.isCorrect, idx)}
              disabled={selectedIndex !== null}
              className={`p-4 sm:p-6 rounded-lg sm:rounded-2xl font-black uppercase text-xs sm:text-sm transition-all transform ${
                selectedIndex === null
                  ? isLight
                    ? "bg-gray-100 hover:border-orange-400 border border-gray-300 hover:bg-orange-50 active:scale-95"
                    : "bg-white/10 hover:border-red-400 border border-white/20 hover:bg-red-500/20 active:scale-95"
                  : showCorrect
                    ? "bg-green-500 border-green-500 text-white scale-105"
                    : showIncorrectSelected
                      ? "bg-red-500 border-red-500 text-white scale-105"
                      : "opacity-40 scale-95"
              } disabled:cursor-not-allowed`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div
          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl font-black text-base sm:text-lg uppercase animate-bounce ${
            feedback.includes("CORRECT")
              ? "bg-green-500/20 border border-green-500/50 text-green-300"
              : "bg-red-500/20 border border-red-500/50 text-red-300"
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-6">
        <p
          className={`text-xs sm:text-sm font-black uppercase tracking-widest ${isLight ? "text-gray-600" : "text-gray-400"}`}
        >
          Score: {score}
        </p>
        <p
          className={`text-xs sm:text-sm font-black uppercase tracking-widest text-yellow-400`}
        >
          Streak: {streak}
        </p>
        <p
          className={`text-xs sm:text-sm font-black uppercase tracking-widest text-pink-400`}
        >
          Time: {timeLeft}s
        </p>
      </div>
    </div>
  );
};
