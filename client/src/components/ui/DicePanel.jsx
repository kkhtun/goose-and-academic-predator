import { useMemo } from 'react'

function Pip({ cx, cy }) {
  return <circle cx={cx} cy={cy} r="2.3" fill="#0f172a" />
}

function DiceFace({ value = 1, size = 28 }) {
  const pips = useMemo(() => {
    const pts = {
      1: [[16,16]],
      2: [[8,8],[24,24]],
      3: [[8,8],[16,16],[24,24]],
      4: [[8,8],[8,24],[24,8],[24,24]],
      5: [[8,8],[8,24],[16,16],[24,8],[24,24]],
      6: [[8,8],[8,16],[8,24],[24,8],[24,16],[24,24]]
    }
    return (pts[value] || pts[1]).map(([x,y],i)=><Pip key={i} cx={x} cy={y}/>)
  },[value])

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2"/>
      {pips}
    </svg>
  )
}

export default function DicePanel({ diceResult, isRolling, skipNextTurn, onRoll }) {
  return (
    <div className="dice-panel">
      <button
        className="btn btn-primary"
        onClick={onRoll}
        disabled={isRolling}
        title={skipNextTurn ? 'Skip this turn' : 'Roll two dice'}
      >
        {skipNextTurn ? 'Skip Turn' : 'Roll 2 Dice'}
      </button>

      <div className="dice-readout" aria-live="polite">
        {diceResult ? (
          <>
            <DiceFace value={diceResult.d1} />
            <span className="plus">+</span>
            <DiceFace value={diceResult.d2} />
            <span className="eq">=</span>
            <span className="total">{diceResult.total}</span>
          </>
        ) : (
          <span className="hint">Roll to begin</span>
        )}
      </div>
    </div>
  )
}
