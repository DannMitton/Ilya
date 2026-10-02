# Brief for Code: the page reader finds every bar, and a barline is confirmed by its system

**Written by:** the desk (Fable), 2026-10-02 about 01:10. **Serves:** THE ONE THING in `docs/memory/STATE.md`: a scan in, a melody out, Russian seated under it. This finishes phase 2 of `plan-scan-reader_r4_2026-10-01.md`, whose gate is 98 of 100 bars. **Runs after `QUEUE.md` row 18 is committed.** Background, read in this order: plan r4 sections 3 and 4; `report-code-staves-traced-and-straightened_r1_2026-10-01.md` from "Build against brief r3"; `truth-draft-tchaikovsky-op38-3-voice_r1_2026-10-02.md`.

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

---

## 1. What was observed

**The reader's bars against the desk's count, Tchaikovsky Op. 38 No. 3, at the row 18 build** (report, section 6 item 7; the count is `truth-draft-tchaikovsky-op38-3-voice_r1_2026-10-02.md`, draft, by eye, not proofed by Dann):

| page | bars printed | bars read |
|---|---|---|
| 1 | 27 (9, 9, 9 by system) | 23 |
| 2 | 35 (9, 8, 9, 9) | 20 |
| 3 | 37 (8, 9, 9, 11) | 16 |
| the song | 99 | 59 |

- **Every bar in this song is a full bar of 3/8.** The voice rests for the first seven bars and for the last six.
- **On every one of the 11 systems, by eye:** each barline on the voice staff stands at the same x as a barline that runs unbroken from the top line of the upper piano staff to the bottom line of the lower one. The voice staff's barline does not join the piano's. The last barline of page 3 is a thin stroke and a thick one.
- **The tacet fixture reads 8 bars of rest where 9 are printed** (report, section 6 item 4), from `detect_tacet_barlines`, which takes the longest of four readings.
- **The same report:** "The existing barline finder lost all but one barline of a piano system on this scan."
- **The other scan pages in the tree** have not had their bars counted by anyone.

## 2. What is established, each line carrying its `path:line`

Line numbers are the working tree at the row 18 build.

- `detect_barlines` looks at the voice staff alone. A connected component of the line-free image counts when its height is 0.85 to 1.35 of the staff's height, its centre lies within 1.2 staff spaces of the staff, and its width is at most half a staff space. A wider component is searched for a solid stroke inside it (`tools/e16-harness/reader/reader.py:1566-1582`, `:1485-1530`).
- Strokes within one staff space of each other collapse to the leftmost (`reader.py:1555-1564`).
- The three bounds are constants in staff spaces: `BARLINE_WIDTH_BOUND = 0.5`, `BARLINE_SPAN_TOLERANCE = 0.25`, `MAX_ROW_WIDTH_BOUND = 1.07`, the last measured on the Lamm scan as the midpoint between 4 false candidates and 6 true ones (`reader.py:1440-1471`).
- `detect_tacet_barlines` takes, for a system with no voice staff, the longest of four lists (`reader.py:1608-1629`).
- The callers are `run_page2.py:388`, `run_page2.py:411`, `envelope.py:102`, and `envelope.py:112`.
- An event id is `r{measureIndex}-{x}`, so a changed bar count renames every later event (`apps/web/src/lib/score/correction.ts:8-18`).

## 3. Measure before you change anything

Report these before writing code.

1. **For each of the 11 Tchaikovsky systems, on the app's own path:** the barlines today's `detect_barlines` returns, and for each printed barline it misses, what that stroke is in the line-free image at that x. The cause of each miss is yours to find.
2. **The true bars per system of every other scan page in the tree,** by looking: the Lamm scan's two pages and the five `robustness-samples` pages. Say which staff of each system you counted on.
3. **On every scan page in the tree, at each printed barline:** does one stroke run unbroken from the top line of the upper piano staff to the bottom line of the lower one? Count the printed barlines where it does and where it does not. Count also the strokes that do so and are not barlines.
4. **The distance in x between a voice-staff barline and its piano barline,** in staff spaces, on the straightened working copy: the whole distribution, not the mean.
5. **On the 23 render fixtures:** whether a test that asks the whole system finds the same barlines as today's on every page. Report every disagreement.

