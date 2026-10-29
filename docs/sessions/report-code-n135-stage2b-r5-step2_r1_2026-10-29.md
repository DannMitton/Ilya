# Report: N.135 stage 2b r5, step 2, a system that cannot be read loses only itself (Code, cloud lane, 2026-10-29, r1)

Branch `cloud-lane-21`. One commit for the step, on top of step 1. **I stopped here, on the stop condition you set for this step. Steps 3 and 4 are not started.** Section 2 says what tripped it and what I need from the desk.

## The answer first

1. **Built, tested, gates at baseline.** A system with no Russian row, a system with no band, and a page that answers null no longer hold back the song. Every system that has a Russian row keeps its words. The singer is told the unread bars by the ratified banner, which rides inside the joined MusicXML so it returns when the song is reopened.
2. **The stop condition tripped, in part.** A word typed into an unread stretch lands on the right notes for stretches that start and end at the edge of a word and hold no vowelless word. It does not in three realistic cases I found by running the app's own re-seat on Dann's engraving of Sunless 1. The banner's second sentence ("Type the missing words into Lyrics exactly where they fall in the song") is untrue in those cases. Section 2.
3. **Gate 4 reads 3605 passed | 1 skipped (3606).** The other seven gates are at baseline (section 6).
4. **`+page.svelte` is 5,586 lines against its ceiling of 5,586** (`wc -l`, read after the edit). `omr/` and `ingest.ts` carry the new code; `packages/score-parser/src/musicxml-parser.ts` is not touched (it stands at its ceiling, 1,167 of 1,167).

## 1. What was built

**Per-system facts, not page and song gates.**

- `UnderlayPage.passes` and `why` are gone. `UnderlayPage.systems` is one `SystemWords` per system that holds a voice note: `written`, `bars` (the first and last bar of its notes, **as homr numbers them on that page**, from `NotePlace.bar`, `omr/underlay-prepare.ts:56-61`), and `why` (`'no Russian row'` or `'no band'`). Read at `omr/underlay-page.ts` (the `SystemWords` interface and the end of `seatPage`).
- `omr/underlay-song.ts:73` (`applyUnderlay`) writes the words of every page that answered, leaves a page that answered null as it was, and names the unread parts. The "every page must pass" rule and its two early returns are removed; the old header paragraph is rewritten to say it reverses Fable's amendment 7 to r2.

**The bars, as the song numbers them.** `applyUnderlay` adds to a page's own bar the count of `<measure>` elements in the first part of every earlier page (`measureCount`, `omr/underlay-prepare.ts:76`). Left out: every page `pianoAlonePages` calls piano-alone (`omr/join-pages.ts:421`, now exported, not copied; called at `omr/underlay-song.ts:75`). A page that answers null names every bar of its first part that holds a non-rest note, unless it is piano-alone. Ranges that touch are joined (`mergeRanges`, `omr/unread-bars.ts`): 44 to 46 and 47 to 51 make 44 to 51, and 44 to 46 with 48 to 51 stay two (tested).

**Where the bars ride.**

- In the joined MusicXML, as one `<miscellaneous-field name="ilya-words-unread-bars">23-30,41-48</miscellaneous-field>` inside `<identification><miscellaneous>` (`omr/unread-bars.ts`, `markUnreadBars`, called at `omr/homr-reader.ts:418` after the join). A kept reading holds `musicXml` and `stamp` only (`omr/stamp.ts`), so the bars reopen with the song and nothing else is stored.
- The score parser reads no `<miscellaneous>` element and `musicxml-parser.ts` stands exactly at its ceiling. So the one reader of the field is the ingestion seam every MusicXML passes: `withUnreadBars` (`score/ingestion/ingest.ts:134`, called at `:296`) adds a `words-partly-read` warning (`ParseWarning.bars`, `packages/score-parser/src/types.ts:944`; the code at `:990`). The parser package is changed by those two type lines only.
- Test of the reopen: `omr/underlay-integration.test.ts`, "returns the banner when the song is reopened from its kept reading". It reads a three-page song through `makeReader`, keeps the reading with `restoreScan`, reopens it with a `read` that throws if called, ingests the kept text, and finds the warning with the same bars.

**The banner.**

