interface HomeProps {
  onStart: () => void;
  onInstructions: () => void;
}

export default function Home({ onStart, onInstructions }: HomeProps) {
  return (
    <div className="w-full max-w-xl mx-auto p-10 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700 shadow-xl text-center mt-10 animate-fadeIn">
      <h1 className="text-4xl font-bold text-sky-400">Goose & Academic Predator</h1>
      <p className="text-slate-300 mt-3">Welcome to the Game</p>

      <div className="flex justify-center gap-4 mt-8">
        <button
          className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg transition"
          onClick={onStart}
        >
          Choose Sector
        </button>

        <button
          className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition"
          onClick={onInstructions}
        >
          Instructions
        </button>
      </div>
    </div>
  );
}
