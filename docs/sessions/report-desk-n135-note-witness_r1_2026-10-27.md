# Report: the note-count dictionary witness on the N.135 harness (helper, 2026-10-27, r1)

Measure only. No git command was run, nothing under `/home/claude/ilya/`, `/home/claude/n135-lever2/`, or `/home/claude/n135-row117/` was written, and every file I made is in `/home/claude/n135-witness/`. No path containing the held-out marker was opened, listed, or named. Every number names the log it was printed into; the logs are in the same folder.

## The answer first

1. **C2 as it stands:** (c) word-exact **812** of 2,385 truth syllable notes (also (b) exact 1630, (a) nucleus 1955), reproduced exactly (`log-step0-c2.txt`, `log-main.txt` line BASELINE).
2. **After the witness at distance 1 with k:** (c) **877** (+65); words replaced 138, replacements right 40 (35 exact, 5 right modern), wrong 32, 66 not judgeable against the truth; (b) 1612 (-18), (a) 1945 (-10) (`log-main.txt`).
3. **After the witness at distance 2 or less with k:** (c) **882** (+70); words replaced 172, right 47 (42 exact, 5 right modern), wrong 44, 81 not judgeable; (b) 1590 (-40), (a) 1931 (-24) (`log-main.txt`).

Against the desk's expectations (control rules, stated in full in their own section): k equals the truth's vowel count on 704 of 841 read aligned words (83.7 percent), so the first expectation (8 in 10) holds. The second does not hold in its second half: the gain under (c) is larger than the +39 of Step 2 (a different base, V3, so the two are not the same measure), but the wrong replacements are 32 (7 of them on words that were already right) against Step 2's 7 wrong plus 4 correct words replaced, and k leaves 297 of 435 candidate-bearing instances tied. The first-letter restriction lowers precision (55.6 to 49.3 percent at distance 1). Under (b) and (a) the witness does not gain: most of that loss is the re-seating, not the replacement text (re-seat-only control: (b) 1594 (-36), (a) 1938 (-17), (c) 810 (-2)).

## Setup

