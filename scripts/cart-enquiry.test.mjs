import test from 'node:test';
import assert from 'node:assert/strict';
import { createCartEnquiry, formatCartPrice } from '../src/components/cartEnquiryUtils.js';
import { WHATSAPP_URL } from '../src/components/contactEnquiryUtils.js';

// These selected variants match products.js / doorPricing.js / other-products.json.
// Keep the fixtures local so this Node suite does not need Vite image/JSON imports.
const smallDoor = {
  id: 1, name: 'Plantation Teak Single Door - 7ft x 2.5ft', category: 'Door',
  woodType: 'Plantation Teak', doorType: 'Single Door', height: '7 ft', width: '2.5 ft',
  heightFeet: 7, widthFeet: 2.5, woodCFT: 3, price: 14350, quantity: 2,
};
const wideDoor = {
  ...smallDoor, id: 2, name: 'Plantation Teak Single Door - 7ft x 3ft',
  width: '3 ft', widthFeet: 3, woodCFT: 3.5, price: 15970, quantity: 1,
};
const doubleDoor = {
  ...wideDoor, id: 1020, name: 'Plantation Teak Double Door - 7ft x 3ft',
  doorType: 'Double Door', woodCFT: 3.75, price: 16395, quantity: 2,
};
const frame = {
  id: 8, name: 'Malaysian Saal Door Frame - Double Rebate - 5x2.5ft', category: 'DoorFrame',
  woodType: 'Malaysian Saal', frameType: 'Door Frame (Chaukhat)', rebateType: 'Double Rebate',
  size: '5 x 2.5 ft', price: 5200, quantity: 3,
};
const window = {
  id: 12, name: 'Plantation Teak Window - 4ft x 3ft', category: 'Window',
  woodType: 'Plantation Teak', windowType: 'Wooden Window', size: '4 x 3 ft', price: 8900, quantity: 1,
};
const frameKit = {
  id: 14, name: 'Teak Window Frame Kit - Standard', category: 'WindowFrame',
  woodType: 'Teak Wood', windowType: 'Window Frame Kit', price: 6500, quantity: 1,
};

test('multiple sizes remain distinct complete selected variants with exact quantities and totals', () => {
  const result = createCartEnquiry([smallDoor, wideDoor]);
  assert.equal(result.lineCount, 2);
  assert.equal(result.itemCount, 3);
  assert.equal(result.subtotal, 44670);
  for (const expected of [
    '1. Plantation Teak Single Door - 7ft x 2.5ft', 'Variant ID: 1',
    '2. Plantation Teak Single Door - 7ft x 3ft', 'Variant ID: 2',
    'Size: 7 ft × 2.5 ft (height × width)', 'Size: 7 ft × 3 ft (height × width)',
    'Material: Plantation Teak', 'Door style: Single Door',
    'Wood volume: 3 CFT per item', 'Wood volume: 3.5 CFT per item',
    'Quantity: 2 items', 'Quantity: 1 item',
    'Unit price: ₹14,350 per item', 'Line total: ₹28,700', 'Product subtotal: ₹44,670',
  ]) assert.ok(result.body.includes(expected), expected);
  assert.ok(result.body.includes('GST and delivery are extra'));
  assert.ok(result.body.includes('not a confirmed order'));
});

test('double-door quantities, volume and unit prices describe complete sets without doubling the price', () => {
  const result = createCartEnquiry([doubleDoor]);
  assert.equal(result.itemCount, 2);
  assert.equal(result.subtotal, 32790);
  assert.ok(result.body.includes('Quantity: 2 double-door sets'));
  assert.ok(result.body.includes('Unit price: ₹16,395 per double-door set'));
  assert.ok(result.body.includes('Wood volume: 3.75 CFT per double-door set'));
  assert.ok(result.body.includes('Total quantity: 2 (double doors counted as sets)'));
});

