---
assurance:
  id: t-6
  base: sha256:0fe2545cbb55aeee606e5d42c561a870c249d277b63a309ef78ca59412748ed1
---
# Early cancellation credits the full booking amount after 48 hours

> An active booking cancelled 49 hours before check-in receives its full amount in the guest wallet.

## Step 1 @verifies ac-1

Open {{start_url}} in the browser and reach Stayline's My bookings page as the guest who owns active booking {{early_booking}}; locate this booking with check-in 49 hours away, then assert its Cancel booking action is available.

## Step 2

On a browser-observable Stayline surface, capture the full paid amount of booking {{early_booking}} before cancellation.

## Step 3

capture baseline: guest wallet balance for the guest who owns {{early_booking}}, obtained from a browser-observable Stayline surface before cancellation

## Step 4 @verifies ac-2, ac-3, ac-4, ac-10

From Stayline's My bookings page, cancel active booking {{early_booking}} with Cancel booking, then assert its status is Cancelled, the confirmation names {{early_booking}} and its cancellation outcome, and the guest wallet balance equals its captured baseline plus the captured full booking amount.
