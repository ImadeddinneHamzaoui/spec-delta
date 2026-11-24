---
test: ../late-cancellation-leaves-wallet-unchanged-at-47-hours_test.md
status: failed
started: 2026-11-24T23:27:50.633Z
duration_s: 93
session_id: 1e73bcbf-e146-4307-b77b-e382dc038ee4
---

# Late cancellation leaves wallet unchanged at 47 hours — Result

## Step 1 ✓ passed (29.2s)
md5: 674e8e5461a217bea7f3555ed5f9ec92
Open {{start_url}} in the browser and reach Stayline's My bookings page as the guest who owns active booking {{late_booking}}; locate this booking with check-in 47 hours away, then assert its Cancel booking action is available.

## Step 2 ✓ passed (30.8s)
md5: 17a636dc916222b33d7228ca59af3050
capture baseline: guest wallet balance for the guest who owns {{late_booking}}, obtained from a browser-observable Stayline surface before cancellation

## Step 3 ✗ failed (29.5s)
md5: aaa785ff3830cf070b2f71d631cb1c4e
Reason: Booking #8 was cancelled but refunded 130 €, so No refund and the required 0 € wallet balance are absent. — bug verdict: Late-booking fixture selects a refundable reservation [automation_bug/test_data_issue, confidence 0.94]
From Stayline's My bookings page, cancel active booking {{late_booking}} with Cancel booking, then assert its booking status is Cancelled, the confirmation names {{late_booking}} and its cancellation outcome, the page shows No refund, and the guest wallet balance equals the captured baseline.
