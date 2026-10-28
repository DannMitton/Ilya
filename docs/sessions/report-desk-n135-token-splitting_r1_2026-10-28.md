# What the 232 token-splitting syllables are: desk measure for n135 (r1, 2026-10-28)

Measure only. Nothing in any repository was changed, committed, or published. Every count in this report comes from a script in `scripts/`, run in this container; outputs are in `work/` and `logs/`.

## 1. Controls

Written before any measure: `controls-before-measure.md` (timestamps in the file).

| item | result |
|---|---|
| Readings used | `/root/measures/n135-row117/ocr2-f6-h32-B` (all 18 songs; deskew, closing 3 by 3, ink height 32 px, paper-tone padding 16 px) |
| Scorer | `score117.py` unchanged (md5 of my copy equals the original; so do `score42.py` and `common2.py`), `RULE=R2`, 18 songs |
| Reproduced | printed 2,538; read 2,086; letter recognition 190; token splitting 232; row cutting 17; unattributed 13 |
| Match to the stored result | the output JSON equals `results/f6-h32-B.json` object for object (`scripts/control1.sh`, output in `logs/control1.txt`) |
| Null simulation | merging nothing (THETA -1000) through my simulation path gives 2,086 and 232 again |

The control passed, so the work went on.

## 2. How `score117.py` assigns a syllable to token splitting

File `/root/measures/n135-row117/harness/score117.py`:

- Lines 19 to 21 build the tokens. The boxes of a row are sorted by `bbox[0]`; each box text is cut at every run of non-letters lying between two letters (`split_internal`, `common2.py:135`); letters only are kept (`letters`, `common2.py:84`); empty tokens are dropped.
- Line 22 aligns printed syllables to tokens with `align_syl` (`score42.py:16-31`). The steps it can take are: one syllable with no token (cost 1.0), one token with no syllable (0.6), one syllable to one token, two syllables to one token, and one syllable to two tokens. The edit cost is `ed/max length` plus 0.1 for each extra unit in a group (`score42.py:15, 22-27`). A group therefore has at most two syllables and at most two tokens.
- Line 26: `one` is true only for a one-to-one group. Line 28: a syllable is read when `one` is true and `norm(token) == norm(syllable)`.
- Lines 30 to 35 give the stage, in this order, to a syllable that is not read:
  - line 31: the one hand entry for row cutting (B10 p1s2r2);
  - line 32: no token in its group, `unattributed`;
  - **line 33: its group holds two or more syllables, `token splitting` (detail `covers>=2`)**;
  - **line 34: its group holds two or more tokens, `token splitting` (detail `cut`)**;
  - line 35: otherwise `letter recognition`.

So "token splitting" is a property of the aligner's group, not of the strings. Only two group shapes can produce it: two syllables with one token (73 groups, 146 syllables) and one syllable with two tokens (86 groups, 86 syllables). Total 159 groups, 232 syllables.

## 3. Kinds, derived from the data

Script `scripts/classify.py` (rules applied in this order; the code is the definition). Letters are compared after `crude()` (`common2.py`: pre-reform letters mapped, hard sign dropped). "Covered" means the share of a syllable's letters that sit in a matching block of the token (`difflib`), 0.6 or more.

| code | kind | groups | syllables |
|---|---|---|---|
| A1 | two printed syllables read as one token, letters right | 28 | 56 |
| A2 | two syllables as one token, with letter errors in it | 3 | 6 |
| A3 | two syllables as one token, with two or more run-on letters from outside | 9 | 18 |
| B1 | two syllables, one token: only one of the two is in the token, the other was not read | 21 | 42 |
| C1 | one syllable read as two tokens, letters right when joined | 33 | 33 |
| C2 | one syllable read as two tokens, with letter errors | 10 | 10 |
| D | pairing displaced by the aligner (the reader read both pieces) | 4 | 6 |
| E1 | one syllable plus a stray pre-reform glyph token (ѵ, і, І, ѣ, Ѳ) | 21 | 21 |
| E2 | one syllable plus one stray single-letter token | 13 | 13 |
| E3 | one syllable plus extra word material | 1 | 1 |
| X | the token or tokens match neither syllable well | 16 | 26 |
| | **total** | **159** | **232** |

The counts sum to 232. The kinds you named map as follows.

