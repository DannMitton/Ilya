# Report: N.203 lane 60, Step 4 (the test fry), the merge of lane 59, and the end-to-end repairs

2026-11-16. Code (cloud session), branch `cloud-lane-60`. Brief r3 Step 4 and section 9, the review's amendments 12 to 18, and the desk's word of 14:0x. The code commit is `180dc886`; the gates and suites below ran on it. This report and the step 4 pictures are the only things added after. Paths under `apps/web/src/` unless `e2e/`. I changed nothing under `docs/memory/` and edited no brief.

## 1. The merge of `origin/Shane` (3fd9a13f, lane 59 and lane 56's second follow-up)

Conflicts, resolved by keeping both sides: `lib/voice/CalibrationWizard.svelte` in three blocks (the props interface: my `VoiceRequest` type for `openRequest`, my `onSeamChange`, and lane 59's `takeoverVisible`; the destructuring: `onSeamChange` and `takeoverVisible = true`; the `VowelCapture` mount: my `{#key captureKey}` wrap and lane 59's `{takeoverVisible}`), and `lib/i18n.ts` (the total and the `calib.` and `capture.` prefix lines).

**The key total is 1,325 after the merge, not the desk's 1,323.** Shane 1,308 plus my 17 added is 1,325. The "less your 2 removed" does not apply: this file keeps a retired key and marks it UNUSED, so I removed none; `i18n-index.test.ts` states the actual count and failed at 1,323, which is how I found it. Step 4 adds three keys (below), so **the file now holds 1,328 keys** (`calib.` 120, `capture.` 55).

## 2. Step 4, as built

**Before.** "Getting ready" shows sheet line 9 and **Start** (line 10). Welcome's Begin goes there and nothing listens until Start (`CalibrationWizard.svelte`, `startFry`, `readinessStep === 'before'`).

**The run.** Lane 59's `voice/TakeLine.svelte`, imported and not edited, with three parts Quiet, Breathe, Fry (weights 1, 2, 3; review amendment 14). Quiet has no clock in the wizard: the line `holds` (pulses) until the engine's `onQuiet`, which on a first run includes the permission prompt. Breathe is `READINESS_PREP_MS` (2,100 ms, not 2 s, as the review says) and Fry is `READINESS_CAPTURE_MS` (3,000 ms); I changed neither constant. The wizard's own clock (requestAnimationFrame) drives the line. The spoken count is gone. Labels: lane 59's `capture.part.breathe` and `.fry` and its cue `capture.cue.breathe`; only "Quiet" is new. Reduced motion is passed as the capture screen does.

**The verdict** is a pure function in a new module `lib/voice/readiness-view.ts` (`fryView`), unit-tested because no test mounts the wizard. Accepted only when `fryHeard === true` **and** `fryAccepted === true`. Four outcomes (review amendment 13): (a) no microphone (the built `calib.readiness.noMic`, Continue); (b) the driver's `readiness-timeout`, which is what silence gives; (c) a result not heard-and-accepted; (d) accepted (the built "Readiness check complete.", and the built marginal line when the rate is marginal). (b) and (c) show line 13 with **Try again** (quiet, first) and **Continue** (filled, last; DESK DEFAULT: the gate never blocks). On (b) and (c) the room notice does not rise and the marginal line does not print; on (c) the stored record keeps the room's values and sets `fryRateHz: null` and `fryRange: 'not-measured'`, so a rustle's rate is never stored as the voice's.

**`null` from `fryHeard`** (an unmeasurable ratio) is treated as **not heard** here, as the brief says. `assessReadiness` does not veto on it, so a result with `fryHeard === null` and `fryAccepted === true` is refused by the test fry; the unit tests pin it.

**The visit.** One `createVisit` (lane 59's helper, `voice/visit.ts`), owned by the wizard, with the predicate "the takeover is visible AND (the test fry has been started, or the capture screen is showing)". `VowelCapture.svelte` (lane 59's file, edited here) takes it as an optional `visit` prop plus `onVisitHooks`: when given, the screen creates no helper of its own, never syncs or destroys the shared one, and hands the wizard the two things only it can do (end a take, close the tick context). **There is no second helper on the session.** `CalibrationWizard` calls `visit.resume()` inside the Start tap (the gesture), so Chrome on iOS announces the microphone once on a first journey; Try again runs inside the same visit.

