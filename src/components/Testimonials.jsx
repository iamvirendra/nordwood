import { useId, useRef, useState } from 'react';
import { testimonials } from '../data/testimonials';
import './Testimonials.css';

function StoryArrow({ previous = false }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={previous ? 'M20 12H4m6-6-6 6 6 6' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef(null);
  const id = useId();
  const panelId = `${id}-story`;
  const headingId = `${id}-title`;
  const disclosureId = `${id}-disclosure`;
  const count = testimonials.length;
  const current = testimonials[activeIndex];
  const hasSamples = testimonials.some(story => story.isSample);

  const moveBy = direction => setActiveIndex(index => (index + direction + count) % count);
  const handleKeyDown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('a, input, textarea, select')) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveBy(-1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); moveBy(1); }
    else if (event.key === 'Home') { event.preventDefault(); setActiveIndex(0); }
    else if (event.key === 'End') { event.preventDefault(); setActiveIndex(count - 1); }
  };
  const handlePointerDown = event => {
    if (!event.isPrimary || event.pointerType !== 'touch' || event.target.closest('button, a')) return;
    pointerStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerUp = event => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.id !== event.pointerId) return;
    const horizontal = event.clientX - start.x;
    const vertical = event.clientY - start.y;
    if (Math.abs(horizontal) > 45 && Math.abs(horizontal) > Math.abs(vertical) * 1.4) moveBy(horizontal < 0 ? 1 : -1);
  };

  return (
    <section className="testimonials" id="testimonials" aria-labelledby={headingId}>
      <div className="testimonials__inner">
        <div className="testimonials__heading" data-reveal>
          <div><p className="eyebrow">05 / Testimonials</p><h2 id={headingId}>Feels like <em>home.</em></h2></div>
          <div className="testimonials__intro"><p>Different homes. Familiar moments.</p>{hasSamples && <p id={disclosureId} className="testimonials__disclosure">Illustrative testimonials</p>}</div>
        </div>

        <div className="testimonials__carousel" role="region" aria-roledescription="carousel" aria-label="Homeowner testimonials" aria-describedby={hasSamples ? disclosureId : undefined} onKeyDown={handleKeyDown}>
          <div id={panelId} className="testimonials__stage" role="group" aria-roledescription="slide" tabIndex={0} aria-label={`${current.isSample ? 'Illustrative testimonial' : 'Testimonial'} ${activeIndex + 1} of ${count}. Use left and right arrow keys to explore.`} aria-keyshortcuts="ArrowLeft ArrowRight Home End" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStart.current = null; }} onLostPointerCapture={() => { pointerStart.current = null; }}>
            <div className="testimonials__scene">
              <img key={current.id} src={current.image} alt={current.imageAlt} width="800" height="900" loading="lazy" draggable={false} />
              <div className="testimonials__scene-caption"><span>Spaces to come home to</span><strong>{current.detail}</strong><small>Illustrative setting</small></div>
              <span className="testimonials__scene-index" aria-hidden="true">{String(activeIndex + 1).padStart(2, '0')}<i> / {String(count).padStart(2, '0')}</i></span>
            </div>
            <div className="testimonials__story">
              <span className="testimonials__quote-mark" aria-hidden="true">“</span>
              <div className="testimonials__quote-stack">
                {testimonials.map((story, index) => <div key={story.id} className={`testimonials__quote-content${index === activeIndex ? ' is-active' : ''}`} aria-hidden={index !== activeIndex}>
                  <p className="testimonials__kicker">{story.project}</p>
                  <blockquote><p>{story.quote}</p></blockquote>
                  {!story.isSample && <div className="testimonials__author"><span className="testimonials__monogram" aria-hidden="true">{story.name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('')}</span><div><strong>{story.name}</strong><span>{story.detail}</span></div></div>}
                </div>)}
              </div>
              <div className="testimonials__navigation">
                <p className="testimonials__counter"><span>{String(activeIndex + 1).padStart(2, '0')}</span> / {String(count).padStart(2, '0')}<span className="testimonials__hint">Find a moment like yours</span></p>
                <div className="testimonials__arrows"><button type="button" aria-label="Previous testimonial" aria-controls={panelId} onClick={() => moveBy(-1)}><StoryArrow previous /></button><button type="button" aria-label="Next testimonial" aria-controls={panelId} onClick={() => moveBy(1)}><StoryArrow /></button></div>
              </div>
            </div>
          </div>

          <div className="testimonials__selectors" role="group" aria-label="Choose a testimonial">
            {testimonials.map((story, index) => <button key={story.id} type="button" className={`testimonials__selector${index === activeIndex ? ' is-active' : ''}`} aria-label={`Show ${story.isSample ? 'illustrative ' : ''}testimonial ${index + 1} of ${count}: ${story.project}`} aria-pressed={index === activeIndex} aria-controls={panelId} onClick={() => setActiveIndex(index)}><span className="testimonials__selector-number">{String(index + 1).padStart(2, '0')}</span><span className="testimonials__selector-label">{story.project}</span><span className="testimonials__selector-dot" aria-hidden="true" /></button>)}
          </div>
          <p className="testimonials__sr-only" role="status" aria-live="polite" aria-atomic="true">{current.isSample ? 'Illustrative testimonial' : 'Testimonial'} {activeIndex + 1} of {count}: {current.project}</p>
        </div>
      </div>
    </section>
  );
}
