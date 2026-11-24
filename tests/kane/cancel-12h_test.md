---
mode: testing
url: http://localhost:3000/reset
tags: [refunds, spec-v1]
max_steps: 20
---

# Cancelling 12 hours before check-in is not refunded

## Start from fresh demo data
Open http://localhost:3000/reset and wait for the "Stayline · My bookings" page.
Verify the wallet balance shows "0 €".

## Cancel booking #3
In the row for booking #3 (Family suite, check-in in 12 h, 310 €), click "Cancel booking".

## Check there is no refund
Verify the confirmation message says booking #3 was cancelled and "No refund".
Verify the wallet balance still shows "0 €".
