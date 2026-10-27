# Report: Code, N.194 r5, step 3 (from a unit to a place in the Lyrics text), 2026-10-26

Lane `cloud-lane-15`, after step 2. Read and run in the Linux cloud sandbox at `Shane` `54c01bc3` plus this lane. Nothing under `docs/memory/` was edited, the brief and its companions were not edited, and no approval was re-approved.

## What I changed

- `apps/web/src/lib/pipeline.ts` (**925 of 925, no net line**): `splitIntoPreLines` (`:169`) is now exported and returns `spans: TokenSpan[]` beside `words`, parallel to them: the raw token each word came from. `processText` and `wordGrid` ignore the extra key and return what they returned. The import at `:42` takes `tokenSpans` and the `TokenSpan` type; the peel call, the `expanded` map, and the `return` each changed in place. The header comment of the function now says it has a third reader.
- `apps/web/src/lib/syntactic-break.ts`:
  - `tokenSpans(line)` (new): the line's tokens with start and end offsets, from `matchAll(WORD_TOKEN)` over the UNTRIMMED line, so a leading space keeps its offsets (the review's amendment 5, with section 5a's `WORD_TOKEN` in place of `/\S+/g`, as the brief says).
  - `peelSyntacticBreaks` is now generic over token objects and returns `source`: the token each word came from. This replaces step 2's `splitTypedWords`, which is gone.
- `apps/web/src/lib/text/break-text.ts` (new, 104 lines): `tokenEndOffset`, `insertBreak`, `removeBreak`, `unitStart`, `BREAK_MARK`. Every offset comes from `splitIntoPreLines`; nothing counts newlines or splits on whitespace.

**The tokenizer is still the one tokenizer.** `splitIntoPreLines` decides what a word is; `tokenSpans` and `peelSyntacticBreaks` are what it calls. `String.split(WORD_SPLIT)` in the pipeline (step 2) became `matchAll(WORD_TOKEN)` here, so `WORD_SPLIT` has no caller in `src` yet; step 4's `same-words.ts` takes it. The two patterns agree on what a token is (a test pins both on the same inputs).

## The rules `removeBreak` follows

For a unit `[firstWord .. endWord]` in transcribed coordinates:

