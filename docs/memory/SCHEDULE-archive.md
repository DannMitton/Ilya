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
