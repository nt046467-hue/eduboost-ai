import React, { useState, useEffect } from "react";
import { Theme } from "../types";

interface TrueScholarProps {
  theme: Theme;
  onComplete?: (score: number) => void;
}

const STATEMENTS = [
  { text: "C is a case-sensitive language.", isTrue: true },
  { text: "The moon has zero gravity.", isTrue: false }, // Moon has ~1/6 of Earth's gravity
  { text: "Light travels faster in water than in air.", isTrue: false },
  { text: "Mitochondria is the powerhouse of the cell.", isTrue: true },
  {
    text: "Price and demand usually have a direct relationship.",
    isTrue: false, // Inverse relationship (law of demand)
  },
  { text: "Nepal became a Republic in 2008 AD.", isTrue: true },
  { text: "A vacuum allows sound to travel through it.", isTrue: false },
  { text: "The derivative of a constant is zero.", isTrue: true },
];

export const TrueScholar: React.FC<TrueScholarProps> = ({
  theme,
  onComplete,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2);
  const [feedback, setFeedback] = useState<string | null>(null);

  const startBlitz = () => {
    setIsActive(true);
    setScore(0);
    setCurrentIdx(0);
    setTimeLeft(2);
    setFeedback(null);
  };

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0 && !feedback) {
      timer = setInterval(() => setTimeLeft((t) => t - 0.1), 100);
    } else if (timeLeft <= 0 && isActive && !feedback) {
      handleAnswer(null);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, feedback]);

  const handleAnswer = (answer: boolean | null) => {
    if (feedback) return;

    const correct = answer === STATEMENTS[currentIdx].isTrue;
    let newScore = score;
    if (correct) {
      newScore = score + 10;
      setScore(newScore);
      setFeedback("FACT! +10 XP");
    } else {
      setFeedback("TRAP!");
    }

    setTimeout(() => {
      if (currentIdx < STATEMENTS.length - 1) {
        setCurrentIdx((prev) => prev + 1);
        setTimeLeft(2);
        setFeedback(null);
      } else {
        setIsActive(false);
        onComplete?.(newScore);
      }
    }, 1000);
  };

  const isLight = theme === "light";
  const cardBg = isLight
    ? "bg-white border-gray-200"
    : "bg-purple-dark border-purple-soft";
  const textColor = isLight ? "text-gray-900" : "text-white";

  return (
    <div
      className={`max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-8 rounded-2xl sm:rounded-[3rem] border shadow-2xl text-center ${cardBg}`}
    >
      <span className="text-4xl sm:text-5xl block mb-4">⚡</span>
      <h2
        className={`text-2xl sm:text-4xl font-black italic uppercase tracking-tighter ${textColor}`}
      >
        True Scholar
      </h2>
      <p className="text-neon-purple font-black text-[8px] sm:text-[10px] uppercase tracking-widest mt-2 mb-6 sm:mb-10">
        Fact or Trap Speedrun
      </p>

      {!isActive ? (
        <div className="py-10">
          <p
            className={`mb-8 text-sm ${isLight ? "text-gray-600" : "text-gray-400"} font-medium`}
          >
            Decide instantly if the statement is a FACT or a TRAP. You only have
            2 seconds per card!
          </p>
          {score > 0 && (
            <p className="text-2xl font-black text-green-500 mb-8">
              Rapid Score: {score} XP Added
            </p>
          )}
          <button
            onClick={startBlitz}
            className="bg-gradient-purple text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Start Blitz
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full transition-all duration-100 ${timeLeft < 0.5 ? "bg-red-500" : "bg-neon-purple"}`}
              style={{ width: `${(timeLeft / 2) * 100}%` }}
            ></div>
          </div>

          <div className="min-h-[120px] flex items-center justify-center">
            <p
              className={`text-2xl md:text-3xl font-black italic leading-tight ${textColor}`}
            >
              {STATEMENTS[currentIdx].text}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => handleAnswer(true)}
              disabled={!!feedback}
              className={`p-8 rounded-[2rem] font-black uppercase tracking-widest text-xl transition-all border-4 ${
                feedback && STATEMENTS[currentIdx].isTrue
                  ? "bg-green-500 border-green-500 text-white"
                  : feedback &&
                      !STATEMENTS[currentIdx].isTrue &&
                      feedback.includes("TRAP")
                    ? "opacity-50 grayscale border-transparent"
                    : "bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20"
              }`}
            >
              FACT
            </button>
            <button
              onClick={() => handleAnswer(false)}
              disabled={!!feedback}
              className={`p-8 rounded-[2rem] font-black uppercase tracking-widest text-xl transition-all border-4 ${
                feedback && !STATEMENTS[currentIdx].isTrue
                  ? "bg-red-500 border-red-500 text-white"
                  : feedback &&
                      STATEMENTS[currentIdx].isTrue &&
                      feedback.includes("TRAP")
                    ? "opacity-50 grayscale border-transparent"
                    : "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
              }`}
            >
              TRAP
            </button>
          </div>

          {feedback && (
            <p
              className={`text-xl font-black uppercase italic tracking-[0.2em] ${feedback.includes("FACT") ? "text-green-400" : "text-red-400"}`}
            >
              {feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
