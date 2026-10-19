# Brief: phrase ends come from the music, Lyrics of several lines seat, and Lyrics takes the poem's line breaks (row 108) (r3, 2026-10-19)

Written by the desk (Opus) 2026-10-19 against `cloud-lane-11` at `5efa88bd`; r3 applies the 13 amendments of `review-opus-brief-row108_r1_2026-10-19.md` (SEND WITH AMENDMENTS), reviewed against `9cbcfa44`, a Guide commit that changes only `GuideContent.svelte` (+4) under `apps/`; no file this row reads or changes is in it. r3 replaces r2 (`brief-code-row108-lyrics-lines_r2_2026-10-19.md`), which replaced r1. Lane: the cloud session on `cloud-lane-11`.

Every count marked MEASURED was run by the desk or the reviewer in a scratch copy of the tree, never in `/root/lane11`, loading the shipped dictionary the way `apps/web/src/lib/old-spelling.test.ts:28-40` does. Part C's numbers come from a throwaway prototype in that copy (a `phraseEnds` option on `processText`, and one cross-line assimilation pass); its design is section 3. The reviewer re-ran every Part C count and the threshold counts and got the same numbers. Re-measure any number you rely on.

NOT ESTABLISHED beats a complete invented answer.

## 1. The singer's side

A singer drops a score whose words fill Lyrics as one long line, and pastes the published poem into Poem. With this row:

