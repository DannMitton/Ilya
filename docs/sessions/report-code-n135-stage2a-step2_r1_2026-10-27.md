# Report: N.135 stage 2a, step 2 (sewWords and writeLyrics, rowLanguage, UNDERLAY_READER), r1

Code (Sonnet 5.5), cloud lane, 2026-10-27. Same brief and review as step 1 (`report-code-n135-stage2a-step1_r1_2026-10-27.md`); this is modules 3, 4, and 5. Review amendments 5, 6, and 7 apply and are met as section 4 shows. Stage 2a is complete with this step; stages 2b and 3 are not mine.

## 1. The answer first

- **The parser reads what `writeLyrics` writes.** On `fixtures/tch-3.musicxml` with a hand-made seat list of 13 seats (10 syllables, 2 lone hyphens, 1 extender): before, the parser fires `no-lyrics-found`; after, it does not, the vocal part is `P1`, and `collectScoreWords(score, 1)` returns `Средь`, `шумного`, `бала,`, `и`, `гѣ`, `звучитъ!`, in that order, on the events of the first ten sung notes (`underlay-words.test.ts`, last describe).
- **Nothing else changes in the file.** With the 10 inserted `<lyric>` blocks taken out, the output equals the fixture byte for byte (same describe). The second part (`P2`) is untouched.
- **Old letters are written as read.** `гѣ`, `міръ`, `ѳома`, `ѵмнъ`, and `читъ!` come back unchanged (amendment 5).
- **`rowLanguage`** takes the dictionary as a function (amendment 6), with 13 tests on a stub dictionary.
- **`UNDERLAY_READER`** is in `stamp.ts`, not joined to `READER_STAMP` (amendment 7); `stamp.test.ts` passes and now also holds the two apart.
- **Tests:** `underlay-words.test.ts` 32, `underlay-language.test.ts` 13, `stamp.test.ts` 3 (one added); the web suite rises from 3,128 to 3,174, which is those 46.
- **Mutants** (not asked for these two modules; run anyway): 29, all killed. The first run left 1 alive (section 3).

## 2. The tree

