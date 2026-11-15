# SCHEDULE archive: the r1 schedule of 2026-09-16, verbatim

Moved here 2026-10-12 about 22:05 by the desk (Opus) when Dann asked for a schedule that is not stale (21:52). A record, never authority.

---

# SCHEDULE: the road to the release, Friday 2026-10-30

**Asked for by Dann 2026-09-16:** *"consider all of the work needed for the
release and devise a schedule beginning tomorrow that will guide our work."*
Written by the desk the same night, from the sort
(`../sessions/sort-release_r1_2026-09-16.md`) and the estimate
(`../sessions/estimate-release_r1_2026-09-16.md`, DESK INFERENCE).

**AMENDED BY DANN 2026-09-26 00:21. The date is a target, not a wall.** His words: *"That date is artificial, and was invented in response to my complaints that the app development was feleinbg endless." (verbatim)* And: *"I have recommitted to ensuring that the actual release contains my best draft, so if I can avoid shipping errors I will."* So the architecture audit (begun 2026-09-26) may run before the release, and "the date stands" in the next paragraph no longer outranks shipping stable code.

**How to use it.** Work the current week top to bottom. Tick a line when it is
**walked**, not when it is written. **Maintained at every close:** tick what
closed, and move anything unfinished to the next week with its date. If a week
runs over, the buffer in week 5 absorbs it; if the buffer is gone, the lowest
line in the week moves to LATER, and the date stands.

**Rules in force:** the freeze rule (`OWED.md` §RULINGS DANN OWES): a new
finding joins only if Ilya would otherwise tell a singer something false or
lose a singer's work. [CHECKED 2026-10-11 19:40 against git log: **The 2026-10-09 checkpoint was dropped on 2026-10-09 01:10; nothing moves to LATER.**] **Checkpoint Friday 2026-10-09:** a design row not yet
in Code moves to LATER.

[CHECKED 2026-10-11 19:40 against git log: **The gate is met: N.154 (`8127e01`), N.130 (`2f955e6`) and N.131 (`1987157`) are closed; N.84 is started with four English drafts.**] **ONE HARD DEPENDENCY, ruled 2026-09-19: N.84, the Guide, cannot start until
N.154 and the French are done and walked.** It is the only line in this file
that blocks another, and it is in the header so a week-6 reader does not meet it
for the first time on the day.

**Pace assumed:** about four heavy evenings a week (`git log`, week to
2026-09-16). Dann's days are his; the weeks are a guide, not a timetable.

---

## Week 1. Thursday 2026-09-17 to Sunday 2026-09-20. Clear the decks, find the surprises

- [x] **N.146**, poem or score detected. **CLOSED 2026-09-17: walk 5 passed in Incognito (`OPEN.md`, N.146 findings, 9).** Read Code's memo, move gates, ship, walk: a score PDF, a score photo, a text PDF, a poem photo, and a page with the poem above the music. **2026-09-17:** shipped `fe4d2c7` and `6e98057`; all walked except walk 5 (poem photo), which awaits step 2c (`STATE.md`).
- [x] **N.147, the loupe tap. CLOSED 2026-09-17**: the syllables moved into the loupe, a note tap only selects, shipped `55c04d9` and walked. Two more ships followed the same night: the semitone cells and the fill tag's word (`0eb0a95`), and the pitch grid of six (`b03e918`).
- [x] **N.92's caret reach. SHIPPED**, over six commits 2026-09-17 to 2026-09-18, and
  **N.153 then made it usable on a phone** (caret-to-caret separation 1.13-7.89 px to
  44.00-44.16 px, closed on scope 2026-09-21). **Ticked 2026-09-21 in the bookkeeping
  audit; the box had stood unchecked while the work was done.** Its remainder is N.162.
- [x] **N.142 step 2. CLOSED 2026-09-24: counted zero from the 2026-09-21 export, so nothing to build** (`../sessions/memo-code-afternoon-findings_r1_2026-09-24.md`). The desk counts, through Chrome on the branch alias, placements in Dann's library that sit on a tie's continuation. Build only if the count is not zero.
- [x] **The nine CHECK rows. CLOSED 2026-09-24**, all but UNSETTLED-8's override badge, which no page carries to test (`../sessions/memo-sonnet-check-rows_r1_2026-09-24.md`; `STATE.md`). The desk looks at each (a Sonnet agent for the code reads). Each closes or becomes IN work in week 2.
- [x] **UNSETTLED-6, the per-format walk. CLOSED ON SCOPE 2026-09-24, recorded here only 2026-09-30 20:25 after Dann had to rediscover it.** The phone photo WAS walked: `../sessions/memo-code-phone-photo_r1_2026-09-24.md` (a JPEG phone photo of a score is refused by the reader and misrouted to OCR; a raw HEIC is refused by desktop Chromium; a decoder costs `heic2any` 1,351,840 bytes or `libheif-js` 1,513,632 bytes). **Ruled by Dann 2026-09-24 19:43** (`../sessions/brief-code-photo-messages_r1_2026-09-24.md`): honest messages now; curved-photo reading and a HEIC decoder after the release. The messages shipped (`upload.err.pictureUnclear`, `upload.err.imageHeic`, `i18n.ts:961-962`, per `../sessions/audit-briefs-B_r1_2026-09-30.md` row 7). The two deferred builds are in LATER. Original line follows. SIX OF SEVEN PASS 2026-09-24 (`.musx`, MusicXML, `.mxl`, `.mscz`, `.mnx` after `d1cc2d3`, PDF); **only a phone photo of a score remains.** Dann drops one file of each kind Ilya accepts: MusicXML, `.mxl`, `.musx`, `.mnx`, `.mscz`, PDF, photo. **Samples found by the desk 2026-09-17:** MusicXML `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`; `.mxl` `tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/score.mxl`; `.musx` `~/Downloads/Mussorgsky - Sunless 04 - Be bored.musx`; `.mnx` `~/Downloads/Sharp Excerpt.fin27.mnx` (the only one); `.mscz` `~/Downloads/Schubert_Gretchen_am_Spinnrade_D118_OpenScore.mscz`; PDF and pictures from the N.146 walk (`STATE.md`, findings). **Still missing: a real phone photo of a score.** The sniff accepts HEIC (`format-detection.ts:117`); which of the 234 phone photos in `~/Downloads` show a score is NOT ESTABLISHED.
- [x] **[AUDIT 2026-09-30 22:40: DONE: N.123 part 1 and N.94 parts 1 and 2 designed, built and walked (week 3 and 4 rows)]** **Start the two design rows.** With Dann's say-so: design for **N.123** (where the tessituragram and its bands sit, given Insights page one is fixed at one page) and for **N.94** (the transposition control in the Score Markup band, between Corrections and Voice). A Sonnet agent looks for N.123's two missing sources (the centre-of-gravity formula; Titze, Švec, and Popolo 2003).

**WEEK 1 CLOSED 2026-09-20, 12:30. N.148, N.149 AND N.150 ARE ALL CLOSED**, over five
ships: `6ca97db`, `be792b6`, `38dac87`, `dc45966`, `c582892`. **The floor is
`c582892`.** The loupe now has two modes, the carets belong to Corrections alone, and
Corrections has left the drawer, whose band is Voice. **Week 2 opens on N.129, the
ruler**, per `SEQUENCE.md` dependency 1.

**AMENDED 2026-09-20, 11:30. N.149 AND N.148 ARE CLOSED**, shipped `6ca97db` and
walked by Dann on desk-driven screenshots. **N.150 is orphaned and open.** The floor
moves to `6ca97db`. One finding deferred by him, unnumbered: the duration row wraps.

