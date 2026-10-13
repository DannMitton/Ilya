# Report: the Russian underlay read by Russian models, the baseline (QUEUE row 81, r1)

Code (Opus 5.5) on Dann's Mac, 2026-10-12, brief `brief-code-underlay-baseline_r2_2026-10-12.md`, read whole, after row 80's report `report-code-the-russian-line-by-its-underlay_r1_2026-10-11.md`, read whole.

- **Tree:** `9f9e896` on `Shane`. The working tree held edits I did not make: `docs/memory/PRODUCT.md` and `docs/memory/QUEUE.md`, and four untracked briefs and reviews.
- **Measures only.** Nothing under `apps/`, `packages/`, or `third_party/` changed (`git status --short -- apps packages third_party` is empty). Every instrument and its output is in `docs/sessions/measure-underlay-baseline_2026-10-12/`.
- **No git command that writes.** Q, R, U, W, Y, and Z were not opened; V and X were not used.
- **The dev server.** Nothing answered on `localhost:5173` at the start. I started it (`ilya-web` in `.claude/launch.json`) for `raster.mjs` and stopped it by its process number (50153) when the measures were done.
- **Inputs:** row 77's "after" readings (`measure-set3-four-below_2026-10-11/after/`), row 80's notes, statuses, and bands. homr was not run.

## The answer first

**Steps 4 and 6 together do not separate the Russian line.** No combination drops every extra note and keeps every Russian one. The control songs K and M still lose notes in every form.

- **The brief's language test fails on the poem's own rows.** The models read the underlay as syllables («Ос», «тань», «ся»), and a syllable is seldom a whole word. Under the brief's rule, 5 of 55 Russian rows are called Russian by (a), 5 by (b), and 6 by (c). No other row is ever called Russian.
- **Matching whole printed syllables as well as whole words separates the rows far better.** This is my variant, not the brief's. Model (c) calls 54 of 55 Russian rows Russian, with 2 false calls, both on S.
- **The whole test, at its best, still costs Russian notes.** S loses 9 of 116 Russian notes and drops 2 of 12 extras; T loses 22 of 197 and drops 9 of 14. K loses 1 to 14 notes and M 3 to 11, depending on the model.
- **No rule for one place read twice is safe.** "Keep the longer" is right in 4 of 11 pairs, wrong in 1, costs a song note in 1, and cannot decide 5. The metre rule is right in 1 and wrong in 4. The head-size measure as specified does not find the heads.
- **The baseline for N.184 is low.** The three models read 295, 309, and 315 of 493 printed syllables right. None reads ѣ right even once in 21. Only (c) reads і, 3 times in 6.
- **Code's recommendation:** fine-tune (c), `Cyrillic` from `tessdata_best`. The reasons are in the recommendation section at the end.

## 1. Rows

`rows.py` cuts each of row 80's 55 bands by the brief's rule (ink 60 below the paper tone; a row's lines exceed 2 percent of the band's width; gaps under 0.3 space merged; rows under 0.4 space dropped; 0.3 space padding). The rasters are row 80's own: `raster.mjs` (Ilya's `rasterizePdf`) made them again. Row 80's `systems.py` run on them gives byte-identical `systems.jsonl` files when the cover pages are skipped (S 0, T 0, K 1, M 2).

| Song | Systems | Rows | Rows per system, in order | Russian rows | Other rows |
|---|---|---|---|---|---|
| S | 18 | 73 | 3 4 4 4 4 6 4 4 4 4 4 4 3 4 4 4 4 5 | 18 | 55 |
| T | 19 | 40 | 2 2 3 2 3 2 2 2 2 2 2 2 2 2 2 2 2 2 2 | 19 | 21 |
| K | 12 | 19 | 2 1 1 1 1 1 2 1 2 2 3 2 | 12 | 7 |
| M | 6 | 14 | 2 1 2 3 4 2 | 6 | 8 |

**Checked by eye.** I drew every row on its band and looked at S's first six systems, T's first six, K's twelve, and M's six. Each text row is one line of print: English, Russian, and French on S; Russian and French on T; one Russian row on K and M.

- K's band holds «Andante.», «Più mosso.», and «Poco sostenuto», each cut as a row of its own.
- **The other rows include rows that are not text:**
  - the piano's high noteheads and slurs, which reach up into the band, on S, K, and M;
  - in five bands, the piano's whole staff, where row 80's band runs past the next staff (rows 4 to 12 spaces tall: S page 3 system 1, T page 2 system 3, K page 3 system 3, and M page 2 systems 3 and 4);
  - S's «poco allargando» and «a tempo».