- Two keys, `upload.banner.wordsPartlyRead` and `upload.banner.wordsPartlyReadOne` (`i18n.ts:1465-1466`), with the ratified EN and FR wording, `{bars}` and `{bar}` as slots, apostrophes U+2019 (DESK DEFAULT). Chosen only by `scanNotice` (`ingest.ts:102`), a pure function beside `noLyricsNoticeKey`; `noticeText` (`:121`) and `barsText` (`:111`) fill the slot. A wordless score keeps its two messages as ever (tested).
- `{bars}` forms: "23 to 30"; "23 to 30 and 41 to 48"; "4, 9 to 12, and 39" (Oxford comma); FR « 23 à 30 », « 23 à 30 et 41 à 48 », « 4, 9 à 12 et 39 » (no comma before « et »); a range of one bar inside a list is the bar alone. Tested in `score/scan-notice.test.ts`.
- All four sentences are pinned in `insights/ratified-lines.test.ts` (new `describe`, after row 113's), by code point, plus a check that no straight apostrophe or em-dash is in them.
- `+page.svelte` changes, net zero lines: the import (`:208`), the state's type (`:369`), the choice at `:2791` (one line, in place of the two statements it held), and the display at `:4043`. `noLyricsFile` now holds the unread bars (encoded) for a partly read scan. Its other readers are `lyricsTakesPoem(how === 'paste' && noLyricsFile !== null ...)` at `:2390`, which also needs an empty Lyrics and no placements, and the two resets; a partly read song has words in Lyrics, so that guard cannot fire for it. I did not run the page, which is inert under vitest.

**Why the banner is built now, behind the switch.** As the brief says (DESK DEFAULT): it lets the measure see it. It cannot appear with the switch off, because only `applyUnderlay` writes the field, and it is called only when the reader has an underlay reader (`homr-reader.ts:401`).

## 2. The stop condition: where a typed word lands

**Method.** `score/typed-words-land.test.ts` runs the app's own functions, in the order the page runs them, on Dann's engraving of Sunless 1 (`score/ingestion/fixtures/sunless-01-engraved.musicxml`, the fixture `score-seat.test.ts` reads): parse the whole score and seat it (`seatScoreWords`); take the `<lyric>`s off the notes of some bars (as an unread system would leave them); put the remaining words in Lyrics and seat them; type the missing words back into the text (`seatedTextDiff`, `reseatByDiff`, called as `reseatAcross`, `+page.svelte:2071-2078`, calls them, with `syllableTargetIds`). The check: each retyped word stands on the notes it stood on in the whole score, and no read word moves. I swept every window of one to four bars from bar 2 to bar 18 (62 windows, a temporary harness, its results not committed), then pinned the cases below.

**Result.**

- **Lands exactly, and moves no read word:** 45 of the 62 windows (for example bars 3, 5, 6, 6 to 7, 11, 13, and 17; 7 are pinned as passing tests).
- **Does not:** the other 17. By window: bar 4 alone (1); every window that contains bar 8 (10: 5 to 8, 6 to 8, 6 to 9, 7 to 8, 7 to 9, 7 to 10, 8 to 8, 8 to 9, 8 to 10, 8 to 11); and six windows that begin on a bar that opens with the end of a word (10 to 11, 12 to 14, 12 to 15, 15 to 15, 15 to 16, 16 to 16). That is the three limits below. The six are a pattern and not a rule: windows 10 to 10, 10 to 12, and 10 to 13 begin the same way and land exactly.
- **LIMIT 1, a vowelless word on a note of its own.** Bar 8 holds «в» on its own note, then «бью». Typed back, «в бью» (the clitic joined to its host, `score/pairings.ts:225`) lands on the note under «в», and every syllable after it in the stretch lands one note early; the stretch's last note stays empty. In the whole score the same slot stands on the host's note («бью»), because the arrival fold seats a clitic with its host and does not run on a typed edit (`+page.svelte`, the N.161 comment above `reseatAcross`). Pinned in `typed-words-land.test.ts`.
- **LIMIT 2, bar 4 alone.** Its first word «тень» is also the first word after it (bar 5). Typed back, none of its six words is seated. The cause is NOT ESTABLISHED; I did not read `text-diff.ts`'s matching to find it.
- **LIMIT 3, a stretch that begins inside a word.** Bars 12 to 14 begin with the end of «мгновенья» (bar 11 holds its start). Typed back, 18 of the 19 differing notes stay empty and the nineteenth holds a stray «я;». A system break in print often falls inside a word, so this is not exotic. Why some such stretches fail and others do not is NOT ESTABLISHED.

**What this means for the banner.** The second sentence is true for a stretch of whole words with no vowelless word, and untrue otherwise. The desk's replay (the r4 review's `banner.py`) found "all 12 inner gaps and 3 at the head" land on the gap's first note. That replay re-implements the rule; this test runs the real functions, and finds these three failures. The brief's own report line, "report each such case in the 18 songs", I could not do: the 18 songs' MusicXML and A2's captures are in the desk's `~/Downloads`, not in this lane. NOT ESTABLISHED for the 18 songs.

