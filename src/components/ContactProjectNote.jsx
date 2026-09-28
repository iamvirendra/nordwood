import { brandLogo } from '../data/brand';
import { useMotion } from '../motion/MotionContext';
import { categoryLabel } from './contactEnquiryUtils';
import './ContactProjectNote.css';

function WoodworkLines({ category }) {
  switch (category) {
    case 'Door':
      return <><path d="M15 79V10h50v69M21 79V16h38v63M10 79h60" /><path d="M27 23h26v23H27zM27 52h26v20H27z" /><path d="M54 48v5" /><circle cx="54" cy="49.5" r=".8" /></>;
    case 'Window':
      return <><path d="M8 18h64v54H8zM14 24h52v42H14zM40 24v42M14 45h52M5 76h70" /><path d="M35 39v4m10-4v4M19 28h15m12 0h15M19 62h15m12 0h15" /></>;
    case 'DoorFrame':
      return <><path d="M13 79V9h54v70H56V20H24v59zM13 9l11 11M67 9 56 20M10 79h60" /><path d="M18 75V14h44v61" /><path d="M28 80h24" strokeDasharray="2 4" /></>;
    case 'WindowFrame':
      return <><path d="M7 16h66v60H7zM19 28h42v36H19zM7 16l12 12m54-12L61 28M7 76l12-12m54 12L61 64" /><path d="M13 22h54v48H13z" /></>;
    default:
      return <><path d="M16 79V34a24 24 0 0 1 48 0v45M23 79V34a17 17 0 0 1 34 0v45M10 79h60" /><path d="M31 67V38a9 9 0 0 1 18 0v29zM31 47h18M40 30v37" /><path d="M12 7v8M8 11h8M65 1v10m-5-5h10" /></>;
  }
}

// Decorative, code-native product marks. The choice card supplies its own label.
export function WoodworkMark({ category }) {
  return <svg className="project-note__mark" viewBox="0 0 80 88" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><WoodworkLines category={category} /></svg>;
}

const stageLabels = ['Find your form', 'Give it a little context', 'Picture it in your space', 'Put your name to it'];

export default function ContactProjectNote({ category = '', details = {}, step = 0 }) {
  const { enabled } = useMotion();
  const activeStep = Math.max(0, Math.min(3, step));
  const name = details.name?.trim() || '';
  const message = details.message?.trim() || '';
  const city = details.city?.trim() || '';
  const timeline = details.timeline?.trim() || '';
  const email = details.email?.trim() || '';
  const phone = details.phone?.trim() || '';

  return (
    <aside className="project-note" aria-label="Your project note" data-note-motion={enabled ? 'full' : 'still'} data-note-step={activeStep}>
      <div className="project-note__drawing">
        <div className="project-note__drawing-top"><span>NordWood / Project studio</span><span aria-hidden="true">N° {String(activeStep + 1).padStart(2, '0')}</span></div>
        <div className="project-note__sketch" key={category || 'choose'} aria-hidden="true">
          <svg className="project-note__blueprint" viewBox="0 0 320 258" fill="none" focusable="false">
            <g className="project-note__guides" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 5">
              <path d="M160 13v222M58 214h207M87 24v211M233 24v211M64 46h193" />
              <path d="M72 13v9m-4-4.5h8M253 224v9m-4-4.5h8" strokeDasharray="none" />
            </g>
            <path className="project-note__dimension" d="M62 55v148m-5-148h10m-10 148h10M99 231h122m-122-5v10m122-10v10" stroke="currentColor" strokeWidth=".8" />
            <g className="project-note__woodwork" transform="translate(92 26) scale(1.7 2.15)" fill="none" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round"><WoodworkLines category={category} /></g>
            <g className="project-note__registration" stroke="currentColor" strokeWidth=".8"><path d="M245 178v19h-19M75 32V20h12" /><circle cx="246" cy="214" r="3" /><path d="M242 214h8m-4-4v8" /></g>
          </svg>
          <span className="project-note__sketch-caption">A starting point, made yours.</span>
        </div>
        <div className="project-note__drawing-bottom"><span key={activeStep} className="project-note__stage-caption">{stageLabels[activeStep]}</span><span className="project-note__stage-marks" aria-label={`Step ${activeStep + 1} of 4`}>{stageLabels.map((_, index) => <i key={index} className={index <= activeStep ? 'is-filled' : ''} aria-hidden="true" />)}</span></div>
      </div>

      <div className="project-note__paper">
        <div className="project-note__paper-header">
          <div><p className="project-note__eyebrow">Your project note</p><span className="project-note__live-label">Builds as you go</span></div>
          <span className="project-note__brand" aria-hidden="true"><img src={brandLogo.src} width={brandLogo.width} height={brandLogo.height} alt="" decoding="async" /></span>
        </div>
        <h3 className="project-note__title" key={category || 'choose'}>{category ? categoryLabel(category) : 'A little guidance.'}</h3>
        <p className={`project-note__message${message ? ' has-value' : ''}`}>{message || 'A room you’re reimagining. A detail you love. Every project begins with an idea.'}</p>
        <dl className="project-note__details">
          <div><dt>For a space in</dt><dd className={city ? 'has-value' : ''}>{city || 'Your city'}</dd></div>
          <div><dt>On your horizon</dt><dd className={timeline ? 'has-value' : ''}>{timeline || 'Your own timeline'}</dd></div>
        </dl>
        <div className="project-note__signature">
          <span className="project-note__signature-line" aria-hidden="true"><svg viewBox="0 0 47 24" fill="none"><path d="m3 20 9-15-4 16L24 4l-9 15 21-8-10 12 18-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          <div><span className="project-note__signature-label">Imagined by</span><p className={name ? 'has-value' : ''}>{name || 'You, soon.'}</p></div>
        </div>
        {(email || phone) && <p className="project-note__contact">{[email, phone].filter(Boolean).join(' · ')}</p>}
      </div>
      <p className="project-note__footnote">A preview of your enquiry. Nothing is sent until you choose to send it in WhatsApp.</p>
    </aside>
  );
}
