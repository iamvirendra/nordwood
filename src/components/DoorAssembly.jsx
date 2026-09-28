import { useId, useState } from 'react';
import { craftImages } from '../data/craftImages';
import { useMotion } from '../motion/MotionContext';
import './DoorAssembly.css';

const reference = craftImages.anatomy.src;

// Each polygon clips a separate photographic component from the unmodified
// supplied diagram. Coordinates refer to its original 1203 × 1308 pixels.
const pieces = [
  { id: 'back', points: '1070,339 1170,383 1170,1049 1070,1091', origin: [1070, 339], open: [881, 211, .55], closed: [489, 146, .55] },
  { id: 'skin', points: '957,310 963,301 1053,350 1053,1081 958,1123', origin: [957, 301], open: [794, 176, .55], closed: [476, 146, .55] },
  { id: 'core', points: '840,293 886,278 930,305 930,1126 897,1141 840,1117', origin: [840, 278], open: [710, 140, .55], closed: [468, 141, .55] },
  { id: 'head', points: '427,232 805,167 824,182 824,200 458,262 427,248', origin: [427, 167], open: [408, 28, .55], closed: [420, 64, .47] },
  { id: 'jamb', points: '345,280 360,277 392,290 392,1139 357,1149 345,1144', origin: [345, 277], open: [274, 110, .55], closed: [425, 101, .56] },
  { id: 'stile', points: '425,297 439,301 468,311 468,1111 437,1126 425,1121', origin: [425, 297], open: [321, 135, .55], closed: [445, 119, .56] },
  { id: 'top-rail', points: '506,320 788,277 794,282 794,359 512,392 506,389', origin: [506, 277], open: [421, 127, .55], closed: [445, 127, .49] },
  // The matching clean panel detail is reused here; the other panel in the
  // supplied artwork has annotation text printed across its wood face.
  { id: 'left-panel', points: '719,402 788,392 800,397 800,1005 787,1011 719,991', origin: [719, 392], open: [421, 220, .44], closed: [450, 206, .44] },
  { id: 'centre-panel', points: '595,413 687,402 699,408 699,902 687,907 595,893', origin: [595, 402], open: [489, 210, .55], closed: [478, 202, .56] },
  { id: 'right-panel', points: '719,402 788,392 800,397 800,1005 787,1011 719,991', origin: [719, 392], open: [575, 202, .55], closed: [533, 196, .50] },
  { id: 'middle-rail', points: '508,912 701,952 701,985 688,992 507,952', origin: [507, 912], open: [421, 508, .55], closed: [454, 403, .56] },
  { id: 'bottom-rail', points: '506,997 797,1048 800,1055 800,1167 788,1170 506,1093', origin: [506, 997], open: [421, 555, .55], closed: [447, 508, .48] },
  { id: 'sill', points: '395,1170 424,1157 765,1255 765,1276 744,1293 395,1191', origin: [395, 1157], open: [372, 623, .5], closed: [422, 601, .48] },
];

const finishedDoor = {
  id: 'finished',
  points: '22,240 36,231 314,300 314,1138 43,1205 23,1198',
  origin: [22, 231],
  open: [83, 64, .56],
  closed: [423, 64, .56],
};

function position(piece, amount) {
  return piece.closed.map((value, index) => value + (piece.open[index] - value) * amount);
}

function PhotoPiece({ piece, amount, clipId, finished = false }) {
  const [x, y, scale] = position(piece, amount);
  return (
    <g
      className="door-assembly__piece"
      style={{ transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity: finished ? 1 : amount }}
    >
      <g transform={`translate(${-piece.origin[0]} ${-piece.origin[1]})`}>
        <image href={reference} width="1203" height="1308" clipPath={`url(#${clipId})`} />
      </g>
    </g>
  );
}

export default function DoorAssembly() {
  const id = useId().replace(/:/g, '');
  const { enabled } = useMotion();
  const [separation, setSeparation] = useState(100);
  const [animate, setAnimate] = useState(true);
  const amount = separation / 100;
  const stateLabel = separation === 0 ? 'The finished form' : separation === 100 ? 'Every piece, revealed' : 'A closer look inside';

  function show(value) {
    setAnimate(true);
    setSeparation(value);
  }

  return (
    <div className={`door-assembly${enabled && animate ? ' door-assembly--animated' : ''}`}>
      <div className="door-assembly__stage">
        <div className="door-assembly__stage-heading" aria-hidden="true">
          <span>A closer look</span>
          <span>{stateLabel}</span>
        </div>
        <svg className="door-assembly__art" viewBox="0 0 1040 715" role="img" aria-labelledby={`${id}-title ${id}-description`}>
          <title id={`${id}-title`}>The anatomy of a wooden door</title>
          <desc id={`${id}-description`}>
            A carved door and its individual frame, rails, decorative panels and internal layers.
            Use the controls below to bring the photographic pieces together or separate them.
            This is an illustrative construction study.
          </desc>
          <defs>
            {[...pieces, finishedDoor].map(piece => (
              <clipPath id={`${id}-${piece.id}`} key={piece.id} clipPathUnits="userSpaceOnUse">
                <polygon points={piece.points} />
              </clipPath>
            ))}
            <radialGradient id={`${id}-floor`}>
              <stop offset="0" stopColor="#685138" stopOpacity=".13" />
              <stop offset="1" stopColor="#685138" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="523" cy="657" rx="410" ry="38" fill={`url(#${id}-floor)`} aria-hidden="true" />
          <g aria-hidden="true">
            {pieces.map(piece => <PhotoPiece key={piece.id} piece={piece} amount={amount} clipId={`${id}-${piece.id}`} />)}
            <PhotoPiece piece={finishedDoor} amount={amount} clipId={`${id}-finished`} finished />
          </g>
        </svg>
        <div className="door-assembly__stage-caption" aria-hidden="true">
          <span>Carved detail. Considered construction.</span>
          <span>Interactive study</span>
        </div>
      </div>

      <div className="door-assembly__controls">
        <div className="door-assembly__buttons" role="group" aria-label="Door construction view">
          <button type="button" aria-pressed={separation === 0} onClick={() => show(0)}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 3h10v14H5zM8 6h4v8H8z" /></svg>
            Assembled
          </button>
          <button type="button" aria-pressed={separation === 100} onClick={() => show(100)}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8 5h4v10H8zM4 3v14M16 3v14M7 2h6M7 18h6" /></svg>
            Exploded view
          </button>
        </div>
        <div className="door-assembly__slider">
          <label htmlFor={`${id}-separation`}>Explore the layers <span aria-hidden="true">Drag to reveal</span></label>
          <input
            id={`${id}-separation`}
            type="range"
            min="0"
            max="100"
            step="1"
            value={separation}
            aria-valuetext={`${separation}% separated`}
            style={{ '--separation': `${separation}%` }}
            onChange={event => { setAnimate(false); setSeparation(Number(event.target.value)); }}
          />
        </div>
      </div>
      <p className="door-assembly__note">An illustrative view of door construction. Details vary with the chosen design.</p>
    </div>
  );
}
