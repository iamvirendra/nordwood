import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useMotion } from './MotionContext';

// Observe additions as well as routes: collection filters can insert new cards.
// Only offscreen content is hidden, and focusing any element reveals it immediately.
export default function MotionEffects() {
  const { enabled } = useMotion();
  const { pathname } = useLocation();
  const progressRef = useRef(null);
  const enabledRef = useRef(enabled);
  const entrancesRef = useRef([]);

  useEffect(() => {
    enabledRef.current = enabled;
    if (!enabled) entrancesRef.current.forEach(animation => animation.cancel());
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !('IntersectionObserver' in window)) return;
    const known = new WeakSet();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        target.classList.remove('motion-waiting');
        target.classList.add('motion-revealed');
        observer.unobserve(target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    const scan = () => {
      document.querySelectorAll('[data-motion], [data-reveal]').forEach(element => {
        if (known.has(element)) return;
        known.add(element);
        if (element.getBoundingClientRect().top >= window.innerHeight - 24) {
          element.classList.add('motion-waiting');
          observer.observe(element);
        } else {
          element.classList.add('motion-revealed');
        }
      });
    };
    scan();
    const mutations = new MutationObserver(records => {
      records.forEach(record => record.removedNodes.forEach(node => {
        if (!(node instanceof Element) || node.isConnected) return;
        observer.unobserve(node);
        node.querySelectorAll('[data-motion], [data-reveal]').forEach(element => observer.unobserve(element));
      }));
      scan();
    });
    mutations.observe(document.querySelector('.app'), { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
      document.querySelectorAll('.motion-waiting').forEach(element => element.classList.remove('motion-waiting'));
    };
  }, [enabled, pathname]);

  useEffect(() => {
    if (!enabledRef.current || pathname === '/' || pathname === '/about') return;
    const elements = document.querySelectorAll('[data-page-enter]');
    const animations = [...elements].map((element, index) => element.animate([
      { opacity: 0, transform: 'translateY(22px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 750, delay: index * 80, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' }));
    entrancesRef.current = animations;
    return () => animations.forEach(animation => animation.cancel());
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const paint = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty('transform', `scaleX(${total > 0 ? Math.min(1, window.scrollY / total) : 0})`);
      frame = 0;
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [enabled, pathname]);

  return <div ref={progressRef} className="reading-progress" aria-hidden="true" />;
}
