// In-memory demo data. The clock is frozen so every run sees the same hours-until-check-in.
import { refundFor } from './policy.js';

const HOUR_MS = 60 * 60 * 1000;

export const NOW = new Date(process.env.DEMO_NOW ?? '2026-12-10T12:00:00Z');

const SEED = [
  { id: 1, guest: 'Amina', room: 'Sea view double', hoursAhead: 72, price: 120 },
  { id: 2, guest: 'Bilal', room: 'Garden single', hoursAhead: 36, price: 120 },
  { id: 3, guest: 'Chloé', room: 'Family suite', hoursAhead: 12, price: 120 },
  { id: 4, guest: 'Driss', room: 'Rooftop studio', hoursAhead: 48, price: 120 },
];

let bookings = [];
let wallet = 0;

export function reset() {
  bookings = SEED.map(({ hoursAhead, ...b }) => ({
    ...b,
    checkIn: new Date(NOW.getTime() + hoursAhead * HOUR_MS),
    status: 'active',
    refunded: null,
  }));
  wallet = 0;
}

export function listBookings() {
  return bookings;
}

export function walletBalance() {
  return wallet;
}

export function cancel(id) {
  const booking = bookings.find((b) => b.id === id);
  if (!booking || booking.status !== 'active') return null;
  const refund = refundFor(booking, NOW);
  booking.status = 'cancelled';
  booking.refunded = refund;
  wallet += refund;
  return booking;
}

reset();
