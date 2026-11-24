// In-memory demo data. The clock is frozen so every run sees the same hours-until-check-in.
import { refundFor } from './policy.js';

const HOUR_MS = 60 * 60 * 1000;

export const NOW = new Date(process.env.DEMO_NOW ?? '2026-12-10T12:00:00Z');

export const GUEST = 'Sam Rivera';

// Check-in offsets bracket both refund cutoffs: 24 h (spec v1) and 48 h (spec v2).
const SEED = [
  { id: 1, room: 'Sea view double', hoursAhead: 72, price: 240 },
  { id: 2, room: 'Garden single', hoursAhead: 36, price: 95 },
  { id: 3, room: 'Family suite', hoursAhead: 12, price: 310 },
  { id: 4, room: 'Rooftop studio', hoursAhead: 48, price: 180 },
  { id: 5, room: 'Harbour twin', hoursAhead: 23, price: 150 },
  { id: 6, room: 'Courtyard double', hoursAhead: 24, price: 165 },
  { id: 7, room: 'Loft king', hoursAhead: 25, price: 205 },
  { id: 8, room: 'Lakeside cabin', hoursAhead: 47, price: 130 },
  { id: 9, room: 'Penthouse suite', hoursAhead: 49, price: 420 },
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
  return [...bookings].sort((a, b) => a.checkIn - b.checkIn);
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
