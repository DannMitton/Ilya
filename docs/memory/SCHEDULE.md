# SCHEDULE: the road to the release

r2, written by the desk (Opus) 2026-10-12 about 22:05, when Dann asked for a schedule that is not stale (21:52: *"I think we need a schedule that isn't stale, can you arrange that?"*). It replaces r1 of 2026-09-16, which is in `SCHEDULE-archive.md` verbatim. Every line below was checked against `git log`, `QUEUE.md`, and the tree on 2026-10-12 between 20:20 and 22:05. Floor: `72b564f` (shipped 2026-10-12 20:34).

**RULED by Dann 2026-10-18 18:26: Friday 2026-10-30 is no longer the release. It is the date he shares Ilya with colleagues for testing and feedback** (*"instead of a release of October 30, that will be the date that I will feel comfortable sharing Ilya with colleagues. SO we will adjust our plan to reflect that."*). That is N.170 steps 1 to 3 (`OPEN.md` §N.170). A release date is NOT SET. The lines below still name "the release" until the desk rewrites this file as r3. Was: **The target is Friday 2026-10-30, and it is a target, not a wall** (Dann 2026-09-26 00:21: *"That date is artificial"*). The date never sizes the work (`CONTRACT.md` §1 item 7): where the work does not fit, the date moves, not the work. Dann's remark of 2026-10-02 09:00, not a ruling: he doubts a release before January 2027.

**How to use it.** Each line is one piece of work, its lane, and what it waits on. A line is ticked when Dann has walked it, not when it is written. **The desk keeps this file true at every close and whenever a row moves** (`CONTRACT.md` §1 item 8, Dann 2026-10-12 21:53: *"you are the Project Manager. I expect you to be on top of current file accuracy"*). Run order inside a lane is `QUEUE.md`'s; this file says what remains before the release and in which week.

**The lanes.** *Mac*: Code in the desktop app's Code tab, one row at a time; the reader and anything that needs set 3, set 4, or Dann's songs runs here. *Cloud*: a Claude Code cloud session the desk starts in Dann's Chrome, on a fresh branch per row (`cloud-lane-2` is merged; row 96 runs on `cloud-lane-3`); pure modules, strings, and docs. *Desk*: briefs, reviews, drafts, walks the desk can take. *Dann*: rulings, French, walks, the ship.

---

## Where it stands, 2026-10-19 23:3x (the desk, Opus; a stopgap until the r3 rewrite owed to the next desk)

