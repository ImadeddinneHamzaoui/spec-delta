---
test: ../exact-24-hour-cancellation-credits-the-full-booking-amount_test.md
status: passed
started: 2026-11-24T23:16:21.358Z
duration_s: 146
session_id: bde13ffa-2081-488d-a065-6c10469e5549
---

# Exact 24-hour cancellation credits the full booking amount — Result

## Step 1 ✓ passed (33s)
md5: a7bcbda4486e80ba4a78c1935aa3e6c0
Open {{start_url}} in the browser and reach Stayline's My bookings page as the guest who owns active booking {{boundary_booking}}; locate this booking with check-in exactly 24 hours away, then assert its Cancel booking action is available.

## Step 2 ✓ passed (36.8s)
md5: 08168096951b1cfa9260517a361dad13
On a browser-observable Stayline surface, capture the full paid amount of booking {{boundary_booking}} before cancellation.

## Step 3 ✓ passed (23.2s)
md5: 5105bf1ab78af624dae3f9e9927f0b72
capture baseline: guest wallet balance for the guest who owns {{boundary_booking}}, obtained from a browser-observable Stayline surface before cancellation

## Step 4 ✓ passed (49.8s)
md5: 88034391b27506ab6595300a281828dd
From Stayline's My bookings page, cancel active booking {{boundary_booking}} with Cancel booking, then assert its status is Cancelled, the confirmation names {{boundary_booking}} and its cancellation outcome, and the guest wallet balance equals its captured baseline plus the captured full booking amount.
