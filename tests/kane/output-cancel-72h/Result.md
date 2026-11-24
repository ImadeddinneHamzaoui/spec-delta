---
test: ../cancel-72h_test.md
status: passed
started: 2026-11-24T22:59:52.023Z
duration_s: 110
session_id: a861aeeb-e976-4429-b692-6c98f6d3631f
---

# Cancelling 72 hours before check-in is refunded — Result

## Start from fresh demo data ✓ passed (48.4s)
md5: f2fd2770589dbd38f104932ed57c9978
Open http://localhost:3000/reset and wait for the "Stayline · My bookings" page.
Verify the wallet balance shows "0 €".

## Cancel Amina's booking ✓ passed (14.4s)
md5: b740165920437921fc8f14f1016c470b
In the row for guest Amina (check-in in 72 h), click "Cancel booking".

## Check the refund ✓ passed (44.2s)
md5: 3758278a7c228739cadc99aaa87115cc
Verify the confirmation message says booking #1 for Amina was cancelled and "Refunded 120 €".
Verify the wallet balance shows "120 €".
