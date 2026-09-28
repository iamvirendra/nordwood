import { Link } from 'react-router-dom';
import { craftImages } from '../data/craftImages';
import './DoorConstructionNote.css';

export default function DoorConstructionNote() {
  const references = [craftImages.cutaway, craftImages.exploded];

  return (
    <section className="door-construction-note" aria-labelledby="door-construction-title" data-motion="rise">
      <div className="door-construction-copy">
        <p className="eyebrow">A closer look</p>
        <h2 id="door-construction-title">Behind the finished door.</h2>
        <p>Explore the pieces that give a panel door its form, from the surrounding stiles and rails to the panels within.</p>
        <p className="door-construction-disclaimer">These images are illustrative anatomy references. Construction, materials and dimensions vary with your chosen design.</p>
        <div className="door-construction-links">
          <Link to="/#approach">Explore the craft <span aria-hidden="true">↗</span></Link>
          <Link to="/contact">Discuss your exact specification <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="door-construction-references">
        {references.map((reference, index) => (
          <a key={reference.src} href={reference.src} target="_blank" rel="noopener noreferrer" aria-label={`View ${reference.label.toLowerCase()} at full size (opens in a new tab)`}>
            <figure>
              <div className="door-construction-image">
                <img src={reference.src} alt={reference.alt} width={reference.width} height={reference.height} loading="lazy" decoding="async" />
              </div>
              <figcaption><span><span className="door-construction-number">0{index + 1}</span>{reference.label}</span><span aria-hidden="true">↗</span></figcaption>
            </figure>
          </a>
        ))}
        <p className="door-construction-image-hint">Open either image to explore the details.</p>
      </div>
    </section>
  );
}
