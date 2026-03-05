import React, { useState, useEffect, useCallback } from "react";
import { Theme } from "../types";

interface ScholarGameProps {
  theme: Theme;
  onComplete?: (score: number) => void;
}

export const ScholarGame: React.FC<ScholarGameProps> = ({
  theme,
  onComplete,
}) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [isActive, setIsActive] = useState(false);
  const [problem, setProblem] = useState({ q: "READY?", a: 0 });
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<
    "perfect" | "excellent" | "good" | null
  >(null);
  const [problemStartTime, setProblemStartTime] = useState(Date.now());

  const generateProblem = useCallback(() => {
    const ops = ["+", "-", "*", "/"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1 = 0,
      n2 = 0,
      a = 0;

    if (op === "+") {
      n1 = Math.floor(Math.random() * 50) + 1;
      n2 = Math.floor(Math.random() * 50) + 1;
      a = n1 + n2;
    } else if (op === "-") {
      n1 = Math.floor(Math.random() * 50) + 20;
      n2 = Math.floor(Math.random() * 20) + 1;
      a = n1 - n2;
    } else if (op === "*") {
      n1 = Math.floor(Math.random() * 12) + 1;
      n2 = Math.floor(Math.random() * 12) + 1;
      a = n1 * n2;
    } else if (op === "/") {
      n2 = Math.floor(Math.random() * 10) + 1;
      a = Math.floor(Math.random() * 10) + 1;
      n1 = n2 * a;
    }

    setProblem({
      q: `${n1} ${op === "*" ? "×" : op === "/" ? "÷" : op} ${n2}`,
      a,
    });
    setProblemStartTime(Date.now());
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(40);
    setAnswer("");
    setFeedback(null);
    setFeedbackType(null);
    generateProblem();
    setIsActive(true);
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

  const checkAnswer = (val: string) => {
    setAnswer(val);
    if (parseInt(val) === problem.a) {
      const timeTaken = (Date.now() - problemStartTime) / 1000;
      let type: "perfect" | "excellent" | "good";

      if (timeTaken < 2) {
        type = "perfect";
        setFeedback("🌟 PERFECT! Lightning Fast!");
      } else if (timeTaken < 4) {
        type = "excellent";
        setFeedback("⭐ EXCELLENT! Amazing Speed!");
      } else {
        type = "good";
        setFeedback("✅ GOOD! Keep Going!");
      }

      setFeedbackType(type);
      setScore((s) => s + 20);
      setAnswer("");

      setTimeout(() => {
        setFeedback(null);
        setFeedbackType(null);
        generateProblem();
      }, 500);
    }
  };

  const isLight = theme === "light";
  const cardBg = isLight
    ? "bg-white border-gray-200 shadow-sm"
    : "bg-purple-dark border-purple-soft shadow-xl";
  const textColor = isLight ? "text-gray-900" : "text-white";

  return (
    <section
      aria-labelledby="math-commando-title"
      className={`w-full py-8 sm:py-12 px-4 sm:px-8 rounded-2xl sm:rounded-[3rem] border-2 text-center animate-in zoom-in duration-300 shadow-2xl relative overflow-hidden ${cardBg}`}
    >
      <div className="hidden sm:block absolute top-0 right-0 p-8 opacity-5 text-8xl font-black italic select-none pointer-events-none">
        MATH
      </div>
      <span className="text-4xl sm:text-5xl block mb-4" aria-hidden="true">
        🧮
      </span>
      <h2
        id="math-commando-title"
        className={`text-2xl sm:text-4xl font-black italic uppercase tracking-tighter mb-2 ${textColor}`}
      >
        Math Commando
      </h2>
      <p className="text-cyan-400 font-black text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-6 sm:mb-10 italic">
        Quick-Fire Calculation Combat
      </p>

      {!isActive ? (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          <p
            className={`text-xs sm:text-sm ${isLight ? "text-gray-600" : "text-gray-400"} font-medium max-w-sm mx-auto leading-relaxed`}
          >
            Addition, Subtraction, Multiplication, and Division. <br />
            Solve as many as you can in 40 seconds. 20 XP per hit!
          </p>
          {score > 0 && (
            <div className="bg-cyan-500/10 border border-cyan-500/20 py-3 sm:py-4 rounded-xl sm:rounded-2xl animate-bounce">
              <p className="text-cyan-400 font-black text-lg sm:text-2xl uppercase italic">
                VICTORY: +{score} XP
              </p>
            </div>
          )}
          <button
            onClick={startGame}
            aria-label="Start Math Commando"
            className="bg-cyan-600 text-white px-8 sm:px-12 py-3 sm:py-5 rounded-xl sm:rounded-[2rem] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-[10px] sm:text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-900/40 focus:ring-4 ring-cyan-500/20"
          >
            Engage Combat
          </button>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8 animate-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-6 sm:mb-10 px-2 sm:px-4">
            <div className="text-left">
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Reactor Time
              </p>
              <p
                aria-live="assertive"
                className={`text-3xl sm:text-4xl font-black italic ${timeLeft < 5 ? "text-red-500 animate-pulse" : "text-cyan-400"}`}
              >
                {timeLeft}s
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Earned XP
              </p>
              <p
                aria-live="polite"
                className={`text-3xl sm:text-4xl font-black italic ${textColor}`}
              >
                {score}
              </p>
            </div>
          </div>

          {feedback && (
            <div
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl text-center font-black text-base sm:text-xl uppercase animate-bounce ${
                feedbackType === "perfect"
                  ? "bg-yellow-500/20 border border-yellow-500/50 text-yellow-300"
                  : feedbackType === "excellent"
                    ? "bg-blue-500/20 border border-blue-500/50 text-blue-300"
                    : "bg-green-500/20 border border-green-500/50 text-green-300"
              }`}
            >
              {feedback}
            </div>
          )}

          <div className="p-12 bg-black/40 rounded-[3rem] border border-white/5 shadow-inner relative group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-[8px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
              TARGET
            </div>
            <h3
              className="text-6xl md:text-7xl font-black text-white italic tracking-widest"
              aria-live="polite"
            >
              {problem.q}
            </h3>
          </div>

          <div className="max-w-xs mx-auto space-y-4">
            <input
              id="math-answer-input"
              type="number"
              autoFocus
              value={answer}
              onChange={(e) => checkAnswer(e.target.value)}
              className="w-full bg-transparent border-b-8 border-cyan-500 text-center text-7xl font-black outline-none py-4 text-white placeholder-white/5"
              placeholder="?"
              aria-label="Your Answer"
            />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic animate-pulse">
              Type answer to fire instantly!
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
