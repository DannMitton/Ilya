# Report: lever 2 on the N.135 harness, seat by syllables not by tokens (helper, 2026-10-27, r1)

Measure only. Nothing in `/home/claude/ilya/` was written (a `find -newer` of the repository against the start stamp `.t0` of my folder lists no file), no git command was run, and every file I made is in `/home/claude/n135-lever2/`. Every number comes with the log it was printed into; the logs are in the same folder. Reader F is `dfloat`, rule set R2, as in the brief.

## The answer first

1. **Baseline, right on the right note, reader F, rule 2:** 1,622 of 2,385 truth syllable notes (68.0 percent) by score44's exact sound test (`log44.txt`, `score44-R2.txt` line "(dfloat) rule 2"; my own re-count prints the same 1,622, `log-step1.txt` first note table). By the nucleus test (the right vowel under the right note, my reading of the brief's cut (a), defined in step 1) the same seats score 1,815 (76.1 percent). The row 115 per-syllable count of the same thing is 1,517 of the 1,875 read (`log-ledger-rederived.txt`).
2. **After lever 2a (sew, cut with Ilya's `openSyllabify`, align in order):** the exact test (b) gives **1,280 (53.7 percent), 342 fewer than the baseline**; the nucleus test (a) gives **1,839 (77.1 percent), 24 more than the baseline under the same test and 77 more than rule 3's 1,762** (`log-step1.txt`). Of the 663 syllables lost today, 46 come back by the exact test and 293 by the nucleus test, counted at the text level; of the 298 token-splitting losses, 39 and 142. Of the 1,875 read today, 435 (exact) and 220 (nucleus) are no longer right at the text level.
3. **After lever 2a plus the dictionary witness at distance 1:** (b) 1,284 (+4), (a) 1,838 (minus 1) (`log-step2.txt`). Only 58 distinct words (59 of 1,787 sewn words) have a unique nearest dictionary word at distance 1: 273 of the 331 unknown words that have a neighbour at distance 1 tie, and `ru.txt` has no frequency to break the tie.

Two follow-ups are their own sections before Step 2: Step 1b (the engine's cut, a word-exact credit, and the product's own seating) and Step 1c (the reader's own tokens seated with drop, and a hybrid that cuts two-vowel tokens); the answer to each is in its section.

Two things the numbers depend on, said here so they are not missed. The brief's step 3 gives the alignment the truth's list of syllable-bearing notes; the baseline seats do not use it. With the notes Ilya could know (every read note that is not a tie stop), (a) is 1,806 against the baseline's 1,815 (the sensitivity table in step 1). And 80 of the 210 systems have more cut syllables than notes, where the brief's rule falls back to nearest note; a parameter-free alternative of mine that drops the surplus syllables gives (a) 1,978, which is 163 more than the baseline's 1,815.

## Setup and the baseline reproduction (step 0)

Control rule, written before the run (`controls-before-measure.md`, stamped by `.t0`, 2026-10-27 17:02:12 UTC): I expected every baseline number to reproduce exactly, and named a path or environment difference as the likeliest failure. **It reproduced exactly.** The failure I named did not occur. Three circumstances differ from the brief's picture.

- **The ledger scripts are not on disk.** `ledger115_116.py`, `rowcut_check.py`, and `tables.py` are not in `measure-rows115-116_2026-10-19/` (that folder holds only the five outputs), and a search of the machine for `ledger115_116.py` found nothing. I wrote `ledger_rederive.py` from the row 115 report's definitions, with one hand entry that the report names (`EYE_ROWCUT`, B10 p1 system 2 row 2, 17 syllables, which I did not re-inspect by eye). I then compared my ledger with the repository's `ledger-F.csv` row by row, on stage, the token-splitting kind, and the seating under rules 1, 2, and 3: **0 differences over 2,538 rows** (`log-ledger-rederived.txt`, last line). Matching took three runs: my first seating test credited the token's own note, where score44 scores a truth note by the tokens seated on it, joined; and my first T rule marked single syllables not scorable, where the repository's ledger marks a T row not scorable as a whole when any one of its poem syllables differs from the truth's. Both corrections are in `ledger_rederive.py`, and the final run is the one logged.
- **One line of `score44.py` was changed in my copy.** Line 136 wrote `seat44-R2.pkl` into `/root/n135work/`, outside my folder; it now writes into the harness copy. Nothing else in `score42.py`, `score44.py`, or `common2.py` changed except the `REPO` and `WORK` assignment (`common2.py` line 5) and the import path in `norm.ts` (line 4), as the brief says.
- **A directory I did not make appeared in the work folder.** `/root/n135work/models/rus_prereform.traineddata` (7,827,478 bytes, the size the float report gives) was created at 13:02 local (17:02 UTC), about ten seconds before my first write and before any script of mine ran. No script of mine writes there. I did not read or use it.

The harness copy is `harness/` (copied from `measure-row82-retrain_2026-10-15/harness/`, with the 36 `ocr2/*-dfloat*` files, the float folder's `common2.py` and `norm.ts`, and its `_before/` and `summary.txt` beside them). I re-read no crop through any reader. `npx --no-install tsx` worked from the repository as it stood, so `common2.prime` is unchanged.

What I printed, from my own runs:

- Reader F, `score42` with `SPLIT=1`: **1,875 of 2,538** right in sound (`log42s.txt`, row "all", `(dfloat) sound` 1,875; letter 1,848). S, T, K, M read 91, 164, 116, 46 (same file).
- `score42-R2.txt`, `score42-R2-split.txt`, both `score42` `.json` files, `score44-R2.txt`, and `score44-R2.json` are byte-identical to the float folder's copies (`log-diff-vs-float-folder.txt`).
- The row 115 ledger for F, re-derived: **663 lost = letter recognition 345, token splitting 298 (162 one token for two syllables, 136 one syllable cut), row cutting 17, unattributed 3** (`log-ledger-rederived.txt`). Seating of the 1,875 by rule 2: **1,517 on the right note, 173 on a wrong note, 1 whose note homr did not read, 184 not scorable**; rules 1 and 3 give 1,409 / 281 and 1,449 / 241 with the same 1 and 184 (same file). The per-song stage table follows; it equals the row 115 report's.

| song | printed | read (F, sound, split) | lost | row cutting | token splitting (2 in 1 + 1 in 2) | letter recognition | unattributed | seating of the read, rule 2: right / wrong note / note not read / not scorable |
|---|---|---|---|---|---|---|---|---|
| U1 | 97 | 93 | 4 | 0 | 3 (2 + 1) | 1 | 0 | 93 / 0 / 0 / 0 |
| U4 | 112 | 79 | 33 | 0 | 26 (26 + 0) | 7 | 0 | 73 / 6 / 0 / 0 |
| U5 | 258 | 206 | 52 | 0 | 21 (18 + 3) | 31 | 0 | 194 / 11 / 1 / 0 |
| U6 | 152 | 119 | 33 | 0 | 16 (6 + 10) | 17 | 0 | 105 / 14 / 0 / 0 |
| P | 177 | 101 | 76 | 0 | 47 (44 + 3) | 26 | 3 | 95 / 6 / 0 / 0 |
| B01 | 147 | 106 | 41 | 0 | 7 (4 + 3) | 34 | 0 | 100 / 6 / 0 / 0 |
| B02 | 86 | 73 | 13 | 0 | 0 (0 + 0) | 13 | 0 | 64 / 9 / 0 / 0 |
| B03 | 147 | 106 | 41 | 0 | 14 (6 + 8) | 27 | 0 | 99 / 7 / 0 / 0 |
| B04 | 148 | 114 | 34 | 0 | 19 (2 + 17) | 15 | 0 | 98 / 16 / 0 / 0 |
| B06 | 142 | 85 | 57 | 0 | 30 (10 + 20) | 27 | 0 | 66 / 19 / 0 / 0 |
| B07 | 151 | 94 | 57 | 0 | 32 (6 + 26) | 25 | 0 | 78 / 16 / 0 / 0 |
| B08 | 141 | 102 | 39 | 0 | 22 (6 + 16) | 17 | 0 | 82 / 20 / 0 / 0 |
| B09 | 139 | 89 | 50 | 0 | 24 (4 + 20) | 26 | 0 | 75 / 14 / 0 / 0 |
| B10 | 148 | 91 | 57 | 17 | 22 (16 + 6) | 18 | 0 | 75 / 16 / 0 / 0 |
| S | 109 | 91 | 18 | 0 | 4 (2 + 2) | 14 | 0 | 89 / 2 / 0 / 0 |
| T | 200 | 164 | 36 | 0 | 6 (6 + 0) | 30 | 0 | 131 / 11 / 0 / 22 |
| K | 131 | 116 | 15 | 0 | 2 (2 + 0) | 13 | 0 | 0 / 0 / 0 / 116 |
| M | 53 | 46 | 7 | 0 | 3 (2 + 1) | 4 | 0 | 0 / 0 / 0 / 46 |
| ALL | 2538 | 1875 | 663 | 17 | 298 (162 + 136) | 345 | 3 | 1517 / 173 / 1 / 184 |

Note-level baseline, the figure the comparison uses: score44 over the truth notes that carry a syllable, K and M excluded because they have no syllable truth: rule 2 right 1,622 of 2,385, rule 3 right 1,552 of 2,385 (`score44-R2.txt`, lines "(dfloat) rule 2" and "rule 3"; my re-count `log-step1.txt`). The 2,385 includes 58 truth notes homr did not read (U5 1, B02 57) and truth notes on systems with no Russian-labelled row (the row 115 report counts 79 truth syllables there, B02 68, B09 9, B06 1, B07 1, outside its 2,538; I did not re-measure them), which no variant can seat because no token is on those systems.

## Step 1. Lever 2a: sew, cut, align

**Control rule, written before the numbers** (`controls-before-measure.md`): the desk expects the variant to recover most of the 162 "one token covers two syllables" cases and some of the 136 "one syllable cut into pieces" cases, and to reduce the 173 wrong-note seats; it expects regressions where a misread letter changes the vowel count of a word, so the whole word's syllables shift. The likeliest failure of the expectation: tokens the reader joined across a word boundary cannot be split by cutting a word, so they stay lost; I report how many of the 162 are of that kind.

**What I did, and each choice** (scripts `lever2.py`, `step1.py`, `cut_words.ts`):

1. **Sewing** (`lever2.sew2`). F's raw tokens, in x order. A token ending in `-`, U+2010, or U+2011 joins the next; a token that is only such a mark joins its neighbours; a token with no letter and no hyphen (a comma, a bar) is dropped; otherwise a token is its own word. A token that begins with a hyphen does not join the one before it (the brief's rule; `common2.sew` joins it, mine does not). Each word keeps its extent (first token's left to last token's right) and each token's x centre.
2. **Truth words.** The truth's words are its printed syllables joined until one that does not end in a hyphen. In `align/<L>.json` the truth notes carry `syl` and `sylType` (`start`, `middle`, `end`, `whole`); `common2.split_syl` writes the hyphen on a `start` or `middle` syllable, and S, T, K, M take row 81's `poem.txt`, which carries the printed hyphens. So the convention is the hyphen at the end of a syllable, derived from `sylType`.
3. **Cutting.** Each sewn word is folded with `norm` (`modernisePreReform`, then lower case, ё to е, letters а to я only) and cut by Ilya's own function. I called `openSyllabify` (`apps/web/src/lib/syllable-utils.ts:49`) through `tsx` (`/home/claude/.npm-global/bin/tsx`, working directory the repository, read only) from `cut_words.ts`. Its input is the list of distinct folded words; for each I build one syllable per vowel letter (the vowel set of `vowel-resolver.ts:159`, `CYRILLIC_VOWEL`, which on folded letters counts the same vowels as on the print's), seeded closed (each consonant run left on the vowel before it), and `openSyllabify` moves every consonant after a non-final syllable's last vowel to the next syllable (`syllable-utils.ts:69-78`); a word-final run stays. The function takes syllables as input and does not cut a raw string, so the seed is mine. I checked that the seed does not matter: a second seed (open) gives the same cut for all 1,125 words I cut (`cut-openseed-out.json`, `cut-cache.json`; the comparison printed 0 differing). Two limits: `syllable-utils.ts:21-23` (`CY_VOWELS`) leaves ѣ, і, and ѵ out, so on an unfolded old-spelling word the call does not open the syllable (`мѣст|о` on my test input), which is why I fold first; and a word with no vowel letter gets zero syllables, as `pairings.ts:212` gives a vowel-less word no slot (`buildSlotQueue`, line 202, fuses it to a neighbour).
4. **Aligning** (`lever2.seat_row`). The row's syllables in reading order go to the system's candidate notes by `score44.rule3` (`score44.py:33`), one least-cost monotone pass, cost the distance from a syllable's x to the note's x, a note allowed none. A syllable's x runs from the word's first token centre to its last token centre, evenly spaced; a one-syllable word sits at the mean of the two. Where syllables outnumber notes, `rule3` returns nothing and I fall back to `score44.rule1` (nearest note), as score44 does for tokens. Candidate notes, as the brief says, are the read notes matched to a truth note that carries a syllable (score44's `sylnotes`, `score44.py:103`); this uses the truth, and the baseline does not.
5. **Scoring** (`lever2.classify`, `step1.py`). Per truth note that carries a syllable, as score44 does: the syllables seated on its read note, joined, are compared with the truth syllable. Two credits, both on every run. **(b) exact:** the folded seated syllable equals the folded truth syllable (`norm`; this is score42 and score44's "sound" test). **(a) nucleus:** the vowel letters of the folded seated syllable equal those of the folded truth syllable, so a misread consonant, or a cut that puts the consonant on the neighbour, does not count against it. **(a) is my reading of the brief**, which says (b) is "the same cut, but a syllable counts as right only if its letters match"; if the desk meant something else by (a), only the (a) columns change. The baseline is scored under both credits from the same seated tokens (`log-step1.txt`).

**How many words, against the truth.** F's tokens carry a hyphen at the end in 864 of 3,504 tokens, against 1,221 syllable-final hyphens in the print (`log-diag.txt`, over the Russian rows' raw tokens), so sewing joins only part of what the print joins. It gives 1,787 words against the truth's 1,407, and 69 of 228 rows have the right count (per row, `lever2-words-per-row.csv`). The syllable count nevertheless nearly matches in total (2,540 cut against 2,538 printed) because a vowel counts the same however the tokens fall, but only 104 of 228 rows match, so errors cancel across rows.

| song | rows | my words | truth words | rows with equal word count | my syllables (cut) | printed syllables | rows with equal syllable count |
|---|---|---|---|---|---|---|---|
| U1 | 6 | 63 | 39 | 0 | 95 | 97 | 4 |
| U4 | 7 | 70 | 62 | 1 | 105 | 112 | 5 |
| U5 | 23 | 172 | 132 | 8 | 260 | 258 | 11 |
| U6 | 21 | 88 | 70 | 6 | 155 | 152 | 11 |
| P | 11 | 78 | 97 | 2 | 155 | 177 | 1 |
| B01 | 12 | 113 | 90 | 1 | 150 | 147 | 4 |
| B02 | 7 | 59 | 51 | 4 | 80 | 86 | 3 |
| B03 | 14 | 112 | 80 | 2 | 156 | 147 | 4 |
| B04 | 11 | 126 | 87 | 0 | 147 | 148 | 5 |
| B06 | 11 | 119 | 79 | 0 | 139 | 142 | 5 |
| B07 | 14 | 138 | 74 | 0 | 155 | 151 | 7 |
| B08 | 11 | 133 | 87 | 0 | 142 | 141 | 1 |
| B09 | 13 | 123 | 86 | 0 | 145 | 139 | 7 |
| B10 | 12 | 95 | 83 | 3 | 133 | 148 | 5 |
| S | 18 | 69 | 69 | 16 | 119 | 109 | 9 |
| T | 19 | 130 | 126 | 13 | 211 | 200 | 10 |
| K | 12 | 73 | 68 | 8 | 140 | 131 | 8 |
| M | 6 | 26 | 27 | 5 | 53 | 53 | 4 |
| ALL | 228 | 1787 | 1407 | 69 | 2540 | 2538 | 104 |

Syllable-level blind spots of the cut itself: 57 of the 2,538 printed syllables have no vowel letter after the fold (`съ`, `въ`, and the like), so a one-syllable-per-vowel cut cannot produce them; and 148 sewn words have no vowel letter and give zero syllables (`log-step1.txt`).

**Text level: the 663 coming back.** Here the cut syllables are aligned one to one to the row's printed syllables by `score42.align_syl`, with no notes involved, so K and M count. This answers "how many come back" at the level the 663 were counted.

| song | printed | read today (F) | after 2a, credit (b) exact | after 2a, credit (a) nucleus |
|---|---|---|---|---|
| U1 | 97 | 93 | 71 | 89 |
| U4 | 112 | 79 | 65 | 81 |
| U5 | 258 | 206 | 155 | 223 |
| U6 | 152 | 119 | 81 | 110 |
| P | 177 | 101 | 70 | 118 |
| B01 | 147 | 106 | 83 | 108 |
| B02 | 86 | 73 | 50 | 61 |
| B03 | 147 | 106 | 90 | 114 |
| B04 | 148 | 114 | 100 | 119 |
| B06 | 142 | 85 | 63 | 91 |
| B07 | 151 | 94 | 80 | 107 |
| B08 | 141 | 102 | 94 | 117 |
| B09 | 139 | 89 | 71 | 112 |
| B10 | 148 | 91 | 83 | 99 |
| S | 109 | 91 | 64 | 81 |
| T | 200 | 164 | 136 | 159 |
| K | 131 | 116 | 89 | 109 |
| M | 53 | 46 | 41 | 50 |
| ALL | 2538 | 1875 | 1486 | 1948 |

By the baseline's own categories (`log-step1.txt`, "LEDGER categories"; "scorable" means the syllable has a truth note homr read; "baseline note right" is score44's note test under rule 2):

| baseline category | syllables | text-level right now (b) | (a) | scorable at a note | baseline note right (b) | (a) | 2a note right (b) | (a) | gained over baseline note (b) | (a) |
|---|---|---|---|---|---|---|---|---|---|---|
| read:ok on right note | 1517 | 1187 | 1369 | 1517 | 1517 | 1517 | 1147 | 1398 | 0 | 0 |
| read:wrong note | 173 | 105 | 117 | 173 | 0 | 21 | 58 | 102 | 58 | 83 |
| read:note not read | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| read:not scorable | 184 | 147 | 168 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| token splitting:2 syllables in 1 token | 162 | 30 | 64 | 156 | 36 | 49 | 48 | 106 | 20 | 59 |
| of which across a word boundary | 98 | 18 | 37 | 92 | 29 | 32 | 37 | 65 | 12 | 33 |
| of which inside one word | 64 | 12 | 27 | 64 | 7 | 17 | 11 | 41 | 8 | 26 |
| token splitting:1 syllable in 2+ tokens | 136 | 9 | 78 | 135 | 68 | 90 | 12 | 91 | 4 | 11 |
| letter recognition | 345 | 7 | 151 | 323 | 0 | 143 | 2 | 150 | 2 | 17 |
| row cutting | 17 | 0 | 0 | 17 | 0 | 0 | 0 | 0 | 0 | 0 |
| unattributed | 3 | 0 | 0 | 3 | 0 | 0 | 0 | 3 | 0 | 3 |

Reading the table:

- **The 663 lost.** Text level, exact test: 46 return (letter recognition 7, token splitting 39: 30 + 9). Nucleus test: 293 return (letter recognition 151, token splitting 142: 64 + 78). The 151 are the nucleus test forgiving a wrong consonant, not sewing; the sewing's own contribution is the token-splitting rows.
- **Of the 162 "one token, two syllables":** 98 are tokens that cross a word boundary, 64 sit inside one word (`log-step1.txt`, the two "of which" rows). The desk's expected failure did not bind the way it expected: under the nucleus test the cross-word cases do come back, 65 of 92 scorable right on the note against 41 of 64 for the inside-word cases, because a vowel cut does not need the word boundary. Under the exact test the cross-word cases are 37 of 92 and the inside-word cases 11 of 64. Against the baseline's own note test, the 162 gain 20 (exact) and 59 (nucleus) of 156 scorable. So "most of the 162" does not hold under the exact test, and holds for about two in five of the scorable ones, by gain, under the nucleus test.
- **Of the 136 "one syllable cut":** the baseline already seats the pieces on one note and joins them, so 68 of the 135 scorable are right at the note today under the exact test. The cut-and-align variant gets 12 there, a net loss of 56 (4 gained, 60 lost); under the nucleus test it gains 11 over the baseline's 90.
- **Of the 173 wrong-note seats:** 58 are right on the note now (exact) and 102 (nucleus), a gain over the baseline's note test of 58 and 83. The note-level count of "right syllable on another note" goes from 83 to 104 (exact) and from 348 to 329 (nucleus) against rule 2 (`log-step1.txt`, the note tables), so the wrong-note seats are reduced only under the nucleus test, and only a little.
- **Regressions:** of the 1,517 syllables the ledger counts right on the right note, 370 are not right on the note after the exact cut and 119 after the nucleus cut (`log-step1.txt`, "REGRESSIONS"). At note level against rule 2: exact, 84 gained and 426 lost, 1,196 right in both; nucleus, 168 gained and 144 lost, 1,671 right in both (same file, "TRANSITIONS"). The expected cause, a row whose cut syllable count differs from its printed count, accounts for 95 of the 119 nucleus regressions and 238 of the 370 exact ones; the exact test's other cause is the cut convention: 132 of its regressions are printed syllables that end in a consonant before a hyphen, which an open cut cannot reproduce (332 of the 1,221 hyphen-final printed syllables end in a consonant, so the exact test has a ceiling by construction) (`log-sens.txt`, "REGRESSION CAUSES").

**Per song, the exact test (b).** Truth syllable notes per song, right on the right note under the baseline's rules 2 and 3 and under lever 2a, the delta against each, and where the other 2a notes went (`log-step1.txt`, note tables; K and M have no syllable truth and are not here; U2, U3, and B05 have no reading and are not in any table).

| song | truth syllable notes | exact baseline rule 2 | exact baseline rule 3 | 2a | delta vs rule 2 | delta vs rule 3 | 2a: right syllable, other note | 2a: wrong | 2a: empty | note not read |
|---|---|---|---|---|---|---|---|---|---|---|
| U1 | 96 | 92 | 88 | 72 | -20 | -16 | 2 | 22 | 0 | 0 |
| U4 | 108 | 76 | 77 | 67 | -9 | -10 | 2 | 35 | 4 | 0 |
| U5 | 251 | 194 | 176 | 153 | -41 | -23 | 2 | 90 | 5 | 1 |
| U6 | 144 | 105 | 100 | 81 | -24 | -19 | 1 | 61 | 1 | 0 |
| P | 172 | 107 | 114 | 75 | -32 | -39 | 7 | 74 | 16 | 0 |
| B01 | 146 | 102 | 104 | 78 | -24 | -26 | 10 | 51 | 7 | 0 |
| B02 | 146 | 61 | 57 | 47 | -14 | -10 | 3 | 25 | 14 | 57 |
| B03 | 146 | 107 | 102 | 84 | -23 | -18 | 4 | 53 | 5 | 0 |
| B04 | 146 | 108 | 96 | 92 | -16 | -4 | 11 | 39 | 4 | 0 |
| B06 | 140 | 70 | 63 | 56 | -14 | -7 | 8 | 62 | 14 | 0 |
| B07 | 148 | 94 | 96 | 76 | -18 | -20 | 4 | 60 | 8 | 0 |
| B08 | 140 | 97 | 74 | 69 | -28 | -5 | 24 | 37 | 10 | 0 |
| B09 | 146 | 86 | 82 | 69 | -17 | -13 | 6 | 58 | 13 | 0 |
| B10 | 146 | 79 | 81 | 71 | -8 | -10 | 7 | 39 | 29 | 0 |
| S | 114 | 90 | 90 | 63 | -27 | -27 | 6 | 39 | 6 | 0 |
| T | 196 | 154 | 152 | 127 | -27 | -25 | 7 | 57 | 5 | 0 |
| ALL | 2385 | 1622 | 1552 | 1280 | -342 | -272 | 104 | 802 | 141 | 58 |

**Per song, the nucleus test (a).** The baseline columns are the baseline's own seated tokens scored by the nucleus test.

| song | truth syllable notes | nucleus baseline rule 2 | nucleus baseline rule 3 | 2a | delta vs rule 2 | delta vs rule 3 | 2a: right syllable, other note | 2a: wrong | 2a: empty | note not read |
|---|---|---|---|---|---|---|---|---|---|---|
| U1 | 96 | 93 | 89 | 95 | +2 | +6 | 1 | 0 | 0 | 0 |
| U4 | 108 | 81 | 82 | 97 | +16 | +15 | 11 | 0 | 0 | 0 |
| U5 | 251 | 214 | 199 | 224 | +10 | +25 | 16 | 8 | 2 | 1 |
| U6 | 144 | 117 | 114 | 126 | +9 | +12 | 5 | 12 | 1 | 0 |
| P | 172 | 119 | 125 | 137 | +18 | +12 | 30 | 3 | 2 | 0 |
| B01 | 146 | 121 | 125 | 111 | -10 | -14 | 24 | 10 | 1 | 0 |
| B02 | 146 | 70 | 66 | 65 | -5 | -1 | 10 | 4 | 10 | 57 |
| B03 | 146 | 123 | 120 | 118 | -5 | -2 | 20 | 6 | 2 | 0 |
| B04 | 146 | 116 | 100 | 119 | +3 | +19 | 21 | 5 | 1 | 0 |
| B06 | 140 | 90 | 85 | 93 | +3 | +8 | 33 | 11 | 3 | 0 |
| B07 | 148 | 109 | 110 | 112 | +3 | +2 | 25 | 9 | 2 | 0 |
| B08 | 140 | 106 | 91 | 84 | -22 | -7 | 44 | 6 | 6 | 0 |
| B09 | 146 | 111 | 106 | 117 | +6 | +11 | 17 | 2 | 10 | 0 |
| B10 | 146 | 90 | 96 | 86 | -4 | -10 | 34 | 10 | 16 | 0 |
| S | 114 | 92 | 92 | 93 | +1 | +1 | 9 | 6 | 6 | 0 |
| T | 196 | 163 | 162 | 162 | -1 | +0 | 29 | 3 | 2 | 0 |
| ALL | 2385 | 1815 | 1762 | 1839 | +24 | +77 | 329 | 95 | 64 | 58 |

The totals: exact, 1,622 and 1,552 to 1,280 (minus 342 and minus 272); nucleus, 1,815 and 1,762 to 1,839 (plus 24 and plus 77). The nucleus gain is concentrated in the Sunless songs and P (U4 +16, P +18, U5 +10, U6 +9) and the nucleus loss in B01, B08, and B10 (minus 10, 22, and 4); B08 loses 22 and 44 of its notes receive the right syllable on another note, against 27 under the baseline (`log-step1.txt`, nucleus note table).

**Instance level**, over the 2,347 seated syllables that landed on a note with a truth syllable: exact, 1,329 right on the right note, 147 right on another note, 871 wrong; nucleus, 2,022, 274, and 51 (`log-step1.txt`, "SYLLABLES seated").

**Sensitivities** (mine, not the brief's; `sens.py`, `log-sens.txt`; all over the same 2,385 notes, baseline unchanged at exact 1,622 and 1,552 and nucleus 1,815 and 1,762 for rules 2 and 3). "Extent" spreads the syllables of a one-token word over the token's own box in proportion to letters, where the brief's rule puts them all at one x. "Free" candidates are every read note of the system that is not a tie stop. "Drop" removes the surplus syllables where syllables outnumber notes, keeping one per note by least distance, instead of the nearest-note fallback; it has no parameter.

| positions | candidate notes | surplus syllables | exact (b) | nucleus (a) | systems that fell back |
|---|---|---|---|---|---|
| brief | truth notes (the brief) | nearest note | 1,280 | 1,839 | 80 of 210 |
| brief | truth notes | drop | 1,327 | 1,978 | 80 |
| brief | free | nearest note | 1,246 | 1,806 | 69 |
| brief | free | drop | 1,284 | 1,922 | 69 |
| extent | truth notes | nearest note | 1,291 | 1,869 | 80 |
| extent | truth notes | drop | 1,329 | 1,983 | 80 |
| extent | free | nearest note | 1,257 | 1,832 | 69 |
| extent | free | drop | 1,285 | 1,925 | 69 |

The 80 systems that fell back hold 805 truth notes, of which 384 are right under the exact test and 535 under the nucleus test, against 896 of 1,580 and 1,304 of 1,580 on the other systems (`log-sens.txt`, last two lines, with the totals). The fallback is a cliff: one surplus syllable in a system, from one misread or one note homr did not read, sends the whole system to nearest-note seating.

## Step 1b. The engine's cut, word-exact credit, and the product's seating

A follow-up from the coordinator, run after the rest of this report was written; nothing earlier in it was changed. **No control rule was written before this run**: the follow-up named three changes and I wrote no expectation before running, so there is nothing to score against and I add none afterwards. Scripts: `step1b.py` (all of it), `cut_engine.ts`, `diag1b.py`, `diag_cut.py`, `mk_tables1b.py`; the log is `log-step1b.txt`. Lever 2's library `lever2.py` gained a cut mode and seat metadata; the earlier results re-ran unchanged (1,280 and 1,839, `smoke.py`; the old file is `lever2_v1_backup.py`).

**What I changed, and what I read.**

1. **The cut.** `GraysonEngine.syllabify`, exported from `packages/phonology/src/index.ts:19-26` and defined in `engine.ts:1030`. The wrapper strips marks and lower-cases, protects the suffixes `ться` and `тся` (`engine.ts:1023-1026`), and calls `syllabifyOpenSyllable` at `engine.ts:1050` (the coordinator's "around line 1066" is the core's definition at `:1067`). The core (`engine.ts:1067-1124`) sends a single inter-vocalic consonant to the next syllable and, in a cluster, keeps all but the last consonant on the preceding vowel; ь and ъ stay with the consonant before them. `cut_engine.ts` imports `GraysonEngine` from `index.ts` and calls `syllabify` on each folded word, through `tsx` from the repository as before; a word with no vowel letter still gives zero syllables in the seating. `«комнатка»` cuts `ком-нат-ка` (checked on a test list).
2. **Credit (c), word-exact** (`step1b.py`). A seated syllable is right when the sewn word it belongs to, folded, equals the truth word it aligns to, folded (the alignment is `align_syl` on folded words, one to one, from the read words), and its vowel index in the word equals the truth syllable's vowel index in the truth word, and it sits on that truth syllable's note. The note must hold one syllable, and the truth syllable must have exactly one vowel letter. Baseline under (c): the baseline's seating tokens (`score44.tokens_of`, seated by rule 2 or 3) are sewn by the same `sew2`; a note is right when every token on it belongs to one sewn word, the joined tokens carry exactly one vowel, the word equals its aligned truth word, and that vowel's index in the word equals the truth vowel index. No token-to-word mapping failed (`log-step1b.txt`, "mismatches skipped: 0, 0").
3. **The seating as the product would have it.** Candidates are every read note of the system that is not a tie stop; positions are "extent"; syllables that outnumber notes are dropped by least cost (`lever2.drop_dp`, the parameter-free rule from the sensitivity table); no nearest-note fallback at all in V3.

**Question 1: how often the cut reproduces the print.** Each of the 1,407 truth words, folded with its letters right, is cut by each method and compared with its printed syllables (folded). A printed syllable counts as reproduced when the word has the same number of pieces and its piece is equal (`log-step1b.txt`, section 1). The 57 printed syllables with no vowel letter are one-syllable words that both cuts return whole, so they are counted as reproduced in both figures.

| cut | printed syllables reproduced, of 2,538 | truth words reproduced whole, of 1,407 | of the 332 hyphen-final syllables that end in a consonant |
|---|---|---|---|
| open (`openSyllabify`) | 1,933 (76.2 percent) | 1,116 | 21 |
| engine (`GraysonEngine.syllabify`) | 2,330 (91.8 percent) | 1,301 | 286 |

Without the 57 vowel-less syllables: open 1,876 of 2,481, engine 2,273 of 2,481. The 106 words the engine does not reproduce (`log-diag-cut.txt`): 80 where it keeps a consonant on the vowel that the print gives to the next syllable (`про-гляд-на-я` printed, `прог-ляд-на-я` cut; `ща-стье`, `счас-тье`; `дев-ствен-ной`, `девст-вен-ной`), 16 the other way (`сут-ся` printed, `су-тся` cut; `слы-шит-ся`, `слы-ши-тся`; `без-от`, `бе-зот`), 8 whose piece count differs (words printed as one syllable on one note: `прошел`, `каждый`, `зовусь`), and 2 whose word-level fold differs from the joined syllable folds.

**Questions 2 and 3: the three credits under each change and all together.** All songs with seating truth, 2,385 truth syllable notes; the delta is against rule 2's baseline under the same credit (`log-step1b.txt`, section 2/3).

| configuration | (b) exact | (a) nucleus | (c) word-exact | systems with more syllables than notes | syllables dropped |
|---|---|---|---|---|---|
| baseline, rule 2 | 1622 | 1815 | 792 |  |  |
| baseline, rule 3 | 1552 | 1762 | 771 |  |  |
| V0 the brief (open cut, truth notes, brief positions, nearest note) | 1280 (-342) | 1839 (+24) | 815 (+23) | 80 of 210 | 0 |
| V1 engine cut alone | 1440 (-182) | 1839 (+24) | 815 (+23) | 80 of 210 | 0 |
| V2 seating alone (free notes, extent, drop) | 1285 (-337) | 1925 (+110) | 806 (+14) | 69 of 210 | 96 |
| V3 all three (engine cut, free notes, extent, drop) | 1457 (-165) | 1925 (+110) | 806 (+14) | 69 of 210 | 96 |
| V4 engine cut + free notes + extent, nearest-note fallback (V3 without drop) | 1420 (-202) | 1831 (+16) | 795 (+3) | 69 of 210 | 0 |

- **The cut alone (V0 to V1)** moves only the exact credit, from 1,280 to 1,440 (+160). Credits (a) and (c) are identical in V0 and V1, as they have to be: both read vowels per syllable, and the two cuts give the same syllables per word.
- **The seating alone (V0 to V2)** raises (a) by 86 (1,839 to 1,925), leaves (b) about level (+5) and lowers (c) by 9 (815 to 806). V2 changes three things at once (free notes, extent positions, drop); I did not separate their effects on (c).
- **All three together (V3)** give (b) 1,457 (61.1 percent; 165 fewer than the baseline), (a) 1,925 (80.7 percent; 110 more), and (c) 806 (33.8 percent; 14 more than rule 2's 792 and 35 more than rule 3's 771). Dropping matters: V4, the same without the drop, gives 1,420, 1,831, and 795.
- **Credit (c) has a ceiling that seating cannot raise.** Of the 2,385 notes, 2,273 can be scored under (c) at all (one-vowel syllables with a mapped note), and only 878 of those belong to a sewn word that is read exactly and aligned to its truth word (`log-diag1b.txt`). Rule 2's baseline reaches 792 of 878 (90 percent) and V3 806 (92 percent): under the product's own test, what limits the count is the number of words whose every letter is right, not where the syllables sit.

**V3 per song** (`log-step1b.txt`; "systems over" is the number of systems where syllables outnumber notes, and "dropped" the syllables removed there; K and M have no syllable truth).

| song | truth syllable notes | (b) rule 2 to V3 | (a) rule 2 to V3 | (c) rule 2 to V3 | systems over | syllables dropped |
|---|---|---|---|---|---|---|
| U1 | 96 | 92 -> 86 (-6) | 93 -> 95 (+2) | 24 -> 27 (+3) | 0 | 0 |
| U4 | 108 | 76 -> 76 (+0) | 81 -> 92 (+11) | 39 -> 36 (-3) | 0 | 0 |
| U5 | 251 | 194 -> 187 (-7) | 214 -> 228 (+14) | 104 -> 114 (+10) | 7 | 9 |
| U6 | 144 | 105 -> 89 (-16) | 117 -> 122 (+5) | 40 -> 41 (+1) | 8 | 9 |
| P | 172 | 107 -> 93 (-14) | 119 -> 135 (+16) | 56 -> 59 (+3) | 0 | 0 |
| B01 | 146 | 102 -> 68 (-34) | 121 -> 106 (-15) | 55 -> 43 (-12) | 5 | 6 |
| B02 | 146 | 61 -> 51 (-10) | 70 -> 70 (+0) | 32 -> 37 (+5) | 2 | 2 |
| B03 | 146 | 107 -> 99 (-8) | 123 -> 124 (+1) | 53 -> 52 (-1) | 7 | 9 |
| B04 | 146 | 108 -> 92 (-16) | 116 -> 122 (+6) | 47 -> 49 (+2) | 2 | 4 |
| B06 | 140 | 70 -> 74 (+4) | 90 -> 107 (+17) | 29 -> 31 (+2) | 4 | 5 |
| B07 | 148 | 94 -> 84 (-10) | 109 -> 120 (+11) | 17 -> 17 (+0) | 4 | 7 |
| B08 | 140 | 97 -> 84 (-13) | 106 -> 110 (+4) | 38 -> 37 (-1) | 5 | 6 |
| B09 | 146 | 86 -> 82 (-4) | 111 -> 128 (+17) | 41 -> 45 (+4) | 6 | 10 |
| B10 | 146 | 79 -> 79 (+0) | 90 -> 101 (+11) | 41 -> 46 (+5) | 5 | 6 |
| S | 114 | 90 -> 78 (-12) | 92 -> 95 (+3) | 74 -> 74 (+0) | 6 | 7 |
| T | 196 | 154 -> 135 (-19) | 163 -> 170 (+7) | 102 -> 98 (-4) | 8 | 16 |
| ALL | 2385 | 1622 -> 1457 (-165) | 1815 -> 1925 (+110) | 792 -> 806 (+14) | 69 | 96 |

Across the 210 systems aligned, 69 have more syllables than notes (33 percent) and 96 syllables were dropped, most of them on T (16), B09 (10), and U5, U6, and B03 (9 each); U1, U4, and P drop none. Under (a) every song is level or better except B01 (minus 15). Under (b) only B06 (+4) rises, and U4 and B10 are level. Under (c) the largest losses are B01 (minus 12), T (minus 4), and U4 (minus 3), and the largest gains U5 (+10), B02 and B10 (+5 each), B09 (+4), and U1 and P (+3 each).

**The dictionary witness on V3, credit (c) only, distance 1, ties unresolved** (the same 58-word replacement table as step 2; `log-step1b.txt`, section 4). A replaced word is cut by the engine, and under (c) one corrected word turns all its syllables right at once, which is why the effect is larger here than under (a) or (b).

| song | words replaced | (c) before | (c) after | net |
|---|---|---|---|---|
| U1 | 2 | 27 | 27 | +0 |
| U4 | 3 | 36 | 36 | +0 |
| U5 | 8 | 114 | 119 | +5 |
| U6 | 5 | 41 | 43 | +2 |
| P | 5 | 59 | 62 | +3 |
| B01 | 5 | 43 | 48 | +5 |
| B02 | 3 | 37 | 42 | +5 |
| B03 | 2 | 52 | 55 | +3 |
| B04 | 1 | 49 | 52 | +3 |
| B06 | 2 | 31 | 33 | +2 |
| B07 | 5 | 17 | 20 | +3 |
| B08 | 2 | 37 | 39 | +2 |
| B09 | 4 | 45 | 48 | +3 |
| B10 | 1 | 46 | 46 | +0 |
| S | 1 | 74 | 74 | +0 |
| T | 3 | 98 | 101 | +3 |
| K, M | 7 | not scorable |  |  |
| ALL | 59 | 806 | 845 | +39 (notes gained 46, lost 7) |

So the witness takes (c) from 806 to 845 (35.4 percent; 53 more than rule 2's baseline of 792), 46 notes gained and 7 lost (4 correct words replaced and a few wrong replacements; I did not split the 7 further). The ceiling after the witness, which also rises, I did not recompute (NOT ESTABLISHED).

What this adds to the three lines at the top: the engine's cut removes most of the exact credit's loss (1,280 to 1,440, with the open cut's 332 closed syllables the reason), but with the product's seating the exact credit is still 165 short of rule 2 because misread letters and the word shifts remain; the nucleus credit gains 110 and the word-exact credit 14 over the baseline, and the witness adds 39 more under (c).

## Step 1c. The reader's own tokens, seated with drop, and the hybrid

A second follow-up from the coordinator, run after Step 1b; nothing earlier in this report was changed. Scripts: `step1c.py`, `mk_tables1c.py`; log `log-step1c.txt`.

**Control rule, written before the run** (`controls-before-measure.md`, stamped by `.t1c`, 2026-10-27 17:26:21 UTC, before `step1c.py` existed): the desk expects configuration 1 to beat rule 2 under all three credits by removing the fallback cliff, and to lose nothing elsewhere; and configuration 2 to add a further gain under (a) and (c) on the 162 two-syllable tokens, with a small loss under (b) where the engine's cut differs from the print's. The likeliest failure: dropping a surplus token drops a right one where the reader produced an extra token from noise. I added one control of my own: with every read note as a candidate and the nearest-note fallback, configuration 1's machinery must reproduce rule 3 exactly (1,552, 1,762, 771).

**What I ran.** The units are the reader's own tokens as the baseline seats them (`score44.tokens_of`: tokens split at an internal mark, the word's box shared by letters; I kept each part's extent with `tokens_ext`, and asserted its centres equal `tokens_of`'s). Nothing is sewn for seating and no single-vowel token is re-cut. Candidates are the free notes (every read note of the system that is not a tie stop). A token sits at its box centre, which is its extent's centre. **Configuration 1 (C1):** `score44.rule3` (least cost in order, a note allowed no token); where tokens outnumber notes, `lever2.drop_dp` keeps one token per note by least total distance and drops the rest, with no nearest-note fallback. **Configuration 2 (C2):** as C1, but a token with two or more vowel letters (after the fold) is first cut by `GraysonEngine.syllabify` (the cut of Step 1b, `cut_engine.ts`) into syllables, each placed within the token's box in proportion to its letters; tokens with one vowel, or none, stay as they are. Credits (b), (a), and (c) are as in Step 1b; under (c) a seated unit is a token or a syllable of a cut token, a note is right when it holds units from one sewn word with exactly one vowel between them, the word equals its aligned truth word, and the first vowel's index in the word equals the truth vowel index.

**The control reproduced** (`log-step1c.txt`, line "CONTROL"): (b) 1,552, (a) 1,762, (c) 771 against rule 3's 1,552, 1,762, 771.

**Totals.** All songs with seating truth, 2,385 truth syllable notes; deltas against rule 2's baseline under the same credit, and, because the code's seating is rule 3, against rule 3 as well. "Systems over" counts the systems where seated units (tokens in C1, tokens and syllables in C2) outnumber the notes, of the 210 aligned. The last column is a proxy and not a count of right tokens dropped: a dropped unit whose folded text equals some printed syllable of its row (repeated syllables such as `ся` make it an over-count).

| configuration | (b) exact | (a) nucleus | (c) word-exact | systems where seated units outnumber notes | dropped | dropped that equal a printed syllable of the row |
|---|---|---|---|---|---|---|
| baseline, rule 2 | 1622 | 1815 | 792 |  |  |  |
| baseline, rule 3 | 1552 | 1762 | 771 |  |  |  |
| C1 tokens with drop | 1601 (-21 vs rule 2; +49 vs rule 3) | 1836 (+21 vs rule 2; +74 vs rule 3) | 813 (+21 vs rule 2; +42 vs rule 3) | 78 of 210 | 142 | 42 |
| C2 hybrid (engine cut of tokens with two or more vowels) | 1630 (+8 vs rule 2; +78 vs rule 3) | 1955 (+140 vs rule 2; +193 vs rule 3) | 812 (+20 vs rule 2; +41 vs rule 3) | 124 of 210 | 249 | 71 |

**Configuration 1 per song** (deltas against rule 2 under the same credit; K and M have no syllable truth).

| song | truth syllable notes | (b) rule 2 to new | (a) rule 2 to new | (c) rule 2 to new | systems over | dropped | dropped that equal a printed syllable of the row |
|---|---|---|---|---|---|---|---|
| U1 | 96 | 92 -> 91 (-1) | 93 -> 93 (+0) | 24 -> 25 (+1) | 2 | 2 | 1 |
| U4 | 108 | 76 -> 78 (+2) | 81 -> 83 (+2) | 39 -> 39 (+0) | 0 | 0 | 0 |
| U5 | 251 | 194 -> 188 (-6) | 214 -> 208 (-6) | 104 -> 104 (+0) | 6 | 8 | 4 |
| U6 | 144 | 105 -> 99 (-6) | 117 -> 115 (-2) | 40 -> 40 (+0) | 8 | 12 | 3 |
| P | 172 | 107 -> 114 (+7) | 119 -> 125 (+6) | 56 -> 59 (+3) | 0 | 0 | 0 |
| B01 | 146 | 102 -> 106 (+4) | 121 -> 126 (+5) | 55 -> 55 (+0) | 3 | 4 | 1 |
| B02 | 146 | 61 -> 60 (-1) | 70 -> 70 (+0) | 32 -> 35 (+3) | 3 | 6 | 5 |
| B03 | 146 | 107 -> 105 (-2) | 123 -> 124 (+1) | 53 -> 53 (+0) | 4 | 6 | 3 |
| B04 | 146 | 108 -> 104 (-4) | 116 -> 118 (+2) | 47 -> 48 (+1) | 9 | 19 | 3 |
| B06 | 140 | 70 -> 73 (+3) | 90 -> 99 (+9) | 29 -> 33 (+4) | 8 | 19 | 6 |
| B07 | 148 | 94 -> 86 (-8) | 109 -> 108 (-1) | 17 -> 18 (+1) | 9 | 24 | 7 |
| B08 | 140 | 97 -> 93 (-4) | 106 -> 111 (+5) | 38 -> 39 (+1) | 8 | 14 | 5 |
| B09 | 146 | 86 -> 82 (-4) | 111 -> 106 (-5) | 41 -> 43 (+2) | 11 | 20 | 3 |
| B10 | 146 | 79 -> 80 (+1) | 90 -> 95 (+5) | 41 -> 46 (+5) | 4 | 5 | 0 |
| S | 114 | 90 -> 89 (-1) | 92 -> 93 (+1) | 74 -> 74 (+0) | 2 | 2 | 1 |
| T | 196 | 154 -> 153 (-1) | 163 -> 162 (-1) | 102 -> 102 (+0) | 1 | 1 | 0 |
| ALL | 2385 | 1622 -> 1601 (-21) | 1815 -> 1836 (+21) | 792 -> 813 (+21) | 78 | 142 | 42 |

**Configuration 2 per song.**

| song | truth syllable notes | (b) rule 2 to new | (a) rule 2 to new | (c) rule 2 to new | systems over | dropped | dropped that equal a printed syllable of the row |
|---|---|---|---|---|---|---|---|
| U1 | 96 | 92 -> 93 (+1) | 93 -> 95 (+2) | 24 -> 27 (+3) | 2 | 2 | 1 |
| U4 | 108 | 76 -> 86 (+10) | 81 -> 97 (+16) | 39 -> 37 (-2) | 1 | 1 | 0 |
| U5 | 251 | 194 -> 203 (+9) | 214 -> 228 (+14) | 104 -> 112 (+8) | 13 | 16 | 7 |
| U6 | 144 | 105 -> 95 (-10) | 117 -> 114 (-3) | 40 -> 39 (-1) | 9 | 19 | 3 |
| P | 172 | 107 -> 122 (+15) | 119 -> 153 (+34) | 56 -> 59 (+3) | 1 | 1 | 0 |
| B01 | 146 | 102 -> 106 (+4) | 121 -> 130 (+9) | 55 -> 55 (+0) | 10 | 14 | 3 |
| B02 | 146 | 61 -> 60 (-1) | 70 -> 70 (+0) | 32 -> 35 (+3) | 3 | 8 | 5 |
| B03 | 146 | 107 -> 99 (-8) | 123 -> 122 (-1) | 53 -> 50 (-3) | 9 | 15 | 6 |
| B04 | 146 | 108 -> 104 (-4) | 116 -> 121 (+5) | 47 -> 48 (+1) | 10 | 24 | 3 |
| B06 | 140 | 70 -> 72 (+2) | 90 -> 103 (+13) | 29 -> 32 (+3) | 9 | 24 | 8 |
| B07 | 148 | 94 -> 93 (-1) | 109 -> 119 (+10) | 17 -> 18 (+1) | 11 | 35 | 13 |
| B08 | 140 | 97 -> 92 (-5) | 106 -> 113 (+7) | 38 -> 39 (+1) | 10 | 20 | 6 |
| B09 | 146 | 86 -> 87 (+1) | 111 -> 117 (+6) | 41 -> 44 (+3) | 13 | 30 | 3 |
| B10 | 146 | 79 -> 84 (+5) | 90 -> 104 (+14) | 41 -> 46 (+5) | 8 | 13 | 2 |
| S | 114 | 90 -> 85 (-5) | 92 -> 97 (+5) | 74 -> 73 (-1) | 6 | 8 | 2 |
| T | 196 | 154 -> 149 (-5) | 163 -> 172 (+9) | 102 -> 98 (-4) | 9 | 19 | 9 |
| ALL | 2385 | 1622 -> 1630 (+8) | 1815 -> 1955 (+140) | 792 -> 812 (+20) | 124 | 249 | 71 |

**Reading the numbers against the desk's expectations.**

- **C1 beats rule 2 under (a) and (c), +21 each, and loses 21 under (b).** So the expectation "beats rule 2 under all three credits and loses nothing elsewhere" does not hold. By song, C1 is behind rule 2 under (b) on 11 of 16 songs (U5 and U6 minus 6, B07 minus 8, B04, B08, and B09 minus 4, and five smaller), behind under (a) on 5 (U5 minus 6, B09 minus 5, U6 minus 2, B07 and T minus 1), and behind under (c) on none (nine songs gain, seven are level). Against rule 3, which is the rule the nearest-note fallback belongs to, C1 is ahead under all three credits: (b) +49, (a) +74, (c) +42. The fallback cliff is therefore real against rule 3, and removing it does not by itself carry the tokens past rule 2's exact count.
- **The named failure shows, in part.** C1 drops 142 tokens in 78 of 210 systems; 42 of them equal a printed syllable somewhere in their row. That is a ceiling on how many right tokens were dropped (a repeated syllable or a noise token that happens to spell a syllable also counts), not a count of them. Where the losses are heaviest under (b) (B07, U5, U6) the drops are also many (24, 8, 12) or the systems over are many; I did not separate drops from other causes (NOT ESTABLISHED).
- **C2 adds a large gain under (a) and none under (c).** Over C1, C2 adds 119 under (a) (1,836 to 1,955, 82.0 percent of the notes, 140 over rule 2), where C2's one change is to give each vowel of a two-vowel token its own seat (I did not isolate the gain by token); under (c) it is level (813 to 812). Under (b) it **gains** 29 over C1 (1,601 to 1,630, 8 over rule 2), where the desk expected a small loss; I did not examine why, and the engine's cut matches the print for 91.8 percent of printed syllables when the letters are right (Step 1b), which may be part of it (not tested).
- **C2 pays for it in drops.** Units outnumber notes in 124 of 210 systems (against 78 for C1) and 249 units are dropped (71 of them equal a printed syllable of their row), so cutting tokens raises the number of units that compete for the same notes. Under (c) C2 is level with C1 while its drops rise, which may be why (not isolated): C2 is behind rule 2 under (c) on 5 songs (T minus 4, B03 minus 3, U4 minus 2, U6 and S minus 1) and ahead on 10; under (b) it is behind on 8 songs (U6 minus 10, B03 minus 8, B08, S, and T minus 5 each, B04 minus 4, B02 and B07 minus 1) and ahead on 8; under (a) it is behind on 2 (U6 minus 3, B03 minus 1).
- **Against Step 1b's sew-cut-align configuration V3** (free notes, extent, drop, engine cut: 1,457, 1,925, 806), C2 is ahead under all three credits (1,630, 1,955, 812) with no sewing.
- **For the amendment.** By the coordinator's own test (beat rule 2 under all three credits, lose nothing elsewhere), C1 does not pass: it fails under (b) by 21 notes and loses on 11 songs there. By rule 3, the rule the seating follows, it passes under all three. Which of the two the amendment is held to is the desk's decision, and I do not make it.

## Step 2. Lever 2b: the dictionary witness

**Control rule, written before the numbers** (`controls-before-measure.md`): the desk expects the distance-1 witness to help the photocopy songs (B01 to B10) most and to hurt where the print's pre-reform spelling is not in `ru.txt`; the likeliest failure is a replacement to a frequent short word that changes the vowel count's neighbours' alignment.

**How I tested membership.** The harness's own test (`score43.py:13`, `:19`, and `:32`): the folded sewn word is in `{w.replace('-', '') for w in wordlist('ru')}`. `ru.txt` is described in `score43.py:3` and in the stage 1 report (section 4.3) as the keys of `data/dictionary*.json` with ё folded and hyphens out; I did not compare it with those JSON files. It has 909,795 entries (908,916 distinct after the hyphen removal), **no frequency column**, and **no pre-reform letters** (no entry has ѣ, і, ѳ, or ѵ; `log-diag.txt`). The harness folds the reading with `modernisePreReform` before the test, so a correctly read old spelling is tested in its modern form. Of the 900 sewn words I could align one to one to a truth word, the folded truth word is in `ru.txt` for 835 (92.8 percent), so 65 correct words are called unknown (`log-step2.txt`, first line).

**Search** (`neighbours.py`, `log-neighbours.txt`): 997 distinct sewn words have a vowel; 454 are not in `ru.txt`. For each I generated every string at Levenshtein distance 1 and 2 and kept the dictionary words with the same vowel count. At distance 1, 331 words have a neighbour, 83 more have one at distance 2, and 40 have none within 2. **Ties:** of the 331, 58 have a single nearest word and 273 tie; at distance 2, 12 are unique and 71 tie. With no frequency, a tie is unresolved and I leave the word as read. Because a replacement keeps the vowel count, it never changes how many syllables a word has or where they sit, so the alignment does not move; the witness can only change a syllable's letters. That removes the failure the desk named.

**Result at distance 1** (D1): 59 word instances replaced (58 distinct words); against the truth words (`step2.py`, one-to-one word alignment): 24 corrected (the replacement is the truth word), 7 replaced by a wrong word, 4 correct words replaced, 24 not alignable to a truth word. 323 instances were left unresolved.

| song | words replaced | (b) gained | (b) lost | (b) net | (b) right after | (a) gained | (a) lost | (a) net | (a) right after |
|---|---|---|---|---|---|---|---|---|---|
| U1 | 2 | 0 | 1 | -1 | 71 | 0 | 0 | +0 | 95 |
| U4 | 3 | 0 | 1 | -1 | 66 | 0 | 0 | +0 | 97 |
| U5 | 8 | 2 | 1 | +1 | 154 | 0 | 1 | -1 | 223 |
| U6 | 5 | 2 | 1 | +1 | 82 | 1 | 0 | +1 | 127 |
| P | 5 | 1 | 1 | +0 | 75 | 0 | 0 | +0 | 137 |
| B01 | 5 | 1 | 0 | +1 | 79 | 0 | 0 | +0 | 111 |
| B02 | 3 | 2 | 0 | +2 | 49 | 0 | 0 | +0 | 65 |
| B03 | 2 | 0 | 0 | +0 | 84 | 0 | 0 | +0 | 118 |
| B04 | 1 | 1 | 0 | +1 | 93 | 0 | 0 | +0 | 119 |
| B06 | 2 | 0 | 0 | +0 | 56 | 0 | 0 | +0 | 93 |
| B07 | 5 | 1 | 0 | +1 | 77 | 0 | 0 | +0 | 112 |
| B08 | 2 | 0 | 1 | -1 | 68 | 0 | 0 | +0 | 84 |
| B09 | 4 | 2 | 1 | +1 | 70 | 0 | 0 | +0 | 117 |
| B10 | 1 | 0 | 1 | -1 | 70 | 0 | 1 | -1 | 85 |
| S | 1 | 0 | 0 | +0 | 63 | 0 | 0 | +0 | 93 |
| T | 3 | 1 | 1 | +0 | 127 | 0 | 0 | +0 | 162 |
| K | 5 | not scorable |  |  |  |  |  |  |  |
| M | 2 | not scorable |  |  |  |  |  |  |  |
| ALL | 59 | 13 | 9 | +4 | 1284 | 1 | 2 | -1 | 1838 |

Text level, all 2,538 printed syllables: exact 1,486 to 1,496, nucleus 1,948 to 1,953 (`log-step2.txt`). At the text level the exact count falls by one on U1 and U4 and rises on U5, U6, P, B01 to B04, K, and M. At the note level the net is plus 4 exact, all of it in the B songs (B01 +1, B02 +2, B04 +1, B07 +1, B09 +1, B08 minus 1, B10 minus 1; the Sunless songs net 0, and P, S, and T each 0), and minus 1 nucleus.

**Result at distance 2 or less** (D2): 71 instances replaced (70 distinct), 26 corrected, 13 wrong replacements, 4 correct words replaced, 28 not alignable.

| song | words replaced | (b) gained | (b) lost | (b) net | (b) right after | (a) gained | (a) lost | (a) net | (a) right after |
|---|---|---|---|---|---|---|---|---|---|
| U1 | 2 | 0 | 1 | -1 | 71 | 0 | 0 | +0 | 95 |
| U4 | 4 | 0 | 3 | -3 | 64 | 0 | 0 | +0 | 97 |
| U5 | 9 | 3 | 1 | +2 | 155 | 1 | 1 | +0 | 224 |
| U6 | 6 | 3 | 1 | +2 | 83 | 1 | 0 | +1 | 127 |
| P | 7 | 1 | 1 | +0 | 75 | 0 | 0 | +0 | 137 |
| B01 | 6 | 1 | 0 | +1 | 79 | 0 | 0 | +0 | 111 |
| B02 | 3 | 2 | 0 | +2 | 49 | 0 | 0 | +0 | 65 |
| B03 | 3 | 0 | 0 | +0 | 84 | 0 | 1 | -1 | 117 |
| B04 | 2 | 1 | 0 | +1 | 93 | 1 | 1 | +0 | 119 |
| B06 | 3 | 0 | 0 | +0 | 56 | 0 | 0 | +0 | 93 |
| B07 | 5 | 1 | 0 | +1 | 77 | 0 | 0 | +0 | 112 |
| B08 | 2 | 0 | 1 | -1 | 68 | 0 | 0 | +0 | 84 |
| B09 | 4 | 2 | 1 | +1 | 70 | 0 | 0 | +0 | 117 |
| B10 | 1 | 0 | 1 | -1 | 70 | 0 | 1 | -1 | 85 |
| S | 1 | 0 | 0 | +0 | 63 | 0 | 0 | +0 | 93 |
| T | 6 | 1 | 3 | -2 | 125 | 0 | 1 | -1 | 161 |
| K | 5 | not scorable |  |  |  |  |  |  |  |
| M | 2 | not scorable |  |  |  |  |  |  |  |
| ALL | 71 | 15 | 13 | +2 | 1282 | 3 | 5 | -2 | 1837 |

**The twenty most frequent replacements at distance 1, with the truth word beside each** (`log-step2.txt`, "TOP 20"). No pair occurs more than twice, so the "most frequent" are the first twenty of 58, in the order the log gives them (ties in count).

| read | dictionary word | instances | truth word beside it |
|---|---|---|---|
| взгод | взвод | 2 | (not aligned) x2 |
| хомнат | комнат | 1 | (not aligned) x1 |
| непод | невод | 1 | (not aligned) x1 |
| боренья | коренья | 1 | боренья x1 |
| дгевственной | девственной | 1 | девственной x1 |
| тсбой | сбой | 1 | тобой x1 |
| лремлет | дремлет | 1 | дремлет x1 |
| тныло | ныло | 1 | ныло x1 |
| ночия | ночуя | 1 | ночи x1 |
| отблес | отблеск | 1 | (not aligned) x1 |
| превратясь | превратись | 1 | превратясь x1 |
| зозут | зовут | 1 | зовут x1 |
| сслившись | слившись | 1 | слившись x1 |
| дущше | душе | 1 | (not aligned) x1 |
| лалекие | далекие | 1 | (not aligned) x1 |
| гелос | голос | 1 | голос x1 |
| сдви | сдвиг | 1 | (not aligned) x1 |
| прочьое | прочное | 1 | (not aligned) x1 |
| оглядкиб | оглядки | 1 | (not aligned) x1 |
| случанно | случайно | 1 | (not aligned) x1 |

Of these, the real confusion pairs (a misread first or inner letter that the dictionary repairs) are the rows where the truth word equals the replacement: `дгевственной`, `лремлет`, `тныло`, `зозут`, `сслившись`, `гелос`. The wrong ones are visible: `боренья` (the truth word, in the dictionary as read) becomes `коренья`; `превратясь` (the correct old form, not in `ru.txt`) becomes `превратись`; `тсбой` for the truth `тобой` becomes `сбой`; `ночия` for `ночи` becomes `ночуя`.

**Oracle ceiling, not a result** (it uses the truth): if a tied nearest word were replaced by the truth word wherever the truth word is among the tied candidates, 59 distinct words (61 instances) would be fixed, and the note count would rise by 31 under the exact test and by 1 under the nucleus test (`log-step2.txt`, last block). So even a perfect tie-break, which a frequency list might approach and `ru.txt` cannot supply, is worth about 31 notes of 2,385 under the exact test and nothing under the nucleus test.

**Against the desk's expectation.** The witness helps the photocopy songs, but by one or two notes a song: the B songs net +4 exact (B01 +1, B02 +2, B04 +1, B07 +1, B09 +1, B08 minus 1, B10 minus 1) and 0 for the others; it hurts only where a correct old spelling is called unknown (`превратясь`) or where a real word is replaced by a neighbour. I did not measure which of the 65 correct-word misses are pre-reform spellings; I can say only that `ru.txt` holds no pre-reform letters and that the fold repairs those it can.

## What the measure cannot tell

- **The 184 not-scorable read syllables** (K 116, M 46, and 22 of T) have no seating truth; K and M have no syllable truth at all, so lever 2a appears for them only at the text level. The note tables cover 16 songs, not 18.
- **Rows the reader never produced tokens for.** Three syllables of P p2 system 4 (no token at all); the 17 syllables of B10 p1 system 2 row 2, where the crop labelled Russian is a strip of staff (row cutting, by eye, from the row 115 report; lever 2 cannot reach them, and they stay lost under every variant); and the 79 truth syllables on systems with no Russian-labelled row (the row 115 report's count, not re-measured), whose notes are in the 2,385 and are never seated because no token is on those systems.
- **The oracle in step 3.** The brief seats syllables onto the notes the truth says carry a syllable; the baseline does not. The "free" rows of the sensitivity table are the nearest I have to a fair comparison, and there (a) is 1,806 against the baseline's 1,815 under rule 2 and 1,762 under rule 3.
- **The credit (a)** is my reading. The baseline under (a) is the baseline's own tokens scored by vowels, which the desk has not seen before.
- **Position rule.** For a one-token word of two or more syllables the brief's rule puts every syllable at the token's centre, and the monotone pass then orders them arbitrarily by tie-breaking; "extent" in the sensitivity table spreads them and gains 30 under the nucleus test.
- **A note that carries two printed syllables** (an elision) is scored once at the note, and can credit both syllables; this touched the three unattributed P syllables in the (a) column of the ledger table (it shows 3 right for `unattributed`).
- **The P truth** is the desk's draft, not proofed by Dann (stage 1 report, section 3), and the S, T, K, M syllables are row 81's `poem.txt`.
- **Reader and crops.** All of it is on F's readings on disk, for 18 songs; U2, U3, and B05 have no reading and none of the 18 is a phone photograph. Nothing was run in a browser.
- **Step 1b definitions.** Credit (c) is scored only on the 2,273 notes whose truth syllable has exactly one vowel letter and a mapped truth word; the other 112 can never be right under (c). Truth words and sewn words are aligned one to one by `align_syl` on folded words, so a word the alignment misses cannot score. The baseline's tokens are scored under (c) by my rule (a note holding one vowel from one sewn word), which the coordinator described only as "sewing the baseline's tokens the same way".
- **Step 1c.** The "dropped that equal a printed syllable of the row" column is a proxy and an over-count; I did not measure how many right tokens were dropped. I did not separate the causes of C1's losses under (b), and I did not test why C2 gains under (b).
- **What I inferred:** only the T not-scorable rule (matched to `ledger-F.csv`), the nucleus reading of (a), and that the fold changes no vowel count (the fold maps ѣ to е, і and ѵ to и, ё to е; I did not test it on every word).

## What I could not establish

- **Whether the desk meant my reading of (a).** I could not tell from the brief; both credits are reported throughout.
- **The row 115 scripts' own text.** They are absent; my ledger matches `ledger-F.csv` on every row, which establishes the numbers and not the original code.
- **The by-eye row cut** (17 syllables, B10 p1 system 2 row 2) was taken from the row 115 report and not re-inspected.
- **Whether `ru.txt` equals the keys of `data/dictionary*.json`.** I relied on the harness's description.
- **How many of the 65 correct words called unknown are old spellings.** Not measured.
- **Why the 80 fallback systems fell back, per system.** Misread letters, extra tokens, and unread notes all lower the candidate count or raise the syllable count; I did not separate them.
- **The effect on Dann's Chrome 155** and on any other reader: not applicable and not run.

## The scripts I wrote, and what each is for

All in `/home/claude/n135-lever2/` and all mine.

- `controls-before-measure.md`: the three control rules, written before any measurement.
- `ledger_rederive.py`: step 0, the re-derived row 115 ledger for F and its comparison with `ledger-F.csv` (`log-ledger-rederived.txt`, `ledger-F-rederived.csv`).
- `cut_words.ts`: calls `openSyllabify` through `tsx` on folded words (closed seed); `cut_words_openseed.ts` is the same with the open seed, for the seed check.
- `lever2.py`: the library of lever 2: sewing, cutting, positions, alignment, classification, the baseline seats.
- `step1.py`: lever 2a, all step 1 tables (`log-step1.txt`, `lever2-syllables-2a.csv`, `lever2-words-per-row.csv`).
- `sens.py`: the sensitivities and the regression causes (`log-sens.txt`).
- `neighbours.py`: the dictionary search (`log-neighbours.txt`, `neighbours.json`).
- `step2.py`: lever 2b (`log-step2.txt`).
- `diag.py`: the token, hyphen, and `ru.txt` facts quoted in the report (`log-diag.txt`).
- `smoke.py`: a first check that my re-count of the baseline equals score44's 1,622 and 1,552 (no log kept; `log-step1.txt` carries the same figures).
- `cut_engine.ts`, `step1b.py`, `diag1b.py`, `diag_cut.py`, `mk_tables1b.py`: step 1b (engine cut, credit (c), the product's seating; logs `log-step1b.txt`, `log-diag1b.txt`, `log-diag-cut.txt`); `lever2_v1_backup.py` is `lever2.py` as it stood for the first report.
- `step1c.py`, `mk_tables1c.py`: step 1c (tokens seated with drop, and the hybrid; `log-step1c.txt`).
- `mk_tables.py`, `assemble_report.py`, `report-template.md`: they build this report from the logs, so the tables are not retyped.

The harness copy in `harness/` holds the unchanged harness plus the logs `log42.txt`, `log42s.txt`, `log44.txt` in the parent folder; `log-diff-vs-float-folder.txt` is the byte comparison.
