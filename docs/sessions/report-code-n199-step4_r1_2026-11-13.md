# Report, N.199 Step 4: the screen, behind the switch (four commits)

2026-11-13, cloud lane, branch `cloud-lane-51`. Seen only with `?calibrate=new`. This report grows by one section per commit: 4a, 4b, 4c, 4d. Gate counts are after each commit.

## 4a. The chart

**What changed, with path:line**

- `apps/web/src/lib/voice/chart/VowelChart.svelte` (new): the chart at 484 by 280 in its own units, scaling to the width it is given. It draws `ChartLayers` (Step 2's drawing: zones with no stroke, the grid after them, the hull, placeholders, sung dots, the grid's numbers) for a `model` and a `view` it is handed, so Step 4c can move the view and the drawing stays one. Props: `model`, `view`, `active` (its zone takes opacity 0.5, the others their own).
- `voice/chart/model.ts` (new): `buildChartModel(profile, voiceType)` returns the zones, placeholders, sung dots, the full view, and `allTen`; `CHART_W` and `CHART_H`. `VowelSpaceSheet.svelte` now builds its model here, so the sheet and the screen cannot disagree about a voice.
- `voice/chart/draft-strings.ts`: the whole of the brief's section 7 `capture.*` table added, verbatim, with the sheet's. Nothing enters `i18n.ts`.
- **Each unsung zone carries its symbol** through its placeholder dot (every unsung vowel has one, `computeZones`). Tested: all ten symbols appear with one vowel sung.
- **No outline on any zone:** tested on the markup (`fill`, `fill-opacity`, no `stroke`); and `colours.test.ts` (Step 2) fails if `app.css` declares a stroke or outline token for a zone.

