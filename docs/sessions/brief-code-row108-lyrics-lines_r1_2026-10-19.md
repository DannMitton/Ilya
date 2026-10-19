# Brief: Lyrics of several lines seat, and Lyrics takes the poem's line breaks (row 108) (r1, 2026-10-19)

Written by the desk (Opus) 2026-10-19 against `cloud-lane-11` at `949f95e2` (pulled once at the start; the follow-up `8067ac29` and the merge `949f95e2` changed only `apps/web/e2e/` and `docs/`, so the code is row 110's `eb30b036`). **Not yet reviewed by Fable** (`QUEUE.md` rule: every Code brief is reviewed before it is sent). Lane: the cloud session on `cloud-lane-11`. **This row runs after row 106 in the same session** (`brief-code-row106-typed-hyphens_r1_2026-10-19.md`): start from row 106's pushed commit and its gate numbers, not the baselines in section 7.

Every count in this brief marked MEASURED was run by the desk this session with a throwaway Vitest run outside the tree against `949f95e2`, loading the shipped dictionary as `apps/web/src/lib/old-spelling.test.ts:28-40` does. Re-measure any number you rely on.

## 1. The singer's side

A singer has a score whose words fill Lyrics as one long line, and the published poem in Poem. Ruling default 4 (`docs/memory/OPEN.md`, "N.135 STAGE 3", Dann 2026-10-16 00:32, a desk default on his suggestion): *Lyrics adopts the poem's line breaks where a poem is given, for comparison; an unmatched remainder (a reordered or omitted passage) sits as its own line.* With this row:

- Lyrics reads in the poem's lines, so the two views compare line by line.
- Nothing moves on the score: every seat stays on its note with its text, and Place from here, the arrival's seat, and a replacement score all seat as they do on one line.
- A Lyrics the singer wrote in her own lines seats from the score's mapping too, where its words are the score's.

Found by row 104's report (`docs/sessions/report-code-input-two-views_r1_2026-10-16.md:5`); queued as row 108 (`docs/memory/QUEUE.md:16`).

## 2. What the code does today (each read or run this session)

| Behaviour | Where |
|---|---|
| `seatScoreWords` refuses Lyrics that is not one line, and aligns `lines[0].words` only | `apps/web/src/lib/score/score-seat.ts:85`, `:87` |
| `align` keys a queue slot's word by `origin.wordIndex` alone, which restarts at 0 on every line | `apps/web/src/lib/score/clitic-seat.ts:182-192`; the queue sets `wordIndex` per line, `apps/web/src/lib/score/pairings.ts:211`, `:245` |
| The "already placed" test in the seat keys `lineIndex-wordIndex-slotIndex` | `score-seat.ts:67-70`, `:91-94` |
| The clitic fold builds its own one-line reading of the score and gives up on more than one line | `clitic-seat.ts:145-157` (`findCliticFolds`), `:475-489` (`readScoreText`, `:487`) |
| Callers of `seatScoreWords`: Place from here; the arrival's seat; the waiting seat; the N.157 replacement | `apps/web/src/routes/+page.svelte:653-655`; `:2762-2765` (`seatFilledPoem`, called at `:2034` and `:2931`); `apps/web/src/lib/score/waiting-seat.ts:40-47` (called at `+page.svelte:2010-2015`); `apps/web/src/lib/score/replace-seat.ts:76` (called at `+page.svelte:2907`) |
| Four sites ask "does Lyrics still hold the score's words" by string equality | `+page.svelte:406` (the `from score` tag), `:653` (Place from here), `:2008` (the waiting seat), `:2033` (the first seat after a transcription); the fill is `:2867-2871` |
| `layOutLikePoem` and `sameWords` exist, are tested, and have no caller | `apps/web/src/lib/text/poem-compare.ts:228-280`; `apps/web/src/lib/text/same-words.ts:17-23`; grep finds no import outside their tests and `lay-out-seat.test.ts` |
| The test that pins the gap | `apps/web/src/lib/text/lay-out-seat.test.ts:45-62`: `seatedOne.seated > 0`, `seatedLaid.seated === 0` |
| A text edit carries seats through a flat word diff (a moved line break changes no word) | `apps/web/src/lib/text-diff.ts:86-101`, `:161-223`; `apps/web/src/lib/score/reseat.ts:147-163`; run at `+page.svelte:1985-1986` through `seatedTextDiff` (`apps/web/src/lib/score/seated-text.ts:26-33`) |
| A seat that cannot be found at its origin in the live queue draws its stored text | `pairings.ts:979-1033` (`drawPairings`), `:449-484` (`refreshPairings`) |
| Score-coordinate seats share line 0 with the poem; `origin.word` tells them apart | `pairings.ts:1080-1100`; `reseat.ts:73-90`, `:162-163` |
| A score's words fill Lyrics only on an upload into an empty Lyrics | `+page.svelte:2867-2871` |

MEASURED on «Within Four Walls» (`apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`: 39 score words, 97 lyric cells, 96 slots, one clitic fold of 60 notes with 1 note blanked), with `lay-out-seat.test.ts`'s stand-in poem (the file's own words in lines of seven):

