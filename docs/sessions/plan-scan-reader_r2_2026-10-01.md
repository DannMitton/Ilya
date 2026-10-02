# Project plan: Ilya reads a printed song

**Draft r2, 2026-10-01 22:20. Written by the desk (Fable) at Dann's request (21:57):** *"define the problem to be solved, the desired outcome, and how we will get from Point A to Point B with responsible architecture, design, and code... an excellent plan hardwired with contingencies and intelligent pivots... in a way that Opus can follow your directions."*

**Status: a living draft.** It changes as measurements come in. Older decisions are defaults with reasons, not gates (`CONTRACT.md` tether 19, amended 2026-10-01 22:01). The singer's seat comes first (tether 22, amended the same minute). r1 ran in the reader's order and is superseded.

**Evidence:** `memo-fable-reader-audit-against-the-guide-model_r1_2026-10-01.md` and `brief-code-staves-traced-and-straightened_r1_2026-10-01.md` (held), both in this folder.

---

## 1. The problem (Point A)

**What the singer met, 2026-10-01.** Dann gave Ilya a clean public-domain scan: Tchaikovsky, Op. 38 No. 3, Jurgenson 1878, three pages. Ilya returned 4/4 for a printed 3/8, 5 measures, no words, a refusal of page 3, and a banner of counts ("47 notes, 7 rests, 5 measures", "Length assumed on 33 notes"). His words: *"insufficient and wrong"*, and *"A simple scan of a pdf must work reasonably well before a public release."*

**Why, as measured the same day (the audit memo):**

1. The reader loses the staves on a tilted page, and everything after depends on them.
2. Each later stage is tuned to computer renders in one modern font: barlines, rests, the metre, and rhythm all fall short on a real engraving.
3. The reader looks at the voice staff alone, so it cannot use what the rest of the system says.
4. It reads no text: no lyrics, tempo words, or dynamics.
5. It has no model of the page. Its output is a flat list of notes and measures, so there is nothing to check before the singer sees it.

## 2. The outcome (Point B), from the singer's seat

**Dann's words, 15:11 and 15:22:** *"Ilya processing a scan, extracting a melody with respectable accuracy, and seating Russian lyrics underneath their corresponding notes predictably"*, the melody being *"the metre, the barlines, the pitches, the rhythms, the rests, the dynamics, the tempo indications, and the pickup"*. Notation is data, not artwork. *"Guessing is not a modality for well-constructed software."* And at 22:01: the design is *"rooted in what is practical, elegant, and delightful for the user... ease in the GUI and minimal complexity that sometimes belies what's under the hood."*

