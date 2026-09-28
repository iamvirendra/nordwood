import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ContactEnquiry from '../components/ContactEnquiry.jsx';
import ContactWoodScene from '../components/ContactWoodScene.jsx';
import { CONTACT_EMAIL, WHATSAPP_URL } from '../components/contactEnquiryUtils.js';
import suppliedImages from '../data/suppliedImages.json';
import { brandLogo } from '../data/brand';
import { useMotion } from '../motion/MotionContext';
import './Contact.css';

const whatsappUrl = `${WHATSAPP_URL}?text=${encodeURIComponent('Hello NordWood, I’d like to discuss woodwork for my space.')}`;
const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('500/143, Kutubpur, Daliganj, Lucknow, India')}`;
const work = [
  { label: 'Doors', category: 'Door', image: suppliedImages.singleDoors[1], title: 'A welcome with character.', description: 'From quiet panels to expressive carving, find a door that feels like you.', note: 'Single-door design reference', link: '/shop?category=Door' },
  { label: 'Windows', category: 'Window', image: suppliedImages.windows[1], title: 'Make room for the light.', description: 'Warm timber, considered proportions, and a new perspective on your space.', note: 'Window design reference', link: '/shop?category=Window' },
  { label: 'Timber', category: '', image: suppliedImages.materials['Plantation Teak'][0], title: 'It begins with the grain.', description: 'Explore natural timber and talk through the material that suits your plans.', note: 'Plantation Teak · material reference', link: '/#wood-types' },
];
const faqs = [
  { question: 'I’m just getting started. Can you help?', answer: 'Of course. Choose “Help me choose” in the enquiry form and tell us a little about your space. A rough idea, your city and the pieces you need are enough to begin the conversation.' },
  { question: 'What measurements should I share?', answer: 'Share the required height × width, quantity, and whether you need a single or double door. Mention the units you are using. Check final measurements with your carpenter before ordering; you can still enquire if you do not have them yet.' },
  { question: 'Which woods can I choose from?', answer: 'Our door collection includes Plantation Teak, Forest Teak and Imported Teak. Frame options also include Malaysian Saal, Kapoor Sal and Desi Sal. Availability depends on the product, so share the piece you have in mind and we can discuss the options.' },
  { question: 'Can we discuss delivery and installation?', answer: 'Yes. Include your city and any delivery or installation requirements in your enquiry. These details, availability and any charges need to be confirmed for your project before you order.' },
  { question: 'Do the listed prices include GST?', answer: 'The displayed product prices exclude GST. Size and wood choice affect the price. Contact us to confirm your complete order amount, including applicable tax and delivery.' },
  { question: 'Will my woodwork look exactly like the photos?', answer: 'The collection includes supplied design references, material photographs and illustrative images. These help you explore the possibilities; natural wood grain and colour vary. Ask us for current photos and confirm the design, material and finish before ordering.' },
];

function Arrow({ diagonal = false }) {
  return <svg className="contact-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ContactIcon({ type }) {
  const paths = {
    chat: <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 10 10 0 0 1-4-.9L3 21l1.8-5.2A8.5 8.5 0 1 1 21 11.5Z" />,
    phone: <path d="m7 3 3 5-2 2c1 3 3 5 6 6l2-2 5 3-1 4C10 22 2 14 3 4l4-1Z" />,
    email: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

export default function Contact() {
  const { enabled } = useMotion();
  const location = useLocation();
  const [activeWork, setActiveWork] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const category = new URLSearchParams(location.search).get('category');
    return ['Door', 'Window', 'DoorFrame', 'WindowFrame'].includes(category) ? category : '';
  });
  const [openFaq, setOpenFaq] = useState(null);
  const formTitle = useRef(null);
  const piece = work[activeWork];

  useEffect(() => {
    if (location.hash !== '#project-enquiry') return;
    const frame = window.requestAnimationFrame(() => document.getElementById('project-enquiry')?.scrollIntoView({ behavior: 'instant' }));
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

  const startProject = category => {
    if (category !== undefined) setSelectedCategory(category);
    formTitle.current?.focus({ preventScroll: true });
    document.getElementById('project-enquiry')?.scrollIntoView({ behavior: enabled ? 'smooth' : 'instant', block: 'start' });
  };

  return (
    <div className="contact">
      <header className="contact-hero">
        <div className="contact-hero-topline" data-page-enter><span>Contact NordWood</span><span>Your direct connection to our team.</span></div>
        <div className="contact-hero-grid">
          <div className="contact-hero-copy">
            <p className="contact-eyebrow" data-page-enter><span className="contact-small-rule" /> Let’s make something personal.</p>
            <h1 data-page-enter>Connect with<br /><em>the NordWood<br />team.</em></h1>
            <p className="contact-hero-intro" data-page-enter>Have a question, a design in mind, or a home taking shape? Talk directly with our team about wood, sizes, pricing and the details that matter to you.</p>
            <div className="contact-hero-actions" data-page-enter><a className="contact-button contact-button--chat" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><ContactIcon type="chat" />Chat with our team<Arrow diagonal /></a><a className="contact-text-link" href="tel:+919451308440"><ContactIcon type="phone" />Call the team</a></div>
            <p className="contact-hero-channel-note" data-page-enter>Connect on WhatsApp · +91 94513 08440</p>
            <button type="button" className="contact-project-link" onClick={() => startProject()}>Have a project in mind? Share the details <Arrow /></button>
            <div className="contact-team-card" data-page-enter><span className="contact-team-monogram" aria-hidden="true"><img src={brandLogo.src} width={brandLogo.width} height={brandLogo.height} alt="" decoding="async" /></span><div><strong>The people behind your woodwork.</strong><p>Design guidance. Product questions. A conversation about your space.</p></div></div>
          </div>
          <div className="contact-work" data-page-enter>
            <div className="contact-work-tabs" role="group" aria-label="Explore our woodwork">
              {work.map((item, index) => <button type="button" key={item.label} aria-pressed={index === activeWork} aria-controls="contact-work-preview" onClick={() => setActiveWork(index)}><span>0{index + 1}</span>{item.label}</button>)}
            </div>
            <ContactWoodScene key={piece.label} image={piece.image} variant={piece.label.toLowerCase()} onEnquire={() => startProject(piece.category)} />
            <div className="contact-work-caption" aria-live="polite" aria-atomic="true"><div key={piece.label}><p>{piece.note}</p><h2>{piece.title}</h2><span>{piece.description}</span></div><Link to={piece.link} aria-label={`Explore ${piece.label.toLowerCase()}`}><Arrow diagonal /></Link></div>
          </div>
        </div>
        <nav className="contact-connect-options" aria-label="Ways to connect with the NordWood team">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><span className="contact-channel-icon"><ContactIcon type="chat" /></span><div><strong>Start a WhatsApp chat</strong><span>Ask a question. Share an idea.</span></div><Arrow diagonal /></a>
          <a href="tel:+919451308440"><span className="contact-channel-icon"><ContactIcon type="phone" /></span><div><strong>Talk it through with us</strong><span>Call +91 94513 08440</span></div><Arrow diagonal /></a>
          <button type="button" onClick={() => startProject()}><span className="contact-channel-icon"><ContactIcon type="email" /></span><div><strong>Tell us about your project</strong><span>Prepare a message for our team.</span></div><Arrow diagonal /></button>
        </nav>
      </header>

      <section className="contact-container" id="project-enquiry" aria-labelledby="contact-form-title">
        <div className="contact-form-section" data-motion="rise">
          <p className="contact-eyebrow">01 / A conversation, made for you</p>
          <h2 ref={formTitle} tabIndex={-1} id="contact-form-title">Your project.<br /><em>Let’s give it a beginning.</em></h2>
          <p className="contact-form-intro">A few thoughtful questions. A note that takes shape as you go. Bring your idea to the NordWood team, in your own way.</p>
          <ContactEnquiry selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>
        <aside className="contact-aside" aria-labelledby="contact-info-title" data-motion="rise">
          <div className="contact-info-section">
            <p className="contact-eyebrow">Meet us in the conversation</p><h2 id="contact-info-title">Speak with <br /><em>NordWood.</em></h2><p className="contact-info-intro">From choosing your first door to working through an entire home, bring your questions to the team.</p>
            <div className="contact-info-item contact-info-item--whatsapp"><ContactIcon type="chat" /><div><h3>Message our team on WhatsApp</h3><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <Arrow diagonal /></a><p className="contact-visit-note">+91 94513 08440</p></div></div>
            <div className="contact-info-item"><ContactIcon type="phone" /><div><h3>Call us</h3><a href="tel:+919451308440">+91 94513 08440 <Arrow diagonal /></a><a href="tel:+916393198180">+91 63931 98180 <Arrow diagonal /></a></div></div>
            <div className="contact-info-item"><ContactIcon type="email" /><div><h3>Write to us</h3><a className="contact-email-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}<Arrow diagonal /></a></div></div>
            <div className="contact-info-item"><ContactIcon type="pin" /><div><h3>Find us in Lucknow</h3><address>500/143, Kutubpur<br />Daliganj, Lucknow, India</address><a className="contact-directions" href={directionsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps <Arrow diagonal /></a><p className="contact-visit-note">Call ahead to plan your visit.</p></div></div>
          </div>
          <div className="contact-next"><p className="contact-eyebrow">From your idea to our conversation</p><ol><li><span>01</span><div><h3>Make it personal</h3><p>Tell us what you need, or start with a question.</p></div></li><li><span>02</span><div><h3>Connect on WhatsApp</h3><p>Review your prepared message, then tap Send in our chat.</p></div></li><li><span>03</span><div><h3>Plan with our team</h3><p>Discuss the design, material, availability and complete price together.</p></div></li></ol></div>
        </aside>
      </section>

      <section className="contact-material" aria-labelledby="contact-material-title" data-motion="rise">
        <div className="contact-material-image"><img src={suppliedImages.materials['Plantation Teak'][0].src} alt="Natural grain in a Plantation Teak timber board" width="1536" height="1024" loading="lazy" /><span>Plantation Teak / A closer look</span></div>
        <div className="contact-material-copy"><p className="contact-eyebrow">No two grains. No two homes.</p><h2 id="contact-material-title">The details make<br /><em>it feel like yours.</em></h2><p>Drawn to a particular grain? Have a sketch you keep coming back to? Bring your ideas to the conversation. The right woodwork starts with understanding your space.</p><Link to="/shop" className="contact-text-link">Find a little inspiration <Arrow diagonal /></Link></div>
      </section>

      <section className="contact-faq-section" aria-labelledby="contact-faq-title">
        <div className="contact-faq-heading" data-motion="rise"><p className="contact-eyebrow">02 / A little clarity</p><h2 id="contact-faq-title">Good questions.<br /><em>A place to begin.</em></h2><p>You don’t need to have it all figured out. Here are a few things that might help.</p><button type="button" className="contact-text-link" onClick={() => startProject()}>Ask our team <Arrow diagonal /></button></div>
        <div className="contact-faq-list" data-motion="rise">{faqs.map((faq, index) => <div className={`contact-faq-item ${openFaq === index ? 'is-open' : ''}`} key={faq.question}><h3><button id={`contact-question-${index}`} aria-expanded={openFaq === index} aria-controls={`contact-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)} type="button"><span className="contact-faq-number" aria-hidden="true">0{index + 1}</span><span>{faq.question}</span><span className="contact-faq-toggle" aria-hidden="true" /></button></h3><div className="contact-faq-answer" id={`contact-answer-${index}`} role="region" aria-labelledby={`contact-question-${index}`} aria-hidden={openFaq !== index} inert={openFaq !== index}><div><p>{faq.answer}</p></div></div></div>)}</div>
      </section>
      <div className="contact-closing"><p>Your next idea deserves a conversation.<br /><em>Our team is a message away.</em></p><button type="button" className="contact-button" onClick={() => startProject()}>Prepare a message <Arrow diagonal /></button></div>
    </div>
  );
}
