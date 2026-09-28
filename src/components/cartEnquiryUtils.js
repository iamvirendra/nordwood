import { WHATSAPP_URL } from './contactEnquiryUtils.js';

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const categoryLabels = { Door: 'Door', Window: 'Window', DoorFrame: 'Door frame', WindowFrame: 'Window frame' };

// App.jsx supplies canonical catalogue records and validated whole quantities.
// Reject malformed money instead of creating a seemingly valid zero-price quote.
export function formatCartPrice(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
    throw new RangeError('Cart prices must be finite, non-negative numbers.');
  }
  return priceFormatter.format(amount);
}

function getSize(item) {
  if (item.height && item.width) return `${item.height} × ${item.width} (height × width)`;
  if (item.heightFeet && item.widthFeet) return `${item.heightFeet} ft × ${item.widthFeet} ft (height × width)`;
  return item.size || 'To be confirmed';
}

export function createCartEnquiry(cartItems) {
  if (!Array.isArray(cartItems)) throw new TypeError('A cart enquiry requires an array of cart items.');
  if (!cartItems.length) return null;

  let subtotalPaise = 0;
  let itemCount = 0;
  let hasDoubleDoors = false;
  const lines = cartItems.map((item, index) => {
    if (!item || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new RangeError('Every selected variant needs a positive whole quantity.');
    }
    // Validate before arithmetic; preserve paise without floating-point drift.
    formatCartPrice(item.price);
    const unitPaise = Math.round(item.price * 100);
    const linePaise = unitPaise * item.quantity;
    subtotalPaise += linePaise;
    itemCount += item.quantity;
    const isDoubleDoor = item.doorType === 'Double Door';
    hasDoubleDoors ||= isDoubleDoor;
    const unitLabel = isDoubleDoor ? 'double-door set' : 'item';
    return [
      `${index + 1}. ${item.name}`,
      `Variant ID: ${item.id}`,
      `Category: ${categoryLabels[item.category] || item.category || 'To be confirmed'}`,
      `Material: ${item.woodType || item.material || 'To be confirmed'}`,
      `Size: ${getSize(item)}`,
      ...(item.doorType ? [`Door style: ${item.doorType}`] : []),
      ...(item.frameType ? [`Frame type: ${item.frameType}`] : []),
      ...(item.windowType ? [`Window type: ${item.windowType}`] : []),
      ...(item.rebateType ? [`Rebate: ${item.rebateType}`] : []),
      ...(item.woodCFT != null ? [`Wood volume: ${item.woodCFT} CFT per ${unitLabel}`] : []),
      `Quantity: ${item.quantity} ${unitLabel}${item.quantity === 1 ? '' : 's'}`,
      `Unit price: ${formatCartPrice(unitPaise / 100)} per ${unitLabel}`,
      `Line total: ${formatCartPrice(linePaise / 100)}`,
    ].join('\n');
  });

  const subtotal = subtotalPaise / 100;
  const lineCount = cartItems.length;
  const body = [
    'Hello NordWood,',
    '',
    'I would like to enquire about the following selection:',
    '',
    lines.join('\n\n'),
    '',
    `Selected variants: ${lineCount}`,
    `Total quantity: ${itemCount}${hasDoubleDoors ? ' (double doors counted as sets)' : ` item${itemCount === 1 ? '' : 's'}`}`,
    `Product subtotal: ${formatCartPrice(subtotal)}`,
    'GST and delivery are extra and are not included in this subtotal.',
    '',
    'Please confirm availability, the final amount including GST and delivery, and the next steps.',
    'This is an enquiry, not a confirmed order.',
  ].join('\n');

  const encodedUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(body)}`;
  // Long deep links can be truncated by browsers or installed apps. Beyond a
  // conservative 8,000-character URL, open the bare conversation and require the
  // UI to offer copying/pasting the COMPLETE message first. Never truncate items.
  const requiresCopy = encodedUrl.length > 8000;
  return {
    body,
    copyText: body,
    whatsapp: requiresCopy ? WHATSAPP_URL : encodedUrl,
    subtotal,
    itemCount,
    lineCount,
    requiresCopy,
  };
}
