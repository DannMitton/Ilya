# Report: which bars to confirm (Corrections slice 1, QUEUE row 51)

Cloud lane (Claude Code, Sonnet), branch `cloud-lane`, brief `brief-code-bars-to-confirm_r1_2026-10-09.md`. Read at `53035bd` (`origin/Shane`), working tree clean before the change. Status: `WRITTEN` on the code. `DONE` is Dann's look, and its run on the 17 song readings is for Code on the Mac after row 57.

## Section 3, answers first

### 3.1 What a parsed score carries that the bar rule needs

| Need | Field | Where | Carried? |
|---|---|---|---|
| Pickup mark | `Measure.isPickup` | `packages/score-parser/src/types.ts:270`; set for a short measure 0 at `musicxml-parser.ts:616` and `:629` (`adoptPickupMeter`, `pickup.ts`), and at `mnx-parser.ts:698` | Yes, for the first bar only. A short bar anywhere else gets a `measure-duration-mismatch` warning, not the mark. |
| First bar | `ParsedScore.measures[0]` | `types.ts:58` | Yes, by position. No flag. |
| Final bar | none | | **Not carried as a field.** It is the last entry of `measures`, or the last measure that holds a vocal event. This module uses the last measure that holds an event. |
| Repeat signs | `Measure.repeatStart`, `Measure.repeatEnd`, `repeatTimes`, `ending` | `types.ts:273-290`; read from `<repeat>` at `musicxml-parser.ts:539-558` | Yes. **No fixture in the repository has a `<repeat>` element**, so this is exercised by unit tests only. |
| Double bar | none | | **Dropped.** The `barline` case reads only `<repeat>` and `<ending>` (`musicxml-parser.ts:539-558`); `<bar-style>` is never read. The fixtures hold 35 `heavy-heavy`, 10 `light-heavy`, 12 `dotted`, and 51 `regular` bar styles, none of which reaches `ParsedScore`. |
| Metre change | `Measure.timeSignature` (snapshot per measure), `Measure.expectedDuration`, `ParsedScore.timeSignatures` | `types.ts:252`, `:73` | Yes. |
| Printed measure number | `Measure.number` (string) | `types.ts:249` | Yes. A pickup may be `'0'`, `''`, or `'X'`. |

### 3.2 The count over every tracked `.musicxml` (`git ls-files '*.musicxml'`, 58 files)

Columns: bars that hold an event; bars `measureFill` names; bars `aggregatePhonation` calls `untrusted` (its two readings disagree and neither fits); bars it calls `agreed` that do not fit the metre; bars the new function names; bars the new function sets aside, with the reason.

