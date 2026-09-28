import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotion } from '../motion/MotionContext';
import { brandLogo } from '../data/brand';
import EnquiryThanks from './EnquiryThanks';
import { CONTACT_PHONE } from './contactEnquiryUtils';
import './CartOrderEnquiry.css';

function WhatsAppMark() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 11.5a8.5 8.5 0 0 1-12 7.7L3 21l1.7-5.2A8.5 8.5 0 1 1 20.5 11.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="m8.1 7.8 1.5 2-1 1.1c.6 1.5 1.8 2.6 3.4 3.3l1-1 2.2 1.4-.5 1.5c-4.4.4-8.2-3.4-7.9-7.8l1.3-.5Z" fill="currentColor" /></svg>;
}

export default function CartOrderEnquiry({ enquiry }) {
  const { enabled } = useMotion();
  const [phase, setPhase] = useState('idle');
  const [feedback, setFeedback] = useState('');
  const [manualCopy, setManualCopy] = useState(false);
  const [copied, setCopied] = useState(false);
  const readyRef = useRef(null);
  const copyRef = useRef(null);
  const focusReady = useRef(false);
  const preparing = phase === 'preparing' && enabled;
  const ready = phase === 'ready' || phase === 'opened' || (phase === 'preparing' && !enabled);
  const displayPhase = preparing ? 'preparing' : ready ? (phase === 'opened' ? 'opened' : 'ready') : 'idle';

  const finishPreparing = useCallback(() => {
    setPhase(current => current === 'preparing' ? 'ready' : current);
  }, []);

  useEffect(() => {
    if (phase !== 'preparing') return;
    // Recover when animation events are interrupted; skip motion immediately when reduced.
    const timer = window.setTimeout(finishPreparing, enabled ? 1400 : 0);
    return () => window.clearTimeout(timer);
  }, [phase, enabled, finishPreparing]);

  useEffect(() => {
    if (ready && focusReady.current) {
      focusReady.current = false;
      readyRef.current?.focus({ preventScroll: true });
    }
  }, [ready]);

  function prepare() {
    if (phase !== 'idle') return;
    focusReady.current = true;
    setFeedback('');
    setPhase(enabled ? 'preparing' : 'ready');
  }

  async function copySelection() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(enquiry.copyText);
      setManualCopy(false);
      setCopied(true);
      setFeedback('Full selection copied. Paste it into the NordWood WhatsApp chat and tap Send when you’re ready.');
    } catch {
      setManualCopy(true);
      setFeedback('Select and copy the message below, then paste it into WhatsApp. Your selection has not been sent yet.');
      window.requestAnimationFrame(() => copyRef.current?.focus());
    }
  }

  const announcement = feedback || (preparing
    ? 'Preparing your selection for the NordWood team.'
    : phase === 'opened'
      ? 'Review your message in WhatsApp and tap Send. Your bag is still here.'
      : ready
        ? enquiry.requiresCopy ? 'Your selection is ready. Copy the full message, then open WhatsApp and paste it.' : 'Your selection is ready. Open WhatsApp, review it and tap Send.'
        : '');

  return (
    <section className="cart-enquiry" aria-labelledby="cart-enquiry-title" data-cart-motion={enabled ? 'full' : 'still'} data-state={displayPhase}>
      <div className="cart-enquiry__story">
        <p className="cart-enquiry__eyebrow">From your bag to our team</p>
        <h2 id="cart-enquiry-title">Let’s bring your<br />selection to life.</h2>
        <p className="cart-enquiry__intro">Talk through your chosen woodwork, sizes and final quote with the people who know it best.</p>
      <div className="cart-enquiry__scene" aria-hidden="true">
        <div className="cart-enquiry__stack">
          <span className="cart-enquiry__sheet cart-enquiry__sheet--back" />
          <span className="cart-enquiry__sheet cart-enquiry__sheet--middle" />
          <span className="cart-enquiry__sheet cart-enquiry__sheet--front"><svg viewBox="0 0 36 44" fill="none"><path d="M6 40V4h24v36M10 40V8h16v32M13 12h10v12H13zM13 28h10v9H13zM4 40h28" stroke="currentColor" strokeWidth="1" /><circle cx="23" cy="26" r="1" fill="currentColor" /></svg><i /><i /></span>
          <span className="cart-enquiry__count">{enquiry.itemCount}</span>
        </div>
        <span className="cart-enquiry__route" />
        <span className="cart-enquiry__plane" onAnimationEnd={event => { if (event.animationName === 'cart-order-flight') finishPreparing(); }}><span className="cart-enquiry__wing cart-enquiry__wing--upper" /><span className="cart-enquiry__wing cart-enquiry__wing--lower" /><span className="cart-enquiry__fold" /></span>
        <span className="cart-enquiry__seal"><img src={brandLogo.src} width={brandLogo.width} height={brandLogo.height} alt="" decoding="async" /></span>
        <span className="cart-enquiry__from">Your selection</span><span className="cart-enquiry__to">Our team</span>
      </div>
      </div>
      <div className="cart-enquiry__controls">
      <div className="cart-enquiry__recipient"><strong>A conversation with NordWood</strong><span>WhatsApp · {CONTACT_PHONE}</span></div>
      {ready && enquiry.requiresCopy && <button ref={readyRef} type="button" className="cart-enquiry__copy cart-enquiry__copy--primary" onClick={copySelection} aria-describedby="cart-enquiry-hint">{copied ? 'Selection copied · copy again' : '1. Copy full selection'}</button>}
      {ready ? <a ref={enquiry.requiresCopy ? undefined : readyRef} className="cart-enquiry__cta" href={enquiry.whatsapp} target="_blank" rel="noopener noreferrer" aria-describedby="cart-enquiry-hint" onClick={() => { setPhase('opened'); setFeedback(''); }}><span className="cart-enquiry__cta-copy"><strong>{phase === 'opened' ? 'Open WhatsApp again' : enquiry.requiresCopy ? '2. Open WhatsApp' : 'Open WhatsApp'}</strong><small>{enquiry.requiresCopy ? 'Paste your full selection in the chat' : 'Your selection is ready to review'}</small></span><span className="cart-enquiry__cta-icon"><WhatsAppMark /></span><span className="cart-enquiry__cta-progress" aria-hidden="true" /></a>
        : <button type="button" className="cart-enquiry__cta" onClick={prepare} disabled={preparing} aria-describedby="cart-enquiry-hint" aria-busy={preparing}><span className="cart-enquiry__cta-copy"><strong>{preparing ? 'Preparing your selection' : 'Enquire to order'}</strong><small>{preparing ? 'Bringing every detail together' : 'Start a WhatsApp conversation'}</small></span><span className="cart-enquiry__cta-icon">{preparing ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28 23" strokeLinecap="round" /></svg> : <WhatsAppMark />}</span><span className="cart-enquiry__cta-progress" aria-hidden="true" /></button>}
      <p className="cart-enquiry__hint" id="cart-enquiry-hint">{ready ? enquiry.requiresCopy ? 'Your selection is long. Copy the full message first, then open WhatsApp and paste it before sending.' : 'Review your message in WhatsApp and tap Send. Your bag stays here.' : 'We’ll prepare your products, sizes and quantities for our team. You choose when to send.'}</p>
      {phase === 'opened' && <EnquiryThanks returnLabel="Back to my selection" />}
      {preparing && <button type="button" className="cart-enquiry__skip" onClick={finishPreparing}>Skip animation</button>}
      {ready && <>
        <details className="cart-enquiry__review"><summary>Review your full enquiry</summary><pre>{enquiry.body}</pre></details>
        {!enquiry.requiresCopy && <button type="button" className="cart-enquiry__copy" onClick={copySelection}>{copied ? 'Copy selection again' : 'Copy selection instead'}</button>}
      </>}
      <p className={`cart-enquiry__feedback${!feedback && phase !== 'opened' ? ' cart-enquiry__sr-only' : ''}`} role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      {manualCopy && <div className="cart-enquiry__manual"><label htmlFor="cart-enquiry-copy">Copy your full selection</label><textarea id="cart-enquiry-copy" ref={copyRef} readOnly rows={9} value={enquiry.copyText} onFocus={event => event.target.select()} /></div>}
      </div>
    </section>
  );
}
