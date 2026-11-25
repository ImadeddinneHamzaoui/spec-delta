---
test: ../late-cancellation-leaves-wallet-unchanged-at-47-hours_test.md
status: passed
started: 2026-11-24T23:57:15.135Z
duration_s: 85
session_id: e03b5c70-c96d-4070-bc23-05316e448640
---

# Late cancellation leaves wallet unchanged at 47 hours — Result

## Step 1 ✓ passed (0.79s)
md5: 674e8e5461a217bea7f3555ed5f9ec92
Open {{start_url}} in the browser and reach Stayline's My bookings page as the guest who owns active booking {{late_booking}}; locate this booking with check-in 47 hours away, then assert its Cancel booking action is available.

## Step 2 ✓ passed (19.82s)
md5: 17a636dc916222b33d7228ca59af3050
capture baseline: guest wallet balance for the guest who owns {{late_booking}}, obtained from a browser-observable Stayline surface before cancellation

## Step 3 ✓ passed (59.5s)
md5: aaa785ff3830cf070b2f71d631cb1c4e
From Stayline's My bookings page, cancel active booking {{late_booking}} with Cancel booking, then assert its booking status is Cancelled, the confirmation names {{late_booking}} and its cancellation outcome, the page shows No refund, and the guest wallet balance equals the captured baseline.
