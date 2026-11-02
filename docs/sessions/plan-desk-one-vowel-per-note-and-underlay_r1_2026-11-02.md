# Plan: one vowel per note enforced everywhere, and the underlay losses on row 114 (desk, Opus, r1, 2026-11-02 14:3x)

Draft by the desk. Serves THE ONE THING (`docs/memory/STATE.md`): words from a scan to 9 of 10 on row 114 (531 of 590 on the first file; the second file stays sealed for the gate).

## The rule (CONTRACT.md §0.1, Dann 2026-10-29 01:18; 2026-11-02 13:46, 14:27, 14:34)

One vowel per note, no more and no less, on every path that writes text under notes. Three breaches, each a mistake: a syllable with no vowel under a note; a note with more than one vowel; a sung note that is not a continuation (tied into, under a slur's melisma, under an extender) and carries no syllable. The print decides which note a syllable takes; the rule checks; the singer repairs what is left. Typed paths, with no engraving, move a second vowel one note right and cascade.

## Where things stand (read 2026-11-02)

- The scan path cuts multi-vowel tokens with the engine's syllables before seating (`apps/web/src/lib/omr/underlay-units.ts:2-7`), so a note with two vowels there is rare; the count on row 114 is NOT ESTABLISHED.
- The check `omr/vowels-per-note.ts` reports no-vowel and many-vowel notes and skips notes with no text, so the "none" breach is never counted; on the scan path it only counts (`underlay-page.ts:235`).
- Row 114 first file after row 176's two rules (scratch measure, `fix2`): 363 of 590 exact. M-a (`~/Downloads/_desk-2026-11-02/ma/report-desk-ma-row114-residual-causes_r1_2026-11-02.md`): 57 syllables in 10 systems where no lyric row was used (about 15 in short rows the fallback refuses, `underlay-fallback.ts:29`; 42 in 4 clean-looking systems, cause NOT ESTABLISHED); 64 no token carries the syllable (28 missing words, 10 glued at punctuation, 27 of the 64 in two song 2 systems read as junk); song 4: 14 shifted one note right with the run's first note empty, 4 shifted left, one true swap.

## Steps, in order

1. **Row 176, running** (`cloud-lane-28`, brief r3): no vowelless syllable under a note on any path; a token far from every sung note is not a lyric; one shared check on every writer. Done when the desk's measure of the lane reads at least 363 (one or two notes either side is noise).
2. **Measure before brief** (one Sonnet helper, scratch on `Shane` after row 176 merges, row 114 first file, each layer alone and then together, about 150k tokens at worst):
   a. the check counts all three breaches; record how many of each the scan path writes today;
   b. local repair: where an empty sung note sits beside a displaced or surplus piece, re-seat that one word by its own ink, never sliding the rest of the line (song 4 p13 to p15 first);
   c. systems with no lyric row used: the fallback's three-word minimum for short rows; for the 4 clean systems, capture the reader's tokens and boxes first (Fable's R10, the per-syllable ledger on the app path) so the cause can be read;
   d. words glued at punctuation with no following space split before seating (`underlay-tokens.ts:45-65`).
3. **One brief, row 177**, built from the layers that measured as gains, plus the check's two other breaches on every path, with a test over every tracked fixture and the desk's run over the truth files on the Mac. One Fable review (about 200k at worst) covers it (DESK DEFAULT: the separate review of a step 5 for row 176 is dropped to save one review).
4. **Cloud lane, Sonnet**; the desk merges, runs the eight gates and the row 114 measure, and gives Dann one ship paste.
5. **Beside it, the reader's letters:** M-b (self-ensemble) and R4 (PP-OCR bake-off) are measuring now; a brief follows only for one that clears Fable's bar.
6. **The gate:** 531 of 590 on the first file, then the sealed second file, once.

## Not established

The count of many-vowel notes on the scan path today; the cause in the 4 clean systems; whether local re-seating recovers song 4's shifts; every gain above until measured.
