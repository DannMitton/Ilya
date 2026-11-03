# Design draft: Ilya carries a library of public-domain poems and compares the input against them (desk, r1, 2026-11-03 00:4x)

Written by the desk (Opus) at Dann's direction of 2026-11-03 00:25: *"I think it's wise for Ilya to compare input to a poem it Carrie's onboard. Flesh out a working scenario for this and present your brief to Fable for review"* (transcribed as written). With it, his correction of the same message: the build is plastic, and decisions made along the way are informed decisions that can be revisited, not walls. This draft treats the earlier input design as the current state, to be changed where the evidence says so. For Fable's review before any build brief is written.

## Why

1. **The measure.** On row 114's first file (590 printed syllables, gate 531), the scan alone reaches 369 after row 176 and Dann's slur rule (row 177, building). A perfect poem, aligned perfectly, under today's rules reaches 374 (tier 1 only), 388 (plus notes where the reader saw ink), 399 (plus the rows the scan did not seat) (`~/Downloads/_desk-2026-11-02/t6/report-desk-pw-poem-witness_r3_2026-11-02.md`). So a poem is worth 19 to 30 syllables under today's rules and cannot reach 531 by itself. Of the 221 lost: 78 are wrong words on the right note, 143 are notes with no word (about 57 in systems the scan did not seat, 61 clean blanks the design leaves to the singer, 14 where the reader saw ink).
2. **The singer's labour.** Today Poem stays empty until the singer pastes, types, or scans the poem (default 3). Most singers will not. A poem Ilya already carries turns the witness on for every song in the library, with no labour.
3. **The reader.** Aligned against an authoritative text, the reader's output yields the confusion list item 6 and item 9 ask for, and labelled line images to fine-tune the reader's model. That is the path for the 57 syllables in rows that read as nothing, which no poem can fill.

## The scenario, as the singer meets it

1. A singer drops a scan of Musorgsky's «Где ты, звёздочка?». The reader fills Lyrics as today.
2. Ilya searches its library from what it already has: the Lyrics' first line and longest words, the title and composer if the reader found them. It finds Grekov's poem with a confidence score.
3. **Confident match:** Poem fills from the library. Poem's standing line names the source, in effect: "Poem from Ilya's library: N. P. Grekov, 'Где ты, звёздочка?', from [edition]. Paste your own to replace it." (strings owed, EN and FR, desk drafts for Dann). Lyrics' receipt line counts what the reconciliation did ("4 words repaired from the poem").
4. **Several candidates or a weak match:** no fill. The line offers the top candidates by title and poet; one tap picks one, another dismisses. Nothing fills silently on a weak match.
5. **No match:** nothing changes from today.
6. The singer's own poem always outranks the library's: a paste or scan of a poem replaces the library's text (with today's replace guard), and the library never overwrites a Poem the singer filled.
7. Everything downstream runs as designed: sage differences in Lyrics, grey omissions in Poem, the three tiers, the dotted underline on a repair, Revert. The composer's departures (song 1 sets stanzas 1 and 3, with variants) show as differences, which is what Poem and Lyrics exist to track.

## What the library is

- **Scope, first release:** the poems of the Russian art-song repertoire Ilya's singers sing, starting with the songs already in the corpus (row 114's five, the 18 build songs), then the standard repertoire by composer (Glinka, Dargomyzhsky, Musorgsky, Tchaikovsky, Rimsky-Korsakov, Rachmaninoff, and onward). Russian source texts only; never translations (many translations are recent and under copyright).
- **The public-domain test:** the poet died in 1971 or earlier (public domain in Canada; the 2022 extension to life plus 70 did not revive expired copyright). DESK DEFAULT, stricter, for an app served worldwide: also died at least 70 years ago, so the text is public domain in the life-plus-70 countries; a poet who passes Canada's test and not this one is listed and held for Dann. Edition apparatus (an editor's notes and commentary) is never copied.
- **Sources:** an edition named for every text. Preferred: Russian Wikisource (public-domain texts with the edition named), the Fundamental Electronic Library of Russian Literature (feb-web.ru, scholarly editions), the Russian Virtual Library (rvb.ru); each source's terms recorded. LiederNet (Emily Ezust) as a cross-reference for which composer set which text and its variant notes, and its texts only with her permission (WebFetch declines to transcribe song texts from it; the desk does not route around that).
- **Each entry:** poet and dates; title and incipit; the text in the edition's spelling, with a normalized form for alignment (the same normalizing the tiers use); source, edition, URL, licence; the settings known (composer, title, opus, year, LiederNet id); a version stamp.
- **Several versions of one poem** may be carried (an early and a revised text); the match picks the one that aligns best and says which.
- **Packaging:** a hash-named data file listed in `dictionary-manifest.json`, as the dictionary is (`loader.ts:58-64`, `:283-289`; the pattern ratified for the table of odd spellings, item 7), loaded on demand, offline once fetched. Size: NOT ESTABLISHED; a first estimate is needed (a few thousand poems of a few hundred words is a few megabytes before compression).

