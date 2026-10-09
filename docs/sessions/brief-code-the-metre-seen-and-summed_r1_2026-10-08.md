# Brief for Code: the printed metre at every change, seen and summed (r1, 2026-10-08)

Written by the desk (Fable) 2026-10-08 about 22:20. For Code on the Mac, in the window of rows 49 to 56, **after row 56**. QUEUE row 57. Model: Opus. It takes up what row 37's Part B could not build. **The desk may revise it to r2 on row 56's report**, because row 56 measures the digit reader on time-signature figures and this row leans on that measurement.

## What the singer needs

A singer who drops a scan sees, on Ilya's page, the metre the composer printed: at the start, and at every change. Where Ilya cannot confirm a change from the page, it shows what it has and does not invent a figure.

## 1. What was observed

- Dann, 2026-10-05 15:16, on the Tchaikovsky: Ilya drew 9/8 where the page prints 3/8, and nothing flagged it.
- Dann, 2026-10-08 21:12: *"how does it handle a sequence of 12/8 4/4/ 3/2 ? Weird. Sounds like we should enact QUEUE row 37?"*
- Row 37, measured by you (`report-code-bars-against-the-printed-metre_r1_2026-10-08.md`): the metre in force in Ilya's reading is as long as the truth's bar in 666 of 721 pairable bars on the 17 opened and build songs. The other 55 are in six songs: Grechaninov from bar 10 (printed 6/8, stated 4/8; 47 bars), Kabalevsky 4 (3 bars), Kabalevsky 6 (2), *Sunless* 4 bar 22, Kabalevsky 7 bar 47, Kabalevsky 9 bar 30. Those six songs read 96.0 to 100.0 in notes.
- The same report: `timesig.py` answered at 17 places, 11 as printed and 6 not (a 9/8 for a printed 3/8; a 1/4 five times where no figure is printed). It gives no answer on Grechaninov and reads no C. Your table gives the length of the bars at the six places as 3/8, a whole, a half, 2/4 or a whole, and 3/4: none is a quarter or nine eighths long.
- The same report's Part A table, column "homr states": at some printed changes the reading carries a `<time>` (Kabalevsky 4 at bars 16 and 35; Kabalevsky 6 at 20; *Sunless* 4 at 22; Kabalevsky 7 at 47; Grechaninov at 10), and at others none (Kabalevsky 4 at 14 and 36; Kabalevsky 6 at 21 to 23; *Sunless* 4 at 23; Kabalevsky 9 at 30 and 31; Kabalevsky 7 at 48).

## 2. What is established, each line with its `path:line` (read by the desk 2026-10-08, 22:16 to 22:20)

- homr's writer puts a `<time>` of its own in the first `<attributes>` of every page; a time signature homr read on the page comes in a later `<attributes>` of the same measure. The join drops the writer's where another is stated or one is in force (`apps/web/src/lib/omr/join-pages.ts:25-34`, `:271-277`).
- The join already knows, bar by bar, whether homr read a time signature printed in that bar: `printsMetre` (`join-pages.ts:235-239`). It passes that to the triplet rules, which leave such a bar alone (`join-pages.ts:240-241`; `apps/web/src/lib/omr/triplets.ts:12-18`).
- The metre in force is one string, updated when an `<attributes>` states a different `<time>` (`join-pages.ts:299-304`), and the triplet rules read it (`join-pages.ts:241`; `readMetre`, `triplets.ts:116`).
- A note's place on the page arrives with it (`placeOf`, `join-pages.ts:333-336`), and the join can ask to look at the page image at places it names (`LookAtPage`, `join-pages.ts:343`, `:352`; answered in `apps/web/src/lib/omr/homr-reader.ts:157-196`). Row 54's printed 3 is read through that seam (`apps/web/src/lib/omr/tuplet-number.ts:1-33`).
- A lead, not read by the desk in homr's source: the model has a token for a time signature's lower figure only, and the writer sets the upper figure from the page's bar lengths; a `<time>` carries no place on the page (`docs/sessions/report-opus-the-checks-measured_r1_2026-10-05.md:25`, `:125`, `:134-138`; `join-pages.ts:235-238` says the same).

## 3. Measure before you change anything, and report it first

For every printed time signature in the 17 opened and build songs (your row 37 Part A table), one row with:

