import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";
import { WordClash } from "./WordClash";
import { TrueScholar } from "./TrueScholar";
import { DefinerDuel } from "./DefinerDuel";
import { CombatTerms } from "./CombatTerms";
import { FormulaScramble } from "./FormulaScramble";
import { TimelineTraveler } from "./TimelineTraveler";
import { ScholarGame } from "./ScholarGame";

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  component: React.ComponentType<any>;
}

const GamesHub: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games: Game[] = [
    {
      id: "wordclash",
      name: "Word Clash",
      description:
        "Guess the word from hints. A lightning-fast vocabulary challenge!",
      icon: "⚡",
      color: "from-blue-500 to-cyan-500",
      component: WordClash,
    },
    {
      id: "truescholar",
      name: "True Scholar",
      description: "Answer True/False questions and test your knowledge.",
      icon: "✓",
      color: "from-green-500 to-teal-500",
      component: TrueScholar,
    },
    {
      id: "definerduel",
      name: "Definer Duel",
      description:
        "Match definitions with correct terms. A vocabulary showdown!",
      icon: "🎯",
      color: "from-purple-500 to-pink-500",
      component: DefinerDuel,
    },
    {
      id: "combatterms",
      name: "Combat Terms",
      description: "Battle with synonyms and antonyms. Master vocabulary fast!",
      icon: "⚔️",
      color: "from-red-500 to-orange-500",
      component: CombatTerms,
    },
    {
      id: "formulascramble",
      name: "Formula Scramble",
      description: "Arrange formula components in correct order.",
      icon: "🔢",
      color: "from-yellow-500 to-amber-500",
      component: FormulaScramble,
    },
    {
      id: "timelinetraveler",
      name: "Timeline Traveler",
      description: "Order events chronologically. Journey through history!",
      icon: "⏳",
      color: "from-orange-500 to-red-500",
      component: TimelineTraveler,
    },
    {
      id: "scholargame",
      name: "Scholar Game",
      description: "Ultimate challenge mode. Mix of all game types!",
      icon: "👑",
      color: "from-pink-500 to-rose-500",
      component: ScholarGame,
    },
  ];

  if (selectedGame) {
    const game = games.find((g) => g.id === selectedGame);
    if (game) {
      const GameComponent = game.component;
      return (
        <div
          className={`min-h-screen pt-20 sm:pt-32 pb-20 transition-colors duration-300 ${
            isDark ? "bg-[#0a0a0a]" : "bg-white"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4">
            {/* Back Button */}
            <button
              onClick={() => setSelectedGame(null)}
              className={`mb-6 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all flex items-center gap-2 text-xs sm:text-sm ${
                isDark
                  ? "bg-[#1a1a1a] text-white hover:bg-[#222]"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              ← Back to Games
            </button>

            {/* Game Title */}
            <h1
              className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {game.name} {game.icon}
            </h1>
            <p
              className={`text-xs sm:text-lg mb-6 sm:mb-8 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {game.description}
            </p>

            {/* Game Component */}
            <div
              className={`rounded-2xl overflow-hidden border transition-colors duration-300 ${
                isDark
                  ? "border-[#1a1a1a] bg-[#0f0f0f]"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <GameComponent theme={theme} />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div
      className={`min-h-screen pt-32 pb-20 transition-colors duration-300 ${
        isDark ? "bg-[#0a0a0a]" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-5 py-2 rounded-full border border-[#00e5ff]/20 bg-[#00e5ff]/5 text-[#00e5ff] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <span className="relative flex h-2 w-2 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5ff]"></span>
            </span>
            🎮 Interactive Learning Games
          </div>

          <h1
            className={`text-5xl md:text-6xl font-extrabold mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Learn While You <span className="text-[#00e5ff]">Play</span>
          </h1>

          <p
            className={`text-lg md:text-xl max-w-2xl mx-auto ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Challenge your brain with interactive games designed to make
            learning fun, engaging, and effective. Master subjects through
            gamification!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className={`group p-8 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg hover:scale-105 ${
                isDark
                  ? "border-[#1a1a1a] bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] hover:border-[#00e5ff]/50"
                  : "border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-cyan-400"
              }`}
            >
              {/* Game Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}
              >
                {game.icon}
              </div>

              {/* Game Name */}
              <h3
                className={`text-2xl font-bold mb-3 group-hover:text-[#00e5ff] transition-colors ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {game.name}
              </h3>

              {/* Game Description */}
              <p
                className={`text-sm mb-4 group-hover:text-[#00e5ff] transition-colors ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {game.description}
              </p>

              {/* Play Button */}
              <div className="flex items-center text-[#00e5ff] font-bold text-sm group-hover:gap-3 gap-2 transition-all">
                <span>Play Now</span>
                <span className="group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Features Section */}
        <div
          className={`rounded-2xl border-2 p-12 transition-colors duration-300 ${
            isDark
              ? "border-[#1a1a1a] bg-[#0f0f0f]"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <h2
            className={`text-3xl font-bold mb-8 text-center ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Why Play Learning Games?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🧠",
                title: "Boost Memory",
                desc: "Engage active recall for better retention",
              },
              {
                icon: "⚡",
                title: "Instant Feedback",
                desc: "Know right/wrong answers immediately",
              },
              {
                icon: "🎯",
                title: "Track Progress",
                desc: "See your improvement over time",
              },
              {
                icon: "🏆",
                title: "Earn Badges",
                desc: "Unlock achievements and compete",
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3
                  className={`font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesHub;
