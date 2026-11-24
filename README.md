# Spec Delta

**When the spec changes, your green suite lies.** Spec Delta makes Kane CLI prove it in a real browser, then hands the failure to your coding agent until the new rule is proven.

> Work in progress for the KaneCLI Online Hackathon (12–26 Nov 2026).

## The demo app: Stayline

Stayline is a tiny hotel booking app with no dependencies. The clock is frozen at 10 Dec 2026 12:00 UTC, so every run sees the same four bookings:

| Booking | Guest | Check-in in | Refunded under spec v1 (24 h) | Refunded under spec v2 (48 h) |
|---|---|---|---|---|
| #1 | Amina | 72 h | yes | yes |
| #2 | Bilal | 36 h | yes | **no** |
| #3 | Chloé | 12 h | no | no |
| #4 | Driss | 48 h | yes | yes (boundary) |

The existing suite only covers 72 h and 12 h. Both cases have the same outcome under either spec, so the suite stays green after the rule changes. Bilal's 36 h booking is the case the stale suite misses.

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
