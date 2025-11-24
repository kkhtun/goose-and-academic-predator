import MentorBox from '../MentorBox'
import Progress from '../Progress'
import Board from '../Board'
import StatChips from '../ui/StatChips'
import DicePanel from '../ui/DicePanel'

export default function LevelPage({ level, animal, discipline, game, actions }) {
  const {
    playerPosition, turnCount, reputation, knowledge, coins, diceResult,
    boardSquares, mentorMessage, skipNextTurn, isRolling,
    currentEvent, currentQuiz
  } = game

  const { rollDice, resetLevel, closeEvent, closeQuiz, handleQuizAnswer, handleEventChoice } = actions
  const progressPercent = Math.round((playerPosition / 89) * 100)

  return (
    <div className="game-board">
      {/* HEADER */}
      <div
        className="board-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 12
        }}
      >
        {/* Left: title + player info */}
        <div style={{ display: 'grid', gap: 6 }}>
          <div>
            <h2 className="modal-title" style={{ margin: 0 }}>LEVEL {level}</h2>
            <div style={{ opacity: .8, fontWeight: 600 }}>Let’s Begin</div>
          </div>

          {/* Player info (replaces old HUD) */}
          <div
            className="player-info"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'linear-gradient(145deg, #f5f5f5, #ffffff)',
              padding: '10px 16px',
              borderRadius: 12,
              boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{ fontSize: 28 }}>{animal?.emoji || '🪿'}</div>
            <div>
              <div style={{ fontWeight: 'bold' }}>
                {animal?.name || 'Player'} — {discipline || 'Discipline'}
              </div>
              <div style={{ fontSize: 12, color: '#555' }}>
                Turn #{turnCount} • Position {playerPosition + 1} / 90
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dice first, then stat chips, then reset */}
        <div
          className="board-tools"
          style={{ display: 'grid', gap: 10, justifyItems: 'end' }}
        >
          <DicePanel
            diceResult={diceResult}
            isRolling={isRolling}
            skipNextTurn={skipNextTurn}
            onRoll={rollDice}
          />

          <StatChips
            reputation={reputation}
            knowledge={knowledge}
            coins={coins}
          />

          <button className="btn btn-secondary" onClick={resetLevel}>
            Reset Level
          </button>
        </div>
      </div>

      {/* Mentor + progress */}
      <MentorBox message={mentorMessage} />
      <Progress percent={progressPercent} />

      {/* Board */}
      <Board
        squares={boardSquares}
        playerPosition={playerPosition}
        playerEmoji={animal?.emoji}
      />

      {/* Event modal */}
      {currentEvent && (
        <div className="event-modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-icon">📣</div>
              <div className="modal-title">{currentEvent.title}</div>
            </div>
            <div className="modal-body">{currentEvent.description}</div>
            <div className="choices">
              {currentEvent.choices.map((c, i) => (
                <button key={i} className="choice-btn" onClick={() => handleEventChoice(c)}>
                  {c.text}
                </button>
              ))}
            </div>
            <div className="center" style={{ marginTop: 10 }}>
              <button className="btn btn-secondary" onClick={closeEvent}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz modal */}
      {currentQuiz && (
        <div className="quiz-modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-icon">❓</div>
              <div className="modal-title">Quick Quiz</div>
            </div>
            <div className="modal-body">
              <div style={{ fontWeight: 'bold', marginBottom: 10 }}>
                {currentQuiz.question}
              </div>
              <div className="choices">
                {currentQuiz.options.map((opt, idx) => (
                  <button key={idx} className="choice-btn" onClick={() => handleQuizAnswer(idx)}>
                    {opt}
                  </button>
                ))}
              </div>
              <div className="center" style={{ marginTop: 10 }}>
                <button className="btn btn-secondary" onClick={closeQuiz}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
