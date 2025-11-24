export default function StarIcon({ size = 18, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={color}
        d="M12 2.5l2.9 6.1 6.7.9-4.9 4.7 1.2 6.7L12 17.9 6.1 21l1.2-6.7-4.9-4.7 6.7-.9L12 2.5z"
      />
      <path
        fill="rgba(0,0,0,.15)"
        d="M12 2.5l2.9 6.1 6.7.9-4.9 4.7 1.2 6.7L12 17.9z"
      />
    </svg>
  )
}
