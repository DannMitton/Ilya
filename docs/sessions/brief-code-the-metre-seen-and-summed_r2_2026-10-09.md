# Brief for Code: the printed metre at every change, seen and summed (r2, 2026-10-09)

Written by the desk (Opus) 2026-10-09 about 00:55. For Code on the Mac. QUEUE row 57. Model: Opus. **r2 replaces r1** (`brief-code-the-metre-seen-and-summed_r1_2026-10-08.md`, never sent). It takes up what row 37's Part B could not build.

**What r2 changes, and why.** r1 asked you to measure row 56's digit reader at every printed time signature and to state a figure only where it saw one. Row 56 then measured that reader on time signatures (`report-code-tuplets-of-any-number_r1_2026-10-08.md`, section 10): on the 17 songs it found 3 of about 46 printed figures, with 0 false, and it never took C or cut C for a digit. With that reader, r1's rule would state almost nothing. So r2 has you **build a reader for time-signature figures first**, measure it, and only then wire the rule. The rule itself, the rulings it serves, and the constraints are r1's, carried here unchanged except where marked.

## What the singer needs

A singer who drops a scan sees, on Ilya's page, the metre the composer printed: at the start, and at every change. Where Ilya cannot confirm a change from the page, it shows what it has and does not invent a figure.

## 1. What was observed

- Dann, 2026-10-05 15:16, on the Tchaikovsky: Ilya drew 9/8 where the page prints 3/8, and nothing flagged it.
- Dann, 2026-10-08 21:12: *"how does it handle a sequence of 12/8 4/4/ 3/2 ? Weird. Sounds like we should enact QUEUE row 37?"*
- Row 37, measured by you (`report-code-bars-against-the-printed-metre_r1_2026-10-08.md`): the metre in force in Ilya's reading is as long as the truth's bar in 666 of 721 pairable bars on the 17 opened and build songs. Grechaninov holds 47 of the 55 others (printed 6/8 from bar 10, stated 4/8). `timesig.py` was right at 11 of 17 places and wrong at 6 (9/8 for a printed 3/8; 1/4 five times where no figure is printed).
- Row 56, measured by you (its report, section 10): the digit reader, built for tuplet numbers, read rendered time-signature digits 2 to 9 at 75 to 90 percent with one fault (a 3 read as 9, three times in 180), and never took C or cut C for a digit. On real pages it found 3 of about 46 figures, 0 false. Its 32 windows ran from a bar's first note back 9 staff spaces (16 at bar 1) and did not reach the signature at bar 1 of Kabalevsky 4, 6, and 7.

## 2. Why the tuplet reader misses time signatures (DESK INFERENCE from the code, each line read 2026-10-09 00:35 to 00:50; confirm or correct it in your report)

