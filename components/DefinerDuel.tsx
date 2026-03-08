import React, { useState, useEffect } from "react";
import { Theme } from "../types";

interface DefinerDuelProps {
  theme: Theme;
  onComplete?: (score: number) => void;
}

const DEFINITIONS = [
  { term: "Microeconomics", def: "Study of individual and business decisions" },
  {
    term: "Photosynthesis",
    def: "Process of converting light to chemical energy",
  },
  { term: "Derivatives", def: "Rate of change of a function" },
  { term: "Fiscal Policy", def: "Government spending and taxation usage" },
  { term: "Metabolism", def: "Chemical processes in a living organism" },
  { term: "Logic Gates", def: "Basic building blocks of digital circuits" },
];

export const DefinerDuel: React.FC<DefinerDuelProps> = ({
  theme,
  onComplete,
}) => {
  const [shuffledTerms, setShuffledTerms] = useState<string[]>([]);
  const [shuffledDefs, setShuffledDefs] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const shuffleArray = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

  const startDuel = () => {
    setShuffledTerms(shuffleArray(DEFINITIONS.map((d) => d.term)));
    setShuffledDefs(shuffleArray(DEFINITIONS.map((d) => d.def)));
    setMatches([]);
    setScore(0);
    setGameActive(true);
  };

  useEffect(() => {
    if (selectedTerm && selectedDef) {
      const pair = DEFINITIONS.find((d) => d.term === selectedTerm);
      if (pair && pair.def === selectedDef) {
        setMatches((prev) => [...prev, selectedTerm]);
        setScore((s) => s + 50);
        setSelectedTerm(null);
        setSelectedDef(null);
      } else {
        setTimeout(() => {
          setSelectedTerm(null);
          setSelectedDef(null);
        }, 500);
      }
    }
  }, [selectedTerm, selectedDef]);

  useEffect(() => {
    if (matches.length === DEFINITIONS.length && gameActive) {
      setGameActive(false);
      onComplete?.(score);
    }
  }, [matches, gameActive, score, onComplete]);

  const isLight = theme === "light";
  const cardBg = isLight
    ? "bg-white border-gray-200"
    : "bg-purple-dark border-purple-soft";
  const textColor = isLight ? "text-gray-900" : "text-white";

  return (
    <div
      className={`max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-8 rounded-2xl sm:rounded-[3rem] border shadow-2xl transition-all ${cardBg}`}
    >
      <div className="text-center mb-10">
        <span className="text-4xl sm:text-5xl mb-4 block">🤝</span>
        <h2
          className={`text-2xl sm:text-4xl font-black italic uppercase tracking-tighter ${textColor}`}
        >
          Definer's Duel
        </h2>
        <p className="text-neon-purple font-black text-[8px] sm:text-[10px] uppercase tracking-widest mt-2">
          Connect Concepts
        </p>
      </div>

      {!gameActive ? (
        <div className="text-center py-10">
          <p
            className={`mb-8 text-sm ${isLight ? "text-gray-600" : "text-gray-400"} font-medium`}
          >
            Match each term with its correct definition. Clear the board to earn
            300 XP!
          </p>
          {score > 0 && (
            <p className="text-green-500 font-black mb-6">
              Mastery Cleared: +{score} XP Added
            </p>
          )}
          <button
            onClick={startDuel}
            className="bg-gradient-purple text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-purple-900/40"
          >
            Enter Duel
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center mb-4">
              Terms
            </h4>
            {shuffledTerms.map((term) => (
              <button
                key={term}
                disabled={matches.includes(term)}
                onClick={() => setSelectedTerm(term)}
                className={`w-full p-5 rounded-2xl text-xs font-black uppercase tracking-tight border transition-all ${
                  matches.includes(term)
                    ? "opacity-0 scale-90 pointer-events-none"
                    : selectedTerm === term
                      ? "border-neon-purple bg-neon-purple/20 text-white"
                      : `${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/5"} hover:border-neon-purple/50`
                }`}
              >
                {term}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center mb-4">
              Definitions
            </h4>
            {shuffledDefs.map((def) => {
              const pairedTerm = DEFINITIONS.find((d) => d.def === def)?.term;
              const isMatched = pairedTerm
                ? matches.includes(pairedTerm)
                : false;
              return (
                <button
                  key={def}
                  disabled={isMatched}
                  onClick={() => setSelectedDef(def)}
                  className={`w-full p-5 rounded-2xl text-left text-[10px] font-bold border transition-all ${
                    isMatched
                      ? "opacity-0 scale-90 pointer-events-none"
                      : selectedDef === def
                        ? "border-neon-purple bg-neon-purple/20 text-white"
                        : `${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/5"} hover:border-neon-purple/50`
                  }`}
                >
                  {def}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
