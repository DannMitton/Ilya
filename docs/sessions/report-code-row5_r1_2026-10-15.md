# Report: row 5, the Correction Station, slices 4 to 6 and cause 1c (r1, 2026-10-15)

Lane: a Claude Code cloud session on `cloud-lane-9`, cut from `origin/Shane` at `14e2ff8`. Briefs: `brief-code-audit-correction-station_r2_2026-09-27.md` with the amendments of `review-fable-brief-row5_r1_2026-10-15.md` (all eleven applied; the review wins where the two differ). Reviews are kept in `/tmp/briefs/` and are not committed.

WRITTEN on the code. DONE is Dann's walk: open a score, select a note, change its pitch, undo, redo, add a rest, tie two notes, define a tuplet, type a digit at a head caret.

## Commits

| Slice | Commit | `+page.svelte` before to after | New module | Gate 4 |
|---|---|---|---|---|
| 4, the tuplet row | `65d52ab` | 6003 to 5971 | `lib/score/tuplet-row.svelte.ts`, 82 lines | 2512 to 2522 (+10) |
| 5, the verbs and readings | `b348001` | 5971 to 5721 | `lib/score/correction-verbs.svelte.ts`, 392 lines | 2522 to 2546 (+24) |
| 6, the keyboard | `470f3f1` | 5721 to 5627 | `lib/score/correction-keys.ts`, 154 lines | 2546 to 2561 (+15) |
| 7, cause 1c | `4dbfc1e` | 5627 to 5638 | none (edits to `entry.ts`, `correction.ts`, `correction-cursor.svelte.ts`, `undo-history.svelte.ts`) | 2561 to 2580 (+19) |

Net, `14e2ff8` to the head of the row: `+page.svelte` 6003 to 5638, minus 365 lines. The ceiling in `scripts/ratchets.json:8` is 5638. Slices 4 to 6 each lowered it to the new count in their own commit. Slice 7 RAISED it by 11, on purpose, as `scripts/ratchets.json:2` allows: undo write-back 2 lines, the caret tap 6, `heldMeasureIndex` 3. The count is in that commit's message.

## Gates, after the last commit (all eight, run on the working tree that was then committed)

| Gate | Baseline | Result |
|---|---|---|
| 1 phonology | 251 | 251 passed |
| 2 dictionary | 248 | 248 passed |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 2512 | 2580 passed (+68: 10, 24, 15, 19) |
| 5 score-parser | 675 passed, 5 skipped | 675 passed, 5 skipped |
| 6 blurb | 145 | 145 passed |
| 7 integration | 55 | 55 passed |
| 8 ratchets | OK | OK |

Each of the first three slices also passed all eight gates before its commit (2522, 2546, 2561). The baseline was measured on `14e2ff8` before the first edit and matched the brief's numbers.

Playwright, `--project=chromium` with `PW_CHROMIUM_PATH` set: **58 passed, 2 failed, of 60** at the head. The two failures are `e2e/insights-page.test.ts:95` and `e2e/singer-paths.test.ts:169`. **Both fail identically on a pristine `14e2ff8`** (extracted with `git archive` into a scratch folder, run there: 2 failed, 8 passed in those two files), so neither is caused by this row. Their causes, read from the error text: Insights' section order check reads `[-1,503,1003]` (a heading it expects is not found), and Learn's French title is now « La diction lyrique russe pour chanteuses et chanteurs » where the test expects « … pour chanteurs ». Neither was touched, as the brief says to report and leave. After slice 6 the same run read 56 passed and 2 failed of 58; slice 7 adds two tests (below), both passing. `--project=phone`: 2 passed, 1 skipped, 0 failed (the loupe scan).

## The screenshot compare (slices 4 to 6)

Run in this container, per the review's amendment 4: baseline from `14e2ff8` before slice 4, capture after slice 6, `playwright.baseline.config.ts` with `/opt/pw-browsers/chromium`, fixture md5 `8341a301d78abcba62098cbcee764b62` (matches the tracked file). 84 captures each side, compared byte for byte (no comparator in the tree).

- **82 of 84 identical.**
- Two differed: `desk-en-6-voiced-markup-b-mid.png` and `desk-en-6-voiced-markup-c-end.png`, in one pixel column (x = 485, y = 211 to 254, 27 pixels). **That is not the pixel the documented noise names** ((1423, 24), `ENVIRONMENT.md:4463`). I re-ran the voiced captures a second time on the same code: that second run matched the baseline byte for byte on both files, and differed from the first run in the same column. So the same code produced two answers there. I call it run-to-run noise of the same kind, at a different pixel than the one recorded. NOT ESTABLISHED why it wobbles at x = 485. After that re-run all 84 match the baseline.
- The compare was run after slice 6 only, not after slice 7. Slice 7 changes behaviour on purpose (below), and the harness does not step to a head caret.

## Slice 4, the tuplet row

`TupletRow` holds `open`, `def` (both `$state`), the plain `#base`, `fits`, and `openRow`, `close`, `apply`. The one-undo rule is kept: `#base` is captured once per open and the stack is pushed once however many nudges follow. Tests (10) pin that, including a nudge that does not fit, close and re-open, and the base being the map at the FIRST apply.

One departure from "no reader changed": the page reads `tuplet.open`, `tuplet.def`, and `tuplet.fits` directly at the surface's props, instead of keeping three `$derived` aliases. The reads are tracked the same way. Slices 5 and 6 keep the old names.

## Slice 5, the verbs and the readings

