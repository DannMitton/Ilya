# Fable review, lane 59 as built (cloud-lane-59 at 239a677d), r1, 2026-11-16

Filed verbatim by the desk (Opus 5.5) at 12:4x. Harness count 265,618 tokens, 41 tool uses, 5.2 min; cap told to Dann 400k.

# Review of lane 59 as built (`cloud-lane-59`, tip 239a677d, against Shane 16ab22d0)

Read only; no file changed, no git write. Paths are under `/home/claude/desk/wt-59/apps/web/src/lib/` unless they begin with `apps/` or `docs/`. I ran no vitest file and no gate. Term I coined: "half-built graph". All other terms are the brief's or the tree's.

## Verdict

**MERGE WITH FIXES.** No blockers. Every ruled behaviour is built, the words match the sheets, and the merge is clean apart from the expected line. Fix 1 and fix 2 are worth doing before Dann's phone walk; the rest can follow.

## Blockers

None.

## Fixes

1. **A cancel during microphone setup, inside a visit, leaves a half-built graph that every later take reuses.** `voice/engine/live.ts:401` and `:412` set `this.stream` and `this.ctx`; `:420` and `:428` return false when the run was superseded during `await ctx.resume()` or `await buildTap()`. Inside a visit, `cancel()` (`:307-322`) keeps the stream and context (`releaseAudio`, `:756-759`), so nothing clears them. The next `acquire()` sees a live track and an open context (`:362-372`) and returns true with no source connected to the tap. Every later take in that visit then times out after 10 s with "fry not detected", until the singer leaves the screen. The window is milliseconds on a desk; on iOS, where the context is made 8 s after the gesture, its length is NOT ESTABLISHED. Fix: reuse the graph only when `srcNode` and `tapNode` are both set and connected (a `graphReady` flag set after `:430`), otherwise `releaseGraph()` and acquire again. Add a `live.test.ts` case: cancel while `resume()` is pending, then a second take reaches stable fry.

2. **The gates and Playwright were not run on the final commit.** The Step 6 report's closing note says the eight gates and Playwright were not re-run after the `finishEarlyState` amendment (239a677d), and the Step 8 report says a whole-set Playwright run on the final commit is "not established" (43 passed before the last two source edits, 5 after). Fix: run the eight gates plus `calibrate-new`, `singer-paths`, and `insights-no-score` once on the merge result.

3. **The wiring from Back to the microphone has no test.** `visit.test.ts` covers the helper and `live.test.ts` the session, but nothing checks that `takeoverVisible` turning false reaches `closeVisit()` through `VowelCapture.svelte:127-133`. `stub.ts:193` adds `visitOpen` "so a test can read it"; no file in `apps/web/e2e` or `src` reads it (grep). Fix: one browser test that reads the stub's `visitOpen` after mount (true), after Back (false), after return (true), and after "See your vowel space" (false).

4. **A tap during the dwell at the end of a re-take pass focuses the vowel, then the screen leaves anyway.** `VowelCapture.svelte:145` sets `returnWhenIdle`; `tapVowel` (`:232-240`) ends the dwell and clears `pendingSelected` but not `returnWhenIdle`, so the effect at `:193-198` calls `onReturn()`. Fix: clear `returnWhenIdle` in the `endDwellAndFocus` branch.

5. **The scroll reset on mount walks every scrollable ancestor.** `VowelCapture.svelte:171-173` sets `scrollTop = 0` on each ancestor with `overflow-y` auto or scroll, not only the takeover. Scroll containers exist in `routes/+page.svelte:4856` and `Drawer.svelte:981`, `:1472`; which of them are ancestors is NOT ESTABLISHED. Fix: stop at the first scrollable ancestor.

6. **The stub's `closeVisit()` is not the live one's mirror in one respect, harmless today.** `stub.ts:197-200` calls `cancel()`; the live `closeVisit()` (`live.ts:268-282`) is silent by construction. The stub's `cancel()` fires no `CANCELLED` (`stub.ts:202-211`), so behaviour matches now. A one-line comment there would keep it so.

7. **Unmount mid-take now writes a cancel record.** The cleanup at `VowelCapture.svelte:178-183` calls `visit.destroy()` before `ritual.destroy()`, so `ritual.cancel()` fires `onFailed` and `onTake` (a `CANCELLED` take record through `CalibrationWizard.svelte:641-644`, written to `store.activeId`). Before this lane an unmount fired no event. Whether the screen can unmount mid-take (the voice switcher is drawn above the screen in the pictures) is NOT ESTABLISHED. If it can, the record may land on another voice.