- Two printed words read as one token: A1 "two words" 15 groups (30 syllables), A2 4 syllables, A3 14 syllables. Together 48 syllables of A (the first syllable has no trailing hyphen, so the truth marks a word boundary there).
- A syllable hyphen dropped inside one word: A1 "same word" 13 groups (26 syllables), A2 2, A3 4. Together 32.
- One word read as two tokens: C1 and C2 (43 syllables). In 41 of the 43 groups the two tokens come from two separate Tesseract boxes; in 2 they come from one box with a mark read inside it (C1: `д'ят`; C2: `Т-нь`).
- A hyphen or extender read where none is printed: not a kind of its own here. The scorer already splits at a mark read between letters (line 20), and the 2 one-box groups named in the previous bullet are the only token-splitting groups whose two tokens share a box. NOT ESTABLISHED whether the mark in `д'ят` is a printed mark or a read one.
- Punctuation glued or split: not a kind of its own; punctuation is removed by `letters` before the alignment.
- Stray glyphs (E1, E2, E3, 35 syllables), unread syllables (B1, 42), and displaced pairings (D, 6) were not on your list; the data put them here.

Sub-splits that matter:

- B1: in 19 of the 21 groups the unread syllable has one or two letters (13 where the first is unread, 6 where the second is).
- E1: 18 of the 21 are a glyph that is the first or second box of the row, before the syllable; 3 follow it.
- C1 and C2: of the 41 two-box groups the gap between the two boxes, divided by the row's median box height, has a median of 0.61 and a range of -2.16 to 1.17. All 6,128 adjacent box pairs of all rows have 5th, 25th, 50th, 75th, and 95th percentiles of -0.26, 0.79, 1.69, 3.91, and 12.64 (`scripts/gaps.py`).
- X: 16 of 26 syllables have little or no overlap with what was printed; 10 have partial overlap.

### Three real examples of each kind (printed, then read; box text in brackets)

A1
- B07 p2s3r1: `чест- | ву` read `честву`
- B10 p2s3r1: `мо- | жет` read `может`
- T p1s1r1: `въ | лѣ-` read `вълѣ`

A2
- U5 p7s2r1: `свет- | лый` read `светХый`
- P p1s2r2: `гѣ | мір-` read `гѣмірс` (box `-во-гѣмірс-кой`)
- P p2s2r1: `станъ | твой` read `станътвон`

A3
- U4 p1s1r2: `соз- | да-` read `Тысозда`
- U5 p5s1r1: `тясь | в` read `тясьвчер` (box `пре-вра-тясьвчер-ты`)
- P p2s1r2: `какъ | звонъ` read `какъзвонъот`

B1
- B03 p4s3r1: `ше | не` read `не`
- B04 p2s3r1: `я | счёт` read `счет`
- B06 p2s2r1: `дёт | о-` read `дет`

C1
- B04 p1s3r1: `дят` read `д | ят` (one box `д'ят`)
- B06 p1s1r1: `из-` read `и | з`
- B07 p1s2r1: `му-` read `м | у`

C2
- B01 p3s4r1: `тах!` read `ста | х`
- B03 p4s1r1: `нье.` read `ь | е`
- B06 p1s3r1: `вёшь.` read `Ве | ш`

D (only 4 groups exist; the third is the second half of the first)
- B03 p4s3r1: `сво-` read `сво | е`, and `ё | про-` read `про`
- B08 p3s2r1: `мо-` read `мо | е`, and `ё | ды-` read `ды`

E1
- B04 p1s1r1: `Ког-` read `ѣ | Ко` (box `ѣ`, then `Ко-гла`)
- B06 p3s1r1: `в` read `ѣ | в`
- B10 p2s2r1: `звать` read `звать | ѣ`

E2
- B03 p4s1r1: `я-` read `Я | в`
- B06 p1s3r1: `Ког-` read `ь | Ко`
- B07 p1s2r1: `ты` read `м | ты`

E3 (one group only)
- U6 p5s2r1: `ста` read `ста | оО` (box `ста-оО`, twice)

X
- B01 p3s2r1: `ны- | не` read `ньгне`
- B06 p2s1r1: `му | пус-` read `Іхзт` (box `т-Іхзт`)
- B07 p2s3r1: `уп- | рё-` read `пре`

### The D kind is a scorer property, and I checked the mechanism