## 4. The rulings this serves, and the ones it touches

- **Dann, 2026-10-01 15:11**, on what the melody includes: *"the metre, the barlines, the pitches, the rhythms, the rests, the dynamics, the tempo indications, and the pickup."*
- **Dann, 2026-10-01 16:02, paraphrased by the desk and not quoted:** the barlines of a piano-vocal score span the voice staff, connect the two staves of the piano, and stand one above the other down the system.
- **Plan r4, principle 4:** the signs of a system vote. **Principle 8:** every fact is read, deduced, or unsure.
- **Gould, rule 181 (p. 519):** vocal staves are barred separately. The desk's extraction is `claude/gould-vocal-engraving-rules_v7_2026-08-05.md` in project knowledge.
- **TOUCHED:** the reader has found barlines on the voice staff alone since it was written (`memo-fable-reader-audit-against-the-guide-model_r1_2026-10-01.md`, error E2). This brief makes the system the witness. **DESK DEFAULT**, on plan r4.
- **TOUCHED:** `MAX_ROW_WIDTH_BOUND` and its two siblings were set on the Lamm scan and the renders. Keep them, replace them, or derive them again, and say which and why. No new fixed number goes in without the pages that fix it being named (plan r4, principle 9).

## 5. Constraints

- **Edit `tools/e16-harness/reader/` only.** If the read report needs a new optional field, add it the way `tacetSystems` was added, and say so.
- **Render fixtures stay byte-identical,** or you say exactly which bytes move and why before shipping.
- **The pins hold:** Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4.
- **No oracle in the runtime path.** The desk's count is for measuring, never for reading.
- **Out of scope, and not to be fixed in passing:** the metre read (page 1 reads 9/8 for a printed 3/8), the flags read as note heads (page 2 reads 86 heads for 70), note lengths, rests, and any text. Those are the next briefs.
- **Do not re-derive `K_S`. Do not change `VocalLineEvent`.** Do not touch `apps/web/src/lib/score/reconciliation/`.
- **Event ids will change wherever a bar count changes.** Accepted, as in row 18.
- **No agent writes with git.**

## 6. Done when

1. **Tchaikovsky, on the app's own path:** the bars read on each system equal the count in section 1, system by system, with at most one bar wrong in the whole song (98 of 99). Measures are numbered without a break across the three pages.
2. **Every other scan page in the tree:** at least 98 of every 100 bars from step 3.2, and no system wrong by more than one bar.
3. **A barline is confirmed by its system.** A stroke on the voice staff that the piano's staves do not answer at the same x, or a piano barline the voice staff does not answer, is not silently taken or dropped: it is counted, per page, in the report. If the read report can carry the count, it does.
4. **A thin stroke and a thick one are one barline,** as today. The line that opens a system is not a barline. The barline that closes a system ends its last bar.
5. **A tacet system's bars come from the same test,** and `detect_tacet_barlines`' choice among four lists is gone. The painted-out fixture of row 18 reads 9 bars of rest for the 9 printed.
6. **Render fixtures:** byte-identical, per constraint.
7. **Read time per page** is reported beside row 18's 31 s for the three Tchaikovsky pages.
8. All gates at baseline, or the moved numbers named with the tests that moved them. `WRITTEN` on the code. `DONE` is Dann's walk of the Tchaikovsky PDF on the alias.

## 7. Report back

`docs/sessions/report-code-bars-by-the-system_r1_2026-10-02.md`: the measurements of section 3, the results against each line of section 6, and **what could not be established. NOT ESTABLISHED beats a complete invented answer.**
