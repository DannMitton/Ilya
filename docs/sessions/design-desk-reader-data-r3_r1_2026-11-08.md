# Design r3: the readers' discarded data put to work across Ilya (desk, r1, 2026-11-08)

Design r2 (`design-fable-reader-data-r2_r1_2026-11-05.md`, Fable, read in full 2026-11-08) with the 14 findings of its objective review (`review-fable-design-r2_r1_2026-11-05.md`, Fable, PROCEED WITH CHANGES, read in full 2026-11-08) applied by the desk. This file states what r3 changes; every section of r2 not named here stands as written. QUEUE row 181. NOT ESTABLISHED beats a complete invented answer.

## The order, r3

The review's ranking (finding 14), adopted by the desk, DESK DEFAULT. One reason per line.

1. **B0 and B0g** (r2 rank 1). Measured, ruled. Gate changed (below).
2. **A Russian row must carry words enough to seat** (NEW, review finding 1). Ten lines, no reader datum, ceiling 61 lost seats, and it lets every later look-again fire where today it is silenced.
3. **The confusion table from the ledgers** (r2 rank 7, cut to its useful half; finding 8). A script over data on disk; changes which offers the singer walks.
4. **The stretch look** (r2 rank 2), on the base of 1 to 3, with its domain, `MIN_RUN`, and bar restated (findings 2 to 4, 11).
5. **A merged word split at a symbol gap** (r2 rank 3), with finding 7's listing.
6. **The row's confidence beside the dictionary** (r2 rank 4), after rank 2 lands (finding 5).
7. **Homr's system breaks and the units-against-free witness** (r2 rank 8, widened by finding 10).
8. **Tempo words and dynamics from the strip** (r2 rank 5), after its step 0 (finding 9).
9. **Homr's decode margin** (r2 rank 6), with finding 13's line owed.
10. **The poem aligned to the read letters** (r2 rank 9). After 1 to 5.
11. **Voice 2 as N.191's sibling** (r2 rank 10).
12. **The logged checks** (r2 rank 11).

## 1. B0 and B0g: the gate (finding 6)

Read by the desk 2026-11-08 from the ledgers (`ledger-tip.tsv`, `ledger-armS.tsv` in `~/Downloads/_desk-2026-11-04/desk-row181-c-drop-data_2026-11-05.tgz`; `ledger-B0_tip.tsv`, `ledger-B0_S.tsv` in `desk-row181-b0-data_2026-11-05.tgz`; rows aligned 590 of 590): **B0 is +6, −2 per syllable on both bases.** Gained: song 1 p1 sys2 «на»; song 2 p3 sys3 «те,» and «дру» (swapped order on the base, put right); song 2 p6 sys3 «те,», «дру» (the same swap), and «ви». Lost: song 2 p6 sys2 «Ра» and «мгно», seated right on the base and left empty under B0. Why they empty is NOT ESTABLISHED. The build's gate: B0 on the arm S base reproduces 389 with the same +6 and −2, or the two losses are explained and fixed. "0 breaches" in r2 is true and is a different count (no two-vowel or empty sung note).

## 2. A Russian row must carry words enough to seat (NEW; finding 1)

