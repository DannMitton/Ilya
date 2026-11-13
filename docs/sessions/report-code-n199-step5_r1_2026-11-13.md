# Report, N.199 Step 5: what Ilya keeps

2026-11-13, cloud lane, branch `cloud-lane-51`. Development switch only: the records are written only by the new capture screen, which exists only with `?calibrate=new`. The wheel writes none.

## What changed, with path:line

- `apps/web/src/lib/voice/takes.ts` (new): `TakeRecord` (`at`, `vowel`, `outcome`, `errorCode?`, `raw?`, `voiceType`, `visible`); `readingTake` and `failedTake` build a record; `appendTake` keeps `MAX_TAKES_PER_VOWEL` = 50 for each vowel and drops that vowel's oldest, without mutating its input; `addTake` writes in place.
  - `raw` is the engine's reading as it came, with `confidence` and `f2Quality`, and **no guard field** (tested: the record never contains `plausib`). A failed or cancelled take has no `raw`.
  - Outcomes: `captured`, `provisional` (the engine's own reading), `rolled-back` (the rejected reading is the one kept), `failed` (with the session's `errorCode`), `cancelled`.
  - `voiceType` is the declared type at the take, `null` when none. `visible` is `hidden | zone`, the toggle as it stood at the tap (Phase 2 adds `live`).
- `voice/profileStore.ts`: `StoredVoice.takes?: TakeRecord[]`, optional and additive, so no schema bump (`validVoice` does not require it; nothing strips an unknown field). `saveStore`: on a `quota-exceeded` failure, if any voice has takes, they are removed from every voice and the write is retried, so **a full store drops the record before it refuses the profile**. If the profile itself does not fit, the failure still reaches the singer as before.
- `voice/engine/types.ts`: `CalibratedFormant.visibility?: 'hidden' | 'zone'`, the one optional field on the kept reading. It is set by the new screen, so it appears only on readings taken there. The brief says "for every singer"; every singer who uses the screen gets it, and nobody else can until Step 8.
- `voice/VowelCapture.svelte`: builds the record in `onCaptured`, `onRolledBack`, and `onFailed` and emits it through `onTake`; marks the reading it hands the wizard with `visibility`.
- `voice/CalibrationWizard.svelte`: `recordTake` writes as `recordReadiness` does (`touchVoice` is not called for a take; `persistStore` only), **never through `persist()`**, so the calibration date does not move. `confirmReset` deletes the active voice's `takes`, so **Start over clears it**. The wizard is 2118 lines, ceiling 2124.
- **Duplicating a voice** copies formants only (`CalibrationWizard.svelte`, the existing duplicate path, not changed), so a copy keeps no take record. Not re-read in this step; the brief's claim is REVIEW's.

## Tests (8 new, `voice/takes.test.ts`)

A reading take keeps raw numbers with `confidence` and `f2Quality` and nothing the guard added; provisional, rolled-back, absent fR2, null type, hidden; a cancel has no code and a failure has the session's; no numbers on either; fifty a vowel with the oldest of that vowel dropped and another vowel untouched; no mutation; and three on `saveStore`: it writes again without the takes after a quota failure and the profile lands; it still refuses a profile that does not fit; it does not retry with no record, or on a failure that is not a full store.

## Gates after Step 5

| Gate | Baseline | After Step 5 |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | **5582 passed, 1 skipped** |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

5574 after 4d plus 8.

## Could not establish

- **That a record is written by a real take.** No take completes in the browser without the stub session (Step 6). The unit tests cover the record, the cap, and the quota path; nothing yet exercises `onTake` to `recordTake` to storage end to end. Step 6's test will.
- **That Start over clears `takes` in a browser.** Tested by reading `confirmReset`'s code, not by running it.
- **The size of a full record.** Fifty takes a vowel across ten vowels is up to 500 records, roughly 100 KB by my estimate (about 200 bytes each); I did not measure it.
- **Whether the quota path behaves in a real browser** (`DOMException` name and code): tested against a fake store that throws `QuotaExceededError`, the same way `profileStore.test.ts` tests it.
- **That duplicating a voice drops the take record.** I did not re-read `CalibrationWizard.svelte:499-519` in this step.
