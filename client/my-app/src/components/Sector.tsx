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
  onBack
}: SectorProps) {
  return (
    <div className="sector-page">

      <h2>Select Your Researcher</h2>

      <div className="animal-grid">
        {animals.map((a) => (
          <div
            key={a.id}
            className={`animal-card ${
              selectedAnimal?.id === a.id ? "selected" : ""
            }`}
            onClick={() => setSelectedAnimal(a)}
          >
            <div className="animal-emoji">{a.emoji}</div>
            <div className="animal-name">{a.name}</div>
            <div className="animal-skill">{a.skill}</div>
          </div>
        ))}
      </div>

      <div className="discipline-container">
        <label>Select Discipline:</label>
        <select
          value={selectedDiscipline}
          onChange={(e) => setSelectedDiscipline(e.target.value)}
        >
          <option value="">Choose a field…</option>
          {disciplines.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="sector-buttons">
        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn-primary"
          disabled={!selectedAnimal || !selectedDiscipline}
          onClick={onStart}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
