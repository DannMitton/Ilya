# SCHEDULE: the road to the release

r2, written by the desk (Opus) 2026-10-12 about 22:05, when Dann asked for a schedule that is not stale (21:52: *"I think we need a schedule that isn't stale, can you arrange that?"*). It replaces r1 of 2026-09-16, which is in `SCHEDULE-archive.md` verbatim. Every line below was checked against `git log`, `QUEUE.md`, and the tree on 2026-10-12 between 20:20 and 22:05. Floor: `72b564f` (shipped 2026-10-12 20:34).

**The target is Friday 2026-10-30, and it is a target, not a wall** (Dann 2026-09-26 00:21: *"That date is artificial"*). The date never sizes the work (`CONTRACT.md` §1 item 7): where the work does not fit, the date moves, not the work. Dann's remark of 2026-10-02 09:00, not a ruling: he doubts a release before January 2027.

**How to use it.** Each line is one piece of work, its lane, and what it waits on. A line is ticked when Dann has walked it, not when it is written. **The desk keeps this file true at every close and whenever a row moves** (`CONTRACT.md` §1 item 8, Dann 2026-10-12 21:53: *"you are the Project Manager. I expect you to be on top of current file accuracy"*). Run order inside a lane is `QUEUE.md`'s; this file says what remains before the release and in which week.

**The lanes.** *Mac*: Code in the desktop app's Code tab, one row at a time; the reader and anything that needs set 3, set 4, or Dann's songs runs here. *Cloud*: a Claude Code cloud session the desk starts in Dann's Chrome, on `cloud-lane-2`; pure modules, strings, and docs. *Desk*: briefs, reviews, drafts, walks the desk can take. *Dann*: rulings, French, walks, the ship.

---

## Where it stands, 2026-10-12 22:05

- **THE ONE THING, the scan reader at 95 on unseen songs:** set 4 reads 97.9 in total, 9 of 10 songs pass; 4F reads 94.1 (`STATE.md`, the close of 2026-10-12). Row 89 is fixing its two misses.
- **The need is met on an engraved score and not yet shown on a scan:** «Within Four Walls» from MusicXML draws Text, Markup, and Insights in both languages; «Средь шумного бала» from a scan draws no syllables in Markup (row 93). Desk's reading, 2026-10-12 21:50.
- **Shipped and not walked by Dann:** about 40 rows (`QUEUE.md`, "Shipped, not walked").

## This week. Tuesday 2026-10-13 to Sunday 2026-10-18

**Mac**
- [ ] **Row 89**: the quadruplet and the double flat in 4F. RUNNING since 20:45. Then 4F re-scored against 95.
- [ ] **Row 93**: why Markup draws no syllables on a scan with a typed poem. Measures only; after row 89. Then a fix row, which the desk writes from its report.
- [ ] **Row 82**: the pre-reform model (N.184). Up to 11 hours of the Mac; runs when the Mac is free for a long stretch, overnight if Dann asks for that.
- [ ] **Corrections slice 4** (`QUEUE.md` row 5, slices 4 to 6): the station code leaves the page, no visible change. After row 93's fix.

**Cloud**
- [ ] **Row 84**: N.86's dead code. BUILT `9e1af16`; goes in with the next ship.
- [ ] **Row 51, Corrections slice 2**: what Ilya can offer for a bar. RUNNING in the cloud from about 22:20 (brief r2, Fable-reviewed).
- [ ] **Corrections slice 3**: the singer's answer kept per bar. Brief not written; pure, so cloud.
- [ ] **Row 90**: tonight's ruled strings (the Insights frame line, the two Guide conventions lines). Brief not written.
- [ ] **Row 91**: reflexive -ся read hard, and -ться's [ʌ] reconstituting to [ɑ], after Grayson (ruled 20:33). Brief not written.