**The experience (the desk's draft, offered 22:10; Dann, 22:06: "The plan you offered is good"):**

1. The singer drops a PDF or scan of a song onto Ilya. There is nothing to configure.
2. While Ilya reads, they see their own page and one plain sentence about what is happening.
3. Their melody appears in Ilya's engraving, with the Russian under the notes and the transcription ready. Tempo and dynamics are in place.
4. Where Ilya is sure, it says nothing. Where it is unsure, it shows the exact spot beside the same spot on their page, and one tap fixes it.
5. If something large is in doubt, such as which staff is the voice, Ilya asks one plain question with the page in view.
6. They never see counts, stages, or the reader's vocabulary.

**How we will know, as the project's private measure (proposed, not ruled).** The numbers exist to keep step 4 rare enough to feel like help and not homework.

- **The test set:** six printed songs from at least four publishers, each with a truth file proofed by Dann. Tchaikovsky Op. 38 No. 3 is the first. One is a degraded photocopy. IMSLP supplies the pages; a known public-domain poem text supplies a check on the words.
- **Structure:** every system, every staff, and every bar found, with the metre, the pickup, and bars of rest in place.
- **Notes:** 95 of every 100 right in pitch and in length.
- **Words:** 9 of every 10 syllables right and under the right note, and no confident false word (N.163).
- **Directives:** every tempo word and every voice dynamic on the page found and placed at its bar.
- **Honesty:** anything Ilya is unsure of is shown. Nothing is guessed silently.
- **Measured on the app's own path**, in the browser, not on the desk's shell.

**Already out of this release:** phone photographs of a score (Dann, 2026-09-24), MIDI (Dann, 2026-10-01), the piano's own notes.

## 3. Principles (the guide model, Dann and the desk, 2026-10-01)

1. **The staff is the ruler.** Trace it where its ink is, straighten the page, and each staff becomes a grid: up and down is pitch, left to right is order, and every mark gets coordinates in staff spaces.
2. **Rebuild the layers, most reliable ink first:** staves, systems, barlines, noteheads, then text.
3. **The signs of a system vote.** Left line, brace, barlines through the piano, a text line under the voice, one note at a time. One broken sign is outvoted, which is also how a photocopy's damage is told from an intended gap.
4. **The page teaches Ilya its own glyphs.** Take the page's own rest, digit, clef, and dynamic as the exemplar, not one modern font.
5. **Position says what a text is; language says whether it was read right.**
6. **Three states for every fact: read, deduced, unsure.** Unsure is shown, never hidden.
7. **Measure before building, and truth before measuring.**

## 4. Architecture

**The page model (Dann's "virtual midway step", 21:57).** Between the ink and the score sits one structure that holds what Ilya believes about the page before any of it becomes data:

- **page** → **systems** → **staves**, each with a role (voice, piano right, piano left, unknown) and its traced lines
- **bars**, aligned across the staves of their system
- **events** on the voice staff (notes, rests), and **text items** (lyric lines split into syllables; directives)
- every item carries its **state** (read, deduced, unsure) and its **evidence** (which signs agreed)

**The pipeline, in order:** straighten → structure (systems, roles, bars) → voice events → text → assemble the page model → sanity checks → convert.

**The sanity checks, run on the page model before anything is shown:** the same bar count on every staff of a system; each bar adds up to the metre; syllables balance notes, allowing for melismas; rejoined words are real words; clef and key agree from system to system.

**What stays.** The seam into the app: the read becomes MusicXML and enters through the existing ingest (`recognized-to-musicxml.ts`). `VocalLineEvent` does not change. Tempo and dynamics live in their own layer by measure and beat, and a piano dynamic arrives only as a suggestion marked "from the piano" (Dann, 2026-10-01 02:39, `OPEN.md`). The notehead finder, pitch arithmetic, accidental reader, beam reader, and the abstain path are kept.

**What is replaced or new.** Replaced: the staff finder. Rebuilt: barlines, rests, metre, rhythm. New: the page model, the checks, all text, and what the singer sees.

**Where it runs.** In the browser, on the pinned Pyodide. No trained model in the note reader (the reader's charter, 2026-07). Text uses the OCR Ilya already ships.

## 5. The phases, each with its gate and its pivot

A gate is a number measured on the test set, on the app's own path, or a ruling by Dann on something he can see. **No build phase starts until the gate before it is recorded in `STATE.md`.**

| # | Phase | Delivers | Gate | If the gate is missed |
|---|---|---|---|---|
| 0 | Truth | Truth files for the test set; the scorer; today's baseline; one outside engine measured at arm's length as a ceiling | Six truth files proofed; baseline table written | With fewer than six, start on what exists and add the rest as they are proofed |
| 1 | The experience, drawn | Drawings of section 2's six steps on the Tchaikovsky pages: the wait, the arrival, an unsure spot and its one-tap fix, the one plain question. Both languages | Dann rules on the drawings | Redraw; nothing downstream is built to a drawing he has not ruled |
| 2 | Geometry | Straightened page; systems; voice staff by vote; tacet; barlines by vote | Every staff, system, and bar on the test set | Ask the singer to mark the first system, and trace from it |
| 3 | Page model | The structure of section 4, the checks, and what feeds the drawings of phase 1 | Every known error in the test set shows as unsure; none is silent | Ship the checks that exist; the model can grow |
| 4 | Melody | Rests and digits from the page's own glyphs; note lengths from shape; the metre | 95 of 100 notes | Bar arithmetic decides where exactly one reading fits; what remains is shown unsure and fixed in Corrections |
| 5 | Words | Lyric line by position; OCR; pre-reform spelling; dictionary; syllables tied by order | 9 of 10 syllables; no confident false word | The known poem: the singer's pasted text, or a public-domain text, is aligned to the page, so OCR only has to match, not read |
| 6 | Directives | Tempo words from the existing vocabulary. Dynamics learned from the page as whole shapes: p, m, f, and the joined forms (pp, mp, mf, ff) where letters touch or share a stroke (Dann, 22:06) | Every tempo word and voice dynamic on the test set | Tempo words only; dynamics entered by the singer (N.177) |
| 7 | The experience, built | Phase 1's drawings made real, in both languages; the Guide's example | Dann's walk, both languages | n/a |
| 8 | Hardening | Degraded copies; more editions from IMSLP | No test-set song regresses | Named limits stated in the Guide |

**Order.** Phases 0 and 1 run side by side and first. Then 2, then 3. Phases 4 and 5 run side by side, since each needs only the geometry. Phase 6 follows 5. Phase 7 is built as phases 3 to 6 land.

**Standing pivots.**

- **A gate missed twice on the same approach stops that approach.** The desk measures the cause and Fable rules a new one. No third pass.
- **If the whole reader is under its gates at the checkpoint, three options go to Dann:** move the date (his words of 2026-09-26 and 2026-09-27: the date moves before the work shrinks); release with the scan read presented as a first draft the singer confirms; or evaluate an outside engine on a server, which raises a licence question (AGPL against Ilya's MIT) and the offline stance.
- **Lost work.** Every measurement is saved as a memo in the turn it is made. This plan and `STATE.md` are the handover.

## 6. Who does what

- **Dann:** rules on taste, the irreversible, and French; proofs each truth file; walks each phase.
- **Fable:** this plan; the design at each gate; every pivot.
- **Opus, at the desk:** one brief per work package, in `BRIEF-TEMPLATE.md`'s form, measured on the desk first; `QUEUE.md` and `STATE.md` kept current; never a build phase ahead of its gate.
- **Code:** builds and runs the gates on Dann's machine.
- **Sonnet agents:** truth drafts, counts, sweeps. Two at most, cost stated first.

## 7. Against the calendar

**Targets, not measurements. The size of each phase is NOT ESTABLISHED until phase 0 and the first pass of phase 2 are in.**

| Week | Target |
|---|---|
| 3, to Sunday 2026-10-04 | Phases 0 and 1; phase 2's brief in Code |
| 4, to 2026-10-11 | Phase 2 and 3 gates. **Checkpoint Friday 2026-10-09:** the numbers decide the pivots |
| 5, to 2026-10-18 | Phase 4 and 5 gates |
| 6, to 2026-10-25 | Phases 6 and 7; the Guide's example song |
| 7, to Friday 2026-10-30 | Phase 8; release, or the date moves |

**What this displaces (DESK DEFAULT, for Dann to overturn):** `QUEUE.md` rows 5 to 17 run only when Code is idle between this plan's briefs. N.84's walkthrough waits on phase 5, since its example song is this scan.

## 8. Departures from older decisions, taken as defaults

Each is one line, with its reason. None waits on a ruling; Dann waves off any he dislikes.

1. **A strip trace becomes the staff finder for scans.** Departs from E.60 (about 2026-08-19, re-affirmed 2026-08-24), which kept strip methods as a fallback. Reason: measured on twelve scan pages, 2026-10-01.
2. **A tacet system emits bars of rest for the voice.** Departs from "the reader never invents an unprinted rest" (2026-07-27). Reason: Dann, 2026-10-01 16:08. The old line's reason, never guess silently, is kept: the bars are marked deduced.
3. **Bar arithmetic may decide a note's length, marked deduced.** Departs from "validators flag, humans fix" (2026-07). Reason: where exactly one reading makes the bar add up, that is evidence, not a guess. The old line's reason is kept the same way.

## 9. What is Dann's to decide (taste), each brought with a proposal when its phase arrives

- The experience in section 2, and the drawings of phase 1.
- Which six songs make the test set.
- How a read underlay and a typed poem reconcile for the singer (`OPEN.md`, N.135 addendum).

## What could not be established

- The size of any phase.
- Whether the gates in section 2 are reachable by a classical reader on old engravings. Phase 0's outside-engine measurement is how we find the ceiling.
- Anything about degraded photocopies. Every page measured so far is a clean scan.
- LiederNet's terms for automated use. Not read. Checking by hand is the only use this plan assumes.
