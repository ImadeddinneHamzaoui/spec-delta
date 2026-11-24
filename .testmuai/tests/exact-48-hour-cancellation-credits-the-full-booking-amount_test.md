---
assurance:
  id: t-5
  base: sha256:0cc3abfc967293f61f33dd61b0beefd8674d73b61237ac740268d9971e82c3b7
---
# Exact 48-hour cancellation credits the full booking amount

> An active booking cancelled at the inclusive 48-hour threshold receives a full wallet refund.

## Step 1 @verifies ac-1

Open {{start_url}} in the browser and reach Stayline's My bookings page as the guest who owns active booking {{boundary_booking}}; locate this booking with check-in exactly 48 hours away, then assert its Cancel booking action is available.

## Step 2

On a browser-observable Stayline surface, capture the full paid amount of booking {{boundary_booking}} before cancellation.

## Step 3

capture baseline: guest wallet balance for the guest who owns {{boundary_booking}}, obtained from a browser-observable Stayline surface before cancellation

## Step 4 @verifies ac-2, ac-3, ac-4, ac-10

From Stayline's My bookings page, cancel active booking {{boundary_booking}} with Cancel booking, then assert its status is Cancelled, the confirmation names {{boundary_booking}} and its cancellation outcome, and the guest wallet balance equals its captured baseline plus the captured full booking amount.
