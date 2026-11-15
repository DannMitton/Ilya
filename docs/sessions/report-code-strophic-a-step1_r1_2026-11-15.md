# Report: strophic lane A, Step 1 (fixtures)

Brief r5, Step 1. Branch `cloud-lane-56`. Base `fb9d829e`; Step 0 is `report-code-strophic-a-step0_r1_2026-11-15.md`.

## What changed

Six new files in `packages/score-parser/src/fixtures/`, each with its source in a head comment (a synthetic fixture written by script for this lane; no scan and no printed song; the words are plain Russian syllables chosen for their counts):

- `strophic-repeat.musicxml`: a 2-bar introduction of whole-bar rests; a six-bar passage inside a forward and a backward repeat (bars 3 to 8), the backward repeat with no `times`; three Cyrillic verses in bars 3 to 6; a one-line refrain in bars 7 and 8 (verse 1 only); a two-bar ending (bars 9 and 10) of one line of words, with one tempo mark (quarter = 60) on bar 9. Bar 4: verse 1 sings two syllables on two notes that verses 2 and 3 sing as one (syllable and a continuation). Bar 5: the reverse. Bar 6: one slur over its first two notes in every verse.
- `strophic-volta.musicxml` (forward repeat on bar 1) and `strophic-volta-from-top.musicxml` (no forward repeat): two verses in bars 1 to 3; bar 4 is volta 1, closed by the backward repeat; bar 5 is volta 2; bar 6 follows volta 2. Volta bars carry one line of words.
- `strophic-stacked.musicxml`: a 2-bar introduction, four bars with three verses stacked, a 2-bar one-line ending, and no repeat, ending, or jump mark.
- `repeat-one-verse.musicxml`: a repeat over bars 1 to 3 with one verse, then one bar.
- `strophic-tacet-boundary.musicxml`: two parts. The voice part is empty in bar 1 (piano introduction) and in bar 4 (piano interlude, closed by the backward repeat of a repeat from the top); bars 2 and 3 carry two verses; bar 5 follows.

One new test file, `packages/score-parser/src/strophic-fixtures.test.ts` (13 tests): each fixture parses with the verses and markers its head comment states; none contains `~v`; the tacet fixture's `tacetRuns` is bars 0 and 3 as two separate runs (so the boundary problem of D7 is real in the file: after unfolding they will be adjacent).

`apps/web/src/lib/markup/strophic-byte-baseline.test.ts` now lists the six new paths in `FIXTURES_ADDED_BY_THE_LANE`.

## Gates (after Step 1)

| Gate | Count |
| --- | --- |
| phonology | 462 passed (462) |
| dictionary | 248 passed (248) |
| svelte-check | found 0 errors and 12 warnings in 5 files |
| web unit | 6025 passed, 1 skipped (6026) |
| score-parser | 855 passed, 5 skipped (860) |
| blurb | 178 passed (178) |
| root integration | 159 passed (159) |
| ratchets | OK |

The web count rose from 5817 to 6025 because the D8 baseline test adds 208 cases (207 scores and the list check); the score-parser count rose by the 13 fixture tests.

**A flaky timing test.** `src/lib/voice/engine/open-extract.test.ts` ("gives the same reading whichever vowel is asked") has the 5000 ms default timeout and measured 5.0 to 5.4 s in this sandbox under the full suite's load. It passed in the first untouched run and alone twice, and failed in three of the four full runs between Step 0 and this step, including one with the lane's new test excluded. It is not this lane's, I did not change it, and the Step 1 run above is a pass. Under the CI machine it may behave differently.

## Pictures

None. Step 1 draws nothing.

## What I could not establish

- **The mid-system assertion on fixture 1** ("a later pass begins mid-system at desktop width and at 390 px; lengthen the introduction until both hold") needs the render score, which Step 3 builds. I cannot test where pass 2 begins before the passes exist. I left the introduction at the brief's two bars, and the assertion lands in Step 3 (render score) or Step 4a (real widths), where I will lengthen the introduction in the generator if it does not hold and say so.
- Whether Finale, Sibelius, MuseScore, or Dorico would write these shapes as I have (a rest-only introduction bar as `<rest measure="yes"/>`). They are my hand shapes, not a reading of any export.
