export const CONTACT_EMAIL = 'info.nordwood2026@gmail.com';
export const CONTACT_PHONE = '+91 94513 08440';
export const WHATSAPP_URL = 'https://wa.me/919451308440';

export const ENQUIRY_CATEGORIES = [
  { value: 'Door', label: 'Doors' },
  { value: 'Window', label: 'Windows' },
  { value: 'DoorFrame', label: 'Door frames' },
  { value: 'WindowFrame', label: 'Window frames' },
  { value: '', label: 'Help me choose' },
];

export function categoryLabel(category) {
  return ENQUIRY_CATEGORIES.find(option => option.value === category)?.label || 'Help me choose';
}

export function validateEnquiry(values, step = 2) {
  const errors = {};
  const message = values.message.trim();
  if (message.length < 15 || message.split(/\s+/).length < 3) {
    errors.message = 'Tell us a little more about your project (at least 15 characters and 3 words).';
  } else if (message.length > 2500) {
    errors.message = 'Please keep your project details to 2,500 characters.';
  }
  if (step === 1) return errors;

  if (values.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  const email = values.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address, or leave this blank.';
  }
  const phone = values.phone.trim();
  const digits = phone.replace(/\D/g, '');
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15)) {
    errors.phone = 'Enter a phone number with 7–15 digits, or leave this blank.';
  }
  return errors;
}

export function createEnquiry(values, category) {
  const label = categoryLabel(category);
  const payload = {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    category: label,
    city: values.city.trim(),
    timeline: values.timeline,
    message: values.message.trim(),
    subject: `NordWood project enquiry · ${label}`,
  };
  const body = [
    'Hello NordWood,',
    '',
    payload.message,
    '',
    `Interested in: ${label}`,
    ...(payload.city ? [`Project city: ${payload.city}`] : []),
    ...(payload.timeline ? [`Timeline: ${payload.timeline}`] : []),
    '',
    `Name: ${payload.name}`,
    ...(payload.email ? [`Email: ${payload.email}`] : []),
    ...(payload.phone ? [`Phone: ${payload.phone}`] : []),
  ].join('\n');
  return {
    payload,
    body,
    copyText: body,
    whatsapp: `${WHATSAPP_URL}?text=${encodeURIComponent(body)}`,
    mailto: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`,
  };
}