**Why I stopped.** You named this a stop condition. The banner is a ratified string, and three of the cases it will meet are failures I can name. I did not weigh how often they occur on the 18 songs, because I cannot see them. Options for the desk (mine to list, not to choose): (a) accept the sentence as ratified and let Dann know it is untrue in these cases; (b) bring the failures to Dann for a second sentence that is true; (c) fix the re-seat for a typed clitic or a mid-word start (this touches `reseat.ts` and the N.161 ruling, which is Dann's). I did not take any of them.

## 3. Mutants (brief section 7)

- Page bars instead of song bars: `before.push(0)` in `applyUnderlay` fails 8 tests, among them "names the song's bars, not the page's, for a system unread on page 2 (mutant: page bars)" and the integration test that carries the song bars in the joined file. Restored.
- The mutants for steps 0 and 1 are in their reports.

## 4. Cross-site line (`CONTRACT.md` §4)

- **Bar numbers.** The join numbers the song's bars by position (`omr/join-pages.ts`, `rewriteMeasure(m, n + 1, ...)`), and step 2 computes the same number from page bars and `measureCount`. They agree on the two-page-and-more song of the fixtures: `omr/underlay-song.test.ts`, "numbers a bar of page 2 as the join numbers it", finds a note of page 2's bars 3 and 7 in the joined measure of the number step 2 gives it, by its `imgpos`. NOT ESTABLISHED for a page whose measures homr does not number from 1 (`voiceNotes` falls back to a count where `number` is not numeric, `omr/underlay-prepare.ts`); the join's `dropBarsAfterTheEnd` can remove bars at a song's end (not tested).
- **The unread-bars field.** One module, `omr/unread-bars.ts`, holds the writer and the reader; `ingest.ts` imports it. No second copy.
- **Piano-alone pages.** `pianoAlonePages` is called, not copied.

## 5. Departures

1. **The warning is added at ingestion, not by the parser.** The brief allows either ("say where"). The parser's own file is at its ceiling, and an import plus a call cannot fit without raising it.
2. **A page that answered with no system on it** (`systems.length === 0`: for example, no staff found) is named like a null page ("no staff found"). The brief names only null pages; without this, a page homr gave no staff boxes for would be bare and silent. Tested.
3. **Piano-alone pages' syllables are not counted** in `syllables` or in the "pages written" count. The brief does not say. They are still written into that page's XML, and the join removes them (the test of that is step 3's).
4. **The console line gains the unread parts**, by page, system, and song bars, so the desk's measure can name them: `... ; no words in page 2 system 3 (bars 21 to 23, no Russian row)`. The "does not pass" wording is gone from `omr/underlay-reader.ts` and `underlay-song.ts`; tests re-keyed.
5. **Tests rewritten, not deleted:** `underlay-song.test.ts` (new), `underlay-page.test.ts` and `underlay-integration.test.ts` and `underlay-reader.test.ts` (the `passes`/`why` assertions re-keyed to `systems`).

## 6. Gates after step 2

Gate 1 291 passed (291). Gate 2 248 passed (248). Gate 3 found 0 errors and 12 warnings in 5 files. **Gate 4 3605 passed | 1 skipped (3606).** Gate 5 775 passed | 5 skipped (780). Gate 6 145 passed (145). Gate 7 55 passed (55). Gate 8 ratchets: OK.

## 7. NOT ESTABLISHED

- The 18 songs: which of their unread stretches meet LIMIT 1, 2, or 3; the replay's figures for steps 1, 2 (900/851 and 1,836/1,671); the list of unread systems against A2's 19. All need the desk's captures.
- The page itself under a browser: I changed four lines of `+page.svelte` and ran the unit tests, the type check, and the ratchets; I did not run the app.
- Whether a printed second verse, or a song written whole with junk rows seated, shows a banner: not this step's (brief section 10).

## Files

`apps/web/src/lib/omr/`: `unread-bars.ts` (new), `unread-bars.test.ts` (new), `underlay-song.ts`, `underlay-song.test.ts`, `underlay-page.ts`, `underlay-page.test.ts`, `underlay-prepare.ts`, `underlay-reader.ts`, `underlay-reader.test.ts`, `underlay-integration.test.ts`, `homr-reader.ts`, `join-pages.ts` (one word, `export`). `apps/web/src/lib/score/`: `ingestion/ingest.ts`, `scan-notice.test.ts` (new), `typed-words-land.test.ts` (new). `apps/web/src/lib/i18n.ts`, `apps/web/src/lib/insights/ratified-lines.test.ts`, `apps/web/src/routes/+page.svelte`, `packages/score-parser/src/types.ts`. This report.
