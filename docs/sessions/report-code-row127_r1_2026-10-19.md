# Report: row 127, a line read an octave lower keeps the print's notes, and the singer can choose bass

Branch `cloud-lane-11`, after row 125 (`61c4e68`), its own commit. Brief: `brief-code-row127-clef-for-your-range_r2_2026-10-19.md` (saved in `/tmp/briefs` as a summary pointer, not the full text; never committed). Cloud session, Sonnet 5.5. `Shane` was not merged into the lane.

## What was built, by file

- `packages/score-parser/src/staff-renderer.ts` (work item 1): the key-signature accidentals under `treble-8vb` now take the treble table an octave lower (`yFor({ step, octave: ksTable[step] - (clef === 'treble-8vb' ? 1 : 0) })`, `:2224`), and the comment at `:962-966` is corrected. This changes every score with an octave clef (it had been wrong since N.123), not only this case. 3432 lines before and after.
- `apps/web/src/lib/score/clef-choice.ts` (new, pure): `readingClef(parsed, range, reading)` returns `{ shift, suggestedShift, clef, shown }` from the UNSHIFTED score and the source clef (`clefFromSource(parsed.clefs[0].clef)`). In the case of item 1 (`suggested < 0` and a plain treble source) the default gives shift -1 and `treble-8vb`, `'bass'` gives -1 and `bass`, `'as-written'` gives 0 and `treble`, and `shown` is true. Outside it `'bass'` is inert, `'as-written'` turns a reading off, a source `treble-8vb` with shift 0 stays as it is, and `clef` is null. Also `clefChoiceOf` and `readingOf` convert the select's three values and the stored value.
- `apps/web/src/lib/score/clef-ui.svelte.ts` (new): `ClefUi`, bound once by the page as `tempoUi` is, exposing `choice`, `reading`, `shown`, `choose`, and `toggle` (`'as-written'` to null, anything else to `'as-written'`, so from Bass the octave line's tap goes to as written).
- `apps/web/src/lib/score/ClefReceipt.svelte` (new): the Clef row, a native `<select>` labelled `upload.ask.clef`, with `upload.ask.clefTrebleOttava` (default), `upload.ask.clefBass`, and `upload.ask.clefTreble`, shown only when `clefUi.shown`; styled with the receipt's values as `TempoReceipt.svelte` does. **No new strings.**
- `apps/web/src/lib/components/Drawer/IntakePanel.svelte`: imports and mounts `<ClefReceipt>` directly under `<TempoReceipt>` (888 to 890 lines).
- `apps/web/src/lib/library/types.ts` and `library.ts`: `OctaveReading` is `'as-written' | 'bass'`; the validator accepts both and still calls anything else malformed. Old stored songs read exactly as before.
- `apps/web/src/routes/+page.svelte`: `toggleOctaveReading` and its comment are gone; one import and one `clefUi.bind(...)` line (the range from `voiceCharacteristics.rangeLow` and `rangeHigh`, as Markup builds it); both panes' `ontoggleoctave` is `clefUi.toggle`; Markup gets `octaveReading={doc.octaveReading}`. Insights keeps `octaveAsWritten`, unchanged.
- `apps/web/src/lib/markup/MarkupPane.svelte`: prop `octaveAsWritten` becomes `octaveReading`; the reading and its clef come from `readingClef`; `reading.clef` goes to `paginateScore` when set, and to `onpagesdrawn` as `reading.clef ?? chooseClef(readingScore)`. The stale comment about the heuristic is corrected in place.

**One departure from the brief:** the `chooseClef` import in `MarkupPane.svelte` stays. Outside the printed-treble case the mapping returns a null clef and the score's own rule decides, as today, so a key-ruler-transposed reading keeps the clef it always had. The brief's version would resolve that clef from the pre-ruler reading; I kept the existing behaviour rather than change it.

## Line counts at the ceilings (before to after)

| file | ceiling | before | after |
|---|---|---|---|
| `+page.svelte` | 5641 | 5641 | 5641 |
| `MarkupPane.svelte` | 1371 | 1371 | 1370 (ceiling lowered to 1370) |
| `staff-renderer.ts` | 3432 | 3432 | 3432 |

No ceiling raised.

## Tests and gates

New: `clef-choice.test.ts` (11): every case of work item 2 (default, bass, as written; a source `treble-8vb` with shift 0; a bass-clef source with a +1 reading and bass inert and as written off; no shift; no score or no range; the two conversions), the toggle (null to as written, as written to null, bass to as written), the select writing the same field, and the row's condition. `library.test.ts` (1): a song saved with `'bass'` restores with `'bass'`, and null and `'as-written'` restore as before; the bad-value test stands. `row127-clef.test.ts` (3, score-parser): on `demoScore()` made a printed-treble line (G2 clef, three sharps, pitches C4 to A5), every notehead y and every `data-key-signature` y are equal between the as-written treble render and the lowered `treble-8vb` render; `gClef8vb` is drawn there and `fClef` with bass. The key-signature test fails with the fix removed (checked).

| gate | baseline (after row 125) | this commit |
|---|---|---|
| phonology | 267 | 267 |
| dictionary | 248 | 248 |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| web-test | 2850 | 2862 passed (2850 plus 12 new) |
| score-parser | 753 passed, 5 skipped | 756 passed, 5 skipped (761) |
| blurb | 145 | 145 |
| integration | 55 | 55 |
| ratchets | OK | OK |

Every existing test passes unchanged, the approved SVGs included. None pinned the key-signature y under `treble-8vb`.

## Pictures

`docs/sessions/row127-shots/`: `markup-ottava-`, `markup-bass-`, and `markup-as-written-` at `1440` and `390` (the system as the page draws it), and `input-band-clef-row-1440.png` and `input-band-clef-row-focused-1440.png` (the Input band with the row, closed and with the select focused). **The fixture is the in-tree Tchaikovsky op. 38 no. 3 voice line (printed in treble), with a seeded bass range (E2 to E4), as `e2e/octave-line.test.ts` seeds it, not Dann's song 2 of row 114**, which is not in the tree. Taken from the dev server in headless Chromium, English.

## Could not establish

- **Dann's look at song 2 on the alias:** not possible here. Song 2's own file is not in the tree, so the C4 to A5 case was reproduced by the render test and the Tchaikovsky pictures, not on his scan.
- **Whether the Clef row's place and its select suit Dann:** the desk defaults of the brief stand; the row is hidden outside the printed-treble case.
- **The Loupe and the print:** both take `reading.clef` (the Loupe through the bundle's `clef`, the print through the same pagination), but I did not open the Loupe or print for this row.
- **A singer whose range is not set** gets no reading, so no row: `resolveVocalReadingOctave` returns 0 without a range.
- **Insights' compass stave** still follows the range, as the brief says.
