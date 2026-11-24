---
test: ../late-cancellation-leaves-wallet-unchanged_test.md
status: passed
started: 2026-11-24T23:19:03.922Z
duration_s: 103
session_id: c0de8b1c-72b1-491d-9625-b01ff9d67cb6
---

# Late cancellation leaves wallet unchanged — Result

## Step 1 ✓ passed (32.1s)
md5: 0c8559614e8a9835d02501b36c3af9de
Open {{start_url}} in the browser and reach Stayline's My bookings page as the guest who owns active booking {{late_booking}}; locate this booking with check-in 23 hours away, then assert its Cancel booking action is available.

## Step 2 ✓ passed (23s)
md5: 17a636dc916222b33d7228ca59af3050
capture baseline: guest wallet balance for the guest who owns {{late_booking}}, obtained from a browser-observable Stayline surface before cancellation

## Step 3 ✓ passed (44.3s)
md5: aaa785ff3830cf070b2f71d631cb1c4e
From Stayline's My bookings page, cancel active booking {{late_booking}} with Cancel booking, then assert its booking status is Cancelled, the confirmation names {{late_booking}} and its cancellation outcome, the page shows No refund, and the guest wallet balance equals the captured baseline.
