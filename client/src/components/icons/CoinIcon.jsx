export default function CoinIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="cg" x1="0" x2="1">
          <stop offset="0" stopColor="#ffe16a"/>
          <stop offset="1" stopColor="#f59e0b"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="20" fill="url(#cg)" stroke="#c68a00" strokeWidth="2"/>
      <circle cx="32" cy="32" r="14" fill="none" stroke="#fff6bf" strokeWidth="2"/>
      <rect x="29" y="22" width="6" height="20" rx="2" fill="#fff3a3"/>
    </svg>
  )
}
