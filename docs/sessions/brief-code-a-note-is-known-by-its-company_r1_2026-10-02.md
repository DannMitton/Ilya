# Brief for Code: on the voice staff, a note is known by its company

**Written by:** the desk (Fable), 2026-10-02 about 03:00. **This is the whole brief for `QUEUE.md` row 21.** **Serves:** THE ONE THING in `docs/memory/STATE.md`: a scan in, a melody out, IPA seated under it and Russian seated under that. Part of phase 5 of `plan-scan-reader_r4_2026-10-01.md`, taken early for the reason row 20 was: the metre's arithmetic needs the right notes. **Runs on the tree as row 20 left it.** Background: your own `report-code-one-head-to-a-stem_r1_2026-10-02.md`, section "Build against brief r3", and `truth-draft-tchaikovsky-op38-3-voice_r1_2026-10-02.md`.

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

**What the singer gets from it.** A singer drops in the Tchaikovsky song and every printed note of the melody is there, so each syllable sits under its own note. Today 18 of the 174 printed notes are absent, and each absence moves every later syllable in its bar.

---

## 1. What was observed

From your report, section "Build against brief r3", on the app's own path after row 20:

- **The three Tchaikovsky pages read 156 heads where 174 are printed.** 85 of the 99 bars hold the printed number, and 4 are wrong by more than one. No hollow head is emitted.
- **18 printed filled heads are not read,** and your table sorts them by the test that drops each:
  - 4 have a response of 0.821 to 0.838, under 0.84. All four have a stem.
  - 5 have a stem run of 0.61 to 1.75 staff spaces, under 2.0.
  - 8 have a stem run of 3.46 to 3.75 staff spaces, and at the probe 1.5 staff spaces along it the ink is 0.64 to 1.61 staff spaces wide, against a limit of 0.42.
  - 1 (`tch-1`, x 2107, y 3517) passes every test and is not kept.
- **What you tried and took out:**
  - A probe at five places admits exactly those 8 on the Tchaikovsky pages. On the four other scan pages it admits 15 more, about 6 of them not heads: a dynamic's ink, the sharps of the seven-sharp key signature on `sunless06 p21`, a clef fragment.
  - A response bound of 0.82 admits two hits on the thick closing barline of `tch-3` (x 3288 and 3290).
  - A run bound of 1.5 admits 2 on the Tchaikovsky pages and 8 elsewhere that nobody looked at.
- **11 of the 18 lie at x 2677 or more:** on page 1 at x 2862, 2883, 3009, 3093, 3167, and 3176; on page 3 at x 2677, 2797, 2821, 2883, and 2909.

**By the desk's eye, and a lead only.** The desk looked at the 18 places on a Poppler raster at 400 dpi, which is not the app's raster. The three sheets are `apps/web/test-results/_desk-heads/missed-row1.png` to `missed-row3.png`, git-ignored, on Dann's Mac. On those sheets:

- a filled head on a stem stands at each of the 18 places;
- most of the 18 are flagged notes, and their flags are long and hang close beside the stem for most of its length;
- on several of the short-run cases the stem is printed as a broken line.

You check all three on the app's raster in section 3. Where your looking disagrees with the desk's, yours stands.

## 2. What is established, each line carrying its `path:line`

Read by the desk in the working tree after row 20, 2026-10-02.

- `detect_heads` is a matched filter for a filled ellipse 1.35 staff spaces wide and 0.92 tall. It keeps a point where the response is at least `thr`, and one point per 0.8 staff spaces (`tools/e16-harness/reader/reader.py:1108-1134`). `thr` is 0.84 unless the caller's `head_thr` says otherwise (`reader.py:1314`).
- `has_stem` looks in the columns 0.35 to 1.05 staff spaces to either side of the head's centre. In ONE column it counts ink upward or downward from the head's row and stops at the first white pixel. The run must reach 2.0 staff spaces. It then reads the width of the ink in the single row 1.5 staff spaces from the head's centre, and that width must be at most 0.42 staff spaces (`reader.py:1141-1170`).
- `has_stem`'s own docstring gives the thin probe's reason: it "rejects bold text bowls and Verovio's solid missing-glyph box, both of which are tall but wide" (`reader.py:1142-1150`). A lead, snippet only: the project's record of the day it was added says the filter had fired on a tempo marking's bowls and on a missing-glyph box (`claude/e16-beam-session-result_2026-07-24.md`, section 5.1, in project knowledge).
- On a braced system, a hollow detection whose core is open, or larger than `HOOK_CORE_AREA_MAX`, is set aside as a hook, and `G['hooks']` holds its x, y, system, score, and core (`reader.py:1202`, and the hook step in `read_page_geometry`, which begins at `reader.py:1285`).
- A system whose clef abstained is not masked for clef and key ink at all (the comment above the `clef_key_mask` step in `read_page_geometry`).

## 3. Measure before you change anything

Report these first. **If step 3.1 separates its two groups on every scan page, build without waiting for the desk. If it does not, stop and report.**

