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
  dice: { d1: number; d2: number; total: number } | null;
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
  onExit
}: LevelProps) {
  return (
    <div className="level-page">

      <div className="level-header">
        <h2>LEVEL {level}</h2>
        <button className="btn-secondary" onClick={onExit}>Exit</button>
      </div>

      <div className="level-stats">
        <span>⭐ {stats.reputation}</span>
        <span>📚 {stats.knowledge}</span>
        <span>🪙 {stats.coins}</span>
        <span>Turn #{turn}</span>
      </div>

      <div className="mentor-box">
        <p>{mentor}</p>
      </div>

      {/* Board Grid */}
      <div className="board-grid">
        {board.map((sq) => (
          <div
            key={sq.id}
            className={`board-square ${position === sq.id ? "current" : ""}`}
          >
            {position === sq.id && <div className="player-marker">🪿</div>}
            <div>{sq.label}</div>
          </div>
        ))}
      </div>

      {/* Roll Dice */}
      <div className="roll-section">
        <button className="btn-primary" onClick={onRoll}>
          Roll Dice
        </button>

        {dice && (
          <div className="dice-display">
            🎲 {dice.d1} + {dice.d2} = <b>{dice.total}</b>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      {quiz && (
        <div className="quiz-modal">
          <div className="quiz-card">
            <h3>Quiz</h3>
            <p>{quiz.question}</p>

            {quiz.options.map((opt, i) => (
              <button
                key={i}
                className="choice-btn"
                onClick={() => onQuizAnswer(i)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
