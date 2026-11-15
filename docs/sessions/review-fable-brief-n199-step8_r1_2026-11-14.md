# Fable review of brief N.199 Step 8 integrate, r1

2026-11-14 21:0x to 21:1x. Commissioned by the desk (Opus 5.5) at Dann's "Proceed" of 21:05. 284,542 tokens (harness count), cap 330k, 43 tool uses, 8.0 min. Filed by the desk whole. Tree read at `62dc2b2f`. Paths are under `apps/web/src/lib/` unless rooted.

## Verdict

SEND WITH AMENDMENTS. Four blockers are fixed in the brief first.

## Blockers

1. **Deleting `pacifier/` fails gate 4 through the key index.** `i18n.ts:58` and `:88` name `lib/voice/pacifier/Pacifier.svelte`; `i18n-index.test.ts:64-69` fails on a path that does not exist. The brief limits this lane's `i18n.ts` edits to UNUSED marks.
2. **Step 8c.1 rests on a false premise and an acceptance its own rule cannot meet.** "The list is closed or hidden" during a take is false: `VowelCapture.svelte:223` closes it only when the hide toggle is on. The clause "the closed line is clear of the stage at 375 by 667" concerns a closed list, which a rule acting on an open list never changes (lane 53 report: line at 497 to 541, stage bottom 592 to 595).
3. **The room notice disappears silently.** `CalibrationWizard.svelte:775` still raises it; its markup (`:1461-1473`) sits in the wheel's branch, and the new branch (`:1380-1383`) has none. Brief r5 Step 8a lists it under neither goes nor stays. Nothing else tells a singer the room is lively (`snrMarginal` is read only at `:775`).
4. **A singer at the summary with one to six vowels sung has no control that resumes the tour.** Return to summary shows after one vowel (`VowelCapture.svelte:263`); the invitation waits for seven (`CalibrationWizard.svelte:1148`); Re-take exists on sung rows only (`:1247`); a reload lands on the summary (`:342`). Under the wheel only a reload reached this state. The fix needs a word, so it is Dann's.

## Amendments

- **A1.** Name the base by hash. No commit message begins "N.199: lane 53, the readings list and chart layout"; the tip reads "N.199: lane 53, Step 1 (the readings list on the capture screen) and the lane report" (`git log`).
- **A2.** Repoint `i18n.ts:58` to `lib/voice/capture-ritual.svelte.ts` and `:88` to `lib/voice/vowel-names.ts`. Counts do not change, since keys are marked and kept.
- **A3.** Complete the UNUSED list. Wheel only: `pacifier.tapToCapture` (`Pacifier.svelte:236`), `.wheelAria` (`:708`), `.ready` (`:561`), `.skipped` (`:572`), and `.sampleUncertain` (`:484`), which r5 omits. Wizard branch only: `calib.capture.allSet` (`CalibrationWizard.svelte:1390`), `.paused` (`:1426`), `.resumeButton` (`:1427`), `.pauseButton` (`:1450`), `.hold.captured`, `.hold.rolledBack`, `.hold.noted` (`:1433-1437`, `hold.ts:32-36`). Marking matches the tree (`i18n.ts:1327-1331`); no test rejects an unused key.
- **A4.** Keep the room notice: render the existing block in the new capture branch, with its two existing strings. Engineering choice, the reviewer's.
- **A5.** Delete `hold.ts` (sole importer `CalibrationWizard.svelte:76`) and its assertions at `outside.test.ts:11`.
- **A6.** State that gate 4 falls: `pacifier/contrast.test.ts` (48 `it(` sites by grep) and `chart/calibrate-switch.test.ts` go. `colour-story.test.ts:9` still guards word pairs from `app.css`.
- **A7.** `count-in` is already outside (`voice/count-in.ts`; `pacifier/count-in.ts:3` is a re-export). Nothing moves first. The only code import from `pacifier/` is `CalibrationWizard.svelte:45`.
- **A8.** Step 8c.1 condition: the stage is not sticky when `listOpen && ritual.phase === 'idle'` (`running`, `:202`, false). The landing stays sticky so the dot is seen. Strike the 375 by 667 closed-line clause, or put question 2 to Dann. Add to the measures: with the list open and the toggle off, start a take while scrolled; report how far the stage moves at the tap and at idle. Sticky positioning leaves flow unchanged, so scroll position holds.
- **A9.** Step 8c.2: name « Reprendre [i] » too; it also wraps (table). Report every main and stop label.
- **A10.** State that the take record is now written for every singer (`CalibrationWizard.svelte:1382`, `onTake={recordTake}`), and correct `takes.ts:2`, `profileStore.ts:134`, `VowelCapture.svelte:65`, `app.css:170`.
- **A11.** Done when: change `e2e/calibrate-new.test.ts:21` to `/?capture=stub`; add assertions that `.pacifier` is absent and that `?calibrate=new` still loads the capture screen; update `stub-switch.test.ts:12-13`. Steps 8c.1 and 8c.2 name measures and no test: add one e2e each.
- **A12.** N.200 r2 cites lines this lane deletes (`brief-code-n200…r2:95-96`: `hold.ts:11-18`, `Pacifier.svelte:219`, `CalibrationWizard.svelte:850-859`). N.200 starts after lane 55 ships, on a revised brief.
- **A13.** Lane 54: the brief is not in the clone. Shared files by this brief's account: `i18n.ts` (index block, `:19` to `:90`) and likely `scripts/ratchets.json` (`:14` wizard, `:15` Drawer). Lane 54 ships first; lane 55 merges `Shane`, then re-runs all eight gates.