| File | Bars with events | `measureFill` | Insights `untrusted` | Insights `agreed`, not fitting | New function | Set aside |
|---|---|---|---|---|---|---|
| `omr/fixtures/sun3-2.musicxml` | 12 | 7 | 0 | 6 | 6 | 1(4 of 6,pickup,first=true,last=false) |
| `omr/fixtures/tch-1.musicxml` | 27 | 0 | 0 | 0 | 0 |  |
| `omr/fixtures/tch-2.musicxml` | 35 | 35 | 0 | 35 | 35 |  |
| `omr/fixtures/tch-3.musicxml` | 37 | 37 | 0 | 37 | 37 |  |
| `score/ingestion/fixtures/sunless-01-engraved.musicxml` | 17 | 1 | 1 | 0 | 1 |  |
| `assembly-a-scan-to-a-seated-song_r1_2026-10-04/tch-op38-3-from-scan_as-printed.musicxml` | 99 | 0 | 0 | 0 | 0 |  |
| `assembly-a-scan-to-a-seated-song_r1_2026-10-04/tch-op38-3-from-scan_modern.musicxml` | 99 | 0 | 0 | 0 | 0 |  |
| `baseline-on-the-singers-path_r1_2026-10-06/joined/sun1.musicxml` | 17 | 1 | 0 | 1 | 1 |  |
| `baseline-on-the-singers-path_r1_2026-10-06/joined/sun4.musicxml` | 27 | 1 | 0 | 1 | 1 |  |
| `baseline-on-the-singers-path_r1_2026-10-06/joined/sun5.musicxml` | 66 | 5 | 0 | 5 | 5 |  |
| `baseline-on-the-singers-path_r1_2026-10-06/joined/sun6.musicxml` | 48 | 0 | 0 | 0 | 0 |  |
| `baseline-on-the-singers-path_r1_2026-10-06/joined/tch.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `measure-checks_r1_2026-10-05/joined/sun1.musicxml` | 17 | 1 | 0 | 1 | 1 |  |
| `measure-checks_r1_2026-10-05/joined/sun4.musicxml` | 27 | 1 | 0 | 1 | 1 |  |
| `measure-checks_r1_2026-10-05/joined/sun5.musicxml` | 66 | 4 | 0 | 4 | 4 |  |
| `measure-checks_r1_2026-10-05/joined/sun6.musicxml` | 48 | 0 | 0 | 0 | 0 |  |
| `measure-checks_r1_2026-10-05/joined/tch.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `measure-phase1_r1_2026-10-02/tchaikovsky-op38-3-voice.musicxml` | 99 | 0 | 0 | 0 | 0 |  |
| `restore-reads-with-homr_r1_2026-10-05/after-drop-reload.kept.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `restore-reads-with-homr_r1_2026-10-05/after-drop.dropped.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `restore-reads-with-homr_r1_2026-10-05/after-restore-1-old-state.kept.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `restore-reads-with-homr_r1_2026-10-05/after-restore-2-kept.kept.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `restore-reads-with-homr_r1_2026-10-05/after-restore-3-stamp-changed.kept.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `restore-reads-with-homr_r1_2026-10-05/before-drop.dropped.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `step2-on-the-alias_r1_2026-10-06/alias-drop.dropped.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `step2-on-the-alias_r1_2026-10-06/alias-old-restore-1.kept.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `step2-on-the-alias_r1_2026-10-06/alias-old-restore-2.kept.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `step2-on-the-alias_r1_2026-10-06/alias-reload-1.kept.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `step2-on-the-alias_r1_2026-10-06/alias-reload-2.kept.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `sunless3-diagnosis_r1_2026-10-06/reads/join-repro-raw-page1.musicxml` | 12 | 11 | 0 | 11 | 11 |  |
| `sunless3-diagnosis_r1_2026-10-06/reads/join-repro-raw-page2.musicxml` | 12 | 12 | 0 | 12 | 12 |  |
| `sunless3-diagnosis_r1_2026-10-06/reads/join-repro-raw-page3.musicxml` | 20 | 12 | 0 | 12 | 12 |  |
| `sunless3-diagnosis_r1_2026-10-06/reads/join-repro-raw-page4.musicxml` | 18 | 14 | 0 | 14 | 14 |  |
| `sunless3-diagnosis_r1_2026-10-06/reads/sunless3-wasm-joined.musicxml` | 36 | 16 | 0 | 15 | 15 | 1(2 of 4,pickup,first=true,last=false) |
| `sunless3-diagnosis_r1_2026-10-06/reads/sunless3-wasm-page1.musicxml` | 12 | 1 | 0 | 0 | 0 | 1(2 of 4,pickup,first=true,last=false) |
| `sunless3-diagnosis_r1_2026-10-06/reads/sunless3-wasm-page2.musicxml` | 12 | 7 | 0 | 6 | 6 | 1(4 of 6,pickup,first=true,last=false) |
| `sunless3-diagnosis_r1_2026-10-06/reads/sunless3-wasm-page3.musicxml` | 9 | 3 | 0 | 3 | 3 |  |
| `sunless3-diagnosis_r1_2026-10-06/reads/sunless3-wasm-page4.musicxml` | 3 | 1 | 0 | 1 | 1 |  |
| `sunless3-diagnosis_r1_2026-10-06/reads/sunless3-webgpu-joined.musicxml` | 36 | 16 | 0 | 15 | 15 | 1(2 of 4,pickup,first=true,last=false) |
| `sunless3-diagnosis_r1_2026-10-06/reads/sunless3-webgpu-page1.musicxml` | 12 | 1 | 0 | 0 | 0 | 1(2 of 4,pickup,first=true,last=false) |
| `sunless3-diagnosis_r1_2026-10-06/reads/sunless3-webgpu-page2.musicxml` | 12 | 7 | 0 | 6 | 6 | 1(4 of 6,pickup,first=true,last=false) |
| `sunless3-diagnosis_r1_2026-10-06/reads/sunless3-webgpu-page3.musicxml` | 9 | 3 | 0 | 3 | 3 |  |
| `sunless3-diagnosis_r1_2026-10-06/reads/sunless3-webgpu-page4.musicxml` | 3 | 1 | 0 | 1 | 1 |  |
| `webgpu-against-wasm_r1_2026-10-05/wasm.joined.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `webgpu-against-wasm_r1_2026-10-05/wasm.page1.musicxml` | 27 | 0 | 0 | 0 | 0 |  |
| `webgpu-against-wasm_r1_2026-10-05/wasm.page2.musicxml` | 35 | 35 | 0 | 35 | 35 |  |
| `webgpu-against-wasm_r1_2026-10-05/wasm.page3.musicxml` | 37 | 37 | 0 | 37 | 37 |  |
| `webgpu-against-wasm_r1_2026-10-05/webgpu.joined.musicxml` | 83 | 0 | 0 | 0 | 0 |  |
| `webgpu-against-wasm_r1_2026-10-05/webgpu.page1.musicxml` | 27 | 0 | 0 | 0 | 0 |  |
| `webgpu-against-wasm_r1_2026-10-05/webgpu.page2.musicxml` | 35 | 35 | 0 | 35 | 35 |  |
| `webgpu-against-wasm_r1_2026-10-05/webgpu.page3.musicxml` | 37 | 37 | 0 | 37 | 37 |  |
| `b1-ledger-lines/b1-ledger-lines.musicxml` | 4 | 0 | 0 | 0 | 0 |  |
| `b2-tuplets/b2-tuplets.musicxml` | 5 | 0 | 0 | 0 | 0 |  |
| `b3-ledger-lines-scale/b3-ledger-lines-scale.musicxml` | 4 | 0 | 0 | 0 | 0 |  |
| `close-fixture/close-fixture.musicxml` | 6 | 0 | 0 | 0 | 0 |  |
| `irregular-fixtures/a/fixture-a.musicxml` | 6 | 0 | 0 | 0 | 0 |  |
| `irregular-fixtures/b/fixture-b.musicxml` | 6 | 0 | 0 | 0 | 0 |  |
| `irregular-fixtures/c/fixture-c.musicxml` | 4 | 0 | 0 | 0 | 0 |  |
| **58 files** | **2425** | **342** | **1** | **334** | **335** | |

