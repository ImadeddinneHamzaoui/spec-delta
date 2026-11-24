---
assurance:
  id: t-2
  base: sha256:73eadb8c2909975124c49ee630ca8f3cc3e7c5e031b44436f686d88fa40af11c
---
# Exact 24-hour cancellation credits the full booking amount

> An active booking cancelled at the inclusive 24-hour threshold receives a full wallet refund.

## Step 1 @verifies ac-1

Open {{start_url}} in the browser and reach Stayline's My bookings page as the guest who owns active booking {{boundary_booking}}; locate this booking with check-in exactly 24 hours away, then assert its Cancel booking action is available.

## Step 2

On a browser-observable Stayline surface, capture the full paid amount of booking {{boundary_booking}} before cancellation.

## Step 3

capture baseline: guest wallet balance for the guest who owns {{boundary_booking}}, obtained from a browser-observable Stayline surface before cancellation

## Step 4 @verifies ac-2, ac-3, ac-4, ac-7

From Stayline's My bookings page, cancel active booking {{boundary_booking}} with Cancel booking, then assert its status is Cancelled, the confirmation names {{boundary_booking}} and its cancellation outcome, and the guest wallet balance equals its captured baseline plus the captured full booking amount.
