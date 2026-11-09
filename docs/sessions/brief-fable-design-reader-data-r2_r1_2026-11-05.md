# Brief: design r2, putting the readers' discarded data to work across Ilya (Fable, design author, r1, 2026-11-05)

Written by the desk (Opus) at Dann's request (2026-11-05 12:08 to 12:10). You are the design's author. A second Fable agent, who has not seen your work, reviews it afterwards; then the desk checks it against Dann's rulings and the code; then Sonnet measures each idea in your order. Nothing is built on your word alone. **NOT ESTABLISHED beats a complete invented answer.** Every claim about code carries a file and line you read in this session.

## What Dann wants

Two things, in his words of 12:08 and 12:10: miss no opportunity to enhance what Ilya does with the information its two readers already return; and work out the implications of wiring that information into the parts of Ilya that could benefit, not only the seating of lyrics.

## Set-up

`git clone --filter=blob:none https://github.com/DannMitton/ilya /root/cr2/ilya`; fetch `Shane` (`2e3803da`) and `cloud-lane-34` (`05db2dac`, row 181, not merged; read the scan path there). Work only under `/root/cr2/`. No commit, no push.

## Read in full first

- The inventory of what the readers return and what Ilya keeps: `docs/sessions/report-desk-reader-outputs-inventory_r1_2026-11-05.md` (on the desk's disk; a copy is at `/root/c181/inventory.md`). 24 kinds from the words reader (tesseract.js), Ilya keeps 1; 35 from the notes reader (homr), no confidence at all.
- Where seats are lost on row 114 f1 (590 printed syllables): `/root/c181/prev/ledger-armS.tsv` (one row per syllable, with `stage_lost`) and the desk's grouping: of arm S's 205 losses, 120 are notes with no syllable, 92 of them in 26 runs between two garbled words.
- Today's measures: `/root/c181/report-desk-row181-longdash-dict_r1_2026-11-05.md`; the night's `docs/sessions/report-desk-row181-b0_r1_2026-11-05.md`, `report-desk-row181-c-drop_r1_2026-11-05.md`, `report-desk-row181-read-as-matching-feasibility_r1_2026-11-04.md`, `design-desk-poem-reads-the-letters_r1_2026-11-05.md` and its review `review-fable-design-poem-reads-the-letters_r1_2026-11-05.md` (all on `Shane` at `2e3803da`).
- Dann's rulings that bind any design, on `Shane`: `docs/memory/CONTRACT.md` §0 (a claim about code carries a line read), §0.1 (one vowel per note, no exceptions), §0.2 (positions from evidence, never an arbitrary rule), §1 items 13 and 22 (the need; design from the singer's position), §6 (the page is never wrong), §8 (no mark on the page to say Ilya is unsure: a mark that appears on everything says nothing; no control on the page); `docs/memory/OPEN.md` last sections from "JOINING POEM TO LYRICS ON A SCAN" to the end (Lyrics wins a real-word disagreement; the poem fills only where the count settles, never a guess; the note takes a vowel; grace notes take no syllable; Lyrics in modern letters); `docs/memory/PRODUCT.md` (what Ilya is for).

## Two principles that shape every proposal (Dann 2026-11-05 12:11)

1. **The singer's experience comes first, and what she touches stays simple and elegant.** Start every proposal from what the singer does, sees, and feels, and derive the technical work from that (`CONTRACT.md` §3, tether 22; 2026-09-10, 2026-10-01). Reader data mostly works out of sight: it should make Ilya's output right more often, and ask less of her, not add controls, numbers, or notices. Anything she reads speaks a musician's terms (a bar, a syllable, your score), never the machine's (a confidence, a token, a reading). If an idea needs a new control or message, say why the singer is better off with it than without, and keep it to the fewest words and taps.
2. **Inside, the work fits Ilya's modular design and is commented for the next developer.** Each integration lives in the module that owns its concern (`ARCHITECTURE.md`; the scan path in `apps/web/src/lib/omr/`, the poem join in `text/`, the score in `score/`), as pure functions where it can, with no new logic in `routes/+page.svelte`. Say for each proposal which module it belongs in and what crosses a module boundary. Every check and every threshold carries a comment that says what it checks, why, what follows when it fails, and how it relates to the rest (Dann 2026-11-01, the rule for newcomers; 2026-11-04 10:36, recursive checks commented for future coders); a threshold set by measurement names the measure. Propose the comments' substance, not boilerplate.

## The work

1. **Every discarded or unprobed item, matched.** For each item in the inventory that Ilya does not use (and the unprobed W25 to W32 and N36), say what it could tell Ilya, and where.
2. **Across Ilya, not only seating.** For each part of Ilya that could use reader data, say what changes for the singer. At least consider: the row's Russian test (`omr/underlay-language.ts`); the second look and which look is kept; the poem join's tiers, repairs, and fills (`text/poem-join.ts`, `poem-join-wire.ts`); the banner of bars to check and the LOUPE with its print strip (OPEN.md JOINING items 8 to 15); Corrections' bars to confirm (`score/bars-to-confirm.ts`) and offers; grace notes, chords, and a second voice (N.187, N.191); piano-only systems (N.189); tempo words and dynamics from scans (N.177, N.178); pre-reform letters (N.184); and anything else you find. Read each part's code before you write about it.
3. **Implications, both ways.** For each integration: what it improves, what it could break or make worse for the singer, what it costs (size, time per page, complexity), and which ruling it touches. Where an idea would show the singer Ilya's uncertainty, say how it respects CONTRACT.md §8, or drop it.
4. **Order by evidence.** Rank the ideas by expected seats or singer-visible benefit per unit of work, and give each one **the measure that decides it**: arm, data, control, the count it must beat. Ideas that need no measure (a ruled change) are marked so.

## Output

`/root/cr2/design-fable-reader-data-r2_r1_2026-11-05.md`: a one-paragraph summary first; then a table (item or integration, where in Ilya, what the singer gains, risk, cost, deciding measure, rank); then a section per integration in rank order; then what you could not establish; then your token total. If your Write tool refuses, write it with bash. Stop at 220,000 tokens and write what you have. Reply with three lines: the top three ideas with their deciding measures, the count of ideas, the report path.

## Also read (added 12:3x)

`/root/c181/review-fable-two-briefs_r1_2026-11-05.md`, Brief B section: a Fable review of the desk's arm W design. Its points bind your design too: an anchor is a `pair` alignment or a dictionary-passing word, never a bare `gap`; never overwrite a word the singer placed; a count test is a coincidence against homr's note count unless the ink agrees; every fill reports filled-right and filled-wrong; and its B7, that the desk's grouping of the 120 unseated syllables is not reproduced and the join's own `OfferWhy` per run must be dumped before an arm is chosen. The arm L measure (the Russian test on both readings) may report while you work: `/root/c181/report-desk-row181-language-both-readings_r1_2026-11-05.md`.
