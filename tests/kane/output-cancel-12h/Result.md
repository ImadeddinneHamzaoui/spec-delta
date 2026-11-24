---
test: ../cancel-12h_test.md
status: passed
started: 2026-11-24T23:02:03.880Z
duration_s: 87
session_id: ea2d4045-8c97-4192-a621-c2882363281b
---

# Cancelling 12 hours before check-in is not refunded — Result

## Start from fresh demo data ✓ passed (32.5s)
md5: f2fd2770589dbd38f104932ed57c9978
Open http://localhost:3000/reset and wait for the "Stayline · My bookings" page.
Verify the wallet balance shows "0 €".

## Cancel Chloé's booking ✓ passed (12.1s)
md5: 046ef91bcb45448e4086f9004c501786
In the row for guest Chloé (check-in in 12 h), click "Cancel booking".

## Check there is no refund ✓ passed (38.4s)
md5: 99bcf640650929fd02467881e3d1ee1f
Verify the confirmation message says booking #3 for Chloé was cancelled and "No refund".
Verify the wallet balance still shows "0 €".