1. **What homr gave:** whether the raw reading holds a `<time>` other than the writer's in that bar, and its lower figure. Also what homr writes where the page prints C or cut C, and what Ilya then draws.
2. **What the page shows there:** what row 56's digit reader reads for the upper and the lower figure at the start of that bar, found from the places of the notes on either side. Say how you found the place, and where you could not.
3. **What the bars say:** the written lengths of the bars that signature governs, up to the next printed one, counted under the bar rule in section 4 (a short first bar, and a last bar that completes it, are not counted against a figure).
4. **What the rule of section 4 would state there:** the figure, or nothing.

Then the other direction: at every bar of those songs that does not fit the metre in force and where the page prints no time signature (the 10 bars of your row 37 Part A, and any others), what the digit reader reads at the start of the bar. It must read nothing there.

Then say how the metre and the tuplet checks depend on each other in the join's order (the triplet rules read the metre in force; a bar with unread tuplets is too long for its printed metre), and what order states the printed figure and keeps the printed rhythm on these songs.

**Build only if, over all of those places, the rule states no figure the page does not print.** A missed change is acceptable; a figure the page does not print is not. If it fails, stop, report, and say what you saw. The cause is yours to find.

## 4. The rulings this serves

- **The metre is auditioned and checked by arithmetic. Dann, 2026-10-02 01:06** (`docs/memory/OPEN.md`, "N.178 AND THE SCAN READER", item 11): *"there should be a combination of likely Araabic numbers (1 through 9) to audition, plus the simple arithmetic of the contents of a confirmed bar to weigh against that audition as a sanity check."* 01:12: upper figures are most often 2, 3, 4, 6, 8, 9, 12, 16 and lower figures 2, 4, 8, 16, as a weight and never a gate. 01:18: beaming never changes the metre read (3/4 is often beamed as 6/8, and 6/8 as 3/4 for a hemiola). **"Seen and summed" is the desk's short name for his design:** a figure is stated only where the page shows it at the start of a bar and the lengths of the bars it governs agree with it. Neither half decides alone.
- **Persistence, Dann 2026-10-08 21:12 to 21:38** (`OPEN.md`, "METRE CHANGES", item 1): a printed metre holds until the next is printed.
- **The bar rule, corrected by Dann 2026-10-05 00:52** (`OPEN.md`, N.178, item 22): *"'Every bar must add up to the metre.' This is not always true: anacrusis (opening bars), and ending bars often make up the difference from the short opening bar"*. The same holds at a repeat sign or a double bar inside a song.
- **The page is the authority, not the arithmetic. Dann, 2026-10-08 15:50** (`OPEN.md`, "THE CORRECTIONS REDESIGN", item 5). So a run of bars that happens to add up to another metre is never, by itself, a reason to state that metre.

## 5. Constraints

- A figure Ilya states is one the page prints. Where the rule cannot confirm, Ilya keeps what the join states today and says so in the console.
- No mark, flag, or word is added to the page or the Loupe in this row. The words that say a bar does not add up exist already (`apps/web/src/lib/i18n.ts:1616`, `:1681`; their keys are used at `apps/web/src/lib/insights/InsightsPane.svelte:695` and `:764`, found by search; the desk has not read what decides them). Report how its count changes on the 17 songs. The bar checks and the Corrections review are other rows.
- `timesig.py` may be used as one more witness only if section 3 shows it adds a right answer the digit reader misses and no figure the page does not print.
- **Never open, read, list, or run anything in `~/Downloads/_desk-2026-10-08/` whose name begins `heldout2`.** Four of its ten songs change metre. It is the final test.
- No git command that writes. Dann ships.
- **What this displaces, from the desk:** the final test (QUEUE row 55) waits behind this row.

## 6. Done when

- At every place in section 3's table where the rule states a figure, it is the printed figure, in the reading the app keeps after a drop.
- The scorer's "metre right N of M bars" on the 17 opened and build songs: no song lower than in your row 37 report, and the total higher than 666 of 721.
- Notes, before and after through the drop box, on the same 17 songs: no song lower.
- A, B, C, E, F once, one line each, never opened.
- One picture each of Grechaninov at bar 10 and of Kabalevsky 4 at bars 14 to 16 in Markup, from the dev build, in `docs/sessions/metre-shots/`, with the printed bars beside them.
- Tests for the rule: a figure seen and summed is stated; a figure seen and not summed is not; bars that sum to another metre with no figure seen change nothing.
- All eight gates, against row 56's baseline.

`WRITTEN` on the code. `DONE` is Dann's look.

## 7. Report back

`docs/sessions/report-code-the-metre-seen-and-summed_r1_2026-10-08.md`: section 3's table and the three answers first; then each change with its `path:line`, the tests, the gates, the before and after lines, the five unseen lines, the two pictures, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set QUEUE row 57, say so in one line, and stop.
