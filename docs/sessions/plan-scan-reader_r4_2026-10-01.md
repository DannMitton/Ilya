# Project plan: Ilya reads a printed song

**Draft r4, 2026-10-01 23:30. Written by the desk (Fable) at Dann's request (21:57, and "a final revision", 23:18).**

**Status: a living draft.** It changes as measurements come in. Older decisions are defaults with reasons, not gates. The singer's seat comes first. (`CONTRACT.md` tethers 19 and 22, amended 2026-10-01 22:01.)

**What changed from r3:**

- The code was read firsthand (`memo-fable-code-reading_r1_2026-10-01.md`). Most of what follows the reader is already built for score files.
- **Words are scan first** (Dann, 22:47), and **a complete score is enough; the poem is optional** (Dann, 23:06).
- **Read once, keep both the scan and the reading** (Dann, 23:18).
- **Tempo text, dynamics, and hairpins are essential new work** in the data, the parser, and the drawing (Dann, 23:06).
- **Line breaks are restored** in a poem filled from a score (Dann, 23:06 and 23:18).
- The existing scorer is changed to fit the measure (Dann, 23:06).

**Evidence:** `memo-fable-code-reading_r1_2026-10-01.md`, `memo-fable-reader-audit-against-the-guide-model_r1_2026-10-01.md`, `memo-fable-independent-critique-of-plan-r2_r1_2026-10-01.md`, `precis-rebelo-2012_r1_2026-10-01.md`, and `brief-code-staves-traced-and-straightened_r2_2026-10-01.md` (held until Dann agrees).

---

## 1. The problem (Point A)

**What the singer met, 2026-10-01.** Dann gave Ilya a clean public-domain scan: Tchaikovsky, Op. 38 No. 3, Jurgenson 1878, three pages. Ilya returned 4/4 for a printed 3/8, 5 measures, no words, a refusal of page 3, and a banner of counts. His words: *"insufficient and wrong"*, and *"A simple scan of a pdf must work reasonably well before a public release."*

**Why, as measured the same day:**

1. The reader loses the staves on a tilted page, and everything after depends on them.
2. Each later stage is tuned to computer renders in one modern font.
3. The reader looks at the voice staff alone.
4. It reads no text, and what it hands the app has no place for a word, a tie, a tempo, or a dynamic (`apps/web/src/lib/reader/recognized.ts:29-70`).
5. It has no model of the page, and no way to tell the singer which note it doubts.
6. It decides early and by yes or no.
7. The scan is read again on every reopening, so the wait recurs and a singer's corrections can lose their place when the reader changes (`apps/web/src/lib/score/correction.ts:8-18`).
8. Ilya has no dynamics or hairpins anywhere, and draws no tempo text on Markup.

## 2. The outcome (Point B), from the singer's seat

**Ruled by Dann, 2026-10-01 22:22:** *"Yes, you have effectively captured the experience you want Ilya to give a singer."* Step 3 is in his words.

1. The singer drops a PDF or scan of a song onto Ilya. **The score is enough. No poem is asked for** (Dann, 23:06). If the file holds several songs, Ilya asks which one, with the pages in view.
2. While Ilya reads, they see their own page and one plain sentence about what is happening.
3. *"Their melody appears in Ilya's Markup tab, with the Russian syllables under their corresponding notes (see Gould for common practice on seating syllables under notation)and the transcription is ready in the Text tab. Tempo and dynamics are in place above the extracted melody featured in Markup."* (Dann, verbatim.) The poem in Text stands in its lines.
4. Where Ilya is sure, it says nothing. Where it is unsure, it shows the exact spot beside the same spot on their page, and one tap fixes it. For a word, the tap offers Ilya's likely readings and a place to type. *"Legitimate misreads and errors should be able to be manually edited painlessly and easily by the user."* (Dann, 23:18.)
5. If something large is in doubt, such as which staff is the voice, Ilya asks one plain question with the page in view.
6. They never see counts, stages, or the reader's vocabulary.
7. **The song reopens at once, the same on every device**, with their corrections where they left them (Dann, 23:18).

**The measure. Ruled by Dann 22:22:** **95 of every 100 notes right in pitch and length, and 9 of every 10 syllables right and under the right note.** Around those two:

