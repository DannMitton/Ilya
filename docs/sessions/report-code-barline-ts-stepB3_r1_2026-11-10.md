# Report: step B3, the Barline verb (Code, cloud lane 43, r1, 2026-11-10)

Commit: "B3: the Barline verb in the CORRECTIONS pane". Files: `score/barline-marks.ts` (new), `score/barline-ui.ts` (new), `score/correction-verbs.svelte.ts`, `score/bar-layer.ts`, `score/CorrectionSurface.svelte` (1227 → 1226), `routes/+page.svelte` (5522, +3 over B2), `i18n.ts` (the ratified strings), tests (`barline-marks.test.ts` 9, `correction-verbs.test.ts` +4, `e2e/barline-verb.test.ts` 3, the `tempo` pins), and the key index in `i18n.ts`.

## What the singer gets

In the Loupe's CORRECTIONS pane, beside Rest and Tie: **Barline**. On a note whose next entry is in the same bar its accessible name is "Add a barline after this note"; where a barline follows, "Remove the barline after this note" (`data-barline="add"` or `"remove"`; the cell is lit in the second state). It is disabled in a gap and absent where neither is offered: the last entry of the song, a note inside a tuplet group, a removal the layer would not honour (the second bar opens a change of time signature, key, or clef, a repeat, an ending, a jump, a rehearsal mark, or carries her own time signature: Fable finding 9 and amendment 10, by construction). Every fix shows at once, is one Undo step named "barline added" or "barline removed", and is redone by Redo.

## How

- **`barlineVerb(read, line, map, id)`** (`barline-marks.ts`, pure): finds the entry after the held one and asks `rebar` itself whether a candidate mark lands (a division splits the bar; a removal joins the two), so the verb never offers what the layer would refuse and does not hold a second copy of its rules. Add writes `'before'` on the next entry, or clears its `'none'` where one removed the reading's barline; Remove writes `'none'`, or clears its `'before'`. So **add then remove, and remove then add, leave no record behind, in both orders** (tested). A mark that empties a record drops the record.
- **`CorrectionVerbs.barline` and `.handleBarline`**, through the same `pushUndo` and `setCorrections` as `toggleRest` and `toggleTie`.
- **`barlineUi`** (`barline-ui.ts`): a singleton the page attaches (`+page.svelte`, the `loupePrint` and `clefUi` pattern), so the cell two components below the page needs no prop through `Loupe.svelte` (at its ceiling). One new line in `CorrectionSurface.svelte`, paid for by putting the Rest cell's markup on one line (7 lines to 1).
- **Restore keeps the bar's marks** (amendment 6): `restoreAvailable` is now "the note is amended", not "a record exists", so a note that only carries a barline offers no Restore, and Restore on one that carries both clears the note and keeps the barline (tested).
- **Strings.** Every string of the ratified batches is in `i18n.ts`, English and French exactly as in `rulings-2026-11-09-evening.md` (21:35, 21:44, 22:08, 22:09): `loupe.barline`, `loupe.timeSignature`, `loupe.divide`, `loupe.divideOffer`, `loupe.divideOfferOpening`, `loupe.divideOfferClosing`, `correct.barlineAdd`, `correct.barlineRemove`, `correct.tsChange`, `correct.tsBeats`, `correct.tsBeatType`, `correct.tsToNext`, `correct.tsToEnd`, `correct.tsRebar`, `correct.tsRebarHelp`, and the four Undo words `loupe.undo.barlineAdded`, `.barlineRemoved`, `.timeSignature`, `.divided`. `insights.phonation.estimatedMetre` now reads "from this score's {metre} time signature" and « d'après le chiffrage de mesure {metre} de cette partition; » (22:08, 22:09); its three pins in `tempo/tempo.test.ts` and one in `e2e/tempo.test.ts` follow. The key index at the head of `i18n.ts` is restated (1,186 to 1,205 keys; `correct` 23 to 32; `loupe` 112 to 122), as `i18n-index.test.ts` requires.
- **GUIDE.** "GUIDE's wording aligns with 'time signature' wherever it says metre, meter, or meter signature" (22:08): a search of `GuideContent.svelte` and `i18n.ts` for those words finds none other than the `estimatedMetre` key (the one hit in `LearnContent.svelte` is "millimetres"). Nothing else to change.

## Browser walk (Playwright, chromium, headless, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`)

`e2e/barline-verb.test.ts` (3, pass): on the fused fixture the tag reads `8 of 4`, Add makes the cell Remove and the `8 of 4` goes, Undo brings both back, Redo puts them forward; on the clean fixture Remove makes the merged bar read `8 of 4`, Undo restores, and Remove then Add leaves the song as it was; after Add the next note, reached with the arrow keys, is in bar 5.

## Gates

| gate | result |
|---|---|
| 1 `pnpm test:phonology` | 456 passed |
| 2 `pnpm test:dictionary` | 248 passed |
| 3 `pnpm --filter @ilya/web check` | 0 errors, 12 warnings |
| 4 `pnpm --filter @ilya/web test` | 4760 passed, 1 skipped (261 files) |
| 5 `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped |
| 6 `pnpm test:blurb` | 168 passed |
| 7 `pnpm test:integration` | 125 passed |
| 8 `pnpm ratchets` | OK |

**Playwright, both projects, whole suites.** chromium: 137 passed, 9 failed, 1 skipped. phone: 24 passed, 4 failed, 1 skipped. I ran the failing files again on a clean checkout of `534d9981` (a git worktree, same browser, same flags):

- **Fail identically on the baseline (not mine):** chromium `glue-typed-marks` (2), `heic-reader-path`, `insights-page`, `loupe-header` line 47, `print-pages`, `singer-paths` Learn and Guide; phone `input-views` line 134, `phrase-ends`, `relining` (2).
- **Mine, fixed:** chromium `tempo` French (`e2e/tempo.test.ts:169` pinned the old French of `estimatedMetre`). The same sentence's English pin was fixed with it.
- **Flaky, passes on rerun:** chromium `loupe-header` line 35 (Undo and Redo in the header).

The new `e2e/barline-verb.test.ts` (3) passes. The whole-suite run took 33 minutes for chromium and 7 for phone.

## What I could not establish

- The pinned `@playwright/test` wants `chromium_headless_shell-1208`, which this sandbox does not have; the pre-installed Chromium, passed through `PW_CHROMIUM_PATH`, runs the suite. I did not run `playwright install`.
- Whether Dann wants the cell hidden or disabled where neither verb is offered: the brief says hidden, and that shifts the cells of the row by one place when a note with an offer is followed by one without. I followed the brief.
- A gap: the cell is shown disabled in a gap, so it does not appear and disappear as the bar moves between entries and gaps. Not asked for; DESK DEFAULT.
