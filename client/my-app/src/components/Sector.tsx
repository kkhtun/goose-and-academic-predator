import React from "react";

interface Animal {
  id: string;
  emoji: string;
  name: string;
  skill: string;
}

interface SectorProps {
  animals: Animal[];
  disciplines: string[];
  selectedAnimal: Animal | null;
  setSelectedAnimal: (a: Animal) => void;
  selectedDiscipline: string;
  setSelectedDiscipline: (value: string) => void;
  onStart: () => void;
  onBack: () => void;
}

export default function Sector({
  animals,
  disciplines,
  selectedAnimal,
  setSelectedAnimal,
  selectedDiscipline,
  setSelectedDiscipline,
  onStart,
  onBack,
}: SectorProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-start px-4 py-10">
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-sky-400">
            Select Your Researcher
          </h2>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm md:text-base"
          >
            Back
          </button>
        </header>

        {/* Animal Grid */}
        <section className="space-y-3">
          <p className="text-slate-300 text-sm md:text-base">
            Choose an avatar that represents your research style. This is just for fun and has no gameplay effects (yet!). 
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {animals.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedAnimal(a)}
                className={`cursor-pointer rounded-2xl p-4 border flex flex-col items-center text-center transition-all
                ${
                  selectedAnimal?.id === a.id
                    ? "border-sky-500 shadow-xl bg-slate-800"
                    : "border-slate-700 bg-slate-800/60 hover:border-sky-400 hover:bg-slate-800"
                }`}
              >
                <div className="text-4xl mb-2">{a.emoji}</div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-slate-300 text-xs mt-1">{a.skill}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Discipline */}
        <section className="space-y-2">
          <label className="block text-sm md:text-base font-medium text-slate-200">
            Select discipline
          </label>
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Choose a field…</option>
            {disciplines.map((d) => (
              <option key={d} value={d} className="text-black">
                {d}
              </option>
            ))}
          </select>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            disabled={!selectedAnimal || !selectedDiscipline}
            onClick={onStart}
            className={`px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition 
              ${
                !selectedAnimal || !selectedDiscipline
                  ? "bg-sky-700/40 text-slate-400 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-600 text-white shadow-md"
              }`}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