- **Per song, not pooled.**
- **Structure:** staves and systems all found on clean scans; at least 98 of 100 bars.
- **Unsure spots:** at least 9 of 10 real errors are shown as unsure, and false alarms per page stay under a limit set in phase 1.
- **No confident non-word.** A misread that lands on a real word is counted and reported (section 9, item 7).
- **The first read's wait and memory** stay within limits set from phase 0's baseline.
- **Measured on the app's own path**, in the browser.

**Out of this release already:** phone photographs of a score (Dann, 2026-09-24), MIDI (Dann, 2026-10-01), the piano's own notes. **DESK DEFAULTS, new in r4:** where verses are stacked under the notes, verse 1 only (the app shows only verse 1 today, `packages/score-parser/src/types.ts:666`); where two languages are printed under the voice, the Cyrillic line. The second line is located, so its small notes and dotted slurs are not read into the Russian melody (Gould r45 to r48, pp. 449-451), and it is left unread. The scan is kept, so a later reader can return for it. Dann, 23:31: a German underlay served the publisher's German clients, and *"We aren't those clients."*

## 3. Principles

1. **The staff is the ruler.** Trace it, straighten the page, and each staff becomes a grid.
2. **One size, one witness.** Every page is resized to one staff size before reading. The untouched scan stays underneath; cleaning is done on purpose-made copies and sized from the staff.
3. **Rebuild the layers, most reliable ink first:** staves, systems, barlines, noteheads, then text.
4. **The signs of a system vote.** Left line, brace, barlines through the piano, a text line under the voice, one note at a time.
5. **Decide late, by likeness and by sense (Dann, 22:27).** A candidate carries a likelihood. The page's marks are grouped by likeness, each group is named once, and the bar and the system decide.
5a. **Gould bounds the likeness (Dann, 22:41).** Each likelihood is scored against the engraver's dimensions in staff spaces (`memo-gould-dimensional-priors_r1_2026-08-24.md`). A Gould prior bounds a dimension and never decides a meaning. Her numbers are tested on the 1878 pages in phase 0 before any is trusted.
6. **The page teaches Ilya its own glyphs,** seeded from the four music fonts in the tree. The same holds for letters: a letter shape the reading model cannot name is named by which reading makes its words real.
7. **Position says what a text is; language says whether it was read right.**
8. **Three states for every fact: read, deduced, unsure.**
9. **Truth before measuring, measuring before building, and no new fixed number without a check on songs the builders have not seen.**
10. **The score witnesses for itself (Dann, 23:06).** The dictionary, the count of notes over a word, the same word and the same letter shapes elsewhere on the page, and the poem's metre and rhyme are four witnesses inside one score. A poem the singer supplies is a fifth, welcome and never required.
11. **Read once, keep both (Dann, 23:18).** The scan and the reading are both stored.

## 4. Architecture

**The page model.** One structure holds what Ilya believes about the page before any of it becomes data:

- **page** → **systems** → **staves**, each with a role and its traced lines
- **bars**, aligned across the staves of their system
- **events** on the voice staff: notes, rests, ties, and slurs
- **text items:** syllables with their hyphens and extenders; tempo words; dynamics; hairpins
- every item carries its **state**, its **evidence**, and **its box on the scan**

**The note cell is the squircle (Dann, 2026-10-02 01:51).** He asked whether the loupe's squircle, which may bisect a beam, serves the scan reader. Its code does not transfer: it measures Ilya's own drawing, where every mark is already tagged with the note that owns it (`apps/web/src/lib/score/selection-ring.ts:165-189`). Its grammar does, in two places. First, as the page model's unit: a note's own ink is its head, accidental, dot, and own stem; its cell runs from one staff space above the staff to the baseline of the text under it and is as wide as that ink and its syllable; a beam is shared ink that the cell cuts across (`selection-ring.ts:275-343`, ruled by Dann 2026-09-14, 2026-09-15, and 2026-09-20). On a scan that cell is the vertical guide that ties a syllable to its note. Second, as the mark for step 4 of the experience: the box stored for each note on the scan is this cell, so the singer sees the same shape on Markup and on their own page. **An ossia is one event with an alternative (Dann, 2026-10-02 01:53).** Two heads on one stem of a vocal line, one often smaller, are a choice of pitch and never two notes. The page model holds the alternative on the event; the larger head is the one sung, ruled by Dann at 01:55 (*"The user should be decisive about which note they are going to sing; ILya isn't equipped to handle two values at a time"*). Ilya carries one pitch for the note. A singer who sings the other changes the note in Corrections, as for any note; the alternative is kept in the reading's record so that a later Ilya can offer it. **Two heads of the same size are shown and flagged (Dann, 01:57):** *"I feel like Ilya can reproduce two notes of the same size? But this construct should be flagged for user intervention: the user should have control over selecting which possiblity they prefer, or deleting the other option."* The desk's design, a DESK DEFAULT: the reading's record holds both pitches against the note's id; Markup draws the second head from that record, the way it already draws the singer's words from a map keyed by note (`packages/score-parser/src/staff-renderer.ts:217-330`), so `VocalLineEvent` still holds one pitch; the note carries the unsure mark; in the loupe the singer keeps one and the other goes, which is a pitch correction and a dismissal in the existing correction diff (`apps/web/src/lib/score/correction.ts:48-100`). Until the singer chooses, the analysis counts the upper note. This is the page-model brief's work and phase 1 draws it. Today the reader would make two notes in a row of it and shift every later syllable (`tools/e16-harness/reader/run_page2.py:463-469`). Row 20's brief keeps the alternative and emits one note.

