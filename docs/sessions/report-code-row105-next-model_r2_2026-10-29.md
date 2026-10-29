# Report: row 105, the next underlay model, r5 brief (arms A, A1, A0)

Code (Sonnet 5.5), 2026-10-29, on the Mac, branch `Shane` `1ee2c0aa`, tree dirty only in `docs/`. Brief `brief-code-row105-next-model_r5_2026-10-29.md` (its "Amendments, applied (r5)" win), amending r4 and r2. Measure folder `docs/sessions/measure-row105-r4_2026-10-29/` (scripts in `scripts/`, small results in `results/` and `calibration/`). Bulk outside the tree in `~/Downloads/_desk-row105/r4/` and `~/Downloads/_desk-prereform/` (`models/rus_prereform_r4*`, `tesstrain/data/rus_prereform_r4*`). Nothing committed, pushed, or staged; no image of Dann's scans is in the tree.

## Answer first

**No arm gained. Nothing here is a candidate to ship, and r2 29,000 stays the reader.** The choosing half was B01, B03, B06, B08, chosen before training; the decision is on the 14 songs the choice never saw (B02, B04, B07, B09, B10 and the other nine), against r2 29,000 on the same 14.

Step 0b's control reproduced first: 2,086 read right, C2 1,831 / 2,032 / 1,168 (the Mac's accepted 1,168). r2 29,000 on the 14 unseen songs: **1,596 of 1,961** (choosing half 490 of 577). The bar, 41 scaled to the 14 songs' share of 2,538, is 41 x 1,961 / 2,538 = **31.7, so 32** (the pixel floor of about 20 is smaller). I computed the 14-song figure and the bar from step 0b's per-song counts, but wrote them down after the training, not before it. They do not depend on any arm's result.

| Form (float, `clean.py` frame, chosen by the choosing half and the guard) | Read right, 14 unseen (of 1,961) | Against r2 | 18 songs (of 2,538) | C2 (b) of 2,385 |
|---|---|---|---|---|
| r2 29,000 (control) | **1,596** | | **2,086** | **1,831** |
| A, r4 30,000 | 1,568 | -28 | 2,046 | 1,802 |
| A1, character set held, 31,000 | 1,557 | -39 | 2,033 | 1,792 |
| A0, process control, 30,000 | 1,578 | -18 | 2,064 | 1,799 |

- No arm is above r2, so none clears the bar of 32. Every checkpoint of every arm is below r2 on the 14 (best single chunk: A0 32,000 at 1,589, which the choice rule did not pick).
- **Which arm gained: none.** What the differences rest on: A0, which continues from 29,000 with no new data, itself loses 18 on the 14 songs (22 on the 18). So continuing alone costs about what r3 saw. A is 11 above A1 on the 14 (1,568 against 1,557): the new kind 2 (angles from the photocopies, label check) against r3's kind 2 shows no difference outside r2's spread of 41. A and A1 both sit below A0 (by 10 and 21 on the 14), so the new rows cost a little against the control. All differences between arms are smaller than r2's checkpoint spread (41), so none of them is a finding.
- Per the brief's expectation: if arm A gains nothing, the desk takes letter recognition to the reader review (QUEUE row 158) instead of a fifth training run.
- The synthetic held-out error again fell a long way (A 6.58 to 4.73 against A0's 15 to 21 on the same 1,000 rows) while the songs did not follow. The framed plain-type error also fell a long way (A 0.46 against r2's 1.60). The model learned the synthetic rows and the framed plain lines; the real songs do not reward it.

## Step 0b and the guard

