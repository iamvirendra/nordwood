import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMotion } from '../motion/MotionContext';
import './WoodcutIntro.css';

// A brief machining diagram, independent of image or network loading.
const teeth = Array.from({ length: 28 }, (_, index) => index * (360 / 28));
const shavings = Array.from({ length: 12 }, (_, index) => ({
  x: `${-28 - (index % 4) * 13}px`,
  y: `${-12 - (index % 5) * 11}px`,
  delay: `${0.48 + (index % 6) * 0.065}s`,
}));

export default function WoodcutIntro({ onComplete, restoreFocusRef }) {
  const { enabled } = useMotion();
  const dialogRef = useRef(null);
  const [leaving, setLeaving] = useState(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const restoreFocusTarget = restoreFocusRef?.current;
    const previousOverflow = document.documentElement.style.overflow;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finishForMotion = () => { if (motion.matches) onComplete(); };
    if (!enabled || motion.matches || typeof dialog.showModal !== 'function') {
      onComplete();
      return;
    }
    dialog.showModal();
    dialog.focus({ preventScroll: true });
    document.documentElement.style.overflow = 'hidden';
    motion.addEventListener('change', finishForMotion);
    const revealTimer = window.setTimeout(() => setLeaving(true), 2600);
    // A fail-safe: disabling CSS animation never blocks the page.
    const finishTimer = window.setTimeout(onComplete, 3150);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(finishTimer);
      motion.removeEventListener('change', finishForMotion);
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
      const focusTarget = restoreFocusTarget || previousFocus;
      if (focusTarget instanceof HTMLElement && focusTarget.isConnected) focusTarget.focus({ preventScroll: true });
    };
  }, [enabled, onComplete, restoreFocusRef]);

  return createPortal(
    <dialog ref={dialogRef} className={`woodcut-intro${leaving ? ' woodcut-intro--leaving' : ''}`} aria-labelledby="woodcut-title" aria-describedby="woodcut-description" tabIndex={-1} onCancel={event => { event.preventDefault(); onComplete(); }}>
      <div className="woodcut-top"><span className="woodcut-brand">NordWood<span>ARCHITECTURAL WOODWORKS</span></span><span className="woodcut-edition">The beauty of becoming</span></div>
      <div className="woodcut-content">
        <p className="woodcut-eyebrow">Raw nature. Refined by craft.</p>
        <h2 id="woodcut-title">Good things <em>take shape.</em></h2>
        <div className="woodcut-machine" aria-hidden="true">
          <svg viewBox="0 0 800 380" fill="none">
            <defs>
              <linearGradient id="nw-timber" x1="100" y1="242" x2="700" y2="327" gradientUnits="userSpaceOnUse"><stop stopColor="#8b5737" /><stop offset=".35" stopColor="#ce9a63" /><stop offset=".7" stopColor="#ae7648" /><stop offset="1" stopColor="#754526" /></linearGradient>
              <linearGradient id="nw-steel" x1="-50" y1="-50" x2="50" y2="50" gradientUnits="userSpaceOnUse"><stop stopColor="#f4f1e8" /><stop offset=".45" stopColor="#abb5af" /><stop offset=".55" stopColor="#e7e8dc" /><stop offset="1" stopColor="#6c8077" /></linearGradient>
              <pattern id="nw-grain" width="170" height="28" patternUnits="userSpaceOnUse"><path d="M-10 9C35-3 95 24 180 6M-10 20C55 6 85 34 180 16M20 13C48 5 70 23 99 16" stroke="#442b1b" strokeOpacity=".3" strokeWidth="1.3" /></pattern>
            </defs>
            <path d="M65 348H735M105 342v12m590-12v12M100 100H700" stroke="var(--brass)" strokeOpacity=".25" />
            <path d="M105 340v-15M695 340v-15" stroke="var(--brass)" strokeOpacity=".25" strokeDasharray="3 4" />
            <path d="M80 210V128h640v82M80 147h640" stroke="#929392" strokeWidth="2" />
            <path d="M104 136h592" stroke="var(--brass)" strokeOpacity=".35" strokeDasharray="2 7" />
            <g className="woodcut-offcut"><rect x="105" y="288" width="590" height="29" rx="1" fill="url(#nw-timber)" /><rect x="105" y="288" width="590" height="29" fill="url(#nw-grain)" /><path d="M105 317h590" stroke="#4c3322" strokeWidth="3" /></g>
            <rect x="105" y="244" width="590" height="44" rx="1" fill="url(#nw-timber)" /><rect x="105" y="244" width="590" height="44" fill="url(#nw-grain)" />
            <path d="M105 244h590" stroke="#e7bb81" strokeOpacity=".7" />
            <path className="woodcut-kerf" d="M105 287H695" stroke="var(--forest-deep)" strokeWidth="3" />
            <g className="woodcut-carriage">
              <rect x="71" y="114" width="68" height="47" rx="5" fill="var(--forest)" stroke="#929392" />
              <path d="M94 161v38h23v-38" fill="#737574" stroke="#b5b5b0" />
              <path d="M88 126h34m-34 7h34m-34 7h18" stroke="var(--brass)" strokeOpacity=".7" />
              <g transform="translate(105 238)"><g className="woodcut-blade">
                <circle r="48" fill="url(#nw-steel)" />
                {teeth.map(angle => <path key={angle} d="M-4-46 0-54 6-49 4-45" transform={`rotate(${angle})`} fill="#d8ded3" />)}
                <circle r="36" stroke="#64786c" strokeOpacity=".5" /><circle r="15" fill="#52675a" stroke="#e7e8dc" /><circle r="5" fill="var(--brass)" />
                <path d="M0-36v12m31 30-10-6m-52 6 10-6" stroke="#566d5e" strokeWidth="3" />
              </g><circle r="6" fill="var(--brass)" /></g>
              <path d="M48 233a57 57 0 0 1 114 0" fill="var(--forest)" stroke="#999995" strokeWidth="1.5" />
              <path d="M65 219a44 44 0 0 1 80 0" stroke="var(--brass)" strokeOpacity=".6" />
              <g transform="translate(111 284)">{shavings.map((shaving, index) => <rect key={index} className="woodcut-shaving" x="0" y="0" width={index % 2 ? 4 : 2} height="2" rx=".6" fill="#dbb079" style={{ '--shaving-x': shaving.x, '--shaving-y': shaving.y, '--shaving-delay': shaving.delay }} />)}</g>
            </g>
            <text x="105" y="373" fill="var(--muted-dark)" fontSize="10" letterSpacing="2">SOLID TIMBER</text><text x="695" y="373" textAnchor="end" fill="var(--muted-dark)" fontSize="10" letterSpacing="2">PRECISION IN EVERY PASS</text>
          </svg>
        </div>
        <p id="woodcut-description" className="woodcut-description">From natural timber to a warmer home.</p>
      </div>
      <div className="woodcut-bottom"><span>Considered in every detail.</span><div className="woodcut-progress" aria-hidden="true"><span /></div><button type="button" onClick={onComplete}>Skip intro <span aria-hidden="true">↗</span></button></div>
    </dialog>, document.body,
  );
}
