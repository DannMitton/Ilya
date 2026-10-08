# Report: the tessituragram names every sung pitch (r1, 2026-10-08)

Answers `brief-code-tessituragram-sung-names_r1_2026-10-08.md` (QUEUE row 43). Written by Code (Sonnet) on branch `Shane`, base `9cfcd17`, tree dirty with this change and the desk's untracked files. No git writes. **WRITTEN, not DONE: DONE is Dann's look on the alias.**

## What changed

| Where | What |
|---|---|
| `apps/web/src/lib/insights/tessituragram-layout.ts:344` | One name per sung row. A natural is named in the left column (`x = lineNameEnd`), a sharp or flat in the right (`x = sungEnd`), each level with its bar (`:399`), all `--rose-ink`, 10 px, weight 500. The loop that named every stave and ledger line is gone, so an unsung line has no name; the faint and dotted lines are unchanged. Column widths now come from the names actually drawn. The `lineName` text kind and the grey `--ink-tertiary` name ink are gone from the figure (the key and title still use tertiary). |
| `apps/web/src/lib/insights/tessituragram-layout.ts:72` | `spellingOf`: the spelling with more sung time names the row; on a tie, the less altered; then the lower letter. Names come from the same `pitchLabel` as before, so French uses today's names. No new strings. |
| `apps/web/src/lib/insights/insights.ts:208`, `:599` | New optional field `FigureRow.spellingQuavers`, parallel to `spellings`: the written time of each spelling, from the same `soundingFromNotation` the phonation code uses. The model had only the list of spellings, not their times, so the rule could not be applied without it. |
| `tessituragram-layout.test.ts:122`, `:128`, `:136` | Three tests: Tchaikovsky's names; a natural on a space named and unsung lines unnamed; spelling choice (more time, less altered on a tie). They replace the old "names the stave lines" test. |
| `insights.test.ts:276` | The existing row test now also checks `spellingQuavers` (A♯3 a quarter, B♭3 a half: `[2, 4]`). |

## Names, Tchaikovsky (the test's rows, an octave down as on the alias)

Left, low to high: B2, D3, E3, G3, A3, B3, D4, E4. Right: C♯3, D♯3, F♯3, G♯3, A♯3, C♯4. This is the brief's list exactly (it lists the left column high to low). C4, F3, and G2 are not named. Pinned by the test at `tessituragram-layout.test.ts:122`.

## One thing that differs from the brief's wording

The spelling rule uses **written** time per spelling, not the aggregation's arbitrated sung time (repeats and bar-reading trust rules are not applied to it). It only picks which spelling names a row, so the difference can matter only where two spellings share a row and are close in time. Per-spelling arbitrated time is not in `aggregatePhonation`'s output (it is keyed by MIDI number), so it is not available without changing the aggregation. Say if you want that done.

## Collision check

Names one diatonic step apart (B3, A3, G3 are 11 px apart) do not touch: the ink boxes clear by about 1 px. Unit: `contacts` is empty for Tchaikovsky and for every extreme in the row 42 suite, all still passing. Live: every label's ink box against every bar, line, and other label, English and French, screen and print: **no contact in all four.** Nothing was shrunk and nothing needs reporting as a collision. Not tested: a song with sung pitches a step apart in both columns of a very wide accidental name (such as a double sharp) against a long tessitura word; the columns are sized from the widest name actually drawn.

## Gates

| Gate | Result | Baseline |
|---|---|---|
| 1 phonology | 251 passed | 251 |
| 2 dictionary | 235 passed | 235 |
| 3 web-check | 0 errors, 12 warnings, 5 files | same |
| 4 web-test | **1979 passed** | 1977; **+2**: `tessituragram-layout.test.ts` 22 to 24 (three tests replace one) |
| 5 score-parser | 650 passed, 5 skipped (655) | same |
| 6 blurb | 145 passed | 145 |
| 7 integration | 55 passed | 55 |
| 8 ratchets | OK | OK |

`insights.test.ts` gained an assertion, not a test, so it does not move the count. `ilya-ship.sh` line 79 needs 1979 (the desk's file, not touched). Run one gate at a time because the script refuses untracked files.

## Screenshots, `docs/sessions/tessituragram-shots/`

Same Tchaikovsky file and seeded test voice as row 42, dev server `http://localhost:5173`, headless Chromium, device scale 2. Figure is 570 by 217.25 in both languages, the same height as before row 43 (the figure's rows did not change).

- `tchaikovsky-{en,fr}-desk-1440x900-sung-names.png` and `-fig.png`: desk at 1440 by 900.
- `tchaikovsky-{en,fr}-print-sung-names.png` and `-fig.png` (print media), `tchaikovsky-{en,fr}-print-sung-names.pdf`, and `pdf-{en,fr}-sung-names-1.png` (page one of the Letter PDF).

## Could not establish

- That the new left column reads well beside the bars on paper: I did not print to a printer. Two columns of names now sit between the stave and the bars, where before the left column held grey line names. How that looks is a taste call and needs your eye on the alias.
- Whether the right-hand "tessitura" word and the left names stay clear in a song whose tessitura band and sung rows start lower than the bracket's label; Tchaikovsky is the only real song I ran.
- Per-spelling sung time as the aggregation would arbitrate it (see above).
- The dev server is running on 5173 from this session (`ilya-web`), restarted this morning because the earlier one had gone.
