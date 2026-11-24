---
mode: testing
url: http://localhost:3000/reset
tags: [refunds, spec-v1]
max_steps: 20
---

# Cancelling 72 hours before check-in is refunded

## Start from fresh demo data
Open http://localhost:3000/reset and wait for the "Stayline · My bookings" page.
Verify the wallet balance shows "0 €".

## Cancel Amina's booking
In the row for guest Amina (check-in in 72 h), click "Cancel booking".

## Check the refund
Verify the confirmation message says booking #1 for Amina was cancelled and "Refunded 120 €".
Verify the wallet balance shows "120 €".
