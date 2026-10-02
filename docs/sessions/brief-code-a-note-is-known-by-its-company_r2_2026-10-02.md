# Brief for Code: on the voice staff, a note is known by its company (r2)

**Written by:** the desk (Fable), 2026-10-02 about 08:30. **This is the whole brief for `QUEUE.md` row 21. It replaces `brief-code-a-note-is-known-by-its-company_r1_2026-10-02.md`; do not read that.** **Serves:** THE ONE THING in `docs/memory/STATE.md`: a scan in, a melody out, IPA seated under it and Russian seated under that. **Runs on the tree at `622f35f`.** Background: your own `report-code-a-note-is-known-by-its-company_r1_2026-10-02.md`, which stopped at section 3, as r1 told you to, and `measure-company_r1_2026-10-02/`.

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

**What the singer gets from it.** Every printed note of the melody is there, so each syllable sits under its own note. Today 18 of the 174 printed notes of the Tchaikovsky song are absent, and your report shows the same loss on the Lamm, Kalmus, and Bessel pages.

**The desk's answers to the two things your report asked it to rule:**
1. **Which to try: where the stem meets the head.** Section 3 has the measures. It is row 20's own ruling, now for filled heads.
2. **Every braced system on every scan page, not the Tchaikovsky pages alone.** A printed head is a printed head. Each one admitted is marked.

---

## 1. What was observed

From your report on r1, on the app's own path at `622f35f`:

- **The pool is 1,155 candidates on ten pages.** You looked at 90 of 90 unread, unmasked candidates on the Tchaikovsky pages and at the 46 your rule R admits on the other seven.
- **R is a run of at least 3.0 staff spaces with breaks of up to 0.3 bridged, and a thinnest width of at most 0.14 staff spaces.** On the Tchaikovsky pages it admits 18 unread candidates, and all 18 are heads by your looking: 17 of the 18 misses, and `tch-2` x 736, y 2621.
- **R leaves out one of the 18:** `tch-1` x 3167, y 2350, whose stem needs breaks of 0.5 bridged.
- **R keeps four non-heads out by one pixel** on `tch-3`: the 'f' of a dynamic (run 4.5, thinnest width 0.25), a sharp (3.14, 0.18), and the thick closing barline twice (3.32 and 3.21, 0.18).
- **On the other seven pages R admits 46, and 44 or 45 are heads** by your looking.
- **R admits one sharp of the seven-sharp key signature** on `kalmus s06 p21` (id 1133; run 3.08, thinnest width 0.08). The clef-and-key mask there spans x 97 to 161, and the sharps run to about x 270.
- **The head at `tch-1` x 2107:** the finder places it at y 3522, where `has_stem` is False; at y 3517 on the same plateau of equal responses it is True.
- **A flag is at the far end on at least 13 of the 18** and on no quarter note. The thinnest width along the run is 0.07 to 0.14 for all 18.

**By the desk's eye, and a lead only** (a Poppler raster at 400 dpi, `apps/web/test-results/_desk-heads/tch2-sys3-start.png`, git-ignored): bar 1 of page 2, system 3, prints two heads, a dotted quarter near x 590 and a flagged eighth near x 737. The desk's count for that bar is 2, and row 20 read it as equal without the eighth.

## 2. What is established, each line carrying its `path:line`

Read by the desk in the tree at `622f35f`, 2026-10-02.

- `detect_heads` keeps one point per 0.8 staff spaces where the filled filter's response is at least `thr` (`tools/e16-harness/reader/reader.py:1108-1134`); `nms` takes the highest response first and does not say which point of a plateau it takes (`reader.py:1099-1106`).
- `has_stem` reads one column from the head's row, stops at the first white pixel, wants 2.0 staff spaces, then reads the ink's width in the single row 1.5 staff spaces along (`reader.py:1141-1170`).
- Row 20 already acts on braced systems only, through `braced_sys` (`reader.py`, `read_page_geometry`, which begins at `:1285`).
- Each record of `measure-company_r1_2026-10-02/m1.json` holds the response, four bridged runs, `run_lean`, `col`, `ud`, `thin`, `probe15`, the company, the place, and the mask. **It holds no measure of the run on the other side of the head.** (Read by the desk: record 14.)

## 3. Measure before you change anything

Report these first. **If step 3.1 separates the candidates you looked at into heads and not heads, on every scan page, with a gap wider than one pixel at every page's staff space, build without waiting for the desk. If it does not, stop and report.**

