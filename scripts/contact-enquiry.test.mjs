import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  WHATSAPP_URL,
  createEnquiry,
  validateEnquiry,
} from '../src/components/contactEnquiryUtils.js';

const details = {
  name: '  Asha Singh  ',
  email: 'asha@example.com',
  phone: '+91 (98765) 43210',
  city: 'Lucknow',
  timeline: 'In 1–3 months',
  message: 'We need two teak doors, 7 × 3 feet, for our home.\nPlease share options & sizes.',
};

test('project validation blocks empty, whitespace and uninformative messages without requiring personal details yet', () => {
  assert.deepEqual(validateEnquiry({ ...details, name: '', email: '' }, 1), {});
  for (const message of ['', '                ', 'hello', 'aaaaaaaaaaaaaaaaaaaa']) {
    assert.ok(validateEnquiry({ ...details, message }, 1).message);
  }
  assert.ok(validateEnquiry({ ...details, message: 'a '.repeat(1251) }, 1).message);
});

test('name is required but email and phone are optional for WhatsApp enquiries', () => {
  assert.deepEqual(validateEnquiry(details), {});
  assert.deepEqual(validateEnquiry({ ...details, email: '', phone: '' }), {});
  assert.deepEqual(validateEnquiry({ ...details, email: '  ', phone: '  ' }), {});
  assert.ok(validateEnquiry({ ...details, name: ' ' }).name);
  assert.ok(validateEnquiry({ ...details, email: 'not-an-email' }).email);
  for (const phone of ['123', 'call me tomorrow', '+9112345678901234567']) {
    assert.ok(validateEnquiry({ ...details, phone }).phone);
  }
});

test('WhatsApp opens the confirmed destination with every detail encoded in a single text parameter', () => {
  const enquiry = createEnquiry(details, 'Door');
  const url = new URL(enquiry.whatsapp);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/919451308440');
  assert.equal(WHATSAPP_URL, 'https://wa.me/919451308440');
  assert.equal(CONTACT_PHONE, '+91 94513 08440');
  assert.equal(url.searchParams.size, 1);
  assert.equal(url.searchParams.get('text'), enquiry.body);
  assert.ok(enquiry.body.includes(details.message));
  assert.ok(enquiry.body.includes('Name: Asha Singh'));
  assert.ok(enquiry.body.includes('Project city: Lucknow'));
  assert.ok(enquiry.body.includes('Interested in: Doors'));
  assert.ok(enquiry.body.includes(`Email: ${details.email}`));
  assert.ok(enquiry.body.includes(`Phone: ${details.phone}`));
});

test('email alternate preserves unicode, ampersands and newlines in the same message', () => {
  const enquiry = createEnquiry(details, 'WindowFrame');
  const url = new URL(enquiry.mailto);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, CONTACT_EMAIL);
  assert.equal(url.searchParams.get('subject'), 'NordWood project enquiry · Window frames');
  assert.equal(url.searchParams.get('body'), enquiry.body);
});

test('copy fallback contains the message body without mail headers', () => {
  const enquiry = createEnquiry(details, 'Window');
  assert.equal(enquiry.copyText, enquiry.body);
  assert.ok(enquiry.copyText.startsWith('Hello NordWood,'));
  assert.ok(!enquiry.copyText.includes('To:'));
  assert.ok(!enquiry.copyText.includes('Subject:'));
});

test('optional data is omitted cleanly and unknown categories use guidance', () => {
  const { body, whatsapp } = createEnquiry({ ...details, email: '', phone: '', city: '', timeline: '' }, 'unknown');
  assert.ok(body.includes('Interested in: Help me choose'));
  assert.ok(!body.includes('Email:'));
  assert.ok(!body.includes('Phone:'));
  assert.ok(!body.includes('Timeline:'));
  assert.ok(!body.includes('Project city:'));
  assert.equal(new URL(whatsapp).searchParams.get('text'), body);
});

test('URL-like user text stays inside the message rather than changing the WhatsApp destination', () => {
  const message = 'Project details &text=replaced #fragment ?redirect=https://example.com';
  const { whatsapp } = createEnquiry({ ...details, message }, 'DoorFrame');
  const url = new URL(whatsapp);
  assert.equal(url.pathname, '/919451308440');
  assert.equal(url.hash, '');
  assert.equal(url.searchParams.size, 1);
  assert.ok(url.searchParams.get('text').includes(message));
});
