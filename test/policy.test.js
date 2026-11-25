import { test } from 'node:test';
import assert from 'node:assert/strict';
import { refundFor } from '../src/policy.js';

const NOW = new Date('2026-12-10T12:00:00Z');
const booking = (hoursAhead) => ({ price: 120, checkIn: new Date(NOW.getTime() + hoursAhead * 3600_000) });

test('72 h before check-in is refunded in full', () => {
  assert.equal(refundFor(booking(72), NOW), 120);
});

test('12 h before check-in is not refunded', () => {
  assert.equal(refundFor(booking(12), NOW), 0);
});

test('exactly 48 h before check-in is refunded in full', () => {
  assert.equal(refundFor(booking(48), NOW), 120);
});

test('47 h before check-in is not refunded', () => {
  assert.equal(refundFor(booking(47), NOW), 0);
});