- **Branch and commit:** `cloud-lane-16`. Step 1 is `d9584b28`. The commit that carries this report is the head of the push.
- **What the working tree held that I did not make:** nothing; `git status --short` showed only my files.
- **Not touched:** `docs/memory/`, the brief, its review, any approval file. `+page.svelte` 5,597 lines (ceiling 5,597), `pipeline.ts` 925 of 925, `musicxml-parser.ts` 1,167 of 1,167. No new string, no model file, nothing visible to a singer. No pull request.
- **New `omr/` files and their lines:** `underlay-words.ts` 168, `underlay-language.ts` 50 (and step 1's `underlay-rows.ts` 173, `underlay-seat.ts` 199); the test files are 294, 78, 216, 256. Each is under 1,000.

## 3. Each measurement

### Functions

| File | Signature | Tests |
|---|---|---|
| `underlay-words.ts` | `sewWords(seats: Seat[]): Word[]`; `writeLyrics(musicXml: string, words: Word[]): string` | 32 (`sewWords` 13, `writeLyrics` 12, the fixture proof 7) |
| `underlay-language.ts` | `rowLanguage(words: string[], isWord: (word: string) => boolean): 'russian' \| 'other'` | 13 |
| `stamp.ts` | `export const UNDERLAY_READER = 'underlay@0'` | 1 added to `stamp.test.ts` (3 in all) |

Types: `Word { syllables: Syllable[] }`; `Syllable { note, text, syllabic: 'single' | 'begin' | 'middle' | 'end', sustained }`.

### Gates, before and after (eight, run in this clone)

| Gate | Baseline in the task | Measured before any edit | After step 1 | After step 2 |
|---|---|---|---|---|
| `pnpm test:phonology` | 291 passed (291) | 291 passed (291) | 291 passed (291) | 291 passed (291) |
| `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) | 248 passed (248) | 248 passed (248) |
| `pnpm --filter @ilya/web check` | 0 errors, 12 warnings, 5 files | same | same | 0 errors, 12 warnings, 5 files |
| `pnpm --filter @ilya/web test` | 3057 passed (3057) | 3057 passed (3057) | 3128 (+71) | 3174 passed (3174): +32 words, +13 language, +1 stamp |
| `pnpm --filter @ilya/score-parser test` | 775 passed, 5 skipped (780) | same | same | 775 passed, 5 skipped (780) |
| `pnpm test:blurb` | 145 passed (145) | 145 | 145 | 145 passed (145) |
| `pnpm test:integration` | 55 passed (55) | 55 | 55 | 55 passed (55) |
| `pnpm ratchets` | OK | OK | OK | OK |

### The proof on the fixture

Expectation (written before the run, in the task): the parser finds the lyric part, `no-lyrics-found` does not fire, and `collectScoreWords` returns the seated words in order. Likeliest failure: the parser reads a `<lyric>` placed after homr's `<!-- imgpos -->` comment differently, or `collectScoreWords` keeps or drops the punctuation, so `бала,` and `звучитъ!` come back changed.

Result: as expected, on the first run; no failure. `collectScoreWords` keeps the punctuation (`бала,`, `звучитъ!`). The control in the same test shows `no-lyrics-found` firing on the original fixture, so the absence after is a change and not a property of the parser. A second test goes from boxes: ten tokens centred beside the fixture's own `imgpos` x, through `seatTokens` (`monotone`), `sewWords`, `writeLyrics`, and the parser, and returns the same six words.

### Mutants (`mutate.py`, `spec-words-language.json`, `mutants-words-language.txt`)

Expectation, recorded after the run, as in step 1: every mutant killed; likeliest failure a threshold with nothing between its old and new value.

First run: 28 of 29 killed. The one alive was `rowLanguage` with the Russian share lowered from 0.5 to 0.34: no test had a row whose share lay between a third and a half. I added one (two words in five, called `other`); the 29 are now all killed. The 21 `sewWords` and `writeLyrics` mutants include: a lone hyphen not joining, a trailing hyphen not continuing, joining hyphens kept in the text, an extender breaking the word, two tokens kept on one note, a rest written to, a note that already has a lyric written to again, text not escaped, the second part written to, rests not counted in the numbering, `number="2"` (laid out and compact), and always LF.

## 4. Departures from the brief

| Departure | Reason | Reversible |
|---|---|---|
| A syllable's `note` is the ordinal, from 0, of a `<note>` among the notes of the first `<part>`, rests counted | The brief says "each seated voice `<note>`" and does not say how a seat names its note. Document order is the one name a text edit can find without a parse, and it is what `NotePlace.id` carries from step 1. The caller (2b) computes it on the file it hands to `writeLyrics`, after `joinLookingAtPages` | Yes |
| `sewWords` does not sort; it takes the seats in reading order | A caller with several rows hands them one after the other, so a hyphen that ends a row carries the word onto the next (a test shows it). Sorting by x would interleave rows. `seatTokens` already returns one row in x order | Yes |
| Of two tokens on one note, the one nearer the head stays and the other is dropped | A note holds one lyric. The harness's scorer joined the texts of all tokens on a note (`score44.py`), which scores well and cannot be written as one syllable of a word. `seatTokens` reports `shared`, so the caller can count what is dropped. Not measured | Yes |
| A lone underscore token is an extender and marks the syllable before it `sustained`; the flag is not written | Brief item 3. Row 81's `sew` treated a lone `_` as a hyphen. See section 5 | Yes |
| `writeLyrics` writes only `<syllabic>` and `<text>`; no `<extend>` | The brief states the lyric as number 1 with syllabic and text. The parser treats a note with no lyric after a syllable as a sustain (`collectScoreWords`), so the sustain is read without it | Yes |
| The `<lyric>` is the last child of the `<note>`, after `<notations />` and homr's imgpos comment | MusicXML puts `<lyric>` after `<notations>` and before `<play>` and `<listen>`. None of the four fixtures holds a `<play` or `<listen` (0 of 4 files) | Yes |
| `writeLyrics` leaves a rest, a note that already has a lyric, a note outside the first part, and a second syllable for one note unwritten, with no error | The task says it adds a lyric to each seated voice note and leaves every other byte alone. It returns a string, so there is nowhere to report these; the caller's seats come from `sewWords`, which gives each note one syllable | Yes |
| `rowLanguage` does not modernize | Review amendment 6 passes `isKnownWord` in, and `@ilya/dictionary` stays behind `pipeline.ts`. The caller's `isWord` is where `modernisePreReform` goes (the doc comment says so) | Yes |
| `rowLanguage` asks the dictionary again with ё written е | Decision 1 folded ё on both sides of its lookup. Whether the real `isKnownWord` folds is the review's own open item. The second ask costs a call per ё word | Yes |
| `rowLanguage` returns `other` for a row with no word of two or more letters | Nothing to witness. The harness reported such rows apart; the signature has two values | Yes |
| `UNDERLAY_READER = 'underlay@0'` | DESK DEFAULT. The task fixes the name and says it is not joined; the value names no reader because 2b has not chosen one. `0` reads as "not wired" | Yes |
| `stamp.test.ts` gained one test | The task says it keeps passing; one assertion that `READER_STAMP` does not contain `UNDERLAY_READER` keeps amendment 7 from being undone by accident. The two existing tests are unchanged | Yes |

## 5. What I could not establish

NOT ESTABLISHED beats a complete invented answer.

- **A syllable divider against an extender.** Both can be a lone underscore. Row 81 treated it as a hyphen; the brief says it is an extender. Text cannot separate them; the box width over the staff space could. I classify it as an extender. If 2b finds the readers return underscores at all (stage 1 found they return a period, nothing, or the whole word), it should pass the class by geometry.
- **`isKnownWord` against my stub.** `rowLanguage` was tested with a `Set`. Whether the real `GraysonEngine.lookupStress` agrees with stage 1's 909,795-word set, and whether it folds ё, were open in stage 1 and the review, and are still open: I did not call it.
- **`seatScoreWords` and the page.** I proved the parser and `collectScoreWords`. I did not run `seatScoreWords`, the Input fill in `+page.svelte`, or Markup on the written file; that is 2b's "confirm on the real page". I did not re-locate the `+page.svelte` cites; they are 2b's.
- **A joined file.** The fixture is one page. `joinLookingAtPages` merges pages and drops restatements; the ordinals must be taken on the joined file. Not run.
- **Other consumers of the MusicXML.** The mini-dom parser reads the output. Verovio, MuseScore, or Finale reading a `<lyric>` placed after homr's comment were not tried.
- **A scan.** Nothing in this step was measured on a real reading of a real page. The fixture's seats are hand-made.
- **Verses.** Only lyric number 1 is written; a second verse is stage 3's.

## 6. The files

New under `apps/web/src/lib/omr/`: `underlay-words.ts`, `underlay-words.test.ts`, `underlay-language.ts`, `underlay-language.test.ts`. Changed: `stamp.ts` (one constant and its comment), `stamp.test.ts` (one test).

Under `docs/sessions/measure-n135-stage2a_2026-10-27/`: `spec-words-language.json`, `mutants-words-language.txt`.

Cites that moved since the brief (re-located by name, `d9584b28`):

| Brief cite | Now |
|---|---|
| `musicxml-parser.ts:335-345` (lyric part), `:343` (`no-lyrics-found`) | "Vocal-part identification" `:321`, `lyricParts` `:322-325`, `no-lyrics-found` `:329` |
| `vowel-resolver.ts:243` `collectScoreWords`, `:157` `CYRILLIC_VOWEL` | `:224`, `:159` |
| `stamp.ts:18-23`, `:23` | unchanged for `READER_STAMP` (`:23`); `UNDERLAY_READER` follows it |
| `pipeline.ts:264-266` `isKnownWord` | `:225-227` |
| `pipeline.ts:544-571` (modernization gate) | in `readSpelling`: `modernisedCandidate` `:533`, `candidateIsKnown` `:534`, the return `:579` |
| `ocr-guard.ts:59`, `join-pages.ts` `placeOf` | `:59` unchanged; `:439` |

Stage 2a is on `cloud-lane-16`. I have stopped, as asked.

**Addendum, step 3 (2026-10-27):** the desk's amendment to `seatTokens` (monotone, surplus tokens) arrived after steps 1 and 2 were both pushed, so it could not be the first act of step 2 as the desk asked. It is applied in step 3, in its own commit, with its report (`report-code-n135-stage2a-step3_r1_2026-10-27.md`). `Seat` gained `unseated`; `sewWords` already dropped a syllable with no note, so it drops an unseated one, and the caller sees it in the seat list.