- Control: r2 29,000 float form (md5 `2ff2af3e33461cd64e7d2015ef21d10d`, 7,827,478 bytes), 18 songs framed by `clean105.py` with `deskew,close:3,height:32,padpaper:16:16`: 2,086 / 2,538; C2 1,831 / 2,032 / 1,168; stages read 2,086, letter recognition 191, token splitting 231, row cutting 17, unattributed 13. The 589 framed crops I made are byte for byte r3's (0 differences by md5). I did not re-compare the 589 source crops with the desk's crop list by md5; r3 did, and the framed output is identical.
- Per-song read right, r2 29,000 (of printed): B01 133/147, B02 81/86, B03 129/147, B04 122/148, B06 104/142, B07 113/151, B08 124/141, B09 120/139, B10 99/148, S 102/109, T 176/200, K 119/131, M 48/53, U1 92/97, U4 74/112, U5 216/258, U6 125/152, P 109/177. Full file: `results/m-r2-29000-ctl.json`.
- **Guard.** The 722 plain lines framed by the same steps (re-made `.lstmf` from the framed images and their own `.gt.txt`; 722 files, kept in `~/Downloads/_desk-row105/r4/plain722framed/`). Framed BCER of r2's six float forms (`results/guard-r2.txt`, unframed beside it; the unframed figures equal `evalckpt2.txt`):

| r2 | 25,000 | 26,000 | 27,000 | 28,000 | 29,000 | 30,000 |
|---|---|---|---|---|---|---|
| unframed | 0.347 | 0.256 | 0.418 | 0.269 | 0.186 | 0.296 |
| framed | 2.290 | 1.517 | 1.915 | 1.756 | 1.602 | 1.558 |

