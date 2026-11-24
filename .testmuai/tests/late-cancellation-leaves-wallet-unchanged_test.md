---
assurance:
  id: t-1
  base: sha256:b62273492d59e598aa1b1d478f8e067efb115db9e1d2ce248279943aea9266c0
---
# Late cancellation leaves wallet unchanged

> An active booking cancelled 23 hours before check-in shows No refund and leaves the guest wallet unchanged.

## Step 1 @verifies ac-1

Open {{start_url}} in the browser and reach Stayline's My bookings page as the guest who owns active booking {{late_booking}}; locate this booking with check-in 23 hours away, then assert its Cancel booking action is available.

## Step 2

capture baseline: guest wallet balance for the guest who owns {{late_booking}}, obtained from a browser-observable Stayline surface before cancellation

## Step 3 @verifies ac-2, ac-3, ac-4, ac-5, ac-6

From Stayline's My bookings page, cancel active booking {{late_booking}} with Cancel booking, then assert its booking status is Cancelled, the confirmation names {{late_booking}} and its cancellation outcome, the page shows No refund, and the guest wallet balance equals the captured baseline.
