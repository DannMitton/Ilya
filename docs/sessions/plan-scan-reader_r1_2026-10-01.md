# Project plan: Ilya reads a printed song

**Draft r1, 2026-10-01 22:15. Written by the desk (Fable) at Dann's request (21:57):** *"define the problem to be solved, the desired outcome, and how we will get from Point A to Point B with responsible architecture, design, and code... an excellent plan hardwired with contingencies and intelligent pivots... in a way that Opus can follow your directions."*

**Status: a dated draft. Nothing in it is ruled until Dann rules it, section by section.** Sources for every measurement: `memo-fable-reader-audit-against-the-guide-model_r1_2026-10-01.md` and `brief-code-staves-traced-and-straightened_r1_2026-10-01.md` (held), both in this folder.

---

## 1. The problem (Point A)

**Observed, 2026-10-01.** Dann gave Ilya a clean public-domain scan: Tchaikovsky, Op. 38 No. 3, Jurgenson 1878, three pages. Ilya returned 4/4 for a printed 3/8, 5 measures, no words, and refused page 3. His words: *"insufficient and wrong"*, and *"A simple scan of a pdf must work reasonably well before a public release."*

**Measured the same day (the audit memo):**

1. The reader loses the staves on a tilted page, and everything after depends on them.
2. Each later stage is tuned to computer renders in one modern font: barlines, rests, the metre, and rhythm all fall short on a real engraving.
3. The reader looks at the voice staff alone, so it cannot use what the rest of the system says.
4. It reads no text: no lyrics, tempo words, or dynamics.
5. It has no model of the page. Its output is a flat list of notes and measures, so there is nothing to run a sanity check on before the singer sees it.

## 2. The outcome (Point B)

**Dann's words, 15:11 and 15:22:** *"Ilya processing a scan, extracting a melody with respectable accuracy, and seating Russian lyrics underneath their corresponding notes predictably"*, the melody being *"the metre, the barlines, the pitches, the rhythms, the rests, the dynamics, the tempo indications, and the pickup"*. Notation is data, not artwork: the layout need not survive, the musical information must. *"Guessing is not a modality for well-constructed software."*

**Proposed as the measurable form of that. NOT RULED.**

- **The test set:** six printed songs from at least four publishers, each with a truth file proofed by Dann. Tchaikovsky Op. 38 No. 3 is the first. One is a degraded photocopy.
- **Structure:** every system, every staff, and every bar found, with the metre, the pickup, and bars of rest in place.
- **Notes:** 95 of every 100 right in pitch and in length.
- **Words:** 9 of every 10 syllables right and under the right note, and no confident false word (N.163).
- **Directives:** every tempo word and every voice dynamic on the page found and placed at its bar.
- **Honesty:** anything Ilya is unsure of is marked for the singer. Nothing is guessed silently.
- **Measured on the app's own path**, in the browser, not on the desk's shell.

**Already ruled out of this release, and not reopened here:** phone photographs of a score (Dann, 2026-09-24), MIDI (Dann, 2026-10-01), the piano's own notes.

## 3. Principles (the guide model, Dann and the desk, 2026-10-01)

1. **The staff is the ruler.** Trace it where its ink is; place everything else relative to it.
2. **Rebuild the layers, most reliable ink first:** staves, systems, barlines, noteheads, then text.
3. **The signs of a system vote.** Left line, brace, barlines through the piano, a text line under the voice, one note at a time. One broken sign is outvoted.
4. **The page teaches Ilya its own glyphs.** Take the page's own rest, digit, clef, and dynamic letter as the exemplar, not one modern font.
5. **Position says what a text is; language says whether it was read right.**
6. **Three states for every fact: read, deduced, unsure.** Unsure is shown, never hidden.
7. **Measure before building, and truth before measuring.**

## 4. Architecture

