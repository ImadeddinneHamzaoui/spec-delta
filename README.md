# Spec Delta

**When the spec changes, your green suite lies.** Spec Delta makes Kane CLI prove it in a real browser, then hands the failure to your coding agent until the new rule is proven.

> Work in progress for the KaneCLI Online Hackathon (12–26 Nov 2026).

## The demo app: Stayline

Stayline is a tiny hotel booking app with no dependencies. The clock is frozen at 10 Dec 2026 12:00 UTC, so every run sees the same nine bookings. Their check-in times bracket both refund cutoffs:

| Booking | Check-in in | Price | Refunded under spec v1 (24 h) | Refunded under spec v2 (48 h) |
|---|---|---|---|---|
| #3 | 12 h | 310 € | no | no |
| #5 | 23 h | 150 € | no | no |
| #6 | 24 h | 165 € | yes (boundary) | **no** |
| #7 | 25 h | 205 € | yes | **no** |
| #2 | 36 h | 95 € | yes | **no** |
| #8 | 47 h | 130 € | yes | **no** |
| #4 | 48 h | 180 € | yes | yes (boundary) |
| #9 | 49 h | 420 € | yes | yes |
| #1 | 72 h | 240 € | yes | yes |

The hand-written suite only covers 72 h and 12 h. Both cases have the same outcome under either spec, so the suite stays green after the rule changes, while bookings between 24 h and 48 h are still refunded.

## Run it

```bash
npm start            # http://localhost:3000  (/reset restores the demo data)
npm test             # unit and HTTP tests (Node's built-in runner)
npm run kane:suite   # the Kane CLI suite in tests/kane, in a real Chrome
```

Requires Node 20+, Google Chrome and Kane CLI (`npm install -g @testmuai/kane-cli`, then `kane-cli login`).

## Layout

| Path | What it is |
|---|---|
| `SPEC.md` | The requirement: spec v1, with a 24 h refund cutoff |
| `demo/SPEC.v2.md` | The changed requirement: a 48 h cutoff |
| `src/policy.js` | The refund rule (`REFUND_CUTOFF_HOURS`) |
| `tests/kane/*_test.md` | The spec v1 Kane suite, in plain English |
| `demo/fallback/cancel-36h_test.md` | The 36 h test that the spec change calls for, used if `maintain reconcile` does not produce it |
