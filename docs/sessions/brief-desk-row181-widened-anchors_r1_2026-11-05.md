# Brief: row 181, the poem fills from the nearest aligned words, one arm on row 114 f1 (Sonnet helper, r1, 2026-11-05)

Measure only. Keep nothing in any repository: no commit, no push. NOT ESTABLISHED beats a complete invented answer.

## The question

On row 114 f1, arm S (`cloud-lane-34` `05db2dac` with the long dash split) loses 205 of 590 exact seats (b); 120 of those are notes with no syllable at all (`/root/c181/prev/ledger-armS.tsv`, `seated_cut_on_that_note` empty). The desk grouped them by the Ilya words on either side: 92 syllables in 26 runs sit **between two different Ilya words**, 19 in 14 runs **inside one Ilya word**, 9 at an edge. Several runs are whole phrases (15, 11, 9 syllables), and their neighbours are garbled words («рамгно», «достьвень», «екадайте»).

The join does not fill them. In `apps/web/src/lib/text/poem-join.ts:277-299` a run is filled only when both neighbouring LYRICS words are aligned to the poem (`result.aligned`); a garbled neighbour is not aligned, so the run is offered as `unanchored` (`:282-285`). The 77 offers on the tip were inside-word 25, unanchored 23, count 21, other 8 (`docs/sessions/report-desk-row181-b0_r1_2026-11-05.md`).

## The rule (arm W), the desk's design

Widen each run to the nearest aligned words:

1. From a run's left neighbour, step left over LYRICS words that are not aligned to the poem, to the first aligned word `A`. Do the same rightward to `B`. The stretch is every note between `A`'s last note and `B`'s first note: the run's blank notes plus the notes the skipped garbled words occupy.
2. The stretch's count is the notes in it that need a word, counted both ways as `buildRuns` counts a run (`poem-join-wire.ts:136-158`): all such notes, and those less the ones under a printed slur.
3. The poem's syllables between `A`'s and `B`'s aligned poem words are counted as vowel letters, «й» excluded (Dann 2026-11-05 00:28, `docs/memory/OPEN.md`).
4. **Fill the stretch from the poem only when that count equals one of the stretch's two counts.** Then the poem's syllables replace the garbled words' syllables and fill the blank notes, one vowel per note. Otherwise offer it as today. A skipped word that IS a dictionary word ends the widening on that side: Lyrics wins a real-word disagreement (Dann 2026-11-04 10:19).
5. Every limit is stated in a comment, and the widening stops at a system boundary only if the measure shows crossing one costs seats (report both).

This follows the rulings: the count must settle exactly (00:28), never a guess; one vowel per note (`CONTRACT.md` §0.1).

Build it behind `?anchors=wide`, in a worktree on the base the desk names when it starts you.

## Inputs and method

As `/root/c181/brief-desk-row181-longdash-dict_r1_2026-11-05.md` (same clone, PDFs, truth, scorer, harness, sealed-set rule). Reuse its `/root/c181/` set-up where it exists.

**Control:** the same build without `?anchors=wide` on songs 2 and 5 must reproduce the base's own per-song counts; if not, stop.

The desk's expectation: (b) up 20 to 60 over the base; the likeliest failure is the count rule refusing most stretches because the garbled words' notes include melisma notes Ilya did not mark.

## Report

`/root/c181/report-desk-row181-widened-anchors_r1_2026-11-05.md`: (b) of 590 and per song, with (a), against the base; per-syllable diff against the base's ledger; every stretch with song, page, system, `A`, `B`, its two counts, the poem's count, and filled or offered; the control; what you could not establish; your token total. Ledger `/root/c181/ledger-W.tsv`. Reply with three lines: (b) and per song, stretches filled of found, the report path.

## Rules

Every number names its arm, tree, and file. Write nothing outside `/root/c181/` and `/root/m0/`. Stop at 180,000 tokens and write what you have.
