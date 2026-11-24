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

## Cancel booking #1
In the row for booking #1 (Sea view double, check-in in 72 h, 240 €), click "Cancel booking".

## Check the refund
Verify the confirmation message says booking #1 was cancelled and "Refunded 240 €".
Verify the wallet balance shows "240 €".