- **The sound follows the music, not the line breaks.** Where her score is attached and a word sits on its notes, Ilya ends a phrase where the music breathes (a rest, a breath mark, a caesura, a fermata), and nowhere else except at punctuation and the last word. A line break in Lyrics no longer changes the IPA of a word the score places. With no score, a line end is a phrase end, as today.
- **Lyrics reads in the poem's lines**, so the two views compare line by line, and the IPA does not move when it does (MEASURED: 0 of 39 words on «Within Four Walls», section 3).
- **Her own lines are hers.** Ilya changes only line breaks it wrote: a Lyrics in one line, as the drop leaves it, or a Lyrics it laid out itself. A Lyrics she broke into lines of her own keeps them.
- **Nothing moves on the score**: every seat stays on its note with its text, and Place from here, the arrival's seat, the waiting seat, and a replacement score seat as they do on one line.
- **A Lyrics she wrote in her own lines, or typed in the score's syllables**, seats from the score's own mapping where its words are the score's.
- **An old-spelling score seats on arrival** (MEASURED: today the Tchaikovsky fixture seats 0 of its 172 slots by the score's own mapping; section 3, item 1).

The record, all in `docs/memory/OPEN.md`, "N.135 STAGE 3: TWO VIEWS OF INPUT, POEM AND LYRICS" (Dann 2026-10-16 00:32 to 00:36): default 4, *"Lyrics adopts the poem's line breaks where a poem is given, for comparison; an unmatched remainder (a reordered or omitted passage) sits as its own line"* (`OPEN.md:2784`, a desk default on his suggestion); default 7, *"Text transcribes Lyrics, not Poem"* (Dann 00:32, `OPEN.md:2787`), whose reason, the desk's, is that "the IPA of a word depends on its sung neighbours and phrase ends", and whose line closes, inside that reason, with the desk's sentence *"Phrase boundaries for the sound come from the music where the score has them, from the poem's lines where it does not"* (`OPEN.md:2787`; the desk's words, not a quotation of Dann; corrected by the desk 2026-10-19 after its review said the sentence was absent); its amendment N.186 (Dann 2026-10-16 20:37, `OPEN.md:2816`), which lets the singer choose the witness Text transcribes and keeps Lyrics the default; and default 12, the typed hyphen (`OPEN.md:2791`), built by row 106. The desk held r1 because "re-lining puts the poem's line ends into the engine's text, against ruling default 7" (`docs/memory/QUEUE.md:16`). Part C answers that hold, and it is a DESK DEFAULT (section 9, decision 1), not a quoted ruling. Found by row 104's report (`docs/sessions/report-code-input-two-views_r1_2026-10-16.md:5`); queued as row 108 (`QUEUE.md:16`).

## 2. What the code does today (each read or run at `5efa88bd`, re-read at `9cbcfa44`)

### Phrase ends

| Behaviour | Where |
|---|---|
| A word's right boundary is set per line: the last word of a line `hard`, a word ending in punctuation `hard`, a proclitic or a word before an enclitic `clitic`, otherwise `soft`; a `'user'` boundary is kept | `apps/web/src/lib/pipeline.ts:756-793` (`autoDetectBoundaries`; the rules at `:775-791`, the `'user'` guard at `:761`); called per line at `:326` |
| Nothing sets `'user'` | `pipeline.ts:735-741` says so; grep finds no writer or reader of `boundarySource` outside `pipeline.ts`, `engine.ts`, and `types.ts` (`Loupe.svelte:1413` is an unrelated local) |
| No Inspector control sets a word boundary | `InspectorPanel.svelte` drags syllable boundaries only (`:785-818`); the Inspector shows the word `lines` gives it |
| The engine's own copy of the same rules, not called by the pipeline | `packages/phonology/src/engine.ts:1998-2037` (rules at `:2003-2034`) |
| The boundary types | `pipeline.ts:97-98` (`PreTranscribeWord`), `:138-139` (`TranscribedWord`); `engine.ts:112-113` (`BoundaryWord`); `apps/web/src/lib/types.ts:111`, `:113` (`string \| null` on `WordStackData`) |
| Cross-word assimilation runs once per line, so it never crosses a line end; a `hard` boundary skips it and lets final devoicing apply; every other boundary, `soft` or `clitic`, is crossed | `pipeline.ts:797-887` (`transcribeLine`, the call at `:887`); `engine.ts:2158-2253` (the `hard` skip at `:2171`, final devoicing at `:2248-2252`) |
| A voiced final consonant before a vowel or a sonorant keeps its voice across a boundary that is not `hard`; before a voiceless consonant it devoices, and a voiceless one voices before a voiced obstruent. Every branch that meets a voiced final sets `skipFinalDevoicing`, so `clitic` and `soft` give the same IPA | `engine.ts:2179-2240` |
| Clitic display merging and the slot queue's clitic tuck run per line | `pipeline.ts:958-1051`; `apps/web/src/lib/score/pairings.ts:206-207` ("A clitic never reaches across a line break") |
| Nothing in the pipeline reads the music | `processText`'s options are `engineConfig`, `language`, `userStressOverrides`, `yoToggles` (`types.ts:170-177`) |
| The parsed score carries rests, fermatas, breath marks, and caesuras on the vocal line | MusicXML: `packages/score-parser/src/musicxml-parser.ts:780-791` (a fermata and articulations are read only on a note, `notations && !isRest` at `:784`), `:853-854`, the map at `:250-261`; ties per event at `:777`; MNX: `mnx-parser.ts:243-244`, `:1012-1023`, `:1043-1044`; the types at `types.ts:517-525`, `:634-646` |
| The score package already finds phrase ends (rest, silence, breath mark, caesura, end; not fermata) for the N.168 conditions, inside `noteConditions`, which needs a voice profile | `packages/score-parser/src/conditions.ts:64-70`, `:172-173`, `:230-282` |
| The guardrail says `pipeline.ts` is the one file that imports the phonology, dictionary, and blurb packages; the tree does not hold to it everywhere | `pipeline.ts:9-10`; `old-spelling.ts:26` imports `GraysonEngine`, `+page.svelte:4` imports `transcribeWord` |

MEASURED, the fixtures' marks: «Within Four Walls» (`apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`) has 116 vocal-line events, 19 rests, 0 breath marks, 0 caesuras, 0 fermatas. Tchaikovsky op. 38 no. 3 (`tchaikovsky-op38-3-voice.musicxml`) has 238 events, 64 rests, and 0 of each mark. A bar with no event at all (`conditions.ts`'s "silence") adds no phrase end on either fixture.

### The score's own seat on an old-spelling score

| Behaviour | Where |
|---|---|
| `align` matches a score word to a pipeline word by the pipeline's `cleanWord` alone | `apps/web/src/lib/score/clitic-seat.ts:204`, `:207` |
| The vowel resolver matches the same pair three ways (modern, as printed, as displayed), by QUEUE row 25 | `apps/web/src/lib/score/vowel-resolver.ts:175-177` (`printedSpelling`), `:184-187` (`spellsAs`, **not exported**) |

MEASURED: on Tchaikovsky's one-line fill (90 score words, 95 pipeline words), `align` loses the walk at the second word, «шумнаго» against the pipeline's modernised «шумного», so `seatScoreWords` seats 0 and `findCliticFolds` finds 0. With `align` asking `spellsAs`'s three questions, it seats 172 of the 174 sung notes, withholds 0, and the fold changes nothing (0 folds). «Within Four Walls» is unchanged by it: 96 seated, 97 entries after the fold.

### Seating and the comparisons

| Behaviour | Where |
|---|---|
| `seatScoreWords` refuses Lyrics that is not one line, and aligns `lines[0].words` only | `apps/web/src/lib/score/score-seat.ts:85`, `:87` |
| `align` keys a queue slot's word by `origin.wordIndex` alone, which restarts at 0 on every line | `clitic-seat.ts:182-192`; the queue sets `wordIndex` per line, `pairings.ts:211`, `:245` |
| The "already placed" test in the seat keys `lineIndex-wordIndex-slotIndex` | `score-seat.ts:67-70`, `:91-94` |
| The clitic fold builds its own one-line reading of the score and gives up on more than one line | `clitic-seat.ts:145-157` (`findCliticFolds`), `:475-489` (`readScoreText`, the guard at `:487`) |
| Callers of `seatScoreWords`, and the order each runs the fold in | Place from here, seat then fold (`apps/web/src/routes/+page.svelte:653-655`); the arrival, fold (`:2914`) then `seatFilledPoem` (`:2762-2765`, itself seat then fold, called at `:2034` and `:2931`); the waiting seat, fold then seat (`apps/web/src/lib/score/waiting-seat.ts:40-46`, called at `+page.svelte:2014`); the N.157 replacement (`apps/web/src/lib/score/replace-seat.ts:76`, called at `+page.svelte:2902`) |
| Four sites ask "does Lyrics still hold the score's words" by string equality | `+page.svelte:406` (the `from score` tag), `:653` (Place from here), `:2008` (the waiting seat), `:2033` (the first seat after a transcription); `scoreText` is `:394-396`; the fill is `:2867-2871` |
| A fifth equality, which stays exact | `transcribedText === fillText` at `:2931`, the arrival's choice between seating now and waiting |
| `layOutLikePoem` and `sameWords` exist, are tested, and have no caller outside tests | `apps/web/src/lib/text/poem-compare.ts:213-280`; `apps/web/src/lib/text/same-words.ts:17-23`; grep finds them only in `poem-compare.test.ts` and `lay-out-seat.test.ts` |
| The test that pins the gap | `apps/web/src/lib/text/lay-out-seat.test.ts:45-62`: `seatedOne.seated > 0`, `seatedLaid.seated === 0`; its header `:1-18` |
| A text edit carries seats through a flat word diff (a moved line break changes no word) | `apps/web/src/lib/text-diff.ts:86-89`, `:161-163`; `apps/web/src/lib/score/reseat.ts:147-150`; run at `+page.svelte:1989-1990` through `seatedTextDiff` (`apps/web/src/lib/score/seated-text.ts:26-33`); `doc.seatedText` advances at `:1999` |
| A seat that cannot be found at its origin in the live queue draws its stored text; a found one draws the live slot's IPA | `pairings.ts:979-982` (`drawPairings`), `:449-475` (`refreshPairings`, keyed by origin); `+page.svelte:482` (`shownPairings`) |
| Score-coordinate seats share line 0 with the poem; `origin.word` tells them apart | `pairings.ts:1080-1083`; `reseat.ts:73-76` |
| The pipeline runs from one place, `runPipeline` | `+page.svelte:1862-1885`; `transcribeText` at `:1943-2054` records `transcribedText` first (`:1948`), re-keys the marks before the run (`:1957-1962`), and calls it at `:1975` |
| `doc.inputText` changes on every key; the transcription waits for the pause | `handleInput`, `+page.svelte:2419-2423`; `joinText`, `:2576-2600`; Dann's ruling quoted at `:2565-2567`, "While typing, transcribe after a short pause, never per keystroke" |
| A Poem edit arrives per keystroke as `'typing'`, and whole as `'paste'` | `apps/web/src/lib/components/Drawer/IntakeViews.svelte:184-192`; `apps/web/src/lib/one-action.ts:44-50`; `handlePoemEdit`, `+page.svelte:2431-2437` (row 109's `lyricsTakesPoem` at `:2435`) |
| Undo steps are pushed for placements, not for a Lyrics edit; a step holds `pairings` and `seatedText`, not `doc.inputText` | `+page.svelte:630`, `:661`, `:696`, `:1292`; the snapshot, `:841-848` |

### Hyphens in the two comparisons (row 106)

- `layOutLikePoem` compares by `fold` (`poem-compare.ts:85-89`), which joins any `-`, `‐`, `‑` inside a word. MEASURED: the fixture typed in the file's own division («Ком-нат-ка тес-на-я, …») against the stand-in poem lays out `7,7,7,7,7,4`, the same as the plain text.
- `sameWords` folds whitespace only (`same-words.ts:14-23`). MEASURED: `sameWords(divided, scoreText)` is false. So a Lyrics typed in the score's syllables is never re-lined, and Place from here and the first seat give it `firstPass` instead of the score's mapping, although `seatScoreWords` seats it fully (MEASURED: 96 of 96 on the one-line divided text). This row fixes it (section 5, item 1).

MEASURED on «Within Four Walls» (39 score words, 97 lyric cells, 96 slots, one clitic fold of 60 notes with 1 note blanked) with `lay-out-seat.test.ts`'s stand-in poem (the file's own words in lines of seven):

| Case | Seats |
|---|---|
| `seatScoreWords` on the one-line fill | 96 |
| The same on the six-line layout | 0 (the test's pin) |
| The arrival map made on one line, drawn against the six-line Lyrics without a re-seat | 18 live, 78 stored (r1's number, not re-run by the review) |
| The same map carried by `reseatByDiff` from the one-line text to the six-line text | 96 live, 0 stored; 96 of 96 on the same note with the same text (r1's number) |
| A flat-index seat on the six-line layout, no fold | 96, every seat on the one-line seat's note with the same slot and text (MEASURED by the review; Tchaikovsky in lines of seven: 172 of 172) |
| The fold first, then a flat-index seat, the "already placed" test still keyed by line | 97 entries: the last note, which the fold leaves blank, takes a second «я.» |
| The fold first, then that seat, the "already placed" test keyed by flat word ordinal and `origin.word` | 96 entries, 0 notes differ; drawn against six lines, 36 live and 60 stored (the fold's 60 seats carry one-line coordinates; r1's number) |

## 3. Part C, built first: the phrase ends come from the music

DESK DEFAULT (section 9, decision 1), reasoned from default 7's stated reason (`OPEN.md:2787`) and the desk's hold on r1 (`QUEUE.md:16`). **The rule, in the order a word is tested:**

1. A `'user'` boundary wins (`pipeline.ts:761`, kept).
2. The last word of the text: `hard`, as today.
3. A word ending in punctuation: `hard`, as today.
4. **A word seated on the score, with a score attached, whose next word in the text is also seated:** `hard` when the music ends a phrase between them; otherwise the word takes the rule it would take inside a line (`clitic` or `soft`, `pipeline.ts:781-791`), **including at a line end**. At a line end the proclitic test applies and the enclitic test does not (DESK DEFAULT), because `transcribeLine` never reads a line's first word as enclitic (`pipeline.ts:826-831`). Its `boundarySource` is a new value, `'score'`, for both outcomes.
5. Every other word: today's rules, so with no score, or a word the score does not place, a line end stays a phrase end.

**What "seated" and "the music ends a phrase" mean.**

- A word is seated when at least one `kind: 'syllable'` seat in `doc.pairings` has its `origin.lineIndex` and `origin.wordIndex` and its `origin.word` equal to the word standing there in the transcribed text (`wordGrid(transcribedText)`, `pipeline.ts:216-221`; the reason is item 6). A seat whose `origin.word` differs is ignored, as `reseat.ts:73-76` ignores one. Every seat counts: the score's own, `firstPass`, and the singer's hand placements (DESK DEFAULT; the music is the music whoever placed the word).
- "The next word" skips a word that owns no slot (a vowelless clitic, «в», «въ», «съ», or a token with no letters); any other unseated next word leaves the word on rule 5.
- The music ends a phrase between word A and the next seated word B when, on the vocal line from A's last seated note up to the note before B's first seated note, there is a rest event, or a note carrying a `breath-mark` or `caesura` articulation or a `fermata` (DESK DEFAULT: the desk's three, plus the caesura the parser also carries and `conditions.ts:172-173` already counts). The span includes A's melisma continuation notes and tied notes, which are their own `vocalLine` events, so a breath or a fermata after the last note of a melisma counts. Where B's first seated note does not come after A's last (a hand placement out of order), the word has no key and takes rule 5 (DESK DEFAULT). A silence with no rest event (`conditions.ts:64-70`) does not count (DESK DEFAULT, the desk's definition; MEASURED: it adds nothing on either fixture).

**Where it is built.**

1. **The score's own seat reads the old spelling.** Export `spellsAs` (`vowel-resolver.ts:184`, one word, no line). In `clitic-seat.ts:204` and `:207`, match by `spellsAs` instead of `cleanForAlignment(...cleanWord)`. DESK DEFAULT: the resolver already reads Tchaikovsky this way under QUEUE row 25, and the seat that shares its join rule (`clitic-seat.ts:170-178`) did not get the same change. Without it, Part C has no seats to read on an old-spelling score. MEASURED: Tchaikovsky 0 to 172 seated; «Within Four Walls» 96 either way; no import cycle (`clitic-seat.ts:48-54` already imports the resolver, which does not import `clitic-seat.ts`).
2. **A new module, `apps/web/src/lib/score/phrase-ends.ts`**: `musicPhraseEnds(parsed, map, grid): Map<string, boolean>`, keyed `"lineIndex-wordIndex"`, `true` where the music ends a phrase after the word, `false` where it does not, no key where rule 5 applies. It reads `parsed.vocalLine` directly; `packages/score-parser` is not changed (the `conditions.ts` pass is inside `noteConditions` and needs a profile). The same module holds `phraseEndsKey(map)` (a string of the set) and the pure re-run test of item 6, so vitest can pin both.
3. **`processText` takes `phraseEnds?: ReadonlyMap<string, boolean>`** (`types.ts:170-177`). After step 2's boundaries (`pipeline.ts:326`), apply rule 4 to every word with a key.
4. **Cross-word assimilation crosses a line end that is not a phrase end.** Today `transcribeLine` runs the engine and the assimilation for one line (`pipeline.ts:797-887`). Split it: transcribe every line's words, call `GraysonEngine.applyCrossWordAssimilation` once over all lines' words in order, then run each line's post-process and clitic merging (`pipeline.ts:889-1053`) as today. A `hard` boundary already stops the assimilation (`engine.ts:2171`), so with no `phraseEnds` every line end is `hard` and the result is today's. MEASURED in the prototype: with no `phraseEnds`, 0 of 39 and 0 of 95 words differ from today, one line and in lines of seven. A `soft` or `clitic` boundary crosses a line for voicing; clitic display merging (`pipeline.ts:958-1051`) and the queue's clitic tuck (`pairings.ts:206-207`) stay per line (DESK DEFAULT).
5. **`'score'` joins the boundary unions** at `pipeline.ts:98`, `:139`, and `engine.ts:113`, each edited in place, line for line (`engine.ts` stays 2291).
6. **The page passes it, and never per keystroke.** In `+page.svelte`:
   - one `$derived` for `musicPhraseEnds(ingestedScore.result.score, doc.pairings, wordGrid(transcribedText ?? ''))`, undefined without a score. It reads `transcribedText` (`:2520`), not `doc.inputText`: `doc.inputText` changes on every key (`:2419-2423`), and a set built from it would re-run the pipeline per keystroke with marks not yet re-keyed (`:1957-1962`), against the ruling quoted at `:2565-2567`.
   - `runPipeline` passes it (`:1866-1870`).
   - one `$effect` that depends on `phraseEndsKey` alone and re-runs `runPipeline` (not `transcribeText`) when the key changes, only while `lines` is non-empty and `transcribedText === doc.inputText`, with the call inside `untrack` (the pattern at `:2622-2625`), so the effect does not track what `runPipeline` reads and writes (`:1862-1885`). Keep the last key in a plain variable. This is how the arrival's seat, which runs after the first transcription (`:2031-2047`, `:2929-2932`), gets its phrase ends on the next run.
   - Seats draw from the live slots (`+page.svelte:482`, `pairings.ts:449-475`), so Markup follows.
   - Cost, stated: a transcription whose seats moved runs the engine twice, where `:1964-1969` describes one pass.
7. **The score's own readings keep today's boundaries** (DESK DEFAULT): `readScoreText` (`clitic-seat.ts:483`), the resolver's fallback (`vowel-resolver.ts:475`), the derived poem (`+page.svelte:425`, `:430-442`), and the poem's own transcription (`apps/web/src/lib/text/witness-lines.ts:29`). The poem's transcription has no seats, so its line ends are its phrase ends. Cost, stated: on a song with stored placements and an empty Lyrics, the derived poem shows «так» as `ˈtɑɡ` until the singer's first act claims the text; after that, Lyrics gives `ˈtɑk`.

### What Part C changes in the IPA, MEASURED, every word

«Within Four Walls», the one-line fill (Lyrics as a drop leaves it today): **0 words change.** Of the 37 seated words with a seated next word, 16 end a phrase in the music (17 of 38 if the last word is counted; it gets no key). 4 words gain a `hard` boundary from a rest, and none changes, because each ends in a vowel, a sonorant, or a voiceless consonant before a vowel:

| Word (ordinal) | IPA (unchanged) | Next word | The rest, `measureIndex` |
|---|---|---|---|
| «дума» (10) | `ˈdu mɑ` | «глубокая,» | 5 |
| «сердце» (16) | `ˈsʲɛrts ɨ` | «надежда» | 7 |
| «неподвижный» (25) | `ɲɪ pɑd ˈvʲiʒ nɨj` | «на» | 11 |
| «ночь» (37) | `ˈnotʃʲ` | «одинокая.» | 16 |

(The `measureIndex` column is the desk's, not re-run by the review.)

«Within Four Walls» in the stand-in poem's six lines (`7,7,7,7,7,4`): **1 word changes against today**, «полёт» (20), `pɑ ˈlʲot` today, `pɑ ˈlʲod` with Part C. Its line end (line 3) has no rest, so the boundary is `soft`, and the next word «за» begins with a voiced obstruent, so the `t` voices (`engine.ts:2220-2223`), as it does on one line today. With Part C the six-line text and the one-line text give the same IPA on all 39 words; today they differ on that one. In row 104's 33-word test text as Poem (Lyrics laid out `33,6`), 0 words differ either way.

Tchaikovsky, the one-line fill: **0 words change as the tree stands**, because the score's own seat seats nothing (section 2). With item 1 built, 23 of the 89 keyed words end a phrase (24 of 90 counting the last), 10 gain a `hard` boundary, and **1 word changes**: «такъ» (так, 77), `ˈtɑɡ` today, `ˈtɑk` with Part C, because a rest stands between it and «засыпаю,» (today the `k` voices before the `z`). The other nine («бала» 2, «тайна» 12, «печально» 18, «отдалённой» 27, «тонкий» 37, «звонкий» 49, «одинокие» 59, «ночи» 60, «печальныя» 67) end in a vowel or a sonorant. In lines of seven, Part C gives the one-line IPA on all 95 tokens.

So, across both fixtures: **one word on a shipped Lyrics («такъ»), and one more on a laid-out Lyrics («полёт», which Part C returns to its one-line IPA).**

## 4. Part A: seating takes several lines

1. **`align` takes a flat word index.** In `clitic-seat.ts:182-230`, key `firstSlot` and `lastSlot` by the word's position in the flattened lines, not by `origin.wordIndex`. The rows, the join rule (`:204-210`, which Part C item 1 has already widened), and the null on a lost walk are unchanged. Its other caller, `findCliticFolds` (`:152`), passes one line and is unaffected.
2. **`seatScoreWords` takes every line.** In `score-seat.ts:85-88`, drop `lines.length !== 1`, pass `lines.flatMap((l) => l.words)` to `align`, and keep the empty-score guard. Rewrite the comment at `:31-33`, which says the refusal exists because "the fill inserts no line breaks". MEASURED: 96 of 96 on six lines, 172 of 172 on Tchaikovsky in lines of seven, every seat on the one-line seat's note.
3. **The "already placed" test tells words apart across coordinates.** Key it by the flat word ordinal, `slotIndex`, and `origin.word` together (DESK DEFAULT; `origin.word` is the discriminator `pairings.ts:82-97` and `reseat.ts:73-76` rely on). The measured cost of keeping `score-seat.ts:67-70` as it is: a second «я.» on the note the fold leaves blank (MEASURED again by the review: 97 entries).
4. **The fold's seats describe the Lyrics the singer sees.** After the fold and the word seat run on a several-line Lyrics, re-key each fold seat whose flat word ordinal and `origin.word` match a word of `lines` to that word's `lineIndex` and per-line `wordIndex` (DESK DEFAULT; the measured cost of not doing it is 60 of 96 seats drawn from their stored text, and Part C reading none of the 60, because their `origin.word` would not match the grid at their stored coordinates). One function beside `score-seat.ts`, used by every caller in section 2's seating table, so the four callers cannot disagree. **It runs last at each caller, after both the seat and the fold**, because the callers run them in different orders (section 2: Place from here and `seatFilledPoem` seat then fold; the arrival and the waiting seat fold then seat). A seat whose word does not match is left as stored and counted, as `reseat.ts:178-198` leaves one.
5. **`readScoreText` stays one line** (`clitic-seat.ts:475-489`, `+page.svelte:385-387`); its `:487` guard stays.

Done when: `lay-out-seat.test.ts` reads **96 and 96** (test k), and every existing seat test passes unchanged in its numbers.

## 5. Part B: the comparisons, and Lyrics in the poem's lines

1. **`sameWords` folds a syllable hyphen.** In `same-words.ts:21-23`, drop `-`, `‐` (U+2010), and `‑` (U+2011) where they stand between two letters, the set row 106 made syllable hyphens (`apps/web/src/lib/typed-hyphens.ts:37`); case and punctuation stay unfolded. Rewrite the comment at `:14-15`, which says hyphens are not folded. DESK DEFAULT: a typed syllable hyphen changes no word (`cleanWord` is letters only since row 106, `report-code-row106_r1_2026-10-19.md:14`) and is never coloured (default 5), so it is not an edit of the score's words. Its cost: the `from score` tag stays on a Lyrics the singer has divided.
2. **The four comparisons go through `sameWords`.** `+page.svelte:406`, `:653`, `:2008`, `:2033` compare `doc.inputText` with the score's one-line text by `===`; each becomes `sameWords(doc.inputText, scoreText)` (`:2008` compares with the waiting score's own `scoreWordsText`). The fifth, `transcribedText === fillText` at `:2931`, stays exact, because the layout comes after it (item 3). After this, a Lyrics in several lines, or in the score's syllables, with the score's words takes the score's mapping (Place from here, the first seat), where today it takes `firstPass`. Say it in the report.
3. **When Lyrics adopts the poem's breaks** (ruled by default 4; section 9, decision 2). All four must hold:
   - Lyrics holds the score's words (`sameWords` with the score's text);
   - **Lyrics' line breaks are Ilya's** (DESK DEFAULT): Lyrics is one line, the shape the drop leaves (`:2867-2870`), or Lyrics equals `layOutLikePoem(Lyrics, the previous Poem)` exactly. A Lyrics she broke into her own lines keeps them;
   - Poem is not empty;
   - the agreement test of item 5 passes.

   Three moments, one line each:
   - after the score's own seat has run on an arrival with a Poem present (row 104 review, amendment 3: *"the breaks are applied only after the seat has run"*), at the end of `applyArrival`;
   - where the seat waited on the dictionary (`scoreSeatWaiting`, `:2931-2932`), after `seatWaitingScore` spends it (`:2014`);
   - in `handlePoemEdit`, when a Poem arrives or changes, after `lyricsTakesPoem` (`:2435`) and only when it did not fire.
4. **How it is written.** Through `handleInput(laid, how)` (`+page.svelte:2419-2423`), where `how` is the arrival's own: `'paste'` at the two seat moments, and the Poem edit's `how` in `handlePoemEdit`, so a poem typed key by key lays out Lyrics after the same pause and never per keystroke (`IntakeViews.svelte:184-192`). The change takes the ordinary transcription path: the word diff sees no word changed (`text-diff.ts:86-89`), and `reseatByDiff` refreshes every seat onto its new line (MEASURED: 96 of 96 on the same note and text). `doc.seatedText` advances as for any edit (`:1999`). Do not move `doc.seatedText` by hand.
5. **When the words do not match.** Where `layOutLikePoem` returns null (no comparison or no matched word, `poem-compare.ts:228-230`), Lyrics stays as it is and nothing is said. **Where fewer than half of either text's words match, Lyrics also stays as it is** (DESK DEFAULT, section 9, decision 3; "half" is the desk's number, not Dann's). In code: re-line when `2 * cmp.pairs.length >= ` the count of `cmp.lyrics` tokens whose `folded` is not empty, or `>=` the same count of `cmp.poem` tokens (`poem-compare.ts:99-111`). Where it passes, the unmatched runs sit as their own lines (`poem-compare.ts:217-222`).
6. **Undo.** The desk's reason, decision (b): re-lining changes only line breaks, never a word, so it loses nothing the score cannot give back; item 3's second condition is what keeps that true, because the only breaks it replaces are the drop's one line and Ilya's own layout. Measure and report, and build no control and no string:
   - the field's own undo: focus Lyrics, press Control+Z once, read the field's value; report whether it is the one line;
   - the named undo across a re-lining: place a syllable, paste the poem, press the Loupe's undo; the step holds `pairings` and `seatedText` but not `doc.inputText` (`:841-848`), so report the live and stored seat counts and «полёт»'s IPA after it.
7. **Where the code lands.** `+page.svelte` is 5643 of 5652 (9 lines for Parts B and C together). Put the decision (when to lay out, with what text, the line-break condition, the agreement test) in a function in `apps/web/src/lib/text/`, tested there, and call it from the three moments with one line each. If the page needs more than 9 lines net, move a block out first, as row 104 moved `handleReset` (`report-code-input-two-views_r1_2026-10-16.md:37-45`).

## 6. Tests, by letter

Fixtures: «Within Four Walls» (`sunless-01-engraved.musicxml`); Tchaikovsky (`tchaikovsky-op38-3-voice.musicxml`); the stand-in poem (the file's words in lines of seven, as `lay-out-seat.test.ts:49-51` builds it); row 104's 33-word test text (the file's first 33 words, the eleventh replaced by «ИЗМЕНЁННОЕ», `report-code-input-two-views_r1_2026-10-16.md:19`); Pushkin's «Я помню чудное мгновенье» quatrain (the first four lines of `apps/web/src/lib/approval/ipa-corpus.approval.test.ts:128-131`, 15 tokens); the fixture typed in the file's own division (row 106's test i); and a score built in the test, on `apps/web/src/lib/text/poem-first-seat.test.ts`'s pattern, for the marks no fixture carries. Each fails on `5efa88bd` and passes on a correct build, except where a line says it is a guard.

**Part C**

- a. A rest ends a phrase inside a line: a built score, «сад и дом» on three notes with a rest after «сад»: «сад» is `hard`, `'score'`, `ˈsɑt`; without the score, `soft`, `ˈsɑd` (MEASURED in the prototype, both).
- b. A line end the music does not end is `soft`: «сад\nи дом» seated with no rest after «сад»: `soft`, `'score'`, `ˈsɑd`; without the score, `hard`, `ˈsɑt` (MEASURED, both).
- c. A breath mark, a caesura, and a fermata each end a phrase with no rest (the built score, one test per mark); a fermata on the tied last note of a melisma ends it too.
- d. Guard, holds today: punctuation and the last word keep `hard` with a score: «сад, и дом» seated with no rest: «сад,» is `hard`, `'punctuation'`, `ˈsɑt`; «дом» is `hard`, `'auto'` (MEASURED).
- e. Guard, holds today: rule 5: an unseated word, and a seat whose `origin.word` does not match the grid, leave the word on today's rule (a line end stays `hard`).
- f. «Within Four Walls», one line, arrived: «дума», «сердце», «неподвижный», «ночь» are `hard`, `'score'`; the IPA of all 39 words equals today's.
- g. «Within Four Walls» in the stand-in's six lines: the IPA of all 39 words equals the one-line IPA; «полёт» is `pɑ ˈlʲod`.
- h. Tchaikovsky: `seatScoreWords` on the one-line fill seats 172 (0 today); then «так» is `ˈtɑk` (`ˈtɑɡ` today), and the other 94 tokens' IPA equals today's.
- i. Guard, holds today: `processText` without `phraseEnds` gives today's IPA on every word of both fixtures, one line and in lines of seven (the cross-line restructure changes nothing by itself; MEASURED).
- j. The browser: drop Tchaikovsky onto an empty song; Text shows «так» as `ˈtɑk` and Markup's seat on its note draws the same; IndexedDB holds 172 seats.
- cc. The re-run test (section 3, item 6), a unit test of the pure function in `phrase-ends.ts`: an unchanged key does not re-run; a changed key re-runs only when `transcribedText` equals the field's text. And in test y's script, typing five letters into Lyrics on a seated song transcribes once, after the pause (count `transcribeMs` updates or an equivalent hook Code names).

**Part A**

- k. `lay-out-seat.test.ts` turns to **96 and 96**, with the same note for every slot. Rewrite its header comment (`:1-18`).
- l. The arrival on six lines: the fold, then the seat, gives 96 entries, no note carrying a second copy of a slot, and `drawnSeatCount` 96 live, 0 stored.
- m. Place from here on a six-line Lyrics holding the score's words takes the score's mapping (`+page.svelte:653-655`), and its fold seats carry six-line coordinates after it.
- n. The waiting seat (`waiting-seat.ts`) and the N.157 replacement (`replace-seat.ts`) each seat 96 on the six-line text.

**Part B**

- o. `sameWords` folds a syllable hyphen: «Ком-нат-ка тес-на-я» against «Комнатка тесная» is true (false today); «Комнатка» against «комнатка» stays false; a free-standing dash token (U+2014, or `-` between spaces) is not folded.
- p. The `from score` tag shows on the laid-out text and on the divided text, and clears on a changed capital.
- q. Adoption on arrival: a Poem present, a score dropped onto an empty Lyrics: Lyrics in the poem's lines, 96 seats on the same notes as without a Poem.
- r. Adoption on a later Poem: the score first, Lyrics untouched, then the stand-in pasted into Poem: Lyrics re-lined `7,7,7,7,7,4`, 96 of 96 seats on the same note with the same text.
- s. Adoption on a divided Lyrics: the fixture typed in the file's division, then the stand-in pasted: Lyrics re-lined `7,7,7,7,7,4`, the hyphens kept, 96 seats.
- t. Guard, holds today: no adoption once a word is edited: change one word, then paste the poem: Lyrics' lines unchanged.
- u. Guard, holds today: no match: the Pushkin quatrain as Poem: Lyrics unchanged, one line, 96 seats.
- v. Guard, holds today (nothing re-lines today), and fails on r1's any-match rule: the agreement test: Tchaikovsky's text in lines of seven as Poem against «Within Four Walls»' Lyrics (MEASURED: 2 matched, of 39 Lyrics tokens and 95 Poem tokens): Lyrics unchanged. And «Within Four Walls»' text as Poem against Tchaikovsky's Lyrics (2 of 95 and of 39): unchanged.
- w. A partial match: row 104's test text as Poem (MEASURED: 32 of 39 matched): Lyrics in two lines, `33,6`; 96 seats; the IPA of all 39 words equals the one-line IPA.
- x. A singer's own lines: Lyrics typed as the score's words in four lines of her own, no Poem: Place from here takes the score's mapping, 96.
- y. The browser, `e2e-phone/input-views.test.ts`'s pattern, headless Chromium at 390 x 844: drop the fixture, paste the stand-in into Poem, read Lyrics' line count and the seats from IndexedDB before and after (row 104's measure 3 method, `report-code-input-two-views_r1_2026-10-16.md:21`); then the two undos of section 5, item 6, and report what Lyrics and the seats hold after each.
- z. Her lines stand: test x's four lines, then the stand-in pasted into Poem: Lyrics unchanged, 96 seats.
- aa. A repeating song: Lyrics sing «Within Four Walls» three times (117 tokens), the stand-in as Poem (MEASURED: 39 matched, one third of Lyrics, all of the Poem): Lyrics laid out; seats unchanged. Lyrics twice (39 of 78): laid out.
- bb. A typed Poem: the stand-in typed into Poem key by key on a seated song: no transcription before the pause; after it, Lyrics laid out `7,7,7,7,7,4`, 96 seats.
- dd. The layout is a fixed point: `layOutLikePoem(layOutLikePoem(L, P), P)` equals `layOutLikePoem(L, P)` on every pair above (MEASURED true on six pairs; the line-break condition of section 5, item 3 relies on it).

## 7. Gates, ceilings, commit

Run the eight gates on the branch head first and say if any differs from this table. web-test is 2802 at `5efa88bd` (the row 106 report, `report-code-row106_r1_2026-10-19.md:50`, and MEASURED again by the desk in a scratch copy: 160 files, 2802 tests); `9cbcfa44` changes only `GuideContent.svelte`, so if the head's count differs, the head's number is the baseline. The other rows are the row 106 report's final tree (`:47-54`).

| Gate | Baseline |
|---|---|
| phonology | 267 |
| dictionary | 248 |
| web-check | 0 errors, 12 warnings in 5 files |
| web-test | 2802 |
| score-parser | 709 passed, 5 skipped |
| blurb | 145 |
| integration | 55 |
| ratchets | OK (`+page.svelte` 5643, `pipeline.ts` 1060) |

A web-test rise is the new tests, counted per file; a changed test (k) is named. Ceilings: `+page.svelte` 5652; `pipeline.ts` 1060, **and it is at its ceiling**, so Part C pays for itself there: move `autoDetectBoundaries` (`pipeline.ts:749-793`, 45 lines) into a new module beside it with the music step, reaching the clitic sets through parameters the pipeline passes in (the `typed-hyphens.ts` pattern, DESK DEFAULT: the guardrail at `pipeline.ts:9-10` keeps the engine's import in one file, though `old-spelling.ts:26` already imports it), and lower the ceiling if the file falls; `engine.ts` 2291 (Part C item 5 edits one line in place); `InspectorPanel.svelte` 2432 (not touched). Playwright `--project=phone` (17 passed, 1 skipped) and `--project=chromium` (72 passed, 2 failed, of 74), as row 106 ran them (`report-code-row106_r1_2026-10-19.md:58-63`); the two known failures (`e2e/insights-page.test.ts:95`, `e2e/singer-paths.test.ts:169`) are not this row's.

Commit in three steps, each pushed: "Row 108 C: phrase ends come from the music where the score places the word"; "Row 108 A: Lyrics of several lines seat"; "Row 108 B: Lyrics takes the poem's line breaks". Run the gates after each.

## 8. Lane rules

Commit and push only `cloud-lane-11`; never `Shane` or `main`; no pull request; never edit anything under `docs/memory/`. No new user-facing string. Nothing ratified says Ilya re-lines Lyrics, or that the sound follows the music; if a line is needed (a note that Lyrics now follows the poem's lines, a way back to one line, a Guide sentence on phrase ends), write it as an open item for Dann in the report, not in `i18n.ts` or `GuideContent.svelte`. One report, `docs/sessions/report-code-row108_r1_2026-10-19.md`.

## 9. Decided by the desk (each a DESK DEFAULT, Dann's to wave off)

1. **Phrase ends.** Default 7 (Dann 2026-10-16 00:32, `OPEN.md:2787`) rules that Text transcribes Lyrics; the desk's reason there is that a word's IPA depends on its sung neighbours and phrase ends, and the desk held r1 because re-lining would put the poem's line ends into the engine (`QUEUE.md:16`). Part C makes the music's phrase ends the engine's wherever the score places a word, and keeps a line end a phrase end everywhere else. Built first, with the measured cost in section 3: on the two fixtures, one word's IPA on a shipped Lyrics («такъ», and only once item 1 lets the score seat), and none caused by a line break once it is built.
2. **Re-lining without the singer's act.** Ruled by default 4 (`OPEN.md:2784`): *"Lyrics adopts the poem's line breaks where a poem is given."* Built as section 5, item 3, on line breaks that are Ilya's only; where `layOutLikePoem` returns null, Lyrics stays and nothing is said.
3. **How much agreement before re-lining.** r1's default was any matched word. MEASURED, that re-lines Lyrics against an unrelated poem that shares a few short words: Tchaikovsky's Lyrics against the Pushkin quatrain (3 of 95 matched, «я», «какъ», «какъ») becomes 6 lines of `9,1,15,1,3,66`; «Within Four Walls» against Tchaikovsky's text in lines of seven (2 of 39) becomes `15,1,1,22`. So the desk takes the stricter answer: **re-line only where at least half of either text's words match**, the desk's number, not Dann's. Measured cost: every real pairing in the tree passes (the stand-in 39 of 39 and 95 of 95; row 104's text 32 of 39; a Lyrics that sings the poem three times, 39 of the Poem's 39), every unrelated one is refused (largest share 3 of the quatrain's 15); a song whose composer changed more than half the poem's words keeps the score's one line. No text in the tree sits near one half.
4. **Undo.** Re-lining changes only line breaks, never a word, so it loses nothing the score cannot give back. Code measures and reports both undos (section 5, item 6); no control, no string.

## 10. What the brief could not establish

NOT ESTABLISHED beats a complete invented answer.

- **A real published poem against either score.** No published poem is in the tree; the stand-in, row 104's text, and the Pushkin quatrain are test texts. Whether real pairings pass the one-half test is not known.
- **Part C on a score with a breath mark, a caesura, or a fermata.** Neither fixture carries one (section 2); test c builds its own.
- **A word whose IPA Part C changes because a voiced final obstruent precedes a vowel or a sonorant across a rest** (the change test a builds): neither fixture has one, so the measured change count is small because of the fixtures, not because the rule rarely bites.
- **Clitic chains across a line end.** A line ending in a proclitic still reads differently from one line after Part C (clitic merging stays per line); and today, with or without Part C, «из\nдома» shows «из» as `→` with no host (MEASURED; `pipeline.ts:958-1051`). Pre-existing; not this row's.
- **A silence with no rest event**, which an OMR-read score may produce where a rest is lost: excluded by DESK DEFAULT; no scan was run.
- **Whether Tchaikovsky seats nothing on arrival in the browser today**, as the unit run shows; not driven in a browser.
- **Whether any drawn surface reads the resolver's fallback (`vowel-resolver.ts:475`) while Lyrics holds the score's words**, where Part C's IPA and the fallback's could differ.
- **Whether the Inspector's transcription log shows a voiced final** such as `pɑ ˈlʲod`: the post-process updates the log for devoicing only (`pipeline.ts:902-915`), today and after Part C.
- **Whether either undo reaches a Lyrics text Ilya rewrites** (section 5, item 6).
- **The re-keying of fold seats on a score with more than one fold**: «Within Four Walls» has one, Tchaikovsky none.
- **Whether `healFrozenSeats` (`+page.svelte:2129-2136`) touches a seat re-lined this way**; not traced.
- **The Lamm scan in this lane**: row 104's reader did not finish in 1500 s (`report-code-input-two-views_r1_2026-10-16.md:23`); a wordless score seats by `firstPass`, whose seats Part C reads like any other.
- **WebKit and Firefox**: not run here.