**The seam grows.** What the reader hands the app gains syllables (text and place in the word), ties, tempo words, dynamics, and hairpins. The app's parser already reads the first three from a score file (`packages/score-parser/src/musicxml-parser.ts:800-814`, `:769-779`, `:501`).

**The stored reading.** A song read from a scan keeps two things: the scan, byte for byte, and the reading (the score, each fact's state, and each fact's box on the scan), stamped with the reader's version. Reopening loads the reading. A newer reader re-reads silently when the song has no hand work on it, and otherwise offers the singer the choice. Corrections stay a diff keyed by note, as today (`correction.ts:48-100`). The field is added to the song record the way `seatedText` and `transposition` were, optional and additive (`apps/web/src/lib/library/types.ts:104-127`). "Unsure" reaches the page as one more set keyed by note beside `withheldIpa` (`packages/score-parser/src/staff-renderer.ts:269`).

**The pipeline:** resize and straighten → structure → voice events → text → assemble the page model → checks → convert → store.

**The checks:** the same bar count on every staff of a system; each bar adds up to the metre; syllables balance notes, allowing for melismas and ties; rejoined words are real words; clef and key agree from system to system. A check may decide only where exactly one reading satisfies it and no fact in that bar is unsure; the result is marked deduced.

**The metre is auditioned (Dann, 2026-10-02 01:06).** His words, transcribed as written: *"there should be a combination of likely Araabic numbers (1 through 9) to audition, plus the simple arithmetic of the contents of a confirmed bar to weigh against that audition as a sanity check."* The desk's refinements, put to him at 01:07: the candidates are whole metres, with C and ¢ among them, since the lower number can only be 2, 4, 8, or 16 and the upper can be 12; the signature is read on all three staves of the first system and the readings are compared; the arithmetic rests on bars whose contents are all confidently read, and takes what most of them agree on; and the arithmetic gives a bar's length, never its metre, so 4/4 against 2/2 and 3/4 against 6/8 are chosen by the printed sign, and are unsure when the sign cannot be read. **Corrected by the desk at 01:20:** the desk first named the piano's beaming as a second witness here. The project's own verified reading of Gould says otherwise for this repertoire: music of the Classical and Romantic periods often beams 3/4 as if it were 6/8 (p. 153), and old vocal engraving flags each syllable (rule 68, p. 435), so beaming is a weak hint and never a decider. Dann, 2026-10-02 01:18, confirming and adding the reverse case: such music *"can also beam passages of 6/8 as if it is 3/4 to highlight hemiola."* A passage beamed against its metre is therefore expression, and Ilya never reads a change of metre from beaming (`claude/opus-brief-to-fable-e16-front3a-spec_2026-07-27.md`, in project knowledge). Measured the same night: the reader scored the upper digit of the printed 3/8 as 9 at 0.482 and 3 at 0.395 and took 9/8 (`report-code-staves-traced-and-straightened_r1_2026-10-01.md`, item 4), while every sung bar of the song holds three eighths' worth. **Common metres weigh more (Dann, 01:12):** the upper number is most often 2, 3, 4, 6, 9, or 12 and the lower 2, 4, 8, or 16. The reader already refuses any lower number outside that set and allows any upper number from 1 to 15 with no preference (`tools/e16-harness/reader/timesig.py:581-582`). The desk's refinement: the common values are a weight in the audition and never a filter, because Russian song does use 5 and 7 above, and the arithmetic outranks the weight. **What a metre means is already in Ilya twice, and the two disagree on 3/8.** The app follows Dann's ruling of 2026-09-08: a numerator that is a multiple of 3 over 8 or 16 is compound, the beat is the dotted note, and 3/8 holds one beat (`apps/web/src/lib/score/entry.ts:483-503`). The reader encodes Gould's Table 1 (p. 155) and calls 2, 3, and 4 simple and 6, 9, 12, and 15 compound, so it gives 3/8 three beats (`tools/e16-harness/reader/metre.py`). The reader's classification does not reach the app today, because the converter passes only the two numbers (`apps/web/src/lib/score/ingestion/recognized-to-musicxml.ts:244-263`). The metre brief makes them one rule, Dann's.

