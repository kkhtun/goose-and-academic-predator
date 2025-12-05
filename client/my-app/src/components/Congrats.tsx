import React from "react";

interface CongratsProps {
  level: number;
  onNext: () => void;
  onFinish: () => void;
}

export default function Congrats({ level, onNext, onFinish }: CongratsProps) {
  return (
    <div className="congrats-page">
      <h1>🎉 Level {level} Completed!</h1>

      {level < 2 ? (
        <button className="btn-primary" onClick={onNext}>
          Continue to Level {level + 1}
        </button>
      ) : (
        <button className="btn-primary" onClick={onFinish}>
          Finish Game
        </button>
      )}
    </div>
  );
}