- Every Russian row on the page became exactly one row. None was split or merged.

## 2. Three Russian-only readings of every row

`ocr-rows.mjs` reads each row crop with one model, one line of text (PSM 7). It keeps every word box, in page pixels, with its confidence (`ocr/<L>-<model>.json`). Each model's data is in its own directory, read with `gzip: false` and `cacheMethod: 'none'`, outside the tree.

| Model | File | Bytes | md5 | Source |
|---|---|---|---|---|
| (a) | `rus.traineddata.gz` | 2,679,598 | `9c66849e0afcfd659d613e71695d6f1c` | `cdn.jsdelivr.net/npm/@tesseract.js-data/rus/4.0.0_best_int/` |
| (a), unzipped and read | `rus.traineddata` | 5,053,706 | `d9803e3ca069b58b5c1dc6745d2bdf16` | the same |
| (b) | `rus.traineddata` | 15,301,764 | `2e2022eddce032b754300a8188b41419` | `github.com/tesseract-ocr/tessdata_best`, `main` |
| (c) | `Cyrillic.traineddata` | 36,730,735 | `3bc80391cf90b1e7b9c9296429e96821` | the same, `script/` |

**The float models fail on the core Node picks.** tesseract.js 7.0.0 under Node 24 loads the relaxed-SIMD core (`getCore.js:18-20`). On it, (b) and (c) abort at initialisation:

```
RuntimeError: Aborted(missing function: _ZN9tesseract13DotProductSSEEPKfS1_i)
```

- **What I ran instead.** No V8 flag turns relaxed SIMD off. I ran a scratch copy of tesseract.js 7.0.0, outside the tree, whose `getCore` loads the core named in `TCORE`. With the SIMD LSTM core and the plain LSTM core, all three models load and give the same text on a test pair of rows. All three models were then run on `tesseract-core-simd-lstm`.
- **A check on (a).** I also ran (a) on Node's default core, as row 80 did. Its output is byte-identical to the SIMD run on all 146 rows.
- **What this means for Ilya.** In the browser, `getCore` makes the same choice. So a float model will probably fail in Ilya as it stands. That is NOT ESTABLISHED: I did not run the browser path.

## 3. The poem

- **My transcription.** `poem.txt` is my typing of every Russian underlay row of S, T, K, and M from Ilya's rasters, one line per row, as printed. Pre-reform spelling is kept, punctuation is left out, and a syllable a printed hyphen joins to the next ends in "-". **It is my transcription, not a source text.**
- **Its size.** It holds 493 printed syllables: S 109, T 200, K 131, and M 53. It holds 21 ѣ, 6 і, and no ѳ or ѵ.
- **Checked against the truth.** Every `syllable` of S's truth (108) and T's (196), with hyphens and spaces removed, occurs in order in my text. None fails.
- **Normalising.** `norm.ts` runs `modernisePreReform` unchanged under `tsx`. `common.py` keeps the token where it returns `null`, then lower-cases, folds ё to е, and strips everything outside а to я.
- **A finding about the hard sign.** The models often read the heavy pre-reform ъ as two glyphs, «спитъЪ». `modernisePreReform` drops only the last one («спитъ»), so the token no longer equals «спит». The normaliser does what it was built to do. The OCR is the cause.

## 4. Each row's language, decided by the poem

`step4.py`, three variants:

- **brief:** the brief's rule exactly. A token ending in a hyphen is sewn to the next. A word counts at two letters or more after normalising. The row is Russian where at least half of its words equal a whole word of the poem.
- **joint:** as brief, but a hyphen standing alone, or leading a token, also joins its neighbours. The models give «Ди», «-», «тя» as three tokens, so under the brief's sewing the hyphen sews only to «тя».
- **syll (Code's variant, not the brief's):** the brief's sewing, matched against whole words of the poem or whole printed syllables. A part of a word or syllable still never counts.

