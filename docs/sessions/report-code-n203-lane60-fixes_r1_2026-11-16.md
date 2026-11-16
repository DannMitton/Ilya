# Report: N.203 lane 60, the fixes after Fable's review of 38ec37c2

2026-11-16. Code (cloud session), branch `cloud-lane-60`. The desk's seven fixes, in order, one commit each, test first where a test applies. No singer-facing word changed, nothing under `docs/memory/` touched by me (the merge brought `Shane`'s memory notes in unchanged), no brief edited. Paths under `apps/web/` unless `docs/`.

## Fix 1 (blocker): a remount no longer orphans a take. Commit `Lane 60 fix 1`

**Reproduced first.** A browser test in `e2e/voice-pane.test.ts` ("a take is never orphaned by a remount"): four readings stored, the pane's door, Back, the door again (the `{#key captureKey}` remount), Start, Back mid-take. Before the change it failed: the stub's run counter read 0 at Back and **1 eight seconds later**, so the count-in ran on behind the Drawer and began a run outside the visit, exactly as the review described.

**The change.** `src/lib/voice/VowelCapture.svelte`: the screen builds one `hooks` object, hands it up at mount, and on unmount passes the same object back with `null` (`onVisitHooks(null, hooks)`). `src/lib/voice/CalibrationWizard.svelte`: the handler sets `visitHooks = null` only when `visitHooks` is still that object (`(h, was) => { if (h) visitHooks = h; else if (visitHooks === was) visitHooks = null; }`), so the new screen's hooks survive the old screen's unmount.

**The test now passes** and asserts, with the stub: the pane shows after Back; the visit is closed; no run starts in the eight seconds after Back (`starts` unchanged); no reading is added (four stay four); and the take record is `['cancelled']`. To count runs I added two things to `src/lib/voice/engine/stub.ts`: a public `starts` counter (incremented by `start` and `startReadiness`) and made `readiness` public and mutable (Fix 4 needs it). The earlier test "one microphone visit spans the test fry and the first vowel" still passes.

## Fix 2: line 5b has a test and a picture. Commit `Lane 60 fix 2`

`e2e/voice-pane.test.ts`: with the six anchors stored (i, e, ɛ, ɑ, o, u) the pane reads "You have recorded 6 of the 10 vowels. Ilya works out the other 4 from your own vowels."; a second test with five of them reads the "fills" form, so the branch is exercised both ways. The wiring (`routes/+page.svelte`, `restWorkedOut`) was already right: both pass. Picture: `docs/sessions/report-code-n203-lane60-pictures/fix2-pane-phone-fr-works-out.png` (390 by 844, French: « Vous avez capté 6 des 10 voyelles. Ilya déduit les 4 autres de vos propres voyelles. »), and the English twin. I looked at the French one.

## Fix 3: `backToTen`. Commit `Lane 60 fix 3`

`CalibrationWizard.svelte` `backToTen` now takes its landing from `landingFor('record', hasAnyReadings(profile))` (`seam.ts`) in place of repeating the rule, and sets `confirmingReset = false`. Test first: with ten readings, Start over (the confirmation shows), Back to the ten vowels, then See your vowel space: before the change the confirmation was **still showing** on return (failed); now it is gone and the Start over button is back (passes).

## Fix 4: amendment 16 in full. Commit `Lane 60 fix 4`

One browser test: the stub's room is `no-fry`; Start; the refusal (line 13) shows and the stored record is `{ measured: true, fryRateHz: null, fryRange: 'not-measured' }`; the test then sets the stub session's `readiness` to `clear` (the switch reads `__ilyaStubReadiness` once, at construction, so the test sets it on the session between runs); Try again; the refusal text is gone; "Readiness check complete." shows with no Try again; the stored record is `{ measured: true, fryRange: 'clear', fryRateHz: 48 }`; Continue opens the capture screen. It passed first time: the code was already right, and this is coverage, not a fix.

## Fix 5: INSIGHTS' "Add your range", the two new branches. Commit `Lane 60 fix 5`

