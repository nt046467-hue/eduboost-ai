import React, { useState, useEffect, useCallback } from "react";
import { Theme } from "../types";

interface TimelineTravelerProps {
  theme: Theme;
  onComplete?: (score: number) => void;
}

const MISSIONS = [
  {
    title: "Modern Nepal Evolution",
    events: [
      { name: "Unification of Nepal begins", year: 1768 },
      { name: "Sugauli Treaty signed", year: 1816 },
      { name: "Kot Massacre occurs", year: 1846 },
      { name: "Democratic Era begins", year: 1951 },
    ],
  },
  {
    title: "Computer Science Timeline",
    events: [
      { name: "First computer (ENIAC) built", year: 1946 },
      { name: "Transistor invented", year: 1947 },
      { name: "First programming language (FORTRAN)", year: 1957 },
      { name: "Internet (ARPANET) created", year: 1969 },
    ],
  },
  {
    title: "Scientific Discoveries",
    events: [
      { name: "Newton formulates Laws of Motion", year: 1687 },
      { name: "Darwin publishes Origin of Species", year: 1859 },
      { name: "Einstein develops Theory of Relativity", year: 1905 },
      { name: "Atomic bomb developed", year: 1945 },
    ],
  },
];

export const TimelineTraveler: React.FC<TimelineTravelerProps> = ({
  theme,
  onComplete,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentMission, setCurrentMission] = useState(MISSIONS[0]);
  const [userOrder, setUserOrder] = useState<any[]>([]);
  const [shuffledEvents, setShuffledEvents] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const shuffle = (array: any[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const nextMission = useCallback(() => {
    const next = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    setCurrentMission(next);
    setShuffledEvents(shuffle(next.events));
    setUserOrder([]);
    setFeedback(null);
  }, []);

  const handleStart = () => {
    setScore(0);
    setIsActive(true);
    nextMission();
  };

  const handleEventClick = (event: any) => {
    if (userOrder.includes(event)) return;
    const newOrder = [...userOrder, event];
    setUserOrder(newOrder);

    if (newOrder.length === currentMission.events.length) {
      const isCorrect =
        JSON.stringify(newOrder.map((e) => e.year)) ===
        JSON.stringify(
          [...currentMission.events]
            .sort((a, b) => a.year - b.year)
            .map((e) => e.year),
        );

      if (isCorrect) {
        const newScore = score + 200;
        setScore(newScore);
        setFeedback("CHRONOLOGY MASTERED! +200 XP");
        setTimeout(() => {
          setIsActive(false);
          onComplete?.(newScore);
        }, 2000);
      } else {
        setFeedback("TIME ANOMALY: Order is incorrect!");
        setTimeout(() => {
          setUserOrder([]);
          setFeedback(null);
        }, 1500);
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
      className={`max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6 rounded-2xl sm:rounded-[3rem] border text-center animate-in slide-in-from-bottom duration-500 shadow-2xl ${cardBg}`}
    >
      <span className="text-4xl sm:text-5xl block mb-4" aria-hidden="true">
        ⏳
      </span>
      <h2
        className={`text-2xl sm:text-4xl font-black italic uppercase tracking-tighter mb-2 ${textColor}`}
      >
        Timeline Traveler
      </h2>
      <p className="text-gray-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-6 sm:mb-10 italic">
        Chronology Challenge
      </p>

      {!isActive ? (
        <div className="space-y-6 sm:space-y-8">
          <p
            className={`text-xs sm:text-sm ${isLight ? "text-gray-600" : "text-gray-400"} font-medium max-w-sm mx-auto`}
          >
            Order historical events from oldest to newest.
          </p>
          <button
            onClick={handleStart}
            className="bg-gradient-purple text-white px-8 sm:px-12 py-3 sm:py-5 rounded-xl sm:rounded-[2rem] font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-xl"
          >
            Launch Time Mission
          </button>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-10 animate-in zoom-in duration-300">
          <div className="flex flex-col gap-2 sm:gap-3">
            {shuffledEvents.map((ev, i) => (
              <button
                key={i}
                disabled={userOrder.includes(ev)}
                onClick={() => handleEventClick(ev)}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-2xl font-black uppercase text-[8px] sm:text-[10px] tracking-widest border transition-all ${userOrder.includes(ev) ? "opacity-20 grayscale" : `${isLight ? "bg-gray-50 border-gray-200 text-gray-700" : "bg-white/5 border-white/5 text-gray-400 hover:text-white"}`}`}
              >
                {ev.name}
              </button>
            ))}
          </div>
          {feedback && (
            <p
              className={`text-base sm:text-lg font-black uppercase italic ${feedback.includes("ANOMALY") ? "text-red-500" : "text-green-500 animate-bounce"}`}
            >
              {feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