**The words are scan first (Dann, 22:47).**

1. **Find.** The lyric line sits at a level baseline under the voice staff (Gould r1, p. 439). Each syllable is tied to the note it sits under (r4, r5).
2. **Sew.** A raised hyphen joins a syllable to the next; a baseline extender marks a held syllable (r26, r34, r39, pp. 447-448). These give each syllable its place in its word, which is what the app already rejoins words from (`apps/web/src/lib/score/vowel-resolver.ts:199`). Where an edition prints no space between words (Jurgenson: «вътре-во-гѣмірс-кой»), the dictionary divides the run, and the notes above bound how many vowels each piece may hold.
3. **Check.** Each word goes through the Transcription pipeline, which modernises pre-reform spelling when the dictionary agrees, restores ё, and abstains honestly (`apps/web/src/lib/pipeline.ts:266`, `:544-571`).
4. **Recover (Dann's vowel checker, 23:06).** A word the dictionary does not know, or whose vowels do not match its notes, is retried: letters are swapped along the confusions this print shows, vowels and consonants both, keeping only candidates with the right count of vowels that the dictionary knows. Exactly one candidate: the word is deduced. Several or none: the word is unsure, and the candidates are the choices the singer is offered. This is the ё rule generalised (`packages/phonology/src/engine.ts:747-767`). Old prints have 13 vowel letters, not 10.
5. **Seat.** The app's existing path fills the poem, transcribes it, and seats each word under its notes (`apps/web/src/routes/+page.svelte:3259-3263`, `apps/web/src/lib/score/score-seat.ts:78`).

**The poem, when the singer has one,** is aligned to the scan's words and confirms or corrects them. The comparison is the designed and unbuilt half of `apps/web/src/lib/score/reconciliation/`; the nearest built aligner is `planHeal` (`apps/web/src/lib/score/heal.ts:147`). A composer's changes to the poem are differences to show, never errors to fix.

**Lines restored.** A poem filled from a score arrives as one line (`vowel-resolver.ts:300`), from a file or a scan alike. Ilya restores the lines: punctuation proposes a line end ("in many cases punctuation will signal a line break. Enjambement happens, but it is comparatively rare", Dann, 23:18), a rest in the voice supports it, and metre and rhyme decide, from the stress and the IPA Ilya already holds for every word. Where they do not agree, the line is left unbroken. This matters to the sound as well as the reading: Ilya ends a line with a hard boundary and joins unpunctuated words softly (`engine.ts:2005-2022`).

**The marks.** Tempo text, dynamics, and hairpins get a place in the data, a branch in the parser, and a drawing above the voice (Gould r73, p. 434; r183, p. 520). They live in their own layer; a piano dynamic arrives only as a suggestion marked "from the piano" (Dann, 02:39; `OPEN.md` N.120, N.177, N.178). This is built and walked on score files first, which already carry these marks, and the scan reader feeds the same layer later.

**What stays.** The seam's shape (the read becomes MusicXML through the existing ingest). `VocalLineEvent`. The notehead finder, pitch arithmetic, accidental reader, beam reader, and abstain path. The clef and key confirmed by the singer before the read.

**Where it runs.** In the browser, on the pinned Pyodide. The note reader uses no trained model. Text uses the reading model Ilya already ships, which lacks ѣ, і, ѳ, and ѵ (unpacked 2026-10-01); `orus` is tested in phase 6, and training our own additions is held in reserve.

## 5. The phases

A gate is a number measured on the test set, on the app's own path, or Dann's ruling on something he can see.

**Track A: the reader.**

| # | Phase | Delivers | Gate | If the gate is missed |
|---|---|---|---|---|
| 0 | Foundations | Six songs: three to build on, three held back. Truth files proofed by Dann. The existing scorer made exact: pitch and written length per note, matched in order, syllables by text and note (`tools/e16-harness/src/scorer.ts`, `ground-truth.ts`). A harness on the app's own path. Today's baseline, with read time. Audiveris and one permissively licensed engine as a ceiling. The stored reading defined. Page resizing. Gould's numbers and the four fonts tested on the Tchaikovsky pages. | Baseline table written for three songs | Start with the songs that are ready |
| 1 | The experience, drawn | Section 2's seven steps drawn on the Tchaikovsky pages, in both languages, including the fix of a word and of a note | Dann rules on the drawings | Redraw |
| 2 | Geometry | Straightened page; staves; systems; voice staff by vote; tacet; barlines by vote | Staves and systems all found; 98 of 100 bars | Staff lines as shortest dark paths (Cardoso et al. 2009; primary to be read). Failing that, the singer marks the first system |
| 3 | Page model and stored reading | The structure, the checks, the reading stored with the song, and "unsure" carried through to Markup | 9 of 10 known errors shown unsure; false alarms under phase 1's limit; a reopened song is identical | Ship the checks that exist |
| 4 | Rests, bars of rest, metre | The page's own glyph groups, named from the four fonts | Per song: rests and metre right in 95 of 100 bars | The singer confirms the metre, as for clef and key today |
| 5 | Note lengths, ties, slurs | Flags, beams, and dots read from shape; ties and slurs; bar arithmetic as evidence | 95 of 100 notes, per song | What remains is shown unsure and fixed in Corrections |
| 6 | Words | Find, sew, check, recover, seat (section 4); `orus` tested; the poem as second witness | 9 of 10 syllables, per song; no confident non-word | The singer is offered the poem box for the words Ilya could not settle |
| 7 | Marks from the scan | Tempo words; dynamics as whole shapes, joined forms included (Dann, 22:06); hairpins; all into track B's layer | 9 of 10 tempo words and voice dynamics | Tempo words; the singer enters dynamics (N.177) |
| 8 | The experience, built | Phase 1's drawings made real, in both languages; the Guide's example | Dann's walk | n/a |
| 9 | Hardening | Degraded copies; more editions from IMSLP | The held-back songs meet the measure | Named limits in the Guide |

**Track B: built on score files, beside the reader, needing nothing from it.**

| # | Phase | Delivers | Gate |
|---|---|---|---|
| B1 | The marks, drawn | Tempo text, dynamics, and hairpins in the data, the parser, and Markup, walked on Dann's Finale and MusicXML files | Dann's walk |
| B2 | Lines restored | Line breaks restored in a poem filled from a score | Measured on public-domain poems with their line breaks removed; the target is set from the first measurement and brought to Dann |

**Order.** Phases 0 and 1 first, side by side. Then 2, then 3. Phase 4 before 5. Phase 6 can start once phase 2 has placed the noteheads. Phase 7 follows 6 and B1. Phase 8 is built as 3 to 7 land. B1 can start at once. B2 follows phase 6, since its metre and rhyme also serve phase 6's checks.

**Standing pivots.**

- **A gate missed twice on the same approach stops that approach.** The desk measures the cause and Fable designs another.
- **At the checkpoint, Friday 2026-10-09, the numbers go to Dann with three options** if the reader is short: the date moves; the scan read is released as a first draft the singer confirms; or an outside engine is evaluated, which raises a licence question and the offline stance.
- **Lost work.** Every measurement is saved as a memo in the turn it is made.

## 6. What an outside reviewer forecast for 2026-10-30

From the independent critique of r2, written before words became scan first:

- **Likely:** every staff, system, and voice staff on clean scans; most barlines; pitch near 85 to 90 of 100; tempo words; words seated from a pasted poem.
- **Possible:** note lengths good enough that unsure spots feel like help.
- **Not believable:** the full measure across six editions; 9 of 10 syllables from cold reading; every dynamic; degraded copies; the whole bilingual experience and the Guide.

The outcome in section 2 does not shrink to fit this. The date moves before the work does. Whether the recover step lifts cold reading to 9 of 10 is the first thing phase 6 measures.

## 7. Who does what

- **Dann:** rules on taste, the irreversible, and French; proofs each truth file; walks each phase.
- **Fable:** this plan; the design at each gate; every pivot.
- **Opus, at the desk:** one brief per work package, in `BRIEF-TEMPLATE.md`'s form, measured first; `QUEUE.md` and `STATE.md` kept current.
- **Code:** builds and runs the gates on Dann's machine.
- **Sonnet agents:** truth drafts, counts, sweeps. Two at most, cost stated first.

## 8. Against the calendar

**Targets, not measurements. Phase sizes are NOT ESTABLISHED.**

| Week | Track A | Track B |
|---|---|---|
| 3, to Sunday 2026-10-04 | Phases 0 and 1; phase 2's brief in Code | B1's brief written |
| 4, to 2026-10-11 | Phases 2 and 3. **Checkpoint Friday 2026-10-09** | B1 |
| 5, to 2026-10-18 | Phases 4 and 6 | B1 walked |
| 6, to 2026-10-25 | Phases 5 and 7 | B2 |
| 7, to Friday 2026-10-30 | Phases 8 and 9, or the date moves | |

**What this displaces (DESK DEFAULT):** `QUEUE.md` rows 5 to 17 run only when Code is idle between this plan's briefs. N.84's walkthrough waits on phase 6.

## 9. Departures from older decisions, taken as defaults

1. **A strip trace becomes the staff finder for scans.** Departs from E.60 (about 2026-08-19). Reason: measured on twelve scan pages.
2. **A tacet system emits bars of rest.** Departs from "the reader never invents an unprinted rest" (2026-07-27). Reason: Dann, 16:08. The app already draws such bars as one rest with a count (`staff-renderer.ts:800-835`).
3. **Bar arithmetic may decide a note's length, marked deduced.** Departs from "validators flag, humans fix" (2026-07).
4. **Unsure spots are shown to the singer.** Departs from E.47. Its reason is kept: the gate limits false alarms.
5. **The reading is stored.** Departs from "do not store anything derived" (`CONTRACT.md` §6) and the `.musx` precedent quoted at `apps/web/src/lib/reader/page-pdf.ts:21-24`. Reason: a scan read is slow and inexact where a file conversion is neither, and the scan is kept, so nothing is frozen. Ruled by Dann, 23:18.
6. **Words are scan first.** Departs from r3, which was poem first. Reason: Dann, 22:47, and the code, where the scan-first path is nearly wired and the poem path is the unbuilt one.
7. **"No confident false word" (N.163) becomes "no confident non-word".** Reason: with the score alone, a misread that makes a real word of the right length, stress, and rhyme cannot be caught. Its rate is measured in phase 6 and brought to Dann.

## 10. What is Dann's to decide (taste), each brought with a proposal when its phase arrives

- The drawings of phase 1, and the limit on false alarms.
- Which six songs, and which three are held back.
- Whether to ask Emily Ezust about LiederNet texts for testing (below).

## Truth for words and lines: LiederNet, seen 2026-10-01

Visited at Dann's request, in his browser: the home page, the copyright notice, the FAQ, the Tchaikovsky index, and one text page.

- **Structure.** Indexes by composer (21,193) and by text author (21,331); searches by surname, title or first line, year, and collection. A text page is addressed by a text and, when reached from a composer, a setting.
- **A text page holds** the text in its lines and stanzas; a label when it is the sung text for a setting, with a link to the poet's original; the language; translations; transliterations; the composer, opus, and year; the poet and first publication; and a line count and word count. For Tchaikovsky Op. 38 No. 3: 20 lines, 96 words.
- **Sung text and poem are kept apart,** with differences footnoted where known. That is the distinction section 4 needs.
- **The Russian is in modern spelling with ё.** It is truth for the modern reading, not for pre-reform letters.
- **Terms.** The database and pages are copyright; many texts are public domain in Canada and the United States; copyright texts may not be reproduced without permission (copyright notice, last updated 2015-12-04). `robots.txt` bars site-copying tools and one AI crawler outright, and bars the search pages to all robots.
- **So:** a handful of pages consulted by hand for our own test songs is ordinary use. Anything in bulk is Emily's to grant.

## What could not be established

- The size of any phase.
- Whether the measure is reachable by this reader on old engravings. Phase 0's outside engines give the ceiling.
- How many misread syllables the recover step settles, and how often a misread lands on a real word.
- How long a three-page read with words takes in the app.
- Whether the app's converter reads Finale's older `.mus` files, which some of Dann's truth songs are in.
- Anything about degraded photocopies. The field reports failure there (`precis-rebelo-2012`, row 031).
- Whether the four fonts' shapes are close enough to an 1878 plate to seed the page's groups.
- The published work on automatic scansion and line recovery. Not read.
