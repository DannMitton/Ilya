# QUEUE: every Code brief that has not shipped

Created 2026-09-30 10:55 by the desk, after Dann: *"are there any other unexecuted briefs that should be processed? I'm tired of rediscovering these in medias res."* The cause: queues lived only in `STATE.md` blocks, which move to `LOG.md` at each close, so a brief queued in one block and not carried to the next was lost. `brief-code-voice-intake-order-and-keep-reading_r1_2026-09-28.md` was queued twice and never run.

**The rule.** A brief enters this table the moment the desk writes it. A row leaves only when its work is shipped (a commit named in the row). The desk reads this file at every open, right after `STATE.md`, and updates it at every close. `STATE.md` may say what is next; this file says what exists.

**How the audit was done, 2026-09-30:** every `docs/sessions/brief-code-*.md` (52) was matched against a `report-code-*` or `memo-code-*` file; the 13 without one were checked in the tree at `47a6f8f` plus the uncommitted work. Eight were found built. The rows below are the rest.

**Three audits, 2026-09-30.** (1) The 52 briefs matched against Code reports; the 13 without one checked in the tree. (2) Two Sonnet agents checked the 45 reported or built briefs deliverable by deliverable: 41 DONE, 2 SUPERSEDED, 2 PARTIAL (`../sessions/audit-briefs-A_r1_2026-09-30.md`, `-B_`). (3) A Sonnet agent checked every ruling in `OPEN.md` and `PRODUCT.md` that should show in code (`../sessions/audit-rulings_r1_2026-09-30.md`). The desk spot-checked every gap in the tree.

## The run, in order

**Code works down this table, one row at a time, and reports after each.** A row marked READY can start; a row marked NEEDS DANN waits for the ruling named. Code updates a row's State when its report is written; the desk moves the row out when its commit is named.

