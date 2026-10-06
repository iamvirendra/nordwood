export const ORDER_STATUSES = [
  { value: 'pending', label: 'Awaiting confirmation' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_production', label: 'In production' },
  { value: 'ready', label: 'Ready for delivery' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_production', 'cancelled'],
  in_production: ['ready', 'cancelled'],
  ready: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatOrderPrice = value => currency.format(Number(value || 0));
export const formatOrderDate = value => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : dateFormat.format(date);
};
