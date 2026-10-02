# Project plan: Ilya reads a printed song

**Draft r3, 2026-10-01 23:00. Written by the desk (Fable) at Dann's request (21:57).**

**Status: a living draft.** It changes as measurements come in. Older decisions are defaults with reasons, not gates. The singer's seat comes first. (`CONTRACT.md` tethers 19 and 22, amended 2026-10-01 22:01.)

**What changed from r2:** Dann's rulings of 22:22 and his idea of 22:27; the independent critique (`memo-fable-independent-critique-of-plan-r2_r1_2026-10-01.md`); the survey of the field (`precis-rebelo-2012_r1_2026-10-01.md`).

**Evidence:** `memo-fable-reader-audit-against-the-guide-model_r1_2026-10-01.md`, and `brief-code-staves-traced-and-straightened_r1_2026-10-01.md` (held).

---

## 1. The problem (Point A)

**What the singer met, 2026-10-01.** Dann gave Ilya a clean public-domain scan: Tchaikovsky, Op. 38 No. 3, Jurgenson 1878, three pages. Ilya returned 4/4 for a printed 3/8, 5 measures, no words, a refusal of page 3, and a banner of counts. His words: *"insufficient and wrong"*, and *"A simple scan of a pdf must work reasonably well before a public release."*

**Why, as measured the same day:**

1. The reader loses the staves on a tilted page, and everything after depends on them.
2. Each later stage is tuned to computer renders in one modern font.
3. The reader looks at the voice staff alone.
4. It reads no text.
5. It has no model of the page, and no way to tell the singer which note it doubts.
6. It decides early and by yes or no. A mark that fails one test is gone before anything that could vouch for it is consulted.

## 2. The outcome (Point B), from the singer's seat

**Ruled by Dann, 2026-10-01 22:22:** *"Yes, you have effectively captured the experience you want Ilya to give a singer."* Step 3 is in his words.

1. The singer drops a PDF or scan of a song onto Ilya. If the file holds several songs, Ilya asks which one, with the pages in view.
2. While Ilya reads, they see their own page and one plain sentence about what is happening.
3. *"Their melody appears in Ilya's Markup tab, with the Russian syllables under their corresponding notes (see Gould for common practice on seating syllables under notation)and the transcription is ready in the Text tab. Tempo and dynamics are in place above the extracted melody featured in Markup."* (Dann, verbatim.)
4. Where Ilya is sure, it says nothing. Where it is unsure, it shows the exact spot beside the same spot on their page, and one tap fixes it.
5. If something large is in doubt, such as which staff is the voice, Ilya asks one plain question with the page in view.
6. They never see counts, stages, or the reader's vocabulary.

**The measure. Ruled by Dann 22:22** (*"an excellent measure of whether step 4 is rare enough to feel like help, not homework"*): **95 of every 100 notes right in pitch and length, and 9 of every 10 syllables right and under the right note.** Around those two:

- **Per song, not pooled.** Each song in the test set meets the measure, so one easy song cannot hide a hard one.
- **Structure:** staves and systems all found on clean scans; at least 98 of 100 bars.
- **Unsure spots:** at least 9 of 10 real errors are shown as unsure, and the number of false alarms per page stays under a limit set in phase 1, when the drawings show how many feel like help.
- **No confident false word** (N.163).
- **The wait and the memory** stay within limits set from phase 0's baseline.
- **Measured on the app's own path**, in the browser.

**Out of this release already:** phone photographs of a score (Dann, 2026-09-24), MIDI (Dann, 2026-10-01), the piano's own notes.

## 3. Principles

1. **The staff is the ruler.** Trace it, straighten the page, and each staff becomes a grid: up and down is pitch, left to right is order, and every mark gets coordinates in staff spaces.
2. **One size, one witness.** Every page is resized to one staff size before reading. The untouched scan stays underneath; cleaning (despeckle, deskew, morphing) is done on purpose-made copies and sized from the staff, never by fixed amounts.
3. **Rebuild the layers, most reliable ink first:** staves, systems, barlines, noteheads, then text.
4. **The signs of a system vote.** Left line, brace, barlines through the piano, a text line under the voice, one note at a time.
5. **Decide late, by likeness and by sense (Dann, 22:27).** A candidate carries a likelihood, not a yes or a no. The page's marks are first grouped by how alike they are to each other, then each group is named once. The bar and the system, where musical sense can be tested, make the decision. The field's precedent: several hypotheses per symbol, decided by consistency (Rossant and Bloch 2007, via `precis-rebelo-2012`, row 022; primary not yet read).
5a. **Gould bounds the likeness (Dann, 22:41).** Each likelihood is scored against the engraver's own dimensions, in staff spaces: stem length, beam thickness, the dot's distance from its notehead, the lyric line's level baseline and letter height, the raised hyphen against the baseline extender. The table already exists: `memo-gould-dimensional-priors_r1_2026-08-24.md`, drawn from the project's extraction of *Behind Bars* (`claude/gould-vocal-engraving-rules_v7_2026-08-05.md`, 244 rules, and the beams delta, rules 245 to 284). Two cautions. A Gould prior bounds a dimension and never decides a meaning (Dann, 2026-08-18). And Gould describes practice in 2011: an 1878 plate predates her, and flags one note per syllable where she beams by beat (rule 68, p. 435), so her numbers are tested on the old pages in phase 0 before any is trusted. Her rests (pp. 34 to 38), notehead sizes (pp. 10 to 12), and slur design (pp. 109 to 112) were never photographed.
6. **The page teaches Ilya its own glyphs.** The four music fonts in the tree (Finale Maestro, Bravura, Leland, Leipzig) give four starting examples of each mark. The closest group on the page becomes the page's own example.
7. **Position says what a text is; language says whether it was read right.**
8. **Three states for every fact: read, deduced, unsure.**
9. **Truth before measuring, measuring before building, and no new fixed number without a check on songs the builders have not seen.**