1. **Where the stem meets the head.** For every candidate you looked at for r1, and for every sharp of the `kalmus s06 p21` key signature (ids 1103 to 1110 and 1129 to 1136 among them), measure:
   - **the run on the far side:** in the stem's own column or columns, how far the ink continues past the candidate's row in the direction opposite to the long run, with the same bridging as R. A stem leaves a head in one direction;
   - **the stem's place against the head:** the stem column's distance from the candidate's centre (`stem.col`), in staff spaces, beside the half-width of the ink through the candidate's own row (`_row_span`);
   - **your own head-shape measure,** if you judge it better than either. Say why.

   Say which of these, with R's run, separates heads from not heads, and by what gap in staff spaces and in pixels on each page. Say whether the thinnest-width bound is still needed once they are in. List every candidate on which the measures disagree.
2. **Look at every candidate the rule would admit, on every page.** That label is the one the build rests on. The candidates the reader already emits need no new label.
3. **The plateau.** Say how many candidates sit on a plateau of equal responses, and for how many the stem measures differ from one point of the plateau to another. Evaluate every bound at the point `detect_heads` returns at the reader's own threshold, never at the pool's point.
4. **Page 2, system 3, bar 1:** list what the reader emits there today, with x and y.
5. **The clef-and-key mask, to report and not to fix:** on each scan page and system, the mask's span beside the extent of the key signature that the page's confirmed key implies.

## 4. The rulings this serves, and the ones it touches

- **Dann, 2026-10-01 16:08:** *"voice lines are usually monodic while piano lines feature chords, generally. Not always, but this is a useful starting place."*
- **Dann, 2026-10-01 22:27, plan r4 principle 5:** decide late, by likeness and by sense.
- **Plan r4, principle 9:** no new fixed number without a check on songs the builders have not seen.
- **The desk's ruling in row 20, a DESK DEFAULT, now for filled heads: a head sits at the end of its stem.** A stem leaves a head in one direction. Ink that runs on past the candidate in both directions is a stroke through it: a sharp, a barline, the letter of a dynamic.
- **The desk's ruling, a DESK DEFAULT: a note is known by its company.** On the voice staff of a braced system, a filled candidate that the present tests refuse is a head when a stem stands at its flank, leaves it in one direction, and runs at least as far as the measured heads' stems do, read along its whole length with breaks of up to 0.3 staff spaces bridged. Every bound comes from the two groups you looked at, sits in the gap between them, and is reported with that gap. No dimension is assumed.
- **The thin probe's reason is kept.** `has_stem`'s docstring says it refuses bold text bowls and a solid box (`reader.py:1142-1150`). The rule must still refuse every candidate you looked at that is not a head.
- **A head admitted this way is marked.** `G['byCompany']` lists each one with the measures that admitted it. The page-model brief decides how it is shown.
- **The heads the reader emits today stay.** The new tests admit; they do not remove.
- **`tch-1` x 3167 stays unread.** A break of 0.5 staff spaces is not bridged. Report it as the one printed head left out.
- **A system with no braced pair is left as it is.** The render fixtures then stay byte-identical by construction.

## 5. Constraints

- **Edit `tools/e16-harness/reader/` only,** and not `clefkey`.
- **Render fixtures stay byte-identical,** or you say exactly which bytes move and why before shipping.
- **The pins hold:** Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4.
- **No oracle in the runtime path.**
- **Out of scope, and not to be fixed in passing:** the clef-and-key mask, note lengths, the count of flags, the metre read, rests, any text, and a second head on one stem.
- **Do not re-derive `K_S`. Do not change `VocalLineEvent`.**
- **Event ids will change wherever a head is added.** Accepted.
- **No agent writes with git.**
- **What this displaces:** nothing. It runs before the metre brief.

## 6. Done when

1. **Tchaikovsky, on the app's own path:** the heads read equal the desk's count in at least 95 of the 99 bars, no bar is wrong by more than one head, the song's total is 170 to 178, and no hollow head is emitted. Where a bar differs from the desk's count, say what stands in it; the count is a draft and may be the one in error.
2. **Every scan page:** no candidate you judged not a head is emitted, and every head read before this build is still read.
3. **`G['byCompany']`** lists every head the rule admitted, and the report gives the count per page.
4. **Render fixtures:** byte-identical, per constraint.
5. **Read time per page** beside row 20's 29.1 s and 28.2 s for the three Tchaikovsky pages.
6. All gates at baseline: gate 4 is `1824 passed (1824)` and gate 5 is `644 passed | 5 skipped (649)` since `622f35f`. Name any number you move and the tests that move it. `WRITTEN` on the code. `DONE` is Dann's walk of the Tchaikovsky PDF on the alias.

**If items 2 to 6 are met and item 1 is not,** leave the code WRITTEN and report each bar that is still unequal with what stands in it.

## 7. Report back

Add a section "Build against brief r2" to `docs/sessions/report-code-a-note-is-known-by-its-company_r1_2026-10-02.md`: the measurements of section 3, the results against each line of section 6, and **what could not be established. NOT ESTABLISHED beats a complete invented answer.**
