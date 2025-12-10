import React from "react";

interface CongratsProps {
  level: number;
  onNext: () => void;
  onFinish: () => void;
}

export default function Congrats({ level, onNext, onFinish }: CongratsProps) {
  const isFinal = level >= 2;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-start px-4 py-10">
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl p-6 md:p-8 space-y-6 text-center">
        <h2 className="text-3xl font-bold text-emerald-400">🎉 Level {level} Complete!</h2>
        <p className="text-slate-300 text-sm md:text-base">
          Nice work! You've navigated this part of the publishing maze.
        </p>

        {isFinal ? (
          <button
            onClick={onFinish}
            className="mt-4 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md"
          >
            Finish Game & See Badge
          </button>
        ) : (
          <button
            onClick={onNext}
            className="mt-4 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-md"
          >
            Continue to Level {level + 1}
          </button>
        )}
      </div>
    </div>
  );
}
