# Brief for Code: the sign beside the note

**Written by:** the desk (Fable), 2026-10-03 about 09:50. **This is the whole brief for `QUEUE.md` row 26.** **Serves:** THE ONE THING in `docs/memory/STATE.md`: a scan in, a melody out, IPA seated under it and Russian seated under that. It is the pitch half of plan r4's measure (95 of every 100 notes right in pitch and length). **Runs on the tree at `c601192`, on Dann's Mac, where the reader's measuring path is proven.** Background: your own reports for rows 22, 23, and 24.

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

**What the singer gets from it.** Each note of their melody stands at the pitch the page prints. A flat, a sharp, or a natural beside a note is read, and it holds to the end of its bar as the page means it to. Where Ilya cannot name the sign, it says so at that note and guesses nothing.

**Why this runs now, before hollow heads, rests, and the metre (the desk's sequencing, a DESK DEFAULT).** After row 23, among the notes the scorer matched, the pitch is misread or abstained on 24, 23, 65, 39, and 10 notes of the five build songs, and the length on 15, 15, 45, 48, and 38. On three of the five songs the pitch is now the larger loss.

---

## 1. What was observed

From row 23's reads and scores (`docs/sessions/measure-length_r1_2026-10-02/reads-after/`, `scores-after/`), on the app's own path:

| Song | Matched | Pitch read as printed | Pitch misread | Pitch abstained |
|---|---|---|---|---|
| *Sunless* 1 | 96 | 72 | 21 | 3 |
| *Sunless* 4 | 115 | 92 | 21 | 2 |
| *Sunless* 5 | 215 | 150 | 60 | 5 |
| *Sunless* 6 | 137 | 98 | 37 | 2 |
| Tchaikovsky Op. 38 No. 3 | 173 | 163 | 10 | 0 |
| *Sunless* 2, test only | 67 | 48 | totals only | |
| *Sunless* 3, test only | 197 | 136 | totals only | |

- **Your row 23 report, on the Tchaikovsky song:** of the ten pitch differences, seven have an accidental sign beside the head, and three (bars 20, 22, 76) differ by one step with no sign.
- **Your row 24 report, step 3.6:** the fitted centre of the head gives the reader's own pitch step on 718 of 721 matched notes. Where it differs, it agrees with the truth on 2 and with the reader on none.
- **Tabulated by the desk for *Sunless* 1, and a lead only.** The desk has no truth file in its workspace, so it used the fixture in the tree (`apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`), which holds one more note than the truth file. Of the 24 notes that are misread or abstained, 21 stand one semitone above the printed pitch. Each of those is a note with a printed flat or natural (B♭, A♭, F♮, C♮), or a later note in the same bar that the sign still governs. The three abstentions all carry `accidental_unresolved` and are printed flats.

## 2. What is established, each line carrying its `path:line`

Read by the desk in the tree at `c601192`, 2026-10-03.

- The sign is looked for among the connected components of the line-removed image (`tools/e16-harness/reader/reader.py:2007`).
- A component is a candidate when its centre lies 0.28 to 2.3 staff spaces left of the head and within 1.7 staff spaces of its row (`reader.py:1625-1626`), it does not touch a head (`:1621`, a margin of 4 pixels), and it is either tall (2.0 to 3.7 staff spaces high, at most 2.9 wide; `:1629`) or compact (`:1631`).
- A tall candidate is named by its vertical strokes: two or more make a sharp when ink overhangs both by at least 2 pixels, and a natural otherwise; one makes a flat when the lower right quarter holds at least 0.37 of the ink, and abstains otherwise (`reader.py:1556-1565`).
- With no candidate, the note takes no sign and no abstention (`reader.py:1648`, the function's last line).
- A sign read on a note is carried to later notes of the same letter and octave, and the carry is emptied at each barline (`reader.py:2018-2023`). A note with no sign and no carry takes the key's alteration, and the key is the one the singer confirmed (`reader.py:2009`, `:2025`).
- When the sign abstains, the event carries `accidental_unresolved` and the pitch it would have with no sign (`tools/e16-harness/reader/run_page2.py:380`, `:393`).
- Row 24's instrument is in the tree and off by default: `tools/e16-harness/reader/fitted.py` fits a head, a stem, and a dot with the staff lines left in.

## 3. Measure before you change anything

Report these first. **Build only what step 3.3 shows will lower the misreads on every build song; if it will not, report and stop.**

1. **Every pitch that is misread or abstained, on the five build songs, against the truth.** For each: by how many semitones; what is printed beside the head (look at the crop: a flat, a sharp, a natural, a double sign, or nothing); whether the sign is the note's own or stands earlier in the bar; and what `read_accidental` did (no candidate, a candidate refused for its size, an abstention, or a different sign). Give the counts for each song, and the crops in a `.files` folder.
2. **Every printed sign on the voice staff of the five build songs.** The truth gives each note's pitch, so which notes must carry a printed sign follows from the key and the bar; check each against the scan, and where the print and that expectation differ, the scan decides. For each printed sign: read as printed, read as another sign, abstained, or not seen. For those not seen: what ink stands in the sign's place with the lines removed, and with the lines in.
3. **What separates the signs.** Measure, with the staff lines left in, as `fitted.py` and row 21's stem-following do:
   - the count of upright strokes, their heights, and the gap between them, each stroke followed through a line's band;
   - whether the strokes are joined by bars (a sharp, a natural) or by a bowl (a flat), and where on the stroke;
   - the sign's height and its place against the head's row;
   - **the page's own samples:** the signs of the key signature at the head of each system are that page's own sharps or flats, and their count is known from the confirmed key. Say how like them the signs beside the notes are;
   - your own measure, if you judge it better. Say why.

   Report the spread of each measure for printed flats, sharps, and naturals on each page, and for the ink that stands in a sign's place and is no sign (a slur's end, a barline, the previous note's flag, a letter). Say which measures separate them and by what gap.
4. **The carry.** Among the misreads of step 3.1, count those where the sign was read on its own note and lost on a later one, and say what stood between them (a barline the reader found and the print does not have, a different octave, a tie).
5. **The three Tchaikovsky notes that differ by a step** (bars 20, 22, 76), and any like them on the other songs: say what the fitted centre gives for each. Report only.

## 4. The rulings this serves

- **Dann, 2026-10-01 22:22, the measure:** 95 of every 100 notes right in pitch and length, for each song, on the app's own path (plan r4, section 2).
- **Dann, 2026-10-01 15:22:** *"Guessing is not a modality for well-constructed software."*
- **Plan r4, principles 6, 8, and 9:** the page teaches Ilya its own glyphs; three states for every fact (read, deduced, unsure); no new fixed number without a check on songs the builders have not seen.
- **Dann, 2026-10-02 15:16** (`docs/memory/OPEN.md`, "N.178 AND THE SCAN READER", item 19; a direction and not an edict): *"We should lean into Gould' swork as the reference it is."* (transcribed as written). The desk's draft of what Gould gives the reader says a sign closes up to its note and nothing sits within one staff space before it (`draft-gould-expectations-for-the-scan-reader_r1_2026-10-02.md`, section 2; the rule numbers there are leads, read from search snippets).
- **What row 24 taught, the desk's reading:** a page's clear cases are a sound source for its own values, and a comparison over an area that holds other marks' ink is not. So the bounds here come from the page's clear signs where the page has them, and each measure looks only at the sign's own strokes.
- **The desk's ruling for this brief, a DESK DEFAULT:** a sign is read from its strokes with the staff lines left in. A mark in a sign's place that cannot be named makes the pitch abstain, as it does today. A wrong pitch stated with confidence is the harm; an abstention is honest.

## 5. Constraints

- **The 23 render pages stay byte-identical.** If the rule cannot hold that, apply it on ink-heavy pages only, as `shape.py` is applied, and say so.
- **The test-only songs (*Sunless* 2 and 3): totals only, once, with everything frozen.** Do not open their pages, their crops, or their note-by-note output, and keep their reads outside the repository.
- **Change `tools/e16-harness/` only.** No product code. `VocalLineEvent` and the seam's shape do not change. The abstain path stays.
- **No new fixed number fitted to the five songs** where a page's own value or Gould's bound can serve. Every number is listed in the report with its source.
- **Lengths, rests, the metre, and hollow heads are out of scope.** Report what you see of them; fix none.
- **The pins hold:** Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4.
- **Crops go in a `.files` folder.** The truth files in `tools/e16-harness/output/truth/` are never committed.
- **Words for the record:** where Ilya's reading differs from the print, it is Ilya's misread.
- **Stay on Sonnet. No agent writes with git.**
- **What this displaces:** the briefs for hollow heads, rests, and the metre, each by one step. `QUEUE.md` rows 5 to 17 wait as before.

## 6. Done when

1. Steps 3.1 to 3.5 are reported, page by page.
2. **On every build song the count of pitches misread is lower than today's and the count read as printed is higher.** Today's are 21, 21, 60, 37, and 10 misread and 72, 92, 150, 98, and 163 read as printed. Report misread, read as printed, and abstained, before and after.
3. No build song loses a matched note or a length read as printed.
4. **On the two test-only songs, totals only:** the pitches read as printed do not fall below 48 and 136, and the pitches misread do not rise. If either moves the other way, say so first in the report.
5. The 23 render pages are byte-identical.
6. Read time for each song is reported beside row 23's.
7. All gates at baseline: gate 4 is `1870 passed (1870)` and gate 5 is `650 passed | 5 skipped (655)`. Name any number you move and the tests that move it.

## 7. Report back

A new file, `docs/sessions/report-code-the-sign-beside-the-note_r1_2026-10-03.md`: section 3's measurements first, then the build against section 6, line by line, and **what could not be established. NOT ESTABLISHED beats a complete invented answer.** Scripts and results go in `docs/sessions/measure-signs_r1_2026-10-03/`.