- Its templates are tuplet digits (`tuplet0` to `tuplet9`) and hold no time-signature glyph (`apps/web/src/lib/omr/tuplet-digits.ts:225-235`; row 56's report, section 10, says so).
- Its word finder refuses any mark between the staff's second and fourth lines (`apps/web/src/lib/omr/tuplet-number.ts`, the comment "Not between the staff's inner lines"), which is where a time signature's figures stand.
- It takes out long thin strokes before it finds marks, so a figure drawn across staff lines may come apart (`tuplet-number.ts`, `markWords`, the stroke cut before "Connected marks").
- It refuses a numeral with another directly above or below it (`lookOverNotes`, the stack rule), which is exactly the shape of a time signature. That refusal is right for tuplets and stays.

## 3. Build the figure reader, and measure it before anything reads from it

A new module beside `tuplet-digits.ts`, sharing its feature code (`featuresOf`, `distance`, `readDigit`), not its templates. It reads, at a place on a staff, a stacked pair of figures (upper over lower, each about two staff spaces tall, the pair spanning the staff), C, or cut C, or nothing.

1. **Templates:** `timeSig0` to `timeSig9`, `timeSigCommon`, `timeSigCutCommon` from the fonts with open licences only: Bravura, Leland, Finale Maestro, Finale Engraver, Finale Broadway, Finale Ash, Finale Jazz, Finale Legacy (SIL OFL 1.1, the files in `apps/web/static/fonts/`, read by the desk 2026-10-09), Petaluma and Sebastian (SIL OFL by smufl.org/fonts). **No text font.** Negatives from the same fonts: clefs, key-signature sharps and flats, rests, barlines, and the marks you cut from opened scans at bar starts that are not figures. Say in the report which fonts you used and the shipped byte count.
2. **Finding the place:** after the clef and key signature at a system's start, and after a barline anywhere else. Find it from the staff itself (barlines and the clef), not only from the notes, so the windows reach bar 1. Say how, and where you could not.
3. **Reading the pair:** read the upper and lower figure separately; two-digit figures (12, 16) as two marks side by side. A pair is an answer only where both figures read. A lower figure must be 1, 2, 4, 8, 16, or 32; anything else is no answer.
4. **Measure, rendered:** each figure, C, and cut C, every font held out in turn, as row 56 did.
5. **Measure, printed:** every printed time signature in the 17 opened and build songs (row 37's Part A table, completed where it says "not looked"), one row each: printed, read, and right or not. **Then the other direction:** every other bar start on those songs. It must read nothing there.

**The bar: 0 false figures anywhere.** Recall is reported, figure by figure, with no threshold, because a missed figure leaves today's metre in place. If recall on the printed signatures is under half, report the cause you found before you go on to section 4.

## 4. The rule, then the join

"Seen and summed" is the desk's short name for Dann's design (section 5): a figure is stated only where the reader sees it at the start of a bar **and** the written lengths of the bars it governs, up to the next figure seen, agree with it under the bar rule (a short first bar, and a last bar or a bar before a repeat or double bar that completes it, are not counted against it). Neither half decides alone. Where a figure is seen and the bars disagree, nothing changes and the console says so. Where nothing is seen, the join states what it states today.

Then say how the metre and the tuplet checks depend on each other in the join's order (the tuplet checks read the metre in force; a bar with unread tuplets is too long for its printed metre, `triplets.ts`), and what order states the printed figure and keeps the printed rhythm on these songs. Row 56 made the tuplet checks keep a change only where the bar then fits the metre in force, so a metre stated wrongly now also refuses a right tuplet.

**Wire the rule only if, over section 3's places, it states no figure the page does not print.** A missed change is acceptable; a stated figure the page does not print is not. If it fails, stop and report what you saw.

## 5. The rulings this serves

- **The metre is auditioned and checked by arithmetic. Dann, 2026-10-02 01:06** (`docs/memory/OPEN.md`, "N.178 AND THE SCAN READER", item 11): *"there should be a combination of likely Araabic numbers (1 through 9) to audition, plus the simple arithmetic of the contents of a confirmed bar to weigh against that audition as a sanity check."* 01:12: upper figures are most often 2, 3, 4, 6, 8, 9, 12, 16 and lower figures 2, 4, 8, 16, as a weight and never a gate. 01:18: beaming never changes the metre read.
- **Persistence, Dann 2026-10-08 21:12 to 21:38** (`OPEN.md`, "METRE CHANGES", item 1): a printed metre holds until the next is printed.
- **The bar rule, corrected by Dann 2026-10-05 00:52** (`OPEN.md`, N.178, item 22): anacrusis and the bar that completes it are not counted against the metre.
- **The page is the authority, not the arithmetic. Dann, 2026-10-08 15:50** (`OPEN.md`, "THE CORRECTIONS REDESIGN", item 5). A run of bars that happens to add up to another metre is never, by itself, a reason to state that metre.

## 6. Constraints

- A figure Ilya states is one the page prints.
- No mark, flag, or word is added to the page or the Loupe in this row. Report how the count behind the existing "does not add up" words changes on the 17 songs (`apps/web/src/lib/i18n.ts:1616`, `:1681`).
- The templates load as `tuplet-digit-templates.json` does: a dynamic import, only when a bar is in doubt or a signature place is read. Nothing goes into `static/`.
- `timesig.py` may be one more witness only if section 3 shows it adds a right answer the new reader misses and no figure the page does not print.
- **Never open, read, list, or run anything in `~/Downloads/_desk-2026-10-08/` whose name begins `heldout2`.** It is the final test.
- Do not touch the scorer. No git command that writes. Dann ships.
- **What this displaces, from the desk:** the final test (QUEUE row 55) waits behind this row.

## 7. Done when

- Section 3's tables, rendered and printed, with 0 false figures.
- At every place where the rule states a figure, it is the printed figure, in the reading the app keeps after a drop.
- The scorer's "metre right N of M bars" on the 17 songs: no song lower than row 37's report, and the total higher than 666 of 721.
- Notes, before and after through the drop box, on the same 17 songs: no song lower.
- A, B, C, E, F once, one line each, never opened.
- One picture each of Grechaninov at bar 10 and of Kabalevsky 4 at bars 14 to 16 in Markup, from the dev build, in `docs/sessions/metre-shots/`, with the printed bars beside them.
- Tests: a figure seen and summed is stated; seen and not summed is not; bars that sum to another metre with no figure seen change nothing; C and cut C; a lower figure outside 1, 2, 4, 8, 16, 32 is no answer.
- All eight gates, against gate 4 `2035` and the rest as in `~/Downloads/ilya-ship.sh`.

`WRITTEN` on the code. `DONE` is Dann's look.

## 8. Report back

`docs/sessions/report-code-the-metre-seen-and-summed_r1_2026-10-09.md`: section 3's tables and the answer to section 4's order question first; then each change with its `path:line`, the tests, the gates, the before and after lines, the five unseen lines, the two pictures, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set QUEUE row 57, say so in one line, and stop.
