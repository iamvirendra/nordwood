import { useId } from 'react';
import { Link } from 'react-router-dom';
import DoorAssembly from './DoorAssembly';
import './TimberCraft.css';

export default function TimberCraft() {
  const titleId = useId();

  return (
    <section id="approach" className="timber-craft" aria-labelledby={titleId}>
      <div className="timber-craft__heading" data-reveal>
        <div>
          <p className="eyebrow">The anatomy of our craft</p>
          <h2 id={titleId}>Beautiful outside.<br /><em>Considered within.</em></h2>
        </div>
        <div className="timber-craft__intro">
          <p>A door is more than its surface. Explore the frame, the panels and the details that bring a wooden opening together.</p>
          <span><i aria-hidden="true" /> Made to be explored</span>
        </div>
      </div>

      <DoorAssembly />

      <div className="timber-craft__footer">
        <p>Illustrative construction studies. Materials, joinery and dimensions vary with the chosen design.</p>
        <Link to="/contact">Discuss your door <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
