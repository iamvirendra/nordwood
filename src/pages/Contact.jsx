import { useState } from 'react';
import './Contact.css';

const contactEmail = 'info.nordwood2026@gmail.com';
const faqs = [
  {
    question: 'How do I choose the right door size?',
    answer: 'Door dimensions are shown as height × width. Choose a standard size on the product page to see its corresponding price and wood volume. Check the required door dimensions with your carpenter before placing an order. If you are unsure, include your measurements in your enquiry.',
  },
  {
    question: 'Which wood types can I explore?',
    answer: 'Our door collection includes Plantation Teak, Forest Teak and Imported Teak, with single and double door configurations. You can compare the available standard sizes and prices in the collection, or tell us about your space for help choosing.',
  },
  {
    question: 'What does CFT mean?',
    answer: 'CFT means cubic feet, a unit of wood volume. Each standard door size lists its wood volume alongside its height and width, so you can review the specifications for the exact option you select.',
  },
  {
    question: 'Is GST included in the displayed price?',
    answer: 'GST is extra. The prices displayed for each size exclude GST. Your bag shows the product subtotal; contact us to confirm the complete amount for your order.',
  },
  {
    question: 'What should I include in my enquiry?',
    answer: 'Share the product or wood type, single or double door configuration, required height and width, quantity, and your city. You can also ask about a different size, finish, delivery or installation requirements so these details can be discussed for your project.',
  },
  {
    question: 'Are the product photos of the actual pieces?',
    answer: 'The photos currently shown are illustrative. Please ask for current product photos and discuss the design and finish with us before ordering. Natural wood grain and colour can vary.',
  },
];

function ContactArrow() {
  return <svg className="contact-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [draftOpened, setDraftOpened] = useState(false);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
    setDraftOpened(false);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const body = [
      'Hello NordWood,',
      '',
      formData.message.trim(),
      '',
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
      ...(formData.phone.trim() ? [`Phone: ${formData.phone.trim()}`] : []),
    ].join('\n');
    const emailDraft = `mailto:${contactEmail}?subject=${encodeURIComponent(`NordWood enquiry: ${formData.subject.trim()}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = emailDraft;
    setDraftOpened(true);
  };

  return (
    <div className="contact">
      <header className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-hero-topline" data-page-enter><span>Contact NordWood</span><span>Lucknow, India</span></div>
          <div className="contact-hero-content">
            <h1 data-page-enter>Good spaces begin<br />with <em>a conversation.</em></h1>
            <div className="contact-hero-aside" data-page-enter>
              <p>A door for a new home. The finishing touch for a familiar space. Tell us what you have in mind.</p>
            </div>
          </div>
          <div className="contact-hero-bottom" data-motion="rise"><span>Doors <i aria-hidden="true">/</i> Windows <i aria-hidden="true">/</i> Frames</span><span>Considered choices. Personal guidance.</span></div>
        </div>
      </header>

      <section className="contact-container" id="project-enquiry" aria-labelledby="contact-form-title">
        <div className="contact-form-section" data-motion="rise">
          <p className="contact-eyebrow">Tell us about your space</p>
          <h2 id="contact-form-title">Let’s find your fit.</h2>
          <p className="contact-form-intro">Share a few details and start a conversation with our team.</p>
          <form onSubmit={handleSubmit} className="contact-form">
            <p className="contact-required-note">Fields marked <span aria-hidden="true">*</span> are required.</p>
            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="contact-name">Your name <span aria-hidden="true">*</span></label>
                <input id="contact-name" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required maxLength={100} placeholder="Full name" />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">Email address <span aria-hidden="true">*</span></label>
                <input type="email" id="contact-email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required maxLength={254} placeholder="you@example.com" />
              </div>
            </div>
            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="contact-phone">Phone number <small>Optional</small></label>
                <input type="tel" id="contact-phone" name="phone" autoComplete="tel" value={formData.phone} onChange={handleChange} maxLength={30} placeholder="Your contact number" />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-subject">What are you planning? <span aria-hidden="true">*</span></label>
                <input id="contact-subject" name="subject" value={formData.subject} onChange={handleChange} required maxLength={150} placeholder="e.g. Doors for a new home" />
              </div>
            </div>
            <div className="contact-field">
              <label htmlFor="contact-message">Project details <span aria-hidden="true">*</span></label>
              <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} required maxLength={2500} placeholder="Tell us about the pieces you need and the space they’re for…" rows={5} aria-describedby="contact-message-hint" />
              <p className="contact-field-hint" id="contact-message-hint">Helpful details: wood type, single or double door, height × width, quantity and city.</p>
            </div>
            <div className="contact-submit-row">
              <button type="submit" className="contact-submit">Create email draft <ContactArrow /></button>
              <p>Opens your email app.<br />Review your message there and send when ready.</p>
            </div>
            <div className="contact-draft-status" role="status" aria-live="polite">
              {draftOpened && <p>Continue in your email app to review and send your enquiry. If nothing opens, email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> directly. Your details are still here.</p>}
            </div>
          </form>
        </div>

        <aside className="contact-info-section" aria-labelledby="contact-info-title" data-motion="rise">
          <div className="contact-info-heading"><p className="contact-eyebrow">A direct conversation</p><h2 id="contact-info-title">We’re here<br />to help you <em>choose.</em></h2><p>Prefer to talk it through? Reach us by phone or email, or find us in Lucknow.</p></div>
          <div className="contact-info-item"><span className="contact-info-number" aria-hidden="true">01</span><div><h3>Call us</h3><a href="tel:+919451308440">+91 94513 08440 <ContactArrow /></a><a href="tel:+916393198180">+91 63931 98180 <ContactArrow /></a></div></div>
          <div className="contact-info-item"><span className="contact-info-number" aria-hidden="true">02</span><div><h3>Write to us</h3><a className="contact-email-link" href={`mailto:${contactEmail}`}>{contactEmail} <ContactArrow /></a></div></div>
          <div className="contact-info-item"><span className="contact-info-number" aria-hidden="true">03</span><div><h3>Find us</h3><address>500/143, Kutubpur<br />Daliganj, Lucknow</address></div></div>
          <div className="contact-info-footnote"><span aria-hidden="true">N<span>W</span></span><p>Wood for the spaces<br />you call your own.</p></div>
        </aside>
      </section>

      <section className="contact-faq-section" aria-labelledby="contact-faq-title">
        <div className="contact-faq-inner">
          <div className="contact-faq-heading" data-motion="rise"><p className="contact-eyebrow">A little clarity</p><h2 id="contact-faq-title">Before<br />we begin.</h2><p>A few useful answers as you plan your space.</p></div>
          <div className="contact-faq-list" data-motion="rise">{faqs.map((faq, index) => <details className="contact-faq-item" name="contact-faq" key={faq.question}><summary><span className="contact-faq-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{faq.question}</span><span className="contact-faq-toggle" aria-hidden="true" /></summary><div className="contact-faq-answer"><p>{faq.answer}</p></div></details>)}</div>
        </div>
      </section>
    </div>
  );
}
