# Report, lane 70, step 4: the gates, the suites, and the risks

2026-11-19. Branch `cloud-lane-70`, tree at `634056b3` (steps 0 to 3b committed; step 4 adds only this report). `git status -s` clean before this file. Brief section 3, step 4, with Dann's amendment of this session (slowest ten files and total wall-clock for gate 4; both baseline forms for gate 4).

## 1. The eight gates against their baselines

Run on the repaired tree, from a fresh `pnpm install --frozen-lockfile`. Logs in the session scratchpad, not committed.

| Gate | Baseline | Measured | Verdict |
| --- | --- | --- | --- |
| 1 phonology | `462 passed (462)` | `Tests 462 passed (462)`, 14 files | at baseline |
| 2 dictionary | `248 passed (248)` | `Tests 248 passed (248)`, 4 files | at baseline |
| 3 web-check | `found 0 errors and 12 warnings in 5 files` | `svelte-check found 0 errors and 12 warnings in 5 files` | at baseline |
| 4 web-test | `6691 passed \| 1 skipped (6692)` **or** `6687 passed \| 5 skipped (6692)` | `Tests 6687 passed \| 5 skipped (6692)`, 362 files, 0 failed | at baseline, second form (see section 2) |
| 5 score-parser | `904 passed \| 5 skipped (909)` | `Tests 904 passed \| 5 skipped (909)`, 43 files | at baseline |
| 6 blurb | `178 passed (178)` | `Tests 178 passed (178)`, 5 files | at baseline |
| 7 integration | `159 passed (159)` | `Tests 159 passed (159)`, 7 files | at baseline |
| 8 ratchets | `ratchets: OK.` | `ratchets: OK.` | at baseline |

Gate 3: the twelve warnings are in `InspectorPanel.svelte` (3), `IntakePanel.svelte` (5), `ReadingPaper.svelte` (1), `LearnContent.svelte` (2), and `+page.svelte` (1), the same before and after the repair (`pnpm --filter @ilya/web check --output machine`). None is in `InsightsPane.svelte`.

Gate 8: the ratchet for `apps/web/src/lib/insights/InsightsPane.svelte` is **744 before, 677 after** (`scripts/ratchets.json:18`). The file's line count by `scripts/ratchets.mjs:63` was 742 and is 677. No baseline was moved by me.

No gate moved. Nothing was changed because of any measurement here.

## 2. Gate 4: both baseline forms, the skips, and the timing

**Both forms, as Dann stated them in this session.** `~/Downloads/ilya-ship.sh:180` carries `6691 passed | 1 skipped (6692)` when python3 has numpy and scipy, and `6687 passed | 5 skipped (6692)` when it does not. The brief gave only the first form; that was the desk's error. I did not read the ship script (it is not in this sandbox: `wc -c ~/Downloads/ilya-ship.sh` says no such file), so the two forms are Dann's word and are recorded here as such.

**What I measured is the second form.** The python check I ran here: `python3 -c "import numpy, scipy"` fails with `ModuleNotFoundError: No module named 'scipy'`; `python3 -c "import numpy"` succeeds (numpy 2.5.3). So in this sandbox numpy is present and scipy is absent. I report that exactly; whether the second form is keyed to scipy alone or to both is for the ship script, which I did not read.

**The five skipped tests**, from the JSON reporter (`status` other than passed), none chased:

- `src/lib/reader/heic-decode.test.ts`: "decodeHeic on the real iPhone photograph (ILYA_HEIC_REAL) is upright: row-to-row variation" (the one skip that the first baseline form has too).
- `src/lib/voice/engine/burg.test.ts`: four tests ("Test 1" twice, "Test 3" twice), all against `burg.py`, the Python reference. These are the four extra skips.

**Total wall-clock.** `time pnpm exec vitest run --reporter=json --outputFile=...` in `apps/web`: `real 7m15.589s` (`user 12m2.416s`, `sys 0m33.835s`). That is the run whose JSON the table below comes from. The earlier gate 4 run (the one that produced the figures in section 1) was not timed. No config was changed: `--reporter` and `--outputFile` are command-line flags.

**The ten slowest test files** (per-file time is the JSON reporter's `endTime` minus `startTime` for each file; for every one of these the sum of its tests' own durations is the same figure to the tenth of a second):