- Every `#`, with the ` ` run immediately before it, in the raw token of each word of the unit (trailing, inside, or leading), **except** a leading run on the unit's FIRST token, which step 2 reads as the previous unit's.
- Every token between the unit's first token and the next word that is only marks goes, with the whitespace run before it: «вас # благодать» becomes «вас благодать».
- A leading run of `#` on the next word goes (step 2 reads it as the unit's).
- Nothing else moves. A `#` on another unit, and every other line, are untouched.

I found the "except" rule by reading my own first draft: it would have deleted the previous unit's mark in «слово #вас» when removing the break from «вас». A test pins it («слово #вас благодать»).

## Tests added, and which failed before

`apps/web/src/lib/text/break-text.test.ts`, **32 tests**. Gate 4 moved 3150 to 3182, which is 32.

**Done-when 1 (offsets).** Song 1 is the fixture `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` (Dann's engraving, the one `score-seat.test.ts` reads; `scoreWordsText(collectScoreWords(score, 1))`, 39 words in one line, which I counted). The desk's assumption in the brief ("assumes, NOT ESTABLISHED, that this is the song 1 the desk used") holds as far as the words go: it opens «Комнатка тесная, тихая, милая;». Every one of its 39 words ends at the end of its own token. The hand-written text is `'\n  Комнатка тесная,   тихая\n\nвот-вот велит-ли  дом\r\nя # не в силах'`: a blank line first, a leading space, an extra space, a blank line between, a hyphenated particle, a `\r\n`, and a glued mark. The expected tokens are written out by hand, not derived from the code under test.

**Done-when 2.** Insert then remove returns the text byte for byte, at every unit of four texts (one with blank lines, a leading space, `\r\n`, and a comma), and on song 1 at «Комнатка»; the inserted text is ` #`.

**Done-when 3.** Fourteen typed shapes («вас #благодать», «ва#с благодать», «вас # благодать», «вас ##благодать», the glued forms, «вас # # благодать», «не # в силах», «не #в силах», «не в# силах», «сказал # бы он», «сказал бы # он», «велит-ли # дом», «благо#дать»): the unit reads as placed before (`boundarySource 'user'`), Remove gives exactly the text without the mark, the unit reads as not placed after, and the IPA equals the unmarked text's IPA. "The pill's state returns to `'insert'`" is tested through the engine's verdict on the unit's last word, which is what step 4's state reads.

**Failing on the mutants** (each applied to `break-text.ts`, the file run, then restored and diffed identical):

| mutant | result |
|---|---|
| counts newlines (raw line = transcribed line) | 13 failed, including the blank-line text, the hyphenated particle, and the round trip |
| r4's removal (an attached `#` at the token's end, or a following token that is only `#`) | 6 failed: «благо#дать», «ва#с благодать», «вас ##благодать», «вас #благодать», «вас # # благодать», «не #в силах» |

The brief's "each fails on r4's removal" holds for «вас #благодать» and «ва#с благодать». «вас # благодать» does NOT fail on r4's removal, which does handle a following token that is only `#`; it is there as a regression case, as the brief named it.

**Also pinned:** the glued form is one token, and the end of «Комнатка # тесная» is the index after the `#` (section 5a, site 2); a word that is not there has no offset; Remove touches only its own unit and line; a mark inserted at a unit's last word makes that word the singer's boundary and no other.

## The spans settle step 1's open case

Step 1 reported that «слово- слово» (a hyphen on the left word, a space after it) reads as a joiner, because `punctuation` is `-` and the tokenizer kept no record of the space. The spans now carry that record, and two tests pin it: the two words of «велит-ли» share one span object, and the two of «слово- слово» do not. A door that read `span` would not mistake the second for a joiner. **I did not wire it in.** Doing it takes `span` onto `PreTranscribeWord` and `WordStackData`, or a spans argument to both doors, in files that are at or near their ceilings, and it changes which words the pre-flag door joins. It is Dann's call whether a typed «слово- слово» matters enough; the cost is small now that the spans exist.

## Section 5, item 4: the whitespace grep, re-run

`grep -rnE 'split\(|matchAll' apps/web/src packages/score-parser/src --include=*.ts --include=*.svelte`, read hit by hit.

**On the brief's list, with the step that handles each:** `pipeline.ts` tokenizer (step 2, site 1, and here); the `#` strip (step 2, site 3); `same-words.ts:29` (step 4, site 4); `poem-compare.ts:103` (step 4, site 5); `songs.ts:53` (step 4, site 6); `page-config.ts:219`, `selection-ring.ts:377`, `Loupe.svelte:584`, `tessituragram-layout.ts:670`, `loader.ts:479/:736/:748`, `mnx-parser.ts:1147` (site 13, not affected).

**Hits the list lacks, each read and not affected:**
- `IntakePanel.svelte:174` and `+page.svelte:1718`: `split('\n')` to count non-blank lines of the Poem. Lines, not words.
- `gloss-survival.ts:29`, `witness-lines.ts:100`, `correction.ts:711`: `split('-')` on an id such as `"1-2"`. Not Lyrics.
- `composers-poets.ts:101/:168/:199`, `sources.ts:404`, `musicxml-parser.ts:102`, `tempo-terms.ts:186`: names, citations, ending numbers, tempo marks.
- `pairings.ts:935`: `split(SYLLABLE_SEAM)` over a word's IPA, not Lyrics.
- `syllable-utils.ts:22/:26`, `InspectorPanel.svelte:534/:921`: `split('')` into a character set.
- `omr/*`, `insights/*`, `markup/*`, `TitleHeader.svelte:208`, `OutsideNote.svelte`: display strings and XML.
- Not a split but a whitespace pattern on text that can hold a word: `analysis/watchlist.ts:628` trims `[\p{P}\s]` from a word's edges, which takes a trailing ` #` too. Not affected.

Nothing the list lacks needs a change. `splitIntoPreLines` (through `tokenSpans`) and section 5a's two patterns are now the only places that decide what a token is, apart from the five sites step 4 still has to move onto `WORD_SPLIT` or `WORD_TOKEN`.

## The eight gates

Baselines are the task's, measured on `Shane` at `54c01bc3`; my own run before step 0 matched all eight.

| gate | command | baseline | after step 3 |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 291 passed (291) | 291 passed (291) |
| 2 | `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) |
| 3 | `pnpm --filter @ilya/web check` | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 3057 passed (3057) | **3182 passed (3182)** |
| 5 | `pnpm --filter @ilya/score-parser test` | 775 passed \| 5 skipped (780) | 775 passed \| 5 skipped (780) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | ratchets: OK. | ratchets: OK. |

Gate 4 against step 2's 3150: +32, all in `text/break-text.test.ts`. The approval corpus is inside gate 4 and did not move; every gate-4 test that passed at step 2 still passes, which is the proof that `processText` and `wordGrid` return what they returned. Ceilings: `+page.svelte` 5581 of 5597, `pipeline.ts` **925 of 925**, `Loupe.svelte` 3012 of 3013. None changed.

## Where would this wall a singer in? (step 3's part)

- **Remove deletes a `#` the singer typed elsewhere in the unit.** In «не #в силах» the `#` stands on «в» and Remove takes it. That is what the unit means, but the singer sees one press delete a mark they placed on a different word.
- **Remove cannot tell where a `#` came from.** A mark in «вас # благодать» that the singer typed and one Ilya wrote («вас # благодать») both go the same way, as they should.
- **A ` ` the singer cannot see.** The textarea shows it as a space; after Insert the text has a character that looks like a space and behaves like none. Copying Lyrics out of the field and into another program carries it.

## What I could not establish

- A browser: the Lyrics `<textarea>` with the glued form, copy and paste of the no-break space, and Print. NOT RUN.
- Whether the page's `lineIndex` for a unit is always the `lineIndex` of `splitIntoPreLines` after the page's own relining: both come from the same function over `doc.inputText`, and the tests use that text directly. Not run on the page.
- `seatCliticFolds` and `clitic-seat.ts`: NOT READ (unchanged from step 1).

## Strings owed to Dann

None. Step 3 adds no string a singer reads.