In D the reader printed `сво`, `е`, `про` for the printed `сво- | ё | про-`. The aligner compares lowercased letters, so `ё` against `е` costs 1.0 (`cost`, `score42.py:15`). Running `align_syl` on those three against those three tokens gives the groups `сво` with `сво, е` and `ё, про` with `про`, at 0.35 + 0.35 = 0.70, against 0.0 + 1.0 + 0.0 = 1.0 for the correct one-to-one pairing. The scorer then marks all three syllables not read. With the pairing repaired, all six D syllables are read by the scorer's own test (`norm` of each token equals `norm` of its syllable; all strings are in the cache, none approximated).

## 4. Fix map

"Oracle" means: apply the one repair that suits the kind, with the printed answer used to place it, then apply the scorer's own test to the result. It is the most that repair could give for that kind; it is not an achievable number. Oracle comparisons use the harness norm cache for 1,669 comparisons and a stand-in rule for 283 (see section 6, item 3).

| kind | syllables | seating side (C2 hybrid, engine cut) | tokenizer rule on box geometry | the reader | oracle: right after its repair |
|---|---|---|---|---|---|
| A1 | 56 | Applies to 18 of the 28 groups: those with a two-vowel token. The other 10 groups hold a one-vowel token (a word with no vowel or one letter glued to a word), which the hybrid does not cut. Of the 18, 14 are in lever2's engine cut cache: 12 cut to exactly the printed pair, 2 do not, and 4 are not testable. | None possible from these data: a glued pair is one box, and the stored readings have word boxes only, no letter boxes. | Emit a space or hyphen. Not measured. | 56 |
| A2 | 6 | Cut helps only the half that is correct | None | Yes | 3 |
| A3 | 18 | As A2 | None | Yes | 7 |
| B1 | 42 | None | None | Yes: the short syllable was not read at all | 19 (the half that is present) |
| C1 | 33 | None (the hybrid cuts, it does not join) | Join the two boxes. See section 5: no gap threshold tried is a net gain | Yes | 33 |
| C2 | 10 | None | Joining does not make it right | Yes | 0 |
| D | 6 | None | None | Not needed: the reading is right | 6 after pairing 1 to 1 (4 if each group is repaired alone) |
| E1 | 21 | None | A filter on position and glyph, not a gap rule. Not run. | Yes | 20 |
| E2 | 13 | None | As E1 | Yes | 10 |
| E3 | 1 | None | None | Yes | 1 |
| X | 26 | None | None | Yes | 3 |

Whether the scorer then counts a seating-side fix: `score117.py` scores the reader's tokens and never sees seating (`score44` is a different scorer). A seating-side cut therefore changes nothing in `score117`'s count unless the cut tokens become the scorer's tokens. Simulation 3 in section 5 does exactly that.

## 5. Simulations (scorer unchanged, run on copies of the readings)

Sources: `scripts/simulate_merge.py`, `scripts/simulate_enginecut.py`, `scripts/crosstab.py`; outputs `work/sim-sweep1.txt`, `work/sim-sweep2-lone.txt`, `work/sim-enginecut.txt`, and the folders `work/sim-*`. Totals are syllables read of 2,538, against 2,086. "Gross gain" counts syllables that were not read and now are; "gross loss" counts syllables that were read and now are not.

### Simulation 1: the tokenizer rule you asked for (a gap between boxes)

Rule: join two neighbouring boxes of a row when the gap between them is at most THETA times the row's median box height and both joining edges are letters.

| THETA | read | token splitting | gross gain | gross loss | net |
|---|---|---|---|---|---|
| none (control) | 2,086 | 232 | 0 | 0 | 0 |
| 0 | 2,038 | 280 | 6 | 54 | -48 |
| 0.25 | 2,030 | 288 | 6 | 62 | -56 |
| 0.5 | 1,978 | 341 | 11 | 119 | -108 |
| 0.75 | 1,834 | 490 | 27 | 279 | -252 |
| 1.0 | 1,646 | 676 | 30 | 470 | -440 |
| 1.25 | 1,504 | 815 | 29 | 611 | -582 |

Every THETA loses. My written expectation (a small gain at 0) failed. The cause is in the data: the boxes of separate printed syllables of one word overlap or touch (B02 p1s3r1: `ка` spans 1688 to 1901 and `юсь` 1818 to 1901), so the rule joins syllables that were read right. At THETA 0.75 the gains are 23 C1, 1 C2, and 3 E2 syllables.

### Simulation 2 (my addition): join only when the first box is one consonant letter

| THETA | read | gross gain | gross loss | net |
|---|---|---|---|---|
| 0.5 | 2,081 | 5 | 10 | -5 |
| 0.75 | 2,075 | 15 | 26 | -11 |
| 1.0 | 2,069 | 21 | 38 | -17 |
| 1.25 | 2,061 | 23 | 48 | -25 |

