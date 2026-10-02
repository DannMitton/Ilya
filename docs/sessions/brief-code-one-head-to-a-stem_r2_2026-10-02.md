> **SUPERSEDED at about 02:14 on 2026-10-02 by `brief-code-a-head-sits-at-the-end-of-its-stem_r3_2026-10-02.md`. Do not build from this file.**

# Brief for Code: on the voice staff, a head sits at the end of its stem

**Written by:** the desk (Fable), 2026-10-02 about 01:50. Amended in place at 02:00 with the ossia. **Revised to r2 at 02:20: section 3a holds the desk's rulings on Code's section 3 report, withdraws part of section 4, and changes section 6. Build to section 3a.** **Serves:** THE ONE THING in `docs/memory/STATE.md`: a scan in, a melody out, Russian seated under it. This is part of phase 5 of `plan-scan-reader_r4_2026-10-01.md`, taken early because the metre's arithmetic needs the right notes. **Runs after `QUEUE.md` row 19 meets its section 6 items 1 and 6.** Background: `truth-draft-tchaikovsky-op38-3-voice_r1_2026-10-02.md`, which counts the heads in every bar.

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

---

## 1. What was observed

**Heads read against the desk's count, at the row 18 build** (`report-code-staves-traced-and-straightened_r1_2026-10-01.md`, section 6 item 7; the count is draft, by eye, not proofed by Dann):

| page | heads printed | heads read |
|---|---|---|
| 1 | 40 | 36 |
| 2 | 70 (18, 17, 19, 16 by system) | 86 (24, 19, 26, 18) |
| 3 | 64 (17, 19, 19, 9) | 76 |
| the song | 174 | 198 |

- **Code looked at the circled heads on systems 1 and 3 of page 2:** "the extra marks are the flags of eighth notes, which the filled-head matched filter takes for heads on the 1878 plate" (the same report).
- **Page 1 reads four heads too few.** Nobody has looked at which.
- **The same page 2 read 67 to 70 heads in the measurement runs of 2026-10-01** (`measure-staves_r1_2026-10-01/m3-tch.json`), with the staves taken from `detect_staves` on the straightened page. It reads 82 to 86 with the staves taken from the trace. The notehead finder is the same in both.
- **On this plate every sung eighth note carries its own flag.** No beam appears on the voice staff of any of the three pages.

## 2. What is established, each line carrying its `path:line`

Line numbers are the working tree at `a7fd740`.

- `detect_heads` is a matched filter: an ellipse 1.35 staff spaces wide and 0.92 tall, scored against the page's ink, kept where the response is at least 0.84, inside the voice staff's band, with one hit kept per 0.8 staff spaces (`tools/e16-harness/reader/reader.py:1074-1100`).
- A head is kept only if `has_stem` finds a tall, thin run of ink 0.35 to 1.05 staff spaces to either side of it (`reader.py:1107-1136`, called at `:1161`).
- A head's pitch comes from its y against the staff's rows (`reader.py:1102-1105`).
- Two heads at one x in one bar become two events, one after the other; the second takes an id suffix (`run_page2.py:463-469`). The same comment says the reader does not read chords.
- A note's length comes from the ink area joined to its head, against `FLAG_AREA_RATIO = 1.65` (`reader.py:1671`; `run_page2.py:267`).

## 3. Measure before you change anything

Report these first. **If they agree with the ruling in section 4, build without waiting for the desk. If any contradicts it, stop and report.**

1. **For each of the 99 bars, on the app's own path after row 19:** heads read beside the desk's count.
2. **For each extra head:** what the mark is. **For each missed head:** what stands there in the image the finder sees.
3. **Why page 2 read 67 to 70 heads in the measurement runs and 82 to 86 in the build.** Say what differs between the two inputs to `detect_heads`.
4. **On every voice staff of every scan page in the tree:** for each stem, how many of the finder's hits lie at each of its two ends.
5. **Heads per bar on the other scan pages,** by looking, as you did for their bars.
6. **On the 23 render fixtures:** whether keeping one head to a stem changes any read.
7. **On every voice staff of every page in the tree:** how many stems carry two heads at the same end. The desk expects none.

## 3a. The desk's rulings on the section 3 report (Fable, 2026-10-02 02:20)

