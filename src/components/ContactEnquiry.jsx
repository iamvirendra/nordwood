import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotion } from '../motion/MotionContext';
import { brandLogo } from '../data/brand';
import ContactHandoff from './ContactHandoff';
import ContactProjectNote, { WoodworkMark } from './ContactProjectNote';
import { CONTACT_PHONE, ENQUIRY_CATEGORIES, createEnquiry, validateEnquiry } from './contactEnquiryUtils';
import './ContactEnquiry.css';

const emptyDetails = { name: '', email: '', phone: '', city: '', timeline: '', message: '' };
const steps = ['Your piece', 'Your idea', 'Place & pace', 'Meet the team'];
const questions = [
  ['What are you imagining?', 'Every space starts with a possibility. Choose yours, or let us help you find it.'],
  ['Tell us a little of your story.', 'A room you’re changing. A detail you love. A question you’ve been meaning to ask.'],
  ['Where, and when?', 'Give us a sense of place and timing. It’s fine if you’re still figuring things out.'],
  ['Let’s make it personal.', 'Add your name and we’ll bring your ideas together in a message for our team.'],
];
const categoryNotes = { Door: 'A welcome with character', Window: 'A little more light', DoorFrame: 'The right foundation', WindowFrame: 'Frame a new perspective', '': 'Let’s discover it together' };
const starters = [
  ['Help choosing wood', 'I would like your help choosing the right wood for my space.'],
  ['Sizes & pricing', 'I would like to discuss sizes and pricing for my project.'],
  ['A custom design', 'I have a design in mind and would like to explore the possibilities.'],
];
const timelines = [
  ['Just exploring', 'Taking it one idea at a time'],
  ['Within a month', 'Ready to get things moving'],
  ['In 1–3 months', 'Planning the next chapter'],
  ['More than 3 months away', 'There’s time to get it right'],
];

function Arrow() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function FieldError({ name, errors }) {
  return errors[name] ? <p className="enquiry-error" id={`enquiry-${name}-error`}>{errors[name]}</p> : null;
}

