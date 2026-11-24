---
test: ../cancel-72h_test.md
status: passed
started: 2026-11-24T23:12:04.909Z
duration_s: 70
session_id: b8b7134a-c398-4125-bc08-1c812f47cdfd
---

# Cancelling 72 hours before check-in is refunded — Result

## Start from fresh demo data ✓ passed (13.31s)
md5: f2fd2770589dbd38f104932ed57c9978
Open http://localhost:3000/reset and wait for the "Stayline · My bookings" page.
Verify the wallet balance shows "0 €".

## Cancel booking #1 ✓ passed (12.8s)
md5: da83633a042e39a3a5fbf52d017f4c94
In the row for booking #1 (Sea view double, check-in in 72 h, 240 €), click "Cancel booking".

## Check the refund ✓ passed (41s)
md5: 90351f4b7fe11180ef430d9cefb45015
Verify the confirmation message says booking #1 was cancelled and "Refunded 240 €".
Verify the wallet balance shows "240 €".
