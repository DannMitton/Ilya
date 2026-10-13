# Fable's review of row 89's brief (r1, 2026-10-12)

Reviewed by Fable 2026-10-12. Read whole: the brief, `BRIEF-TEMPLATE.md`, `triplets.ts`, `tuplet-number.ts`, `homr-reader.ts`, row 86's report, and row 77's report, all under the uploaded copy of `ilya-rewrite`. Also read for one check each: `docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py`, `docs/memory/CONTRACT.md:716`, `docs/memory/STATE.md:52`, and `docs/memory/QUEUE.md:85, 119-121`. Every `path:line` below is from this session unless marked "Fable's knowledge, not verified".

## Verdict: SEND WITH AMENDMENTS

The brief keeps to the template: section 1 is observation, section 2 is cited fact, and no cause is written anywhere. Three things hold it back from SEND as it stands. Section 3 names a function the reader does not call, so the evidence it asks for cannot be produced. The protected set is named by a wrong label and leaves the nine sealed set 4 songs unprotected. And "Done when" has no observation attached to "scores m. 22 and m. 24 right".

## 1. Citations and quotations checked

| Brief line | Claim | Result |
|---|---|---|
| 9 | Row 86: set 4 97.5 PASS, 4F 89.2 BELOW | Holds: `report-code-the-final-test-set4_r1_2026-10-12.md:13, 15` |
| 10 | 4F 11 misreads: 7 pitch, 4 length | Holds: row 86 report `:93` ("91 of 102 right; pitch misreads 7; length misreads 4") |
| 10 | 94.1 with corrected truth, six misreads left | Arithmetic holds: 96 of 102 is 94.1. The corrected truth file, the handover in `STATE.md`, and the 97.9 total are not in the uploaded copy: NOT ESTABLISHED here |
| 11, 12 | Dann's words at 20:05 and 20:10 | Not in any uploaded file: NOT ESTABLISHED here |
| 19 | `tuplet-number.ts:1-10`, "any number: 2 to 9, two digits, and n:m" | Holds: `tuplet-number.ts:9`, verbatim |
| 20 | `triplets.ts:276`, "3:2, and the duplet and quadruplet in compound metre" | Holds: `triplets.ts:276`, verbatim; the function is `ruleRatios`, `:277-279` |
| 21 | `triplets.ts:174-178`, `actual` and `normal` from `<time-modification>` | Holds: `triplets.ts:171-178` |
| 27 | `final-line.ts` under `docs/sessions/measure-final-test_r1_2026-10-08/` | The folder is not in the uploaded copy. `QUEUE.md:85` (row 55) names the same path, so the path is consistent with the record: NOT ESTABLISHED on disk |
| 28 | `lookForTupletNumber` | Wrong function for the question. The reader imports and calls `lookOverNotes` (`homr-reader.ts:38`, `:228`); `lookForTupletNumber` filters the numbers read down to a single 3 and answers `null` for anything else (`tuplet-number.ts:553-554`). Amendment 1 |
| 33 | THE ONE THING, "at least 95 of every 100 printed notes on unseen songs, on the singer's path" | Holds: `STATE.md:52`, verbatim |
| 35 | "THE PAGE IS NEVER WRONG", `CONTRACT.md`, style | Holds: `CONTRACT.md:716` |
| 40 | Row 77's "38 of 38" | Holds: row 77 report `:22`, `:282`. K and M are two of the 38 (`:264`, `:266`) |
| 40 | "set 4's K and M rehearsal lines" | Mislabelled: K and M are set 2's songs (`QUEUE.md:85`, G to P), used as the rehearsal in rows 76 and 86 (row 86 report `:44-71`). Amendment 5 |

Row 89 itself is not in the uploaded `QUEUE.md` (rows run to 88 at `:121`). The desk's copy is newer than the upload, so this is NOT ESTABLISHED, not a fault.

## 2. Does the brief carry a cause?

No. Section 1 holds Dann's words and measured numbers. Section 2's three facts carry lines. Section 3 leaves the cause to Code (line 29). The nearest thing to a lean is the pairing of line 20 (the page-free ratios) with line 12 (the quadruplet), which is a fact and is allowed by the template, but it is one branch of the path and the only branch named. The page path, which the join runs first (`triplets.ts:313-342`), is not in section 2 at all. A brief that names one branch and not the other steers Code toward the branch named. Amendment 2 adds the other branch's facts, neutrally.

## 3. Does section 3 ask for the evidence that separates the causes?