| # | File (under `apps/web/`) | Seconds |
| --- | --- | --- |
| 1 | `src/lib/text/poem-arias.test.ts` | 35.6 |
| 2 | `src/lib/text/poem-match.test.ts` | 16.9 |
| 3 | `src/lib/voice/engine/i-extractor.test.ts` | 14.5 |
| 4 | `src/lib/voice/engine/path-extract.test.ts` | 10.1 |
| 5 | `src/lib/voice/engine/open-extract.test.ts` | 9.8 |
| 6 | `src/lib/voice/chart/grid-numbers.test.ts` | 9.5 |
| 7 | `src/lib/text/poem-offer.test.ts` | 6.2 |
| 8 | `src/lib/voice/engine/live.test.ts` | 6.0 |
| 9 | `src/lib/voice/engine/analyze.test.ts` | 5.4 |
| 10 | `src/lib/text/syntactic-break-unit.test.ts` | 4.1 |

The ten together are about 118 seconds. The suite took 435.6 seconds in wall-clock, so the slowest ten are not most of the wall-clock: files run in parallel workers (`user` time is 722 seconds), and each file's own figure leaves out import and transform time. What the other ~316 seconds is spent on, I did not measure. The run was in a cloud sandbox with a dev server idle in the background; a Mac will differ.

## 3. The Playwright suites

Setup: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, `--trace off`, one worker, against the dev server.

| Suite | Result |
| --- | --- |
| `chromium`: `insights-key-lines` (step 2) | 15 passed |
| `chromium`: `insights-page`, `insights-no-score`, `insights-links`, `print-pages`, `voice-links`, `voice-stations`, `pages-without-gaps` | 68 passed (13.6m) |
| `phone`: the whole project (22 files) | **52 passed, 5 failed, 1 skipped (10.0m)** |

The full `chromium` project (45 files) was not run; only the INSIGHTS-related files above. The one skip in `phone` is `loupe-scan.test.ts:409` ("real clicks on a measure that did not converge"); I did not read why it is skipped.

**The five phone failures, one by one.**

1. `e2e-phone/insights-links.test.ts:32`, "L1 with the Drawer open on VOICE lands on its station, in view": `expect(boundingBox().y).toBeGreaterThanOrEqual(0)` received `-0.0625`. This is one of the two known flake sites the brief names (risk 4). **Run alone it passed**, together with its Drawer-lowered sibling (`2 passed`, and `phrase-ends` failed in that same run, see 3). So: known flake, passed alone.
2. `e2e-phone/input-views.test.ts:134`, "a poem typed into Poem moves no seat of «Within Four Walls»": the line under the view expected "Your score's sung words are in Lyrics" and received "The words as sung, as the score sets them. Coloured words differ from the poem: ...".
3. `e2e-phone/phrase-ends.test.ts:26`, "Tchaikovsky onto an empty song": `[data-word-index="0-77"]` not found. Failed again when run alone.
4. `e2e-phone/relining.test.ts:70`, "y. a poem pasted into Poem lays Lyrics out in its lines": expected 1 line, received 10.
5. `e2e-phone/relining.test.ts:95`, "bb. a poem typed key by key lays Lyrics out after the pause".

**Failures 2 to 5 are not this lane's.** I ran those tests (`phrase-ends`, `relining`, `input-views:134`) on `61536a9f`, the commit this branch was cut from and before any lane 70 change, in a separate git worktree outside the repository's tree (with the three git-ignored build folders `static/heif`, `static/omr`, `static/pdfjs-wasm` copied in so the static assets matched): `input-views:134`, `phrase-ends:26`, `relining:70`, and `relining:95` failed there too, with the same two error types; `relining:112` passed there. The worktree was removed afterwards (`git worktree list` shows only this checkout). So these four fail on the base tree in this sandbox. **Why they fail here I did not establish.** They concern Text, Poem, and Intake, and none touches INSIGHTS; I did not investigate.

## 4. The six risks of section 6 of the brief

