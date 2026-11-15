# Report: strophic lane A, Step 2 (verses known: D1 and D2)

Brief r5, Step 2. Branch `cloud-lane-56`. Steps 0 and 1 are in `report-code-strophic-a-step0_r1_2026-11-15.md` and `report-code-strophic-a-step1_r1_2026-11-15.md`.

## What changed

All in `packages/score-parser/src/verses.ts` (34 lines before, about 155 now) and its tests. `vowel-resolver.ts` shows no diff (`git diff` of the file: empty).

1. **`sungVerseNumbers` (D1).** A lyric line whose syllables carry no Cyrillic letter (`\p{Script=Cyrillic}`) is not a verse. When no line carries one, every line counts, as before. Pass k of a passage sings the k-th number it returns.
2. **`verseView(parsed, verse)` (D2).** Returns the score as that lyric number sings it. On each sung note the syllable is the verse's entry, renumbered to verse 1, with no `versesInfo` or `verses`. In a one-line bar (no note carries any sung verse's words but the base verse's, the base being the first sung verse) the base verse's syllable stands for every verse. Anywhere else that the verse has no entry the note has no syllable. Event ids, bars, pitches, and durations are the input's own (`view.measures` is the same array). `dictionMarks` keeps the verse's own records renumbered to verse 1, plus the base verse's records where the event stands in a one-line bar. The input is not changed (a test compares the JSON before and after).
3. **`verseGapBars(parsed, verse)`.** The bars where some sung verse has words, that verse has none, and the bar is not a one-line bar. These are the bars the brief says the report lists.
4. `index.ts` exports `verseView` and `verseGapBars` beside `sungVerseNumbers`.

## Two things in the view the brief did not say

- **A non-primary verse loses its elision segments.** `versesInfo` holds text and type per verse and no `segments`, by design (`types.ts`, the `versesInfo` comment). A verse-N syllable that is not its note's primary therefore reaches the view as its joined text (`а‿б`), not as segments. A note's primary syllable keeps everything it carries (segments, `parseFlag`); a test pins that. **NOT ESTABLISHED:** whether the resolver treats a joined-text elision of a later verse as it treats the segmented one of verse 1. I did not run it, since no fixture has an elided later verse.
- **A view's syllable id is `<primary id>:verse<N>`** where the entry comes from `versesInfo`, so it never equals another syllable's id. A primary syllable keeps its id.

## Tests added

`verses.test.ts` (13 new): D1 (IPA on line 2 is not a verse; lines 1 and 3 with IPA on 2 give [1, 3]; none Cyrillic gives all; Cyrillic keeps it), and the D2 cases on `strophic-repeat.musicxml`: three verses; in verses 2 and 3 bars 7 and 8 carry verse 1's syllables; in verse 2 bar 4's second note has none and bar 5's two notes each have one (and the reverse for verse 1); the exact list of syllable-less notes in each view (bar 4's second note in verses 2 and 3, bar 5's second note in verse 1, bar 6's second note in every verse, which is the slur) and nothing else, with no gap bars; every view syllable is verse 1 with no `versesInfo`; ids, measures, and pitches unchanged; the input unchanged; a one-line bar held at the base verse; a gap bar named; the elision primary kept and marks renumbered.

`apps/web/src/lib/score/ingestion/sunless-verses.test.ts` (4 new): both sunless fixtures carry two lyric lines and give one verse, no gap bars, and their verse-1 view shows on every note the verse-1 text the file holds there (more than 50 notes checked per file).

## Gates (after Step 2)

| Gate | Count |
| --- | --- |
| phonology | 462 passed (462) |
| dictionary | 248 passed (248) |
| svelte-check | found 0 errors and 12 warnings in 5 files |
| web unit | 6035 passed, 1 skipped (6036) |
| score-parser | 868 passed, 5 skipped (873) |
| blurb | 178 passed (178) |
| root integration | 159 passed (159) |
| ratchets | OK |

The web count is 6035 (6036 with the skipped one). The Step 1 count was 6025 and this step added four web tests; the other six are the six Step 1 fixtures: `fixture-rule.test.ts` runs every file `git ls-files` lists through the real parser, and the Step 1 gates ran before those files were tracked. So the six fixtures also pass that rule (no vowelless syllable, no mark alone). I found this by listing the cases per file from a JSON run; the 6036 total matches.

## Pictures

None. Step 2 draws nothing.

## What I could not establish

- Elision of a later verse (above).
- Whether a real score ever carries a verse that is Cyrillic on some notes and IPA on others (the D1 rule counts a verse as Cyrillic if any note's text for it is).
