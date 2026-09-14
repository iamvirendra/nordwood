import { useEffect } from 'react';
import { useMotion } from './MotionContext';

export default function useHeroParallax(pageRef) {
  const { enabled } = useMotion();
  useEffect(() => {
    if (!enabled) return;
    const picture = pageRef.current?.querySelector('.hero-picture');
    const hero = pageRef.current?.querySelector('.home-hero');
    if (!picture || !hero) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const bounds = hero.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      picture.style.transform = `translateY(${Math.max(-24, Math.min(24, -bounds.top * .045))}px)`;
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(paint); };
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      picture.style.removeProperty('transform');
    };
  }, [enabled, pageRef]);
}
