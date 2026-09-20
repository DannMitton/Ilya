# SCHEDULE: the road to the release, Friday 2026-10-30

**Asked for by Dann 2026-09-16:** *"consider all of the work needed for the
release and devise a schedule beginning tomorrow that will guide our work."*
Written by the desk the same night, from the sort
(`../sessions/sort-release_r1_2026-09-16.md`) and the estimate
(`../sessions/estimate-release_r1_2026-09-16.md`, DESK INFERENCE).

**How to use it.** Work the current week top to bottom. Tick a line when it is
**walked**, not when it is written. **Maintained at every close:** tick what
closed, and move anything unfinished to the next week with its date. If a week
runs over, the buffer in week 5 absorbs it; if the buffer is gone, the lowest
line in the week moves to LATER, and the date stands.

**Rules in force:** the freeze rule (`STATE.md` §RULINGS DANN OWES): a new
finding joins only if Ilya would otherwise tell a singer something false or
lose a singer's work. **Checkpoint Friday 2026-10-09:** a design row not yet
in Code moves to LATER.

**ONE HARD DEPENDENCY, ruled 2026-09-19: N.84, the Guide, cannot start until
N.154 and the French are done and walked.** It is the only line in this file
that blocks another, and it is in the header so a week-6 reader does not meet it
for the first time on the day.

**Pace assumed:** about four heavy evenings a week (`git log`, week to
2026-09-16). Dann's days are his; the weeks are a guide, not a timetable.

---

## Week 1. Thursday 2026-09-17 to Sunday 2026-09-20. Clear the decks, find the surprises

- [x] **N.146**, poem or score detected. **CLOSED 2026-09-17: walk 5 passed in Incognito (`OPEN.md`, N.146 findings, 9).** Read Code's memo, move gates, ship, walk: a score PDF, a score photo, a text PDF, a poem photo, and a page with the poem above the music. **2026-09-17:** shipped `fe4d2c7` and `6e98057`; all walked except walk 5 (poem photo), which awaits step 2c (`STATE.md`).
- [x] **N.147, the loupe tap. CLOSED 2026-09-17**: the syllables moved into the loupe, a note tap only selects, shipped `55c04d9` and walked. Two more ships followed the same night: the semitone cells and the fill tag's word (`0eb0a95`), and the pitch grid of six (`b03e918`).
- [ ] **N.92's caret reach.** Designed and ruled 2026-09-17, sized at more than one evening by the audit. Week 2.
- [ ] **N.142 step 2.** The desk counts, through Chrome on the branch alias, placements in Dann's library that sit on a tie's continuation. Build only if the count is not zero.
- [ ] **The nine CHECK rows.** The desk looks at each (a Sonnet agent for the code reads). Each closes or becomes IN work in week 2.
- [ ] **UNSETTLED-6, the per-format walk.** Dann drops one file of each kind Ilya accepts: MusicXML, `.mxl`, `.musx`, `.mnx`, `.mscz`, PDF, photo. **Samples found by the desk 2026-09-17:** MusicXML `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`; `.mxl` `tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/score.mxl`; `.musx` `~/Downloads/Mussorgsky - Sunless 04 - Be bored.musx`; `.mnx` `~/Downloads/Sharp Excerpt.fin27.mnx` (the only one); `.mscz` `~/Downloads/Schubert_Gretchen_am_Spinnrade_D118_OpenScore.mscz`; PDF and pictures from the N.146 walk (`STATE.md`, findings). **Still missing: a real phone photo of a score.** The sniff accepts HEIC (`format-detection.ts:117`); which of the 234 phone photos in `~/Downloads` show a score is NOT ESTABLISHED.
- [ ] **Start the two design rows.** With Dann's say-so: design for **N.123** (where the tessituragram and its bands sit, given Insights page one is fixed at one page) and for **N.94** (the transposition control in the Score Markup band, between Corrections and Voice). A Sonnet agent looks for N.123's two missing sources (the centre-of-gravity formula; Titze, Švec, and Popolo 2003).

## Week 2. Monday 2026-09-21 to Sunday 2026-09-27. The ruler and the toggles

- [ ] **N.129**, the underlay ruler and no dropped hyphens. Brief written. Walk on screen and in print.
- [ ] **N.136 with N.119**: every notation toggle acts at once on Transcription and Markup, and no toggle does nothing.
- [ ] **N.141, last step**: the squircle across a tie.
- [ ] **N.132**: the ratified names and the tab padding.
- [ ] **Fixes from week 1**: whatever the format walk and the CHECK rows turned up.

## Week 3. Monday 2026-09-28 to Sunday 2026-10-04. Insights and the design rows

- [ ] **N.127 increment 2**: the compass stave, the piece's range against the singer's.
- [ ] **N.123, part 1**: the tessituragram with the passaggio zone shaded.
- [ ] **N.94, part 1**: the control appears, and the score draws in the chosen key.
- [ ] **N.130 and N.131**: the desk drafts Insights' French; Dann rules it in one sitting; one build carries it with N.131's 21 ratified rows.

## Week 4. Monday 2026-10-05 to Sunday 2026-10-11. Finish the design rows

- [ ] **N.123, part 2**: the half-mass band, and the centre of gravity and cycle dose if their sources were found. A figure without a source is left out, not guessed.
- [ ] **N.94, part 2**, and its walk.
- [ ] **N.82**: the watch band's sentences move out of code and into both languages; Dann rules the French.
- [ ] **Friday 2026-10-09, the checkpoint.** Anything design-bound not yet in Code moves to LATER.

## Week 5. Monday 2026-10-12 to Sunday 2026-10-18. Clean house. (Monday is Thanksgiving.)

- [ ] **N.86**: the dead-code audit (a Sonnet agent reads), and Dann rules what the Shane switch (`apps/web/src/lib/wall.ts:6-7`) does at release.
- [ ] **How the release goes out.** How the `Shane` branch reaches the public site is NOT ESTABLISHED in any memory file. The desk finds out and writes it down.
- [ ] **N.85**: README, CONTRIBUTING, code of conduct. The desk drafts; Dann reads every word.
- [ ] **Desk housekeeping**: COLOUR-7, INBOX-17, INBOX-31 into `PRODUCT.md`.
- [ ] **N.154. EVERY USER-FACING STRING SAYS WHAT THE APP NOW IS, both languages.**
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
- [ ] **Buffer.** Anything that spilled from weeks 1 to 4.

## Week 6. Monday 2026-10-19 to Sunday 2026-10-25. The Guide, once the interface is final

- [ ] **N.84**: the Guide rewritten for the interface as it now is, in English and French, with new screenshots. Dann reviews the prose.
  **BLOCKED ON N.154, AND ON A FRENCH VERIFICATION, ruled by Dann 2026-09-19:**
  *"let's make a French verification a prerequisite for that process."* The Guide
  describes the interface, so a Guide written over stale strings documents an app
  that does not exist, in two languages, with screenshots to match. **The gate:
  N.154 closed, N.130 and N.131 closed, and the French walked on screen** before
  a word of the Guide is rewritten.
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