**The page model (Dann's "virtual midway step", 21:57).** Between the ink and the score sits one structure that holds what Ilya believes about the page before any of it becomes data:

- **Page** → **systems** → **staves**, each with a role (voice, piano right, piano left, unknown) and its traced lines
- **bars**, aligned across the staves of their system
- **events** on the voice staff (notes, rests), and **text items** (lyric lines split into syllables; directives)
- every item carries its **state** (read, deduced, unsure) and its **evidence** (which signs agreed)

**The pipeline, in order:** straighten → structure (systems, roles, bars) → voice events → text → assemble the page model → sanity checks → convert.

**The sanity checks, run on the page model before anything is shown:** the same bar count on every staff of a system; each bar adds up to the metre; syllables balance notes, allowing for melismas; rejoined words are real words; clef and key agree from system to system.

**What stays.** The seam into the app: the read becomes MusicXML and enters through the existing ingest (`recognized-to-musicxml.ts`, Ruling C of N.59). `VocalLineEvent` does not change. Tempo and dynamics live in their own layer by measure and beat, and a piano dynamic arrives only as a suggestion marked "from the piano" (Dann, 2026-10-01 02:39, `OPEN.md`). The notehead finder, pitch arithmetic, accidental reader, beam reader, and the abstain path are kept.

**What is replaced or new.** Replaced: the staff finder. Rebuilt: barlines, rests, metre, rhythm. New: the page model, the checks, all text.

**Where it runs.** In the browser, on the pinned Pyodide. No trained model in the note reader (the reader's charter, 2026-07). Text uses the OCR Ilya already ships.

## 5. The phases, each with its gate and its pivot

A gate is a number measured on the test set, on the app's own path. **No phase starts until the gate before it is recorded in `STATE.md`.**

| # | Phase | Delivers | Gate | If the gate is missed |
|---|---|---|---|---|
| 0 | Truth | Truth files for the test set; the scorer; today's baseline; one outside engine measured at arm's length as a ceiling | Six truth files proofed; baseline table written | With fewer than six, start on what exists and add the rest as they are proofed |
| 1 | Geometry | Straightened page; systems; voice staff by vote; tacet; barlines by vote | Every staff, system, and bar on the test set | Ask the singer to mark the first system, and trace from it |
| 2 | Page model | The structure of section 4, the checks, and the read report | Every known error in the test set shows as "unsure"; none is silent | Ship the checks that exist; the model can grow |
| 3 | Melody | Rests and digits from the page's own glyphs; note lengths from shape; the metre | 95 of 100 notes | Bar arithmetic decides where exactly one reading fits (needs Dann's ruling); what remains is shown unsure and fixed in Corrections |
| 4 | Words | Lyric line by position; OCR; pre-reform spelling; dictionary; syllables tied by order | 9 of 10 syllables; no confident false word | The known poem: the singer's pasted text, or a public-domain text Dann supplies, is aligned to the page, so OCR only has to match, not read |
| 5 | Directives | Tempo words from the existing vocabulary; p, m, f learned from the page | Every tempo word and voice dynamic on the test set | Tempo words only; dynamics entered by the singer (N.177) |
| 6 | The singer's side | What Ilya asks and shows when unsure; both languages; the Guide's example | Dann's walk, both languages | n/a |
| 7 | Hardening | Degraded copies; more editions from IMSLP | No test-set song regresses | Named limits stated in the Guide |

**Order.** 0 first. Then 1, then 2. Phases 3 and 4 run side by side, since each needs only the geometry. Phase 5 follows 4. Phase 6 runs alongside from phase 2 on.

**Standing pivots.**

- **A gate missed twice on the same approach stops that approach.** The desk measures the cause and Fable rules a new one. No third pass.
- **If the whole reader is under its gates at the checkpoint, three options go to Dann:** move the date (his rulings of 2026-09-26 and 2026-09-27 say the date moves before the work shrinks); release with the scan read marked as a first draft the singer confirms; or evaluate an outside engine on a server, which raises a licence question (AGPL against Ilya's MIT) and the offline stance, both his to rule.
- **Lost work.** Every measurement is saved as a memo in the turn it is made. This plan and `STATE.md` are the handover.

## 6. Who does what

- **Dann:** rules on taste, the irreversible, and French; proofs each truth file; walks each phase.
- **Fable:** this plan; the design ruling at each gate; every pivot.
- **Opus, at the desk:** one brief per work package, in `BRIEF-TEMPLATE.md`'s form, measured on the desk first; `QUEUE.md` and `STATE.md` kept current; never a phase ahead of its gate.
- **Code:** builds and runs the gates on Dann's machine.
- **Sonnet agents:** truth drafts, counts, sweeps. Two at most, cost stated first.

## 7. Against the calendar

**Targets, not measurements. The size of each phase is NOT ESTABLISHED until phase 0 and the first pass of phase 1 are in.**

| Week | Target |
|---|---|
| 3, to Sunday 2026-10-04 | Phase 0; phase 1's brief in Code |
| 4, to 2026-10-11 | Phase 1 and 2 gates. **Checkpoint Friday 2026-10-09:** the numbers decide the pivots |
| 5, to 2026-10-18 | Phase 3 and 4 gates |
| 6, to 2026-10-25 | Phases 5 and 6; the Guide's example song |
| 7, to Friday 2026-10-30 | Phase 7; release, or the date moves |

**What this displaces (DESK DEFAULT, for Dann to overturn):** `QUEUE.md` rows 5 to 17 run only when Code is idle between this plan's briefs. N.84's walkthrough waits on phase 4, since its example song is this scan.

## 8. Rulings this plan needs from Dann, one at a time, in this order

1. Section 2: the outcome and its numbers.
2. The test set: which six songs.
3. May bar arithmetic decide a note's length, marked "deduced"? (A July 2026 ruling says checks only flag.)
4. How a read underlay and a typed poem reconcile (`OPEN.md`, N.135 addendum).
5. The two desk defaults in the held brief: the strip trace as the staff finder, and a tacet system emitting bars of rest.

## What could not be established

- The size of any phase.
- Whether the gates in section 2 are reachable by a classical reader on old engravings. Phase 0's outside-engine measurement is how we find the ceiling.
- Anything about degraded photocopies. Every page measured so far is a clean scan.
- LiederNet's terms for automated use. Not read. Use by hand for checking is the only use this plan assumes.
