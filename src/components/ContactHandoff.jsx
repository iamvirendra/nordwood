import { useEffect, useRef, useState } from 'react';
import { CONTACT_PHONE } from './contactEnquiryUtils';
import { brandLogo } from '../data/brand';
import EnquiryThanks from './EnquiryThanks';
import './ContactHandoff.css';

function MessageIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-4 3v-10A7.5 7.5 0 0 1 9.5 4h3A7.5 7.5 0 0 1 20 11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 10h8M7 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

export default function ContactHandoff({ enquiry, preparing, onReady, onOpen, onEdit }) {
  const headingRef = useRef(null);
  const [whatsappOpened, setWhatsappOpened] = useState(false);

  useEffect(() => {
    const heading = headingRef.current;
    heading?.focus({ preventScroll: true });
    // Scroll the page explicitly: nested overflow containers can absorb scroll margins.
    const frame = window.requestAnimationFrame(() => {
      const panel = heading?.closest('.contact-handoff');
      if (!panel) return;
      const offset = Number.parseFloat(window.getComputedStyle(panel).scrollMarginTop) || 128;
      window.scrollTo({ top: Math.max(0, window.scrollY + panel.getBoundingClientRect().top - offset), behavior: 'instant' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className={`contact-handoff${preparing ? ' is-preparing' : ' is-ready'}`} aria-labelledby="handoff-title" aria-busy={preparing}>
      <div className="contact-handoff__recipient"><MessageIcon /><div><strong>NordWood team</strong><span>WhatsApp · {CONTACT_PHONE}</span></div><span className="contact-handoff__channel">Your conversation</span></div>

      <div className="contact-handoff__journey" aria-hidden="true">
        <div className="contact-handoff__person"><span><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" /><path d="M5 20v-2a7 7 0 0 1 14 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg></span><small>You</small></div>
        <div className="contact-handoff__route">
          <span className="contact-handoff__trail" />
          <span className="contact-handoff__plane" onAnimationEnd={event => { if (event.animationName === 'handoff-message-travel') onReady(); }}>
            <span className="contact-handoff__wing contact-handoff__wing--upper" />
            <span className="contact-handoff__wing contact-handoff__wing--lower" />
            <span className="contact-handoff__fold" />
          </span>
        </div>
        <div className="contact-handoff__person contact-handoff__person--team"><span><img src={brandLogo.src} width={brandLogo.width} height={brandLogo.height} alt="" decoding="async" /></span><small>NordWood team</small></div>
      </div>

      <div className="contact-handoff__copy">
        <p className="contact-handoff__eyebrow">{preparing ? 'Preparing your conversation' : 'Ready for a real conversation'}</p>
        <h3 id="handoff-title" ref={headingRef} tabIndex={-1}>{preparing ? 'Putting your message together…' : 'Your message is ready.'}</h3>
        <p>{preparing ? 'Bringing your project details together for the NordWood team.' : 'Open WhatsApp, review your message and tap Send to connect with our team.'}</p>
      </div>

      {preparing ? (
        <div className="contact-handoff__preparing"><span className="contact-handoff__loading" aria-hidden="true"><i /><i /><i /></span><button type="button" onClick={() => { onReady(); headingRef.current?.focus({ preventScroll: true }); }}>Skip animation</button></div>
      ) : (
        <>
          <div className="contact-handoff__snapshot"><span>YOUR PROJECT</span><strong>{enquiry.payload.category}{enquiry.payload.city && ` · ${enquiry.payload.city}`}</strong><p>Prepared for {enquiry.payload.name}</p></div>
          <details className="enquiry-review contact-handoff__review"><summary>Review your message <span aria-hidden="true">+</span></summary><div className="enquiry-review-content"><pre>{enquiry.body}</pre></div></details>
          <div className="contact-handoff__actions"><a className="enquiry-primary contact-handoff__open" href={enquiry.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => { setWhatsappOpened(true); onOpen(); }}>Open WhatsApp <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a><button type="button" className="enquiry-back" onClick={onEdit}>Edit my details</button></div>
          {whatsappOpened && <EnquiryThanks />}
          <p className="contact-handoff__note">You choose when to send. Your details stay here if you need to make a change.</p>
        </>
      )}
    </section>
  );
}