| Case | Seats |
|---|---|
| `seatScoreWords` on the one-line fill | 96 |
| The same on the six-line layout | 0 (the test's pin) |
| The arrival map made on one line, drawn against the six-line Lyrics without a re-seat | 18 live, 78 stored |
| The same map carried by `reseatByDiff` from the one-line text to the six-line text | removed 0, refreshed 96, seated 0, kept 0; then 96 live, 0 stored; 96 of 96 on the same note with the same text; origins on lines 0 to 5 |
| A multi-line seat with `align` given a flat word index, no fold first | 96 on one line, 96 on six |
| The fold first, then that seat, the "already placed" test still keyed by line | 97 entries on six lines against 96 on one: the last note, which the fold leaves blank, takes a second «я.» |
| The fold first, then that seat, the "already placed" test keyed by flat word index and `origin.word` | 96 entries on both; 0 notes differ; but drawn against six lines, 36 live and 60 stored (the fold's 60 seats carry one-line coordinates) |
| IPA of the 39 words, one line against six lines | 1 word differs: «полёт» `pɑ ˈlʲod` on one line, `pɑ ˈlʲot` at a line's end |

The layout itself, MEASURED: the stand-in poem gives six lines, `7,7,7,7,7,4` words. Row 104's 33-word test text as a one-line poem gives two lines (its 33 words, then the six it lacks as a line of their own). An unrelated poem (Pushkin's «Я помню чудное мгновенье», four lines) matches 0 words and `layOutLikePoem` returns null.

## 3. Part A: seating takes several lines

1. **`align` takes a flat word index.** In `clitic-seat.ts:182-230`, key `firstSlot` and `lastSlot` by the word's position in the flattened lines, not by `origin.wordIndex`. The rows, the join rule (one pipeline word or two, `:204-210`), and the null on a lost walk are unchanged. Its other caller, `findCliticFolds` (`:152`), passes one line and is unaffected.
2. **`seatScoreWords` takes every line.** In `score-seat.ts:85-88`, drop `lines.length !== 1`, pass `lines.flatMap((l) => l.words)` to `align`, and keep the empty-score guard. Rewrite the file's comment at `:31-33`, which says the refusal exists because "the fill inserts no line breaks".
3. **The "already placed" test tells words apart across coordinates.** Today it keys `lineIndex-wordIndex-slotIndex` (`score-seat.ts:67-70`). With Lyrics on several lines, the fold's seats (one-line coordinates, `clitic-seat.ts:475-489`) and the words' seats (several lines) no longer share a key, and the measured result is a second «я.» on the note the fold leaves blank. Key it so a fold seat and a word seat of the same slot meet: the measured choice is the flat word ordinal, `slotIndex`, and `origin.word` together (DESK DEFAULT; `origin.word` is the discriminator `pairings.ts:82-97` and `reseat.ts:73-90` already rely on).
4. **The fold's seats describe the Lyrics the singer sees.** After the fold and the word seat run on a several-line Lyrics, re-key each fold seat whose flat word ordinal and `origin.word` match a word of `lines` to that word's `lineIndex` and per-line `wordIndex` (DESK DEFAULT; the measured cost of not doing it is 60 of 96 seats drawn from their stored text, so a stress mark or a switch moved later never reaches them). Do it in one function beside `score-seat.ts`, used by every caller in section 2's table, so the four callers cannot disagree. A seat whose word does not match is left as stored and counted, as `reseat.ts:178-198` leaves one.
5. **`readScoreText` stays one line.** It is the score's own reading for the fallback queue and the fold (`+page.svelte:385-387`, `clitic-seat.ts:148`), never the singer's Lyrics; its `:487` guard stays.

Done when: `lay-out-seat.test.ts` reads **96 and 96** (section 6, test a), and every existing seat test passes unchanged in its numbers.

## 4. Part B: the comparisons, and Lyrics in the poem's lines

1. **The four comparisons go through `sameWords`.** `+page.svelte:406`, `:653`, `:2008`, `:2033` compare `doc.inputText` with the score's one-line text by `===`; each becomes `sameWords(doc.inputText, scoreText)` (`:2008` compares with the waiting score's own `scoreWordsText`). `sameWords` treats any run of whitespace as one space and folds nothing else (`same-words.ts:14-23`), so the `from score` tag still clears on a changed capital or comma. After this, a singer's own Lyrics in several lines with the score's words also takes the score's own mapping (Place from here, the first seat), where today it takes `firstPass`. That is the point of part A; say it in the report.
2. **When Lyrics adopts the poem's breaks (DESK DEFAULT, his to wave off):** only while Lyrics holds the score's words untouched (`sameWords` with the score's text) and Poem is not empty. Two moments: after the score's own seat has run on an arrival with a Poem already present (row 104 review, amendment 3: *"the breaks are applied only after the seat has run"*), and when a Poem arrives or changes while Lyrics is still the score's untouched words. Once the singer has edited Lyrics, her lines stand and nothing rewrites them.
3. **How it is written.** Through `handleInput(laid, 'paste')` (`+page.svelte:2419-2423`), so the text change takes the ordinary transcription path: the word diff sees no word changed (`text-diff.ts:86-91`), and `reseatByDiff` refreshes every seat onto its new line (measured: 96 of 96 on the same note and text). `doc.seatedText` then advances as it does for any edit (`+page.svelte:1999`). Do not move `doc.seatedText` by hand.
4. **When the words do not match.** `layOutLikePoem` returns null when there is no comparison or no matched word (`poem-compare.ts:224-230`); Lyrics stays as it is and nothing is said. Where some words match, the unmatched run sits as its own line (`poem-compare.ts:213-222`), which is default 4's "unmatched remainder". Where the score's words and the poem barely agree, the layout is still applied; how much agreement Ilya requires before it re-lines Lyrics is NOT ESTABLISHED (section 9). DESK DEFAULT: any matched word is enough, as the function already decides.
5. **Undo.** A Lyrics edit today takes no Undo step of its own beyond the field's (`pushUndo` is called for placements, `+page.svelte:630`, `:661`, `:696`, `:1292`). The re-lining is a text change Ilya makes, not the singer; say in the report whether the field's own undo reaches it, and whether the singer can get the one line back. If not, list it as an open item for Dann; do not build a control or a string for it.
6. **Where the code lands.** `+page.svelte` is 5643 of 5652 (9 lines). Put the decision (when to lay out, with what text) in a function in `apps/web/src/lib/text/`, tested there, and call it from the two moments in item 2 with one line each. If the page needs more than 9 lines net, move a block out first, as row 104 moved `handleReset` (`report-code-input-two-views_r1_2026-10-16.md:45`).

## 5. What it changes in the sound, stated

A line break is a phrase end for the engine: the last word of a line gets a hard boundary (`apps/web/src/lib/pipeline.ts:783-785`), so its final consonant devoices. MEASURED: on the fixture, 1 word of 39 changes, «полёт» `pɑ ˈlʲod` to `pɑ ˈlʲot` at the end of the poem's line 3, and its seat's IPA follows (the seat refreshes from the live slot, `pairings.ts:449-484`). Ruling default 7 says *"Phrase boundaries for the sound come from the music where the score has them, from the poem's lines where it does not"*; a poem line that ends mid-phrase in the music (as «полёт» / «за мгновеньем» in the stand-in) gives the IPA of a phrase end the singer does not sing. Report every word whose IPA changes on the fixture with row 104's test text as the poem. The rule for which wins is Dann's (section 8).

## 6. Tests, by letter

Fixtures: «Within Four Walls» (`sunless-01-engraved.musicxml`); `lay-out-seat.test.ts`'s stand-in poem (the file's words in lines of seven); row 104's 33-word test text (the file's first 33 words, the eleventh replaced by «ИЗМЕНЁННОЕ», `report-code-input-two-views_r1_2026-10-16.md:19`); the Pushkin quatrain of section 2 as an unrelated poem; the Tchaikovsky fixture (`tchaikovsky-op38-3-voice.musicxml`, 90 score words) as a second score.

