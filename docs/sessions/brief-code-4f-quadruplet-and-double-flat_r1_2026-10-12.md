# Brief for Code on the Mac: a quadruplet and a double flat in set 4's 4F (r1, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 20:10. QUEUE row 89, THE ONE THING. For Code on Dann's Mac, Opus, after rows 88 and 82 (or before row 82, whichever Dann pastes first). Fable reviews this brief before Code gets it. **General fixes only; a fix that serves only this song is not made.**

Displaces: nothing.

## 1. What was observed

- Row 86 (`docs/sessions/report-code-the-final-test-set4_r1_2026-10-12.md`): set 4 read 97.5 PASS; song 4F read 89.2 BELOW.
- **Dann opened 4F on 2026-10-12 at 19:58** (*"open 4F, the Glière"*). The desk compared its 11 misreads with the scan at 300 dpi: 5 were the truth file's and are corrected (`~/Downloads/_desk-heldout4-private/truth/gliere_op12_no6_chego_khochu.truth.corrected.json`). With the corrected truth, 4F reads 94.1 BELOW and set 4 97.9 PASS (`docs/memory/STATE.md`, the handover). The six left are the reader's:
  - **m. 22** (file index 21), «го?.. Все»: the print has a double flat before B4; the reader gave B♭4 for both notes, where the truth (confirmed by Dann at 20:05, reading mm. 21 to 23) is B𝄫4.
  - **m. 24** (file index 23), «все-ю пол-но», in 3/4: four quarter notes under a bracket marked "4", four in the time of three. The reader gave 1/6, 1/6, 1/6, and 1/4. Dann, 20:10: *"it needs to know that triplets are not the only tuplets. Quadruplets happen, as we see here."*
- Measure numbers count the opening bar as m. 1; the scorer's bar numbers count from 0.

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-12 about 20:09:

- `apps/web/src/lib/omr/tuplet-number.ts:1-10`: the page's tuplet number is looked for over a bar's notes and read as "any number: 2 to 9, two digits, and n:m".
- `apps/web/src/lib/omr/triplets.ts:276`: the ratios the page-free rules may read are "3:2, and the duplet and quadruplet in compound metre"; a quadruplet in simple metre (4:3 in 3/4) is not among them.
- `apps/web/src/lib/omr/triplets.ts:174-178`: a tuplet's `actual` and `normal` are read from `<time-modification>`.
- Where a double flat is handled between homr's output and Ilya's reading: NOT ESTABLISHED.

## 3. Measure before you change anything

1. Run the eight gates and record the counts. If any fails, stop and report.
2. Re-read 4F (the cut file `~/Downloads/_desk-heldout4-private/truth/gliere_op12_no6_chego_khochu.pdf`, through the singer's door as row 86 did, or on the dev server, saying which) and score it against the corrected truth with `docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts`. The line must equal 94.1 with the same six misreads; if not, stop and report.
3. For m. 24: report what homr wrote (its notes, any `<time-modification>`, its `imgpos`), what `lookForTupletNumber` found over those notes (the number, or none and why), and which rule then set the lengths. For m. 22: report what homr wrote for the two notes (`<alter>`, `<accidental>`), and where the double flat was lost.
4. Say the cause of each in one sentence, with its `path:line`.

## 4. The rulings this serves

- THE ONE THING (`docs/memory/STATE.md`): at least 95 of every 100 printed notes on unseen songs, on the singer's path.
- Dann, 2026-10-12 20:10, quoted in section 1.
- *"THE PAGE IS NEVER WRONG"* (`docs/memory/CONTRACT.md`, style): where the reading differs from the print it is Ilya's misread.

## 5. Constraints

- **4F is the only set 4 song that may be opened.** The nine others stay sealed. Set 3's six sealed songs stay sealed.
- **Protected readings stay byte for byte:** every reading row 77 protected (its report, "38 of 38") plus set 4's K and M rehearsal lines; report each.
- A general fix only: a quadruplet (and any n:m the page prints) wherever it is printed, and a double flat (and a double sharp) wherever it is printed. Show each fix on a second, opened song or a built fixture if one prints the same mark; if none exists, build a small MusicXML or image fixture and say so.
- Gates must pass; moved counts reported. No git command that writes. Dann ships.

## 6. Done when

- 4F re-read scores m. 22 and m. 24 right, and its line is reported beside 94.1.
- The protected readings are unchanged.
- All eight gates pass.
- `WRITTEN` on the code; DONE is Dann's walk.

## 7. Report back

`docs/sessions/report-code-4f-quadruplet-and-double-flat_r1_2026-10-12.md`: section 3's findings, the causes with `path:line`, the fixes, 4F's line before and after, the protected readings, the gates, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set row 89's State in `docs/memory/QUEUE.md` and stop.