For m. 24, the possible places the lengths were set are, in the order the code runs them:

1. homr's own MusicXML for the bar: notes at their plain values with no `<time-modification>`, or with one (`triplets.ts:171-178` reads it).
2. The page look: whether the join asked over this bar (`homr-reader.ts:199-208`, `:228`), what `lookOverNotes` answered (`numbers`, each with n, m, and x; `centres`; `tuplet-number.ts:501-539`), and the console line at `homr-reader.ts:381`.
3. The join's use of the answer: a number printed alone gets its space from `conventionalSpace` (`triplets.ts:201-206`), and a number with no space is passed over (`:316-317`); then rules 1 to 3 (`:346-381`); then the bar check (`:384-385`). `TripletResult.rule` (`:137`) says which acted.
4. The stored reading and `conv.py`'s events (row 86 report `:35`).

Section 3 as written asks for 1, for a function that is not on the path in 2, and for "which rule" in 3. It does not ask for the `numbers` and `centres` the look gave, nor for `rule`, nor for the stored reading. Amendment 1 asks for each step's output so the step where the lengths changed is seen in the report, not inferred.

For m. 22, the scored path runs from the stored reading through `conv.py`, which reads `<alter>` as an integer and folds it into midi (`conv.py:33-34`), so a `-2` survives the scorer. Ilya's `Pitch` type with its `alter` field (`apps/web/src/lib/analysis/notation-overlay.ts:39`) is not on the scored path. The separating evidence is therefore homr's `<pitch>` and `<accidental>` for the two notes, the stored reading's, and `conv.py`'s midi beside the truth's midi. One more question is needed and is missing: whether homr's symbol vocabulary holds a double flat at all. `third_party/homr-web/` is not in the uploaded copy, so this is NOT ESTABLISHED, and it is the question that decides whether any Ilya-side fix exists. Amendment 1 adds it; amendment 6 says what Code does if the answer is no.

## 4. Is "general fixes only" testable?

Partly. A second case for the double flat is findable: any opened song's kept reading can be searched for `<alter>-2`, `<alter>2`, `flat-flat`, or `double-sharp`, and Dann's own library may print one. A second case for a quadruplet in simple metre is rarer on the opened songs; a unit-test fixture in the existing test files is the right second case, and the brief allows a fixture (line 41). What the brief does not say is where the fixture lives or that it must be a test that runs in a gate, so "general" is shown once and then kept. Amendment 6 names the test files and makes the fixture a gate test.

The brief also has no outcome for a mark the model cannot see. Row 77 handled V's nested triplet, T's dot, and the French line by building nothing and saying why (row 77 report `:149-153`). Row 89's brief says "wherever it is printed" (line 41) and "scores m. 22 right" (line 46) with no such exit. Amendments 6 and 7 add it.

## 5. Protection of readings

Row 77 protected 38 readings by dropping them on the local dev server before and after and comparing with `cmp` (row 77 report `:233-282`), and it kept Q, R, U, W, Y, and Z sealed by printing only "same" or "changed" (`:5`, `:239`). The brief's line 40 names the 38 and "set 4's K and M", which are already among the 38. It says the nine set 4 songs "stay sealed" (line 39) but puts no reading of theirs under protection, so a fix could move 4A or 4H and nothing in the brief would catch it. Row 86's readings of the ten sit in `~/Downloads/_desk-heldout4-private/run/` (row 86 report `:38`), so the nine can be compared the way row 77 compared the six, without opening. Amendment 5.

One more baseline matter. Row 77's 38 "after" readings were taken at `7bb929a`; the tree now holds rows 78a to 85 uncommitted (row 86 report `:7`), and the alias serves `9f9e896`. "Byte for byte" needs a before-drop on the tree as it stands, so that a difference caused by rows 78 to 88 is not charged to row 89. Amendment 5 says so.

## 6. Risk: a 4:3 rule in simple metre

The brief's "wherever it is printed" (line 41) can be read two ways by Code: give a printed 4 a space in simple metre on the page path, or add 4:3 to the page-free ratios. The second is the risk. Rule 3 reads any bar that is too long and has no other way to fill it (`triplets.ts:33-46`, `:365-379`), and a bar of four plain quarters in 3/4 is too long by exactly one quarter. With 4:3 among `ruleRatios` in simple metre, every such bar would be made a quadruplet, including a bar that is too long because homr misread one value, or because a change to 4/4 was not seen (row 77's X is a bar too long for a metre reason, `:78`). Rule 3's page guard (`:368-369`) lessens this where the page has been read, but the guard accepts any numeral-sized mark within 0.6 of a note of a run's middle, read or not. The page path is the safer place: it needs a read number over the run's middle within half a note (`:323-331`) and the bar check (`:384-385`). Gould's Table 2 (p. 203) is the authority the code itself names for the spaces (`:193-199`); the brief does not ask Code to read it. Fable's knowledge, not verified: Gould gives the quadruplet in simple time as four in the time of three. Amendment 6 keeps the page-free rules as they are unless a second case needs them.