| Song | Model | Russian rows | brief: called Russian / other called Russian / missed | joint | syll |
|---|---|---|---|---|---|
| S | (a) | 18 | 2 / 0 / 16 | 9 / 0 / 9 | 16 / 2 / 2 |
| S | (b) | 18 | 1 / 0 / 17 | 8 / 0 / 10 | 18 / 4 / 0 |
| S | (c) | 18 | 1 / 0 / 17 | 11 / 0 / 7 | 18 / 2 / 0 |
| T | (a) | 19 | 2 / 0 / 17 | 5 / 0 / 14 | 16 / 0 / 3 |
| T | (b) | 19 | 2 / 0 / 17 | 8 / 0 / 11 | 18 / 0 / 1 |
| T | (c) | 19 | 3 / 0 / 16 | 9 / 0 / 10 | 19 / 0 / 0 |
| K | (a) | 12 | 1 / 0 / 11 | 6 / 0 / 6 | 12 / 0 / 0 |
| K | (b) | 12 | 1 / 0 / 11 | 5 / 0 / 7 | 11 / 0 / 1 |
| K | (c) | 12 | 1 / 0 / 11 | 6 / 0 / 6 | 11 / 0 / 1 |
| M | (a) | 6 | 0 / 0 / 6 | 0 / 0 / 6 | 3 / 0 / 3 |
| M | (b) | 6 | 1 / 0 / 5 | 2 / 0 / 4 | 5 / 1 / 1 |
| M | (c) | 6 | 1 / 0 / 5 | 1 / 0 / 5 | 6 / 0 / 0 |

- K's tempo rows count as other rows, and no variant calls them Russian.
- **The false calls under syll, from `step4-syll.txt`:**
  - S's first English row («My child, my», read as «му», «ту»), by (a);
  - French rows on S's page 5 («ve ras» read with «те», «се»), by (b) and (c), and page 7 («el le më» read as «те те»), by all three;
  - two rows of piano noteheads and slurs on S's pages 4 and 6, by (b);
  - on M, a slur row («се ро»), by (b).
- **These are short syllables.** A two-letter syllable matches by chance. Row 80's weakness E, matching parts of words, is gone, but this one is the same kind and smaller.

## 5. The baseline for N.184

`step5.py` aligns each printed syllable to the row's tokens by least edit distance. Only a one-to-one pair can count as right.

