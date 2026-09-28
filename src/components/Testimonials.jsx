import { useEffect, useId, useRef, useState } from 'react';
import { testimonials } from '../data/testimonials';
import { useMotion } from '../motion/MotionContext';
import './Testimonials.css';

const SLIDE_DURATION = 10000;

function StoryArrow({ previous = false }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={previous ? 'M20 12H4m6-6-6 6 6 6' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Testimonials() {
  const { enabled } = useMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectionVersion, setSelectionVersion] = useState(0);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [touching, setTouching] = useState(false);
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window));
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [announcement, setAnnouncement] = useState('');
  const sectionRef = useRef(null);
  const pointerStart = useRef(null);
  const id = useId();
  const panelId = `${id}-story`;
  const headingId = `${id}-title`;
  const disclosureId = `${id}-disclosure`;
  const count = testimonials.length;
  const current = testimonials[activeIndex];
  const hasSamples = testimonials.some(story => story.isSample);
  const rotating = enabled && visible && pageVisible && !focused && !hovered && !touching;

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2), { threshold: 0.2 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => setActiveIndex(index => (index + 1) % count), SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [rotating, activeIndex, count, selectionVersion]);

  const selectSlide = index => {
    const next = (index + count) % count;
    setActiveIndex(next);
    setSelectionVersion(version => version + 1);
    setAnnouncement(`Testimonial ${next + 1} of ${count}: ${testimonials[next].project}`);
  };
  const moveBy = direction => selectSlide(activeIndex + direction);
  const handleKeyDown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('a, input, textarea, select')) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveBy(-1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); moveBy(1); }
    else if (event.key === 'Home') { event.preventDefault(); selectSlide(0); }
    else if (event.key === 'End') { event.preventDefault(); selectSlide(count - 1); }
  };
  const handleFocus = event => {
    if (event.target.matches(':focus-visible')) setFocused(true);
  };
  const handleBlur = event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };
  const clearPointer = () => {
    pointerStart.current = null;
    setTouching(false);
  };
  const handlePointerDown = event => {
    if (!event.isPrimary || event.pointerType !== 'touch' || event.target.closest('button, a')) return;
    pointerStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setTouching(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerUp = event => {
    const start = pointerStart.current;
    clearPointer();
    if (!start || start.id !== event.pointerId) return;
    const horizontal = event.clientX - start.x;
    const vertical = event.clientY - start.y;
    if (Math.abs(horizontal) > 45 && Math.abs(horizontal) > Math.abs(vertical) * 1.4) moveBy(horizontal < 0 ? 1 : -1);
  };

  return (
    <section ref={sectionRef} className="testimonials" id="testimonials" aria-labelledby={headingId}>
      <div className="testimonials__inner">
        <div className="testimonials__heading" data-reveal>
          <div><p className="eyebrow">05 / Testimonials</p><h2 id={headingId}>Feels like <em>home.</em></h2></div>
          <div className="testimonials__intro"><p>Different homes. Familiar moments.</p>{hasSamples && <p id={disclosureId} className="testimonials__disclosure">Illustrative testimonials</p>}</div>
        </div>

        <div className="testimonials__carousel" role="region" aria-roledescription="carousel" aria-label="Customer testimonials" aria-describedby={hasSamples ? disclosureId : undefined} onKeyDown={handleKeyDown} onFocusCapture={handleFocus} onBlurCapture={handleBlur} onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false); }}>
          <div id={panelId} className="testimonials__stage" role="group" aria-roledescription="slide" tabIndex={0} aria-label={`${current.isSample ? 'Illustrative testimonial' : 'Testimonial'} ${activeIndex + 1} of ${count}. Use left and right arrow keys to explore.`} aria-keyshortcuts="ArrowLeft ArrowRight Home End" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={clearPointer} onLostPointerCapture={clearPointer}>
            <div className="testimonials__scene">
              <img key={current.id} src={current.image} alt={current.imageAlt} width="800" height="900" loading="lazy" draggable={false} />
              <div className="testimonials__scene-caption"><span>Spaces to come home to</span><strong>{current.detail}</strong><small>Illustrative setting</small></div>
            </div>
            <div className="testimonials__story">
              <span className="testimonials__quote-mark" aria-hidden="true">“</span>
              <div className="testimonials__quote-stack">
                {testimonials.map((story, index) => <div key={story.id} className={`testimonials__quote-content${index === activeIndex ? ' is-active' : ''}`} aria-hidden={index !== activeIndex}>
                  <p className="testimonials__kicker">{story.project}</p>
                  <blockquote><p>{story.quote}</p></blockquote>
                  {!story.isSample && <div className="testimonials__author"><span className="testimonials__monogram" aria-hidden="true">{story.name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('')}</span><div><strong>{story.name}</strong><span>{story.location}</span></div></div>}
                </div>)}
              </div>
              <div className="testimonials__navigation">
                <div className="testimonials__arrows"><button type="button" aria-label="Previous testimonial" aria-controls={panelId} onClick={() => moveBy(-1)}><StoryArrow previous /></button><button type="button" aria-label="Next testimonial" aria-controls={panelId} onClick={() => moveBy(1)}><StoryArrow /></button></div>
              </div>
            </div>
          </div>

          <p className="testimonials__sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
        </div>
      </div>
    </section>
  );
}