8. **Small.** `capture.hint.active` no longer holds `{v}` but `hintsFor` still passes it (`chart/screen-logic.ts:55`). The take line's ticker reassigns `take` every 50 ms through the 10 s hold with an unchanged value (`capture-ritual.svelte.ts:284-286`). The main button reads "[i] in progress" through the 1.4 s dwell while the cue reads "[i] captured." (seen in `step4-phone-en-dwell.png`; the lane flagged it as a DESK DEFAULT).

## What I checked under A and C, and found built

- A tap focuses, Start records: `VowelCapture.svelte:232-244`; `tapEffect`, `chart/screen-logic.ts:86-89`.
- Breath first, 2, 4, 2, then fry; four ticks at 2, 3, 4, 5 s: `count-in.ts` constants and `COUNT_IN`; weights 2, 4, 2, 4 in `take-line.ts` (`TAKE_WEIGHTS`). Tests pin the numbers as literals (`count-in.test.ts`, `capture-ritual.test.ts`).
- The dwell is 1.4 s and holds under reduced motion: `capture-ritual.svelte.ts` `DWELL_MS = 1400` and the `after(DWELL_MS, ...)` in `maybeDeliver`; the glide is 0 ms under reduced motion (`VowelCapture.svelte:163`).
- The glide on every switch: one effect on `subject` (`VowelCapture.svelte:161-165`, `:211`).
- One microphone per visit: opened by the first `start()` (`live.ts:361-374`), kept through finish, cancel, and gate timeout (`:756-759`, `:335-353`), closed by `closeVisit()` (`:268-282`) on Back, page hidden, `pagehide`, and unmount, which covers Finish (`visit.ts:47-72`, `:80-86`; `routes/+page.svelte:3883`).
- The run token: handlers read `this.gen` at call time (`live.ts:517`, `:526`); `onChunk` drops audio while no run is active (`:532`).
- The tick's context is made inside the Start gesture: `pressMain` to `startTake` to `ritual.begin` to `prepareTicks` (`VowelCapture.svelte:241-243`, `:228-229`).
- The chart tap selects, on `click`, read against the live view: `chart/VowelChart.svelte` `tapped`; `chart/tap.ts`.
- Finish early: `chart/finish-early.ts:33-38` has the amended signature and return shape. `work-out` only when no vowel's fR1 or fR2 is `surrogate` and something remains; the caption is null when `anyUsable` is false (`:65-72`); shown at rest for one to nine (`VowelCapture.svelte:266-269`).
- Re-take at ten: `chart/screen-logic.ts:74-80`; "See your vowel space" under the buttons (`VowelCapture.svelte:270`, `:344-346`).
- INSIGHTS: `insights/identity.ts` `methodLineKey` with `noScore` and `samples`; `insights/InsightsPane.svelte:288-292`.
- The engine still measures 3.0 s: `live.ts:111` `SWEEP_S = 3.0` and `:606`. The diff to `live.ts` touches no constant.
- Stale callbacks: the ritual's `takeId` drops a late `CANCELLED` (`capture-ritual.svelte.ts`, `cancel()` raises `takeId` before `session.cancel()`).

## Strings

No mismatch found. A script compared 40 keys, English and French, byte for byte against the three sheets. The only differences are intended:

- Placeholder names: the sheets print `{three}`, `{trois}`, `{voyelles}`; the keys use `{m}`, `{vowels}`, `{vowel}`.
- `capture.finish.useRecorded` English uses U+2019 where the English sheet prints a straight apostrophe; the brief asks for typographic apostrophes.
- Every French colon in the new keys has U+00A0 before it, as the French sheet does.

Words beyond the sheets, which the lane flagged itself (Step 6 report): `capture.number.2` to `.9` (two to nine, deux to neuf) and `capture.list.and` (and, et), in `i18n.ts`. They need Dann's yes.

## Merge