How the totals reconcile. `measureFill` names 342 bars. The Insights check names 1 as `untrusted`, 334 more are `agreed` yet do not fit, and 7 are the pickup bars that `metrePerMeasure` sets aside (`phonation.ts:277-289`) and so never test: 1 + 334 + 7 = 342. The Insights words "does not add up" therefore cover 1 of 342, which is why the brief calls that check narrower.

The new function names 335. The 7 it sets aside are all a short first bar (rule 1, the anacrusis): `sun3-2` (4 of 6), and in the Sunless 3 diagnosis reads `sunless3-wasm-joined`, `-wasm-page1`, `-wasm-page2`, `-webgpu-joined`, `-webgpu-page1`, `-webgpu-page2` (2 of 4, 2 of 4, 4 of 6, and their webgpu twins). No file shows a bar named by the new function that `measureFill` did not name. No difference comes from a repeat sign, because none of these 58 files has a repeat. The 7 differences are all first bars, so each is explained by rule 1 alone; none is a completing last bar.

The 17 song readings that row 37 measured are not in the repository. The 58 files include the OMR runner's own fixtures (`tch-2`, `tch-3` and their copies have every bar named by `measureFill`: 35 of 35 and 37 of 37; the cause is NOT ESTABLISHED here), so this table is not a count of true misreads.