As finding 1 states it: in `underlay-page.ts` where `seated` is set (the review cites `:276-287` and `:303` at `05db2dac`), a row seats the system only where (a) it passes `rowLanguage` with at least `MIN_WORDS` counted words (the fallback's floor, `underlay-fallback.ts:27`, one constant shared and held equal by a test) and (b) it yields at least one unit after `assertVowelPerNote`; a row that fails is counted (`emptyRussianRows`) and the next row tried; a system with no such row is `no Russian row` and takes the second look and the banner as built. The five systems it addresses, 61 of arm S's 205 lost seats: song 2 p5 s1 (junk row «ее іп», 18), song 1 p2 s1 («п з пь Гг.», 15), song 5 p19 s1 («І Іст», 9), song 5 p20 s1 («аъъъ аълъъ», 7), song 5 p21 s3 («ѣѣ», 12). Risk: a true lyric row of one or two words fails (a); the measure counts them.

**Measure: arm J** (the review's arm R), on the B0-on-arm-S base (control 389), RUNNING since 2026-11-08 20:0x (brief `brief-desk-row181-armJ-row-floor_r1_2026-11-08.md`, to be filed). The desk's expectation before it: the five systems no longer seat from junk; (b) between 389 and 450; no system right on the control loses a seat. W2 and W15 logging (finding 5) was left out of arm J to keep it to one change, DESK DEFAULT; it rides with rank 6's first arm.

## 3. The confusion table from the ledgers (finding 8)

r2's integration 7 loses its question to Dann and its hOCR path: JOINING item 3 rules that Lyrics wins a real-word disagreement (`OPEN.md`, JOINING item 3, ruled 2026-11-04 10:19), and a ratified decision is applied, not put to him again (`CONTRACT.md` §1 item 6a). Kept: the measured `CONFUSIONS` table that replaces the placeholder (`text/poem-join.ts:115`, cited by r2 and by the review). Built from the five ledgers' `letters` rows (seated text against truth syllable on the same note), about 20 lines of script and one constant. Measure: the `real-close` and `both-fail` offer counts on songs 2 to 5 before and after (3 and 2 on the tip). W22 is held as a later refinement if the ledger's pairs prove too few.

## 4. The stretch look (findings 2, 3, 4, 11)

1. **Domain.** Not 98. Of 120 blank rows, 84 sit in systems that seated at least one syllable, 62 of them in runs of two or more; 44 of the 84 are in three of rank 2's five systems. The stretch look's own domain is the 40 blank rows in seated systems outside those five, about 30 in runs of two or more. Song 2 p5 s1, r2's exemplar, belongs to rank 2.
2. **`MIN_RUN`** is set by a measure, not by r2's sentence about one-note runs (every ledger row is a lost syllable, so the ledger holds no melisma to compare): on the base, every free note with no syllable classed as truth melisma or lost syllable, with the ink share of the span between its neighbours' tokens for each class. The comment names that measure.
3. **The bar:** seats gained net of seats lost on the base, per system touched; junk seated at most one in ten of seats gained (r2's DESK DEFAULT, kept); no loss in a system that was right on the base.
4. **The cue:** r2's "so it cannot" is struck. The band reaches down to the piano's top line less `MARGIN`, and a cue printed above the piano sits in it; the junk-seated count covers it.
5. **Control:** the same build with the flag off, which must give the base's count.

## 5. The symbol-gap split (finding 7)

r2's "the cue is far from every free note and is dropped (`FAR_FACTOR`)" becomes: the cue takes no note only where `FAR_FACTOR` reaches it; otherwise the measure shows what `monotone` does with one token more than notes. Arm G lists song 1 p1 s1's seats before and after, by name.

## 6. The row's confidence (finding 5)

Waits on rank 2, not on arm L. Arm L reported 2026-11-08 19:4x: 376, identical to the tip syllable for syllable (`report-desk-row181-language-both-readings_r1_2026-11-05.md`). Song 5 p21 s3 was seated from the junk row «ѣѣ» with zero units, which is rank 2's case, and a witness that passes more rows makes that worse unless rank 2 lands first. Added risk: under psm 7 a row that is half piano cue, half lyric carries one confidence for both.

## 7. The system check, widened (finding 10)

Rank 7 counts, beside homr's `<print new-system>` against `systemsOf`, the systems where `units` exceeds `free` by more than N or `free` exceeds `units` by a factor (`perSystem`, `underlay-page.ts:315`, per the review). Song 3 page 12 (ties 66, 95, 68, 42, 67 against units 3, 7, 4, 4, 1) is the first page to look at; whether homr read piano notes as the voice there or the system pairing failed is NOT ESTABLISHED.

## 8. Tempo words: bytes and alphabet (finding 9)

The three RapidOCR models are 31,749,509 bytes on the first scan read with `ocr: true` (`third_party/homr-web/src/models/manifest.ts:990`, `:1021`, `:1052`, per the review), about four times the words model; that number goes to Dann before anything ships (`CONTRACT.md` §8). Step 0 of the measure dumps `ctcCharacters` of the shipped recognition model and reports whether а to я are in it; if not, the integration shrinks to Latin tempo words, metronome marks, and dynamics. The parser already reads `<words>` into `tempoWords` and `<metronome>` into `tempoMarkings` (`musicxml-parser.ts:479-487`, `:971-998`, per the review) and has no `<dynamics>` reader, so the dynamics half waits on N.177.

## 9. The decode margin (finding 13)

r2's "the convention `unread-bars.ts` already uses" carries no line. NOT ESTABLISHED until the brief reads `unread-bars.ts`.

## 10. Citations corrected (finding 12)

`musicxml-parser.ts:722` for the event id is `:731-733`; `underlay-reader.ts:107-141` is `:117-158`; `underlay-prepare.ts:174-176` is `:177`; `decoder.ts:49-51` is `:49-50`; the "from the piano" offer is the wiring section at `OPEN.md:2731` item 2, not N.178's item 2. All per the review on `05db2dac`; the desk has not re-read them this session.

## 11. Still not established

From the review's list, carried: why arm L's capture of song 5 p21 s3 row 4 had no long-dash joint where arm S's did; which row passed for song 1 p2 s1 on the first look; why `rowLanguage` called «аъъъ аълъъ» Russian (`isWord` on short strings); the PP-OCRv6 alphabet; `unread-bars.ts`'s convention; whether two voices collide on `cursorId`. New: why B0 empties «Ра» and «мгно» on song 2 p6 sys2.

## Next

1. Arm J's report decides rank 2.
2. Then the B0 and B0g Code brief with rank 2 folded in if arm J holds, Fable review first (`CONTRACT.md` §1 item 19), together with any other brief of the same day (`CONTRACT.md` §4, one Fable session a day).
