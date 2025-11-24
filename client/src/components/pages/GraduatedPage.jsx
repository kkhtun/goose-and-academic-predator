export default function GraduatedPage({ score, badge, reputation, knowledge, coins, onRestart }) {
  return (
    <div className="win-screen">
      <h2 className="modal-title">You Finished the Board!</h2>
      <div className="trophy">{badge.badge}</div>
      <div className="final-stats">
        <div className="stat-card"><div className="stat-value" style={{color:badge.color}}>{badge.level}</div><div className="stat-label">Badge</div></div>
        <div className="stat-card"><div className="stat-value">{score}</div><div className="stat-label">Total Score</div></div>
        <div className="stat-card"><div className="stat-value">{reputation}</div><div className="stat-label">Reputation</div></div>
        <div className="stat-card"><div className="stat-value">{knowledge}</div><div className="stat-label">Knowledge</div></div>
        <div className="stat-card"><div className="stat-value">{coins}</div><div className="stat-label">Coins</div></div>
      </div>
      <button className="btn btn-primary" onClick={onRestart}>Play Again</button>
    </div>
  )
}
