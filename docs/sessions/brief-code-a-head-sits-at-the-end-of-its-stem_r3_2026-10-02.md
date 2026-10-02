# Brief for Code: on the voice staff, a head sits at the end of its stem

**Written by:** the desk (Fable), 2026-10-02 about 02:14; the core's shape added as a third measure at 02:20 (Dann, 02:15). **This is the whole brief for `QUEUE.md` row 20. It replaces `brief-code-one-head-to-a-stem_r1_2026-10-02.md` and `_r2_`; do not read those.** **Serves:** THE ONE THING in `docs/memory/STATE.md`: a scan in, a melody out, Russian seated under it. Part of phase 5 of `plan-scan-reader_r4_2026-10-01.md`, taken early because the metre's arithmetic needs the right notes. **Runs on the tree as row 19 left it** (built; the files are the same whether or not Dann has shipped them). Background: your own `report-code-one-head-to-a-stem_r1_2026-10-02.md`, and `truth-draft-tchaikovsky-op38-3-voice_r1_2026-10-02.md`, which counts the heads in every bar.

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

---

## 1. What was observed

All from `report-code-one-head-to-a-stem_r1_2026-10-02.md`, on the app's own path after row 19. The desk's count is draft, by eye, not proofed by Dann.

- **The three Tchaikovsky pages read 199 heads where 174 are printed.** 61 of the 99 bars hold the printed number of heads, and 10 are wrong by more than one.
- **156 of the 199 are filled-head detections and 43 are hollow-head detections.** The song prints no hollow head. Each hollow detection that Code looked at sits on the hook of an eighth note's flag, where the curl and the stem enclose a white space about a staff space wide.
- **On the nine scan pages, 77 of the 83 hollow detections lie within 3.5 staff spaces of a filled head.** 41 stems carry a filled head and a hollow detection near the same end. One stem has hits at both ends.
- **18 printed filled heads are not read.** 13 pass the filter and fail `has_stem`. Others have a stem and a response under 0.84, or fall in the clef-and-key mask. Two are not accounted for.
- **With every hollow detection left out, simulated and not built:** 156 heads, 85 of 99 bars equal, 4 wrong by more than one.
- **The 23 render fixtures hold 68 hollow detections,** 12 of them within 3.5 staff spaces of a filled head, and 25 stems on `sunless-06` carry two hits near one end. No render system has a braced pair of staves (row 19's report, section 6 item 6).
- **Nobody has counted heads per bar on the other scan pages.** Code could not count to the head at the size it viewed them, and said so.

## 2. What is established, each line carrying its `path:line`

Line numbers are the working tree after the row 19 build.

- `detect_heads` is a matched filter: an ellipse 1.35 staff spaces wide and 0.92 tall, kept where the response is at least 0.84, one hit per 0.8 staff spaces (`tools/e16-harness/reader/reader.py:1108-1134`).
- A filled hit is kept only if `has_stem` finds a tall, thin run of ink 0.35 to 1.05 staff spaces to either side, with a thin probe 1.5 staff spaces along it (`reader.py:1141-1170`, called at `:1195`).
- `detect_hollow_heads` is a ring filter: the ring's response less the core's, kept at 0.38 or more, with a width guard and a height guard (`tools/e16-harness/reader/hollow.py:36-95`, guards at `:55-74`; called at `reader.py:1200`). `merge_heads` drops a hollow hit only within 0.9 staff spaces of a filled one (`hollow.py:97-106`).
- **The project has met the hook before.** N.95 found the ring filter firing on the white space that a stem and its flag enclose. A distance box around the filled head was tried and withdrawn, because it could not tell those hits from a render's hollow chord on a shared stem. The event was left standing and only its length withheld (`tools/e16-harness/reader/run_page2.py:305-339`).
- Two hits at one x in one bar become two events, one after the other (`run_page2.py:463-469`).
- `count_holes` counts the closed white spaces inside a component. The accidental reader uses it (`reader.py:1330-1335`).

## 3. Measure before you change anything

Report these first. **If the first one separates its two groups, build without waiting for the desk. If it does not, stop and report.**

1. **For each of the 83 hollow detections on the nine scan pages:**
   - how far the stem's ink runs past the detection, above it and below it;
   - whether the detection's white core is closed all the way round;
   - the white core's shape (Dann, 02:15; section 4): its width, its height, and its area in staff spaces, and whether a straight run of stem ink forms one of its walls. Measure it on the image with the staff lines still in it, and again with them removed, and say which image the test should use: a staff line through a head that sits on a line cuts its core in two, and removing that line can open the core;
   - by looking, whether it is a genuine hollow head or the inside of a flag's hook. The desk expects no genuine one on the Tchaikovsky pages and a few on the Lamm and Bessel pages.
   Say which of the three measures (the stem, the closed core, the core's shape) separate the genuine heads from the hooks, alone or together, and by what gap. List every detection on which the measures disagree. Say how many genuine hollow heads the scan pages hold. The Tchaikovsky pages should hold none, so take the same three measures on the render fixtures' genuine hollow heads as well and report them apart, so that the genuine group does not rest on a handful.
2. **For each of the 18 printed filled heads that are not read,** found with the desk's per-bar count: which test drops it and by how much. Take the filter's response, then each of `has_stem`'s conditions in turn (the reach to either side, the length of the run, the thinness at the probe), then the clef-and-key mask.

## 4. The rulings this serves, and the ones it touches

- **Dann, 2026-10-01 16:08:** *"voice lines are usually monodic while piano lines feature chords, generally. Not always, but this is a useful starting place."*
- **Dann, 2026-10-02 02:11, on the hook read as a hollow head:** *"We faced a similar challenge when designing Loupe: we had to teach it that a natural sign (the accidental) features a closed polygon."*
- **Dann, 2026-10-02 02:15:** *"The closed shape of a notehead is going to feature specific, predictable dimensions, isn't it? The shape of a flag, even if it connects with the note to close, will feature a different predictable shape, won't it? Maybe we can use those morphologies to make the differnece to our reader?"* (Transcribed as written.) **The desk's reading, a DESK DEFAULT:** the core's shape is a third measure beside the other two. A head's core is ringed by curved ink on every side and sits on a line or in a space. A hook's core has the straight stem for one wall. Every dimension is read in staff spaces and taken from the pages, never assumed, because one publisher's punches differ from another's.
- **The desk's ruling, a DESK DEFAULT: a head sits at the end of its stem.** A stem leaves a head in one direction. On the voice staff of a system with a braced pair, a hollow detection is a head only if it passes the measure or measures that step 3.1 shows to separate the groups: the stem does not run on past it in both directions, its white core is closed, and the core has a head's shape and not a hook's. No head dimension is sourced, so any bound on the shape comes from the two measured groups, sits in the gap between them, and is reported with that gap. Otherwise it is the inside of a flag's hook. A hook is not emitted as a note. Its position is kept in the geometry dict, as evidence of a flag for the note-lengths brief.
- **A system with no braced pair is left as it is,** as in row 19. The render fixtures then stay byte-identical by construction.
- **TOUCHED:** N.95 let a hook stand as an event and withheld its length (`run_page2.py:305-339`). On a braced system the hook is no longer an event. **DESK DEFAULT.** Reason: the event shifts every later syllable by one note, and the measures of step 3.1 are not the distance box that N.95 withdrew.
- **The ossia. Dann, 2026-10-02 01:53:** *"rarely a note on a vocal line will have two noteheads; it is my understanding that this is an ossia? Very iften one notehead will be smaller (say ~75%?) to show it is the less common option. I don't want a legitimate ossia to crash the system."* **01:55:** *"for Ilya's purposes it would be wisest to choose the larger notehead of the ossia by default? The user should be decisive about which note they are going to sing; ILya isn't equipped to handle two values at a time."* **01:57, on two heads of one size:** *"this construct should be flagged for user intervention: the user should have control over selecting which possiblity they prefer, or deleting the other option."* (All three transcribed as written.)
- **What that means here, the larger head RULED BY DANN and the rest a DESK DEFAULT:** two heads on one stem are one event with an alternative, never two events, when both are the same kind (both filled or both hollow) and both sit at the stem's head end. The larger head is the note. The other is kept as the event's alternative pitch in the geometry dict and is not emitted. Compare the two heads with each other; no size is sourced, so no number goes in the code. Where the two are the same size, keep both pitches, emit the upper, count the event, and list it in the report. Showing both heads and flagging the note belong to the page-model brief. A filled head with a hollow detection beside it is never an ossia. Nothing halts.
- **The missed filled heads are in scope. DESK DEFAULT.** Fix a cause only where the change separates cleanly from the false candidates it would admit, counted on every scan page and every render page. Lower no threshold without that count (plan r4, principle 9). Report what you leave.
- **Gould, rule 68 (p. 435):** older vocal music gives each syllable's note its own flag. **Rule 86 (pp. 14 to 15):** a stem is 3.5 staff spaces long. Gould's pages on notehead size (pp. 10 to 12) were never photographed, so no head dimension is sourced. The extraction is `claude/gould-vocal-engraving-rules_v7_2026-08-05.md` in project knowledge.

## 5. Constraints

- **Edit `tools/e16-harness/reader/` only.**
- **Render fixtures stay byte-identical,** or you say exactly which bytes move and why before shipping.
- **The pins hold:** Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4.
- **No oracle in the runtime path.** The desk's count is for measuring, never for reading.
- **Out of scope, and not to be fixed in passing:** note lengths, the count of flags on a stem, the metre read, rests, and any text.
- **Do not re-derive `K_S`. Do not change `VocalLineEvent`.**
- **Event ids will change wherever a head is added or removed.** Accepted.
- **No agent writes with git.**

## 6. Done when

1. **Tchaikovsky, on the app's own path:** the heads read equal the desk's count in at least 95 of the 99 bars, no bar is wrong by more than one head, the song's total is 170 to 178, and no hollow head is emitted.
2. **The other scan pages:** no hook is emitted, and every hollow head you judged genuine in step 3.1 still is. The desk owes head counts for these pages, from crops one bar wide.
3. **Two heads of one kind at a stem's head end are one event.** Build a fixture, since no page in the tree has one: add a smaller second filled head to one stem of a Tchaikovsky voice bar, say how you made it, and show that the bar reads the same number of events as before and keeps the alternative.
4. **Each hook's position is in the geometry dict,** and the report gives the count per page.
5. **Render fixtures:** byte-identical, per constraint.
6. **Read time per page** is reported beside row 19's 29 s for the three Tchaikovsky pages.
7. All gates at baseline, or the moved numbers named with the tests that moved them. `WRITTEN` on the code. `DONE` is Dann's walk of the Tchaikovsky PDF on the alias.

**If items 2 to 7 are met and item 1 is not,** leave the code WRITTEN and report each bar that is still unequal with what stands in it.

## 7. Report back

Add a section "Build against brief r3" to `docs/sessions/report-code-one-head-to-a-stem_r1_2026-10-02.md`: the measurements of section 3, the results against each line of section 6, and **what could not be established. NOT ESTABLISHED beats a complete invented answer.**