**Syllables read right, of the printed syllables (letter for letter / in sound after step 3's normalising):**

| Song | Printed | (a) | (b) | (c) |
|---|---|---|---|---|
| S | 109 | 82 / 82 | 83 / 83 | 76 / 76 |
| T | 200 | 113 / 113 | 119 / 119 | 135 / 135 |
| K | 131 | 83 / 83 | 84 / 84 | 83 / 83 |
| M | 53 | 17 / 17 | 23 / 23 | 21 / 21 |
| All | 493 | 295 / 295 | 309 / 309 | 315 / 315 |

**The two counts agree everywhere, and I checked why** (`diag` listing of every syllable that holds ѣ or і). No model read ѣ as е, or і as и, in a syllable that was otherwise right. The models read ѣ as a hard sign or a Б. So normalising rescues no syllable here.

**Each pre-reform letter, and what each model read in its place** (`step5-letters.json` lists every place):

| Printed | Count | (a) | (b) | (c) |
|---|---|---|---|---|
| ѣ | 21 | right 0; е 1; Ъ or ъ 8; Б 3; в 2; и 1; Ф 1; Н 1; nothing 4 | right 0; е 1; Ъ or ъ 7; Б 3; в 2; и 1; Ф 1; nothing 6 | right 0; е 0; ъ or Ъ 9; ћ or Ђ (Serbian) 3; Б or б 2; ї 1; Л 1; к 1; К 1; nothing 3 |
| і | 6 | right 0; и or И 2; Ш 1; Т 1; К 1; nothing 1 | right 0; и or И 2; Ш 1; Т 1; nothing 2 | **right 3** (і 2, І 1); и 1; Ї 1; ю 1 |
| ѳ | 0 | none printed in these songs | | |
| ѵ | 0 | none printed in these songs | | |
| word-final ъ | 101 | right 77; doubled 19 (ъЪ 17, ъЪъ 1, ълЪ 1); other 5 (М 2, Ь 1, О 1, nothing 1) | right 86; doubled 12 (ъЪ 11, ълЪ 1); other 3 (М 1, ь 1, nothing 1) | **right 97**; doubled 2; other 2 (К 1, nothing 1) |

"Nothing" means the letter fell in a syllable with no token, or difflib found no letter in its place.

## 6. One place read twice, without OCR

`step6.py` finds the pairs as Fable counted them: same bar, same page, same `midi`, `x` at most 30 px apart, chords excluded. **The count agrees: S 4, T 7, K 0, M 0.** Every pair on Fable's list is found, and so is each of its notes:

- T bar 22 (x 2108 and 2122) and bar 75 (x 2691 and 2670) are both song;
- in S bar 72, both notes are extra;
- five pairs share one `type`;
- in T bar 76, the song note is the shorter.

| Pair | First note | Second note | Longer keeps | Shorter keeps | Metre keeps | On the page (by eye) |
|---|---|---|---|---|---|---|
| S 49 G4 | quarter, extra | quarter, song «прой» | tie | tie | neither | one head, two stems |
| S 69 E5 | eighth, extra | eighth, song | tie | tie | neither | one head, two stems |
| S 69 E5 | quarter, extra | quarter, song «какъ» | tie | tie | neither | one head, two stems |
| S 72 D4 | half, extra | half, extra | tie | tie | neither | two hollow heads side by side |
| T 21 F4 | quarter, extra | half, song «рой» | **song** | extra | extra | a hollow and a filled head side by side |
| T 22 C#4 | quarter, song «и» | quarter, song «про» | tie | tie | neither | one head, two stems |
| T 41 G4 | quarter, extra | half, song «шитъ» | **song** | extra | extra | a hollow and a filled head side by side |
| T 43 D5 | dotted quarter, extra | half, song «дитъ» | **song** | extra | extra | a hollow and a filled head side by side |
| T 73 F#4 | eighth, extra | quarter, song «етъ» | **song** | extra | extra | one head, two stems |
| T 75 E4 | eighth, song «у» | dotted quarter, song «да» | drops a song note | drops a song note | neither | one head, two stems |
| T 76 D#4 | quarter, song «де» | half, extra | extra | **song** | **song** | a filled and a hollow head side by side |

**Each rule, over the 11 pairs:**

- **Longer:** right 4, wrong 1 (T 76), costs a song note 1 (T 75), undecided 5.
- **Shorter:** right 1, wrong 4, costs a song note 1, undecided 5.
- **Metre:** right 1 (T 76), wrong 4, undecided 6.
  - The bars' sums over both voices are 9/8 to 7/4 against truths of 3/4 and 1. Removing one note matches the truth only in T 21, 41, 43, 73, and 76.
  - There, removing the Russian half or quarter is what makes the sum right. So the metre keeps the other language's note.
- **Larger head:** NOT ESTABLISHED by measure (see Could not establish). By eye it decides none: no pair has two heads of different size.
- **The cost in K and M:** 0, since they hold no pair.

**How the cases differ from the ossia, on the page.** Dann's ruling of 2026-10-02 is about two heads on one stem. The pairs here are two other cases:

- **one head with two stems** (6 pairs): one printed notehead serves both lines, with the Russian stem up and the other line's stem down, often of a different length. homr writes it as two notes in two voices.
- **two heads side by side, each with its own stem, of one size** (5 pairs): a hollow and a filled head, the two lines' different lengths at one place.

His ruling is not extended here.

## 7. The whole test

`step7.py`, per model:

1. A note is dropped where its column (`imgpos` x ± 30 px) holds a word, with a letter and confidence 30 or more, from a row called other, and no word from a row called Russian.
2. Then, among the notes left, each step 6 pair loses its shorter note.

**With the brief's row calls (step 4, brief):**

| Song | Model | Russian kept | Russian dropped | Extra kept | Extra dropped |
|---|---|---|---|---|---|
| S | (a) | 15 | 101 | 8 | 4 |
| S | (b) | 16 | 100 | 5 | 7 |
| S | (c) | 7 | 109 | 4 | 8 |
| T | (a) | 41 | 156 | 2 | 12 |
| T | (b) | 44 | 153 | 2 | 12 |
| T | (c) | 20 | 177 | 1 | 13 |

| Control | (a) wrongly removed | (b) | (c) |
|---|---|---|---|
| K, of 134 | 87 | 91 | 97 |
| M, of 62 | 28 | 35 | 35 |

**With Code's row calls (step 4, syll):**

| Song | Model | Russian kept | Russian dropped | Extra kept | Extra dropped |
|---|---|---|---|---|---|
| S | (a) | 96 | 20 | 11 | 1 |
| S | (b) | 107 | 9 | 10 | 2 |
| S | (c) | 103 | 13 | 9 | 3 |
| T | (a) | 151 | 46 | 7 | 7 |
| T | (b) | 165 | 32 | 7 | 7 |
| T | (c) | 175 | 22 | 5 | 9 |

| Control | (a) wrongly removed | (b) | (c) |
|---|---|---|---|
| K, of 134 | 1 | 10 | 14 |
| M, of 62 | 11 | 7 | 3 |

- **Against row 80.** Its best form, E, dropped 13 of S's Russian notes and 43 of T's, and 3 and 6 extras.
- **The joint calls** fall between the two (`step7.txt`).
- **The pair rule adds little.** Most extras that are dropped are dropped by the column. The pair rule adds up to 4 dropped extras in T, at a cost of at most 1 Russian note, and none in S, since S's pairs are all of one length.
- **Why Russian notes still drop when every Russian row is called Russian** (`diag7.txt`). Under the syll calls, T (c) drops 20 Russian notes by the column, and every one of them carries its own syllable in the truth. So the Russian word was not found within ± 30 px of the note: its box is missing, below confidence 30, or offset from `imgpos`. Which of these, I did not measure.

## Code's recommendation

**Row 82 should fine-tune (c), `Cyrillic` from `tessdata_best`.**

- It reads the most syllables right: 315 of 493.
- It is the only model that reads і.
- It reads the word-final ъ right 97 times in 101, where (a) and (b) double it 19 and 12 times.
- Under the syllable match it calls every Russian row of T and M Russian.
- **Its weakness is ѣ**, which it reads as ъ, Ъ, or the Serbian ћ and Ђ. That is what fine-tuning on pre-reform lines would teach.
- **Two cautions:**
  - A float model does not run on the core tesseract.js picks under Node, and probably not in the browser either (section 2). Row 82 should measure whether its result, converted to an integer model, runs on Ilya's own path.
  - Only the float `tessdata_best` models can be a starting point for fine-tuning. That is from Tesseract's training documentation as I know it; I did not read or test it this row.

**Steps 4 and 6 together do not separate the Russian line.**

- **What helps:** deciding a row by whole printed syllables, not whole words. It is the first form that keeps S's Russian line nearly whole (107 of 116 with (b)).
- **What still fails:**
  - Russian notes drop where the Russian syllable's box is not in the note's column.
  - Most extras are kept: 9 to 11 of 12 in S, 5 to 7 of 14 in T.
  - The controls still lose 1 to 14 notes.
- **Why no pair rule closes the gap.** Of the 11 pairs, 6 are one printed head that serves both lines. Dropping either note is a matter of which stem is Russian, which the stem direction on the page may decide and nothing measured here does.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **The larger head, as the brief specifies it.**
  - Centred on `imgpos`, the window often misses the head: `imgpos` y lies up to 2 spaces from the printed pitch. It finds a stem or a piece of staff line. The widths range from 1 to 57 px (`step6.txt`).
  - Centred on the printed pitch (my variant), it finds the heads, but each pair's two heads touch through stems and lines. One component covers both, at the full window width of 57 px.
  - So no pair has two measured widths. The by-eye reading (no pair has heads of two sizes) is mine.
- **Whether a float model runs in the browser.** I ran the float models only under Node, on a non-relaxed core. Ilya's browser path was not run.
- **Whether a model converted to integers keeps (c)'s readings.** Not tried.
- **K's and M's poem against a source.** My transcription of K and M has no truth syllables to check against (row 80 found none). S and T were checked; K and M were not.
- **Why each Russian note in section 7 has no Russian word in its column:** a box missing, below confidence 30, or offset from `imgpos`. Not separated.
- **ѳ and ѵ.** None is printed in these four songs, so the baseline has no count for them.
- **Truth file paths for K and M.** `run.py:55-57` derives them for the scorer; I used `heldout2-truth-r2/truth/<stem>.truth.json`, the original, for the bar lengths, as row 80's `status.json` did. Whether the corrected K truth would change any bar length in step 6 was not checked. K has no pair, so step 6 does not depend on it.

## The files

In `docs/sessions/measure-underlay-baseline_2026-10-12/`:

- **Scripts:**
  - `raster.mjs`: row 80's, copied
  - `rows.py`: step 1
  - `ocr-rows.mjs`: step 2
  - `norm.ts` and `common.py`: step 3
  - `step4.py`
  - `step5.py`
  - `step6.py`
  - `step7.py`
  - `diag7.py`
- **Data:**
  - `<L>.rows.jsonl`
  - `ocr/<L>-<model>.json`: every word box, no images
  - `poem.txt`: my transcription
  - `norm-cache.json`
  - `calls-<variant>.json`
  - `step5-letters.json`
- **Output:** `step4-brief.txt`, `step4-joint.txt`, `step4-syll.txt`, `step5.txt`, `step6.txt`, `step7.txt`, and `diag7.txt`.

Kept outside the tree, in the session scratchpad (gone at the session's end):

- the rasters, row crops, and pair crops;
- the three models;
- the scratch copy of tesseract.js.