**Dann**
- [ ] **The next ship**: rows 84, 89 (when walked by the desk), and the cloud rows that land. The desk prepares it.
- [ ] **The walk of rows 78a, 78b, 78c** on «Средь шумного бала», after row 93's fix.
- [ ] **The Shane switch at release** (`apps/web/src/lib/wall.ts:6-7`): what it does on 2026-10-30. Dann's ruling, owed since r1 of this file.

## Week of Monday 2026-10-19 to Sunday 2026-10-25

**Mac**
- [ ] **Corrections slices 5, 6, 7** (`../sessions/plan-corrections-build_r1_2026-10-08.md`): the rail and the fixed panel; the mark, the line, and the review; removal over a reach and "Through the bar". Each walked before the next starts.
- [ ] **Rows 47 and 48**: the octave line for the singer's range, and the tempo estimate. Strings ratified 2026-10-08.

**Cloud**
- [ ] **Corrections slice 9**: "Same in m. 22", the comparator (pure part).
- [ ] **Row 71**: N.182, how Ilya suggests a key. HELD by Dann 2026-10-11 23:00; the desk checks it against the ruled voice-family table before asking to release it.

**Desk and Dann**
- [ ] **N.84, the Guide**: rewritten for the interface as it is, English and French, with new screenshots; carries the fry essay (N.174). Four English drafts exist (2026-10-01). Starts once Corrections slice 6 is walked, because the Guide describes the review. Its size is NOT ESTABLISHED.
- [ ] **N.170 steps 1 and 2**: freeze a review build and draft the packet for outside readers. Dann ruled 2026-09-24 21:03 to wait *"until Ilya has really taken shape"*; the desk puts the question to him once row 93's fix and Corrections slice 6 are walked.
- [ ] **Walks**: the desk takes the shipped rows it can walk on the alias and reports each; Dann walks what needs his eye, a few a sitting.

## Week of Monday 2026-10-26 to Friday 2026-10-30

- [ ] **Corrections slices 10 and 11**: keys at the desk, and the scan strip in the review.
- [ ] **N.170 steps 3 and 4**: singers watched, and the ADPList session.
- [ ] **The format walk and a print walk**, every format Ilya accepts, to catch what the month broke.
- [ ] **N.83**: the end-to-end walkthrough.
- [ ] **N.88**: marketing, Dann's own and optional.
- [ ] **The release**: a fast-forward of `Shane` onto `main` (`ENVIRONMENT.md`, "HOW A RELEASE ACTUALLY GOES OUT"). Only when Dann says it is ready; the date moves before the quality does.

## Waiting on something outside this schedule

- **Corrections slice 8**, the singer's tempo, dynamic, and hairpin marks: waits on N.120 (row 48) and N.177 (dynamics as a layer).
- **Row 9**, voice type slice B: waits on the pooled norms table r2.
- **Row 13**, where a stored scan's minute goes: partly overtaken by `bbe524b`.
- **N.115**, moving a bar between systems by hand, and the lone last bar: set aside by Dann 2026-10-12 21:10 until a user reports it.
- **The Corrections redesign runs beside the reader work, not after it** (Dann 2026-10-12 21:50: *"We will handle the Corrections redesign in parallel with the OCR/OMR improvements."*).

## Done since r1, for the record

The weeks of 2026-09-17 to 2026-10-12 are closed in `SCHEDULE-archive.md`. Since the r1 checks of 2026-10-11: `b80b543`, `fd1c86a`, `72b564f` shipped; set 4 measured at 97.5 and corrected to 97.9; rows 79 and 85 walked by Dann 2026-10-12; N.168's first-slice French found already ratified (2026-09-30) and ticked; N.86's dead code built (row 84).

---

## LATER, for the record

Everything else in the sort. Nothing there is lost; it is the first list after
the release.

- **Reading a phone photo of a score** (curved or tilted page) and **a HEIC decoder.** Deferred to after the release by Dann 2026-09-24 19:43; evidence `../sessions/memo-code-phone-photo_r1_2026-09-24.md`. Added 2026-09-30.