export default function ContactEnquiry({ selectedCategory = '', onCategoryChange = () => {} }) {
  const { enabled } = useMotion();
  const [details, setDetails] = useState(emptyDetails);
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ kind: '', text: '' });
  const [showManualCopy, setShowManualCopy] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [handoff, setHandoff] = useState(null);
  const [preparing, setPreparing] = useState(false);
  const [previousCategory, setPreviousCategory] = useState(selectedCategory);
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const copyRef = useRef(null);
  const focusTarget = useRef(null);
  const enquiry = handoff || createEnquiry(details, selectedCategory);
  const isPreparing = preparing && enabled;

  const finishPreparing = useCallback(() => {
    setPreparing(false);
    setStatus({ kind: 'ready', text: 'Your message is ready for the NordWood team. Open WhatsApp, review it and tap Send.' });
  }, []);

  useEffect(() => {
    if (!preparing) return;
    const fallback = window.setTimeout(finishPreparing, enabled ? 1100 : 0);
    return () => window.clearTimeout(fallback);
  }, [enabled, preparing, finishPreparing]);

  if (previousCategory !== selectedCategory) {
    setPreviousCategory(selectedCategory);
    setHandoff(null);
    setPreparing(false);
    setShowManualCopy(false);
    setStatus({ kind: '', text: '' });
  }

  useEffect(() => {
    if (!focusTarget.current) return;
    const field = focusTarget.current;
    const node = field === 'heading' ? headingRef.current : formRef.current?.elements.namedItem(field);
    if (!node) return;
    focusTarget.current = null;
    const frame = window.requestAnimationFrame(() => {
      node.focus({ preventScroll: true });
      const top = field === 'heading' ? formRef.current : node;
      window.scrollTo({ top: Math.max(0, window.scrollY + top.getBoundingClientRect().top - 112), behavior: 'instant' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step, handoff, contactOpen, errors]);

  function resetPrepared() {
    setHandoff(null);
    setPreparing(false);
    setShowManualCopy(false);
    setStatus({ kind: '', text: '' });
  }
  function changeStep(nextStep) {
    focusTarget.current = 'heading';
    setStep(nextStep);
    setFurthest(current => Math.max(current, nextStep));
    resetPrepared();
  }
  function updateDetail(name, value) {
    setDetails(previous => ({ ...previous, [name]: value }));
    setErrors(previous => ({ ...previous, [name]: undefined }));
    setStatus({ kind: '', text: '' });
  }
  function handleChange(event) { updateDetail(event.target.name, event.target.value); }
  function validate(full = false) {
    const nextErrors = validateEnquiry(details, full ? 2 : 1);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (!firstInvalid) return true;
    const target = firstInvalid === 'message' ? 1 : 3;
    if (firstInvalid === 'email' || firstInvalid === 'phone') setContactOpen(true);
    changeStep(target);
    focusTarget.current = firstInvalid;
    return false;
  }
  function visitStep(nextStep) {
    if (isPreparing || nextStep > furthest || (nextStep === step && !handoff)) return;
    if (nextStep > step && nextStep > 1 && !validate()) return;
    changeStep(nextStep);
  }
  function addStarter(sentence) {
    if (details.message.includes(sentence)) return;
    const next = [details.message.trim(), sentence].filter(Boolean).join('\n\n');
    if (next.length > 2500) {
      setStatus({ kind: 'hint', text: 'There isn’t room for this prompt. Shorten your note first, or keep your own words.' });
      return;
    }
    updateDetail('message', next);
    formRef.current?.elements.namedItem('message')?.focus({ preventScroll: true });
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (preparing || handoff) return;
    if (step < 3) {
      if (step === 1 && !validate()) return;
      changeStep(step + 1);
      return;
    }
    if (!validate(true)) return;
    setHandoff(enquiry);
    setShowManualCopy(false);
    setPreparing(enabled);
    setStatus({ kind: enabled ? 'preparing' : 'ready', text: enabled ? 'Preparing your message for the NordWood team.' : 'Your message is ready for the NordWood team. Open WhatsApp, review it and tap Send.' });
  }
  function openEmailDraft() {
    if (!validate(true)) return;
    window.location.assign(enquiry.mailto);
    setStatus({ kind: 'draft', text: 'Review the draft in your email app and press Send. If your app did not open, copy your enquiry instead. Your enquiry has not been sent yet.' });
  }
  async function copyEnquiry() {
    if (!validate(true)) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(enquiry.copyText);
      setShowManualCopy(false);
      setStatus({ kind: 'copied', text: `Enquiry copied. Paste it into WhatsApp to ${CONTACT_PHONE} and press Send when you’re ready. It has not been sent yet.` });
    } catch {
      setShowManualCopy(true);
      setStatus({ kind: 'copy', text: 'Select and copy the text below, then paste it into WhatsApp or an email. Your enquiry has not been sent yet.' });
      requestAnimationFrame(() => copyRef.current?.focus());
    }
  }

  return (
    <div className="enquiry enquiry-studio" data-enquiry-motion={enabled ? 'full' : 'still'}>
      <div className="enquiry-studio-bar"><span>THE PROJECT STUDIO</span><span>A few details. A personal conversation.</span></div>
      <ol className="enquiry-progress" aria-label="Project conversation steps">
        {steps.map((label, index) => <li key={label} className={`${step === index ? 'is-active' : ''} ${index < step ? 'is-complete' : ''}`} aria-current={step === index ? 'step' : undefined}><button type="button" disabled={isPreparing || index > furthest} onClick={() => visitStep(index)}><span aria-hidden="true">{index < step ? '✓' : `0${index + 1}`}</span><span>{label}</span></button></li>)}
      </ol>
      <div className="enquiry-workspace">
        <form ref={formRef} className="enquiry-form" onSubmit={handleSubmit} noValidate>
          {!handoff && <div className="enquiry-step" key={step}>
            <div className="enquiry-guide"><img src={brandLogo.src} width={brandLogo.width} height={brandLogo.height} alt="" /><span>A starting point from NordWood <span aria-hidden="true">/ 0{step + 1}</span></span></div>
            <div className="enquiry-step-heading"><h3 ref={headingRef} tabIndex={-1}>{questions[step][0]}</h3><p>{questions[step][1]}</p></div>
            {(step === 1 || step === 3) && <p className="enquiry-required-note">Fields marked <span aria-hidden="true">*</span><span className="enquiry-sr-only">with an asterisk</span> are required.</p>}
            {(step === 1 ? errors.message : step === 3 && Object.values(errors).some(Boolean)) && <p className="enquiry-error-summary" role="alert">A little more detail is needed. Please check the highlighted field.</p>}

            {step === 0 && <fieldset className="enquiry-category-group"><legend className="enquiry-sr-only">Choose your woodwork</legend><div className="enquiry-categories">{ENQUIRY_CATEGORIES.map(option => <label key={option.value || 'choose'} className={`enquiry-category${selectedCategory === option.value ? ' is-selected' : ''}${!option.value ? ' enquiry-category--guidance' : ''}`}><input type="radio" name="category" value={option.value} checked={selectedCategory === option.value} onChange={() => onCategoryChange(option.value)} /><span className="enquiry-choice-art"><WoodworkMark category={option.value} /></span><span className="enquiry-choice-copy"><strong>{option.label}</strong><small>{categoryNotes[option.value]}</small></span><span className="enquiry-category-dot" aria-hidden="true">{selectedCategory === option.value ? '✓' : '+'}</span></label>)}</div></fieldset>}

            {step === 1 && <>
              <div className="enquiry-field enquiry-story"><label htmlFor="enquiry-message">Your idea, in your words <span aria-hidden="true">*</span></label><textarea id="enquiry-message" name="message" rows={5} maxLength={2500} required value={details.message} onChange={handleChange} placeholder="I’m imagining a warm entrance for our home…" aria-invalid={Boolean(errors.message)} aria-describedby={`enquiry-message-hint${errors.message ? ' enquiry-message-error' : ''}`} /><div className="enquiry-field-footer"><p id="enquiry-message-hint">An idea is enough. Add sizes or quantities if you have them.</p><span>{details.message.length}/2500</span></div><FieldError name="message" errors={errors} /></div>
              <div className="enquiry-starters"><p>Need a starting point? Add a thought.</p><div>{starters.map(([label, sentence]) => <button type="button" key={label} disabled={details.message.includes(sentence)} onClick={() => addStarter(sentence)}><span aria-hidden="true">{details.message.includes(sentence) ? '✓' : '+'}</span>{label}</button>)}</div></div>
            </>}

            {step === 2 && <>
              <div className="enquiry-field"><label htmlFor="enquiry-city">Where is your project? <small>Optional</small></label><input id="enquiry-city" name="city" autoComplete="address-level2" maxLength={100} value={details.city} onChange={handleChange} placeholder="Your city, e.g. Lucknow" /></div>
              <fieldset className="enquiry-timeline-group"><legend>What’s your pace? <small>Optional</small></legend><div className="enquiry-timelines">{timelines.map(([value, caption]) => <label className={`enquiry-timeline${details.timeline === value ? ' is-selected' : ''}`} key={value}><input type="radio" name="timeline" value={value} checked={details.timeline === value} onChange={handleChange} /><span className="enquiry-category-dot" aria-hidden="true">{details.timeline === value ? '✓' : ''}</span><span><strong>{value}</strong><small>{caption}</small></span></label>)}</div>{details.timeline && <button type="button" className="enquiry-clear" onClick={() => updateDetail('timeline', '')}>Clear timing</button>}</fieldset>
              <p className="enquiry-soft-note">No dates yet? Leave these blank and we’ll talk it through.</p>
            </>}

            {step === 3 && <>
              <div className="enquiry-field enquiry-name-field"><label htmlFor="enquiry-name">Your name <span aria-hidden="true">*</span></label><input id="enquiry-name" name="name" autoComplete="name" maxLength={100} required value={details.name} onChange={handleChange} placeholder="What should we call you?" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'enquiry-name-error' : undefined} /><FieldError name="name" errors={errors} /></div>
              <div className="enquiry-optional"><button type="button" aria-expanded={contactOpen} aria-controls="enquiry-extra-contact" onClick={() => setContactOpen(open => !open)}><span>Add another way to reach you <small>Optional</small></span><span aria-hidden="true">{contactOpen ? '−' : '+'}</span></button><div id="enquiry-extra-contact" hidden={!contactOpen}><div className="enquiry-row"><div className="enquiry-field"><label htmlFor="enquiry-email">Email address</label><input id="enquiry-email" name="email" type="email" autoComplete="email" maxLength={254} value={details.email} onChange={handleChange} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'enquiry-email-error' : undefined} /><FieldError name="email" errors={errors} /></div><div className="enquiry-field"><label htmlFor="enquiry-phone">Phone number</label><input id="enquiry-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} value={details.phone} onChange={handleChange} placeholder="Your contact number" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'enquiry-phone-error' : undefined} /><FieldError name="phone" errors={errors} /></div></div></div></div>
              <details className="enquiry-review"><summary>Read your full message <span aria-hidden="true">+</span></summary><div className="enquiry-review-content"><pre>{enquiry.body}</pre></div></details>
              <div className="enquiry-delivery-note"><span aria-hidden="true">↗</span><div><strong>Next stop: the NordWood team</strong><p>We’ll prepare your note. Open WhatsApp, review it and tap Send to start the conversation.</p></div></div>
            </>}
            <div className="enquiry-actions">{step > 0 ? <button type="button" className="enquiry-back" onClick={() => changeStep(step - 1)}>← Back</button> : <span className="enquiry-step-note">Make it yours.</span>}<button type="submit" className="enquiry-primary">{['Tell us your idea', 'Add place & timing', 'Introduce yourself', 'Bring my message together'][step]}<Arrow /></button></div>
            <p className="enquiry-step-note enquiry-bottom-note">{step === 3 ? 'Your message goes to WhatsApp only when you choose to open it.' : `0${step + 1} of 04 · You can revisit any completed step.`}</p>
          </div>}
          {handoff && <ContactHandoff enquiry={handoff} preparing={isPreparing} onReady={finishPreparing} onEdit={() => changeStep(3)} onOpen={() => setStatus({ kind: 'whatsapp', text: 'Review your message in WhatsApp and tap Send. Your details are still here.' })} />}
          {step === 3 && !isPreparing && <><div className="enquiry-alternatives"><button type="button" onClick={copyEnquiry}>Copy enquiry</button><button type="button" onClick={openEmailDraft}>Use my email app</button></div><p className="enquiry-privacy">Share only the details you’d like us to use to discuss your project.</p></>}
          <div className={`enquiry-status${['preparing', 'ready'].includes(status.kind) ? ' enquiry-sr-only' : ''}`} role="status" aria-live="polite" aria-atomic="true">{status.text && <p>{status.text}</p>}{status.kind === 'whatsapp' && <a className="enquiry-whatsapp-retry" href={enquiry.whatsapp} target="_blank" rel="noopener noreferrer">Open WhatsApp again <Arrow /></a>}</div>
          {showManualCopy && step === 3 && <div className="enquiry-field enquiry-manual-copy"><label htmlFor="enquiry-copy-text">Copy your enquiry</label><textarea ref={copyRef} id="enquiry-copy-text" rows={10} readOnly value={enquiry.copyText} onFocus={event => event.target.select()} /><p className="enquiry-copy-hint">Select this text and use your device’s Copy command.</p></div>}
        </form>
        <ContactProjectNote category={selectedCategory} details={details} step={step} />
      </div>
    </div>
  );
}