1. **The pool.** On the voice staff of every braced system on the nine scan pages, take every raw candidate of the filled filter at a response of 0.70 or more, before `has_stem` and before the clef-and-key mask. By looking, with each candidate cropped large enough to count on, say for each one whether it is a printed notehead, and if it is not, what it is. Then take these measures for each:
   - the response;
   - **the stem, read as a whole.** The longest vertical run of ink beside the head in the band of columns `has_stem` already searches, counted with breaks bridged: report the run with no break allowed, and with breaks of up to 0.1, 0.2, and 0.3 staff spaces allowed. Say whether following the run across neighbouring columns, for a stem that leans, changes any of them;
   - **the stem's thinnest width** anywhere along that run farther than 1.0 staff space from the head's centre, beside the single probe at 1.5;
   - **its company at the far end of the stem:** whether a hook from `G['hooks']`, a flag, or a beam stands there, and how far from the stem's end;
   - **where it sits:** on a line or in a space of the staff, or outside the staff with ledger-line ink between it and the staff, or outside the staff with none;
   - whether it lies inside the clef-and-key span, and whether that system's clef abstained.

   Say which measures, alone or together, separate the printed heads from everything else, on every scan page, and by what gap. List every candidate on which they disagree. Report the Tchaikovsky pages and the other pages apart.
2. **The 11 near the right edge.** For each of the 18 missed heads, report its measures on the raster before the page is straightened and after. Say whether the 11 differ from the other 7 in either image.
3. **The one not accounted for** (`tch-1`, x 2107, y 3517): name the step that drops it.
4. **The desk's three leads in section 1:** say for each whether the app's raster shows it.

## 4. The rulings this serves, and the ones it touches

- **Dann, 2026-10-01 16:08:** *"voice lines are usually monodic while piano lines feature chords, generally. Not always, but this is a useful starting place."*
- **Dann, 2026-10-01 22:27, plan r4 principle 5:** decide late, by likeness and by sense. A candidate carries a likelihood, and the bar and the system decide.
- **Plan r4, principle 9:** no new fixed number without a check on songs the builders have not seen.
- **Gould, rule 68 (p. 435):** older vocal music gives each syllable's note its own flag. **Rule 86 (pp. 14 to 15):** a stem is 3.5 staff spaces long. Both from `claude/gould-vocal-engraving-rules_v7_2026-08-05.md` in project knowledge, as cited in row 20's brief.
- **The desk's ruling, a DESK DEFAULT: a note is known by its company.** A printed note is a head, a stem, and often a flag or a beam. On the voice staff of a braced system, a filled candidate that misses one of the finder's tests by a little is a head when the rest of the note stands with it:
  - a stem read along its whole length, which may be printed broken and may have a flag lying beside it;
  - where the note has one, a flag or a beam at the stem's far end;
  - a place a note can sit: a line or a space of the staff, or ledger lines.

  Which of these decide, and every bound, come from step 3.1's two measured groups. Each bound sits in the gap between the groups and is reported with that gap. No dimension is assumed.
- **The thin probe's reason is kept.** It exists to refuse a text bowl and a solid box. Whatever replaces the single probe must still refuse every candidate in step 3.1's pool that is not a head, the dynamic's ink among them.
- **A head admitted by its company is marked.** Keep a list in the geometry dict, `G['byCompany']`, of every head that the strict tests refuse and the company admits, with the measures that admitted it. The page-model brief decides how it is shown.
- **A system with no braced pair is left as it is,** as in rows 19 and 20. The render fixtures then stay byte-identical by construction.

## 5. Constraints

- **Edit `tools/e16-harness/reader/` only.**
- **Render fixtures stay byte-identical,** or you say exactly which bytes move and why before shipping.
- **The pins hold:** Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4.
- **No oracle in the runtime path.** The desk's count is for measuring, never for reading.
- **Lower no threshold on its own.** A bound moves only together with the evidence that pays for it, counted on every scan page.
- **Out of scope, and not to be fixed in passing:** note lengths, the count of flags on a stem, the metre read, rests, any text, and why the finder does not fire on a second head drawn on a stem.
- **Do not re-derive `K_S`. Do not change `VocalLineEvent`.**
- **Event ids will change wherever a head is added.** Accepted.
- **No agent writes with git.**
- **What this displaces:** nothing. It is the next step of THE ONE THING, and it runs before the metre brief.

## 6. Done when

1. **Tchaikovsky, on the app's own path:** the heads read equal the desk's count in at least 95 of the 99 bars, no bar is wrong by more than one head, the song's total is 170 to 178, and no hollow head is emitted.
2. **The other scan pages:** no candidate that step 3.1 judged not a head is emitted, and every head read before this build is still read.
3. **`G['byCompany']`** lists every head the company admitted, and the report gives the count per page.
4. **Render fixtures:** byte-identical, per constraint.
5. **Read time per page** is reported beside row 20's 29.1 s and 28.2 s for the three Tchaikovsky pages.
6. All gates at baseline, or the moved numbers named with the tests that moved them. `WRITTEN` on the code. `DONE` is Dann's walk of the Tchaikovsky PDF on the alias.

**If items 2 to 6 are met and item 1 is not,** leave the code WRITTEN and report each bar that is still unequal with what stands in it.

## 7. Report back

A new file, `docs/sessions/report-code-a-note-is-known-by-its-company_r1_2026-10-02.md`: the measurements of section 3, the results against each line of section 6, and **what could not be established. NOT ESTABLISHED beats a complete invented answer.**
