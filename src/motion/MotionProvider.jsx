import { useEffect, useLayoutEffect, useState } from 'react';
import { MotionContext } from './MotionContext';
import './Motion.css';

export default function MotionProvider({ children }) {
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem('nordwood-motion') === 'reduced'; } catch { return false; }
  });
  const enabled = !paused && !systemReduced;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.motionMode = enabled ? 'full' : 'reduced';
    try { localStorage.setItem('nordwood-motion', paused ? 'reduced' : 'full'); } catch { /* Motion still works without storage. */ }
  }, [enabled, paused]);

  return <MotionContext.Provider value={{ enabled, systemReduced, toggleMotion: () => setPaused(value => !value) }}>{children}</MotionContext.Provider>;
}