- a. **`lay-out-seat.test.ts` turns to 96 and 96**: `seatedOne.seated` 96 and `seatedLaid.seated` 96, with the same note for every slot. Rewrite its header comment (`:1-18`), which explains the gap this row closes.
- b. The arrival on six lines: the fold, then the seat, gives 96 entries, no note carrying a second copy of a slot (the measured «я.»), and `drawnSeatCount` 96 live, 0 stored.
- c. Place from here on a six-line Lyrics holding the score's words takes the score's mapping (`+page.svelte:653-655`), as on one line.
- d. The waiting seat (`waiting-seat.ts`) and the N.157 replacement (`replace-seat.ts`) each seat 96 on the six-line text, as their existing tests do on one line.
- e. `sameWords` at the four sites: the `from score` tag shows on the laid-out text and clears on a changed capital.
- f. Adoption on arrival: a Poem present, a score dropped onto an empty Lyrics: Lyrics in the poem's lines, 96 seats on the same notes as without a Poem.
- g. Adoption on a later Poem: the score first, Lyrics untouched, then the poem pasted into Poem: Lyrics re-lined, 96 of 96 seats on the same note with the same text.
- h. No adoption once edited: change one word in Lyrics, then paste the poem: Lyrics' lines unchanged.
- i. No match: the Pushkin quatrain as Poem: Lyrics unchanged, still one line, 96 seats.
- j. A partial match: row 104's test text as Poem: Lyrics in two lines, the six words the poem lacks as their own line; 96 seats.
- k. A singer's own lines: Lyrics typed as the score's words in four lines of her own, no Poem: Place from here takes the score's mapping, 96.
- l. The sound: the IPA of every word on one line against the laid-out text, listed; «полёт» is the one known change on the stand-in poem.
- m. Row 106's typed hyphens on several lines: the fixture in the file's division (row 106 test i) laid out in the stand-in poem's lines seats 96.
- n. The browser, `e2e-phone/input-views.test.ts` pattern, headless Chromium at 390 x 844: drop the fixture, paste the stand-in poem into Poem, read Lyrics' line count and the seats from IndexedDB before and after (row 104's measure 3 method, `report-code-input-two-views_r1_2026-10-16.md:21`).

