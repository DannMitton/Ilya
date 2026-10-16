# Report: row 82's model trained to 30,000 iterations and measured in N.135's harness (r1)

Code (Sonnet 5.5) on Dann's Mac, 2026-10-15, brief `brief-code-row82-retrain_r1_2026-10-15.md` and `docs/memory/CONTRACT.md`, both read whole, after row 82's report and N.135 stage 1's report, both read whole. Measures only.

- **Tree:** branch `Shane`, HEAD `1e76bae0` at the start. No git command that writes. `git --no-optional-locks status --short -- apps packages third_party static` is empty at the end. The only additions are this report and `docs/sessions/measure-row82-retrain_2026-10-15/` (7.7 MB).
- **Step 0:** `ps` showed no `lstmtraining`, `python`, `torch`, or `tesseract` process, and nothing listening on `localhost:5173` (two closed sockets owned by the Claude app only). Training started after that.
- **Held-out songs:** I read `~/Downloads/_desk-heldout-exclusions_2026-10-12.md` first. I opened no held-out song. No song was read to choose a checkpoint.

## The answer first

**The integer form is still worse than (c) on held-out type: 14.91 percent character error against 12.27 percent, so row 82's shipping rule still fails for the form that loads on Ilya's core.** The float form is 0.83 percent. Training to 30,000 did not close the gap between the two forms (row 82's first model: 15.06 and 1.67).

**(d)'s best seated share per song against stage 1's best (percent of truth syllables seated right in sound, `harness/summary.txt` against stage 1's `summary.txt`, R2 rows):** (d) raises the best cell on 5 of 16 songs (U1, U4, B07, B10, T, by 1 to 3 points), equals it on 2 (U5, U6), and leaves the other 9 to stage 1's readers. Songs at 90 or more: **1 of 16 before, 1 of 16 after (U1 only).**

| Song | Stage 1 best | (d) best | Song | Stage 1 best | (d) best |
|---|---|---|---|---|---|
| U1 | 94 (c, rule 2) | **95** (rule 2) | B04 | 77 (c) | 73 (c keeps 77) |
| U4 | 67 (c, rule 2) | **70** (rule 3) | B06 | 61 (c) | 50 (c keeps 61) |
| U5 | 76 (a) | 76 (rule 2, ties) | B07 | 65 (c) | **66** (rule 3) |
| U6 | 71 (a) | 71 (rule 2, ties) | B08 | 76 (c) | 71 (c keeps 76) |
| P | 65 (c) | 62 (c keeps 65) | B09 | 66 (c) | 60 (c keeps 66) |
| B01 | 79 (a) | 72 (a keeps 79) | B10 | 54 (c) | **55** (rule 3) |
| B02 | 45 (c) | 42 (c keeps 45) | S | 88 (t-syl) | 75 (t-syl keeps 88) |
| B03 | 80 (a) | 73 (a keeps 80) | T | 78 (t-imap) | **79** (rule 2) |

"Ties" means (d) equals the best cell. On S, T, K, M the syllables read right (sound, split tokens) rise from 335 for (c) and 336 for (a) to 389 for (d). On U1 to U6 they rise from 458 to 492 of 619. On B01 to B10 (d) reads 861 of 1,249, below (c)'s 907. On P, 97 of 177, as (a). Pages passing section 5's threshold: (d) 38 of 69, against (a) 52, (c) 46, (t-imap) 52.

**It loads in headless Chrome 155 through the real `createWorker` on the default (relaxed SIMD) core, and its text equals Node's on all three rows.**

## 1. Step 0 and the training (step 1, `train2.py`, `train2.out`)

- **What I changed from row 82's `train.py`**, in `train2.py` (header comment): a new model name `rus_prereform_r2`, so nothing of the 10,000 run is overwritten; the held-out list is `list_abs.txt` (the original's relative path failed); a stop rule for five flat chunks.
- **A false start.** `lstmtraining` restarts its own iteration counter at 0 when it loads the copy of the 10,000 checkpoint; the first checkpoint it wrote was named `_100`. I stopped that run (pid killed, about 3 minutes in; its files are in `tesstrain/data/rus_prereform_r2/aborted-run0/`, outside the tree) and restarted with `--max_iterations` set to `n - 10000`, so that n in every table is the total (10,000 plus the new run). The chunk at 11,000 scored 1.352, a reading next to 1.355 at 10,000, which is what continuing from the same weights gives.
- **Same data, lists, and learning rate 0.0005.** 20 chunks of 1,000, 11,000 to 30,000. 2,848 seconds of training and scoring in all (47.5 minutes against a ceiling of 8 hours). The stop rule (no improvement for 5,000) did not fire. The 10,000 checkpoint, `models/rus_prereform/`, and `songs/models/{float,int}` are untouched (their md5 `b336aae3...` and `4241f3c0...` are the ones row 82 recorded).

## 2. Every checkpoint on the 722-line held-out set (step 2, `evalckpt2.txt`)

BCER, BWER; 10,000 is row 82's.

| Iterations | 10,000 | 11,000 | 12,000 | 13,000 | 14,000 | 15,000 | 16,000 | 17,000 | 18,000 | 19,000 |
|---|---|---|---|---|---|---|---|---|---|---|
| BCER | 1.355 | 1.352 | 1.186 | 1.297 | 0.988 | 0.847 | 0.812 | 0.713 | 0.609 | 0.685 |
| BWER | 3.850 | 3.846 | 3.268 | 3.657 | 2.554 | 2.383 | 2.226 | 2.104 | 1.814 | 1.995 |

| Iterations | 20,000 | 21,000 | 22,000 | 23,000 | 24,000 | 25,000 | 26,000 | 27,000 | 28,000 | 29,000 | 30,000 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| BCER | 0.543 | 0.587 | 0.446 | 0.401 | 0.404 | 0.347 | 0.256 | 0.418 | 0.269 | **0.186** | 0.296 |
| BWER | 2.033 | 1.565 | 1.313 | 1.503 | 1.390 | 1.018 | 0.748 | 1.468 | 0.885 | **0.635** | 0.970 |

**Chosen: 29,000 (lowest BCER, 0.186).** The curve is noisy (27,000 and 30,000 are worse than their neighbours) and was still falling at 30,000, so the error had not flattened.

## 3. The integer form (step 3, `songs/models-r2/{float,int}/` in `~/Downloads/_desk-prereform/`)

- **The route differs from row 82's section 5b line, for one reason.** `lstmtraining --stop_training --convert_to_int --continue_from <checkpoint>` needs a checkpoint, and the driver keeps only the latest checkpoint (30,000) and the checkpoints that improved the *training* error, so no checkpoint of exactly 29,000 exists. I extracted the recognizer from the 29,000 float file (`combine_tessdata -e`) and gave it to the same `lstmtraining --stop_training --convert_to_int --continue_from <file>.lstm --traineddata <proto>` line.
- **Control:** the same route on the 10,000 float form gives an integer file with md5 `4241f3c011d736529ab441d36f798752`, equal to row 82's shipped integer form byte for byte. So the route gives the same result as row 82's for the same weights.

| File | Bytes | Gzipped | md5 |
|---|---|---|---|
| float form, 29,000 | 7,827,478 | not measured | `2ff2af3e33461cd64e7d2015ef21d10d` |
| **integer form, 29,000** | **1,016,969** | 895,290 | `7e6358e8491cb2945007b9b3a5f0a5e5` |
| row 82's first model, integer (for reference) | 1,016,969 | 895,433 | `4241f3c011d736529ab441d36f798752` |

## 4. Held-out character error, and the S, T, K, M table (step 4)

The scripts are row 82's copied unchanged into `step6/` (the held-out scorer `eval_heldout.py`, `ocr-images.mjs`, `step4.py`, `step5.py`, `step7.py`, `common.py`), with these named edits: the `../` depths in `common.py`, `step6.py`, `step7.py`, and `norm.ts` (the folder is one level deeper), and no change to any rule. The (a), (b), and (c) readings are row 82's, copied into `step6/ocr/`. **With them my run reproduces row 82's printed numbers for (a), (b), and (c): 295, 309, 315 of 493.**

Held-out character error (`heldout-d2-*.json`; 722 lines, 35,045 characters):

| | CER | ѣ | ѳ | ѵ | і | final ъ |
|---|---|---|---|---|---|---|
| (c), mapped lines (row 82, not re-run) | **12.27 %** | | | | | 944 / 1,110 |
| row 82's first model, float, original lines | 1.67 % | 407 / 408 | 58 / 165 | 138 / 189 | 302 / 305 | 1,108 / 1,110 |
| row 82's first model, integer | 15.06 % | 359 / 408 | 54 / 165 | 121 / 189 | 266 / 305 | 988 / 1,110 |
| **this model, float** (tesseract CLI) | **0.83 %** | 407 / 408 | 163 / 165 | 184 / 189 | 304 / 305 | 1,109 / 1,110 |
| **this model, integer** (tesseract CLI) | **14.91 %** | 364 / 408 | 150 / 165 | 168 / 189 | 266 / 305 | 991 / 1,110 |
| this model, integer, through tesseract.js (default core and SIMD core, identical) | 14.82 % | 365 / 408 | 149 / 165 | 168 / 189 | 268 / 305 | 991 / 1,110 |

The float form now reads ѳ and ѵ almost whole (the 585 lowercase ѳ were the limit at 10,000 iterations). The integer form's 14.9 percent is nearly the first model's 15.1, so more training gave the float form a gain of 0.84 points and the integer form one of 0.15.

Syllables right, S, T, K, M (`step6/step5.txt`, `step6-float/step5-float-form.txt`; letter for letter, which equals sound here):

| Song | Printed | (a) | (b) | (c) | **(d) integer** | (d) float form | row 82's first model: integer / float |
|---|---|---|---|---|---|---|---|
| S | 109 | 82 | 83 | 76 | **87** | 91 | 74 / 81 |
| T | 200 | 113 | 119 | 135 | **164** | 163 | 146 / 147 |
| K | 131 | 83 | 84 | 83 | **102** | 105 | 96 / 96 |
| M | 53 | 17 | 23 | 21 | **23** | 46 | 20 / 44 |
| All | 493 | 295 | 309 | 315 | **376** | 405 | 336 / 368 |

- **Pre-reform letters, integer form:** ѣ 20 right of 21 (one not read); і 5 і and 1 І of 6; word-final ъ 98 of 101 (Ъ once, е once, nothing once). Float form: ѣ 21, і 5 and 1, ъ 100 plus one ъЪ.
- **Language of each row** (`step6/step4-syll.txt`: Russian rows, called Russian, other rows, other called Russian, Russian missed), (d): S 18, 16, 55, 2, 2; T 19, 19, 21, 0, 0; K 12, 12, 7, 0, 0; M 6, 3, 8, 0, 3. Step 7's control notes wrongly removed (`step6/step7-syll.txt`): K 2, M 2 for (d).
- **M's integer reading stays at 23** while its float reading is 46. That is where the integer-float gap is widest on a real song.

## 5. Reader (d) in N.135's harness (step 5, `harness/`)

- **Whether the harness scripts take a reader (d) without an edit:** they do not; `common2.py` lists the readers. The edit, in a copy of the whole stage 1 folder at `harness/` (stage 1's own folder is as it was): `READERS` and `READERS43` gained `'d'`, `REPO` and `norm.ts`'s import went one level deeper. Nothing in a scorer changed.
- **Reader (d):** `rus_prereform` r2 integer, tesseract.js 7.0.0 from `apps/web`, Node's default core, `gzip: false`, PSM 7, on stage 1's R2 rows and crops (`~/Downloads/_desk-n135/crops2`), 18 songs (U1, U4, U5, U6, P, B01 to B04, B06 to B10, S, T, K, M). Output `harness/ocr2/<song>-d.json`. The readings of (a), (c), and (t-imap) are stage 1's, copied; **the scorers reproduce stage 1's printed numbers for (a), (c), and (t-imap)** (U1 88, 94, 71 and the others in `harness/summary.txt`).
- **Seating rule:** the three rules are printed; the one that won for Tesseract in stage 1 (rule 2) is the column read below. (d)'s best rule: rule 2 on 11 of 16 songs, rule 3 on 6, rule 1 on 1 (ties counted).

Percent of each song's truth syllables seated right in sound (`harness/summary.txt`, R2; rules 1 / 2 / 3), with the read share (split tokens, sound):

| Song | (a) read; seat 1 2 3 | (c) read; seat 1 2 3 | **(d)** read; seat 1 2 3 |
|---|---|---|---|
| U1 | 88; 88 90 88 | 94; 92 94 92 | **95; 84 95 91** |
| U4 | 49; 52 53 52 | 63; 65 67 64 | **70; 65 69 70** |
| U5 | 79; 76 76 75 | 74; 70 73 66 | **79; 76 76 70** |
| U6 | 74; 71 70 69 | 68; 65 66 60 | **78; 71 71 67** |
| P | 55; 59 60 55 | 58; 60 62 65 | **55; 55 59 62** |
| B01 | 76; 76 77 79 | 73; 73 73 71 | **72; 68 71 72** |
| B02 | 81; 40 42 39 | 76; 40 45 45 | **84; 35 42 39** |
| B03 | 81; 71 80 75 | 76; 67 75 69 | **73; 64 73 69** |
| B04 | 64; 60 62 58 | 78; 66 75 77 | **76; 64 73 64** |
| B06 | 64; 53 59 49 | 72; 51 61 46 | **60; 40 50 46** |
| B07 | 67; 60 59 54 | 69; 64 65 51 | **64; 65 65 66** |
| B08 | 74; 55 63 66 | 78; 61 76 76 | **73; 57 71 54** |
| B09 | 68; 56 60 57 | 74; 58 66 53 | **65; 55 60 57** |
| B10 | 57; 51 53 53 | 59; 51 54 53 | **60; 52 53 55** |
| S | 75; 70 71 71 | 70; 68 68 66 | **80; 75 75 75** |
| T | 62; 58 62 60 | 70; 60 65 59 | **82; 73 79 78** |

Given a token read right, (d)'s rule 2 seats it on its own note 94 percent of the time overall (1,592 of 1,700; U 96, B 92, P 97), against 95 for (a) and (c) (`harness/score44-R2.txt`, "Seating given the token is right"). **The reading limits the score here as in stage 1.**

- **Syllables read right by group** (printed; sound; split tokens, `harness/score42-R2-split.txt`): U1 to U6 619: (a) 458, (c) 457, **(d) 492**, (t-imap) 384. P 177: 97, 102, **97**, 100. B01 to B10 1,249: 870, 907, **861**, 790. S, T, K, M 493: 336, 335, **389**, 395.
- **Pages passing section 5's threshold** (`harness/score43-R2.txt`): (d) 38 of 69 [U 8 of 17, P 1 of 3, B 17 of 30, S/T/K/M 12 of 19]; (a) 52; (c) 46; (t-imap) 52.
- **Expectation written before the run:** the integer form would read the pre-reform and S, T, K, M songs better than (a) and (c), and would not beat them on the photocopied Kabalevsky pages, since it never saw photocopy type. **Likeliest failure:** the integer form's weakness on held-out type shows up on B01 to B10. Both held: (d) is higher on U1 to U6 and S, T, K, M and lower than (c) on B and P.

## 6. Headless Chrome (step 6, `harness/chrome-load-d.mjs`, `chrome-load-d.json`)

Chrome 155 (the installed one, headless), tesseract.js 7.0.0's own browser bundle, the real `createWorker`, a scratch static server, as stage 1 did for (a).

| Case | Loads | Core picked | Model fetched | Bytes |
|---|---|---|---|---|
| (d) integer, uncompressed | **yes**, 0.07 s | `tesseract-core-relaxedsimd-lstm.wasm.js` (3,905,767) | `rus_prereform.traineddata` | 1,016,969 |
| (d) integer, gzip | **yes**, 0.07 s | same | `rus_prereform.traineddata.gz` | 895,290 |
| (a), control | yes, 0.11 s | same | `rus.traineddata.gz` | 2,679,598 |

The rows read: `U1-1-s1-r1`, `B01-1-s1-r1`, `U6-2-s1-r1`, 0.05 to 0.09 s each. **The text equals Node's on all three rows, in both cases** (the page text against `ocr2/<song>-d.json`, first 100 characters). (a) in the control reads as in stage 1's `chrome-load.json`.

## Time and cost

About 50 minutes of training and scoring on this Mac, about 25 minutes of reading and scoring, CPU only. No download. No cloud.

## What I could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Why the integer form stays at 14.9 percent while the float form is at 0.83.** Row 82 named quantization, the missing dictionary data, the ѳ and ѵ imbalance, and the type; the imbalance is now partly ruled out (the float form reads ѳ and ѵ, the integer form still misses 15 and 21 of them), and the rest is not separated. I did not convert a checkpoint of another iteration to see whether the integer gap depends on the checkpoint.
- **Whether the integer form of 30,000 or 26,000 would do better than 29,000.** Checkpoint choice followed the brief's rule (float BCER).
- **Whether the held-out error would keep falling past 30,000.** It was still falling and noisy at the end; I ran to the brief's number.
- **A checkpoint of exactly 29,000**: none exists; the conversion started from the float file (section 3, with a control).
- **(c) on mapped lines was not re-run**; 12.27 is row 82's number.
- **The float form's reading in the N.135 harness**: not run (the float form does not load on the default core).
- **Whether the integer form is good enough for N.135.** The measure says: 1 of 16 songs reaches 90, as before. What the reader needs next is the Kabalevsky and P type (photocopy), which this model never saw.
- **U2, U3, B05**: not run in stage 1, so not here.

## The files

In `docs/sessions/measure-row82-retrain_2026-10-15/`: `train2.py`, `train2.out`, `evalckpt2.sh`, `evalckpt2.txt`; `heldout-d2-{float,int,int-tjs-default,int-tjs-simd}.json`, `eval-heldout-d2-*-lines.json`; `step6/` (row 82's scripts, rows, `ocr/` readings, `step4-*.txt`, `step5.txt`, `step7-*.txt`); `step6-float/` (the same with the float form as (d): `step5-float-form.txt`); `harness/` (copy of stage 1's harness with (d): `ocr2/*-d.json`, `score42-R2*.txt`, `score43-R2.txt`, `score44-R2.txt`, `summary.txt`, `chrome-load-d.mjs`, `chrome-load-d.json`).

Outside the tree, in `~/Downloads/_desk-prereform/`: `songs/models-r2/{float,int,int-gz}/`, `models/rus_prereform_r2/` (20 float checkpoints), `tesstrain/data/rus_prereform_r2/` (the working folder and `aborted-run0/`).

`git --no-optional-locks status --short -- apps packages third_party static` at the end: empty.
