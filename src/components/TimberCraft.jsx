import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useMotion } from '../motion/MotionContext';
import './TimberCraft.css';

const steps = [
  { title: 'Begin with character.', label: 'Timber selection', description: 'Natural grain. Individual character. The material sets the direction.' },
  { title: 'Give it definition.', label: 'Precision cutting', description: 'Considered dimensions turn solid timber into the shape of an opening.' },
  { title: 'Bring it all together.', label: 'The finished piece', description: 'Each element finds its place. Warmth and proportion become one.' },
];
const DURATION = 6000;

function CraftDrawing({ prefix }) {
  const grain = `${prefix}-grain`;
  const timber = `${prefix}-timber`;
  const frame = `${prefix}-frame`;
  return (
    <svg className="timber-craft__drawing" viewBox="0 0 1080 510" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={timber} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#916342" /><stop offset=".23" stopColor="#BB8959" /><stop offset=".66" stopColor="#A57248" /><stop offset="1" stopColor="#CE9E6D" />
        </linearGradient>
        <linearGradient id={frame} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#D1A06B" /><stop offset=".55" stopColor="#896041" /><stop offset="1" stopColor="#BA8757" />
        </linearGradient>
        <pattern id={grain} width="62" height="245" patternUnits="userSpaceOnUse">
          <rect width="62" height="245" fill={`url(#${timber})`} />
          <path d="M8-20C22 22 1 55 13 105S6 198 12 265M20-20C8 31 30 65 22 125S35 203 24 265M38-20C51 41 27 75 38 132S29 203 42 265M54-20C40 26 63 72 51 130S61 218 52 265" stroke="#573822" strokeWidth=".75" opacity=".32" />
          <path d="M16-20C29 31 8 61 20 108S13 195 19 265M44-20C58 35 35 69 47 122S38 201 49 265" stroke="#E9BB83" strokeWidth=".8" opacity=".38" />
          <path d="M34 124C20 151 24 174 34 194C45 174 47 152 34 124ZM34 141C28 157 29 170 34 180C39 166 40 155 34 141Z" stroke="#61402A" strokeWidth=".65" opacity=".35" />
        </pattern>
      </defs>

      <g className="timber-craft__guides" stroke="currentColor" strokeWidth=".6">
        <path d="M34 446H1046M34 451V441M1046 451V441" />
        <path d="M331 58V446M717 58V446" strokeDasharray="3 8" opacity=".6" />
        <path d="M53 92H1008M53 87V97M1008 87V97" opacity=".28" />
      </g>

      <g className="timber-craft__raw">
        <ellipse cx="175" cy="447" rx="133" ry="8" fill="#000" opacity=".22" />
        {[0, 1, 2, 3].map(index => (
          <g className={`timber-craft__stock timber-craft__stock--${index}`} key={index}>
            <path d={`M${67 + index * 48} ${179 - index * 10}l14-9v${263 + index * 10}l-14 8z`} fill="#69452E" />
            <rect x={81 + index * 48} y={170 - index * 10} width="41" height={271 + index * 10} fill={`url(#${grain})`} />
            <path d={`M${84 + index * 48} ${170 - index * 10}v${268 + index * 10}`} stroke="#EBC591" opacity=".42" />
            <path d={`M${67 + index * 48} ${179 - index * 10}l14-9h41l-14 9z`} fill="#D5AB78" />
          </g>
        ))}
        <path d="M66 457H267M66 453v8M267 453v8" stroke="currentColor" strokeWidth=".6" opacity=".6" />
      </g>

      <g className="timber-craft__machine">
        <ellipse cx="515" cy="447" rx="147" ry="8" fill="#000" opacity=".22" />
        <path d="M376 421v25m277-25v25M391 421v25m247-25v25" stroke="#77766E" strokeWidth="5" />
        <rect x="371" y="398" width="287" height="23" rx="2" fill="#3D3F3E" stroke="#7D7C70" strokeWidth=".8" />
        <path d="M386 228v169m256-169v169" stroke="#6F736F" strokeWidth="6" />
        <rect x="382" y="220" width="265" height="16" rx="2" fill="#4B4E4B" stroke="#959384" strokeWidth=".8" />
        <rect x="397" y="255" width="233" height="131" rx="3" fill="#EFEADC" fillOpacity=".025" stroke="#A8ADA0" strokeOpacity=".32" />
        <path d="M407 269h40m-40 7h20M620 368v9h-12" stroke="#F0EBDD" strokeOpacity=".32" strokeWidth=".75" />
        <rect x="400" y="366" width="230" height="19" fill={`url(#${grain})`} />
        <path d="M400 366h230" stroke="#E1BA82" strokeWidth="1.4" />
        <path className="timber-craft__cut-line" d="M424 365H603" stroke="#F3DBAE" strokeWidth="1.2" strokeDasharray="180" />
        <g className="timber-craft__carriage">
          <rect x="415" y="237" width="39" height="54" rx="3" fill="#555B57" stroke="#AAAEA3" strokeWidth=".8" />
          <path d="M426 247h17m-17 5h17m-17 5h17" stroke="#303733" strokeWidth="2" />
          <path d="M427 291h15v49h-15z" fill="#888B7E" />
          <path d="M429 340h11l-4 23h-3z" fill="#DDD4AF" />
          <circle cx="447" cy="244" r="2" fill="var(--brass)" />
        </g>
        <path d="M401 390h228" stroke="#AFAB94" strokeWidth=".7" opacity=".5" />
      </g>

      <g className="timber-craft__door">
        <ellipse cx="876" cy="447" rx="137" ry="8" fill="#000" opacity=".25" />
        <path className="timber-craft__blueprint" d="M767 112h224v331H767zM759 103h241v344H759zM755 109h-15m0 0v335m0-335h-6m6 335h15m-15 0h-6" stroke="currentColor" strokeWidth=".7" strokeDasharray="4 5" />
        <g className="timber-craft__jamb">
          <path d="M777 105h205v340h-12V117H789v328h-12z" fill={`url(#${frame})`} />
          <path d="M789 117h181v326H789z" fill="#1E1712" />
          <path d="M780 108h199v335" stroke="#E6BA83" strokeWidth=".7" opacity=".6" />
        </g>
        {[0, 1, 2].map(index => (
          <g className={`timber-craft__door-board timber-craft__door-board--${index}`} key={index}>
            <rect x={793 + index * 57} y="122" width="55" height="316" fill={`url(#${grain})`} />
            <path d={`M${795 + index * 57} 124v311`} stroke="#E7B87C" strokeWidth=".65" opacity=".5" />
          </g>
        ))}
        <g className="timber-craft__handle">
          <path d="M946 252h9m-9 104h9" stroke="#815F23" strokeWidth="3" />
          <rect x="951" y="242" width="5" height="125" rx="2.5" fill="var(--brass)" />
          <path d="M952 246v117" stroke="#FAE6A8" strokeWidth=".8" />
        </g>
      </g>

      <g className="timber-craft__flow" stroke="currentColor" strokeWidth=".8">
        <path d="M285 333h52m-7-5 7 5-7 5M684 333h52m-7-5 7 5-7 5" />
      </g>
      <g className="timber-craft__diagram-labels" fill="currentColor" fontSize="9" letterSpacing="2.2">
        <text x="67" y="487">01 / NATURAL CHARACTER</text>
        <text x="384" y="487">02 / CONSIDERED PRECISION</text>
        <text x="780" y="487">03 / A FINISHED OPENING</text>
      </g>
    </svg>
  );
}

