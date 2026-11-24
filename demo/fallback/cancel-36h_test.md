---
mode: testing
url: http://localhost:3000/reset
tags: [refunds, spec-v2]
max_steps: 20
---

# Cancelling 36 hours before check-in is not refunded (spec v2: 48 h cutoff)

## Start from fresh demo data
Open http://localhost:3000/reset and wait for the "Stayline · My bookings" page.
Verify the wallet balance shows "0 €".

## Cancel Bilal's booking
In the row for guest Bilal (check-in in 36 h), click "Cancel booking".

## Check there is no refund
Verify the confirmation message says booking #2 for Bilal was cancelled and "No refund".
Verify the wallet balance still shows "0 €".
