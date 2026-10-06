import { products } from '../src/data/products.js';
import { ApiError, tokenHash } from './security.js';

const catalog = new Map(products.map(product => [product.id, product]));
export const statuses = ['pending', 'confirmed', 'in_production', 'ready', 'completed', 'cancelled'];

export function textField(value, label, min, max, multiline = false) {
  // Reject hidden control characters; notes intentionally permit ordinary line breaks.
  // eslint-disable-next-line no-control-regex
  const controls = multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u : /[\u0000-\u001f\u007f]/u;
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max || controls.test(value)) {
    throw new ApiError(422, `${label} must contain ${min}–${max} characters.`);
  }
  return value.trim();
}

export function emailField(value) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(email)) throw new ApiError(422, 'Enter a valid email address.', { email: 'Enter a valid email address.' });
  return email;
}

export function passwordField(value) {
  if (typeof value !== 'string' || value.length < 8 || value.length > 128) throw new ApiError(422, 'Use a password with 8–128 characters.', { password: 'Use at least 8 characters.' });
  return value;
}

export function numericId(value) {
  if (!/^[1-9]\d{0,9}$/.test(String(value)) || Number(value) > 4294967295) throw new ApiError(404, 'Order not found.');
  return Number(value);
}

export function validateOrder(body) {
  if (!body || !Array.isArray(body.items) || !body.items.length || body.items.length > 50) throw new ApiError(422, 'Add between 1 and 50 products to your order.');
  if (typeof body.requestId !== 'string' || !/^[a-f\d]{8}-[a-f\d]{4}-[1-8][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(body.requestId)) throw new ApiError(422, 'The order request is invalid. Refresh and try again.');
  const quantities = new Map();
  for (const item of body.items) {
    if (!item || !Number.isSafeInteger(item.productId) || !catalog.has(item.productId)) throw new ApiError(422, 'One of your products is no longer available.');
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) throw new ApiError(422, 'Product quantities must be between 1 and 100.');
    const quantity = (quantities.get(item.productId) || 0) + item.quantity;
    if (quantity > 100) throw new ApiError(422, 'You can order up to 100 of each product.');
    quantities.set(item.productId, quantity);
  }
  const items = [...quantities].sort(([left], [right]) => left - right).map(([productId, quantity]) => {
    const product = catalog.get(productId);
    return { productId, name: product.name, woodType: product.woodType, size: product.size || `${product.height} × ${product.width}`, image: product.image, quantity, unitPrice: product.price, lineTotal: Math.round(product.price * 100) * quantity / 100 };
  });
  const input = body.shipping || {};
  const shipping = {
    name: textField(input.name, 'Recipient name', 2, 100),
    phone: textField(input.phone, 'Phone number', 7, 25),
    address: textField(input.address, 'Delivery address', 5, 500),
    city: textField(input.city, 'City', 2, 100),
    postalCode: textField(input.postalCode, 'Postal code', 3, 20),
  };
  if (!/^[+()\d\s-]+$/.test(shipping.phone) || shipping.phone.replace(/\D/g, '').length < 7) throw new ApiError(422, 'Enter a valid phone number.');
  if (!/^[a-z\d\s-]+$/i.test(shipping.postalCode)) throw new ApiError(422, 'Enter a valid postal code.');
  const notes = body.notes == null || body.notes === '' ? '' : textField(body.notes, 'Order notes', 0, 2000, true);
  const subtotal = items.reduce((sum, item) => sum + Math.round(item.lineTotal * 100), 0) / 100;
  if (subtotal > 9999999999.99) throw new ApiError(422, 'Please contact NordWood to place an order this large.');
  const requestHash = tokenHash(JSON.stringify({ items: items.map(({ productId, quantity }) => ({ productId, quantity })), shipping, notes }));
  return { items, shipping, notes, subtotal, requestId: body.requestId.toLowerCase(), requestHash };
}
