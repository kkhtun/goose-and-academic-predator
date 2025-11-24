import { useSound } from '../../context/SoundContext';

export default function SoundControls({ compact = false, style }) {
  const { muted, setMuted, volume, setVolume, play } = useSound();

  return (
    <div style={{ ...wrap, ...(style || {}) }}>
      <button
        className="btn btn-secondary"
        style={btn}
        onClick={() => {
          setMuted(!muted);
          if (!muted) return; // when unmuting we'll test below
        }}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {!compact && (
        <>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={range}
            aria-label="Sound volume"
          />
          <button
            className="btn btn-secondary"
            style={btn}
            onClick={() => play('click')}
            title="Test sound"
          >
            ▶️
          </button>
        </>
      )}
    </div>
  );
}

const wrap = {
  display: 'flex', alignItems: 'center', gap: 8,
  background: 'linear-gradient(145deg, #f5f5f5, #ffffff)',
  border: '1px solid #e5e7eb', borderRadius: 12, padding: '6px 8px'
};
const btn = { padding: '6px 10px', borderRadius: 8, fontSize: 16, lineHeight: 1 };
const range = { width: 120, accentColor: '#58cc02' };
