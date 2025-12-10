import React from "react";

interface InstructionsProps {
  onBack: () => void;
}

export default function Instructions({ onBack }: InstructionsProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-start px-4 py-10">
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-sky-400">How to Play</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm md:text-base"
          >
            Back
          </button>
        </header>

        <ul className="list-disc pl-5 space-y-2 text-slate-200 text-sm md:text-base">
          <li>Choose an avatar and discipline to begin your journey.</li>
          <li>Roll the dice to move across the academic publishing board.</li>
          <li>Encounter quizzes, ethical dilemmas, and events from the backend.</li>
          <li>Earn reputation, knowledge, and coins for good decisions.</li>
          <li>Complete all levels and graduate with a badge at the end.</li>
        </ul>
      </div>
    </div>
  );
}