- Clone `/home/claude/ilya` (branch `measure-n194`, read only). The lever 2 harness and scripts were copied into `/home/claude/n135-witness/work/` with the hard-coded path `/home/claude/n135-lever2` changed to my folder (`sed`, nothing else edited in `lever2.py`, `step1b.py`, `step1c.py`, `neighbours.py`, `ledger_rederive.py`, `cut_engine.ts`, `cut_words.ts`). Reader F is `dfloat`, rule set R2, as in lever 2. I read the lever 2 report in full first.
- **Dictionary.** `data/dictionary.86d83340-a.json` and `-b.json`: one JSON array per line, `["word", {"s": stress, "e": English gloss, "f": French gloss, "p": part of speech, "l": lemma}]`; every one of the 943,106 parsed lines has all five fields, and **there is no frequency field** (`log-main.txt`, line DICTIONARY). Keys were folded as `ru.txt` was (lower case, ё to е, letters а to я). Keys with a hyphen, a space, a digit, or another non-letter (39,209 lines) were left out of the key set, because a sewn word has none of them and `lookupStress` would not match it; 52 keys of `singer-supplement.json` were added (the app consults it first). The result is 900,639 folded keys. `ru.txt` has 908,916 distinct entries after its hyphen removal, which includes hyphen-joined keys; I did not compare the two sets (NOT ESTABLISHED).
- **Agreement with the app's own test.** I called `GraysonEngine.lookupStress` through `tsx` (`work/lookup_check.ts`, dictionary injected with `setStressDictionary` and `setSingerSupplement`, `engine.ts:131` and `:136`) on all 1041 distinct folded sewn words: it finds 525, my key set finds 525, **0 disagreements** (`log-main.txt`, line LOOKUPSTRESS). A first version of my key set that kept hyphen and space keys, joined, disagreed on 581 words of 1,041; I corrected it and the first version's numbers are not reported (`witness.py`, `build_dict`).
- **Words.** 1787 sewn words in 228 Russian-labelled rows (lever 2's sewing, `sew2`), K and M included for the k table, membership, and replacements; the scoring covers 16 songs (K and M have no syllable truth). 900 words align one to one to a truth word (`word_align`); 60 more are one sewn word covering several truth words (a joined word; its truth count is the summed vowel counts); the rest do not align and are never counted right or wrong.
- **k.** The free notes of the row's system (every read note that is not a tie stop, as C2 uses) whose x lies in [first token's left minus half the gap to the previous word, last token's right plus half the gap to the next word), half-open; gap = max(0, next left minus this right). At a row end the extension is the half gap of the other side; a one-word row has none. Word extents that overlap give a gap of 0, so a note can count for two words. A count with no extension is kept as a sensitivity. Where k is 0 the read word's own vowel count is used and counted apart (`byk`, column "own k").
- **Ties.** Tie-break (1), my reading of the brief's clause (the clause is unclear to me, see the could-not-establish section): among tied candidates, the one whose key is fewest letters from its own lemma field, if that minimum is unique; else (2) unresolved, left as read. Counted apart in the witness tables.
- **Replacement in the seating.** C2 (`step1c.py`) with the replaced word's token units removed and the engine's syllables of the replacement spread across the word's extent in proportion to letters (`witness.py`, `build_units2`, `run_c2`). Right and wrong are judged only on aligned words. Exact right = equals the truth word's letters folded without `modernisePreReform`; right modern = equals the truth word after `modernisePreReform` (`norm`) and not exact. Credit (b), (a), (c) are lever 2's (Step 1b and 1c definitions).

## Step 0: reproducing lever 2 before any new number

Control rule 0 (written first, stamped `.t-rule0`, 2026-10-27 18:23:12 UTC): every number reproduces exactly; the likeliest failure is a path or import difference. **Every number reproduced.** The failure named did not occur.

From `log-step0-c2.txt` (`step1c.py`, run from my copy):
```
BASELINE rule 2: (b) 1622, (a) 1815, (c) 792 | rule 3: (b) 1552, (a) 1762, (c) 771
CONTROL (tokens, all read notes, nearest-note fallback, no cut) against rule 3: (b) 1552 vs 1552, (a) 1762 vs 1762, (c) 771 vs 771: REPRODUCED
C1 tokens with drop: (b) 1601 (-21 vs rule 2), (a) 1836 (+21), (c) 813 (+21) | systems where tokens outnumber notes 78 of 210, dropped 142, of which equal to a printed syllable of the row (proxy for a right one dropped) 42
   ALL | 2385 | 1622 -> 1601 (-21) | 1815 -> 1836 (+21) | 792 -> 813 (+21) | 78 | 142 | 42
C2 hybrid (engine cut of tokens with two or more vowels): (b) 1630 (+8 vs rule 2), (a) 1955 (+140), (c) 812 (+20) | systems where units outnumber notes 124 of 210, dropped 249, of which equal to a printed syllable of the row (prox
   ALL | 2385 | 1622 -> 1630 (+8) | 1815 -> 1955 (+140) | 792 -> 812 (+20) | 124 | 249 | 71
```
From `log-step0-v3.txt` (`step1b.py`, Step 2's witness on V3):
```
   baseline rule 2: (b) 1622, (a) 1815, (c) 792 | rule 3: (b) 1552, (a) 1762, (c) 771 | token-to-word map mismatches skipped: 0, 0
   V3 all three (engine cut, free notes, extent, drop): (b) 1457 (-165 vs rule 2), (a) 1925 (+110), (c) 806 (+14) | systems with more syllables than notes 69 of 210, syllables dropped 96
   PER SONG, V3 all three (engine cut, free notes, extent, drop): song | truth notes | (b) rule 2 -> new (delta) | (a) rule 2 -> new (delta) | (c) rule 2 -> new (delta) | systems over | syllables dropped
   ALL | 59 | 806 | 845 | +39 (notes gained 46, lost 7)
```

C2: (b) 1,630, (a) 1,955, (c) 812, as the brief gives. V3 witness at distance 1 under (c): 806 to 845 (+39, gained 46, lost 7). My witness driver re-ran C2 with no replacement before every variant and printed 1630/1955/812 each time (`log-main.txt`, `log-first.txt`, `log-reseat.txt`, line BASELINE).

## Control rules

Written before the run each governs, in `controls-before-measure.md` (stamps `.t-rule0` 18:23:12 UTC, `.t-rule2` 18:31:12 UTC before step 5, `.t-rule3` before the re-seat control, all 2026-10-27). Verbatim:

### Control rules, written before the run each one governs (helper, 2026-10-27)

Each rule is stamped by a file `.t-<name>` made in the same command, before the script it governs exists or runs.

#### Rule 0 (step 0, reproduction)
Every number reproduces exactly: C2 (b) 1,630, (a) 1,955, (c) 812 from `step1c.py`; the V3 witness at distance 1 under (c), 806 to 845 (+39, notes gained 46, lost 7) from `step1b.py` section 4. The likeliest failure is a path or import difference (hard-coded `/home/claude/n135-lever2` paths in the copied scripts). If a number does not reproduce, nothing after it is reported as a result.

#### Rule 1 (the note count k, and the witness)
1. The desk expects k to equal the truth word's vowel count on at least 8 words in 10 where notes were read (k at least 1) and the word aligns one to one to a truth word.
2. The desk expects the witness at distance 1 with k to gain more than the +39 of the V3 witness (that gain was on V3, not on C2; the C2 gain is measured here and compared with C2's own 812) with fewer wrong replacements, because k removes most ties.
3. Likeliest failure: a sewn word's x extent spans a neighbouring word's notes where the reader joined two words, so k is too large and the witness picks a longer word.
4. Second failure: pre-reform spellings not in the dictionary are corrected to modern words. Reported apart in a fourth column, "right modern" (the replacement equals the truth word after `modernisePreReform`, that is `norm`).

#### Design choices fixed before the run (DESK DEFAULT, each reversible)
- k: the free notes of the system (every read note that is not a tie stop, as C2 uses) whose x lies in [first token left minus half the gap to the previous word, last token right plus half the gap to the next word). Gap = max(0, next left minus this right). At a row end (no neighbour on that side) the extension is the half gap of the other side; a one-word row has no extension. Boundaries half-open. A second count with no extension is kept as a sensitivity.
- k against truth: over sewn words that align one to one to a truth word (`word_align`), truth count = vowel letters of the folded truth word.
- Membership: dictionary keys of `dictionary.86d83340-a.json` and `-b.json`, plus the keys of `singer-supplement.json` (the app consults it first), folded (lower case, ё to е, letters а to я only, hyphens out, as `ru.txt` was). Checked against `GraysonEngine.lookupStress` through `tsx` on every distinct sewn word.
- Candidates: dictionary keys at Levenshtein distance 1 (D1), or nearest within 2 (D2: distance 1 if any, else 2), vowel count equal to k; where k is 0 (no notes under the word) the read word's own vowel count, counted apart. A word with no vowel and k of 0 is left alone.
- Ties: the dictionary has no frequency column. Tie-break (1), my reading of the brief's clause: among the tied candidates take the one whose key is fewest letters (Levenshtein) from its own lemma field, if that minimum is unique; otherwise (2) the tie is unresolved and the word is left as read. Resolved by (1), unique-nearest, and unresolved are counted apart.
- Seating: C2 as in `step1c.py` (tokens seated in order, free notes, drop, engine cut of a token with two or more vowels). A replaced word removes its tokens' units and puts the engine's syllables of the replacement across the word's extent in proportion to letters.
- Right and wrong are judged on sewn words that align one to one to a truth word; words that do not align are counted apart and never right or wrong.
- Precision = right replacements (including right modern) over right plus wrong replacements.

#### Rule 2 (step 5, first letter restriction), to be stamped again before that run
The desk expects precision to rise (fewer wrong replacements per right one) and the number of replacements to fall; the net under (c) may fall or stay level. Likeliest failure: the reader's misread is on the first letter in a large share of the errors (the lever 2 list shows `дгевственной`, `лремлет`, `тныло`, `хомнат`, `лалекие`, `гелос`), so the restriction removes right corrections as well.

#### Rule 3 (a control I add, written before it runs): re-seat only
The witness at distance 1 lowered (b) and (a) while raising (c) (`log-main.txt`). To split the cause, the same replaced words are put through the same re-seating (the word's tokens removed, the engine's syllables of the word spread over its extent in proportion to letters) with the read word itself as the "replacement". Expectation: the re-seat alone explains most of the (b) and (a) loss, because a replaced word leaves the reader's own token positions; likeliest failure: it explains none, and the loss comes from wrong replacements.


## Step 1.1: k against the truth's syllable count

Over the 900 aligned words: k is 0 (no notes under the word) on 59; with k at least 1 (841 words) **k equals the truth word's vowel count on 704 (83.7 percent)**, and equals the printed syllable count on 711. Counting k of 0 as wrong, 732 of 900 (81.3 percent). With no extension: 615 of 752 (81.8 percent), k of 0 on 148. k is larger than the truth on 110 aligned words. Rows are k, columns the truth count (`log-main.txt`, K TABLE).

**Extended by half gaps (the measure):**

| k \ truth vowels | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7+ |
|---|---|---|---|---|---|---|---|---|
| 0 | 28 | 30 | 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 10 | 393 | 19 | 1 | 0 | 0 | 0 | 0 |
| 2 | 0 | 36 | 209 | 7 | 0 | 0 | 0 | 0 |
| 3 | 1 | 9 | 27 | 81 | 0 | 0 | 0 | 0 |
| 4 | 0 | 2 | 6 | 12 | 18 | 0 | 0 | 0 |
| 5 | 0 | 0 | 0 | 3 | 3 | 3 | 0 | 0 |
| 6 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| 7+ | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**No extension (sensitivity):**

| k \ truth vowels | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7+ |
|---|---|---|---|---|---|---|---|---|
| 0 | 34 | 113 | 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 4 | 338 | 53 | 3 | 0 | 0 | 0 | 0 |
| 2 | 0 | 13 | 186 | 17 | 0 | 0 | 0 | 0 |
| 3 | 1 | 5 | 18 | 71 | 1 | 0 | 0 | 0 |
| 4 | 0 | 1 | 4 | 11 | 17 | 0 | 0 | 0 |
| 5 | 0 | 0 | 0 | 2 | 3 | 3 | 0 | 0 |
| 6 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| 7+ | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**Joined words** (one sewn word covers several truth words, 60 words; k equals the summed vowel count on 26):

| k \ truth vowels | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7+ |
|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| 1 | 0 | 4 | 8 | 1 | 2 | 0 | 0 | 0 |
| 2 | 0 | 0 | 10 | 6 | 1 | 0 | 0 | 0 |
| 3 | 0 | 0 | 2 | 11 | 1 | 1 | 1 | 0 |
| 4 | 0 | 0 | 1 | 1 | 0 | 2 | 0 | 0 |
| 5 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 6 | 0 | 0 | 1 | 1 | 0 | 2 | 0 | 0 |
| 7+ | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 |

**Per song** (read aligned words, k equals truth): U1 14 of 16, U4 26 of 39, U5 84 of 89, U6 24 of 36, P 47 of 49, B01 58 of 60, B02 32 of 37, B03 44 of 50, B04 32 of 41, B06 21 of 30, B07 18 of 24, B08 30 of 43, B09 38 of 45, B10 41 of 45, S 54 of 65, T 86 of 105, K 40 of 45, M 15 of 22.

## Step 1.2: membership

| sewn words | found | not found | aligned | found and right | found and wrong | not found and right | not found and wrong |
|---|---|---|---|---|---|---|---|
| 1787 | 1199 | 588 | 900 | 638 | 32 | 49 | 181 |


49 not-found words are right against the truth (the words a witness must leave alone). The twenty most frequent (no word occurs more than twice, so the list is the first twenty in the log's order; several are short pieces (`лю`, `ве`, `глу`) beside whole words; I did not classify them, so how many are pre-reform forms, proper names, or word pieces is NOT ESTABLISHED): лю (2), ве (2), глу (2), боренья (1), зве (1), нят (1), превратясь (1), гря (1), вда (1), пы (1), лас (1), кательно (1), печальныя (1), судь (1), нится (1), рут (1), бе (1), утом (1), сле (1), гово (1).

## Steps 1.3 and 1.4: the witness with k, per song

Columns show C2 before -> after the witness, per song (`log-main.txt`; delta in brackets). First distance 1, then distance 2 or less.

**Distance 1 with k (D1k)**

| song | words replaced | (b) exact | (a) nucleus | (c) word-exact |
|---|---|---|---|---|
| U1 | 5 | 93 -> 89 (-4) | 95 -> 94 (-1) | 27 -> 27 (+0) |
| U4 | 5 | 86 -> 84 (-2) | 97 -> 98 (+1) | 37 -> 36 (-1) |
| U5 | 14 | 203 -> 197 (-6) | 228 -> 225 (-3) | 112 -> 122 (+10) |
| U6 | 11 | 95 -> 98 (+3) | 114 -> 119 (+5) | 39 -> 44 (+5) |
| P | 13 | 122 -> 120 (-2) | 153 -> 153 (+0) | 59 -> 66 (+7) |
| B01 | 11 | 106 -> 105 (-1) | 130 -> 128 (-2) | 55 -> 59 (+4) |
| B02 | 5 | 60 -> 58 (-2) | 70 -> 68 (-2) | 35 -> 38 (+3) |
| B03 | 8 | 99 -> 99 (+0) | 122 -> 124 (+2) | 50 -> 58 (+8) |
| B04 | 5 | 104 -> 99 (-5) | 121 -> 116 (-5) | 48 -> 52 (+4) |
| B06 | 3 | 72 -> 74 (+2) | 103 -> 103 (+0) | 32 -> 33 (+1) |
| B07 | 11 | 93 -> 92 (-1) | 119 -> 118 (-1) | 18 -> 20 (+2) |
| B08 | 9 | 92 -> 89 (-3) | 113 -> 112 (-1) | 39 -> 39 (+0) |
| B09 | 11 | 87 -> 85 (-2) | 117 -> 113 (-4) | 44 -> 48 (+4) |
| B10 | 3 | 84 -> 86 (+2) | 104 -> 106 (+2) | 46 -> 48 (+2) |
| S | 4 | 85 -> 88 (+3) | 97 -> 96 (-1) | 73 -> 79 (+6) |
| T | 8 | 149 -> 149 (+0) | 172 -> 172 (+0) | 98 -> 108 (+10) |
| K and M (no syllable truth) | 12 | not scorable | not scorable | not scorable |
| ALL | 138 | 1630 -> 1612 (-18) | 1955 -> 1945 (-10) | 812 -> 877 (+65) |

**Distance 2 or less with k (D2k)**

| song | words replaced | (b) exact | (a) nucleus | (c) word-exact |
|---|---|---|---|---|
| U1 | 5 | 93 -> 89 (-4) | 95 -> 94 (-1) | 27 -> 27 (+0) |
| U4 | 6 | 86 -> 81 (-5) | 97 -> 98 (+1) | 37 -> 36 (-1) |
| U5 | 17 | 203 -> 198 (-5) | 228 -> 227 (-1) | 112 -> 129 (+17) |
| U6 | 16 | 95 -> 96 (+1) | 114 -> 119 (+5) | 39 -> 44 (+5) |
| P | 13 | 122 -> 120 (-2) | 153 -> 153 (+0) | 59 -> 66 (+7) |
| B01 | 14 | 106 -> 107 (+1) | 130 -> 129 (-1) | 55 -> 63 (+8) |
| B02 | 5 | 60 -> 58 (-2) | 70 -> 68 (-2) | 35 -> 38 (+3) |
| B03 | 13 | 99 -> 88 (-11) | 122 -> 118 (-4) | 50 -> 54 (+4) |
| B04 | 6 | 104 -> 99 (-5) | 121 -> 115 (-6) | 48 -> 52 (+4) |
| B06 | 6 | 72 -> 73 (+1) | 103 -> 101 (-2) | 32 -> 33 (+1) |
| B07 | 12 | 93 -> 92 (-1) | 119 -> 118 (-1) | 18 -> 20 (+2) |
| B08 | 9 | 92 -> 89 (-3) | 113 -> 112 (-1) | 39 -> 39 (+0) |
| B09 | 13 | 87 -> 79 (-8) | 117 -> 109 (-8) | 44 -> 44 (+0) |
| B10 | 4 | 84 -> 86 (+2) | 104 -> 105 (+1) | 46 -> 48 (+2) |
| S | 5 | 85 -> 89 (+4) | 97 -> 96 (-1) | 73 -> 81 (+8) |
| T | 13 | 149 -> 146 (-3) | 172 -> 169 (-3) | 98 -> 108 (+10) |
| K and M (no syllable truth) | 15 | not scorable | not scorable | not scorable |
| ALL | 172 | 1630 -> 1590 (-40) | 1955 -> 1931 (-24) | 812 -> 882 (+70) |


**Outcomes against the truth** (aligned words only; `wrong words left alone` is aligned words that differ from the truth and were not replaced: D1k not found, none: 60; D1k found (a real word, wrong here): 32; D1k not found, unresolved: 56; D2k not found, none: 12; D2k not found, unresolved: 86; D2k found (a real word, wrong here): 32)

| variant | words replaced | unique nearest | tie resolved by (1) | tie unresolved (left as read) | no candidate | right (exact) | right modern | wrong | of which the read word was right | not judgeable | wrong words left alone | precision, percent | notes (c) gained / lost | replaced using own k |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D1k | 138 | 71 | 67 | 297 | 149 | 35 | 5 | 32 | 7 | 66 | 148 | 55.6 | 82 / 17 | 1 |
| D2k | 172 | 88 | 84 | 369 | 43 | 42 | 5 | 44 | 8 | 81 | 130 | 51.6 | 98 / 28 | 1 |


Gains and losses by credit (D1k): (b) gained 45, lost 63; (a) gained 22, lost 32; (c) gained 82, lost 17. D2k: (b) 57 / 97; (a) 31 / 55; (c) 98 / 28. Replacements that changed the read word's vowel count (D1k, aligned): right 20, wrong 13; (D2k): right 24, wrong 22.

**Re-seat-only control** (rule 3; the same D1k words replaced by themselves, so only the re-seating changes; `log-reseat.txt`): (b) 1594 (-36), (a) 1938 (-17), (c) 810 (-2). So the re-seating alone costs 36 under (b) and 17 under (a); the replacement text then adds +18 under (b), +7 under (a), and +67 under (c) over the re-seat-only figures. The expectation that the re-seat explains most of the (b) and (a) loss held; it explains all of it, and more. The reason the re-seat costs notes (the replaced word's units leave the reader's own token positions) is my reading and was not tested further (NOT ESTABLISHED).

## Top-twenty lists

No pair occurs more than twice, so each list is the first twenty in the log's order (`results-main.json`).

**Right replacements, D1k**

| read | replacement | truth word beside it | instances |
|---|---|---|---|
| твсй | твой | твой | 1 |
| тобсй | тобой | тобой | 1 |
| лремлет | дремлет | дремлет | 1 |
| тныло | ныло | ныло | 1 |
| ночия | ночи | ночи | 1 |
| еизменчивые | изменчивые | изменчивые | 1 |
| зозут | зовут | зовут | 1 |
| пежит | нежит | нежит | 1 |
| солушать | слушать | слушать | 1 |
| увнидел | увидел | увидел | 1 |
| одинокиф | одинокие | одинокие | 1 |
| усталыш | усталый | усталый | 1 |
| отктытая | открытая | открытая | 1 |
| ттвой | твой | твой | 1 |
| земнои | земной | земной | 1 |
| пилитрима | пилигрима | пилигрима | 1 |
| тьмгу | тьму | тьму | 1 |
| уюблю | люблю | люблю | 1 |
| горгует | торгует | торгует | 1 |
| прелесети | прелести | прелести | 1 |

**Wrong replacements, D1k**

| read | replacement | truth word beside it | instances |
|---|---|---|---|
| епит | лепит | спит | 2 |
| боренья | коренья | боренья | 1 |
| превратясь | превратись | превратясь | 1 |
| нылыи | ныли | нылый | 1 |
| пчлел | пчел | пред | 1 |
| вестнипа | вестника | вестница | 1 |
| твон | твое | твои | 1 |
| днвно | давно | дивно | 1 |
| релн | реле | рели | 1 |
| звучнт | звучно | звучит | 1 |
| печальныя | печальные | печальныя | 1 |
| нно | юно | но | 1 |
| нится | нинся | нится | 1 |
| нотп | нот | ной | 1 |
| утом | атом | утом | 1 |
| несней | несшей | песней | 1 |
| лпе | лье | не | 1 |
| прамеи | арамеи | прямому | 1 |
| юныи | юные | юный | 1 |
| возве | возле | возвес | 1 |

**Right replacements, D2k**

| read | replacement | truth word beside it | instances |
|---|---|---|---|
| твсй | твой | твой | 1 |
| тобсй | тобой | тобой | 1 |
| лремлет | дремлет | дремлет | 1 |
| тныло | ныло | ныло | 1 |
| ночия | ночи | ночи | 1 |
| еизменчивые | изменчивые | изменчивые | 1 |
| зозут | зовут | зовут | 1 |
| оудущшность | будущность | будущность | 1 |
| ннепрогладном | непроглядном | непроглядном | 1 |
| стсвасти | страсти | страсти | 1 |
| пежит | нежит | нежит | 1 |
| солушать | слушать | слушать | 1 |
| увнидел | увидел | увидел | 1 |
| одинокиф | одинокие | одинокие | 1 |
| усталыш | усталый | усталый | 1 |
| отктытая | открытая | открытая | 1 |
| ттвой | твой | твой | 1 |
| земнои | земной | земной | 1 |
| тгдле | где | где | 1 |
| дъьханье | дыханье | дыханье | 1 |

**Wrong replacements, D2k**

| read | replacement | truth word beside it | instances |
|---|---|---|---|
| епит | лепит | спит | 2 |
| боренья | коренья | боренья | 1 |
| превратясь | превратись | превратясь | 1 |
| сслившись | усилившись | слившись | 1 |
| нылыи | ныли | нылый | 1 |
| пчлел | пчел | пред | 1 |
| вестнипа | вестника | вестница | 1 |
| сгонитли | сгоняли | гонитли | 1 |
| глубу | улуру | глубь | 1 |
| твон | твое | твои | 1 |
| днвно | давно | дивно | 1 |
| релн | реле | рели | 1 |
| звучнт | звучно | звучит | 1 |
| печальныя | печальные | печальныя | 1 |
| нно | юно | но | 1 |
| нится | нинся | нится | 1 |
| нотп | нот | ной | 1 |
| утом | атом | утом | 1 |
| нежней | жней | нежней | 1 |
| несней | несшей | песней | 1 |


## Step 1.5: the first letter restricted

Control rule 2 (stamped before this run): precision expected to rise and replacements to fall. **Neither held.** `log-first.txt`:

| variant | words replaced | unique nearest | tie resolved by (1) | tie unresolved (left as read) | no candidate | right (exact) | right modern | wrong | of which the read word was right | not judgeable | wrong words left alone | precision, percent | notes (c) gained / lost | replaced using own k |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D1k | 138 | 71 | 67 | 297 | 149 | 35 | 5 | 32 | 7 | 66 | 148 | 55.6 | 82 / 17 | 1 |
| D1k, first letter | 143 | 82 | 61 | 262 | 179 | 29 | 4 | 34 | 9 | 76 | 155 | 49.3 | 65 / 17 | 4 |
| D2k | 172 | 88 | 84 | 369 | 43 | 42 | 5 | 44 | 8 | 81 | 130 | 51.6 | 98 / 28 | 1 |
| D2k, first letter | 189 | 108 | 81 | 336 | 59 | 34 | 4 | 53 | 11 | 98 | 133 | 41.8 | 76 / 27 | 4 |

Totals with the first letter restricted: D1k (b) 1595, (a) 1942, (c) 860 (+48); D2k (b) 1561, (a) 1917, (c) 861 (+49). Precision falls from 55.6 to 49.3 percent at distance 1 and from 51.6 to 41.8 at distance 2: right replacements fall from 40 to 33 and wrong ones rise from 32 to 34 at distance 1. I did not list which right corrections were lost; that they are misreads of the first letter, as the rule named, is my inference from the totals and was not measured (NOT ESTABLISHED).

## What the measure cannot tell

- **Judgeable words.** Of 138 replacements at distance 1, 66 sit on words that do not align one to one to a truth word, so right and wrong cover 72 of them. Precision is over those only.
- **(c) is a word-exact test.** A replacement that makes a word right adds all of its syllables at once, so +65 under (c) is 82 notes gained and 17 lost, not 72 words.
- **Tie-breaker (1).** I did not split right and wrong by how the replacement was chosen (unique, resolved by (1)); (1) resolved 67 instances at distance 1, and whether those were right at the rate of the rest is NOT ESTABLISHED.
- **The oracle in the notes.** k comes from the free notes, which are what Ilya could know; the candidate notes of the seating are also free notes, as in C2. The credits use the truth only to score.
- **Overlapping extents.** Where the reader joined two words (the likeliest failure) the aligned-word table cannot show it, since a joined word is not aligned 1 to 1; the joined-words table shows it: k equals the summed vowel count on 26 of 60.
- **Pre-reform forms.** The fold with `modernisePreReform` is applied before the dictionary test, so a correctly read old spelling is tested in its modern form; `превратясь` is still not found and is replaced by `превратись` (wrong). The right modern column holds 5 of the D1k right replacements.
- **Held-out data.** None used. P's truth is the desk's draft and S, T, K, M syllables are row 81's `poem.txt`, as in lever 2.

## What I could not establish

- **The brief's tie clause (1)** ("the fewer letters changed in the dictionary word's lemma field agreeing with a neighbour"). I read it as the candidate whose key is nearest its own lemma field and said so in the control rules; if the desk meant another test, only the tie-resolved column changes.
- **Whether the 52 supplement keys and the removal of 39,209 keys change anything against `ru.txt`.** I did not compare the sets.
- **How many not-found-but-right words are pre-reform forms, proper names, or word pieces.** The list gives the words and no class.
- **Why the re-seating costs notes**, and whether a placement that keeps the reader's token positions for unchanged syllables would remove it. Not tested.
- **A statistic on the 66 and 81 unjudgeable replacements.** They are replaced words I cannot score against a truth word.
- **Anything on a phone photograph or a reader other than F.** None run; no browser reader was run.

## The scripts I wrote

All in `/home/claude/n135-witness/work/` (copies of lever 2's scripts beside them, path-changed only).

- `witness.py`: library. Dictionary key set and lemma fields (`build_dict`), Levenshtein neighbours (`n1`, `n2`), the choice rule (`choose`), notes under a word (`system_notes`, `word_k`), C2 seating with replaced words (`build_units2`, `run_c2`).
- `witness_main.py`: driver. Mode `main`: step 0 check inside the driver, k tables, membership, `lookupStress` agreement, D1k and D2k (`log-main.txt`, `results-main.json`). Mode `first`: step 5 (`log-first.txt`, `results-first.json`). Mode `reseat`: the re-seat-only control (`log-reseat.txt`, `results-reseat.json`).
- `lookup_check.ts`: calls `GraysonEngine.lookupStress` with the dictionary injected.
- `mk_report.py`: builds this report from the logs and result files, so the tables are not retyped.
- Step 0 logs: `log-step0-c2.txt` and `log-step0-v3.txt` (lever 2's `step1c.py` and `step1b.py`, run from my copy). `controls-before-measure.md` and the `.t-rule*` stamps hold the control rules.