**Read in full:** `report-code-one-head-to-a-stem_r1_2026-10-02.md`, `tools/e16-harness/reader/hollow.py`, and `run_page2.py:300-340`.

**The desk's ruling in section 4 was wrong where it says a mark at a stem's other end is a flag, and that sentence is withdrawn.** Measurements 4 and 7 refute its premise: one stem on the scan pages has hits at both ends, and 41 have two hits near one end, each a filled head with a hollow detection on the hook of its flag. The 43 extra heads on the Tchaikovsky pages are all hollow detections. **The hollow finder is in scope. So are the 18 filled heads that go missing.**

**The project has met this before.** N.95 found the ring filter firing on the white space that a stem and its flag enclose. It tried a distance box around the filled head and withdrew it, because the box could not tell those detections from a render's hollow chord on a shared stem. It then let the event stand and withheld only its length (`run_page2.py:305-337`). The event still counts as a note, which is what the report's per-bar table shows.

Each ruling is a DESK DEFAULT.

1. **A head sits at the end of its stem.** A stem leaves a head in one direction. On the voice staff of a system with a braced pair, a hollow detection whose stem runs on past it in both directions is not a head: it is the white space inside a flag's hook. It is not emitted as a note. Keep its position in the geometry dict, as evidence of a flag for the note-lengths brief.
2. **Measure it before building it,** on all 83 hollow detections of the nine scan pages: how far the stem's ink runs past the detection, above it and below it; and, by looking, which of the 83 are genuine hollow heads. The desk expects none on the Tchaikovsky pages and a few on the Lamm and Bessel pages. If one measure separates the two groups with a gap, set the bound from the gap and name the pages (plan r4, principle 9). **If they do not separate, stop and report.** This is not a distance box around a filled head, and it does not need the filled head to have been found.
2a. **A second measure, added at 02:25 from Dann's words of 02:11:** *"We faced a similar challenge when designing Loupe: we had to teach it that a natural sign (the accidental) features a closed polygon."* A hollow head is a closed shape: its white core is shut in all the way round. The inside of a flag's hook may be open where the curl does not meet the stem. The reader already counts closed white spaces (`count_holes`, `tools/e16-harness/reader/reader.py:1330-1335`). For each of the 83 detections, report also whether its white core is closed. Then build on what the two groups show: the stem measure, the closed-core measure, or both where both separate them. Report every detection on which the two measures disagree.
3. **A system with no braced pair is left as it is,** as in row 19. The render fixtures then stay byte-identical by construction, and N.95's shared-stem chords on `sunless-06` are untouched.
4. **The ossia ruling stands, narrowed.** Two heads on one stem are one event with an alternative only when both are the same kind, both filled or both hollow, and both sit at the stem's head end. A filled head with a hollow detection beside it is never an ossia. Dann's rulings of 01:55 and 01:57 in section 4 are unchanged.
5. **The missing filled heads are in scope.** For each of the 18, found with the desk's per-bar count, report which test drops it and by how much: the filter's response; each of `has_stem`'s conditions in turn (the reach to either side, the length of the run, the thinness at the probe); the clef-and-key mask. Fix a cause only where the change separates cleanly from the false candidates it would admit, counted on every scan page and every render page. Lower no threshold without that count. Report what you leave.
6. **Section 6 item 2 is withdrawn.** Nobody has a count to the head for the other scan pages (report, section 5), and an invented one is barred. In its place: on those pages, no hollow detection that a stem runs through is emitted, and every hollow head you judged genuine by looking still is. The desk owes head counts for those pages, from crops one bar wide.
7. **Section 6 item 1 stands,** with one addition: the three Tchaikovsky pages emit no hollow head. If rulings 1 to 4 are met and item 1 is not, leave the code WRITTEN, and report each bar that is still unequal with what stands in it.

## 4. The rulings this serves, and the ones it touches

