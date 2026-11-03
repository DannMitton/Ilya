# Report: N.135 scan vowel rules, step 4, the rule enforced (cloud lane, branch cloud-lane-28, 2026-11-02)

Read on `cloud-lane-28`, parent `ccb9f17` (step 3), from `f9797ac`. The tree was clean before this step. Every line number below was read in this tree.

## What changed

One shared check, `apps/web/src/lib/omr/assert-vowel-per-note.ts` (`hasVowelLetter`, `assertVowelPerNote`), and four mechanisms that all ask its question. **The two paths agree in effect (no vowelless text under a note), not in mechanism:** the scan drops, typed text folds the piece into its neighbour, a file's lyrics join their host on arrival.

### Every path that writes text under a note, and the line where it passes the check

| # | Path | Where it passes the check | Mechanism |
| --- | --- | --- | --- |
| 1 | **The scan** (`seatPage`, the rescue row, `underlay-fallback.ts`) | `omr/underlay-page.ts:222` `assertVowelPerNote(units, wholeTokenOf(...))`, on `units` before `seatTokens` (step 1). `vowelsPerNote` at the page's end stays as the after-seating count and now reads 0. | dropped, counted in `stats.dropped` |
| 2 | **Typed Lyrics and Poem, the Loupe, Corrections, the heal, every re-seat** | `score/pairings.ts:231` `foldVowellessPieces` (`score/slot-pieces.ts`, which calls `hasVowelLetter`), inside `buildSlotQueue`'s per-word loop. | a vowelless piece joins the piece before it in its word, or the next if it is first |
| 2a | the writers that copy a slot from that queue (read, each `kind: 'syllable'` literal): `firstPass` `pairings.ts:334`, `refreshPairings` `:472`, `placeSyllable` `:1381`, `applyCliticSeat` `clitic-seat.ts:386`, `reseatByDiff` `reseat.ts:217` and `:315`, `seatScoreWords` `score-seat.ts:146`, `applyHeal` `heal.ts:470` | each copies `slot.cyrillic` (plus, in two, the file's own trailing punctuation, which has no letter), so none can carry a piece the queue never made. `placeFromHere`, `seatWaitingScore`, `reseatOnReplace`, and `drawPairings` call these (as the review names them; I did not trace those four, see below). | by the queue |
| 3 | **A file's own lyrics on arrival**: MusicXML, MNX (`ingest.ts:287` and `:296` both call `toOutcome`), and `.mscz` (converted by `scoreReader`, then the same `parseMnxText`/MusicXML route) | `score/ingestion/ingest.ts:310` `withVowelPerNote(...)`, which calls `foldVowelessSyllables` (`score/ingestion/vowelless-fold.ts`), after `withDictionMarksFolded`. | a vowelless syllable joins its host in the fused form (U+00A0): a proclitic (`GraysonEngine.proclitics`) the next syllable that holds a vowel, anything else the one before it; its note is left with no syllable and nothing after it moves; with no host in the verse it is not drawn and `console.warn` counts it |
| 3a | the draw sites `staff-renderer.ts:1028`, `:2429`, `:3149` | they read `cyrPreview ?? syllable.text`: the pairings (path 2) or the repaired score (path 3). Nothing to change in them. | by 2 and 3 |
| 4 | **The check itself** | `omr/vowels-per-note.ts:81` no longer skips a `continuation` note that holds letters and no vowel; the empty-text skip (`:70`) is kept. | reports |
| 5 | **Fixtures** | `score/ingestion/fixture-rule.test.ts`, new `describe('the tracked files, after arrival through the real parser')`: runs `ingestScoreFile` (the real MusicXML parser, the `#` fold, the vowelless fold) over every tracked fixture that has Cyrillic lyrics, with **no** `ALLOWED` list. The raw-file check above it keeps `sunless-01-finale-lone-v.musicxml` and `n188-markings.musicxml` as named inputs that breach the rule on purpose; the new block's comment says so, and two tests repair exactly those two. | tested |

I found **no writer beyond the brief's list.** Two things the brief did not say: the file-arrival fold lives in `apps/web/.../ingestion/`, not in `packages/score-parser` (the parser package cannot import the app, and the clitic list `GraysonEngine.proclitics` is read there), and the scan's text reaches the score through `applyUnderlay` (`omr/underlay-song.ts:73`, called at `homr-reader.ts:404`) from the checked `page.words`.

### The details that matter

- **Cyrillic verses only on arrival.** The first version of the file fold dropped 94 syllables of Sunless 1's second verse, which is IPA (Latin letters, none a Cyrillic vowel). `foldVowelessSyllables` now repairs a verse only if it holds a Cyrillic letter, as `isCyrillicVerse` does. A unit test pins this.
- **When a note loses its verse-1 text but keeps verse 2** (the lone «в» in the copy of Sunless 1), the note's `syllable.text` becomes the verse-2 text, because the primary text mirrors the lowest remaining verse. Readers that want verse 1 must read it by verse number.
- **`slotIndex`** in `buildSlotQueue` now counts the slots emitted, not the engine's piece index. They agree wherever nothing folded (every existing test), so `begin`/`end` still read from it.
- **`pairings.ts` ratchet.** My first version took the file to 1453 lines (ceiling 1422), so the work moved into `score/slot-pieces.ts`; `pairings.ts` is 1420 lines, under its ceiling.

## Pins changed in this step, with was and now

| Pin | Was | Now |
| --- | --- | --- |
| `omr/vowels-per-note.test.ts` ("does not report a continuation with no vowel") | a continuation «в» is not reported | a continuation «в» is reported `no-vowel`; two vowels still reported; empty text still not |
| `analysis/diction-fold-live.test.ts` ("leaves the sung verse exactly as the file prints it") | the sung verse after arrival equals the file's, text and words | equals the file's except the lone «в»: it joins «бью» ("в бью"), its note has no verse-1 syllable, nothing after it moves; no word «в» remains. Read by verse number, for the reason above |

Pins changed in steps 1 to 3 are in those reports.

## Tests added

`omr/assert-vowel-per-note.test.ts` (step 3), `score/queue-vowel-per-note.test.ts` (5: a vowelless piece folds left, folds forward when first and keeps `slotIndex` 0, carries the punctuation, leaves ordinary words alone, `firstPass` hands no vowelless text to a note), `score/ingestion/vowelless-fold.test.ts` (8), and the arrival block of `fixture-rule.test.ts` (one test per tracked fixture, plus the two repairs). **Mutants run:** with the fold in `slot-pieces.ts` disabled, 4 of the 5 queue tests fail; with the `ingest.ts` hook removed, 5 arrival tests fail (the copy, `n188-markings`, the backup, and the two repair tests). Both restored.

## Gates, on the final tree of this commit

| Gate | Result |
| --- | --- |
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 type check | 0 errors, 12 warnings |
| 4 web | 3891 passed, 1 skipped (3892), 222 files (baseline 3843: +48 across the four steps) |
| 5 score-parser | 785 passed, 5 skipped (790) |
| 6 blurb | 148 passed |
| 7 root integration | 98 passed |
| 8 ratchets | OK |
| build | exit 0 |

Two earlier runs failed and were fixed before this one: the ratchet (`pairings.ts` over its ceiling) and 5 type errors (`lastInLine` assigned inside a callback narrowed to `never`; the loop is a `for`).

## Which of rule 1's losses is a truth-file breach

**NOT ESTABLISHED.** The brief names song 5 p18 s3 «сп» (a vowelless syllable on its own note in the truth). The truth files and the desk's ledger are not in the cloud tree, so I cannot read that note. By this step's rule such a truth note is a breach the desk should expect: the new arrival check, run over the 16 truth files on the Mac, will report it.

## What I could not establish

- **The row 114 effect** (363 of 590 expected). It needs the PDFs and a browser read.
- **Whether `placeFromHere`, `seatWaitingScore`, `reseatOnReplace`, and `drawPairings` reach notes only through the queue.** The review names them; I read the eight `kind: 'syllable'` sites that write pairings and found each copies a queue slot. I did not read those four functions.
- **A stored scan's restore** (`omr/restore.ts`): whether a restored reading re-enters through `ingestScoreFile` or `applyUnderlay`. Both are covered if it does; I did not trace it.
- **Whether a clitic at the end of a verse should find a host across a line break.** The file does not mark lines, so a verse-final clitic is not drawn rather than reaching back (enclitics reach back anyway). A desk default I applied as the brief wrote it.
- **The resolvers' view of the emptied note.** A note left with no syllable looks like a melisma continuation to a vowel resolver, which sustains the previous vowel across it. That is the musical reading for an enclitic's note; I did not measure the per-vowel effect.
- **Lead (not a change): does homr give a piano-staff box on this path?** What I read, not ran: `underlay-band.ts:5-9` defines the lyric band as the rectangle from the voice staff (A) to "the staff below it, the piano's upper staff (B)", and `systemsOf` (`:117-135`) takes the staves of the page (`PlacedStaff[]`) and finds B's top line "in the ink; absent, B's own `staffIn` line is used". So the layout already holds a box for B, and a y test of a token against B's top line looks possible. I did not establish whether «Дудка» lies inside the band (between A and B) or over B's own staff; the first would make a y test against the band's lower edge insufficient.
