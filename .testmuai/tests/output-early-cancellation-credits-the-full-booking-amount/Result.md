---
test: ../early-cancellation-credits-the-full-booking-amount_test.md
status: passed
started: 2026-11-24T23:13:27.775Z
duration_s: 159
session_id: 77c31820-9073-44b2-bd9f-a13fbbb9330e
---

# Early cancellation credits the full booking amount — Result

## Step 1 ✓ passed (32.6s)
md5: 2d3ce7a752964992543beed5d6eb0cf9
Open {{start_url}} in the browser and reach Stayline's My bookings page as the guest who owns active booking {{early_booking}}; locate this booking with check-in 25 hours away, then assert its Cancel booking action is available.

## Step 2 ✓ passed (32.1s)
md5: e088357a63749fca7be397fc84dc8562
On a browser-observable Stayline surface, capture the full paid amount of booking {{early_booking}} before cancellation.

## Step 3 ✓ passed (36.4s)
md5: 9874a41402512ee224663521157bcb45
capture baseline: guest wallet balance for the guest who owns {{early_booking}}, obtained from a browser-observable Stayline surface before cancellation

## Step 4 ✓ passed (54.5s)
md5: f5556c0201f9813a24c791f90668a736
From Stayline's My bookings page, cancel active booking {{early_booking}} with Cancel booking, then assert its status is Cancelled, the confirmation names {{early_booking}} and its cancellation outcome, and the guest wallet balance equals its captured baseline plus the captured full booking amount.