All gains are C1. Net loss at every THETA. The loss comes from lone consonants that are printed words or syllables (such as `в`, `с`, `к`) next to a close box.

### Simulation 3 (my addition): the engine's cut applied to the scorer's tokens

Every reader token with two or more vowel letters whose folded form is in lever2's `cut-cache-engine.json`, and whose folded form has the same length as the printed letters, is cut at the engine's boundaries (a hyphen is written there). Tokens not in that cache are kept as read: 346 tokens with two or more vowels were not in it; 340 were cut; 6 were skipped for length (counts include non-Russian rows, which the scorer does not score).

Result: read 2,115 (+29), token splitting 217, letter recognition 176; gross gain 37, gross loss 8. Gains by their old kind: A1 23, A2 1, A3 3, B1 6, E3 1, letter recognition 3. The 6 B1 and the E3 and letter recognition gains are in rows where a neighbouring token was cut and the alignment moved; I did not examine each. The 8 lost syllables are now token splitting.

This is a floor for the idea, not an estimate of it: the cache holds 1,987 words from other readings, so the garbled glued tokens are mostly not testable.

## 6. Departures from the brief

1. The brief names `ocr2-f-h32-*-b9` and `-c9` for "ink height 32 with paper-tone padding". Those folders are the white-padded h32 runs. The paper-tone h32 run for all 18 songs is `ocr2-f6-h32-B` (its log and the row 117 report both give 2,086), so I used it. The paper-tone 16 px pad alone is `ocr2-f-padpaper16-*` and `f6-pad16-B`; the 2,086 is the h32 plus paper pad.
2. `python3 -I` cannot find the harness modules in a copied directory, so I ran `score117.py` with `PYTHONPATH` set to my copy of the harness. The scorer, `score42.py`, and `common2.py` are byte-identical to the originals.
3. The repo `/home/claude/ilya` and its TypeScript `modernisePreReform` are not in this container. For strings the cache lacks I used a rule stand-in, `scripts/normapprox.py`, which agrees with 5,806 of the 5,820 valued cache entries (the 14 misses are tokens with several hard signs in a row). It is used in the oracle (283 comparisons), and in the simulations for the new tokens, written to a separate copy of the cache (`work/h-sim/`).
4. I added simulations 2 and 3, and the `D` and `E` kinds, which the brief did not name.
5. Row 117's and lever2's reports were not staged; I read the stored logs, the row 117 report's tables, and the lever2 report's Step 1c text from the archives in `/root/measures`.

## 7. What I could not establish

- Whether the Tesseract letter boxes would expose the gap inside a glued pair (A kinds). The stored readings hold word boxes only; a rule on letter-level gaps is NOT ESTABLISHED and was not run.
- Whether the engine's syllabifier, run live, cuts the A1 tokens that are not in lever2's cache (4 two-vowel groups) to the printed pair. The engine is not in this container.
- Whether a repair of one kind moves the aligner's grouping of its neighbours. Simulation 3 shows that it does for 10 syllables outside A; I did not trace each one.
- Whether the stray glyphs in E1 (ѵ, і, І, ѣ, Ѳ at the start of a row) are marks printed on the page (a clef, a bar line, a stem) or letter shapes. I did not open the crops. The name "stray" describes the reading, not the page.
- Whether the kind counts would hold under another aligner. The kinds are properties of the groups this aligner makes; D shows the aligner itself moves syllables between kinds.
- The oracle column is not additive with the simulations, and it uses the printed answer to place each repair.
- The two A1 groups whose engine cut differs from the printed pair, and the 10 one-vowel A1 groups: I did not look for the cause of each.
- Whether an in-sample choice of THETA matters: it did not, because no THETA gained. A held-out check was not needed and was not run.

## 8. Files

- `/root/token-split/controls-before-measure.md`, with the expectations written before each step.
- `/root/token-split/scripts/`: `dump_groups.py`, `classify.py`, `oracle.py`, `normapprox.py`, `enginecut.py`, `gaps.py`, `simulate_merge.py`, `simulate_enginecut.py`, `crosstab.py`, `tables.py`.
- `/root/token-split/work/`: `groups.json`, `classified.json`, `oracle.json`, `enginecut.json`, `control-out.json`, `sim-*` folders, `tables-out.txt`.
- `/root/token-split.tgz`: the whole folder.