**On the `captureKey` remount** (the desk's question): it cannot close and reopen the microphone. A `record` request arrives from the Drawer at rest, when the takeover is hidden, so the visit is already closed by then, and the remount only matters when the takeover returns; and with a shared visit the old screen's unmount no longer closes it (the wizard's visit outlives the screen). I verified the continuity in a browser against the stub's `visitOpen` flag: closed before Start, open from Start, still open on the capture screen, closed on Back (`e2e/voice-pane.test.ts`).

**Leaving during a run** (amendment 15): the takeover left (Back), the page hidden, or the voice changed ends the run and returns to the "before" screen, keeping nothing (`fryToBefore`, `resetFlow`). Tested: Back during the run, wait longer than the whole run, no readiness record is written.

**The pane** passes `restWorkedOut` from lane 59's `finishEarlyState(...).kind === 'work-out'` (`routes/+page.svelte`, one line), replacing the `false`.

**Stub:** one new outcome, `no-fry`, in `engine/stub.ts` (amendment 16): a result with `fryAccepted: false`, no rate, and a named failed condition, so a browser test and the pictures can show the refusal. This is this lane's one edit in lane 59's file besides `VowelCapture.svelte`.

**Words**, all from the ratified sheets, character for character: new `calib.readiness.intro` (line 9), `.start` (line 10), `.partQuiet`; changed text for `.quiet` ("Stay silent."), `.captureLede` ("Fry now, until the line fills."), `.noFry` (line 13), per the review's key map (amendment 18). Try again is the built `calib.roster.tryAgain`, Continue the built `calib.common.continue`. **UNUSED, marked in place:** `calib.readiness.prepareLede`, `.countThree`, `.countTwo`, `.countOne` (a grep found no reader outside the wizard's removed count), and `.guidance` (its pinning tests: none). No French of my own; the OQLF sweep (`i18n.test.ts`) passes.

## 3. Fixtures (review amendment 16), at the level of `assessReadiness`, one-second windows at 48 kHz, all synthetic and deterministic

| Fixture | heard | accepted | failed conditions |
|---|---|---|---|
| silence | false | false | `c4_decay`, `c7_flat`, `c8_snr` |
| white-noise bursts | true | false | `c3_ipi`, `c6_count`, `c7_flat`, `c8_snr` |
| bursts low-passed at 300 Hz | true | false | `c3_ipi`, `c4_decay`, `c7_flat` |
| clicks at 40 Hz low-passed at 800 Hz | true | false | `c7_flat` (flatness alone, as the packet said) |
| `synthFry` | true | **true** | none |

Only the last is accepted. **Every noise fixture is "heard"**: the presence floor passes all four, which is exactly why `fryHeard` alone was the hole and the detector's verdict is needed too. `lib/voice/readiness-view.test.ts`: 11 passed.

## 4. The end-to-end repairs in `e2e/calibrate-new.test.ts`

Edited only the sites below (the file's line numbers moved when lane 59 merged; sites found by content). Each repair replaces a removed path with the new one and keeps what the test asserts.
- The entry helper `toCapture`: after Begin, the new **Start** click (the test fry waits for it).
- The review's sites: the "Re-calibrate" and "Calibrate" clicks become the pane's doors ("Your vowel space", "Record a vowel again", "Carry on recording", "Record your vowels", in both languages where the test is bilingual); the roster Re-take clicks become the summary's "Back to the ten vowels", or, where the test is about a pass, **the note's own Re-take** (the test seeds `[i]` as an implausible reading so the note shows; the note's Re-take is the one way left to a pass); the summary's Continue becomes "Back to the ten vowels"; the three lede assertions ("N of 10 vowels sampled") become a count of the sheet's recorded rows (`tr[data-row]:not(.placed)`); and `:71`, the sheet's heading instead of the pane's door. The "Re-take [i] on one line" test now focuses `[i]` with the first vowel button so the main button reads Re-take [i].
- I also changed the title of one test whose title named the removed Continue. Nothing else in the file.
- The first-visit tests in the Step 4 describe (lane 59's) also needed the Start click, and I added it: they are the same entry path.

## 5. Gates, once, on `180dc886`

| Gate | Baseline (Shane 3fd9a13f) | Now | |
|---|---|---|---|
| phonology | 462 | 462 passed (462) | same |
| dictionary | 248 | 248 passed (248) | same |
| svelte-check | 0 errors, 12 warnings, 5 files | 0 errors and 12 warnings in 5 files | same |
| web unit | 6445 passed, 1 skipped (6446) | **6481 passed, 1 skipped (6482)** | **+36**, all this lane's new tests (seam 5, pane 16, pane wiring 2, test-fry verdict 11, sheet and readings additions net of the anchor tests that left); no failure in this run |
| score-parser | 904 passed, 5 skipped (909) | 904 passed, 5 skipped (909) | same |
| blurb | 178 | 178 passed (178) | same |
| integration | 159 | 159 passed (159) | same |
| ratchets | OK | OK | same |

`open-extract.test.ts`, the one timeout in the earlier runs, passed in this one. The ratchet script says the wizard's ceiling could fall to 1,314 (now 1,314 lines against 1,727) and the page's to 5,523 (against 5,534); I did not touch `ratchets.json`, and the desk may lower them.

## 6. The Playwright suites on the same commit

`pnpm exec playwright test --project=chromium` (the whole desk project, one worker, `--trace off`, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`): **259 passed, 1 failed, 1 skipped, 51.2 minutes.** I read "whole" as that run, because no suite has that name, and it contains the other four. Per file: **`calibrate-new` 37 passed (none failed), `singer-paths` 7, `voice-pane` 12, `insights-no-score` 6.**

The one failure is `e2e/loupe-header.test.ts:47` ("a drag on the desk moves the card"), expected -40 and received -30. **It fails the same way on the untouched `origin/Shane` tip** (I checked out 3fd9a13f, ran that test, and returned to this branch), so it is not this lane's. The skipped test is not named in the list reporter's output and I did not trace it.

## 7. Pictures (`docs/sessions/report-code-n203-lane60-pictures/step4-fry-{phone,desk}-{en,fr}-{before,quiet,breathe,fry,refused}.png`)

Phone 390 by 844 and desk 1440 by 900, English and French: the three screens the brief names (before, mid-run, no fry heard), with the run at Quiet, Breathe, and Fry. I looked at: phone French at Breathe (« Silence », « Respiration », « Friture » whole, no clipping, the line's Breathe part half full), phone English before, phone English refused (Try again quiet and first, Continue filled and last), and desk English at Fry. The French labels were also measured whole at all four sizes by `scrollWidth` against `clientWidth`. **The other 16 are the same layout in the other sizes and languages; I did not open each.** The Step 2 pane pictures and the Step 5 summary pictures stand as reported.

## 8. What I could not establish

- **Whether a real rustle of clothes is refused.** Every fixture is synthetic. Dann rustling on purpose on his iPhone is still the test (amendment 17). The engine's own console line prints, on every window, the six conditions and the verdict (`[voice-live] readiness gate: ... | refused: c7_flat, ...`, `engine/live.ts`, the `dbg` calls; `DEBUG` is `true`, so it is on in the build; no switch is needed): read it in Safari's Web Inspector on a Mac, with the phone's Develop menu, after a failed walk.
- Whether real fry is ever refused inside the 3 s window; the brief's open question. A filled Continue means a refusal does not trap a singer.
- The microphone's behaviour on iOS WebKit: the stub's `visitOpen` flag tracks the rule, not the browser's prompt.
- The 16 pictures above that I did not open.

## 9. For Dann's eye

- **The "Fry" part's line (the part "Fry" fills while he fries) ends when the engine reports**, not when a sound is heard; a rustle fills it the same as fry. The verdict at the end is where the difference shows.
- **Try again is quiet and Continue is filled** on the refusal screen: a deliberate DESK DEFAULT so a strict verdict cannot trap him in a loop. Easy to swap.
- The pane's sentence now says "works out" when every vowel left can be worked out (it reads lane 59's rule); I looked at no picture of that state beyond the unit test.
