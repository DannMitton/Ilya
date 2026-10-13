# Brief for Code on the Mac: a quadruplet and a double flat in set 4's 4F (r2, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 20:10 (r1). **r2, 2026-10-12 about 20:45: applies all seven of Fable's amendments** (`docs/sessions/review-fable-brief-row89_r1_2026-10-12.md`, SEND WITH AMENDMENTS); r1 is superseded, do not run it. QUEUE row 89, THE ONE THING. For Code on Dann's Mac, Opus, after the ship of rows 78a to 88. **General fixes only; a fix that serves only this song is not made.**

Displaces: nothing.

## 1. What was observed

- Row 86 (`docs/sessions/report-code-the-final-test-set4_r1_2026-10-12.md`): set 4 read 97.5 PASS; song 4F read 89.2 BELOW.
- **Dann opened 4F on 2026-10-12 at 19:58** (*"open 4F, the Glière"*). The desk compared its 11 misreads with the scan at 300 dpi: 5 were the truth file's and are corrected (`~/Downloads/_desk-heldout4-private/truth/gliere_op12_no6_chego_khochu.truth.corrected.json`). With the corrected truth, 4F reads 94.1 BELOW and set 4 97.9 PASS (`docs/memory/STATE.md`, the handover). The six left are the reader's:
  - **m. 22** (file index 21), «го?.. Все»: the print has a double flat before B4; the reader gave B♭4 for both notes, where the truth (confirmed by Dann at 20:05, reading mm. 21 to 23) is B𝄫4.
  - **m. 24** (file index 23), «все-ю пол-но», in 3/4: four quarter notes under a bracket marked "4", four in the time of three. The reader gave 1/6, 1/6, 1/6, and 1/4. Dann, 20:10: *"it needs to know that triplets are not the only tuplets. Quadruplets happen, as we see here."*
- The six misreads, each as file index, syllable, truth, and reading (the desk's list from the corrected truth and row 86's reading):

  | File index | Syllable | Truth | Reading |
  |---|---|---|---|
  | 21 | «го?..» | B𝄫4, a half | B♭4 |
  | 21 | «Все» | B𝄫4, a quarter | B♭4 |
  | 23 | «все» | D♭5, 3/16 (4:3) | 1/6 |
  | 23 | «ю» | D♭5, 3/16 (4:3) | 1/6 |
  | 23 | «пол» | E♭5, 3/16 (4:3) | 1/6 |
  | 23 | «но» | E♭5, 3/16 (4:3) | 1/4 |
- Measure numbers count the opening bar as m. 1; the scorer's bar numbers count from 0.

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-12 about 20:09:

- `apps/web/src/lib/omr/tuplet-number.ts:1-10`: the page's tuplet number is looked for over a bar's notes and read as "any number: 2 to 9, two digits, and n:m".
- `apps/web/src/lib/omr/triplets.ts:276`: the ratios the page-free rules may read are "3:2, and the duplet and quadruplet in compound metre"; a quadruplet in simple metre (4:3 in 3/4) is not among them.
- `apps/web/src/lib/omr/triplets.ts:174-178`: a tuplet's `actual` and `normal` are read from `<time-modification>`.
- `apps/web/src/lib/omr/triplets.ts:313-342`: the page's numbers are applied before rules 1 to 3; `:201-206`: `conventionalSpace` gives a number printed alone its space, 3 for a 2 or a 4 in compound metre, none for a power of two in simple metre, and the next lower power of two otherwise; `:316-317`: a number with no space is passed over.
- `apps/web/src/lib/omr/triplets.ts:384-385`: whatever the page and the rules make of a bar is kept only where the bar then fits its metre.
- `apps/web/src/lib/omr/homr-reader.ts:38` and `:228`: the reader calls `lookOverNotes`; `tuplet-number.ts:546-554`: `lookForTupletNumber` answers only a 3.
- `docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py:33-34`: the scorer reads `<alter>` as an integer into midi. Row 86 scored from the stored reading through `conv.py` (its report, line 35), so Ilya's `Pitch` type (`apps/web/src/lib/analysis/notation-overlay.ts:39`) is not on the scored path.
- Where a double flat is handled between homr's output and Ilya's reading: NOT ESTABLISHED.

## 3. Measure before you change anything

