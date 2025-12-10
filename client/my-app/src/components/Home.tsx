import React from "react";

interface HomeProps {
  onStart: () => void;
  onInstructions: () => void;
}

export default function Home({ onStart, onInstructions }: HomeProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-start px-4 py-10">
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-sky-400">
            Goose & Academic Predator
          </h1>
          <p className="text-slate-
          300 text-sm md:text-base">
            Navigate the publishing jungle. Learn to spot predatory journals while building a solid research profile.
          </p>
        </header>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onStart}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg transition"
          >
            Choose Sector
          </button>

          <button
            onClick={onInstructions}
            className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition"
          >
            Instructions
          </button>
        </div>
      </div>
    </div>
  );
}
