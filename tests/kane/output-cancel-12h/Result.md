---
test: ../cancel-12h_test.md
status: passed
started: 2026-11-24T23:21:22.830Z
duration_s: 85
session_id: fd35659c-8b28-4e3c-8954-48224a002760
---

# Cancelling 12 hours before check-in is not refunded — Result

## Start from fresh demo data ✓ passed (22.47s)
md5: f2fd2770589dbd38f104932ed57c9978
Open http://localhost:3000/reset and wait for the "Stayline · My bookings" page.
Verify the wallet balance shows "0 €".

## Cancel booking #3 ✓ passed (12.3s)
md5: 50653745e2265770314620d4ff8675b2
In the row for booking #3 (Family suite, check-in in 12 h, 310 €), click "Cancel booking".

## Check there is no refund ✓ passed (45.8s)
md5: 39c827007c7f9d9e90892715a8374422
Verify the confirmation message says booking #3 was cancelled and "No refund".
Verify the wallet balance still shows "0 €".
