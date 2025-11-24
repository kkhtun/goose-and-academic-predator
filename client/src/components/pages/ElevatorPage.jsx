import { useEffect } from 'react'

/**
 * ElevatorPage
 * Props:
 *  - from: 0 | 1 (current level)
 *  - to:   1 | 2 (next level)
 *  - emoji: string (player emoji, e.g. 🪿)
 *  - onComplete: () => void  (called when animation finishes)
 */
export default function ElevatorPage({ from, to, emoji = '🪿', onComplete }) {
  // total sequence timing (must match CSS vars below)
  useEffect(() => {
    const doorMs = 700
    const moveMs = 1600
    const reopenMs = 900
    const total = doorMs + moveMs + reopenMs + 200 // small buffer
    const t = setTimeout(() => onComplete?.(), total)
    return () => clearTimeout(t)
  }, [onComplete])

  const route =
    from === 0 && to === 1 ? 'route-0-1' :
    from === 1 && to === 2 ? 'route-1-2' : 'route-0-1'

  return (
    <div className="elevator-stage">
      <div className="elevator-caption">Going up to Level {to}…</div>

      <div className={`elevator-building ${route}`} aria-label={`Elevator from level ${from} to ${to}`}>
        {/* rails/shaft */}
        <div className="shaft">
          <div className="rail left" />
          <div className="rail mid" />
          <div className="rail right" />
          <div className="floor-line floor-0" />
          <div className="floor-line floor-1" />
          <div className="floor-line floor-2" />
        </div>

        {/* floor labels */}
        <div className="floor-badges">
          <div className="badge b0">L0</div>
          <div className="badge b1">L1</div>
          <div className="badge b2">L2</div>
        </div>

        {/* elevator car + doors */}
        <div className="elevator-car">
          <div className="cable" />
          <div className="car-frame">
            <div className="car-inner">
              <div className="passenger" role="img" aria-label="goose">{emoji}</div>

              {/* DOORS (start open → close → move → open) */}
              <div className="doors">
                <div className="door left" />
                <div className="door right" />
              </div>
            </div>
          </div>

          {/* indicator lights */}
          <div className="indicator">
            <span className="dot d0" />
            <span className="dot d1" />
            <span className="dot d2" />
            <span className="arrow">▲</span>
          </div>
        </div>
      </div>

      <div className="elevator-hint" aria-live="polite">Doors closing…</div>
    </div>
  )
}
