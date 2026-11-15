# Report: strophic lane A, Step 3 (the render score: D3 and D4)

Brief r5, Step 3. Branch `cloud-lane-56`. Earlier steps: `report-code-strophic-a-step0_r1_2026-11-15.md`, `-step1_`, `-step2_`.

## What changed

- **New: `packages/score-parser/src/render-score.ts`** (about 290 lines). `renderScoreOf(parsed)` returns `{ score, bars, verses, path, boundaries, flags, declined? }`:
  - `score`: the `ParsedScore` MELODY will paginate. With one sung verse, or no later pass kept (D3.3), it is **the input itself, by reference**, with `path: 'notated'`.
  - `bars`: per printed index, `{ source, place, later, label? }`. `place` is the verse place (1 for the first sung verse; outside bars and pass 1 are place 1). `later` is true for bars that carry derived ids (the bars that go inert in D6 and take a tag in D7). `label` is set on the first later bar of each later pass.
  - `verses`: the lyric number each place sings.
  - `boundaries`: printed indices where the source order is not consecutive or the place or later-ness changes. This is the set the multibar-rest clause (D7, Step 4b) will take.
  - `declined: 'id-shape'`: the function returns the notated score untouched if any event id in the file already contains `~v` (D4's check, made at runtime as well as in the tree).
- **D3.1** (`planFromRepeats`): `unfold` on the lane's copy of the markers. For a repeat that no ending governs, `times` becomes the larger of the file's `times` (default 2) and the count of sung verses with words inside the repeat's span. Where endings exist and no bar carries a forward repeat, bar 0 takes one on the copy. A later run (a maximal stretch of entries with the same pass above 1) is kept only when some note in its source bars carries words for the p-th sung verse; a dropped run prints only the bars not already printed, as notated, with their markers. In a kept run a bar is a later-pass bar only when its source bar was printed earlier or it carries `ending`; every other bar keeps its ids and reads verse 1. The repeat and ending markers are stripped only where this function carried the repeat out.
- **D3.2** (`planStacked`): the span from the first to the last bar with a later verse's words prints once per verse; bars before and after print once; a bar whose `ending.passes` lacks k is left out of pass k. **The one-line stretch after the passage prints once, after the last verse: RULED by Dann 2026-11-15 02:44.** Markers are left on every copy, since nothing was unfolded.
- **D4**: each printed measure is a copy of its source with a new consecutive `index` and the printed `number` unchanged. Later-pass events take `<id>~v<k>`. `partnerEventId` of slurs and ties is rewritten to the partner's copy only where the partner is printed in the run of source-consecutive printed bars that holds the event (this covers the same pass, the outside bar that follows or precedes it directly, and pass 1's first and last bars with no special case); otherwise the pointer is removed. A tie start or continue whose next printed note is not its partner is removed (a `continue` becomes a `stop`). `keySignatures`, `timeSignatures`, `clefs`, `tempoMarkings`, `tempoWords`, and `metricModulations` are rebuilt with one entry per printed copy. `graceNotes` of a later-pass principal are copied with the derived principal id plus the grace suffix. `accompaniment` is dropped (MELODY does not draw it and it is keyed by notated bars).
- `verses.ts`: `sungVersesByBar` is now exported (it was private in Step 2). `index.ts` exports `renderScoreOf`, `derivedId`, and the two types.

## Tests added (`render-score.test.ts`, 22)

The repeat fixture prints introduction, passage three times, ending (22 bars), printed numbers repeat per pass (`1 2 3 4 5 6 7 8 3 4 5 6 7 8 3 4 5 6 7 8 9 10`), three passes come from three verses with no `times`, the bounding repeat's markers are gone and the input is unchanged, labels on printed bars 8 and 14 only, later-pass ids are derived and unique across the score, pass 1 and outside ids are the notated ids, each pass carries its own verse (and the refrain bars carry verse 1 in every pass), the tempo mark prints once on the ending, a later-pass slur points at its own pass's partner, a slur and a tie that would leave their pass are removed while one that leads into the ending in pass 3 is kept, a later-pass principal keeps its grace note under a derived id, and a file id containing `~v` is declined. Both volta fixtures print ending 1 in pass 1 and ending 2 in pass 2 (`1 2 3 4 1 2 3 5 6`), strip the endings and the repeat, and the bar after the second ending keeps its ids and takes no mark. The stacked fixture takes D3.2 (verse 1, 2, 3, then the two-bar stretch once). The one-verse repeat fixture and a score with no later verse return by reference. A later run with no words for its verse is dropped and its repeat stays notated. The tacet fixture prints `[0,1,2,3,0,1,2,3,4]` with boundaries at 4 and 8. The D8 baseline test (web) still passes; nothing is wired to MELODY yet.

## The songs on each path (the brief asks the report to list them)

I ran `renderScoreOf` over every `.musicxml` that git tracks (all 213, the lane's six fixtures included). **None of the 207 pre-existing tracked scores takes a non-notated path or raises a flag.** The six fixtures: `strophic-repeat` (repeats, 22 of 10 bars), `strophic-volta` and `strophic-volta-from-top` (repeats, 9 of 6), `strophic-tacet-boundary` (repeats, 9 of 5), `strophic-stacked` (D3.2, 16 of 8), `repeat-one-verse` (notated). **The only song that takes D3.2 is `strophic-stacked.musicxml`, and it has the one-line stretch** (bars 7 and 8, printed once after verse 3). This agrees with the scout packet: no committed song has a real second verse.

## Observations the brief does not state

- **Verses beyond the passes.** With endings, `unfold` takes the pass count from the endings, not the verses. A song with three verses and two endings prints two passes, and verse 3 is not printed. I did not invent a rule for it. A volta that names pass 3 (`number="2,3"`) gives three passes.
- **Pass 1 prints the verse-1 view's syllables** in a kept score, as D2 said it would after Step 0's measurement; this is where it happens.
- **`unfold`'s own span rule is replicated, not called**: a closed span returns the baseline to the top, so a second backward repeat with no forward repeat returns to bar 1. `repeatSpans` mirrors it so the `times` raise lands on the right bar. I did not test the jump-family path (`daCapo` and the others) beyond the code reading: `unfold` handles it and `times` is read there at `unfold.ts:622`, but no fixture exercises a jump with two verses. **NOT ESTABLISHED.**
- The mid-system assertion for fixture 1 (Step 1's deferred item) is not in this step. It needs real widths, so it lands in Step 4a.

## Gates (after Step 3)

RESULT_TABLE

## Pictures

None. Step 3 is pure code; nothing draws yet.

## What I could not establish

- Behaviour on a jump (da capo and the like) combined with two verses.
- Whether `unfold`'s flag for a nested repeat or a multi-span volta fires on any real song, since the tree holds no real strophic song.
- How a printed slur or tie that crosses a first-ending bar into a repeat's start (rather than across the pass seam) should read; the test covers only the pass seam and the outside bar after the passage.