## 4. Architecture

**The page model.** One structure holds what Ilya believes about the page before any of it becomes data:

- **page** → **systems** → **staves**, each with a role (voice, piano right, piano left, unknown) and its traced lines
- **bars**, aligned across the staves of their system
- **events** on the voice staff: notes, rests, **ties, and slurs**
- **text items:** lyric lines split into syllables; tempo words; dynamics; **hairpins**
- every item carries its **state**, its **evidence**, and **its box on the scan** (page, position, size)

**The companion record.** The melody reaches Markup as a score file, which has no slot for doubt or for a place on the scan. So a small record travels beside it: for each note id, its state and its box. The hook exists: each note read from a scan already carries its id into the score (`recognized-to-musicxml.ts:30-33`). This is what makes step 4 of the experience possible, and it is defined in phase 0.

**The pipeline:** resize and straighten → structure → voice events → text → assemble the page model → checks → convert, with the companion record.

**The checks:** the same bar count on every staff of a system; each bar adds up to the metre; syllables balance notes, allowing for melismas and ties; rejoined words are real words; clef and key agree from system to system. A check may decide only where exactly one reading satisfies it and no fact in that bar is unsure; the result is marked deduced.

**The words are poem-first.** When Ilya has the poem (pasted by the singer, as today, or supplied from a public-domain text), the scan says where each syllable sits and the poem says what the letters are. The match must tolerate what a composer does to a poem: repeated words and lines. Syllables are divided by the notes above them, since these editions print words with no space between them. With no poem, Ilya reads cold, and every word that is not in the dictionary after pre-reform normalizing is unsure.

**What stays.** The seam into the app (the read becomes MusicXML through the existing ingest). `VocalLineEvent`. Tempo and dynamics in their own layer, with a piano dynamic only as a suggestion marked "from the piano" (Dann, 02:39). The notehead finder, pitch arithmetic, accidental reader, beam reader, and abstain path.

**Where it runs.** In the browser, on the pinned Pyodide. The note reader uses no trained model: grouping by likeness and graded evidence are arithmetic, not training. Text uses the reading model Ilya already ships, which lacks ѣ, і, ѳ, and ѵ (unpacked 2026-10-01); a pre-reform model (`orus`) is tested in phase 6, and training our own additions is held in reserve.

## 5. The phases

A gate is a number measured on the test set, on the app's own path, or Dann's ruling on something he can see.

| # | Phase | Delivers | Gate | If the gate is missed |
|---|---|---|---|---|
| 0 | Foundations | Six songs: three to build on, three held back unseen. Truth files proofed by Dann. A scorer that compares musical facts, with a ratio per kind of error. A harness that runs the app's own path. Today's baseline. Audiveris and one permissively licensed engine scored on the same pages, as a ceiling. The companion record defined. Page resizing. | Baseline table written for three songs | Start with the songs that are ready |
| 1 | The experience, drawn | Section 2's six steps drawn on the Tchaikovsky pages, in both languages, using the baseline's real count of unsure spots | Dann rules on the drawings | Redraw |
| 2 | Geometry | Straightened page; staves; systems; voice staff by vote; tacet; barlines by vote | Staves and systems all found; 98 of 100 bars | Staff lines as shortest dark paths across the page (Cardoso et al. 2009; primary to be read). Failing that, the singer marks the first system |
| 3 | Page model | The structure, the checks, and the companion record carried through to Markup | 9 of 10 known errors shown unsure; false alarms under phase 1's limit | Ship the checks that exist |
| 4 | Rests, bars of rest, metre | The page's own glyph groups, named from the four fonts | Per song: every bar's rests and the metre right in 95 of 100 bars | The singer confirms the metre, as for clef and key today |
| 5 | Note lengths, ties, slurs | Flags, beams, and dots read from shape; ties and slurs; bar arithmetic as evidence | 95 of 100 notes, per song | What remains is shown unsure and fixed in Corrections |
| 6 | Words | Lyric line by position; the poem matched to it; syllables divided by the notes; cold reading as the fallback; `orus` tested | 9 of 10 syllables, per song; no confident false word | With no poem and a poor cold read, Ilya asks for the poem |
| 7 | Directives | Tempo words from the existing vocabulary; dynamics as whole shapes, joined forms included (Dann, 22:06); hairpins | 9 of 10 tempo words and voice dynamics | Tempo words; the singer enters dynamics (N.177) |
| 8 | The experience, built | Phase 1's drawings made real, in both languages; the Guide's example | Dann's walk | n/a |
| 9 | Hardening | Degraded copies; more editions from IMSLP | The held-back songs meet the measure | Named limits in the Guide |

