import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../motion/MotionContext';
import './Heritage.css';

const milestones = [
  { value: 50, label: 'Premium Designs', icon: 'design' },
  { value: 2000, label: 'Satisfied Customers', icon: 'home' },
  { value: 10000, label: 'Products Delivered', icon: 'door' },
  { value: 500, label: 'Trees Planted', icon: 'tree' },
];
const numberFormat = new Intl.NumberFormat('en-IN');
const ringPath = 'M0-174C83-181 166-124 177-42C192 42 141 133 66 159C-18 192-109 165-153 99C-204 23-181-69-124-125C-92-161-46-178 0-174Z';

function MilestoneIcon({ name }) {
  const paths = {
    design: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    home: 'm3 11 9-8 9 8M5 9v11h14V9M9 20v-7h6v7',
    door: 'M5 21V3h14v18M3 21h18M8 21V6h8v15M13 13h.01',
    tree: 'M12 21v-8m0 4-4-4m4 1 3-3M8 17a5 5 0 0 1-3-9 7 7 0 0 1 14 0 5 5 0 0 1-3 9M8 21h8',
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={paths[name]} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Heritage() {
  const { enabled } = useMotion();
  const statsRef = useRef(null);
  const numberRefs = useRef([]);
  const playedRef = useRef(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    let frame;
    const showValues = progress => milestones.forEach((milestone, index) => {
      if (numberRefs.current[index]) numberRefs.current[index].textContent = numberFormat.format(Math.round(milestone.value * progress));
    });

    // Only the decorative digits change; accessible totals always stay complete.
    showValues(1);
    if (!enabled || !('IntersectionObserver' in window) || playedRef.current) return;

    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      playedRef.current = true;
      setHasEntered(true);
      showValues(0);
      let started;
      const animate = time => {
        started ??= time;
        const progress = Math.min((time - started) / 1800, 1);
        showValues(1 - Math.pow(1 - progress, 3));
        if (progress < 1) frame = window.requestAnimationFrame(animate);
      };
      frame = window.requestAnimationFrame(animate);
    }, { threshold: 0.2 });

    observer.observe(statsRef.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      showValues(1);
    };
  }, [enabled]);

  return (
    <section className={`heritage${hasEntered ? ' heritage--revealed' : ''}`} id="heritage" aria-labelledby="heritage-title">
      <div className="heritage__inner">
        <div className="heritage__topline"><p className="eyebrow">03 / A legacy in wood</p><span>Rooted in time. Still growing.</span></div>
        <div className="heritage__story">
          <div className="heritage__copy" data-reveal>
            <h2 id="heritage-title">Making homes<br /><em>beautiful.</em><span className="heritage__sr-only"> Since 1960s.</span></h2>
            <p>From the first welcome to the everyday moments.{' '}<br />A little more warmth. A place to call your own.</p>
          </div>
          <div className="heritage__era" aria-hidden="true">
            <svg className="heritage__rings" viewBox="0 0 600 420" fill="none">
              <g transform="translate(300 210)">{Array.from({ length: 12 }, (_, index) => <path key={index} d={ringPath} pathLength="1" transform={`rotate(${index * 2}) scale(${0.2 + index * 0.09})`} style={{ '--ring-delay': `${index * 40}ms` }} />)}</g>
            </svg>
            <span className="heritage__since">Since</span>
            <span className="heritage__decade">1960<span>s</span></span>
            <span className="heritage__era-note"><i /> A story still being written</span>
          </div>
        </div>
        <dl ref={statsRef} className="heritage__milestones">
          {milestones.map((milestone, index) => <div className="heritage__milestone" key={milestone.icon}>
            <dt><MilestoneIcon name={milestone.icon} /><span>{milestone.label}</span></dt>
            <dd>
              <span className="heritage__sr-only">{numberFormat.format(milestone.value)}+</span>
              <span className="heritage__number" aria-hidden="true">
                <span className="heritage__number-space">{numberFormat.format(milestone.value)}<sup>+</sup></span>
                <span className="heritage__number-live"><span ref={node => { numberRefs.current[index] = node; }}>{numberFormat.format(milestone.value)}</span><sup>+</sup></span>
              </span>
            </dd>
          </div>)}
        </dl>
      </div>
    </section>
  );
}