- `git merge-tree --write-tree origin/Shane origin/cloud-lane-59`: one conflict, the key-count line at `apps/web/src/lib/i18n.ts:19-23`. Nothing else conflicts; `InsightsPane.svelte`, `ratified-lines.test.ts`, and `+page.svelte` auto-merge.
- **True key count after the merge: 1,308** (Shane 1,282 plus the lane's 26; no key removed, no duplicate). The per-prefix lines in the merged file sum to 1,308 and agree with the keys present.
- Ceilings after the merge: `CalibrationWizard.svelte` 1,727 of 1,727; `InsightsPane.svelte` 743 of 744; `routes/+page.svelte` 5,513 of 5,534.
- Lane 60 (trial merge of lane 59 with `origin/cloud-lane-60`): conflicts in two files.
  - `CalibrationWizard.svelte`, three blocks: the props interface (`takeoverVisible` against `onSeamChange` and the `openRequest` type), the destructuring default, and the `<VowelCapture>` mount, where lane 60 wraps it in `{#key captureKey}` and lane 59 adds `{takeoverVisible}`. Each resolves by keeping both sides. Lane 60 leaves the file at 1,380 lines, so the ceiling is no longer tight.
  - `i18n.ts`, two blocks: the total, and the adjacent `calib.` (117, lane 60) and `capture.` (55, lane 59) lines. Lane 60 adds 17 keys and removes 2; no key is added or changed by both lanes. With all three merged the count is **1,323**.
  - `e2e/calibrate-new.test.ts` and `routes/+page.svelte` auto-merge.
  - Behaviour to watch: lane 60's `captureKey` remounts the capture screen on a `record` request, which destroys and recreates the visit, so the microphone is released and announced again at that point.
  - Lane 60 does not yet call `createVisit`, `TakeLine`, or `finishEarlyState` (grep); its `VoicePane.svelte:31` and `voice-pane.ts:20` say they wait for this lane. A second visit helper on the same session would be closed by `VowelCapture`'s `destroy()`, so lane 60 needs to widen one predicate, not add a helper.

## Tests weakened, deleted, or pins moved (F)

Nothing weakened without a ruling. Deleted: `tapAction` and its cases (amendment 7), the sticky-stage browser suite (the stage is gone, replaced by the order and in-view suite). Pins moved all trace to the sheets or the supplement. One browser regex changed from « réessayer » to « reprendre » (`apps/web/e2e/calibrate-new.test.ts:449`); the baseline `i18n.ts:1236` already read « Reprendre », so the old test was stale. No `.skip`, `.only`, or `.todo` added.

## Pictures looked at

- `step7-phone-en-rest.png`: the ruled order; the line with four named parts; the line 17 explanation; Start [i]; the top of the chart below Start.
- `step7-phone-fr-breathe.png`: « Respiration » bold and whole, about 4 px from « Chant »; « Respirez. »; « [i] en cours » and « Arrêter ».
- `step4-desk-en-fry.png`: desk Drawer mid-take, three parts full, Fry bold and partly filled, "Now [i] in vocal fry.", the focused zone deepened.
- `step4-phone-en-dwell.png`: the readout (300 Hz, 2200 Hz) in the vowel's row, "[i] captured.", the line full, the main button still "[i] in progress".
- `step5-phone-en-tap-after.png`: focus on [o] after the chart tap, Re-take [o], nothing recorded. It shows "Return to summary" and "while I sing": it predates Steps 6 and 7.
- `step6-phone-fr-early-seven.png`: « Laisser Ilya déduire les trois autres » with its caption and « [ɪ], [ɨ] et [ʌ] » at the foot. The hint and toggle above it still show the pre-Step 7 French.
- `step6-phone-en-early-nineNoO.png`: "Use what I’ve recorded" with "Ilya fills the last one from what you have recorded so far."

The Step 5 and Step 6 pictures were taken before Step 7's words, so no picture shows the final hints beside the finish-early control.

## Questions for Dann

One, taste: the eight number words and "and" / « et » in fix list "Strings" above need his yes. Nothing else.

## NOT ESTABLISHED

- Any behaviour on a device: whether iOS suspends the held context between takes, whether the ticks sound while capture is live, whether a `click` on a transparent SVG `rect` fires in iOS Safari.
- Whether the iOS microphone permission prompt fires `visibilitychange` to hidden. If it does, `visit.ts:68-72` would cancel the first take at the prompt.
- Whether the Drawer can be lowered on a phone while `calibrating` stays true, which would hold the microphone with the screen out of sight.
- The length of the window in fix 1 on a phone.
- Whether all tests pass on the final commit or on the merge result; I ran none.
- Whether the voice switcher can unmount the screen mid-take (fix 7).
- Which scroll containers are ancestors of the capture screen (fix 5).

The findings above came from files read this session. The writing style follows Dann's stored preferences from memory; no fact in the report came from memory.