## 7. Is "Done when" observable?

"Scores m. 22 and m. 24 right" (line 46) names no observation. Row 77 showed per-bar truth beside reading (`diff.ts`, `bars.py`, `:44`) and the full lines before and after (`:203-229`). The brief's line 27 says "the same six misreads" but section 1 lists five notes (two in m. 22, three in m. 24), so the sixth cannot be checked. Amendments 3 and 7.

## 8. Fable's inference, for the desk only. Not for the brief

The template forbids a cause in the brief, and this is not one; it is a reading of the code the desk can hold against Code's section 3 report. The reader's output, 1/6, 1/6, 1/6, 1/4, sums to 3/4, which is the bar. A printed 4 read by the look gets no space in 3/4 (`conventionalSpace`, `:204`) and is passed over (`:317`). Rule 1 needs a bar one and a half times the metre (`:351`), and four quarters is four thirds, so it does not act. Rule 3 then looks for runs; a triplet on the first three quarters (middle at note 1.0) sits within 0.6 of a mark over the middle of four notes (at 1.5, `:369`), a triplet on the last three (middle 2.0) also does, but its span would begin a quarter in, not on a multiple of a half (`:242`), so exactly one choice fills the bar (`:246`). The bar check passes. If section 3's report shows a 4 read by the look, `rule: 3`, and the first three notes at 3:2, this is the mechanism; if it shows something else, this is wrong and Code's reading stands. It is not to be copied into the brief.

## Amendments

1. Replace section 3, step 3, with:

   "3. For m. 24, report the bar at each step in order, so the step where the lengths changed is seen: (a) homr's own MusicXML for the bar: each note's `<type>`, `<duration>`, any `<dot/>`, any `<time-modification>`, and its `imgpos`; (b) whether the join asked the page over this bar (`homr-reader.ts:199-208`) and what `lookOverNotes` (`tuplet-number.ts:501`, called at `homr-reader.ts:228`) answered: `numbers` (each n, m, and x) and `centres`, with the console line `[omr] printed tuplet numbers: looked over N bars, read M` (`homr-reader.ts:381`); (c) what `completeTriplets` (`triplets.ts:287`) made of the bar: its `rule` (`triplets.ts:137`) and the ratio each note was given; (d) the bar as stored in the reading (the `ilya-library` `sources` store) and as `conv.py` lists its events. For m. 22, the same chain for the two notes: homr's `<pitch>` (`<step>`, `<alter>`, `<octave>`) and `<accidental>`; the stored reading's; `conv.py`'s midi (`conv.py:33-34` reads `<alter>` as an integer); and the truth's midi. Report also whether homr's symbol vocabulary holds a double flat and a double sharp at all (`third_party/homr-web/`, the source and `CHANGES-ilya.md`), with file and line."

   Reason: the reader never calls `lookForTupletNumber`, which answers only a 3, and the chain as asked skips the look's answer, the join's `rule`, and the stored reading, which are the points that separate the causes.

2. Add to section 2, after line 21:

   "- `apps/web/src/lib/omr/triplets.ts:313-342`: the page's numbers are applied before rules 1 to 3; `:201-206`: `conventionalSpace` gives a number printed alone its space, 3 for a 2 or a 4 in compound metre, none for a power of two in simple metre, and the next lower power of two otherwise; `:316-317`: a number with no space is passed over.
   - `apps/web/src/lib/omr/triplets.ts:384-385`: whatever the page and the rules make of a bar is kept only where the bar then fits its metre.
   - `apps/web/src/lib/omr/homr-reader.ts:38` and `:228`: the reader calls `lookOverNotes`; `tuplet-number.ts:546-554`: `lookForTupletNumber` answers only a 3.
   - `docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py:33-34`: the scorer reads `<alter>` as an integer into midi. Row 86 scored from the stored reading through `conv.py` (its report, line 35), so Ilya's `Pitch` type (`apps/web/src/lib/analysis/notation-overlay.ts:39`) is not on the scored path."

   Reason: section 2 names the page-free branch only, and a brief that cites one branch steers Code to it.

