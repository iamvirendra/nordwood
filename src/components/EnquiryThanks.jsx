import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMotion } from '../motion/MotionContext';
import { brandLogo } from '../data/brand';
import './EnquiryThanks.css';

// A WhatsApp deep link cannot report delivery. Show thanks only after the visitor
// confirms they tapped Send, never merely because they opened the WhatsApp link.
export default function EnquiryThanks({ returnLabel = 'Back to my project' }) {
  const { enabled } = useMotion();
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const doneRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    doneRef.current?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);

  function showThanks() {
    setConfirmed(true);
    setOpen(true);
  }

  function containFocus(event) {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === closeRef.current) {
      event.preventDefault();
      doneRef.current?.focus();
    } else if (!event.shiftKey && document.activeElement === doneRef.current) {
      event.preventDefault();
      closeRef.current?.focus();
    }
  }

  return <>
    <div className="enquiry-sent-confirmation" data-confirmed={confirmed}>
      <p>{confirmed ? 'Thank you for starting a conversation with us.' : 'After you’ve tapped Send in WhatsApp, let us know below.'}</p>
      <button type="button" className="enquiry-sent-confirmation__button" onClick={showThanks}>
        {confirmed ? 'View thank-you message' : 'I’ve sent my message'}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
    {open && createPortal(
      <dialog ref={dialogRef} className="enquiry-thanks" data-thanks-motion={enabled ? 'full' : 'still'} aria-labelledby={titleId} aria-describedby={descriptionId} onKeyDown={containFocus} onCancel={event => { event.preventDefault(); setOpen(false); }}>
        <div className="enquiry-thanks__content">
          <button type="button" ref={closeRef} className="enquiry-thanks__close" aria-label="Close thank-you message" onClick={() => setOpen(false)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg></button>
          <div className="enquiry-thanks__seal" aria-hidden="true"><img src={brandLogo.src} width={brandLogo.width} height={brandLogo.height} alt="" /><span className="enquiry-thanks__check"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" pathLength="1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div>
          <p className="enquiry-thanks__eyebrow">A conversation worth having</p>
          <h2 className="enquiry-thanks__title" id={titleId}>Thank you for<br />reaching out.</h2>
          <p className="enquiry-thanks__message" id={descriptionId}>Our team will connect with you <strong>shortly.</strong></p>
          <p className="enquiry-thanks__note">We look forward to bringing your ideas to life.</p>
          <button type="button" ref={doneRef} className="enquiry-thanks__done" onClick={() => setOpen(false)}>{returnLabel}<span aria-hidden="true">↗</span></button>
        </div>
      </dialog>, document.body,
    )}
  </>;
}
