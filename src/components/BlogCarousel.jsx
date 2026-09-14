import { useId, useRef, useState } from 'react';
import './BlogCarousel.css';

function CarouselArrow({ previous = false }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d={previous ? 'M20 12H4m6-6-6 6 6 6' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BlogCarousel({ images = [], title, priority = false }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pointerStart = useRef(null);
  const galleryId = useId();
  const slides = images.filter(image => image?.src);
  const count = slides.length;

  if (!count) return null;

  const activeIndex = Math.min(selectedIndex, count - 1);
  const activeImage = slides[activeIndex];
  const labelId = `${galleryId}-label`;
  const photoId = `${galleryId}-photo`;
  const moveBy = direction => {
    setSelectedIndex(current => (Math.min(current, count - 1) + direction + count) % count);
  };

  const handleKeyDown = event => {
    if (count < 2 || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveBy(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveBy(1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setSelectedIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setSelectedIndex(count - 1);
    }
  };

  const handlePointerDown = event => {
    if (count < 2 || !event.isPrimary || event.pointerType !== 'touch') return;
    pointerStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = event => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.id !== event.pointerId) return;
    const horizontal = event.clientX - start.x;
    const vertical = event.clientY - start.y;
    if (Math.abs(horizontal) > 45 && Math.abs(horizontal) > Math.abs(vertical) * 1.4) {
      moveBy(horizontal < 0 ? 1 : -1);
    }
  };

  return (
    <div className="blog-carousel" role="region" aria-roledescription="carousel" aria-labelledby={labelId} tabIndex={0} aria-keyshortcuts="ArrowLeft ArrowRight Home End" onKeyDown={handleKeyDown}>
      <span id={labelId} className="blog-carousel__accessible">{title} photo gallery</span>
      <figure className="blog-carousel__figure">
        <div id={photoId} className="blog-carousel__viewport" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStart.current = null; }} onLostPointerCapture={() => { pointerStart.current = null; }}>
          <img
            key={`${activeIndex}-${activeImage.src}`}
            className="blog-carousel__image"
            style={{ objectFit: activeImage.fit || 'cover' }}
            src={activeImage.src}
            alt={activeImage.alt || `${title}, photo ${activeIndex + 1}`}
            width="1200"
            height="900"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            draggable={false}
          />
        </div>
        {activeImage.caption && <figcaption className="blog-carousel__caption">{activeImage.caption}</figcaption>}
      </figure>

      {count > 1 && (
        <div className="blog-carousel__controls">
          <button type="button" className="blog-carousel__arrow" aria-label="Previous photo" aria-controls={photoId} onClick={() => moveBy(-1)}><CarouselArrow previous /></button>
          <div className="blog-carousel__position">
            <span className="blog-carousel__counter" aria-live="polite" aria-atomic="true">
              <span aria-hidden="true">{String(activeIndex + 1).padStart(2, '0')} <span className="blog-carousel__divider">/</span> {String(count).padStart(2, '0')}</span>
              <span className="blog-carousel__accessible">Photo {activeIndex + 1} of {count}</span>
            </span>
            <div className="blog-carousel__dots" role="group" aria-label="Choose a photo">
              {slides.map((image, index) => (
                <button key={`${index}-${image.src}`} type="button" className="blog-carousel__dot" aria-label={`Show photo ${index + 1} of ${count}`} aria-pressed={index === activeIndex} aria-controls={photoId} onClick={() => setSelectedIndex(index)}><span aria-hidden="true" /></button>
              ))}
            </div>
          </div>
          <button type="button" className="blog-carousel__arrow" aria-label="Next photo" aria-controls={photoId} onClick={() => moveBy(1)}><CarouselArrow /></button>
        </div>
      )}
    </div>
  );
}
