export default function HomePage({ onStartGame, onInstructions }) {
  return (
    <section className="landing-hero" aria-labelledby="hero-title">
      {/* playful sky bits */}
      <div className="sky">
        <div className="cloud c1" />
        <div className="cloud c2" />
        <div className="cloud c3" />
      </div>

      <div className="hero-inner">
        {/* Left: copy + buttons */}
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title">
            Goose & Academic Predator
          </h1>
          <p className="hero-tagline">
            Welcome to the <strong>Publishing House</strong>! Train your
            scholarly instincts through playful challenges, ethical choices,
            and a dash of goose energy.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onStartGame}>
              Start Game
            </button>
            <button className="btn btn-secondary" onClick={onInstructions}>
              Gaming Instructions
            </button>
          </div>
        </div>

        {/* Right: three-storey building + goose at door */}
        <div className="hero-scene">
          <div className="house" role="img" aria-label="Publishing House">
            <div className="house-sign">Publishing House</div>

            {/* Floor 3 */}
            <div className="floor f3">
              <div className="window w" />
              <div className="window w" />
              <div className="window w" />
            </div>

            {/* Floor 2 */}
            <div className="floor f2">
              <div className="window w" />
              <div className="window w" />
              <div className="window w" />
            </div>

            {/* Floor 1 (ground, with door + goose) */}
            <div className="floor f1">
              <div className="window w left" />
              <div className="door-wrap">
                <div className="door-arch">
                  <div className="door">
                    <div className="door-window" />
                    {/* goose standing at the entrance */}
                    <Goose className="goose" />
                  </div>
                </div>
              </div>
              <div className="window w right" />
            </div>

            {/* base / steps */}
            <div className="steps">
              <div className="step s1" />
              <div className="step s2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Tiny SVG goose with a waving wing */
function Goose({ className }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      aria-label="goose waving"
    >
      {/* feet */}
      <rect x="30" y="62" width="8" height="6" rx="2" fill="#f59e0b" />
      <rect x="44" y="62" width="8" height="6" rx="2" fill="#f59e0b" />
      {/* body */}
      <ellipse cx="40" cy="50" rx="22" ry="16" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" />
      {/* wing (animated) */}
      <g className="wing">
        <ellipse cx="30" cy="50" rx="10" ry="7" fill="#e5e7eb" />
        <ellipse cx="30" cy="50" rx="10" ry="7" fill="rgba(0,0,0,0.05)" />
      </g>
      {/* neck */}
      <rect x="37" y="32" width="6" height="16" rx="3" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" />
      {/* head */}
      <circle cx="40" cy="28" r="8" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" />
      {/* eye */}
      <circle cx="43.5" cy="26.5" r="1.8" fill="#111827" />
      {/* beak */}
      <polygon points="48,28 60,24 48,21" fill="#f59e0b" />
    </svg>
  )
}