test('frames and windows preserve size, material and configuration, while unspecified kit sizes stay unconfirmed', () => {
  const result = createCartEnquiry([frame, window, frameKit]);
  assert.equal(result.subtotal, 31000);
  assert.equal(result.itemCount, 5);
  for (const expected of [
    'Category: Door frame', 'Material: Malaysian Saal', 'Frame type: Door Frame (Chaukhat)',
    'Rebate: Double Rebate', 'Size: 5 x 2.5 ft', 'Size: 4 x 3 ft', 'Window type: Wooden Window',
    'Category: Window frame', 'Window type: Window Frame Kit', 'Size: To be confirmed',
  ]) assert.ok(result.body.includes(expected), expected);
  assert.ok(!result.body.includes('undefined'));
  assert.ok(!result.body.includes('null'));
  assert.ok(!result.body.includes('Wood volume:'));
});

test('Unicode and URL-like product content remain message text at the confirmed WhatsApp destination', () => {
  const item = { ...smallDoor, name: 'दरवाज़ा & window #1?text=change / café', woodType: 'Teak & Sal' };
  const result = createCartEnquiry([item]);
  const url = new URL(result.whatsapp);
  assert.equal(url.origin + url.pathname, WHATSAPP_URL);
  assert.equal(url.hash, '');
  assert.equal(url.searchParams.size, 1);
  assert.equal(url.searchParams.get('text'), result.body);
  assert.ok(result.body.includes(item.name));
  assert.ok(result.body.includes(item.woodType));
  assert.equal(result.requiresCopy, false);
  assert.equal(result.whatsapp, `${WHATSAPP_URL}?text=${encodeURIComponent(result.body)}`);
});

test('long bags use the bare chat link while preserving every item and the complete total for copying', () => {
  const items = Array.from({ length: 40 }, (_, index) => ({
    ...smallDoor, id: 2000 + index, name: `Selected woodwork variant ${index + 1} · ${smallDoor.name}`, quantity: 1,
  }));
  const result = createCartEnquiry(items);
  assert.equal(result.requiresCopy, true);
  assert.equal(result.whatsapp, WHATSAPP_URL);
  assert.equal(result.copyText, result.body);
  assert.equal(result.lineCount, 40);
  assert.equal(result.itemCount, 40);
  assert.equal(result.subtotal, 574000);
  assert.ok(`${WHATSAPP_URL}?text=${encodeURIComponent(result.body)}`.length > 8000);
  for (const item of items) {
    assert.ok(result.copyText.includes(item.name));
    assert.ok(result.copyText.includes(`Variant ID: ${item.id}`));
  }
  assert.ok(result.copyText.includes('Product subtotal: ₹5,74,000'));
});

test('the long-message policy activates only above 8000 encoded URL characters', () => {
  const base = createCartEnquiry([{ ...frameKit, name: '' }]);
  const baseLength = `${WHATSAPP_URL}?text=${encodeURIComponent(base.body)}`.length;
  const nameAtLimit = 'a'.repeat(8000 - baseLength);
  const atLimit = createCartEnquiry([{ ...frameKit, name: nameAtLimit }]);
  assert.equal(atLimit.whatsapp.length, 8000);
  assert.equal(atLimit.requiresCopy, false);
  const aboveLimit = createCartEnquiry([{ ...frameKit, name: `${nameAtLimit}a` }]);
  assert.equal(aboveLimit.requiresCopy, true);
  assert.equal(aboveLimit.whatsapp, WHATSAPP_URL);
  assert.ok(aboveLimit.body.includes(`${nameAtLimit}a`));
});

test('price formatting uses INR grouping and subtotal arithmetic preserves paise', () => {
  assert.equal(formatCartPrice(123456.5), '₹1,23,456.5');
  assert.equal(formatCartPrice(0), '₹0');
  const result = createCartEnquiry([{ ...frameKit, price: 0.1, quantity: 3 }, { ...window, price: 0.2, quantity: 2 }]);
  assert.equal(result.subtotal, 0.7);
  assert.ok(result.body.includes('Product subtotal: ₹0.7'));
});

test('empty carts produce no handoff and malformed numeric values cannot produce a misleading enquiry', () => {
  assert.equal(createCartEnquiry([]), null);
  assert.throws(() => createCartEnquiry([{ ...smallDoor, quantity: 0 }]), RangeError);
  assert.throws(() => createCartEnquiry([{ ...smallDoor, quantity: 1.5 }]), RangeError);
  assert.throws(() => createCartEnquiry([{ ...smallDoor, price: NaN }]), RangeError);
  assert.throws(() => formatCartPrice(Infinity), RangeError);
});
