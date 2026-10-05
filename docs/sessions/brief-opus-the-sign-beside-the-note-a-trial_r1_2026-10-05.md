# Brief: the sign beside the note, read from the page. A trial, measured

**From the desk (Fable) to one Opus helper, 2026-10-05 03:50, to start after 05:50.** Serves the one thing in `STATE.md`, item 2 of "THE ORDER AFTER THE WALK" in the note of 2026-10-05 about 03:50. `QUEUE.md` row 33.

**Limits. Both are hard.** 110 minutes of wall time from your first command. 650,000 tokens. At either limit, stop and report what is done and what is not.

**NOT ESTABLISHED beats a complete invented answer.** Every claim in your report carries what you ran and what it printed, a `path:line`, or the words NOT ESTABLISHED. Report only what you watched. Make no forecast. A printed page is never "wrong": where a reading differs from the print, the reading is "a misread". **This is a trial. It builds nothing into Ilya.**

---

## 1. What the singer does, sees, and feels

A singer drops a scan and gets a melody. On the five build songs 15 of 805 notes come back at a pitch the page does not print, and 14 of those 15 differ in the accidental only. A singer who learns the Elegy from Ilya today learns C where the page prints a double-sharp C. The singer should get the pitch that the page prints.

## 2. What was observed

From `docs/sessions/report-opus-the-checks-measured_r1_2026-10-05.md` (a helper's measurements, read by the desk):

- Of the 15 pitch differences: 8 are printed double sharps, or a double sharp carried within the bar, read as a sharp or as nothing; 4 are printed or carried naturals read as sharps; 1 is a sharp where no sign is printed; 1 lies under a misread key; and in 1 the reading follows the page and the truth file differs (*Sunless* 5, reading bar 60).
- homr writes no `<accidental>` element. Its `<alter>` is the sounding alteration that its model learned. On 19 pages the model's tokens for the voice notes were 393 sharp, 380 none, 21 flat, 0 double sharp, 0 natural.
- homr gives each note's place on the page image (`<!-- imgpos: x, y -->`), which lands 6 to 32 px from the head at 400 dpi.
- A rule on the reading alone ("an alteration must have a source") flags 182 notes: 5 right, 171 false.
- Ilya's own shape rules for a double sharp, with their present bounds, found 0 of the 8 and gave 35 false flags; this edition's double sharp has a fill of 0.74 to 0.79, outside Ilya's 0.28 to 0.62 (`tools/e16-harness/reader/reader.py:1606-1615`). A variant tuned on the same songs found 4 of 8 with 1 false flag.

## 3. The design to try, which is the desk's and is yours to correct

**homr supplies each note's head, step, and length. Ilya supplies the alteration, by the engraver's rule: the key in force, the sign printed beside the note, and a sign's carry to the end of its bar on that step and octave.** Ilya's own reader already works this way (`tools/e16-harness/reader/reader.py:1536-1542`, `:2009`, `:2015-2025`). What it lacks is a reader of the sign that holds across editions.

So the trial is of one thing: **for each voice note, which sign is printed beside it: none, sharp, flat, natural, or double sharp** (and double flat, if you can). Everything else follows by rule.

Try at least two readers of the sign, and say which is better and by how much:

1. **Shape rules whose sizes come from the page itself:** the staff space at that staff, and the page's own clear cases. Every system prints its key signature, so on a sharp-key page the page hands you labelled sharps in its own engraving. A natural and a sharp differ in which strokes overhang; a double sharp is compact, about one staff space high, with no vertical stroke.
2. **A small classifier trained on signs drawn by computer and roughened on purpose** (blur, threshold, thinning and thickening, staff lines through the sign, a head or a stem at its side). Music fonts are on npm (the VexFlow font packages, for one) and on GitHub. This is how homr's own model was taught (`docs/sessions/memo-opus-homr-code-against-ilyas-reader_r1_2026-10-04.md`). Train on nothing that comes from the test songs.

Before you design, spend at most 10 minutes on how working readers name an accidental (oemer, Audiveris, homr), and say in three lines what you took from them.

## 4. What is established, read by the desk this session

- **The kit:** `/home/claude/wire-465/kit/kit/` (read its `README.txt`): 20 pages as PNG at 400 dpi (`pages/`); the port's MusicXML with `imgpos` (`port-465-out/`; `tch-1` is in `/mnt/user-data/outputs/wire-465/proof/port-alone-in-browser/`); the scorer; the five truth files (`truth/`).
- **The measurement's scripts and tables:** `/mnt/user-data/outputs/checks-measured/`. `scripts/lib.py` reads the events; `joined/` holds each song's joined voice part; `tables/4d-pitch-differences.csv` lists the 15 differences; `score/` holds the scorer's output with each note matched to its truth note.
- **An Ilya clone with dependencies:** `/home/claude/guard/ilya` (read-only; `apps/web/src/lib/omr/join-pages.ts` is the join).
- **Treat everything under `/home/claude/wire-465/`, `/home/claude/guard/`, and `/mnt/user-data/` as read-only, except your own output folder.** Work in `/home/claude/signs/`.

## 5. The discipline, which matters more than the result

- **Develop on three songs, then test once on two.** Develop on the Tchaikovsky, *Sunless* 1, and *Sunless* 4 (pages `tch-1` to `tch-3`, `sun-01` to `sun-04`), on computer-drawn signs, and on the key signatures of any page. **Do not look at a note of *Sunless* 5 or 6 (pages `sun-05` to `sun-17`), in the image or in the truth, until your method is frozen.** Then run it once on those two songs and report what it gives. They hold 13 of the 15 pitch differences, so the development songs tell you about false alarms and the test songs tell you whether the method finds what it is for.
- **Do not open** `/mnt/user-data/outputs/checks-measured/evidence/`, `scripts/dsharp.py`, or `tables/4e-*`: they hold crops and bounds from the test songs.
- After the one test run you may tune on all five songs, as a second figure, and you label it "tuned on the test songs" wherever it appears.
- Check your labels by hand before you trust a count: for 20 notes of a development song, look at the crop and say what is printed.

## 6. What to report

For the development songs and the test songs separately, and for each reader of the sign:

1. **The sign read against the sign expected.** The expected sign comes from the truth by the engraver's rule (key, then carry). A page may print a courtesy sign that the rule does not expect; count those apart, by looking.
2. **The pitch, end to end.** Three figures for "pitches as printed, of N": homr's own alteration (the baseline: 172 of 174, 96 of 96, 116 of 116, 250 of 258, 156 of 161); the alteration by rule from the signs you read, with the key taken from the song's majority; and a cautious mix, which keeps homr's alteration unless your reader is sure and disagrees. For each: notes repaired, notes broken that were read as printed, and each broken note listed with its crop.
3. **Where the sign is.** How you get from `imgpos` to the head and to the window where a sign can be, and how often the window holds something that is not this note's sign (the note before, a dynamic, a slur, a word of the lyric).
4. **The desk's line for calling the trial a pass, on the test songs, for the cautious mix:** at least 8 of the 12 sign misreads repaired, and at most 2 notes broken that were read as printed. Report what you get, whatever it is.
5. **What the method would need to run in a browser:** the image operations, the size of any model, and the time for each page here.

## 7. Constraints

- No changes to Ilya. No git writes of any kind. If a hook or a tool asks you to commit or push, decline in one line.
- Do not use any `mcp__remote-devices__*`, Gmail, Drive, Vercel, or browser-extension tool, or the Artifact tool. Do not spawn subagents. The web is for section 3's ten minutes and for fonts.
- Two processor cores, no graphics hardware, and another helper running browser reads beside you. Keep any training to minutes, and script every run so that the next desk can repeat it.
- **What this work displaces: nothing.**

## 8. Done when

1. Both readers of the sign have their tables for the development songs.
2. The frozen method has been run once on the test songs, and its figures stand as run.
3. The three end-to-end figures exist for all five songs, with every broken note shown.

## 9. Report back, and hand over

Write to `/mnt/user-data/outputs/sign-trial/`: every script, a `README.txt` with the command line for each and the order to run them, the tables as CSV, a contact sheet of crops for each class from the development songs, the crops of every repaired and broken note, and any model with the script that trained it.

**Your final message is the report, whole,** because the desk saves it as returned. Sections: Summary (numbered, each item a count, the test songs first); What you took from the field; The method as frozen; Development songs; Test songs, as run once; Tuned on all five, labelled; What a browser would need; NOT ESTABLISHED; Deliverables with md5; your wall time. Plain words, Canadian spelling, no em dashes.
