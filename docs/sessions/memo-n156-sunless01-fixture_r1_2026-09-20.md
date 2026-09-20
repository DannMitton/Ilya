# Memo: N.156, the Sunless 01 fixture gets its final syllable

2026-09-20. Supersedes my earlier stop-and-ask version of this memo. No git command that writes
was run. No new file except this memo.

## What was wrong

Scan collation (both pages of `tools/e16-harness/scans`): **the file has every note.** The scan
seats «В бью-» on one E quarter (bar 8); the file seats «в» alone on it, so every Cyrillic
syllable after it is one note late and the poem's last syllable, «я», has no note. That is
N.111's clitic case, and Ilya's clitic seat already repairs the slide at load. What it could
not repair was the last word, because the file never carried the «я».

## What changed

1. `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`, last vocal note,
   lyric line 1: `ка` middle becomes `кая.` end. The word is now «одинокая.» Nothing fused; the
   clitic seat still does the «в бью» fold. Lyric line 2 (IPA) is untouched.
2. `apps/web/src/lib/shane/clitic-seat.ts`, the run in `foldAt`: the score's last word may
   arrive one cell short of its slots (the offset falls to 0 there). That is the same slide
   reaching its end, so the run now stays open through the last note and «я.» lands on it. Before,
   the run stopped before that word and left the last three notes unseated.
3. Tests that encoded the absence of the «я» were updated (list below).

## Result, measured

After the seat: notes 91 to 95 read `о ди но ка я.`, five syllables on five notes, no note
blanked, the run is 60 notes (was 59). On the raw parse the last syllable is `end`, so the
eighth line-end hyphen is gone.

## Gates

| gate | baseline | now |
|---|---|---|
| phonology | 216 | 216 |
| dictionary | 235 | 235 |
| web-check | 0 errors, 12 warnings, 5 files | same |
| web-test | 1263 | **1265** |
| score-parser | 575 passed, 5 skipped | 575 passed, 5 skipped |

**web-test +2**: two tests added. `~/Downloads/ilya-ship.sh` needs `1265` (I did not edit it).

Expected values that moved, and why:
- `clitic-seat.test.ts`: run length 59 to 60, last seated note is cell 95, queue 95 to 96 slots,
  last slot `я.`; "seats every fold" and "mutates nothing" 59 to 60. The punctuation test now compares
  the marks themselves (the closing cell was `кая.`, now `я.`).
- The three tests about the blank channel (a note the queue cannot reach) now run on
  `truncatedXml`, the file as it was, built in the test by reversing my one edit. **The
  mechanism keeps its coverage; the fixture no longer exercises it.** Two new tests cover the
  complete file.
- `score-seat.test.ts`: word count text ends `одинокая.`; queue 95 to 96; standalone (no clitic
  seat first) the closing word is withheld, so seated 95 to 91 and withheld 0 to 5; the cut-word
  test 2/92 to 7/88.
- `punctuation-slot.test.ts`: punctuated 14 to 15, and the fold's punctuation list gains a final `я.`.

## NOT ESTABLISHED

- The raw cell `кая.` holds two syllables in one cell. It works because the seat re-syllabifies
  from the word; a raw, unseated render of this fixture shows `кая.` on the last note.
- Lyric line 2 (IPA) still lags line 1 from note 13 and carries two `#` cells. Not reconciled,
  since Ilya transcribes from the Cyrillic; say if you want it done.
- Not walked in a browser. I did not run the app.
- The seat change is general (any file whose last word is one cell short after a fold), and I
  tested it on this fixture only.