## The change

- `apps/web/src/lib/score/bars-to-confirm.ts` (new): `barsToConfirm(score)` returns `{ measureIndex, number, actual, expected }[]` in bar order. It calls `measureFill` (`apps/web/src/lib/score/entry.ts:412`) for the arithmetic and reads each bar against its own `Measure.timeSignature`. It then sets aside (1) a short first bar, and (2) and (3) a pair of short bars whose lengths make one whole bar, where the pair is the first and last bar of the piece, the bars either side of a repeat sign, or the first and last bar of a repeated section. It changes no note, stores nothing, and adds no string a singer sees.
- `apps/web/src/lib/score/bars-to-confirm.test.ts` (new): 18 tests.
- Nothing else changed. `measureFill`, the Insights check, `VocalLineEvent`, `+page.svelte`, `CorrectionSurface.svelte`, `Loupe.svelte`, `apps/web/src/lib/omr/`, and `tools/e16-harness/` are untouched.

## Tests

The 18 tests in `bars-to-confirm.test.ts`:

1. names a bar short by a beat, reading `3 of 4`
2. names a bar that is too long
3. does not name a bar that fits, nor a score of fitting bars
4. does not name a pickup
5. does not name a short first bar, flagged a pickup or not
6. does not name a pickup and the last bar that completes it
7. names a short last bar that does not complete the pickup
8. names a short last bar when the first bar is whole
9. still names a long first bar
10. honours a metre change
11. reads a bar in the signature's own unit, fractional where it must be (`6.5 of 6`)
12. sets aside the pair either side of a repeat sign and names a lone short bar elsewhere
13. sets aside the pair across a forward repeat sign
14. sets aside the first and last bar of a repeated section
15. does not set aside two short bars across a repeat sign that do not make a whole bar
16. names a short bar mid-piece when no repeat is carried (the double bar is not guessed)
17. skips bars with no event and gives the number as printed
18. changes no input and returns `[]` for an empty score

## The eight gates, at this commit

| # | Gate | Baseline at `53035bd` | Now |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 251 passed (251) | 251 passed (251) |
| 2 | `pnpm test:dictionary` | 235 passed (235) | 235 passed (235) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 2035 passed (2035) | **2053 passed (2053)** |
| 5 | `pnpm --filter @ilya/score-parser test` | 650 passed, 5 skipped (655) | 650 passed, 5 skipped (655) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | OK | OK (source files checked 398, now 400: the two new files) |

The one number that moved is gate 4, +18, from the 18 tests in `bars-to-confirm.test.ts`. A clean clone met all eight baselines before the change.

## Could not establish

- **Double bars.** The parser drops `<bar-style>`, so a short pair either side of a double bar that is not a repeat is named, not set aside. Carrying the double bar means a change in `packages/score-parser`, which this slice does not make. The desk decides whether to ask for it.
- **Repeats on real scores.** No tracked fixture has a `<repeat>`. The repeat rules are tested on synthetic scores only. Endings (voltas) are not read: a first and second ending that each close a short bar are not paired.
- **The 17 song readings.** Not in the repository; Code on the Mac runs this after row 57.
- **A real DOM.** The fixtures were parsed with the app's mini DOM (`apps/web/src/lib/score/ingestion/mini-dom.ts`), since the sandbox has no `DOMParser`. The table is the mini DOM's reading of the same XML.
- **"First bar" and "last bar" choices.** First bar is `measures[0]`. Last bar is the last measure that holds a vocal event. A vocal part that opens with empty bars and then a pickup is not given the first-bar exemption. That is the desk's call if it matters; I made it the strict way.
