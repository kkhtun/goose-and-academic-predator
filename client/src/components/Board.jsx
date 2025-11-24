export default function Board({ squares, playerPosition, playerEmoji }) {
  return (
    <div className="board-grid">
      {squares.map((sq) => {
        const classes = `board-square ${mapType(sq.type)} ${
          playerPosition === sq.id ? 'square-current' : ''
        }`;
        const faded =
          sq.visited && sq.id !== playerPosition ? { opacity: 0.85 } : null;

        return (
          <div key={sq.id} className={classes} style={faded} title={sq.type}>
            {playerPosition === sq.id && (
              <div className="player-marker">{playerEmoji || '🪿'}</div>
            )}

            <div style={{ fontSize: 14, marginBottom: 6 }}>{sq.label}</div>

            <div style={{ fontSize: 18 }}>
              {typeIcon(sq.type, sq.predator)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** NEW: icon helper with predator & pause support */
function typeIcon(t, predator) {
  return t === 'reward'
    ? '🎁'             // Reward square → gift emoji
    : t === 'event'
    ? '📣'             // Event square → loudspeaker
    : t === 'quiz'
    ? '❓'             // Quiz square → question mark
    : t === 'build'
    ? '🏗️'            // Build square → construction crane
    : t === 'choice'
    ? '⚖️'            // Moral choice square → scales of justice
    : t === 'predator'
    ? predator?.mode === 'start'
      ? '🐍'           // Predator "start" mode = big snake, send player to START
      : '🪱'           // Predator "back steps" mode = worm, move player back
    : t === 'pause'
    ? '🛎️'            // Pause square → bell (like “take a break / wait”)
    : t === 'start'
    ? '🚩'            // Starting square → red flag
    : t === 'finish'
    ? '🏁'            // Finish square → checkered flag
    : t === 'challenge'
    ? '🎯'            // Challenge square → target/dartboard
    : t === 'puzzle'
    ? '🧩'            // Puzzle square → jigsaw piece
    : '⬜';           // Fallback: empty white square
}

/** EXTENDED: map new types to CSS classes */
function mapType(t) {
  const m = {
    reward: 'square-reward',
    event: 'square-event',
    quiz: 'square-quiz',
    build: 'square-build',
    choice: 'square-choice',
    predator: 'square-predator', // NEW
    pause: 'square-pause',       // NEW
    start: 'square-start',
    finish: 'square-finish',
    challenge: 'square-challenge',
    puzzle: 'square-puzzle',
  };
  return m[t] || '';
}
