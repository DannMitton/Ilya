# Report: N.135 stage 2b r5, step 4, keep today's cut and fold the clitics the transcription knows (Code, cloud lane, 2026-10-29, r1)

Branch `cloud-lane-21`. One commit, on top of step 3 (`46d70f10`). Last step of the brief; I stop after its push, as the desk asked.

## The answer first

1. **The whole-path stop condition did not trip.** A lyric `в` + U+00A0 + `ти`, written by `writeLyrics`, reaches Lyrics as the word `в ти-ши` (`в тиши`), is seated on its note as the slot «в ти», and the arrival fold leaves it as it is (`findCliticFolds` finds no lone clitic; the seats equal those of `seatScoreWords` alone). `score/underlay-clitic-path.test.ts`, 2 tests, run on `omr/fixtures/tch-1.musicxml`.
2. **Built.** Today's cut is kept (`cutUnits`, unchanged except that it now also returns the token each unit came from). Each Russian row's sewn words go through the transcription as one line (`cliticCalls`, `underlay-seams.ts`), and a vowelless word it calls a proclitic rides in the first unit of the next word in the row that has a vowel; one it calls an enclitic rides in the last unit of the word before it (`omr/underlay-clitics.ts`, `foldClitics`). The unit keeps the host's box. A seat carries `в мир`; the test shows «в» printed alone no longer takes a note of its own.
3. **Not measured:** the replay figures (the brief expects (b) 1,710 and read right 1,880 on A2's captures; vowelless lyrics alone on a note 105 at the step 1 threshold, B04 before and after). A2's captures and scorer are in the desk's `~/Downloads`. NOT ESTABLISHED here. The desk's replay on this build is the check.
4. **Gates:** 1 291 passed (291). 2 248 passed (248). 3 found 0 errors and 12 warnings in 5 files. **4 3635 passed | 1 skipped (3636).** 5 775 passed | 5 skipped (780). 6 145 passed (145). 7 55 passed (55). 8 ratchets: OK.

## N.163: does the slots path reach a read word the dictionary does not hold?

Yes. Read in `pipeline.ts` and run through `processText` and `buildSlotQueue` (a probe, not committed): `Ксюштрам лорпа в зимой`, words the dictionary does not hold, come out as `Ксюшт | рам | лор | па | в зи | мой`. The engine syllabifies without a stress entry; the clitic call is made on the word's letters (`pipeline.ts`, the `isProclitic` and `isEnclitic` lines in `transcribeWords`). Tested: `underlay-seams.test.ts`, "reaches a word the dictionary does not hold".

## How the call is read

`cliticCalls` sends the row's sewn words through `processText` as one line and takes, for each sewn word, the `isProclitic` or `isEnclitic` of the next transcribed word with the same lower-case letters. A word it cannot match (a mark the transcription drops, a hyphenated particle it splits) is called null and never folded. Not verified: how often that happens on the 18 songs. The seam is `Seams.clitics`, optional, passed from the factory like `cut` and `isWord`; `omr/` imports neither the pipeline nor `score/`.

## Departures, as the brief asks me to name them

- **From `buildSlotQueue`:** it also folds leftward any vowelless word that is not a proclitic when a host precedes it in the line (`score/pairings.ts`, `w.isEnclitic || (!w.isProclitic && lastInLine !== null)`). Step 4 does not: a vowelless token the transcription does not call a clitic stays its own unit, because on a scan such a token is often a misread letter. Tested ("a vowelless token the transcription does not call a clitic ... as a unit of its own"). The r4 review's replay, not mine, put the cost of folding every such token at P 7 and B10 4.
- **Which set decides "vowelless":** `VOWEL` in `omr/underlay-units.ts` (with ѣ, і, ѵ), the set `cutUnits` already uses and `underlay-units.test.ts` holds equal to `CYRILLIC_VOWEL`. It is not `hasVowel` (`clitic-merge.ts`, used at `pipeline.ts`), which lacks those three letters and which `omr/` may not import. They differ only for a word whose only vowel letter is one of the three. No fourth set was added.
- **The fold runs after the cut,** on units, not before it on tokens. A host the engine cuts keeps its cut and the rider joins its first (proclitic) or last (enclitic) piece. Folding first would put the rider's letters into the engine's cut.
- **Units are the fold's unit,** so `cutUnits` gained a return field, `origin`, and `rowWords` gained a twin, `rowWordSpans`, that says which tokens make each word.
- **A clitic with no host** (a proclitic at a row's end, an enclitic at its start) stays a unit of its own and is counted in `stats.clitics.left`; folds in `stats.clitics.folded`. New stats field; tests re-keyed.
- **The no-break space** gains its third copy, `NBSP` in `omr/underlay-clitics.ts`, beside `score/pairings.ts` and `score/clitic-seat.ts`.

## Mutant

The proclitic loop disabled (a vowelless proclitic left as its own unit): 5 tests fail (`underlay-clitics.test.ts` 4, `underlay-page.test.ts` 1). Restored.

## Cross-site

- Which word is a clitic: the transcription's call, one site; `omr/` holds no list.
- Where a syllable divides: `cutUnits` and the engine's `syllabify` as before. The list of words in the 18 songs where the written `syllabic` and the transcription's syllables disagree: NOT ESTABLISHED (needs the songs).
- Vowel letters: see above.

## Every unread stretch my tests produce, by bar

The desk asked for each, with: does it start inside a word, and does it hold a vowelless word on its own note. "Starts inside a word" is read from the fixture's `<syllabic>` of the stretch's first note (verse 1): `middle` or `end`. "Vowelless word on its own note" is a verse-1 lyric with no vowel letter. Bars are the fixture's (Sunless 1, `score/ingestion/fixtures/sunless-01-engraved.musicxml`); results are `score/typed-words-land.test.ts` as committed in step 2, unchanged.

| stretch | first note | last note | starts inside a word | ends inside a word | vowelless word on its own note | typed words land |
|---|---|---|---|---|---|---|
| 3 | begin «ти» | end «я;» | no | no | no | exactly (pinned) |
| 5 | single «тень» | end «я;» | no | no | no | exactly (pinned) |
| 6 | begin «ду» | end «я,» | no | no | no | exactly (pinned) |
| 6 to 7 | begin «ду» | end «я;» | no | no | no | exactly (pinned) |
| 11 | begin «мгно» | middle «ни» | no | yes | no | exactly (pinned) |
| 13 | single «на» | middle «ко» | no | yes | no | exactly (pinned) |
| 17 | end «я,» | begin «о» | **yes** | yes | no | exactly (pinned) |
| 8 (LIMIT 1) | single «в» | end «це» | no | no | **yes, «в»** | one note early, then every syllable after |
| 4 (LIMIT 2) | single «тень» | end «я,» | no | no | no | none seated |
| 12 to 14 (LIMIT 3) | end «я;» | middle «ни» | **yes** | yes | no | none seated (18 of 19), one stray |

Reading the table: starting inside a word does not by itself predict a failure (bar 17 starts inside a word and lands exactly; bars 12 to 14 start inside one and do not). The vowelless word on its own note (bar 8) is the one cause I can name. Bar 4's failure has neither property; its cause is NOT ESTABLISHED (the first word «тень» is also the first word after the stretch).

The other stretches my tests produce are not words from a real song and so have neither property: `omr/underlay-integration.test.ts` (the three `tch` pages with two invented single-syllable words each): page 2 as a whole, page bars 1 to 34, song bars 28 to 61, and page 3 as a null page, song bars 63 to 93; `omr/underlay-song.test.ts` (invented bars: 11 to 13, 3 to 4, 44 to 51, 44 to 46 with 48 to 51, 7 to 8, 5 to 10, 4 to 6, bar 11 to 13). None starts inside a word: no word crosses their edges. None holds a vowelless word.

The 62-window sweep behind step 2's table is the same data, not committed; its other 17 failing windows are accounted for there.

## NOT ESTABLISHED

- The replay's figures after step 4 (1,880 read right, (b) 1,710; vowelless alone 105 to 79; B04 before and after).
- The words in the 18 songs where `syllabic` and the transcription disagree.
- What the arrival fold does to the reader's output on real songs: the committed test is on one invented pair of words.
- Time per page in a browser; step 3 on the 16 songs without page pixels.

## Files

`omr/underlay-clitics.ts` (new), `omr/underlay-clitics.test.ts` (new), `omr/underlay-page.ts`, `omr/underlay-page.test.ts`, `omr/underlay-tokens.ts`, `omr/underlay-units.ts`, `omr/underlay-integration.test.ts` and `omr/underlay-song.test.ts` (one stats field each), `underlay-seams.ts`, `underlay-seams.test.ts`, `score/underlay-clitic-path.test.ts` (new), this report.