`CorrectionVerbs` takes closures for what it reads and the one function that writes the corrections. The armed duration is its only `$state`. The readings are getters, as the cursor's are. Two closures replace imports the module may not make: `label` (`pitchLabel`, from `voice/`) and `word` (`t(key, language)`).

Tests (24), through the class with a fake `doc`: `handleStep` at the C1 and C7 bounds, in and out; `handleAccidental` returning early on a capped click; `handleDurationCell` in a gap (enters at `arrival`, takes the new entry) and on an entry (re-times, and pushes nothing at the same value); `handleRest` in a gap and both ways on an entry; the four conditions of `restoreAvailable`; tie, delete, dot cell.

**Found and left:** `handleDot` (`+page.svelte:976` at `14e2ff8`) has no caller anywhere in the tree, before or after the move (the dot cell, `handleDotCell`, is what the surface and the keyboard call). I moved it unchanged into the class and did not delete it. It is dead code for the desk to rule on.

## Slice 6, the keyboard

`createCorrectionKeys(deps)` is a plain function in a plain module: it holds no state. The handler's text, guard order, and every comment are moved as they were. Tests (15): the field guard first (it beats Undo), no cursor, a modifier, an unclaimed key not prevented, music keys standing down when `musicKeys` is false (the moves and Escape still act), Undo and Redo with no cursor, an empty stack not claimed, Ctrl-Shift-Y and Alt-Z unclaimed, the pitch verbs standing down in a gap. My first draft of two expectations had the digit table wrong (5 is a quarter, 6 a half; `correction.ts:116-117`); I fixed the tests, not the code.

## Slice 7, cause 1c

**What changes, on purpose.** With the loupe on measure k, Left from its first entry lands on k's head caret and the tag still names k. A note entered at that caret is the first note of k. Nothing else changes.

**Measured, both sides.** `e2e/loupe-head-caret.test.ts` (2 tests, Tchaikovsky op. 38 no. 3, loupe raised on an entry of m. 9, Corrections open). On `14e2ff8` (the scratch extraction) both FAIL: the head caret reads « after F♯4 » with the tag already `m. 8`, and a note entered at the tapped head caret leaves the tag at `m. 8`. At this head both PASS: « after F♯4 » keeps `m. 9`, the next Left lands on the entry F♯4 with `m. 8`, and a quarter entered at the head caret keeps `m. 9`, reads « Quarter », and the gap before it is still the head caret of m. 9. That is the control rule's positive control: the test fails without the change.

**Where I departed from the review, and why.**
1. Review (b) says the gap's measure is set "by `positionsInMeasure`" and "by the stepper". I did neither in `entry.ts`, because `entry.test.ts:81-83` and `:111-133` pin `stepCursor` and `positionsInMeasure` to plain gaps (`toEqual`). The measure is stamped in two other places that reach the same cursor: `CorrectionCursor.move` stamps the entry's measure on a gap it steps into from that entry, and `handleLoupePickGap` stamps `heldMeasureIndex` on a caret tap (the loupe is holding the measure whose carets were drawn). `entry.ts` gains only the optional field on the gap type and the copy in `enterEntry`; `sameCursor` ignores it.
2. Review (d) says the onset stays the anchor's end. Across a barline that is the wrong base: the anchor's end is the far side of the bar. `synthesize` seats a cross-barline entry on the downbeat of the measure it names, and `reflowOnsets` has the matching slot (`correction.ts`, `slotOf`), which review (f) asked me to check. Within a measure nothing changes.
3. Two entries in one gap, one naming k and one staying in k − 1, would have come out in the order they were entered, so the one that belongs before the barline could land after it. They are now stable-sorted by the measure each names. Records without the field are not reordered (tested).
4. `UndoState` gains an optional `gapMeasure`, so Undo and Redo restore the measure with the bar. Without it an undo would put the bar back at the head caret but the loupe on the anchor's measure.

**A stored record written by this slice carries `entered.measureIndex`** (`correction.ts:85`, written by `enterEntry` at `entry.ts`, only when the gap named a measure). A song saved after this slice reads back differently on a build before it: that build reads the field as absent and seats the note in the anchor's measure, which is today's behaviour (tested by dropping the field from a stored copy). A note entered at a TAIL caret also records its (equal) measure, which is redundant but harmless; a re-read that moved measure boundaries would leave such a record naming the old index. NOT ESTABLISHED how likely that is.

Tests (19) in `entered-measure.test.ts`: `enterEntry` with and without the measure and on an entry cursor; `applyCorrections` on a two-measure line (the note lands in the gap's measure, measure k − 1's events are the very same objects, k's own notes move along by the new note's length; the tail caret stays in k − 1; both gaps used, in either entered order; a chain off the new note; the head of the part; a record read by an older build); `CorrectionCursor` set, step in both directions, a walk out of a gap, and entering at the stepped-to head caret.

## Could not establish

- Why the two voiced Markup captures wobbled at x = 485 (see above).
- Whether any stored song already holds a hand-entered note at a head gap that the new field would move. Nothing reads such a record differently until it is re-entered; I did not look at any stored library (none here).
- The Oxford-comma and Canadian-spelling rules were followed in this file and the code comments I wrote. No user-facing string was added in either language, in any slice.
- The oscillation I saw while probing, at the very head of the piece: Left from the first entry (a rest) lands on « before the first entry » and the next Left returns to the rest, on `14e2ff8` as well. Not caused by this row, not investigated.
- A WebGPU or Mac check: none needed or run.

## Hand-off

Row 47 adds props at the two pane call sites and starts from `+page.svelte` at 5638 lines (ceiling 5638).
