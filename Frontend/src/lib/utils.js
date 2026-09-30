export function formatPrice(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(isoDate) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(isoDate)
  );
}

export function formatAltitude(meters) {
  return `${meters.toLocaleString('en-US')} m`;
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