- **Refused over the capture screen, and dropped** (`refusal ... nothing follows`): with a score loaded and a voice with no range, the pane's door opens the capture screen; INSIGHTS' link pressed then does not break in (the capture screen stays, no "Voice characteristics" heading); after Back and 1.5 s there is still no such heading (a refused request is dropped, never answered later); and the same link pressed from rest opens the Range fields (the positive control). Passes.
- **The no-voice branch of `openVoice`** (`routes/+page.svelte:1666-1669`): **it is not reachable from INSIGHTS' link.** I probed it: with a score loaded and no voice saved, INSIGHTS draws "Nothing is claimed about your voice" and **no "Add your range" button at all**. So no UI path calls `openVoice` with an empty list today (the pane at rest has no doors with no voice). The test pins that premise instead (no range link; the takeover stays stowed), and says so in its title. The branch is defensive code that no test can drive without a hook I did not add. I did not add one.
- I committed a first version of this test with one assertion wrong (a stowed takeover is still in the DOM) by chaining the commit after a failing run's `grep`; I corrected it and amended the commit before pushing. The history on `origin` is clean.

## Fix 6: stale comments. Commit `Lane 60 fix 6`

`CalibrationWizard.svelte`: the `onComplete` doc (it described Finish on a "Profile summary" and a future main-pane state; it now says Finish and Done close the takeover and write nothing); the roster comment block (the roster is gone; the sheet's table replaced it, the symbol convention is `FrSym.svelte`'s); the characteristics phase's template comment ("Done returns to the summary" is now "Done closes the takeover"). I also fixed one more stale comment of the same kind, the phase note at the top that said the screen was entered only through the summary's button; that button is gone. Comments only.

## Fix 7: the merge and the final run

**Merge.** `origin/Shane` (bb556024, memory notes) merged into `cloud-lane-60` with no conflict (`8f05a481`); the five files it changed are all under `docs/memory/`.

**Gates, once, on `8f05a481`:**

| Gate | Counts |
|---|---|
| phonology | 462 passed (462) |
| dictionary | 248 passed (248) |
| svelte-check | 0 errors and 12 warnings in 5 files |
| web unit | **6480 passed, 1 failed, 1 skipped (6482)** |
| score-parser | 904 passed, 5 skipped (909) |
| blurb | 178 passed (178) |
| integration | 159 passed (159) |
| ratchets | OK |

Web unit: 6,481 tests ran in all (6,480 passed and 1 failed), the same 6,481 that passed at Step 4; these fixes added browser tests only, no unit test.

**The one failure** is `src/lib/text/syntactic-break-unit.test.ts` ("property: breakTarget agrees with unitEnd ... on random songs"), "Test timed out in 5000ms" under the full run's load, in a file this lane does not touch. It passes alone, three runs out of three. Same shape as the `open-extract` timeout of earlier runs: a 5 s limit on a two-core machine.

**Playwright, `voice-pane`, `calibrate-new`, `singer-paths`, `insights-no-score`, one run, Chromium, 14.2 minutes: 68 passed, 1 failed.** By file: `voice-pane` 19 passed, `singer-paths` 7, `insights-no-score` 6, `calibrate-new` 36 passed and 1 failed.

**The one failure** is the first test in `calibrate-new` ("a full tour"), at the entry helper: `getByRole('button', { name: /^continue$/i })` was not found within 30 s after Start. **I re-ran that test alone twice and it passed both times** (2.5 minutes each), and it passed in the last full run. **The cause is NOT ESTABLISHED.** It is the first test of a fresh run against a development server that had been idle; a cold start is my guess, and a guess is all it is. I did not change the entry helper in these fixes, so I have no change of mine to blame, and I cannot rule one out from one failure.

## What I could not establish

- The cause of that one `calibrate-new` failure (above).
- Whether the no-voice branch of `openVoice` is reachable by any path (above): I found none.
- I looked at one of the two Fix 2 pictures (French); the English one I did not open.
- The last door of the pane (the INSIGHTS one) shows a purple border in the Fix 2 picture, as it did in the Step 2 pictures. I think it is the pointer's hover or focus from the screenshot script; I did not isolate it.
