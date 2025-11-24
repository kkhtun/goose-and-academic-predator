import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SoundCtx = createContext({ play: () => {}, muted: false, volume: 0.8, setMuted: () => {}, setVolume: () => {} });

const SOUND_MAP = {
  click:      '/sfx/click.mp3',
  nav:        '/sfx/nav.mp3',
  roll:       '/sfx/roll.mp3',
  success:    '/sfx/success.mp3',
  error:      '/sfx/error.mp3',
  build:      '/sfx/build.mp3',
  pause:      '/sfx/pause.mp3',
  predator:   '/sfx/predator.mp3',
  event:      '/sfx/event.mp3',
  challenge:  '/sfx/challenge.mp3',
  puzzle:     '/sfx/puzzle.mp3',
  graduate:   '/sfx/graduate.mp3',
};

function playOne(url, vol = 1) {
  try {
    const a = new Audio(url);
    a.volume = vol;
    a.play().catch(() => {});
  } catch {}
}

const LS_KEY = 'gap_sound_prefs';

export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8); // 0..1

  // load persisted
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const { muted: m, volume: v } = JSON.parse(raw);
      if (typeof m === 'boolean') setMuted(m);
      if (typeof v === 'number') setVolume(Math.max(0, Math.min(1, v)));
    } catch {}
  }, []);

  // persist on change (debounced-ish)
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(LS_KEY, JSON.stringify({ muted, volume })); } catch {}
    }, 50);
    return () => clearTimeout(t);
  }, [muted, volume]);

  const api = useMemo(() => ({
    muted,
    volume,
    setMuted,
    setVolume: (v) => setVolume(Math.max(0, Math.min(1, v))),
    play: (name, volOverride = null) => {
      const url = SOUND_MAP[name];
      if (!url || muted) return;
      const vol = volOverride == null ? volume : Math.max(0, Math.min(1, volOverride));
      playOne(url, vol);
    }
  }), [muted, volume]);

  return <SoundCtx.Provider value={api}>{children}</SoundCtx.Provider>;
}

export function useSound() {
  return useContext(SoundCtx);
}
