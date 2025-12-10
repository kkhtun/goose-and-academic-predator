import React from "react";

interface Stats {
  reputation: number;
  knowledge: number;
  coins: number;
  skipNextTurn?: boolean;
}

interface BoardSquare {
  id: number;
  type: string;
  label: string;
  visited?: boolean;
}

interface DiceResult {
  d1: number;
  d2: number;
  total: number;
}

interface Quiz {
  id: string | number;
  question: string;
  options: string[];
}

interface LevelProps {
  level: number;
  board: BoardSquare[];
  stats: Stats;
  mentor: string;
  position: number;
  turn: number;
  dice: DiceResult | null;
  quiz: Quiz | null;
  onRoll: () => void;
  onQuizAnswer: (answerIndex: number) => void;
  onExit: () => void;
}

export default function Level({
  level,
  board,
  stats,
  mentor,
  position,
  turn,
  dice,
  quiz,
  onRoll,
  onQuizAnswer,
  onExit,
}: LevelProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-start px-4 py-10">
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-sky-400">
              Level {level}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Turn #{turn} • Reputation ⭐{stats.reputation} • Knowledge 📚{stats.knowledge} • Coins 🪙{stats.coins}
            </p>
          </div>
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm md:text-base"
          >
            Exit
          </button>
        </header>

        {/* Mentor message */}
        <section className="p-3 md:p-4 rounded-xl bg-sky-500/10 border border-sky-500/40 text-sm md:text-base flex gap-2">
          <span className="text-xl">🦎</span>
          <p className="text-slate-100">{mentor}</p>
        </section>

        {/* Board */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-300">Board</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-80 overflow-auto p-3 bg-slate-900/70 border border-slate-700 rounded-xl">
            {board.map((sq) => (
              <div
                key={sq.id}
                className={`relative p-2 rounded-lg border text-center text-[11px] md:text-xs
                ${
                  position === sq.id
                    ? "border-sky-400 bg-slate-800 shadow-md"
                    : "border-slate-700 bg-slate-900/80"
                }`}
              >
                {position === sq.id && (
                  <div className="absolute -top-2 left-1 text-lg">🪿</div>
                )}
                <div className="text-slate-200">{sq.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Controls + Dice */}
        <section className="flex items-center gap-4">
          <button
            onClick={onRoll}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-md text-sm md:text-base"
          >
            Roll Dice
          </button>
          {dice && (
            <div className="px-4 py-2 rounded-full bg-slate-800 border border-slate-600 text-sm md:text-base">
              🎲 {dice.d1} + {dice.d2} = <span className="font-semibold">{dice.total}</span>
            </div>
          )}
        </section>

        {/* Quiz Modal */}
        {quiz && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
              <h3 className="text-xl font-semibold text-sky-300">Quick Quiz</h3>
              <p className="text-slate-100 text-sm md:text-base">{quiz.question}</p>
              <div className="space-y-2">
                {quiz.options.map((opt, index) => (
                  <button
                    key={index}
                    onClick={() => onQuizAnswer(index)}
                    className="w-full text-left px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sm md:text-base"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
