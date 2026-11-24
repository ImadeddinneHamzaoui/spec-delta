---
test: ../early-cancellation-credits-the-full-booking-amount-after-48_test.md
status: passed
started: 2026-11-24T23:25:12.681Z
duration_s: 144
session_id: 7c9a850a-599f-405c-b1d6-ac37d90fe35a
---

# Early cancellation credits the full booking amount after 48 hours — Result

## Step 1 ✓ passed (30.2s)
md5: e523dfbacba32e1616c33865b5fd59de
Open {{start_url}} in the browser and reach Stayline's My bookings page as the guest who owns active booking {{early_booking}}; locate this booking with check-in 49 hours away, then assert its Cancel booking action is available.

## Step 2 ✓ passed (27.1s)
md5: e088357a63749fca7be397fc84dc8562
On a browser-observable Stayline surface, capture the full paid amount of booking {{early_booking}} before cancellation.

## Step 3 ✓ passed (32.3s)
md5: 9874a41402512ee224663521157bcb45
capture baseline: guest wallet balance for the guest who owns {{early_booking}}, obtained from a browser-observable Stayline surface before cancellation

## Step 4 ✓ passed (50.2s)
md5: f5556c0201f9813a24c791f90668a736
From Stayline's My bookings page, cancel active booking {{early_booking}} with Cancel booking, then assert its status is Cancelled, the confirmation names {{early_booking}} and its cancellation outcome, and the guest wallet balance equals its captured baseline plus the captured full booking amount.