1. Run the eight gates and record the counts. If any fails, stop and report.
2. Start the dev server from the tree as it stands, with no change made, and drop 4F (the cut file `~/Downloads/_desk-heldout4-private/truth/gliere_op12_no6_chego_khochu.pdf`) through the drop box as row 77 did (`report-code-set3-four-below_r1_2026-10-11.md`, 'How it was read'). Score it against the corrected truth with `docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts`. Report the line beside row 86's 89.2 and the desk's 94.1. If the misreads are not section 1's six, report which differ and stop. The 'after' line comes from the same server by the same path.
3. For m. 24, report the bar at each step in order, so the step where the lengths changed is seen: (a) homr's own MusicXML for the bar: each note's `<type>`, `<duration>`, any `<dot/>`, any `<time-modification>`, and its `imgpos`; (b) whether the join asked the page over this bar (`homr-reader.ts:199-208`) and what `lookOverNotes` (`tuplet-number.ts:501`, called at `homr-reader.ts:228`) answered: `numbers` (each n, m, and x) and `centres`, with the console line `[omr] printed tuplet numbers: looked over N bars, read M` (`homr-reader.ts:381`); (c) what `completeTriplets` (`triplets.ts:287`) made of the bar: its `rule` (`triplets.ts:137`) and the ratio each note was given; (d) the bar as stored in the reading (the `ilya-library` `sources` store) and as `conv.py` lists its events. For m. 22, the same chain for the two notes: homr's `<pitch>` (`<step>`, `<alter>`, `<octave>`) and `<accidental>`; the stored reading's; `conv.py`'s midi (`conv.py:33-34` reads `<alter>` as an integer); and the truth's midi. Report also whether homr's symbol vocabulary holds a double flat and a double sharp at all (`third_party/homr-web/`, the source and `CHANGES-ilya.md`), with file and line.
4. Say the cause of each in one sentence, with its `path:line`.

## 4. The rulings this serves

- THE ONE THING (`docs/memory/STATE.md`): at least 95 of every 100 printed notes on unseen songs, on the singer's path.
- Dann, 2026-10-12 20:10, quoted in section 1.
- *"THE PAGE IS NEVER WRONG"* (`docs/memory/CONTRACT.md`, style): where the reading differs from the print it is Ilya's misread.

## 5. Constraints

- **4F is the only set 4 song that may be opened.** The nine others stay sealed. Set 3's six sealed songs stay sealed.
- **Protected readings stay byte for byte:** the 38 of row 77's report ('The regression checks'; K and M are among them), dropped on the dev server before any change and again after, compared by `cmp`; report each. A reading that already differs from row 77's before any change is reported as such and is not row 89's to explain. The nine sealed set 4 songs are dropped the same way and compared by `cmp` against row 86's readings in `~/Downloads/_desk-heldout4-private/run/`, printing only the label and 'same' or 'changed'; where one changes, print its two score lines, before and after, and nothing else of it.
- A general fix only: a printed number n, and a printed n:m, wherever the page prints it; and a double flat and a double sharp wherever printed. The page-free rules (`triplets.ts:276-279`) are not widened to a new ratio in simple metre unless a second opened song or a fixture shows a bar that needs it, and the report then names every protected bar the widening would touch. Each fix is shown on a second case: an opened song that prints the same mark (search the opened songs' kept readings and console lines first), or else a test in `triplets.test.ts`, `tuplet-number.test.ts`, or a small MusicXML fixture under the test files, and say which; the test runs in gate 4. Where no general fix is possible on Ilya's side, such as a mark homr's vocabulary does not carry, build nothing for it and report why, as row 77's 'Not built, and why' did.
- Gates must pass; moved counts reported. No git command that writes. Dann ships.

## 6. Done when

- 4F's six misreads before and after, each as file index, note, truth, and reading, from the same dev server: m. 24's four notes each 3/16 of a whole, and m. 22's two notes B𝄫4 (midi 69); or the one not fixed is under 'Not built, and why'.
- 4F's line after, beside its line before, both on the dev server.
- The 38 protected readings `cmp` same; the nine sealed set 4 songs 'same', or their two lines printed.
- The second case for each fix passes as a test in the tree.
- All eight gates pass; moved counts reported.
- `WRITTEN` on the code; DONE is Dann's walk.

## 7. Report back

`docs/sessions/report-code-4f-quadruplet-and-double-flat_r1_2026-10-12.md`: section 3's findings, the causes with `path:line`, the fixes, 4F's line before and after, the protected readings, the gates, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set row 89's State in `docs/memory/QUEUE.md` and stop.