## Matching

- An index of incipits, titles, and word n-grams over the normalized texts, built at data-build time.
- The query is the scan's Lyrics as read, garbles and all, so the match must tolerate the reader's errors: score by the share of long exact words matched plus letter n-gram overlap, which item 9's alignment already leans on.
- The confidence threshold is measured, not guessed: on the build songs, the true poem must win by a margin, and a song not in the library must find nothing above the threshold.
- A song whose Lyrics is too short or too garbled to match (a page that read as almost nothing) gets no fill and no false offer.

## What changes in the design, as informed decisions for Dann

1. **Default 3 (2026-10-16), "Poem stays empty until the poem is pasted, typed, or read by OCR".** Its reason was that a draft Ilya composed would pose as the authoritative text. A library poem is not composed: it is the published poem from a named edition, which is what his reason asked for. Proposed amendment: Poem may also be filled from Ilya's library on a confident match, with its source shown, and the singer's own poem always outranks it.
2. **Item 1 (2026-10-20, as amended 22:13): a note with no word stays undecided for the singer unless the reader saw ink there.** Unchanged by this draft. With a library poem and a confident alignment, the 61 clean blanks could take the poem's aligned syllable; that would cross the line item 1 drew ("Ilya never guesses the composer's setting"). The measure can count what it would gain and what it would get wrong (the T6 ceiling flagged 3 of 17 ink notes where a perfect poem would fill a continuation). For Dann, with numbers, not pre-empted.
3. **Item 7, the table of odd correct spellings, and item 6's confusion list** gain their first evidence from the reader-divergence measure below.

## The reader-divergence loop (desk-side, not in the app)

1. For each song in the build set with a library poem: align the reader's tokens per row to the poem's syllables (item 9's method).
2. Collect: substitutions (the confusion list's evidence, counted, substitutions only, never deletions, item 6); rows read as nothing with their crops and the poem's aligned text (training lines); rows read well and refused by `rowLanguage` (the T5 case, 1 known word of 5).
3. Fine-tune the reader's model (`rus_prereform_r2_29000.traineddata`) on the training lines, the build songs only. **Row 114 is never trained or tuned on; it is the gate.** The second file stays sealed.
4. Measure on row 114: scan alone, scan plus library poem.

## The measure that decides it

T6 re-run with library poems on the strict tree (control 369): arms 2a, 2a-ink, 3 as in `../sessions/brief-desk-pw-poem-witness_r3_2026-11-02.md`, plus the matching step itself (does Ilya find the right poem from the scan's Lyrics, for each of the five songs). And a 2a-blank arm (the clean blanks filled from the poem) for item 2's question, reported as "not the design".

## Questions for the review

1. Is the confident-match fill the right line, or should a match always be offered and never filled?
2. Is the public-domain test right, and is the stricter worldwide default needed?
3. What can go wrong with matching on a garbled scan (a wrong poem filled with confidence), and how is that bounded?
4. Is the reader-divergence loop sound, and is the gate kept clean?
5. What does this draft miss in the existing design (`OPEN.md`, "N.135 STAGE 3: TWO VIEWS OF INPUT" and "HOW ILYA SEATS TEXT ON NOTES"), in `PRODUCT.md`, or in the code (`ScoreUploader.svelte`, `pairings.ts`, `loader.ts`)?
6. What is the smallest first build that proves the scenario?
