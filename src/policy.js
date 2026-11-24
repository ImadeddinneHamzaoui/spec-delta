// Refund policy for cancellations. SPEC.md is the source of truth for this rule.
export const REFUND_CUTOFF_HOURS = 24;

const HOUR_MS = 60 * 60 * 1000;

export function hoursUntil(checkIn, now) {
  return (checkIn.getTime() - now.getTime()) / HOUR_MS;
}

export function refundFor(booking, now) {
  const refundable = hoursUntil(booking.checkIn, now) >= REFUND_CUTOFF_HOURS;
  return refundable ? booking.price : 0;
}
