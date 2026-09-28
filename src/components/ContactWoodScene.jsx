import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../motion/MotionContext';
import { brandLogo } from '../data/brand';
import './ContactWoodScene.css';

function resetView(node) {
  node?.style.setProperty('--view-x', '0deg');
  node?.style.setProperty('--view-y', '0deg');
  node?.style.setProperty('--light-x', '50%');
}

export default function ContactWoodScene({ image, variant, onEnquire }) {
  const { enabled } = useMotion();
  const [turned, setTurned] = useState(false);
  const sceneRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const node = sceneRef.current;
    if (!enabled) resetView(node);
    return () => window.cancelAnimationFrame(frameRef.current);
  }, [enabled]);

  function moveView(event) {
    if (!enabled || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      const node = sceneRef.current;
      node?.style.setProperty('--view-x', `${(-y * 4).toFixed(2)}deg`);
      node?.style.setProperty('--view-y', `${(x * 8).toFixed(2)}deg`);
      node?.style.setProperty('--light-x', `${50 + x * 22}%`);
    });
  }

  function restoreView() {
    window.cancelAnimationFrame(frameRef.current);
    resetView(sceneRef.current);
  }

  return (
    <div ref={sceneRef} id="contact-work-preview" className={`contact-3d contact-3d--${variant}${turned ? ' is-turned' : ''}`} data-scene-motion={enabled ? 'full' : 'still'} onPointerMove={moveView} onPointerLeave={restoreView} onPointerCancel={restoreView}>
      <div className="contact-3d__ambient" aria-hidden="true" />
      <span className="contact-3d__edition">NordWood / A different perspective</span>
      <div className="contact-3d__world">
        <div className="contact-3d__arch" aria-hidden="true" />
        <div className="contact-3d__floor" aria-hidden="true" />
        <div className="contact-3d__shadow" aria-hidden="true" />
        <div className="contact-3d__arrival">
          <div className="contact-3d__piece">
            <div className="contact-3d__face"><img src={image.src} alt={image.alt} width={image.width} height={image.height} fetchPriority="high" /><span className="contact-3d__sheen" aria-hidden="true" /></div>
            <div className="contact-3d__edge contact-3d__edge--right" aria-hidden="true" />
            <div className="contact-3d__edge contact-3d__edge--left" aria-hidden="true" />
            <div className="contact-3d__edge contact-3d__edge--top" aria-hidden="true" />
          </div>
        </div>
        <span className="contact-3d__seal" aria-hidden="true"><img src={brandLogo.src} width={brandLogo.width} height={brandLogo.height} alt="" decoding="async" /></span>
      </div>
      <div className="contact-3d__controls">
        <button type="button" className="contact-3d__turn" aria-pressed={turned} onClick={() => { restoreView(); setTurned(value => !value); }} aria-label="Turn the woodwork view">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 8c-1.8-1-4-1.5-6-1.5C6.5 6.5 2 9 2 12s4.5 5.5 10 5.5S22 15 22 12c0-.8-.3-1.5-.8-2.1M18 4v4h-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>{turned ? 'Return to first angle' : 'Turn the view'}</span>
        </button>
        <button type="button" className="contact-3d__enquire" onClick={onEnquire} aria-label={`Enquire about ${variant}`}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      </div>
    </div>
  );
}