**CLOSE OF WEEK 1, 2026-09-20.** N.153 stage 1 shipped and walked (`0028266`). **The
week's real outcome was not a build: Dann ruled the loupe's two modes and the design for
them was recovered** (`OPEN.md` §N.149's design exists and is chosen). **N.149 and N.153
together are now THE ONE THING**, at his direction: *"start work on the two modes in a
fresh thread."* Everything spacing-related from the 2026-09-19 walk folds into them
rather than being built separately; his own reading is that the separate notes are
*"obviated by our new understanding of the carets/spacing conflation."*

**Carried into week 2 unchanged:** N.142 step 2 (now turning on the m. 31 and mm. 40-41
tie-or-melisma reading), the nine CHECK rows, UNSETTLED-6's per-format walk, and the two
design rows.

## Week 2. Monday 2026-09-21 to Sunday 2026-09-27. The ruler and the toggles

- [x] **N.129**, the underlay ruler and no dropped hyphens. **CLOSED 2026-09-20, ahead of the week**, in two ships, both walked: `e75d6f3` (the underlay draws in Source Serif 4, the face its widths were measured from) and `7bd3d04` (hyphens are never omitted, and a word-internal gap reserves `HYPHEN_GAP_PX`). Walked on screen and in print (*"it looks fabulous"*). **The recorded "about 5%" error was wrong and is corrected to 12.2%.**
- [x] **N.136 with N.119**: every notation toggle acts at once on Transcription and Markup,
  and no toggle does nothing. **CLOSED 2026-09-21 as N.159**, shipped `1d18514` and walked by
  Dann on his own library in his Chrome. **N.136 and N.158 closed with it.** Measured on his
  library: Reconstitution 16 notes, Open syllables 24, and the seat instrument reads 67 drawn
  live, 29 kept as stored, of 96. **Paint on a phone is still NOT MEASURED.** Designed and
  measured 2026-09-21
  (`OPEN.md` §N.159, plan in `../sessions/memo-n160b-the-approach_r1_2026-09-21.md`). It
  displaces nothing, because it was already this line. **Walked on Dann's phone**, which is
  the one measurement nobody has taken.
- [x] **N.160 steps 2 and 3. CLOSED 2026-09-21**, shipped `2fb7516` and `46ac52f`, both
  walked. The dry run read Dann's library seat by seat; the heal wrote 14 of 96 and left the
  5 it could not resolve exactly as they were.
- [x] **N.161 and N.161b. CLOSED 2026-09-21**, shipped `44c5830` and `9782d8e`, both walked in
  a real browser with controls. A read-only Sonnet sweep found a fourth call site the desk and
  Code had both missed. Account in `../sessions/LOG.md` block 29.
- [ ] ~~**N.141, last step**: the squircle across a tie.~~ **MOVED TO WEEK 3 on 2026-09-21,
  DESK DEFAULT**, to make room for N.161.
- [x] **N.132**: the ratified names and the tab padding. **CLOSED 2026-09-21**, shipped
  `5f7be82` and walked by Dann in both languages on the alias. **It was moved to week 3
  twice and then done on week 2's first night anyway**, pulled forward because it gates
  N.130 and N.131. **It carried two N.154 rows with it:** `upload.banner.reader` shipped
  the same night as `8bd1aff`, and `a11y.paper` went to N.131 on Dann's ruling. **The
  « PARTITION » receipt collision was found and fixed in the same session.**
> **THIS ROW WAS A DUPLICATE AND IS STRUCK 2026-09-21.** The `[x]` row above records the
> same two steps closed, shipped `2fb7516` and `46ac52f`, both walked. The original text
> is kept below the strike because it carries the planning numbers.
>
> ~~**N.160 steps 2 and 3**: the dry run on Dann's library, then the stored text plus the
  one-time repair, which unfreezes his 25 notes and stops any note freezing again. **These
  spend the week-5 buffer.** Numbered and specified 2026-09-21 (`OPEN.md` §N.160).~~ **He
  exports a binder backup before step 2.**
- [ ] [CHECKED 2026-10-11 19:40 against git log: **Closed 2026-09-24; the findings shipped as `d1cc2d3` and `190cc74`.**] **Fixes from week 1**: whatever the format walk and the CHECK rows turned up.

- [x] **N.153, ALL FIVE STAGES. CLOSED ON SCOPE 2026-09-21**, shipped `9b05ddd` carrying
  Code's `15b7d1a`. **It was never scheduled into a week**, so it displaced nothing that was
  named; it spent week 2's first evening, which was already clear. Stage 4 retired nothing and
  closed as "knowingly keep"; stage 5's scan reaches the 44 px tap floor on all 17 measures
  that carry notes, against 1.13 to 7.89 px on 2026-09-18. **Stage 5 changes nothing a singer
  sees**, so there is no walk for it. Account in `../sessions/LOG.md` block 30.
- [ ] **N.162**, the remainder of N.153: a caret and a note compete for the same thumb.
  Numbered 2026-09-21, unscheduled, spec not written.
- [ ] [CHECKED 2026-10-11 19:40 against git log: **Both shipped: `757f002` and `07f535a`, in QUEUE row 8; Dann's walk of them is not recorded.**] **Two parts of the 2026-09-20 loupe spacing ruling are NOT BUILT** and are now
  `OPEN.md` §THE CARET clause 16: the meter run-in at 1 sp in the loupe, and the tie taper
  into the run-on. Unscheduled.

- [ ] **N.168, the Insights intake. NOT IN THIS SCHEDULE WHEN IT WAS WRITTEN; added by the desk 2026-09-24.** Numbered by Dann 2026-09-23 17:29 (*"ASAP"*), it took all of 2026-09-23. Steps 1 to 3 done; step 4 well advanced (about 690 fact rows); step 5 begun (11 composed connections); step 6 (vetting) began with P1. No connection is built into the app yet. **DESK INFERENCE, not a measurement:** building, testing, and translating the connections is several weeks at 2026-09-23's pace, so it cannot all land before 2026-10-30 without displacing something. Where it sits against the other weeks is Dann's to rule. **2026-09-29: the pedagogy book harvest is done (nine sources, `_synthesis/harvest-*_r1_2026-09-29.md`); next is Fable's distillation (`../sessions/brief-fable-n168-distillation_r1_2026-09-29.md`).**

## Week 3. Monday 2026-09-28 to Sunday 2026-10-04. Insights and the design rows

- [x] **[AUDIT 2026-09-30 22:40: DONE: catalogue memos `../sessions/memo-audit-code-catalogue-*`; rulings and briefs audits 2026-09-30; LOG 7591]** **The tree audit. STARTED 2026-09-24 21:25 on Dann's instruction ("the audit now, please"); the desk had placed it after the Sunday reset, which he overruled.** Asked for by Dann 2026-09-24 21:11: catalogue what the code really contains, tie each module to an open item, and propose a new number for any chunk the plan does not describe. Two Sonnet agents: one catalogues the code (223 source files, about 91,000 lines, counted 2026-09-24), one checks every ruled string against the tree. **Placed by the desk, DESK DEFAULT.**
- [x] **N.171** (CLOSED by Dann 2026-09-28 19:46; shipped `6ede257`), switch on the `#` repair (numbered by Dann 2026-09-24 21:40). Code builds from `../sessions/brief-code-n171-hash-fold_r1_2026-09-24.md`; Dann walks a Sunless song with a `#`. **Placed by the desk, DESK DEFAULT.**
- [x] **N.169** (CLOSED by Dann 2026-09-28 16:09; shipped `8127e01`), the note-by-note table against Appendix B (one evening). The desk builds it from `tools/n168-frequency-run/out/notes-mitton.csv` and a screenshot of Dann's Voice band; Dann rules the vowels. **Placed 2026-09-24, DESK DEFAULT.**
- [x] **[AUDIT 2026-09-30 22:40: SUPERSEDED: comments now built problems-first under N.173; Dann accepted three (LOG 7580)]** **N.168, P1a**: Fable redrafts the English from `p1a-counts.csv`, the desk checks every claim against its extraction row, Dann vets one draft. **Placed 2026-09-24, DESK DEFAULT.**

- [x] **N.127 increment 2. Built `0ccda31`/`ccb790c`, WALKED by Dann in both languages 2026-09-24.**: the compass stave, the piece's range against the singer's.
- [x] **N.123, part 1. WALKED by Dann in both languages 2026-09-24**; its findings shipped `5e22d03` and `d1cc2d3`, walked.: the tessituragram with the passaggio zone shaded.
- [x] **N.94, part 1** (walked by Dann 22:15, "I love it"; shipped `de31e22` 2026-09-28): the control appears, and the score draws in the chosen key.
- [x] **N.130 and N.131. DONE 2026-09-24, ahead of the week:** Insights' French walked and every ruling seated (`2f955e6`); the audit's ten N.131 rows ruled and seated (`1987157`); both walked by the desk on Dann's library.: the desk drafts Insights' French; Dann rules it in one sitting; one build carries it with N.131's 21 ratified rows.
- [~] [CHECKED 2026-10-11 19:40 against git log: **Rows 27, 29 and 30 shipped `0976735` and were walked by Dann 2026-10-05; later ships `bbe524b`, `c785b7f`, `5c0f557`.**] **The scan reader (N.178 widened; THE ONE THING since 2026-10-01 15:11; `../sessions/plan-scan-reader_r4_2026-10-01.md`).** Not on this schedule when it was written. Staves SHIPPED `a7fd740` 2026-10-02 (`../sessions/report-code-staves-traced-and-straightened_r1_2026-10-01.md`); bars SHIPPED `004ffe4` (`../sessions/report-code-bars-by-the-system_r1_2026-10-02.md`); heads SHIPPED in two steps, `952ff7f` (row 20, `../sessions/report-code-one-head-to-a-stem_r1_2026-10-02.md`) and `887931f` (row 21, `../sessions/report-code-a-note-is-known-by-its-company_r1_2026-10-02.md`): 173 of 174 heads, 98 of 99 bars. **Plan r4 phase 0, the foundations, started 2026-10-02 on Dann's order:** the test set ruled (eight songs), truth from his Finale files (`../sessions/memo-desk-truth-from-finale_r1_2026-10-02.md`), the baseline with Code (`QUEUE.md` row 22), the outside-engine yardstick in the cloud. `QUEUE.md` rows 18 to 22. Not walked by Dann. **The cloud lane, 2026-10-02:** `QUEUE.md` rows 7, 8c, 10, 14, 15, and 16 SHIPPED `622f35f` (`../sessions/report-code-cloud-lane_r1_2026-10-02.md`), walked by the desk (`../sessions/walk-desk-622f35f_r1_2026-10-02.md`). **Ticked at the close of 2026-10-02 16:05:** the baseline and the scan scorer SHIPPED `389d4db` (`QUEUE.md` row 22, `../sessions/report-code-the-baseline-on-eight-songs_r1_2026-10-02.md`); lengths read from shape SHIPPED `29a0a10` (row 23, `../sessions/report-code-length-is-read-from-shape_r1_2026-10-02.md`): of 100 printed notes right in pitch and length, 41.0 to 73.0 on the five build songs and 23.5 and 32.0 on the two test-only songs, against a bar of 95; the yardstick measured (`../sessions/memo-desk-yardstick-homr-on-seven-songs_r1_2026-10-02.md`, and the cloud lane's `report-code-the-yardstick_r1_2026-10-02.md`): homr 66.2 to 97.4; the Tchaikovsky truth with pitch and length (`../sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.md`); Gould's numbers measured on the pages (`../sessions/draft-gould-expectations-for-the-scan-reader_r1_2026-10-02.md`). **Next: `QUEUE.md` row 24, the trial of the direction in `OPEN.md`, "N.178 AND THE SCAN READER", item 19.** **Dann, 2026-10-02 09:00, a remark and not a ruling:** he doubts a release before January 2027. The dates on this page are unchanged until he rules. **2026-10-04 and the night of 2026-10-05, the appraisal thread:** Dann ruled that homr makes the first reading and Ilya's own reader checks it (`OPEN.md`, "N.178 AND THE SCAN READER", item 22). The thread's memos and reports, all in `../sessions/`: `memo-desk-july-and-october-on-homr_r1_2026-10-04.md`, `memo-sonnet-working-music-readers_r1_2026-10-04.md`, `memo-sonnet-omr-research-since-2012_r1_2026-10-04.md`, `memo-sonnet-old-russian-print-and-existing-encodings_r1_2026-10-04.md`, `memo-opus-homr-code-against-ilyas-reader_r1_2026-10-04.md`, `memo-sonnet-russian-word-frequency-resources_r1_2026-10-04.md`, `memo-sonnet-misses-by-cause-and-ceilings_r1_2026-10-04.md`, `memo-sonnet-homr-in-a-browser_r1_2026-10-04.md`, `report-opus-homr-reader-into-ilya_r1_2026-10-04.md` (`QUEUE.md` row 27: in the tree, not shipped), and `report-opus-bring-the-port-up-to-homr-main_r1_2026-10-05.md` (`QUEUE.md` row 28: not in Ilya). Next: `STATE.md`, the close of 2026-10-05.
  - **2026-10-05, the second thread.** The newer build (model `465`) is wired in and guarded: WRITTEN, in Dann's tree, uncommitted (`QUEUE.md` rows 29 and 30; `../sessions/report-opus-wire-the-newer-homr-build-into-ilya_r1_2026-10-05.md`, `../sessions/report-sonnet-the-fast-path-only-where-it-works_r1_2026-10-05.md`). The checks were measured (row 31; `../sessions/report-opus-the-checks-measured_r1_2026-10-05.md`). The trial at reading the sign beside the note did not pass (row 33; `../sessions/report-opus-the-sign-beside-the-note-a-trial_r1_2026-10-05.md`). **Dann geared the project down at 06:48 and is weighing whether to go on. Nothing on this schedule moves until he says so** (`STATE.md`, the close of 2026-10-05, 14:50).
  - **2026-10-05 15:00 to 2026-10-06 23:30, the Opus thread.** Shipped `0976735`, `bbe524b`, `c785b7f`, and the day-4 fixes (ship started 23:20). 16 songs at 95.1 in the cloud (`../sessions/report-day-4_r1_2026-10-06.md`); no held-out song remains; next, an unseen IMSLP set (`STATE.md`, the close of 2026-10-06). Reports of the thread: `report-code-webgpu-against-wasm-on-the-imac_r1_2026-10-05.md`, `report-code-restore-reads-with-homr_r1_2026-10-05.md`, `report-code-step2-on-the-alias_r1_2026-10-06.md`, `report-code-baseline-on-the-singers-path_r1_2026-10-05.md`, `report-code-test-only-songs_r1_2026-10-06.md`, `report-code-sunless3-diagnosis_r1_2026-10-06.md`, `report-night-1` to `-3_r1_2026-10-06.md`, `report-day-4_r1_2026-10-06.md`.

## Week 4. Monday 2026-10-05 to Sunday 2026-10-11. Finish the design rows

- [x] **[WALKED by Dann 2026-10-09 13:10, `OPEN.md` ("Walked by Dann 2026-10-09 13:10"); checked by the desk 2026-10-11 19:20.] [AUDIT 2026-09-30 22:40: SHIPPED `de802cd` with the N.168 first slice, NOT WALKED (LOG 7763)]** **N.172**, the experience stage in the intake, **built with the N.168 slice so it has something to act on.** Placed by the desk, DESK DEFAULT.
- [x] **The comment templates. BUILT AND SHIPPED; this line stood unticked until 2026-10-09 00:02, when Dann asked the desk to verify after it had told him they were "not started".** Read in the tree by the desk: `apps/web/src/lib/insights/comment-text.ts:1-27` (the grammar of r7: a frame, a consequence, suggestions, a count; English ratified by Dann 2026-09-28 23:37, built 2026-09-30; one register written, "working"), `comments.ts`, `comment-sources.ts`, `comments.test.ts`; 42 `comment.*` entries in English and French (`apps/web/src/lib/i18n.ts:1742-1799`); printed by Insights (`apps/web/src/lib/insights/InsightsPane.svelte:54-55`, `:787-788`); commits `6d87638`, `477ba5b`, `14e4cb5`, `019bc7f`. Not established by the desk: whether Dann has walked them on the alias (the record's last word, `OWED.md` of 2026-10-02, says the first slice was not walked). The original line: **2026-09-25: how a comment speaks is ruled** (`PRODUCT.md`, the sections of 2026-09-25); the templates are next, then Dann's vetting, then this slice.
- [x] **[WALKED by Dann 2026-10-09 13:10, `OPEN.md` ("Walked by Dann 2026-10-09 13:10"); checked by the desk 2026-10-11 19:20.] [AUDIT 2026-09-30 22:40: SHIPPED `de802cd` 2026-09-25, NOT WALKED (LOG 7763)]** **N.168, first slice in Code before the checkpoint**: the vetted passaggio and turning connections only. The dynamics connections wait on the engine and go to LATER. **Placed 2026-09-24, DESK DEFAULT; its size is NOT ESTABLISHED.** **N.94 stays in this week: Dann ruled 2026-09-24 21:08 that the transposition control does not wait for the release.** If the week runs over, this file's own rule applies.

- [~] **N.123, part 2. SHIPPED `14e4cb5` 2026-10-01 and desk-walked; NOT WALKED BY DANN.** Sources found and design approved 2026-09-30. Was: the half-mass band, and the centre of gravity and cycle dose if their sources were found. A figure without a source is left out, not guessed.
- [x] **N.94, part 2**, and its walk (Dann's look 2026-09-29 00:09, "lovely"; shipped `3ab034b`).
- [x] **N.82** (seated, Dann's look 16:17; shipped `8127e01`): the watch band's sentences move out of code and into both languages; Dann rules the French.
- [~] **2026-10-08, the reader on the singer's path:** rows 49, 53, 54 shipped (`8f59ba6`, `3a93f60`, `6b7c3de`); the first unseen set passes 95 song by song through the drop box (`report-code-eight-unseen-through-the-drop_r1_`, `report-code-song-d-lengths_r1_`, `report-code-the-printed-three_r1_2026-10-08.md`); a sealed set of ten with truth drafts is ready for the final test (QUEUE row 55). Corrections redesign: Design round 2 back, ten rulings in `OPEN.md`.
- [~] **2026-10-09, about 00:30: checked in part by the desk, after Dann asked "Are we still behind?" at about 23:55.** Only what was re-read at this close is recorded here. (a) The comment-templates line above was stale and is ticked; every unticked line in this file is a lead, and the tree is opened before one is quoted. [CHECKED 2026-10-11 19:40 against git log: **Row 56 shipped `53035bd`.**] (b) Since the line of 2026-10-08: row 56 (tuplets of any number) is built by Code and neither accepted nor shipped; row 57 (the printed metre) needs its brief revised; the final test (row 55) is not run. (c) The Corrections redesign has ratified wording in both languages, Design's round 3 ruled on, and an eleven-slice plan (`../sessions/plan-corrections-build_r1_2026-10-08.md`); no slice is in Code. [CHECKED 2026-10-11 19:40 against git log: **Rows 9, 13, 34, 47 and 48 remain unbuilt; rows 11, 12, 17, 25, 36 and 50 shipped in `4bc9bcd`.**] (d) Eleven queued rows are not built, by `QUEUE.md` as read at 00:28: 9, 11, 12, 13, 17, 25, 34, 36, 47, 48, 50. [CHECKED 2026-10-11 19:40 against git log: **Week 5 has three ticked lines; weeks 6 and 7 have none.**] (e) Weeks 5 to 7 show no ticked line in this file; the desk did not check them against the tree. **The checkpoint below is today. The design-bound work not yet in Code is the Corrections redesign; whether the checkpoint's rule moves it to LATER is Dann's ruling (the date became a target on 2026-09-26), not asked at this close. No new date is set.**
- [~] **2026-10-09, the close of about 12:10 (Opus desk).** Shipped `53035bd` and `472ed96` (QUEUE rows 56, 51, 58, 59, 60); row 57 parked after rounds 2 and 3; Dann walked rows 14, 10, 7, and 15 (`QUEUE.md`). The final test (row 55) is next. Only what this thread touched is ticked here.
- [~] **2026-10-09, afternoon (Opus desk, closed 2026-10-10).** Row 55 ran (`../sessions/report-code-the-final-test_r1_2026-10-08.md`): 6 of 10 pass, 76.8. [CHECKED 2026-10-11 19:40 against git log: **Row 61 shipped `a7161ce`; M passes under row 74 (`232c5a7`); P is still 77.6.**] Row 61 built, uncommitted (`../sessions/report-code-the-four-below_r1_2026-10-09.md`): K and L fixed, M and P not. Walked by Dann: N.168, N.172, row 59's clef, N.176. Insights review HELD (`OPEN.md`).
- [~] **2026-10-10 23:45 to 2026-10-11 04:40 (Opus desk).** [CHECKED 2026-10-11 19:40 against git log: **Row 57 runs 1-4 are committed (`4bc9bcd`, `4f7421e`); rows 63 to 66 shipped in `4bc9bcd`.**] Row 57: r4 read (`../sessions/report-code-the-metre-seen-and-summed_r3_2026-10-10.md`), r5 run and read (`report-..._r4_2026-10-10.md`), r6 stopped at its estimate (`report-..._r5_2026-10-11.md`), split into four runs. Insights: Design round 2 accepted; French ratified (`french-insights-r2_r1_2026-10-11.md`); vowel memo page-checked; briefs for rows 63 to 66 written.
- [x] **Friday 2026-10-09, the checkpoint. DROPPED by the desk (Opus) 2026-10-09 01:10:** its rule (design-bound work moves to LATER to keep the date) is the date sizing the work, which `CONTRACT.md` posture 6 (Dann, 2026-09-27 20:50) forbids; his amendment of 2026-09-26 made 2026-10-30 a target. Nothing moves to LATER. Earlier: Anything design-bound not yet in Code moves to LATER.

- [~] **2026-10-11 15:03 to 19:05 (Opus desk).** Treble test set drafted (`../sessions/draft-treble-test-set_r1_2026-10-11.md`, `memo-sonnet-treble-repertoire_r1_2026-10-11.md`). "Comfortable working zone" ruled and briefed (QUEUE row 73). [CHECKED 2026-10-11 19:40 against git log: **Row 74 is committed as `232c5a7`; deployment is not established.**] Row 74 built (`report-code-m-and-p-after-the-metre_r1_2026-10-11.md`): M passes. Held-out set 3 made, outside the tree.

- [~] **2026-10-11 19:45 (Opus desk), close.** Final test on held-out set 3 ran (QUEUE row 76, `../sessions/report-code-the-final-test-set3_r1_2026-10-11.md`): 93.8, 6 of 10 pass. Memory audited against `git log` and corrected (`../sessions/audit-memory-vs-git_r1_2026-10-11.md`). Seven briefs Fable-reviewed and sent to the cloud lane.
- [~] **2026-10-11 23:55 (Opus desk), close.** Shipped `b80b543` (row 77, set 3 to 7 of 10) and `fd1c86a` (cloud lane rows 72, 70, 73, 68, 75, 62, 67, 69, 34; row 71 held). Row 80 measured (`../sessions/report-code-the-russian-line-by-its-underlay_r1_2026-10-11.md`). Rows 78a to 78c and 79 written and Fable-reviewed (`../sessions/review-fable-briefs-78-80_r1_2026-10-11.md`), not sent. N.184 numbered. Voice-family draft r2 made by a helper, not yet read by the desk. Next: `STATE.md` handover of 23:55.

## Week 5. Monday 2026-10-12 to Sunday 2026-10-18. Clean house. (Monday is Thanksgiving.)

- [ ] **N.170 steps 1 and 2**: freeze the review build and draft the review packet. **Ruled by Dann 2026-09-24 21:03:** *"I don't want to freeze this stage of the build. If we still have five weeks, I want to wait three more until Ilya has really taken shape."* The desk's proposal of weeks 3 and 4 in `OPEN.md` §N.170 is superseded.
- [x] **N.168**: French for the first slice; Dann rules it. **[CHECKED 2026-10-12 21:50 by the desk against the tree: already RATIFIED and built.** `apps/web/src/lib/i18n.ts:1838-1842` (comments, French ratified 2026-09-30 12:08 and 12:25, `../sessions/french-comments_r1_2026-09-30.md`), `:1866`, `:1879`, `:1891` (ratified 2026-10-09 in both languages), `:1894-1895`; Insights round 2 French ratified 2026-10-11 04:12 and 04:14 (`:1733-1736`). No `comment`, `insights`, or `intake` key holds English in its French except three that are the same in both (`centre`, `Notes`, the pitch key). This line had stood unticked.]
- [ ] [CHECKED 2026-10-11 19:40 against git log: **Two of the listed candidates are removed and `_rhythm_spike/` is kept; `notation-overlay.ts`, `optimalRegion` and the `wall.ts` ruling remain.**] **N.86**: the dead-code audit (a Sonnet agent reads) **Candidates found by the code audit of 2026-09-24**, section 3 of each memo: `../sessions/memo-audit-code-catalogue-a_r1_2026-09-24.md` (the unreachable reconciliation shell, `TextualWitnesses.svelte`; `notation-overlay.ts`) and `-b_` (`renderer-output.ts`, `optimalRegion`, the `_rhythm_spike` folder, the `fit-font-lab` route)., and Dann rules what the Shane switch (`apps/web/src/lib/wall.ts:6-7`) does at release.
- [x] **How the release goes out. CLOSED 2026-09-20, ahead of the week, by a live dry
  run.** `main` is the production branch; a fast-forward from `Shane` and
  `git push origin main` puts it live in about 90 seconds with no manual promote step.
  The ship script cannot do it. Full sequence, the verification that works, and the
  traps are in `ENVIRONMENT.md` §`HOW A RELEASE ACTUALLY GOES OUT`. **The public URL
  is `ilya.dannmitton.com`, not the apex** (§`THE PUBLIC ILYA URL`).
- [x] **N.85** (README, CONTRIBUTING, code of conduct; shipped `8127e01`): README, CONTRIBUTING, code of conduct. The desk drafts; Dann reads every word.
- [x] **Desk housekeeping**: COLOUR-7, INBOX-17, INBOX-31 into `PRODUCT.md`. **PAID 2026-10-12 by the desk (Opus):** COLOUR-7 transcribed as `PRODUCT.md` §"A hue names one idea"; INBOX-17 was already there (§"The squircle", and the radii row of §"The drawer grammar", with its 2026-09-02 fourth radius); INBOX-31 was already there (§"The drawer grammar", the ⓘ on the Russian-o row).
- [x] **N.154** (walked in French 16:03; shipped `8127e01`). ** EVERY USER-FACING STRING SAYS WHAT THE APP NOW IS, both languages.**
  Numbered 2026-09-19, DESK DEFAULT number, on Dann's instruction: *"we need to
  align all of our text with the actual evolved app."* **The seed, found
  2026-09-19:** `tab.fit:109` still reads "Fit", and `calib.welcome.lede:1056`
  and `calib.welcome.fryAnswer:1058` still tell the singer *"Fit will measure
  your voice"* and *"Fit reads its resonances"*, **for a surface that no longer
  exists**; Fit was folded into Voice and Score Markup. Thirty-five keys are also
  named `fit.*`, which is cosmetic and is NOT in this item.
  **IT MEETS THE FREEZE RULE'S EXCEPTION** rather than needing one: a string that
  names a surface the singer cannot find is Ilya telling a singer something false.
  **English first, then French**, because the French cannot be verified against
  English that is itself stale. **Its real size is NOT ESTABLISHED**; the three
  above were found by one grep for a single word.
- [ ] **Buffer. SPENT ON 2026-09-21 by N.160 steps 2 and 3**, a DESK DEFAULT Dann can
  overturn. **Week 1 had already spilled five items into week 2 before this.** This file's
  own rule now governs: once the buffer is gone, the lowest line in a week moves to LATER and
  the date stands.

- [ ] **The Corrections redesign, PLACED by Dann 2026-10-12 21:50:** *"We will handle the Corrections redesign in parallel with the OCR/OMR improvements."* Plan `../sessions/plan-corrections-build_r1_2026-10-08.md` (eleven slices; slice 1 shipped `322015f`). Next: slice 2 (QUEUE row 51, not written). Runs beside the reader rows (89, 93, 82), not after them.

## Week 6. Monday 2026-10-19 to Sunday 2026-10-25. The Guide, once the interface is final

- [ ] [CHECKED 2026-10-11 19:40 against git log: **The gate is met: N.154 (`8127e01`), N.130 (`2f955e6`) and N.131 (`1987157`) are closed; N.84 is started with four English drafts.**] **N.84**: the Guide rewritten for the interface as it now is, in English and French, with new screenshots. Dann reviews the prose. **STARTED 2026-10-01, three weeks early: four English drafts (`STATE.md`).**
  **BLOCKED ON N.154, AND ON A FRENCH VERIFICATION, ruled by Dann 2026-09-19:**
  *"let's make a French verification a prerequisite for that process."* The Guide
  describes the interface, so a Guide written over stale strings documents an app
  that does not exist, in two languages, with screenshots to match. **The gate:
  N.154 closed, N.130 and N.131 closed, and the French walked on screen** before
  a word of the Guide is rewritten.
- [ ] **N.170 steps 3 and 4**: singers watched, and the ADPList session. Steps 5 to 7 fall after 2026-10-30. **Placed 2026-09-24, DESK DEFAULT.**
- [ ] **The format walk again**, and a print walk, to catch what the month broke.

## Week 7. Monday 2026-10-26 to Friday 2026-10-30. Release

- [ ] **N.83**, the walkthrough call: the end-to-end check. Early in the week.
- [ ] **Only what the freeze rule admits** gets fixed.
- [ ] **Thursday 2026-10-29: N.88**, marketing, Dann's own and optional.
- [ ] **Friday 2026-10-30: release.**

---

## LATER, for the record

Everything else in the sort. Nothing there is lost; it is the first list after
the release.

- **Reading a phone photo of a score** (curved or tilted page) and **a HEIC decoder.** Deferred to after the release by Dann 2026-09-24 19:43; evidence `../sessions/memo-code-phone-photo_r1_2026-09-24.md`. Added 2026-09-30.

---

# SCHEDULE r2, archived verbatim 2026-10-20 02:5x when r3 replaced it

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

## SCHEDULE.md r3 (2026-10-20 to 2026-11-14), verbatim, moved here 2026-11-14 21:4x by the desk when r4 replaced it

# SCHEDULE: the checklist to Friday 2026-10-30

r3, written by the desk (Opus) 2026-10-20 about 02:50, at Dann's request of 02:47: *"Can you generate such a list and use it as a running cheklist to keep us oriented? ... Can you heop m,e by devising a sequential checklist grouped by meta tasks?"* (transcribed as written). It replaces r2 of 2026-10-12, which is in `SCHEDULE-archive.md` verbatim. Floor: `4e56cea8`.

**RULED 2026-11-13 00:47 (Dann): THE RELEASE IS FRIDAY 2026-11-20, and N.199 (the Calibrate redesign, QUEUE row 185) is in it.** *"Let's move the release to next Friday. Let's be aggressive in our development and integration of this aspect of the build."* The checklist below is NOT re-planned to that date; the desk owes it.

**RULED 2026-10-27 02:49 (Dann, option 3): the share moves until meta 2 is measured at 9 of 10; 2026-10-30 is no longer the share date and the new date is NOT SET. The paragraph below is history.** **What 2026-10-30 is.** The day Dann shares Ilya with colleagues for testing and feedback, at `ilya.dannmitton.com` (ruled 2026-10-18 18:26 and 2026-10-19 19:59; `OPEN.md` §N.170). Not a release; a release date is NOT SET. The date never sizes the work (`CONTRACT.md` §1 item 7): what does not fit moves, and the move is written in "Changes" below.

**What colleagues are meant to meet: THE TARGET** (`PRODUCT.md`, "The target, in Dann's words", ruled 2026-10-18 18:44): a colleague drops a scan, PDF, or photograph of a Russian song; Ilya gives back the correct Text, Markup with the sung syllables seated in IPA and syllabified modern Cyrillic, reading at least 9 of 10 syllables without anyone typing the poem, and Insights that are reasonable, relevant, and human-sounding.

**How it is kept.** Six meta tasks. Each opens with why it matters and what done means; each item says what it solves and what it opens (the shape the desk chose 2026-10-20 03:0x for Dann's ask of 02:59 that each node carry its need, how it solves a problem, and what it enables). The metas are listed in the order they finish. Metas 2 to 5 run side by side across the lanes (Mac, cloud, desk); meta 6 comes last. An item is ticked when Dann has walked it or the desk has measured it, never when it is written. The desk ticks at every close and whenever a row moves, and logs every addition, deferral, and deletion under "Changes" with its date and who decided. Build order inside a meta is `QUEUE.md`'s and `SEQUENCE.md`'s. Sizes are NOT ESTABLISHED unless an item says otherwise. Placements are DESK DEFAULT unless an item names Dann's ruling.

**The budget (Dann 2026-10-20 02:52: *"we need to think economically. Our Cloud credits are almost depleted and I will not be buying more. Our usage has been aggressive and we need to control it to make it last."*).** His screenshot at 02:52: shared pool 57 percent, Fable 65 percent, both resetting Sunday 2026-10-25 05:00; cloud credit $7 of $250 (after it, cloud sessions draw on the plan's usage, as the usage page states); the page forecasts a run-out tomorrow afternoon, limit not named. DESK DEFAULT 02:5x: this week's remainder is paced to last to Saturday (about 8 points of the shared pool and 7 of Fable a day); Fable for rulings, taste, and one review per batch of briefs; small rows batched into one cloud session; row 105 and stage 2b start after Sunday's reset. Dann's play with Ilya costs no usage.

---

## Meta 1. Land what is in flight

**Why:** work already paid for helps no one until it reaches the alias, and landing it costs little. **Done means:** each row shipped and walked.

- [x] **Row 127, the octave clef.** DONE: shipped `c68f9a0f` (merge `209aaeb1`), closed by Dann's look 2026-10-20 03:11. *Solves:* a low voice reading a treble-printed line an octave down saw the key signature an octave too high and had no choice of bass clef; now notes and key sit where the print has them, and bass is the singer's choice. *Opens:* low voices can use Markup on treble-printed songs; Dann's clef ask of 2026-10-14 closes.
- [x] **Row 128, the tempo chips.** SHIPPED `dbb97773` 2026-10-20 11:56; DONE by Dann's look 2026-10-20 13:33. *Solves:* the notes in the tempo buttons sit too high (Dann's screenshot, 2026-10-19 23:18); they get an even margin, like the other buttons. *Opens:* the tempo control looks finished.
- [x] **Row 129, triplets as the publisher draws them.** DONE for the centring (Dann's look 2026-10-20 15:45); its slur remainder travels with row 145. Brief r2 reviewed (batch A). *Solves:* Ilya adds a bracket the print does not have (song 1, bar 10); the 3 goes over the middle stem's meeting with the beam. *Opens:* Markup looks like the page a colleague compares it to.
- [x] **The uncommitted documents.** DONE: tree clean at every close since 2026-10-29 (read 2026-11-01). Was: *Solves:* records held only on Dann's disk can be lost, and untracked files stop the ship script. *Opens:* every later ship runs clean.

## Meta 2. The words from a scan reach 9 of 10 syllables

**Why:** THE TARGET says a colleague never types the poem. Ilya reads a scan's notes (95.7 on row 114), but its words reached 9 of 10 on 1 song in 16 (QUEUE row 103, 2026-10-15), so today a colleague would type the poem. THE TARGET's largest gap. **Done means:** 9 of 10 syllables on row 114's songs, on the singer's path. Order from `SEQUENCE.md`, section A.

- [x] **Row 117, cleaning the image first** MEASURED 2026-10-27 (`report-desk-row117-image-cleaning_r1_2026-10-27.md`; frame 1,875 to 2,086 of 2,538). (Mac; measure only). *Solves:* photocopies lose words before the reader sees them; this measures whether three clean-ups (thresholding, straightening each row, closing broken strokes) win them back. *Opens:* tells row 105 which training lever matters most.
- [x] **N.135 stage 2a, the pure modules** SHIPPED `48c36afd` 2026-10-27 23:31 (Fable-reviewed as built, step 4 applied; `report-code-n135-stage2a-step{1..4}_r1_2026-10-27.md`). (cloud). *Solves:* even a good reader needs the page cut into lyric rows, words split at their marks, and each syllable seated under its note; these are those parts, built and tested on their own. *Opens:* stage 2b can wire them in.
- [x] **Row 105, the reader's next model** RUN 2026-10-27 on the Mac, r3 did NOT beat r2 (2,029 against 2,086), nothing shipped (`report-code-row105-next-model_r1_2026-10-27.md`). Was: (Mac, after Sunday's reset). *Solves:* the present model fails on photocopies; this trains it on lines degraded like photocopies and phone photographs, with real pre-1918 rows and Ilya's dictionary inside. *Opens:* the reader stage 2b puts in the app.
- [x] **Stage 2b, the reader in the scan path** SHIPPED `f6c8ae43` 2026-10-29 19:16 (r5 steps 0 to 10 on `cloud-lane-21`, merged `fcb2b788`; replay 1,880 / 1,710; browser on the real page 1,914 / 1,737, `report-desk-n135-stage2b-r5-browser_r1_2026-10-29.md`; behind `?words=read`). Was: BUILT on `cloud-lane-19` at `383187a` and MEASURED on the real page 2026-10-28 (`report-desk-n135-stage2b-real-page_r1_2026-10-28.md`): 1,451 seated exact with its block lifted, 401 as built; not shipped; brief r3 after A1 (`STATE.md`, THE PLAN). Was: RUNNING in the cloud on `cloud-lane-19` from 2026-10-27 (brief r2, Fable-reviewed).
- [x] **Row 105 r5** RUN 2026-10-29 on the Mac, three arms, NO GAIN on the 14 unseen songs (r2 1,596; arms 1,568, 1,557, 1,578; `report-code-row105-next-model_r2_2026-10-29.md`); r2 stays the reader.
- [x] **The row fallback (dictionary sewing)** SHIPPED `e5bad5a6` 2026-10-29 20:4x (`brief-n135-row-fallback_r3_2026-10-29.md`, Opus-reviewed; replay 1,939 / 1,750, exactly the prototype; `underlay@3`).
- [ ] **Row 114 measured, first file (songs 1 to 5), 2026-11-02:** 328 of 590 exact on the app's path; 363 with row 176's two rules as scratch (`~/Downloads/_desk-2026-11-02/m0/`). Row 176 SHIPPED `e74ee1b2` 2026-11-02 20:50: **363**, measured on the shipped tree (`../sessions/report-desk-t0-t1-row114_r1_2026-11-02.md`). The reader series T2 to T5 (same day): Dann's slur rule as written 369 (row 177, building in `cloud-lane-30`), letter boxes +2, fallback floor +0. Next: T6, the poem witness (running at the close). **Row 177 SHIPPED `ee3a1d72` 2026-11-03 20:14: 369 of 590** (desk measure on the merge). T6 (perfect-poem ceiling 399 under the ratified rules) led to the poem library: build 1 is QUEUE row 178, running on `cloud-lane-31`. Set 2026-11-03 23:1x from `git log`.
- [ ] **The reader review (QUEUE row 158)**, after Sunday 2026-11-01 04:00 (Dann 2026-10-29 20:50: wait for the reset): measure on the rows Ilya already chooses, on the photocopied songs (desk drift look 2026-10-29: 2,316 of 2,538 printed syllables sit in the row Ilya seats; the loss there is letters). Was, with **row 105 r4**: the reader's letters are most of the gap (`report-desk-n135-token-splitting_r1_2026-10-28.md`). Was: (Mac, after Sunday's reset). *Solves:* a scan's words never reach Markup without typing; this runs the reader inside Ilya behind a switch. *Opens:* the measure below; N.135's two banner strings (French to Dann).
- [ ] **The joining of POEM to LYRICS on a scan (QUEUE row 181)**, designed with Dann 2026-11-04 10:12 to 10:36 (`OPEN.md`, JOINING items 1 to 16). BUILT steps 0 to 8 on `cloud-lane-34` (`05db2dac`), NOT MERGED; row 114 f1 376 of 590 (control 369), word-exact 99 against 121, cause being measured 2026-11-05 (swept 2026-11-05 01:0x; was: brief NOT WRITTEN). *Solves:* the 221 syllables row 114 loses, by taking words from the poem where the scan gives only their places, and looking again at empty bands. *Opens:* the measure on row 114 with the poem library filled (songs 2 to 5 have library poems; song 1 has none).
- [ ] **Measured on row 114's songs.** *Solves:* says plainly whether THE TARGET's words are met. *Opens:* the decision point.
- **Decision point, Monday 2026-10-26 (DESK DEFAULT):** if the measure is below 9 of 10, what colleagues get on the 30th goes to Dann as one question.
- [x] **The text-seating design interview (QUEUE row 150).** DONE: the design is RATIFIED (Dann 2026-10-20 22:43); the briefs for rows 111 and 150 wait on the alignment measure and Sunday's reset. Was: Q1 to Q6 answered 2026-10-20 (Q6, the three tiers, at 21:20). *Solves:* a scan whose words differ from the poem, or a file with no words, has no agreed rule for what Ilya repairs, marks, or leaves alone. *Opens:* the design in `OPEN.md` for Dann to ratify, then a brief for stage 3.

## Meta 3. Text and Markup read true to the print

**Why:** a colleague checks Ilya against the printed page, and every visible difference costs trust. **Done means:** each fix walked on a song that shows it.

- [x] **Row 149, a printed slur seats a melisma.** CLOSED by Dann 2026-10-20 20:50 as behaves-by-design on song 2 (`QUEUE.md` row 149); the rule stays built and unwalked on a song with matching counts. *Solves:* Ilya seats one syllable per note, so one unread melisma sets every later syllable a note late (song 2 from bar 8), and Insights then pairs pitches with the wrong vowels. *Opens:* correct seating on melismatic songs, and Insights' flags on the right vowels.
- [ ] **Song 3's misreads.** *Solves:* the one song below 90 (84.5) has three causes: p. 13 bars 5 and 6 read in an alto clef, p. 15 bar 2's double flat read as a flat, p. 16's voice notes not read (that page unproofed). Each needs a reader fix; no open row holds the double flat yet. *Opens:* song 3 passes, and the fixes reach any song with the same features.
- [ ] **N.192 with N.190.** *Solves:* Markup draws only the first key (`staff-renderer.ts:1680`) and draws accidentals by rule, not as printed; these draw every key change and the print's own accidentals, courtesies included. *Opens:* Corrections changes only what is drawn (N.190's second half).
- [ ] **Rows 124, 131, 122.** (Row 122 SHIPPED in batch D `6bd34b14`, 2026-10-27, not walked; set 2026-11-01 from STATE.md.) *Solves:* three small faults: N.188's leftovers (an accent printed below drawn above, among others; each a look for Dann first); a word's own hyphen, as in «Люблю-ли», drawn like a syllable break; a scan's receipt saying "MusicXML (direct)". *Opens:* nothing waits on them; they clear distractions from the critique.
- [x] **Rows 141 and 142, found in Dann's play.** DONE by Dann's looks 2026-10-20 15:29 and 15:31 (`QUEUE.md`). *Solves:* a run of empty bars splits across two systems and the first half is cut off at the line's end (song 2, bars 23 to 29); the notes take a page of their own when the last page of music has room for them. *Opens:* layouts a colleague can print without wasted or clipped pages.
- [x] **Row 144, the clef choice on the Paper.** DONE by Dann's look 2026-10-20 15:27 (chip and menu); the phone sheet stays a one-line look for another day (his ruling 23:38). *Solves:* the clef can be changed only from the drawer, and only in one case (Dann 03:11); the choice speaks once beside the clef, then lives in the clef (ruled 03:15). *Opens:* any singer compares Markup with the print in the clef they read.
- [x] **Row 143, one footer.** DONE by Dann's look 2026-10-20 15:51 (Text and Markup; Insights, French, and print not looked at). *Solves:* the three documents' footers differ in colour and credit (Dann 03:05); one footer, with LiederNet credited in the Guide (ruled 03:08). *Opens:* a matched set of pages for the packet.
- [ ] **Row 145, slurs with an engraver's shape.** *Solves:* slurs drawn as even arcs rather than tapered, flattened engraved curves, and slurs that run into a stem (song 2, bars 82 and 86; Dann 03:22). *Opens:* Markup's slurs a colleague can set beside the print.
- [ ] **Row 146, an ossia read as following notes.** *Solves:* song 2's bars 99 to 102 hold six beats and draw crossing ties, because the ossia's lower notes were read one after the other (Dann 03:22 and 03:25). *Opens:* any song with an ossia reads and draws as printed.
- [x] CLOSED 2026-11-09 by the desk (ledger r1): closed by Dann's ruling of 2026-11-08 (`OPEN.md` O3524). **Row 147, `ё` always printed.** *Solves:* a source or a typed title without the dieresis would print without it; the rule is Dann's (03:29). *Opens:* every printed word gives a non-Russian singer the vowel it sings.
- [x] **Row 148, the empty circle over a clitic.** DONE by Dann's look 2026-10-20 15:30. *Solves:* Text draws an empty provenance circle over a clitic with no stress data (Dann 03:33). *Opens:* no unexplained mark on the page.
- [x] **Rows 133 and 139.** Row 139 **DONE by Dann's look 2026-10-30 14:26 on the alias, song 1 line 5: «полёт#» turned «ˈlʲod» into «ˈlʲot#»; Dann 14:28 "Yes", 14:29 "I'm so pelased witht hat work". Follow-ups ruled 14:13 to 14:27 (full gap; tidy every typed form to the unit's end on leaving Lyrics) are a new brief, `INBOX.md` 2026-10-30.** Row 133 DONE by Dann's look 2026-10-20 15:41; row 139 SHIPPED in batch C, `7d3ac4c0`, 2026-10-26 20:38, not walked (`QUEUE.md`). *Solves:* "Quarter · Dot" becomes "Dotted quarter", with the rests' French names (ratified 2026-10-19 23:41); a singer can type # where a coach says the voicing stops, and the IPA follows (ruled 2026-10-20 00:01). *Opens:* Text can follow a coach's correction without a new rule in the engine.
- [x] **DONE by Dann's look 2026-10-30 14:07 and 14:18 on the alias, song 1 bar 2 (`234eff3f` and later): the press moved the squircle «Ком» to «ка» and grafted # in the IPA ("Vdery nice!"); Remove break took it out ("Works operfectly"). Follow-ups ruled 14:13 and 14:17 (a full word space before the # on Text, Markup, and the Syllables list) are a new brief, `INBOX.md` 2026-10-30.** **Row 152 (N.194), click any editable element on the Paper and a card offers its edits, starting with the # break.** RUNNING in the cloud from 2026-10-26 22:04 (`cloud-lane-15`, brief r5; `QUEUE.md`). Ruled into the checklist by Dann 2026-10-21 00:57 (*"I want to move row 152 into our release tasks: I want Ilya to featiure this capability. Make it so."*, transcribed as written). *Solves:* a singer or a coach marks a syntactic break while looking at the passage, on Text or on Markup, without digging through controls; the click-to-card model is the Clef selector's (`ClefControls.svelte`). *Opens:* the same click-a-thing, get-its-card pattern for the Paper's other editable elements, each enumerated first. *Needs, in order:* row 139's engine, pipeline, and boundary work (batch C, brief r2); the desk's enumeration of each element's edits for Dann's ruling; a per-song break map after the gloss map's pattern; a brief per surface, Fable-reviewed after Sunday 2026-10-25 05:00. Whether it fits before the 30th is NOT ESTABLISHED; per `CONTRACT.md` §1 item 7 the date does not size the work, and a move off the 30th is written here when it happens.
- [ ] **Rows 135 and 113.** (Row 113 SHIPPED `fb2d2e37`, 2026-10-28, not walked; set 2026-11-01 from STATE.md.) *Solves:* THE TARGET names photographs, and none has been measured; row 113 decodes iPhone photographs (HEIF). *Opens:* a stated figure for photographs, or a named gap for the packet.

## Meta 4. Insights sounds like Dann

**Why:** THE TARGET asks for reasonable, relevant, human-sounding insights, and two colleagues judge them in writing (Dann 2026-10-18 19:06). **Done means:** the colleagues have the questions and an Insights worth reading.

- [ ] **Row 130 and the humanizing pass (N.173).** *Solves:* a repeat is counted ("One further instance, in the score.") instead of explained once and pointed back to by bar; the pass makes the text read like Dann. *Opens:* Insights ready for the colleagues' reading.
- [x] CLOSED 2026-11-09 by the desk (ledger r1): SHIPPED `58679982`. **Row 71, how Ilya suggests a key.** BUILT steps 0 to 4 on `cloud-lane-29` 2026-11-02 (`a5e94cf9` to `930ba192`), never read by a desk, NOT MERGED (swept 2026-11-05 01:0x). *Solves:* the key suggestion, held since 2026-10-11, rebuilt on today's code. *Opens:* key suggestions in Insights, with Dann's French.
- [ ] **Row 119, the questions to two colleagues.** *Solves:* the ratified questions need French once Dann names the colleagues. *Opens:* the colleagues' written judgement of Insights.

## Meta 5. A singer can fix what Ilya misreads

**Why:** no reader is perfect; when Ilya misreads a bar, the singer needs a clear way to fix it. Corrections runs beside the reader work (Dann 2026-10-12 21:50), and slice 6's walk gates the Guide and the share. **Done means:** slice 6 walked by Dann.

- [x] CLOSED 2026-11-09 by the desk (ledger r1): merged on the integration branch `d645d127`. **Slice 3, the answer kept** (cloud). *Solves:* what a singer answers about a bar (confirmed as printed, changed, or put away) is not kept with the song. *Opens:* slice 6.
- [ ] **Slice 5, the rail and the fixed panel** (Mac). *Solves:* the correction panel becomes six stations with a fixed footer, on phone and desk. *Opens:* slice 6.
- [ ] CLOSED 2026-11-09 by the desk (ledger r1): no longer gates the Guide or the share; it waits until after the share (Dann 20:40, `OPEN.md` O3555 to O3556). **Slice 6, the mark, the line, and the review** (Mac). *Solves:* the singer is not shown which bars to check; this marks them, offers fixes, and reviews the result. *Opens:* the Guide rewrite and the share.

## Meta 6. Ready for colleagues

**Why:** critique helps only when colleagues meet a stable, explained Ilya and know what to look at. **Done means:** colleagues invited on Friday 2026-10-30.

- [ ] **The review packet's questions**, drafted and approved 2026-10-30 (`../sessions/draft-review-packet-questions_r1_2026-10-30.md`); tune against Dann's published writing, then French.
- [ ] **N.84, the Guide and Learn, EN and FR.** *Solves:* the Guide describes an older interface. *Opens:* colleagues learn Ilya without Dann beside them.
- [x] **DONE by Dann's look 2026-10-30 14:35 on the alias, Chrome print preview of Text, song 1: the glosses, logo bracket, and rules print sage on a white sheet ("Beautiful. The green is apparent. :)"); shipped `cdae3be4` in batch D `6bd34b14`. Safari NOT ESTABLISHED.** **Row 134, printed colours.** *Solves:* printed pages lose the colour that tells Text, Markup, and Insights apart (Dann 2026-09-24 15:35). *Opens:* the packet's printed pages.
- [x] **MEASURED by the desk 2026-10-30 14:3x on the alias in headless Chromium (cloud workspace): online visit, then offline (control: a network fetch failed), reload: the app drew and a poem typed offline transcribed («сердце» to «ˈsʲɛrts ɨ»); shipped `c13cc3fb` in batch D. Accepted on the desk's measure, DESK DEFAULT; Dann's own offline look optional.** **N.195, the dictionary starts with no connection.** Ruled in by Dann 2026-10-21 21:20 (QUEUE row 153; brief r1 written, not Fable-reviewed). *Solves:* the loader fetches a manifest before it reads the stored dictionary, so a colleague opening Ilya with no connection after one online visit gets no dictionary (read, not run). *Opens:* Ilya works on a train or a plane, as the app is meant to.
- [x] **MEASURED by the desk 2026-10-30 13:58 (curl on the alias): X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy, and the report-only CSP all live as `vercel.json` sets them; shipped `0202fd63` in batch D. Accepted on the measure, DESK DEFAULT.** **N.196, security headers.** Ruled in by Dann 2026-10-22 22:08 (QUEUE row 154; brief r1 written, not Fable-reviewed). *Solves:* the site tells the browser nothing about content sniffing, framing, referrers, or device features (read, not run); colleagues are about to open it. *Opens:* an enforcing policy later. DESK DEFAULT placement: before the share.
- [x] **SHIPPED `6f740dbf` 2026-11-01 (swept 2026-11-05 01:0x).** **Row 165, the colour story** (ratified 2026-10-30 16:22; brief r1 with a census and a guard). *Solves:* coloured text that fails contrast, a dusty palette, umber, Guide's fatigue, faint turning noteheads. *Opens:* the share with Ilya's finished look.
- [x] **Row 164, the Loupe's lavender header** SHIPPED `3a52f05e` 2026-11-02 00:39 (`report-code-row164-step0` to `step4_r1`) (ratified 2026-10-30 14:40; after the share's blockers, DESK DEFAULT).
- [x] **SHIPPED `dcb36850` 2026-11-01; step 1 not DONE until seen on a Vercel build (swept 2026-11-05 01:0x).** **Row 163, the first open after a deploy, the # drawn apart and tidied, Input's sage pill, the French footer.** Brief r1 2026-10-30, Fable review after Sunday 04:00. *Solves:* a returning colleague's blank page, and the # rulings of Dann's walk 2026-10-30. *Opens:* the share without a blank first impression.
- [ ] **N.197, nothing loaded from outside services.** Ruled in 22:08 (QUEUE row 155; NOT WRITTEN, waits on Dann's answer about `?reader=ilya`). *Solves:* every visitor's browser contacts Google for fonts, and Ilya's own reader loads Pyodide from jsDelivr. *Opens:* a policy with no outside origins. DESK DEFAULT placement: after the share, because fonts move layout and print.
- [ ] **The format walk, a print walk, and N.83.** *Solves:* catches what the month's changes broke in every format and on paper; N.83 takes one song end to end, the only honest whole-path check. *Opens:* the frozen build.
- [ ] **Dann plays with Ilya** on the alias, whenever the pool runs low before Sunday, and the desk records what he finds (his wish, 2026-10-20 02:52: *"I would love to spend some time playing with Ilya before sedning it out for critique"*). *Solves:* the author's own use is the best check before others look. *Opens:* last fixes, and his confidence in sending it.
- [ ] **Dann plays with the frozen build**, Thursday 2026-10-29 (DESK DEFAULT). *Solves:* a last look at exactly what colleagues will see. *Opens:* the invitations.
- [ ] **The review packet.** *Solves:* colleagues need to know what Ilya is and what Dann most wants answered; he rules its three or four questions, the desk drafts the rest. *Opens:* focused critique instead of scattered impressions.
- [ ] **The review build frozen**, walked once in both languages. *Solves:* every colleague must test the same version while work continues. *Opens:* moving `main`.
- [ ] **Friday 2026-10-30: `main` moved, colleagues invited.** *Solves:* the share itself. *Opens:* N.170 steps 4 to 7: the expert critique, the code review, the synthesis, and the builds that follow.

## After the 30th (deferred; nothing here is lost)

**2026-11-05 00:57, Dann: it is after the 30th; pursue row 136 (the piano doubling) and report.** Measure started 01:0x (`../sessions/brief-desk-row136-piano-doubling-measure_r1_2026-11-05.md`). **Measured 01:1x (helper, 99,347 tokens against 90k stated; it reported about 25k, which was wrong): its reach on row 114 is at most 11 notes** (of the 16 wrong voice notes of 2026-10-19, 4 missing and 7 pitch misreads, all in song 3; 5 length misreads keep their pitch). The doubled share is NOT ESTABLISHED: the saved readings keep the voice part only and there is no piano truth (the desk's brief wrongly assumed they held the piano). DESK DEFAULT: parked again behind meta 2; song 3's three known causes are the cheaper route to those notes. Rows 107, 132, 136, 137, 138, and 140 (the WCAG audit; no level claimed before it, Dann 2026-10-20 00:02). Corrections slices 7 to 11, and slice 8 after N.120 and N.177. N.178. The GUI track, D1 and D2 (`CONTRACT.md` §8). N.88, marketing, Dann's own and optional. N.170 steps 4 to 7. The LATER list of r2 (`SCHEDULE-archive.md`, r2's last section).

## Changes

- 2026-11-05 01:0x, the desk (Opus), a sweep at Dann's ask (00:57): rows 163 and 165 ticked (shipped 2026-11-01); row 181's line brought up to date; row 71 marked BUILT and unmerged on `cloud-lane-29` with rows 172 and 157 (finished 2026-11-02 22:56, never read by a desk); row 136 started. Dann 00:57: "release" in this project means sharing with colleagues, anyone beyond Dann and the desk; the Guide and Learn rewrite waits until the build stops changing shape (the Loupe's print strip, 2026-11-04, changed what the screens show).
- 2026-11-02 23:1x, the desk (Opus): row 176 shipped `e74ee1b2` (row 114 f1 363); T0 to T5 measured (`report-desk-t0-t1-row114_r1`, `report-desk-t2-slur-aware_r1`, `report-desk-t4-t5-row114_r1`); row 177 brief r2 Fable-reviewed and started in `cloud-lane-30`; T6 poem witness running; docs shipped `21a05037`.
- 2026-11-02 13:5x, the desk (Opus): row 175 shipped `ce5dc96f`; consistency batch 2 shipped `d1c2e676`; row 114 first file measured (328 of 590; 363 with row 176 as scratch); row 176 opened; Fable partner memo filed.

- 2026-11-04 23:0x, the desk (Opus, 10:46 to 23:xx): row 178 (poem library) SHIPPED `bf2e1e54` (`report-code-poem-build1-step8-part1` to `part5`, `-merge`); row 181 (joining POEM to LYRICS on a scan) built on `cloud-lane-34` steps 0 to 8 (`report-code-row181-step0` to `step6_r1`, step 8 reports on the lane); meta 2 measured on row 114 f1: control 369, step 1 to 6 tip 332 (cause found: long dashes taken as extenders), step 8 re-measure running at the close.
- 2026-11-01 22:4x, the desk (Opus): by Dann's word of 11:55 the day's work was consistency (how Ilya names its parts), ahead of meta 2's reader review; rows 163 (`dcb36850`) and 165 (`6f740dbf`) shipped; consistency batch 1 running; two style guides ratified (`docs/house-style/`). Meta 2 is displaced, not dropped.
- 2026-10-29 20:5x, the desk (Opus): stage 2b r5 shipped `f6c8ae43`; row 105 r5 no gain; the row fallback shipped `e5bad5a6`; meta 2 on the build songs (replay, not row 114): read right 1,939 of 2,538, exact 1,750 of 2,385 against the goal of 2,147; the second-look and syllable-breaks briefs came back REDESIGN and are parked; the reader review waits for Sunday by Dann's word (20:50).
- 2026-10-28 15:5x, the desk (Opus): row 113 shipped `fb2d2e37`; stage 2b measured on the real page and held for brief r3; the plan A1 to C6 recorded in `STATE.md`; QUEUE rows 158 and 159 added.
- 2026-10-27 23:4x, the desk (Opus): meta 2 rows 117 and 2a ticked; row 105 run and failed its measure (r2 stays); stage 2b running in the cloud, not on the Mac (DESK DEFAULT of the 02:5x plan; the desk measures the real page in its workspace). Frame plus seating together: 1,831 of 2,385 exact (76.8 percent) on the build songs, the harness, not row 114.

- 2026-10-20 02:5x, the desk: r3 written as the checklist Dann asked for; placements DESK DEFAULT. Corrections slices 7 to 11 moved after the 30th; the decision point of 2026-10-26 added.
- 2026-10-20 02:5x, the desk: the budget paragraph added on Dann's word of 02:52; two play items added to meta 6 on his wish; row 105 and stage 2b placed after Sunday's reset (DESK DEFAULT).
- 2026-10-20 03:0x, the desk: each meta and item given its why, what it solves, and what it opens, on Dann's ask of 02:59. Corrected: r3 had song 3's double flat as "row 26"; row 26 (the accidental reader) is archived, held since 2026-10-04, and no open row holds the double flat.
- 2026-10-20 03:1x, the desk: rows 141 and 142 added to meta 3, from Dann's play with song 2 (03:01 and 03:03).
- 2026-10-20 03:1x, the desk: row 143 added to meta 3 on Dann's ruling of 03:08.
- 2026-10-20 03:1x, the desk: row 127 ticked on Dann's look of 03:11.
- 2026-10-20 03:1x, the desk: row 144 added to meta 3 on Dann's ruling of 03:15.
- 2026-10-20 03:2x, the desk: row 145 added to meta 3 from Dann's review of song 2 (03:22).
- 2026-10-20 03:2x, the desk: row 145 narrowed to slur shape and bars 82 and 86; row 146 added (the ossia), from Dann's screenshot of 03:25.
- 2026-10-20 03:3x, the desk: row 147 added to meta 3 on Dann's ruling of 03:29.
- 2026-10-20 03:3x, the desk: row 148 added to meta 3 from Dann's screenshot of 03:33.
- 2026-10-20 03:3x, the desk: row 149 added at the head of meta 3 on Dann's ruling of 03:37.
- 2026-10-20 11:5x, the desk: row 128 shipped; batches A and B sent to the cloud.
- 2026-10-21 21:0x, the desk: ticked from `QUEUE.md` and Dann's looks of 2026-10-20 15:27 to 20:50: rows 141, 142, 143, 144, 148, 149 (closed by design), and the text-seating interview; row 133 noted done, row 139 noted in batch C. The ticks had lagged since 2026-10-20 11:5x. Reversible; his to wave off.
- 2026-10-21 21:4x, the desk: N.195 (row 153) added to meta 6 on Dann's ruling of 21:20; DESK DEFAULT placement, before the walks.
- 2026-10-22 22:2x, the desk: N.196 (row 154) and N.197 (row 155) added to meta 6 on Dann's ruling of 22:08; DESK DEFAULT placement.
- 2026-10-27 02:49, Dann: the decision point of meta 2 answered, option 3 of the desk's three (*"No, 3. Just stop stalling and get it done"*, transcribed as written; 02:48 *"2 but make it good"*, superseded a minute later): the share moves until the words read 9 of 10; no new date set. The desk's options and recommendation (option 1) are in `INBOX.md` 2026-10-27 02:44. Meta 2 becomes THE ONE THING (`STATE.md`). N.194 r5 (row 152) measured green and its ship paste given 02:5x.
- 2026-10-26 22:5x, the desk (Fable): row 139 ticked shipped (batch C, `7d3ac4c0`); row 152 noted running; N.198 (row 156, not on this schedule) shipped `54c01bc3`; row 157 added to `QUEUE.md` and not placed here (DESK DEFAULT: with meta 3's rows, after row 152). **The decision point of Monday 2026-10-26 (meta 2) passed with the words measure not taken: rows 117, 2a, 105, and 2b are unticked, so the measure is below 9 of 10 by default, and the question (what colleagues get on the 30th) is owed to Dann by the next desk, one question.**
- 2026-11-02 00:4x, the desk (Opus): consistency batch 1 SHIPPED `bf4a45ad` (`report-code-consistency-1-step1` to `step4_r1`); row 164 SHIPPED `3a52f05e`; row 175 (palatalization back into integrity with Grayson) opened from Dann's «неподвижный» comment, brief r2 Fable-reviewed, step 0 running. Batches 2 to 6 not started; displaced by row 175 tonight.
- 2026-11-08 23:1x (evening desk): row 181 arm J measured (371 vs 389, refuted; report-desk-row181-armJ-row-floor_r1_2026-11-08.md); design r3 written; row 182 (poem library arias) briefed.

- 2026-11-09 01:5x (night desk): row 181 arm J2 measured (388 at K=4 and K=6 vs 389, refuted; report-desk-row181-armJ2-scaled-floor_r1_2026-11-08.md); next, the B0 and B0g Code brief without rank 2.
- 2026-11-10 21:2x (Opus desk): shipped row 181 B0 and B0g `31a3f55f` (report-code-row181-b0-step0 to step6_r1), row 179 `8fb0ffc6` (report-code-row179-step0 to step4_r1), row 166 `b7030de1` (report-code-row166-step0 to step9_r1), row 184 word marks `1f1bf1c6` (report-code-word-marks-step0 to step5_r1). Row 182 and row 138 (lane 43) next; row 183 (poem load) briefed.
- 2026-11-12 01:5x (Opus desk, re-tick from `git log` since 2026-11-10 21:2x, the close step 0 owed by the night desk): shipped row 182 arias `3c247013` (report-code-row182 lane 41); LEARN cursive glyphs `47284e24` (lane 46); row 138 barline and time signature tools `c93c02e7` (lane 47, divide offer not built); row 183 the 224 harvested poems `ad90f5a6` (report-code-poem-library-harvest-step4_r1_2026-11-11); docs only: `7fb9cd30`, `dc078b95`, `b1234cf4`, `b2d4ef8e`.