- **Shipped 2026-10-19:** `99b78c08` (N.188 printed slurs, accents, fermatas; row 121 the scan's wordless banner), `885986ff` (row 123 the Guide's phrase-end sentences, row 126 slurs outside beams and brackets, row 125 the banner's second sentence). All walked on the alias; row 126 DONE by Dann's look.
- **Row 114 measured:** 513 of 529 notes, 95.7, PASS on the singer's path.
- **In flight:** row 127 (the clef for your range) in the cloud lane; row 128 (tempo chips) in review; row 129 (bracketless beamed triplets, as the print) owed a brief.
- **THE ONE THING for the next thread:** the audit of dropped requests (`../sessions/audit-opus-unbuilt-requests_r1_2026-10-19.md`), ruled by Dann 23:22.
- **2026-10-30** stays the date Dann shares Ilya with colleagues at `ilya.dannmitton.com` (ruled 2026-10-18 18:26 and 2026-10-19 19:59).

## Where it stands, 2026-10-16 12:50

- **THE ONE THING:** the notes from a scan are met on unseen songs (set 4, 97.5; QUEUE row 86). The words from a scan: the browser reader is decided (the float form of `rus_prereform` r2 on the SIMD core, `report-desk-n135-float-form-in-chrome_r1_2026-10-15.md`); 1 of 16 build songs seats 9 of 10; the photocopied pages and the Tchaikovsky are the limit; the next model is row 105 (Mac, after Sunday).
- **Ruled 2026-10-16:** Input's two views, Poem and Lyrics (`OPEN.md`, "N.135 STAGE 3"); row 104 running in the cloud lane since 12:30.
- **Shipped since 2026-10-12:** `cloud-lane-5` (rows 90, 94, 95, 97), `cloud-lane-7` (row 98), `cloud-lane-10` (rows 91, 99, 100, 101, 102), `cloud-lane-9` (rows 5, 47, 13, 48), row 82's retrain report. The unwalked backlog was accepted 2026-10-14 22:26; the keep-or-drop walk left 27 kept, 8 dropped.
- **The lanes this week:** the shared pool is at 95 percent with a run-out before Sunday 05:00, so the Mac lane waits for Sunday; the cloud credit ($63 to 5 November) carries row 104, then stage 2a and row 106.

## Where it stood, 2026-10-12 23:45

- **THE ONE THING, the scan reader at 95 on unseen songs:** set 4 passes on all ten songs; 4F reads 98.0 after row 89 (`1ec2ef2`). The double flat is still read as a single flat (row 26).
- **The need is met on an engraved score and not yet shown on a scan:** «Within Four Walls» from MusicXML draws Text, Markup, and Insights in both languages; «Средь шумного бала» from a scan draws all its syllables in Markup since `6c69161` (row 93, ratified 2026-10-14 02:56), from a typed poem, because Ilya reads no words from a scan (N.135). Desk's reading, 2026-10-12 21:50.
- **Shipped and not walked by Dann:** about 40 rows (`QUEUE.md`, "Shipped, not walked").

## This week. Tuesday 2026-10-13 to Sunday 2026-10-18

**Mac**
- [x] **Row 89**: the quadruplet in 4F. SHIPPED `1ec2ef2`; 4F 98.0 PASS. The double flat was not built.
- [x] **Row 93**: Markup blank on a stored scan. Cause found by the desk 2026-10-14 (seats under the old reader's note names); fix SHIPPED `6c69161` (N.185, `../sessions/report-code-row93-seats-under-old-names_r1_2026-10-13.md`); ratified by Dann 02:56.
- [x] **Row 82**: the pre-reform model (N.184). First model 2026-10-15 (`report-code-prereform-model_r1_2026-10-12.md`), retrain to 30,000 the same evening (`report-code-row82-retrain_r1_2026-10-15.md`, shipped `01b638a`); the float form is the browser reader. The next model is row 105.
- [x] **Corrections slice 4** SHIPPED `263aa48a` 2026-10-15 (merge of `cloud-lane-9`; `report-code-row5_r1_2026-10-15.md`). Was: BUILT on `cloud-lane-9`, not merged. (`QUEUE.md` row 5, slices 4 to 6): the station code leaves the page, no visible change. Row 93's fix has shipped (`6c69161`); this is not started.

**Cloud**
- [x] **Row 84**: N.86's dead code. SHIPPED `1ec2ef2` (desk check 2026-10-14).
- [x] **Row 51, Corrections slice 2**: what Ilya can offer for a bar. SHIPPED `1ec2ef2`.
- [ ] **Corrections slice 3**: the singer's answer kept per bar. Brief not written; pure, so cloud.
- [x] **Row 90** SHIPPED `0b0c52a` 2026-10-14 (with rows 94, 95, 97; `../sessions/report-code-rows90-94_r1_2026-10-14.md`). Was: tonight's ruled strings (the Insights frame line, the two Guide conventions lines). Brief not written.
- [x] **Row 91** SHIPPED `b21ce8a` 2026-10-15 (`../sessions/report-code-row91-reflexive-sya_r1_2026-10-15.md`), with rows 99, 100, 101, 102. Was: reflexive -ся read hard, and -ться's [ʌ] reconstituting to [ɑ], after Grayson (ruled 20:33).

**Dann**
- [x] **The next ship** went out as `50a5f85` (row 96) and `0b0c52a` (rows 95, 97, 90, 94) on 2026-10-14. Was: rows 84 and 89 went out in `1ec2ef2`; this ship carries `6c69161` and the cloud rows that land (row 96). The desk prepares it.
- [x] **The walk of rows 78a, 78b, 78c**: ACCEPTED without a walk, Dann 2026-10-14 22:26 (backlog cleared, `QUEUE.md`). Was: the walk on «Средь шумного бала». Begun 2026-10-14 03:00: 78a's Insights lines and running head shown to Dann by picture (his ruling on them not given); 78b ruled by picture, stroke to 0.098 sp (one constant owed to Code); placeholder items cannot show on this song with his voice; 78c not yet looked at.
- [x] **Row 96** SHIPPED `50a5f85` 2026-10-14 (`../sessions/report-code-row96-nothing-over-the-footer_r1_2026-10-14.md`). Was: RUNNING in the cloud lane on `cloud-lane-3` (QUEUE row 96); its report comes FIRST at the next session**: the Insights chart running into the page footer (page 3, «Средь шумного бала»). Then row 95 (the scan banner), N.135 (ruled a priority 2026-10-14 02:44).
- [x] **The Shane switch at release** (`apps/web/src/lib/wall.ts:6-7`): CLOSED 2026-10-19 19:5x (DESK DEFAULT): `apps/web/.env` is tracked and sets `PUBLIC_INCLUDE_MARKUP_INSIGHTS=true`, and THE TARGET (Dann 2026-10-18 18:44) names Markup and Insights, so every build shows them. **The address, RULED by Dann 2026-10-19 19:59** (*"1"*, on the desk's two options): colleagues get `ilya.dannmitton.com`; on 2026-10-30 `main` is moved to that day's build with one paste from Dann, and stays fixed for the test while `Shane` moves on (spec: `OPEN.md` §N.170).
- [x] **The audit "deeper, not bigger"** DELIVERED 2026-10-18 (`../sessions/audit-deeper-not-bigger_r1_2026-10-18.md`); its two questions answered by Dann 19:02 and 19:06; rows 113 to 119 enter `QUEUE.md`.
- [x] **Row 114, the sealed set** LANDED 2026-10-18 21:01 (45 pages of the 1967 Mussorgsky collection, Notes scans exported through Preview); truth DRAFTED for all 45 pages by 23:3x (page 2 by the desk, corrected five times by Dann; 44 by two Opus helpers with the truth kit, `../sessions/truthkit-row114_2026-10-18/`); proof sheets in `~/Downloads/_colleague-pages/truth/`, `INDEX-f1.md` and `INDEX-f2.md`. Dann's look: page 2 done; 44 pages owed, at his pace.
- [x] **The Guide paragraph on Poem and Lyrics** RATIFIED 2026-10-18 23:00 and 23:02 (`../sessions/draft-guide-two-witnesses_r2_2026-10-18.md`); enters with rows 109 and 110.
- [x] **Row 119's three questions** RATIFIED 2026-10-18 23:09.

## Week of Monday 2026-10-19 to Sunday 2026-10-25

**Mac**
- [ ] **Corrections slices 5, 6, 7** (`../sessions/plan-corrections-build_r1_2026-10-08.md`): the rail and the fixed panel; the mark, the line, and the review; removal over a reach and "Through the bar". Each walked before the next starts.
- [x] **Rows 47 and 48** SHIPPED `263aa48a` 2026-10-15 (`report-code-row47_r1_2026-10-15.md`, `report-code-row48_r1_2026-10-15.md`); DONE is Dann's look. Was: the octave line for the singer's range, and the tempo estimate. Strings ratified 2026-10-08 and 2026-10-15.

**Cloud**
- [x] **Rows 109 and 110** SHIPPED `4f3bb38d` 2026-10-19 11:2x with rows 104 and 106 (`report-code-rows109-110_r1_2026-10-18.md`, `report-code-rows109-110-followup_r1_2026-10-18.md`, `report-code-row106_r1_2026-10-19.md`); row 108 and the hyphen Guide line SHIPPED `e58fdabc` 15:24 (`report-code-row108_r1_2026-10-19.md`). Was: (running since 2026-10-18 18:50 on `cloud-lane-11`): read the report, measure the merged gates, move the ship script's baselines, then fetch, merge, ship; the Guide paragraph r2 goes in with them.
- [~] **Rows 115 and 116 MEASURED 2026-10-19** (`report-desk-rows115-116_r1_2026-10-19.md`); row 117 open (Mac). **Rows 115, 116, 117**: the per-syllable loss ledger and per-source spread, two-reader agreement, and the preprocessing measure on B01 to B10 (the audit's measures before row 105 widens); each measure only.
- [ ] **Row 113**: the HEIF decoder.
- [ ] **Corrections slice 9**: "Same in m. 22", the comparator (pure part).
- [ ] **Row 71**: N.182, how Ilya suggests a key. HELD by Dann 2026-10-11 23:00; the desk checks it against the ruled voice-family table before asking to release it.

**Desk and Dann**
- [~] **Row 114's proofing: 15 pages proofed 2026-10-19** (printed 2, 3, 7, 8, 9, 10, 12 to 15, 17 to 21; notes in `~/Downloads/_colleague-pages/truth/<stem>.md`); kit r2 and a markings pass (`truthkit-row114_r2_2026-10-19/`); 12 pages owe a look at their markings only. **Row 114's proofing**: Dann looks at the 44 remaining proof sheets at his pace, one page at a sitting, and names the bars that differ; the desk folds each correction into the draft and rebuilds. Then the reader is measured on the set, on the singer's path (Ilya in Chrome on the alias), per source class with its low end.
- [ ] **N.84, the Guide**: rewritten for the interface as it is, English and French, with new screenshots; carries the fry essay (N.174). Four English drafts exist (2026-10-01). Starts once Corrections slice 6 is walked, because the Guide describes the review. Its size is NOT ESTABLISHED.
- [ ] **N.170 steps 1 and 2**: freeze a review build and draft the packet for outside readers. Dann ruled 2026-09-24 21:03 to wait *"until Ilya has really taken shape"*; the desk puts the question to him once Corrections slice 6 is walked (row 93's fix, `6c69161`, was ratified by Dann 2026-10-14 02:56).
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
- **Row 13** SHIPPED `263aa48a` (measure only, `report-code-row13_r1_2026-10-15.md`): a scan dropped now does not read again on its first reopen; the second question is read at the next close.
- **N.115**, moving a bar between systems by hand, and the lone last bar: set aside by Dann 2026-10-12 21:10 until a user reports it.
- **The Corrections redesign runs beside the reader work, not after it** (Dann 2026-10-12 21:50: *"We will handle the Corrections redesign in parallel with the OCR/OMR improvements."*).

## Done since r1, for the record

The weeks of 2026-09-17 to 2026-10-12 are closed in `SCHEDULE-archive.md`. Since the r1 checks of 2026-10-11: `b80b543`, `fd1c86a`, `72b564f` shipped; set 4 measured at 97.5 (97.8 with the 10 UNSURE set aside, QUEUE row 86; the figure 97.9 here has no source in the working files, desk check 2026-10-14); rows 79 and 85 walked by Dann 2026-10-12; N.168's first-slice French found already ratified (2026-09-30) and ticked; N.86's dead code built (row 84).

---

## LATER, for the record

Everything else in the sort. Nothing there is lost; it is the first list after
the release.

- **Reading a phone photo of a score** (curved or tilted page) and **a HEIC decoder.** Deferred to after the release by Dann 2026-09-24 19:43; evidence `../sessions/memo-code-phone-photo_r1_2026-09-24.md`. Added 2026-09-30.