B0 = 1.602 (29,000), **G = 2.290**, the largest of the six. A framed BCER above 1 means the model inserts more than the line holds; r2 reads framed plain type badly, and these figures are noisy chunk to chunk. The guard never fired in A or A1. In A0 (r2's own unframed training), 34,000 reached 2.669 and so is ineligible; it was not the choice.

## What was built (every count)

- **Text** by r3's `textgen.py` with seed 105, so the words are r3's. One change (item 7): U+2026 is written "..." in the same proportion. Characters of all new text and of row 82's lines missing from r2's unicharset: **none** (space aside, which the unicharset does not list). The proto in every arm is r2's own (209 classes), no `--old_traineddata`.
- **Kind 3:** row 82's 23,589 framed lines (2 dropped by the three-word filter, both from row 114's song 4, as r3), reused from r3 with their `.lstmf` (an `.lstmf` holds the image and the text, not the character set).
- **Kind 1:** 23,591 lines, row 82's `rough()` unchanged, framed. **Kind 2:** 23,591 rows made, **1,938 dropped by the label check** (8.2 percent), **21,653 kept**. **Mix in A: 23,591 / 21,653 / 23,589 = 68,833 lines** (not an exact third each because of the drops). No word list was built (item 5). Held-out synthetic set: 1,000 framed rows (500 kind-1 style, 500 kind-2 style), words disjoint from training; it is reported, not chosen by.
- **Kind 2 rotation:** drawn from the negatives of the cached deskew corrections of the **208 crops of the nine photocopy songs** (`n135-row117/results/angles.json`, md5 `7c03f79b92120f12fc32fd1d3c453de6`). Sampled |angle|: median 0.1, 90th percentile 1.2, 13.1 percent above 1.0 degrees. Real 208 crops: median 0.1, 90th percentile 1.2, 13.0 percent above 1.0. (The 589-crop figures in r3's report, 0.7 and 7 percent, are for all crops.) Angles come in 0.1 steps, as the sweep makes them.
- **Label check:** ink mass in the first and last 3 percent of columns of the label's span before the rotation and after the frame (the frame's scale divided out, and the whole row's mass ratio divided out so that closing and resampling do not count as gain); a row is dropped when either end loses over 10 percent (`scripts/kind2lib.py`). On the 200 trial rows, 19 were dropped; on the full set, 1,938.
- **Line-making times:** render kind 1 1 min 48 s, kind 2 2 min 52 s, held 15 s; framing kind 1 11 min, kind 2 18 min 40 s, held 3 min; 200-row trial: render 5.6 s, frame 12.2 s. Total about 40 min of rendering and framing, then the `.lstmf` files (time not logged). Disk before: 260 GB free. Training: 132 s for the first 1,000 iterations of A (r3 215 s), plus the evaluation and measure per chunk (about 5 min a chunk in all).

## Calibration (amendment 7), one round

Choosing half only (B01, B03, B06, B08; 85 framed rows, 1,435 truth letters) against 181 of the 200 kind 2 rows (19 label-dropped), parameters at r3's values (`calibration/damage-final.json`). `calibration/round0.json`.

| Figure | Real (choosing half) | Kind 2 | Ratio |
|---|---|---|---|
| Ink share after the frame (grey under 128), pooled | 0.0337 | 0.0304 | 0.90 |
| Median horizontal run of ink, px, after the frame | 5.0 | 7.0 | 1.40 |
| Connected components per letter of the label, after the frame (real: song-level, components over the truth's letters) | 1.944 | 2.634 | 1.36 |
| Share of rows with ink on the top or bottom edge, before the frame | 1.000 | 0.867 | 0.87 |

All four ratios are inside 0.67 to 1.5, so no owner parameter moved and no second round was run. **The sheet shows what the figures do not**: the contact sheet (20 kind 2 rows, 20 real rows of the choosing half, first 1,100 px of each; `~/Downloads/_desk-row105/r4/contact-sheet_round0.png`, md5 `21afef1287e917a65d21d47343a373f8`) shows kind 2 as thinner, cleaner type with wide even gaps, and the real rows as heavier, blotted ink with broken hyphens that read as underscores, a barline or clef at the left, and large empty stretches. The two median figures near 1.4 are the largest ratios. For the desk to judge: the four figures pass, the picture does not look the same.

## The training curves

All arms from the 29,000 float form, learning rate 0.0005, same proto, no seed flag (lstmtraining seeds itself the same way). Stop rules as amendments 4 and 5; the choosing half is B01, B03, B06, B08. A stopped on four chunks without beating its best (30,000), A1 likewise (31,000), A0 on its five chunks.

**Arm A** (`rus_prereform_r4`)

| Iterations | Plain BCER unframed | Plain BCER framed | Synthetic held-out BCER | Read right, 18 songs | Choosing half (of 577) | Unseen 14 (of 1,961) | C2 (b) / (a) / (c) |
|---|---|---|---|---|---|---|---|
| 30,000 | 0.442 | 0.463 | 6.583 | 2,046 | 478 | 1,568 | 1,802 / 2,035 / 934 |
| 31,000 | 0.607 | 0.504 | 5.803 | 1,987 | 454 | 1,533 | 1,754 / 2,023 / 876 |
| 32,000 | 0.947 | 0.578 | 5.29 | 1,972 | 451 | 1,521 | 1,719 / 1,982 / 789 |
| 33,000 | 1.12 | 0.62 | 4.994 | 1,896 | 426 | 1,470 | 1,656 / 1,951 / 574 |
| 34,000 | 1.182 | 0.595 | 4.726 | 1,935 | 437 | 1,498 | 1,667 / 1,962 / 692 |

**Arm A1** (`rus_prereform_r4a1`)

| Iterations | Plain BCER unframed | Plain BCER framed | Synthetic held-out BCER | Read right, 18 songs | Choosing half (of 577) | Unseen 14 (of 1,961) | C2 (b) / (a) / (c) |
|---|---|---|---|---|---|---|---|
| 30,000 | 0.294 | 0.487 | 6.311 | 2,024 | 465 | 1,559 | 1,795 / 2,028 / 909 |
| 31,000 | 0.661 | 0.572 | 5.501 | 2,033 | 476 | 1,557 | 1,792 / 2,026 / 881 |
| 32,000 | 0.918 | 0.608 | 5.115 | 1,987 | 455 | 1,532 | 1,719 / 1,990 / 793 |
| 33,000 | 1.259 | 0.588 | 4.853 | 1,915 | 434 | 1,481 | 1,661 / 1,965 / 769 |
| 34,000 | 1.327 | 0.448 | 4.423 | 1,863 | 427 | 1,436 | 1,635 / 1,954 / 669 |
| 35,000 | 1.579 | 0.533 | 4.33 | 1,906 | 436 | 1,470 | 1,666 / 1,970 / 672 |

**Arm A0** (`rus_prereform_r4a0`)

| Iterations | Plain BCER unframed | Plain BCER framed | Synthetic held-out BCER | Read right, 18 songs | Choosing half (of 577) | Unseen 14 (of 1,961) | C2 (b) / (a) / (c) |
|---|---|---|---|---|---|---|---|
| 30,000 | 0.271 | 1.968 | 18.552 | 2,064 | 486 | 1,578 | 1,799 / 2,015 / 1,074 |
| 31,000 | 0.322 | 1.331 | 16.133 | 2,064 | 483 | 1,581 | 1,808 / 2,022 / 1,066 |
| 32,000 | 0.566 | 1.421 | 16.683 | 2,074 | 485 | 1,589 | 1,815 / 2,009 / 933 |
| 33,000 | 0.365 | 1.574 | 15.274 | 2,002 | 461 | 1,541 | 1,729 / 1,962 / 921 |
| 34,000 | 0.235 | 2.669 | 21.41 | 2,027 | 473 | 1,554 | 1,773 / 2,002 / 1,007 |

Read right at the chosen chunk, by group: the other nine are A 1,049, A1 (31,000) 1,036, A0 (30,000) 1,054 against r2's 1,061; the measure half (B02, B04, B07, B09, B10) is A 519, A1 521, A0 524 against r2's 535; the choosing half is 478, 476, 486 against r2's 490. The loss is spread over all three groups (the clean nine lose 7 to 25, the measure half 11 to 16, the choosing half 4 to 14); no group gains. Per-song files: `results/m-rus_prereform_r4*.json`.

## Confusion pairs, per chosen checkpoint, all 18 songs

From the same alignment (`scripts/confusion4.py`): syllables aligned one to one and misread, compared letter by letter. Not trained on tonight. Counts on the harness reads differ a little from the desk's table on A2's captures, as they are different reads.

| Pair | r2 29,000 | A 30,000 | A1 31,000 | A0 30,000 |
|---|---|---|---|---|
| ь to ъ | 13 | 10 | 11 | 17 |
| ы to ъ, ь, ът, or ьт | 11 | 15 | 10 | 12 |
| й to и, н, or ш | 10 | 7 | 10 | 12 |
| с to е | 10 | 3 | 3 | 1 |
| о to с | 2 | 2 | 3 | 3 |
| с to о | 1 | 0 | 1 | 0 |
| и to н | 13 | 6 | 3 | 13 |
| п to н | 2 | 2 | 1 | 1 |
| г to т | 5 | 3 | 1 | 1 |
| г dropped | 7 | 7 | 6 | 6 |
| Syllables misread one to one (all) | 191 | 205 | 196 | 206 |

The new rows cut с to е and и to н and move the total the wrong way; the net is zero or negative.

## Every model form (float, no word list, none gzip-converted to integer)

All forms are 7,827,478 bytes (the proto's size does not change). Files in `~/Downloads/_desk-prereform/models/<name>/`; `results/model-forms.txt`. Gzipped bytes are `gzip -9`.

| File | Bytes | Gzipped bytes | md5 |
|---|---|---|---|
| rus_prereform_r4_30000.traineddata | 7827478 | 4188118 | 82859c3f7d980d8df7fa1c3a2c0f2c95 |
| rus_prereform_r4_31000.traineddata | 7827478 | 4188166 | 0f16d877452c329f41b2a5d663884d7a |
| rus_prereform_r4_32000.traineddata | 7827478 | 4187967 | 9d9e8d1329dada86f9a60a9598bc9282 |
| rus_prereform_r4_33000.traineddata | 7827478 | 4188243 | 021ecd8d613a246340d9850fd86ef4fd |
| rus_prereform_r4_34000.traineddata | 7827478 | 4187900 | f2756508913ab507bed0832054136cea |
| rus_prereform_r4a1_30000.traineddata | 7827478 | 4187902 | 0854f443ef2d444efd2ec9f9c7b28d3d |
| rus_prereform_r4a1_31000.traineddata | 7827478 | 4188168 | 6e296dd33daa32df81408e1b1e511c2d |
| rus_prereform_r4a1_32000.traineddata | 7827478 | 4187897 | 5cde62fdec67a419540ef8a1bb65a635 |
| rus_prereform_r4a1_33000.traineddata | 7827478 | 4187989 | ab81ed36ccccb24694fa26203adabe84 |
| rus_prereform_r4a1_34000.traineddata | 7827478 | 4188441 | 6b115334934157b256bb69ceb099858a |
| rus_prereform_r4a1_35000.traineddata | 7827478 | 4187856 | 1ff71cb6d4cd1decf931551af3d9a9d1 |
| rus_prereform_r4a0_30000.traineddata | 7827478 | 4188034 | c9786f24b0b526831fe21058cc7296c5 |
| rus_prereform_r4a0_31000.traineddata | 7827478 | 4188054 | 5efeee8061a1fcdf63f5f7726f0862b6 |
| rus_prereform_r4a0_32000.traineddata | 7827478 | 4188439 | 1151b303d4a4017d823ee4150d9818bb |
| rus_prereform_r4a0_33000.traineddata | 7827478 | 4187781 | 89ecd79fbf42d456e682c4bc41e430a2 |
| rus_prereform_r4a0_34000.traineddata | 7827478 | 4188083 | 53413cdb4110c6dc57ab8601d02824a8 |

r2 29,000 for reference: 7,827,478 bytes, md5 `2ff2af3e33461cd64e7d2015ef21d10d`. Nothing ships before Dann has the byte count (`CONTRACT.md` §8). No integer form was made (the float form did not gain).

## What stands between a winning arm and the app

None of this was done, and no arm won. If a later arm wins: (1) its float form's bytes, gzipped bytes, and md5, as above for these; (2) a read of the 18 songs through the app's frame (`frameRow`, the desk's replay) against r2's 1,880 / 1,710; a gain in `clean.py`'s harness that does not hold there does not ship; (3) the file placed in `apps/web/omr-underlay/` on stage 2b's branch; (4) `UNDERLAY_READER` raised one version. **Not checked at all tonight: items 2, 3, and 4.** Item 1 is given for every form above.

## Checks

- r2's files unchanged: the md5 of all 23 files of `models/rus_prereform_r2/` and `songs/models-r2/` now equal `~/Downloads/_desk-row105/r2-md5-before.txt` (`results/r2-md5-after.txt`). r3's folders were not touched.
- `git --no-optional-locks status --short -- apps packages third_party static` is empty. Nothing staged, committed, or pushed. No held-out sealed song or row 114 file was opened (the n-grams were r3's, read only).
- Arm B was not run and nothing was searched for or downloaded (amendment 10).

## What I could not establish

- **Why the synthetic and framed-plain gains do not reach the songs.** Not tested. The contact sheet suggests kind 2's look is still unlike the photocopies (thin type, even gaps, no blotting), although the four figures pass.
- Whether the four calibration figures capture what the reader cares about (they pass and the picture differs).
- The label-check end loss uses a mass ratio, a proxy for "loses ink"; a different measure could drop other rows.
- Whether a model trained on `clean.py`'s frame reads `frameRow`'s as well: not measured (stage 2b's row).
- The framed plain-type BCER above 1 for r2 (1.5 to 2.3) is odd and was not examined; the guard G (2.290) is therefore loose and fired nowhere in A or A1.
- Run-to-run noise: one seed per arm; the only noise figure is r2's checkpoint spread (41).
- The source crops' md5 against the desk's list was not re-checked (see step 0b).
- Whether any pre-1918 source for arm B exists on the Mac: not searched, by order.