## Citation table

| Claim | Status |
|---|---|
| `calibrateNewOn` at `CalibrationWizard.svelte:49`, `:258`; `SummarySheet.svelte:8`, `:13` | CONFIRMED |
| `.stage` `VowelCapture.svelte:502-511`, sticky, top 0 | CONFIRMED |
| `.main` `:647-652`, `flex: 2`, no `white-space`; `.stop` nowrap (`:660`) | CONFIRMED |
| Desk's seven `pacifier/` files | One import (`:45`); six are comments |
| r5: seven `activateVowel` calls | CONFIRMED, MOVED: `:774, 807, 902, 970, 980, 990, 1003` |
| r5: skip wired at `:1391` | MOVED: `:885`, wired `:1407` |
| r5: `Pacifier.svelte` 972 lines; wizard 2,112 | WRONG now: 949; 2,118 (ceiling 2,124, `ratchets.json:14`) |
| r5: tokens `app.css:164, 166, 167`; `colour-story.test.ts:7` | CONFIRMED; used only by the wheel and `contrast.ts` |
| r5: stale comments `:8-16`, `live.ts:372`, `types.ts:22-25` | CONFIRMED; `:780`, `:948` MOVED |
| Other e2e tests drive the wheel | None found in `e2e/` or `e2e-phone/` |

Step 8c.2 widths, computed from Source Sans 3 at 600, 16 px, with Chromium's 6 px button padding assumed: « Commencer [i] » 101 px, « Reprendre [i] » 90, « Tout recommencer » 129, "Start [i]" 52, "Start over" 68. Stop button 164 px in French. Main button gets 99 px at 390 (capture 322) and needs 113: two lines. The brief's cause is right. With both nowrap the pair needs 287 px: one row at 375 and 390; at 320 (capture 252) the row already wraps today. English holds one line at all three.

## What a singer could lose

- **Removing one reading.** Long-press cleared a vowel and restored its estimate (`Pacifier.svelte:564-575`). The new screen has Clear all only. Not covered until N.200 builds "use Ilya's estimate for now".
- **Room notice.** Blocker 3.
- **Hold banner, Pause.** Covered: nothing starts by itself; cues `pacifier.rolledBack`, `capture.uncertain` (`capture-ritual.svelte.ts:231-234`).
- **Roster during capture.** Covered by the readings list (`VowelCapture.svelte:355`), without the reading word; that stays on the summary.
- **Readiness, the "o" note, persistence, the [ɨ] pass, re-take rule.** Kept (`CalibrationWizard.svelte:768`, `:1195`, `:817-818`; ritual `:229`).
- **Screen reader.** Covered: `cue.ear` (`VowelCapture.svelte:271`), `logAnnounce` (`:824`).
- **First-time explanation.** Shown until the first take only (`VowelCapture.svelte:207`); the wheel showed it throughout.
- **Voice switch.** Switcher stays disabled for the whole capture phase (`:1293`), which no longer ends by itself.
- **[ɨ] sung before [i] and [u]** stays Provisional (`divergence.ts:15`), now an ordinary path. N.200's.

Seated already: credit lines (`i18n.ts:2585-2586`, `VowelCapture.svelte:284`), `sheet.legend.zones` (`:2546`), pause line. Elsewhere: far-off [ɨ] message (N.200), "Resonance profile" (`i18n.ts:1366, 1489, 1490, 1492` still read "formant profile").

## Questions the reviewer marked as Dann's

1. The control and its word that resume the tour from the summary (blocker 4).
2. Whether the stage sticks at rest at all, or only during a take. The second also frees the toggle on short phones and requires rewriting `e2e/calibrate-new.test.ts:215-234`.
3. Whether release may go without single-vowel removal if N.200 slips.

## What the reviewer could not establish

The N.201 brief and its file list; gate counts (no gate run); Safari's button padding and any rendered result; the capture width at 375 (307 inferred); whether "lane 53 ships" means a commit other than `62dc2b2f`; the run count of `contrast.test.ts`.