**Tests (11 new):** `VowelChart.test.ts` 8 (ten zones, the grid after the zones, a symbol for every vowel, no stroke, the active zone's deeper opacity with the others unchanged, the bar for a reading with no fR2, the zoomed view drawing the same zone at least 1.3 times wider, the hull dashed until ten, an image role and no "goal" or "target"); `model.test.ts` 3.

**Gates after 4a**

| Gate | Baseline | After 4a |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | **5533 passed, 1 skipped** |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

5522 after Step 3 plus 11.

## 4b. The screen with the ritual

**What changed, with path:line**

- `apps/web/src/lib/voice/VowelCapture.svelte` (new): header and count; the symbol in a 6 rem circle with its spoken name; one sticky group (chart, progress bar, cue line with readout, ten buttons, Start and Stop) so they stay in view together when the takeover scrolls; the hint; the one plain sentence about the dot and the axes; the hide toggle; "Return to summary". It mounts `createCaptureRitual` (Step 3) and `VowelChart` (4a).
  - Ten real `<button>`s, 44 px, in Grayson's order, five columns so two rows of five; each named by spoken name, state (sung or placeholder), and "selected".
  - A tap on a vowel when idle selects it and begins at once; a second tap on the vowel in progress, Stop, and Escape (`<svelte:window onkeydown>`) cancel; a tap on another vowel is ignored.
  - The cue is a live region that speaks the vowel by `vowel.spoken`, while the eye reads the bracketed symbol (two elements, the eye's `aria-hidden`).
  - **Capture shows no verdict.** The screen never reads `plausibility`. No ring is drawn in this commit (the ring for `confidence: 'low'` is not built; I left it out rather than half-build it).
  - A reading with no fR2 draws the bar (4a) and the readout says the tree's "Try again".
  - After a capture the selection moves by `tour.ts`, **after the landing ends**, and waits; nothing starts by itself. A rolled-back take moves on too; a cancel or error does not.
  - "Return to summary" shows when idle and one vowel is sung; Done (all ten) returns; a pass that runs out returns after its landing.
  - Start over takes two taps (hint, then "Clear all", then `onClearAll`); it is disabled when nothing is sung.
  - The first-time explanation is the tree's `calib.capture.cuePrefix` + vowel + `cueSuffix`, shown while nothing is sung and no take has begun on this screen.
- `voice/chart/screen-logic.ts` (new, pure): button labels and states, the hints, the main and Stop labels, the cue's eye and ear text, board D's glyph nudges. 19 tests.
- `voice/chart/opening.ts` (new): where the screen opens for each of the wizard's three doors (Begin, the invitation for the three hardest, a re-take with its list). 3 tests.
- `voice/chart/SummarySheet.svelte` (new): Step 2's sheet and its print control, moved out of the wizard behind one line.
- `voice/CalibrationWizard.svelte`: `commitReading` extracted whole from `handleVowelCaptured` (the guard, the [ɨ] pass, the save, the announcement, the parent callback), so the new screen commits a reading the way the wheel did; `handleVowelCaptured` calls it and keeps the hold and the queue. The capture branch `{:else if phase === 'capture' && calibrateNew}` mounts `VowelCapture`; the three doors set `opening`. **The wizard is 2109 lines, under its 2124 ceiling.** My first version was 2152 and breached the ratchet; I moved the wiring into the three small files above instead of raising the ceiling.
- `voice/chart/draft-strings.ts`: one new string, `capture.vowels` ("The ten vowels"), mine, flagged.

**Looked at in a real browser** (Playwright on `vite dev`, Chromium with a fake microphone, 1440 by 900, a stored bass voice with [i e u] sung; scratch scripts, not committed): the summary shows the sheet under the roster; Re-take opens the new screen on a pass; a tap on [ɛ] began the count at once ("Sing [ɛ] as you usually do. Three.", then "Two.", then "Stop, and keep the shape."); a tap on another vowel changed nothing; a second tap, and then Escape, each gave "Capture cancelled."; a new take reached "Now [ɛ] in vocal fry." and, with no stable fry from the fake microphone, ended in the tree's "That sample could not be read" after the listening timeout. The active zone took its deeper saturation. The pictures were for my checking; the brief's set is Step 6's.

**Gates after 4b**

| Gate | Baseline | After 4b |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | **5567 passed, 1 skipped** |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

5533 after 4a plus 34 (`VowelCapture` 12, `screen-logic` 19, `opening` 3). One earlier svelte-check run showed 13 warnings (a `state_referenced_locally` on `session`); fixed with `untrack`, back to 12.

**Could not establish in 4b**

- **A captured reading through the new screen.** The fake microphone never gives stable fry, so no take completed in the browser; the path `onCaptured` to `commitReading` to the dot landing is untested outside the unit tests. It needs the stub session, which is Step 6.
- **The sticky group's behaviour in a short window**, and the screen at 390 px. Not photographed.
- **Whether the toggle should persist.** I did not persist it (the brief asks the question and does not rule).
- **Whether the first-time explanation reads well** as "Tap the [i] cardinal-i vowel to begin. First sing it as you usually do...". It is the tree's ratified text joined to the bracketed symbol and the name; the join is mine.
- **Hint wording for a selected unsung vowel** is two sentences (placed, then to go); the brief's table gives the sentences and not the rule for which to show. The rule is in `screen-logic.ts` `hintsFor`.

## 4c. Zoom and hidden mode

**What changed, with path:line**

- `apps/web/src/lib/voice/chart/view-motion.ts` (new): `createViewMotion` moves the chart's view from where it is to a target over a time, eased (`mixView`), or at once for 0 ms; a new move starts from wherever the last had got to. The clock and frame scheduler are injected. `ZOOM_IN_MS` 1000 (under the first sung beat), `ZOOM_OUT_QUICK_MS` 400. 4 tests.
- `voice/VowelCapture.svelte`: the screen holds a `view` and drives it from the ritual's phase.
  - `sing`: the view moves in on the vowel's zone (`zoomTarget`, widened to hold a re-take's existing reading) over 1 s.
  - `landing`: the view is set close on the new reading (widened if it lands outside its zone), then moves back out to the full view over the landing's 900 ms. The dot appears from the stored profile, which `onCaptured` has already updated.
  - A cancel or an error: the view moves out in 400 ms.
  - At rest the view follows the voice, so a cleared voice or a new dot reframes.
  - **Reduced motion:** every move is set at once, no animation.
  - **Hidden mode:** from the tap, the chart and the readout are replaced by the one sentence (`capture.hidden`); the view takes its zoomed place with no motion, so when the chart returns at the landing it is already close on the dot and moves out.

**Looked at in a real browser** (Playwright, fake microphone): the [ɛ] zone's radius along fR2 read 60 at rest, 64 at 0.3 s, 84 at 1.8 s (the 1.4 times minimum zoom), and 60 again 0.8 s after a cancel. With the toggle on, a tap replaced the chart with "The chart and the numbers are hidden while you sing...", and Escape brought the chart back. The zoom-out on a landing was not observed, because no take completed (see below).

**Gates after 4c**

| Gate | Baseline | After 4c |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | **5571 passed, 1 skipped** |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

5567 after 4b plus 4.

**Could not establish in 4c**

- **The landing's move back out.** It runs on a delivered reading, which needs the stub session (Step 6). The code path is written and its motion helper is tested; the sequence on screen is not observed.
- **That 1 s is "under the first sung beat" to the eye**, and that the 60 to 84 zoom is enough. The minimum zoom is board D's 1.4.
- **No unit test mounts the component's effects**, so the phase-to-motion rules in `VowelCapture.svelte` are covered by the browser check above only, until Step 6's test.
- **Hidden mode records nothing yet.** Step 5 records which way each reading was taken.