## 7. Gates, ceilings, commit

Start from row 106's numbers. The baselines in this table are row 110's (`report-code-rows109-110_r1_2026-10-18.md`, section 1); the follow-up commit changed only e2e tests and docs, so they stand until row 106 moves them.

| Gate | Baseline before row 106 |
|---|---|
| phonology | 267 |
| dictionary | 248 |
| web-check | 0 errors, 12 warnings in 5 files |
| web-test | 2760 |
| score-parser | 709 passed, 5 skipped |
| blurb | 145 |
| integration | 55 |
| ratchets | OK (`+page.svelte` 5643) |

A web-test rise is the new tests, counted per file; a changed test (test a) is named. Ceilings: `+page.svelte` 5652, `pipeline.ts` 1065 (this row does not touch it). Playwright `--project=phone` and `--project=chromium` as the rows 109 and 110 report ran them; the two known failures (`e2e/insights-page.test.ts:95`, `e2e/singer-paths.test.ts:169`) are not this row's. Commit "Row 108: Lyrics of several lines seat, and Lyrics takes the poem's line breaks", push `cloud-lane-11`.

## 8. Lane rules

Commit and push only `cloud-lane-11`; never `Shane` or `main`; no pull request; never edit anything under `docs/memory/`. No new user-facing string. The ratified Lyrics line already says coloured words differ from the poem (`OPEN.md`, the strings table, `intake.view.lyricsLine`); nothing ratified says Ilya re-lined Lyrics. If a line is needed (a note that Lyrics now follows the poem's lines, a way back to one line), write it as an open item for Dann in the report, not in `i18n.ts`. One report for both rows, `docs/sessions/report-code-rows106-108_r1_2026-10-19.md`, a section each.

## 9. Open for Dann (the desk's defaults stand until he rules)

- **Which phrase end the IPA hears** when the poem's lines and the music's phrases differ (section 5). Default 7 names the music first; this row puts the poem's lines into the text the engine reads. Options: accept the poem's lines (as built here); or keep the engine on one line for the sound and lay out only the view. The second needs Lyrics' display and Lyrics' text to differ, which row 104's layer does not do today.
- **Whether Ilya may re-line Lyrics without the singer's act** (section 4, item 2). The alternative: a control that offers the poem's lines, which needs a ratified string.
- **How much agreement before re-lining** (section 4, item 4).

## 10. What the brief could not establish

NOT ESTABLISHED beats a complete invented answer.

- The Lamm scan in this lane: row 104's reader did not finish in 1500 s (`report-code-input-two-views_r1_2026-10-16.md:23`); a wordless score seats by `firstPass`, which reads the flat queue and is not touched here.
- Whether the field's undo reaches a Lyrics text Ilya rewrites (section 4, item 5).
- How a real published poem lines up against «Within Four Walls»: no published poem is in the tree; the stand-in and row 104's text are test texts.
- The re-keying of fold seats (section 3, item 4) on a score with more than one fold: the fixture has one.
- Whether `healFrozenSeats` (`+page.svelte:2129-2140`) touches a seat re-lined this way; not traced.
- The Tchaikovsky fixture: named as a second score, not measured.
- WebKit and Firefox: not run here.