- **Dann, 2026-10-01 16:08:** *"voice lines are usually monodic while piano lines feature chords, generally. Not always, but this is a useful starting place."*
- **The desk's ruling, a DESK DEFAULT:** on the voice staff, a stem carries one note head, at one of its ends. ~~A mark at the stem's other end is a flag or a beam and is never a second head. Where the finder fires at both ends of one stem, the head is the end whose mark is more like a head, and you say how you judged that.~~ **WITHDRAWN at 02:20; see section 3a.** 
- **Dann, 2026-10-02 01:53, on two heads at one end of a stem:** *"rarely a note on a vocal line will have two noteheads; it is my understanding that this is an ossia? Very iften one notehead will be smaller (say ~75%?) to show it is the less common option. I don't want a legitimate ossia to crash the system"* (transcribed as written).
- **The ruling on the ossia. The larger head is RULED BY DANN, 2026-10-02 01:55:** *"for Ilya's purposes it would be wisest to choose the larger notehead of the ossia by default? The user should be decisive about which note they are going to sing; ILya isn't equipped to handle two values at a time."* The rest is a DESK DEFAULT. Two heads on one stem are ONE event with an alternative, never two events. The sung note is the larger head, and Ilya carries that one pitch. The other head is kept beside it as the event's alternative pitch, in the geometry dict, and is not emitted as a note, so the bar's length and every later syllable stay where they are. Judge "larger" by comparing the two heads with each other; the three quarters is Dann's recollection and no number is sourced, so none goes in the code. Where the two heads are the same size, keep both pitches in the geometry dict as a choice of equal standing, emit the upper for now, count the event, and list it in the report. **Dann, 2026-10-02 01:57:** *"I feel like Ilya can reproduce two notes of the same size? But this construct should be flagged for user intervention: the user should have control over selecting which possiblity they prefer, or deleting the other option"* (transcribed as written). Drawing both heads and flagging the note need the page model and Markup, so they belong to the page-model brief and not to this one; this brief's part is to keep both pitches and lose neither. Nothing halts.
- **Gould, rule 68 (p. 435):** older vocal music gives each syllable's note its own flag, so flags are everywhere on these pages. **Rule 86 (pp. 14 to 15):** a stem is 3.5 staff spaces long. The desk's extraction is `claude/gould-vocal-engraving-rules_v7_2026-08-05.md` in project knowledge. Gould's pages on notehead size (pp. 10 to 12) were never photographed, so no head dimension is sourced.
- **Plan r4, principle 5:** decide late, by likeness and by sense. **Principle 9:** no new fixed number without the pages that fix it being named.

## 5. Constraints

- **Edit `tools/e16-harness/reader/` only.**
- **Render fixtures stay byte-identical,** or you say exactly which bytes move and why before shipping.
- **The pins hold:** Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4.
- **No oracle in the runtime path.** The desk's count is for measuring, never for reading.
- **Out of scope, and not to be fixed in passing:** note lengths, the count of flags on a stem, the metre read, rests, and any text. Note lengths are the next brief, and the flags this brief sets aside are its evidence, so keep where each flag is.
- **Do not re-derive `K_S`. Do not change `VocalLineEvent`.**
- **Event ids will change wherever a head is added or removed.** Accepted.
- **No agent writes with git.**

## 6. Done when

1. **Tchaikovsky, on the app's own path:** the heads read equal the desk's count in at least 95 of the 99 bars, no bar is wrong by more than one head, and the song's total is 170 to 178.
2. **Every other scan page in the tree:** heads per bar equal your count from step 3.5 in at least 95 of every 100 bars.
3. **Each stem on a voice staff yields one event.** A second head at the same end of the stem is kept as that event's alternative and counted, per section 4. Build a fixture for it, since no page in the tree has one: add a smaller second head to one stem of a Tchaikovsky voice bar, say how you made it, and show that the bar reads the same number of events as before. The report says how many second hits were set aside as flags on each page, and keeps their positions in the geometry dict.
4. **Render fixtures:** byte-identical, per constraint.
5. **Read time per page** is reported beside row 19's.
6. All gates at baseline, or the moved numbers named with the tests that moved them. `WRITTEN` on the code. `DONE` is Dann's walk of the Tchaikovsky PDF on the alias.

## 7. Report back

`docs/sessions/report-code-one-head-to-a-stem_r1_2026-10-02.md`: the measurements of section 3, the results against each line of section 6, and **what could not be established. NOT ESTABLISHED beats a complete invented answer.**