export default function TimberCraft() {
  const { enabled } = useMotion();
  const prefix = useId().replace(/:/g, '');
  const sectionRef = useRef(null);
  const startedRef = useRef(false);
  const elapsedRef = useRef(0);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(2);
  const [run, setRun] = useState({ key: 0, offset: 0 });

  const play = useCallback((from = 0) => {
    if (!enabled) return;
    startedRef.current = true;
    elapsedRef.current = from * 2000;
    setStep(from);
    setRun(previous => ({ key: previous.key + 1, offset: from * 2000 }));
    setPlaying(true);
  }, [enabled]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.16 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    if (visible && pageVisible && enabled && !startedRef.current) play();
  }, [visible, pageVisible, enabled, play]);

  useEffect(() => {
    if (!enabled) {
      const frame = requestAnimationFrame(() => {
        setPlaying(false);
        setStep(2);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [enabled]);

  useEffect(() => {
    if (!playing || !visible || !pageVisible || !enabled) return;
    let frame;
    let last = performance.now();
    const tick = now => {
      elapsedRef.current = Math.min(DURATION, elapsedRef.current + Math.max(0, now - last));
      last = now;
      setStep(Math.min(2, Math.floor(elapsedRef.current / 2000)));
      if (elapsedRef.current >= DURATION) {
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, visible, pageVisible, enabled, run.key]);

  const selectStep = index => {
    if (enabled) play(index);
    else setStep(index);
  };
  const paused = !visible || !pageVisible;

  return (
    <section ref={sectionRef} id="approach" className={`timber-craft ${visible ? 'is-visible' : ''} ${playing && enabled ? 'timber-craft--playing' : ''} ${paused ? 'timber-craft--paused' : ''}`} aria-labelledby={`${prefix}-title`}>
      <div className="timber-craft__heading" data-motion="reveal" data-reveal>
        <div><p className="eyebrow">From timber to timeless</p><h2 id={`${prefix}-title`}>Good wood.<br /><em>Thoughtfully transformed.</em></h2></div>
        <div className="timber-craft__intro"><p>Every opening begins with the material. Follow the journey from natural timber to a piece that feels at home.</p><span>A study in material, precision &amp; purpose</span></div>
      </div>

      <div className="timber-craft__canvas" style={{ '--craft-offset': `-${run.offset}ms` }}>
        <div className="timber-craft__canvas-top"><span><i /> The making of an opening</span><span>NW / Craft study 01</span></div>
        <div key={run.key} className="timber-craft__art"><CraftDrawing prefix={prefix} /></div>
        <div className="timber-craft__canvas-bottom"><span>An illustrated study of the craft</span><button type="button" className="timber-craft__replay" onClick={() => play(0)} disabled={!enabled} aria-label="Replay the six-second timber craft process"><svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 7a6.5 6.5 0 1 1-1 6M4 3v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>{enabled ? 'Replay the process' : 'Motion is paused'}</button></div>
      </div>

      <div className="timber-craft__steps" aria-label="Explore the making process">
        {steps.map((item, index) => <button type="button" className={`timber-craft__step ${step === index ? 'is-active' : ''}`} key={item.label} onClick={() => selectStep(index)} aria-pressed={step === index} aria-controls={`${prefix}-description`}><span className="timber-craft__step-number">0{index + 1}</span><span><span className="timber-craft__step-label">{item.label}</span><strong>{item.title}</strong></span><svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1" /></svg></button>)}
      </div>
      <p className="timber-craft__description" id={`${prefix}-description`}>{steps[step].description}</p>
    </section>
  );
}