**Order.** Phases 0 and 1 first, side by side. Then 2, then 3. Phase 4 before 5. Phase 6 can start once phase 2 has placed the noteheads; it needs their positions, not their lengths. Phase 7 follows 6. Phase 8 is built as 3 to 7 land.

**Standing pivots.**

- **A gate missed twice on the same approach stops that approach.** The desk measures the cause and Fable designs another.
- **At the checkpoint, Friday 2026-10-09, the numbers go to Dann with three options** if the reader is short: the date moves (his words of 2026-09-26 and 2026-09-27); the scan read is released as a first draft the singer confirms; or an outside engine is evaluated, which raises a licence question and the offline stance.
- **Lost work.** Every measurement is saved as a memo in the turn it is made.

## 6. What an outside reviewer forecast for 2026-10-30

Recorded so it is not forgotten, from the independent critique:

- **Likely:** every staff, system, and voice staff on clean scans; most barlines; pitch near 85 to 90 of 100; tempo words; words seated from a pasted poem.
- **Possible:** note lengths good enough that unsure spots feel like help.
- **Not believable:** the full measure across six editions; 9 of 10 syllables from cold reading; every dynamic; degraded copies; the whole bilingual experience and the Guide.

The outcome in section 2 does not shrink to fit this. The date moves before the work does.

## 7. Who does what

- **Dann:** rules on taste, the irreversible, and French; proofs each truth file; walks each phase.
- **Fable:** this plan; the design at each gate; every pivot.
- **Opus, at the desk:** one brief per work package, in `BRIEF-TEMPLATE.md`'s form, measured first; `QUEUE.md` and `STATE.md` kept current.
- **Code:** builds and runs the gates on Dann's machine.
- **Sonnet agents:** truth drafts, counts, sweeps. Two at most, cost stated first.

## 8. Against the calendar

**Targets, not measurements. Phase sizes are NOT ESTABLISHED.**

| Week | Target |
|---|---|
| 3, to Sunday 2026-10-04 | Phases 0 and 1; phase 2's brief in Code |
| 4, to 2026-10-11 | Phases 2 and 3. **Checkpoint Friday 2026-10-09** |
| 5, to 2026-10-18 | Phases 4 and 6 |
| 6, to 2026-10-25 | Phases 5 and 7 |
| 7, to Friday 2026-10-30 | Phases 8 and 9, or the date moves |

**What this displaces (DESK DEFAULT):** `QUEUE.md` rows 5 to 17 run only when Code is idle between this plan's briefs. N.84's walkthrough waits on phase 6.

## 9. Departures from older decisions, taken as defaults

1. **A strip trace becomes the staff finder for scans.** Departs from E.60 (about 2026-08-19). Reason: measured on twelve scan pages.
2. **A tacet system emits bars of rest.** Departs from "the reader never invents an unprinted rest" (2026-07-27). Reason: Dann, 16:08. The bars are marked deduced.
3. **Bar arithmetic may decide a note's length, marked deduced.** Departs from "validators flag, humans fix" (2026-07). Reason: one reading that makes the bar add up is evidence. The field does the same (`precis-rebelo-2012`, rows 028, 029, 035).
4. **Unsure spots are shown to the singer.** Departs from E.47, which struck the uncertainty mark because a mark on everything says nothing. That reason is kept: the gate limits false alarms, and the spot is shown beside the page, not printed on the music.

## 10. What is Dann's to decide (taste), each brought with a proposal when its phase arrives

- The drawings of phase 1, and the limit on false alarms.
- Which six songs, and which three are held back.
- How a read underlay and a typed poem reconcile, and which spelling the singer sees.

## What could not be established

- The size of any phase.
- Whether the measure is reachable by this reader on old engravings. Phase 0's outside engines give the ceiling.
- Anything about degraded photocopies. The field reports failure there (`precis-rebelo-2012`, row 031).
- LiederNet's terms for automated use. Not read.
- Whether the four fonts' shapes are close enough to an 1878 plate to seed the page's groups. A quick test in phase 0.