| # | Brief | State | Evidence (read 2026-09-30) |
|---|---|---|---|
| 1 | `../sessions/brief-code-small-fixes-before-ship_r1_2026-09-30.md` | READY, in Code now | comment strings EN and FR (ratified 11:02), doubled « ; » space, Other under "Not sure", Keep my reading comment |
| 2 | Voice type slice A and the 2026-09-28 intake brief: `../sessions/brief-code-voice-type-slice-a_r1_2026-09-30.md`, `../sessions/brief-code-voice-intake-order-and-keep-reading_r1_2026-09-28.md` | BUILT, uncommitted; Keep my reading WRITTEN, not seen | report `../sessions/report-code-voice-type-slice-a_r1_2026-09-30.md`. **Dann walks his [i], then ships rows 1 and 2 together.** Gate 4 baseline moves to 1719 plus row 1's tests |
| 2b | `../sessions/brief-code-i-extractor_r1_2026-09-30.md`: Dann's [i] reads 1063, 247, then 186 Hz; find why and fix, verified first on synthetic fry of known resonance, with no session from Dann | READY, FIRST after the ship | Dann 12:38: "Fix this." |
| 2c | `../sessions/brief-code-calibration-first-moments_r1_2026-09-30.md`: voice type asked first ("Not sure" welcome); no question during capture; one note at the summary. Supersedes row 8d | READY after 2b | ruled 12:43; strings RATIFIED 12:49, including `calib.roster.kept` → "Beyond Ilya's reference values" |
| 3 | `../sessions/brief-code-n86-remove-dead_r1_2026-09-28.md` | READY | `TextualWitnesses.svelte`, `renderer-output.ts`, `tools/e16-harness/_rhythm_spike/` still present |
| 4 | `../sessions/brief-code-guide-sources_r1_2026-09-27.md` | READY | no Sources section in `GuideContent.svelte`; words ratified 2026-09-27 01:02 |
| 5 | `../sessions/brief-code-audit-correction-station_r2_2026-09-27.md`, slices 4 to 6, **plus cause 1c** (an entered note that knows its measure; `report-code-calm-loupe_r1_2026-09-28.md` §4 item 1) | READY | slices 1 to 3 shipped (`9fa49b7`, `9ebfdc0`, `7d2fcd6`); map `../sessions/code-audit-correction-station-map_r1_2026-09-27.md` §4 |
| 6 | `../sessions/brief-code-corrections-fixed-panel_r1_2026-09-28.md` | READY after row 5 | same panel |
| 7 | `../sessions/brief-code-insights-uses-the-gates_r1_2026-09-30.md` (includes gate 2's silent rare lines) | READY | only Markup calls `gateBand`; ruling 2026-09-28 16:28 |
| 8 | `../sessions/brief-code-loupe-remainder_r1_2026-09-30.md`: tween, meter run-in 1 sp, tapered tie, one size per song, zoom, bar left in a gap | READY. Zoom French RATIFIED by Dann 2026-09-30 11:17: « Réduire le zoom » (Zoom out), « Agrandir le zoom » (Zoom in), drafted by Code 2026-09-28 | rulings of 2026-09-18 and 2026-09-20 (`OPEN.md` §"THE LOUPE'S TWO MODES" 3, 7, 9) and 2026-09-28 01:34 |
| 8b | Seat the ratified comment French (A and B seated in Code's fifth addendum; section C, ratified 12:25, pasted 12:25, not yet seated when checked 12:33): `../sessions/french-comments_r1_2026-09-30.md` (A: replace the NOT RATIFIED comment over `comment.working.*` with the ratification; B: `comment.heading`, `comment.more.*`, `comment.hidden.*`, `comment.sourcesCited` French, verbatim) | READY | ratified by Dann 2026-09-30 12:08 |
| 8d | The wheel looks dead under the implausible hold | SUPERSEDED by row 2c (the hold is removed) | Found on Dann's [i] walk 12:36: while `holdActive`, a transparent catcher covers the quadrilateral (`CalibrationWizard.svelte:1387-1389`); it lasted 1.6 s until today, but the implausible hold now waits for a choice, so the wheel ignores taps until a button is pressed. Fix: for the implausible hold only, a tap on any vowel counts as Continue (the reading stays Provisional) and passes through to the tapped vowel. Test it. |
| 8c | Citation repairs in `insights/comment-sources.ts` | READY | (1) RMR-057's tap quotation argues against modification to the schwa and does not support "tends to open a little on its own"; replace with Miller 1986 p. 158: "natural modification of the vowel will inevitably result in the mounting scale" (read by the desk from `~/Documents/Voice Pedagogy Library/M-O/Miller_R (1986) - The Structure of Singing.pdf`, PDF p. 179). (2) Miller 1986's publisher: Schirmer Books (New York), title and copyright pages, PDF pp. 1 to 8. (3) Bozeman 2021's ISBN: 978-1-7335060-3-8 (supplied by Dann 2026-09-30 12:15; the copyright page is not among the photos). |
| 9 | Voice type slice B: the courtesy check | COPY RATIFIED 12:32 (`../sessions/draft-voice-type-slice-b-copy_r1_2026-09-30.md`, last section); brief waits for the pooled norms table r2 (DESK DEFAULT) | design `../sessions/draft-voice-labels_r2_2026-09-30.md` §Slices |

## Open work, not truant (numbered items in `STATE.md`, never meant built yet)

Found by the rulings audit, 2026-09-30 (`../sessions/audit-rulings_r1_2026-09-30.md`). Each waits for Dann to order it, as `SEQUENCE.md` and `SCHEDULE.md` say; listed here so none is rediscovered.

- **N.84, the Guide rewrite.** The Guide's body still says "Fit" and "Transcription tab" and "four tabs" (`GuideContent.svelte:60`, `:73`, `:93`, `:122`, and English `:336`, `:350`, `:370`, `:399`). The headings are current (2026-09-27). The rewrite is N.84's.
- **N.120, the tempo control** (`MarkupPane.svelte:728`; `insights.phonation.tempoPointer` written, not shown).
- **N.151, an edited score exported as a copy** (hedged, "ideally"); and **N.92, a page flag for an over-full measure** (the loupe line exists, `loupe.fill.over`).
- **N.123, the cycle dose:** the falsetto caveat is computed (`score-metrics.ts:126`) and never shown; the half-mass band is not built.
- **N.141's later increment:** the squircle across a tie, barline, and system break.
- **N.122** (capture surface as a landmark), **N.115** (measure-to-system control), **N.117** (load progress bar): unplaced.
- **Clearing the poem box warns how many placed syllables it frees** (`PRODUCT.md`, "THE TEXT AND THE NOTES"): scope unclear; not built (`IntakePanel.svelte:463`).

## Owed by Dann (questions, not work)

- **"compatibility" or "fit"** in `insights.fit.heading` and its family (`OWED.md`, "Rulings Dann owes" item 2; the tree still reads "The fit, in its terms").
- **French « ? »:** eight ratified intake strings carry a narrow space before « ? » (`i18n.ts:1668` to `:1714`), against the 2026-08-21 rule of no space; the pairing was never put to him.
- **Slice B's copy** (row 9).

**Found built, no report on file (not queued):** Grayson ⟨ц⟩ ⟨ш⟩ (`packages/phonology/src/lexical-palatalization.ts`); interpalatal я (`reconstitution.ts`, the я → a rule); Richter credit (`footer.richter`); N.154 strings (LearnContent, GuideContent); N.168 passaggio and six voices (`tools/n168-frequency-run/frequency-run.run.ts`); undo on song switch (LOG, 2026-09-27 20:40); N.171 (`6ede257`).
