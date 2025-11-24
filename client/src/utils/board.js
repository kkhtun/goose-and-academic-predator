// src/utils/board.js
const FIXED_SQUARES = new Set([0, 2, 11, 26, 34, 42, 57, 65, 73, 88, 89])

// choose a “free” index near a desired position if it collides with fixed/predator/pause
function findFreeIndex(target, taken, max = 89) {
  if (!taken.has(target) && !FIXED_SQUARES.has(target)) return target
  // look left/right for nearest free spot
  let left = target - 1
  let right = target + 1
  while (left >= 1 || right <= max - 1) {
    if (left >= 1 && !taken.has(left) && !FIXED_SQUARES.has(left)) return left
    if (right <= max - 1 && !taken.has(right) && !FIXED_SQUARES.has(right)) return right
    left--; right++
  }
  return target // fallback (shouldn’t really happen)
}

export function generateBoardSquares(level = 0) {
  const squares = []
  // add these into your baseTypes list
const baseTypes = ['reward', 'event', 'quiz', 'build', 'choice', 'challenge', 'puzzle'];

  // 1) Fill all 90 with base types
  for (let i = 0; i < 90; i++) {
    const t = baseTypes[Math.floor(Math.random() * baseTypes.length)]
    squares.push({ id: i, type: t, label: `${i + 1}`, visited: false })
  }

  // 2) Fixed story beats
  squares[0]  = { id: 0,  type: 'start',  label: 'START',        visited: false }
  squares[2]  = { id: 2,  type: 'quiz',   label: '3: Quiz',      visited: false }
  squares[11] = { id: 11, type: 'event',  label: '12: Scenario', visited: false }
  squares[26] = { id: 26, type: 'quiz',   label: '27: Data',     visited: false }
  squares[34] = { id: 34, type: 'quiz',   label: '35: Debate',   visited: false }
  squares[42] = { id: 42, type: 'choice', label: '43: Ethics',   visited: false }
  squares[57] = { id: 57, type: 'event',  label: '58: Publish',  visited: false }
  squares[65] = { id: 65, type: 'quiz',   label: '66: Media',    visited: false }
  squares[73] = { id: 73, type: 'event',  label: '74: Integrity',visited: false }
  squares[88] = { id: 88, type: 'quiz',   label: '89: Final',    visited: false }
  squares[89] = { id: 89, type: 'finish', label: 'FINISH',       visited: false }

  // 3) Predators by level (your spec)
  const PREDATORS_BY_LEVEL = {
    0: [ { pos: 22, mode: 'start' } ],
    1: [ { pos: 30, mode: 'back', steps: 6 }, { pos: 70, mode: 'start' } ],
    2: [ { pos: 18, mode: 'back', steps: 5 }, { pos: 49, mode: 'back', steps: 9 }, { pos: 81, mode: 'start' } ],
  }

  // Optional: pause/rest tiles per level (small reward)
  const PAUSES_BY_LEVEL = {
    0: [18],
    1: [12, 52],
    2: [15, 60],
  }

  // Keep track of taken custom positions to avoid overlaps
  const taken = new Set([...FIXED_SQUARES])

  // 4) Place predators safely (no overlap with fixed or each other)
  const predators = PREDATORS_BY_LEVEL[level] || PREDATORS_BY_LEVEL[0]
  for (const p of predators) {
    const pos = findFreeIndex(p.pos, taken)
    taken.add(pos)
    squares[pos] = {
      id: pos,
      type: 'predator',
      predator: { mode: p.mode, steps: p.steps ?? 0 },
      label: `${pos + 1}: ${p.mode === 'start' ? 'Big Snake!' : `Snake -${p.steps}`}`,
      visited: false,
    }
  }

  // 5) Place pauses safely (optional)
  const pauses = PAUSES_BY_LEVEL[level] || []
  for (const raw of pauses) {
    const pos = findFreeIndex(raw, taken)
    taken.add(pos)
    squares[pos] = {
      id: pos,
      type: 'pause',
      label: `${pos + 1}: Pause`,
      visited: false,
    }
  }

  return squares
}
