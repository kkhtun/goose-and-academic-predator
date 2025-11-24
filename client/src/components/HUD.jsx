export default function HUD({ animal, discipline, turn, pos, reputation, knowledge, coins }) {
  return (
    <div className="board-header">
      <div className="player-info">
        <div style={{ fontSize: 28 }}>{animal?.emoji || '🪿'}</div>
        <div>
          <div style={{ fontWeight: 'bold' }}>
            {animal?.name || 'Player'} — {discipline || 'Discipline'}
          </div>
          <div style={{ fontSize: 12, color: '#555' }}>
            Turn #{turn} • Position {pos + 1} / 90
          </div>
        </div>
      </div>
      <div className="stats">
        <div className="stat-item">⭐ {reputation}</div>
        <div className="stat-item">📚 {knowledge}</div>
        <div className="stat-item">🪙 {coins}</div>
      </div>
    </div>
  )
}