1. **`insights-label.test.ts`**: all four cases passed. Label line counts, from the test's own `console.log` lines: English, five semitones G3 to D4: **1 line**, widest right edge 286.0 against figure right 314.4; English, two semitones G3 to A3: **1 line**, 286.0 against 314.4; French, five semitones: **2 lines**, 277.4 against 314.4; French, two semitones: **2 lines**, 277.4 against 314.4. Not deleted, renamed, or loosened. The figure's drawn width is now the same in every viewport, as the brief predicted; the narrow cut the test was written for is not drawn anywhere. The comparison is still like with like (both boxes are scaled together), but I did not check that the test's 0.5 px tolerance, which is now about 1.2 px of page space, is still meaningful; it passes.
2. **`insights-links.test.ts`**: the on-screen copy is picked by `b.x >= 0 && b.x < 390`; L1 lowered, L1 open, L6 lowered, L6 open all passed on the repaired tree (L1 open failed once in the full run and passed alone, risk 4).
3. **`voice-stations.test.ts`**: all six tests passed in the full `phone` run, including `:62` twice ("Add your range" with the Drawer lowered and raised). The measurer is inert, and one copy was found.
4. **The two known flakes**: `voice-stations.test.ts:62` passed; `insights-links.test.ts:32` failed once in the full run (section 3, item 1) and passed alone. Both results reported as the brief asked.
5. **`TitleHeader.svelte:130-141`**: INSIGHTS reaches it: `InsightsPane.svelte:496` opens `<TitleHeader`. The effect reads `range.getClientRects()` (`:130`) and sums the last line's rect widths (`:135`), which a CSS transform scales, and compares that with `rowWidth` and `legendWidth` (`:137`). Under the 0.419 fit those rect widths are scaled. Whether that changes where the legend goes in INSIGHTS is **not established**: in the BASS_B2 picture the title ("Without Sun, no. 1: Within Four Walls") sits on one line with the compass figure beside it, and I did not try a title long enough to wrap. TEXT and MELODY run the same code under the same fit. Repaired nothing.
6. **The footer**: it now reads the real count. `insights-p1-390x844-fr.png` shows "PAGE 1 SUR 3" and the English picture "PAGE 1 OF 3" (read from the pictures). That is the intended change.

## 5. Done-when, against the brief's section 8

- A layout under 1400 px shows INSIGHTS as the 816 px page scaled by `PageFit`: measured `scale(0.419118)` at 390, `scale(0.882353)` at 768, and `scale(1)` centred at 1024 (step 3). The page furniture (header, wordmark, staff figure, footer with the real page count) is in the pictures. Whether it is "the same furniture TEXT and MELODY show" I did not compare picture for picture; I did not take pictures of TEXT or MELODY.
- No `insights-flow`, `flow-head`, `flow-body`, `flowWidth`, or `flowSegments` remains under `apps/`: `grep -rnE ... apps/` (excluding `node_modules`, `.svelte-kit`, `build`, `test-results`) returns 0 lines.
- The eight gates stand at their baselines (section 1), and the `InsightsPane.svelte` ratchet is lowered, 744 to 677.
- The pictures and the six measurements of steps 3 and 3b exist (`docs/sessions/lane70-shots/`, the step 3 and 3b reports).

## NOT ESTABLISHED

1. The contents of `~/Downloads/ilya-ship.sh`: not present in this sandbox. The two gate 4 baseline forms rest on Dann's statement in this session, and the md5 `a13b0969...` the brief quotes was not checked.
2. Whether the second gate 4 form depends on numpy, on scipy, or on both. Here numpy is present and scipy is not.
3. Why the four phone tests (`input-views:134`, `phrase-ends:26`, `relining:70`, `relining:95`) fail on the base tree in this sandbox. They fail identically before and after lane 70.
4. Whether those four fail on the maintainer's machine. Unknown.
5. Why `loupe-scan.test.ts:409` is skipped.
6. The full `chromium` project: only the INSIGHTS-related files ran (83 tests in total, all passed).
7. What the other ~316 seconds of gate 4's wall-clock is spent on.
8. Whether `TitleHeader`'s scaled-versus-unscaled comparison changes INSIGHTS's legend placement for a title that wraps.
9. Whether the INSIGHTS page's furniture matches TEXT's and MELODY's in a side-by-side picture.
10. The known flake's cause (`docs/memory/STATE.md:23` says NOT ESTABLISHED; I did not investigate).
11. The French asterisks in the key lines (step 3 report, section 5) and the 3b gaps (`.more summary`, `.input-link`), carried from earlier steps.
