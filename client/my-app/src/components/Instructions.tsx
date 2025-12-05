import React from "react";

interface InstructionsProps {
  onBack: () => void;
}

export default function Instructions({ onBack }: InstructionsProps) {
  return (
    <div className="instructions-page">
      <h2>Game Instructions</h2>

      <ul className="instruction-list">
        <li>Roll dice to move forward.</li>
        <li>Your board layout comes from the server.</li>
        <li>Scenarios, rewards, events, quizzes all come from backend logic.</li>
        <li>Gain reputation, knowledge, and coins.</li>
        <li>Finish levels → Graduate!</li>
      </ul>

      <button className="btn-secondary" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