3. Add to section 1, after line 12:

   "- The six misreads, each as file index, syllable, truth, and reading: (the desk's list from its comparison at 300 dpi)."

   Reason: section 3, step 2, requires "the same six misreads", and the brief names five notes.

4. Replace section 3, step 2, with:

   "2. Start the dev server from the tree as it stands, with no change made, and drop 4F (the cut file `~/Downloads/_desk-heldout4-private/truth/gliere_op12_no6_chego_khochu.pdf`) through the drop box as row 77 did (`report-code-set3-four-below_r1_2026-10-11.md`, 'How it was read'). Score it against the corrected truth with `docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts`. Report the line beside row 86's 89.2 and the desk's 94.1. If the misreads are not section 1's six, report which differ and stop. The 'after' line comes from the same server by the same path."

   Reason: the alias serves `9f9e896` without the uncommitted rows 78a to 85 (row 86 report, line 7), and the fix lands in the tree, so before and after must both be the tree.

5. Replace section 5, line 40, with:

   "- **Protected readings stay byte for byte:** the 38 of row 77's report ('The regression checks'; K and M are among them), dropped on the dev server before any change and again after, compared by `cmp`; report each. A reading that already differs from row 77's before any change is reported as such and is not row 89's to explain. The nine sealed set 4 songs are dropped the same way and compared by `cmp` against row 86's readings in `~/Downloads/_desk-heldout4-private/run/`, printing only the label and 'same' or 'changed'; where one changes, print its two score lines, before and after, and nothing else of it."

   Reason: "set 4's K and M" names set 2's rehearsal songs, already in the 38, and the nine sealed songs are under no protection in the brief.

6. Replace section 5, line 41, with:

   "- A general fix only: a printed number n, and a printed n:m, wherever the page prints it; and a double flat and a double sharp wherever printed. The page-free rules (`triplets.ts:276-279`) are not widened to a new ratio in simple metre unless a second opened song or a fixture shows a bar that needs it, and the report then names every protected bar the widening would touch. Each fix is shown on a second case: an opened song that prints the same mark (search the opened songs' kept readings and console lines first), or else a test in `triplets.test.ts`, `tuplet-number.test.ts`, or a small MusicXML fixture under the test files, and say which; the test runs in gate 4. Where no general fix is possible on Ilya's side, such as a mark homr's vocabulary does not carry, build nothing for it and report why, as row 77's 'Not built, and why' did."

   Reason: a page-free 4:3 in 3/4 would make a quadruplet of any bar of four plain quarters that is too long for another reason, and the brief has no outcome for a miss that sits inside homr's model.

7. Replace section 6 with:

   "- 4F's six misreads before and after, each as file index, note, truth, and reading, from the same dev server: m. 24's four notes each 3/16 of a whole, and m. 22's two notes B𝄫4 (midi 69); or the one not fixed is under 'Not built, and why'.
   - 4F's line after, beside its line before, both on the dev server.
   - The 38 protected readings `cmp` same; the nine sealed set 4 songs 'same', or their two lines printed.
   - The second case for each fix passes as a test in the tree.
   - All eight gates pass; moved counts reported.
   - `WRITTEN` on the code; DONE is Dann's walk."

   Reason: "scores m. 22 and m. 24 right" names no observation, and the template asks for tests that hold on every case.

The 3/16 in amendment 7 is Fable's arithmetic (a quarter, four in the time of three), not read from a file.

## Could not establish

- The corrected truth file, the 94.1 line, the 97.9 total, and the `STATE.md` handover the brief cites. The uploaded `STATE.md` predates them.
- Dann's words at 20:05 and 20:10. Not in any uploaded file.
- `docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts`. Not in the upload; the path matches `QUEUE.md:85`.
- Row 89's QUEUE row. The upload ends at row 88.
- `third_party/homr-web/`, so whether homr's vocabulary holds a double flat, and whether `readDigit` (`tuplet-digits.ts`, not in the upload) reads a printed 4.
- `join-pages.ts` (not in the upload): whether the join logs `TripletResult.rule` anywhere Code can read it without a hook.
- The sixth misread of 4F.
- Gould's Table 2, p. 203. The code names it as unread (`triplets.ts:193-199`); Fable has not read it this session.
- Whether rows 78a to 88 changed any of the 38 protected readings since `7bb929a`.
