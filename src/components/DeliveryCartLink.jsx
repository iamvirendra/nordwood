import { useRef } from 'react';
import { Link } from 'react-router-dom';
import './DeliveryCartLink.css';

function DeliveryTruck() {
  return (
    <svg className="delivery-cart__scene" width="180" height="86" viewBox="0 0 180 86" fill="none" aria-hidden="true" focusable="false">
      <ellipse cx="96" cy="72" rx="63" ry="4" fill="currentColor" opacity=".08" />
      <path className="delivery-cart__road" d="M10 78h161" stroke="currentColor" strokeOpacity=".28" strokeWidth="1.2" strokeDasharray="16 9 3 9" />
      <g className="delivery-cart__home" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity=".55">
        <path d="m150 26 10-8 10 8m-17-2v13h14V24m-10 13v-7h6v7" />
        <path d="M157 12c0-3 4-3 4 0 0-3 4-3 4 0 0 2-4 5-4 5s-4-3-4-5Z" fill="var(--brass)" stroke="none" />
      </g>
      <g className="delivery-cart__trail" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.5" strokeLinecap="round"><path d="M16 49h13M10 56h18M19 63h10" /></g>
      <g className="delivery-cart__vehicle">
        <g className="delivery-cart__cargo delivery-cart__cargo--door">
          <rect x="47" y="13" width="25" height="42" rx="2" fill="#b78854" stroke="#776244" strokeWidth="1.2" />
          <path d="M51 17h17v15H51zM51 36h17v15H51z" stroke="#f1dfbf" strokeOpacity=".8" />
          <path d="M65 33h2" stroke="#373c38" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M55 19v10m4 9v10" stroke="#776244" strokeOpacity=".4" />
        </g>
        <g className="delivery-cart__cargo delivery-cart__cargo--frame">
          <path d="m78 22 18-3 6 35-18 3Z" fill="#e8d8b6" stroke="#776244" strokeWidth="1.2" />
          <path d="m82 25 11-2 5 28-11 2Z" fill="#9a744c" stroke="#776244" />
          <path d="m85 28 6-1 3 20-6 1Z" fill="#f4f0e6" />
        </g>
        <g className="delivery-cart__cargo delivery-cart__cargo--planks">
          <rect x="40" y="44" width="63" height="7" rx="1.5" fill="#c69b66" stroke="#776244" strokeWidth="1.1" />
          <path d="M45 47.5h22m7 0h22" stroke="#f1dfbf" strokeWidth="1.1" />
        </g>
        <path d="M37 52h68v10H37Z" fill="#e8d8b6" stroke="#373c38" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M40 55h62M45 52v10m49-10v10" stroke="#776244" strokeWidth="1.2" />
        <path d="M105 32h20c3 0 4 1 6 4l11 15v12h-37Z" fill="#373c38" stroke="#2c302e" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M111 37h13l9 12h-22Z" fill="#dce1d5" stroke="#e8d8b6" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M117 38v10" stroke="#f4f0e6" strokeWidth="1.1" />
        <path d="M109 54h5" stroke="#e8d8b6" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M139 53h4v5h-4" fill="#e8d8b6" />
        <path d="M35 62h110v4H35Z" fill="#776244" />
        <path d="M37 57h3v4h-3" fill="#a96f4a" />
        {[57, 128].map(x => <g key={x} transform={`translate(${x} 66)`}>
          <circle r="9" fill="#2c302e" stroke="#f4f0e6" strokeWidth="1.4" />
          <circle r="5.2" fill="#e8d8b6" />
          <g className="delivery-cart__wheel"><path d="M0-4v8m-4-4h8" stroke="#776244" strokeWidth="1.2" /></g>
          <circle r="1.5" fill="#373c38" />
        </g>)}
      </g>
    </svg>
  );
}

export default function DeliveryCartLink({ count }) {
  const artRef = useRef(null);
  const label = `View your selection, ${count} ${count === 1 ? 'item' : 'items'}`;
  const replayScene = () => {
    // Keep the clicked DOM nodes in place so replay never interrupts navigation.
    artRef.current?.getAnimations({ subtree: true }).forEach(animation => {
      animation.currentTime = 0;
      animation.play();
    });
  };

  return (
    <Link to="/cart" className="delivery-cart" aria-label={label} title={label} onPointerEnter={event => { if (event.pointerType === 'mouse') replayScene(); }} onFocus={replayScene}>
      <span ref={artRef} className="delivery-cart__art" key={count} aria-hidden="true"><DeliveryTruck /><span className="delivery-cart__count">{count > 99 ? '99+' : count}</span></span>
      <span className="delivery-cart__copy" aria-hidden="true"><strong>For your home</strong><span>View selection <span>↗</span></span></span>
    </Link>
  );
}
