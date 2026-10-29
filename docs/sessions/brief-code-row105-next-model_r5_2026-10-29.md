# Brief: row 105, the next underlay model, r4 (r2's run again, with r3's lessons)

Desk (Opus 5.5), 2026-10-28. For Code on Dann's Mac, Sonnet. **NOT YET REVIEWED BY FABLE.** Training keeps nothing in the tree, so under `docs/memory/CONTRACT.md` §1 item 19 it may run before the review; DESK DEFAULT: it waits for Fable's review of this brief anyway (after Sunday 2026-11-01 04:00), because r3's run showed that a brief error costs a whole run. Dann's ruling stands: training on the Mac uses no Claude tokens and he favours it when the training is well conceived (2026-10-27 14:27, `docs/memory/INBOX.md:449`).

**This brief amends brief r2** (`docs/sessions/brief-code-row105-next-model_r2_2026-10-27.md`), which stands wherever this one does not change it. Read r2, then r3's report (`docs/sessions/report-code-row105-next-model_r1_2026-10-27.md`), both in full, before you start. Name every model and folder `rus_prereform_r4`; r3's files stay as they are.

## 1. What r3 showed, in counts

r3 (`rus_prereform_r3` 30,000, the only checkpoint the plain-type guard allowed) read 2,029 of 2,538 syllables right on the 18 framed build songs, against r2's 2,086; seating (b) 1,793 against 1,831. Both are inside r2's own checkpoint spread (2,045 and 2,049 at 28,000 and 30,000). The photocopies fell 1,025 to 976. Meanwhile the error on r3's own held-out synthetic rows halved (31.71 to 16.27). The word list cost 102 read right. Nothing shipped; r2 is still the reader.

So r3's synthetic rows taught something the real rows do not reward. Three causes, none tested by r3, each named in its report:

1. **Rotation.** Kind 2 rotated uniformly within ±3.0 degrees. The real crops' angles: median 0.1 degrees, 90th percentile 0.7, 7 percent above 1.0 (r3 report, "Kind 2 damage"). The framing deskews, so most real rows reach the reader near level; r3 spent its training on tilts the reader almost never sees after the frame.
2. **The guard measured a different input from the one trained.** The plain-type BCER guard ran on row 82's 722 lines unframed, while r3 framed every training line of kind 3. Its rise (0.296, 0.634, 0.996, 1.172) may be partly that mismatch.
3. **The held-out set shared the renderer**, so choosing a checkpoint by it measured how well the model learned the renderer.

## 2. What changes from r2

1. **Rotation (r2 section 2, kind 2).** Draw each kind 2 row's angle from the real crops' angles, not uniformly: the deskew angles `clean.py` cached for the 589 crops of `~/Downloads/_desk-n135/crops2` (r2's step 0b computes them; find the cache file it writes and name it). Sample the angle before the frame, then frame as r2 says; report the sampled distribution beside the real one (median, 90th percentile, share above 1.0).
2. **Damage calibrated, before any training.** After building 200 kind 2 rows (r2's timing step), compute on them and on the nine photocopy songs' framed crops, both after the frame: the share of ink pixels, the median horizontal run length of ink, the number of connected components per letter of the label, and the share of rows with ink touching the top or bottom edge. Report the four pairs. Where a kind 2 figure lies outside half to double the real one, adjust that damage parameter, rebuild the 200, and report again; stop after three rounds and report. Save a contact sheet of 20 kind 2 rows and 20 real photocopy rows, side by side, as a PNG in the measure folder, for the desk to look at.
3. **The guard on the framed lines.** Score every chunk on row 82's 722 lines framed by `clean.py` with r2's steps, and also unframed. The stop rule and the choice rule read the framed figure: in step 0b, measure r2 29,000's framed BCER on the 722 lines, B0; stop the run when the framed BCER is above 1.5 times B0 on three chunks in a row (DESK DEFAULT); no checkpoint whose framed BCER is above 1.5 times B0 may be chosen. Report both figures for every chunk and for r2.
4. **The checkpoint is chosen on real rows, never on a song.** The held-out set for the choice: the harness's framed crops of the nine photocopy songs, split by song into two halves before training (B01, B03, B06, B08 for choosing; B02, B04, B07, B09, B10 for the measure only). Choose the checkpoint with the best read right on the choosing half; then report all 18 songs as r2 section 4 does, and the measure half apart. Keep r2's synthetic held-out set and report its error too, but do not choose by it. DESK DEFAULT: this uses build songs to choose, which r2 forbade; the measure half and the other nine songs stay unseen by the choice, and the report says so in its first lines.
5. **No word list.** r3 measured it at minus 102. Do not build it.
6. **Mix.** One third each, as r2. If calibration (item 2) reduces kind 2's damage, keep the share.

## 3. Arm B, only if its sources exist: real rows read by a teacher

r2's step 3b of row 82 (QUEUE row 82, `brief-code-prereform-model_r3_2026-10-12.md`) proposed real underlay rows from pre-1918 scans, read by TrOCR `taiga75/ru-trocr-1700s` (MIT), as training lines. On 2026-10-28 the desk found `~/Downloads/_desk-teacher-scans/` empty, and TrOCR's local folder `~/Downloads/_desk-trocr/` holds only the build songs' crops, which may never train. So no teacher rows exist.

Arm B runs only if both hold, checked before any training: (a) at least 20 pages of pre-1918 printed Russian song scores that are in no build song, no row 114 song, and nothing the exclusions file lists (`~/Downloads/_desk-heldout-exclusions_2026-10-12.md`, read first), are on the Mac or reachable by a download Dann approves; (b) TrOCR runs from `~/Downloads/_desk-trocr/venv`. If either fails, say so in one line and run arm A alone. If both hold: cut their underlay rows with the harness, frame them, read each with TrOCR and with r2; keep a row as a training line only where the two readings agree letter for letter after `modernisePreReform`, with TrOCR's spelling; apply r2's three-word filter to every kept line; report the rows read, kept, and filtered. Arm B is arm A plus these rows as a fourth kind, trained as a second run from the same 29,000 start, measured the same way.

## 4. Expectation, written now

Read right on the 18 songs above 2,086 by more than r2's checkpoint spread (41) and the pixel floor (about 20), the gain on the photocopies; framed plain BCER within 1.5 times B0. Likeliest failure: the calibrated damage is now too light to move the photocopies at all, which shows as the photocopy group within 20 of 1,025 at every checkpoint. If arm A gains nothing, the report says so first, and the desk takes letter recognition to the reader review (QUEUE row 158) instead of a fifth training run.

## 5. Report

`docs/sessions/report-code-row105-next-model_r2_<date>.md`, measure folder `docs/sessions/measure-row105-r4_<date>/` with scripts in `scripts/`, never `build/` (`.gitignore:6` ignores `build/`). The bulk outside the tree in `~/Downloads/_desk-row105/r4/`. Answer first: read right and (b) against 2,086 and 1,831, per arm, with the choosing half named. Then the calibration pairs, the training curve with both plain figures, and every model form's bytes and md5. Nothing ships before Dann has the byte count (`CONTRACT.md` §8).

## 6. What you could not establish

A section of its own. NOT ESTABLISHED beats a complete invented answer.

Known at briefing: whether the four calibration figures capture what the reader cares about; whether any pre-1918 source for arm B exists on the Mac; whether a model trained on `clean.py`'s frame reads `frameRow`'s frame as well (stage 2b's measure, not this row's).

## Amendments, applied (r5, desk, 2026-10-29 16:3x). Where this section and anything above it differ, this section wins.

Dann ordered the reader work started today (2026-10-29 15:43, `INBOX.md`), with an Opus review standing in for Fable as the antagonist. That review (`review-opus-brief-row105-r4_r1_2026-10-29.md`, verdict SEND WITH AMENDMENTS, 13, 171k tokens) is applied in full below, verbatim from its "Amendments" section. The desk re-read four of its citations before applying: `evalckpt2.txt:15-20`, r2 section 2 item 2, r3's report lines 59 and 61, and the contents of `apps/web/scripts/` on `Shane` `1ee2c0aa`.

**Desk addition: the confusion pairs, measured per arm, not trained on tonight.** The desk's confusion table of today (`~/Downloads/_desk-2026-10-29/confusion-table_2026-10-29.tgz`, built on the A2 captures at stage 2b r5 step 7: 198 syllables misread one to one, 425 in split or merged alignments, 35 unread) names the costliest pairs, printed to read: ь to ъ (14); ы to ъ, ь, ът, or ьт (16); й to и, н, or ш (13); с to е (10) and о to с (3), с to о (2); и to н (9) and п to н (2); г to т (7) and г dropped (7). Tonight changes no training data for these, so the arms stay separable (amendment 1's reason). Instead, for every arm's chosen checkpoint and for r2 29,000, report on all 18 songs the count of each of these pairs, from the same read-against-truth alignment the measure uses, in one table in the report.

## Amendments

### 1. New section 2a: control arms in the same night (the lead)

Evidence: r3 report:39 and :62 (training 215 s per 1,000 iterations; line making about 85 minutes, kind 2 framing 27 minutes); r3 report:61 (the unicharset change); r4:30 (arms are already allowed).

Insert after r4 section 2:

> **2a. Arms, all from the same 29,000 start, same seed, same learning rate, measured the same way (section 2 item 4).** In this order:
> - **A (r4):** section 2 as written.
> - **A1, the character set held:** r3's own lists from `~/Downloads/_desk-prereform/tesstrain/data/rus_prereform_r3/`, with every line holding U+2026 removed, trained on r2's proto with no `--old_traineddata`. Against r3, A1 isolates the character set. Against A, it isolates the new kind 2.
> - **A0, the process control:** r2's original training list as r2 trained it (unframed, r2's proto), five chunks. It measures what continuing from 29,000 does with no new data.
>
> Folders `rus_prereform_r4`, `_r4a1`, `_r4a0`, each its own. Report each arm's curve. The report's first lines say which arm gained, and which difference between arms the gain rests on. Short of time, skip A0, then A1, and say so.

### 2. Section 2, new item 7: keep r2's character set

Evidence: r3 report:61 (U+2026 from 0.2 percent of word ends; 210 classes against 209).

> 7. **Character set.** Leave U+2026 out of the generated text: write "..." or no mark, in the same proportion. The list of characters missing from r2's unicharset must then be empty, and the proto keeps r2's unicharset with no `--old_traineddata` (r2 section 2's rule). If any other character is missing, stop and report it before training.

### 3. Section 1 cause 1 and section 2 item 1: the mechanism, the source set, and a label check

Evidence: r2:25 (every line framed); row 117:120 and :124 (36 of 208 photocopy crops over 0.5 degrees; ink lost at the ends); r3 report:58.

In section 1, replace cause 1's last sentence ("The framing deskews ... after the frame.") with:

> The frame deskews the training rows too (r2 section 2), so the tilt itself mostly did not reach the trainer. What reached it was what deskew cannot undo: ink cut off at the row's ends while the label kept every letter, and a second resampling. This is the desk's inference, not measured.

In item 1, replace "the deskew angles `clean.py` cached for the 589 crops ... and name it" with:

> the deskew angles `clean.py` cached for the **208 crops of the nine photocopy songs** only, since kind 2 imitates the photocopies. The cache is `results/angles.json` of row 117's `clean.py` (row 117 report:200). r3's bulk is now in `apps/web/test-results/_desk-hold/row105-measure_2026-10-27/` (`BULK-MOVED.md:1`). Name the file and its md5. Sample the negative of the cached correction angle.

Append to item 1:

> **Label check.** For every kind 2 row, compare the ink in its first and last 3 percent of columns (by the label's text span) before the rotation and after the frame. Drop any row that loses more than 10 percent of the ink in either end (DESK DEFAULT), and report the count dropped. Render with enough margin that the rotation cannot cut the text.

### 4. Section 2 item 3: the guard as written rejects r2's own checkpoints

Evidence: `docs/sessions/measure-row82-retrain_2026-10-15/evalckpt2.txt:15-20` (r2's unframed BCER: 0.347, 0.256, 0.418, 0.269, 0.186, 0.296 at 25,000 to 30,000). r2's 30,000 is 1.59 times its 29,000, so a 1.5 times B0 guard would rule out r2's own next chunk. The guard fires on noise.

Replace item 3's text from "in step 0b, measure" to the end of the item with:

> in step 0b, measure the framed BCER of r2's 25,000 to 30,000 float forms (`models/rus_prereform_r2/rus_prereform_r2_<n>.traineddata`) on the 722 lines. B0 is 29,000's figure, and the guard G is the largest of the six. Framing the 722 lines means re-making their `.lstmf` from the framed images and their own `.gt.txt`; keep that set outside the tree and report its count. Stop an arm when the framed BCER is above G on three chunks in a row. A checkpoint above G may not be chosen. Report both figures, framed and unframed, for every chunk and for r2's six.

### 5. Section 2 item 4: a stop rule, or the run goes on all night

Evidence: r2:35 stops "when the held-out error has not improved for 5,000". That error is the synthetic one, which kept falling in r3 (r3 report:32-35). r4 removes it from the choice but not from the stop. At 215 s a chunk, the 8-hour ceiling allows over 100 chunks.

Append to item 4:

> **Stop an arm** when the choosing half's read right has not beat its best for four chunks in a row, or at 40,000 iterations, or on the guard (item 3), whichever comes first. This replaces r2 section 2's "Iterations" stop. Read the choosing half after every chunk.

### 6. Sections 4 and 5: decide on the songs the choice never saw

Evidence: r4:22 (the choosing half is in the 18); r4:34 ("by more than r2's checkpoint spread (41) and the pixel floor (about 20)" can be read as the sum or as the larger of the two); r2:61 ("exceeds both"); the choosing half holds about 572 of the seated notes (`report-desk-n135-frame-plus-c2_r1_2026-10-27.md:30-37`). Choosing the best of up to 11 checkpoints on about 570 syllables inflates the winner's count on those songs.

Replace section 4's first sentence with:

> **The decision is on the 14 songs the choice never saw** (the measure half, B02, B04, B07, B09, and B10, plus the other nine), against r2 29,000 on the same 14. Read r2's figure from step 0b's per-song counts before training, and write it in the report's first lines. A gain is real only when it is larger than 41 and larger than 20, so the bar is 41, scaled to the 14 songs' share of the 2,538 syllables and stated as a number before training. The 18-song total and (b) are reported beside the decision, never as the decision.

In section 5, replace "Answer first: read right and (b) against 2,086 and 1,831, per arm, with the choosing half named." with:

> Answer first: per arm, read right on the 14 unseen songs against r2's figure on them, then the 18-song read right and (b) against 2,086 and 1,831, with the choosing half named.

### 7. Section 2 item 2: one figure is zero by construction, and no parameter is mapped

Evidence: `padpaper:16:16` pads every side with paper (row 117 report:463). After the frame, no ink touches the top or bottom edge on any row, real or synthetic, so the fourth pair is 0 against 0. Row 117:346 is the pre-frame figure (207 of 208 photocopy crops carry ink on the top row). "Adjust that damage parameter" names no parameter. Calibrating on all nine tunes training to the measure half.

Replace item 2 from "compute on them" to "report again;" with:

> compute, on the 200 kind 2 rows and on the **choosing half's** framed crops (B01, B03, B06, B08 only), the share of ink pixels (grey under 128) and the median horizontal run of ink, both after the frame, and the connected components per letter of the label, after the frame. Also compute, **before the frame**, the share of rows whose ink touches the top or bottom edge. Report the four pairs. Each figure has one owner: ink share, the dilation share and heavier-toner share; run length and components per letter, the erosion share and the pepper; the edge share, the cut share. Where a kind 2 figure lies outside 0.67 to 1.5 of the real one (DESK DEFAULT, tighter than half to double, which allows a doubled ink share), move only its owner, rebuild the 200, and report again;

### 8. Step 0b: the Mac's (c) is 1,168, and Dann accepted it

Evidence: r2:50 expects 1,166 and r2:51 says "If any number differs, stop". r3 report:23 and `docs/memory/STATE.md:93` record Dann's acceptance of 1,168 on the Mac. r4 does not amend it, so Code stops at step 0b again.

Add to section 2:

> 8. **Step 0b's expectation** is 2,086 read right and C2 1,831 / 2,032 / **1,168** (the Mac's baseline, accepted 2026-10-27 20:17, `STATE.md:93`). Also record per-song read right for the 18 (amendment 6). Any other difference stops the run.

### 9. New section 2b: reuse r3's tools; check the disk

Evidence: r3 report:85 (venv at `~/Downloads/_desk-row105/venv`, `bin/tsx`, Playwright Chromium 145, `clean105.py`, `map_boxes105.py`, `measure105.py`); `STATE.md:98` (r3's `build/` stayed on the Mac, git-ignored); `BULK-MOVED.md:1`. r4:38 invites a rewrite.

> **2b. Start from r3's tools.** Copy `docs/sessions/measure-row105-next-model_2026-10-27/build/` (on the Mac only) into `scripts/` of this measure folder: `textgen.py`, the kind 2 damage, `clean105.py`, `map_boxes105.py`, `measure105.py`, and `bin/tsx`. Name each edit in its header. Change only what section 2 changes. Use r3's venv and Chromium. The harness r3 unpacked is now under `apps/web/test-results/_desk-hold/row105-measure_2026-10-27/`. If you unpack again from the desk's tgz files, check both md5s (r2:3, :53). Before making any line, run `df -h ~` and stop if under 40 GB is free (DESK DEFAULT; r3 built 70,771 `.lstmf`, size not reported).

### 10. Section 3: drop arm B tonight

Evidence: r4:28 (no teacher scans exist; TrOCR's folder holds build-song crops only). Condition (a) allows "a download Dann approves". In an overnight run, that is a stop with no one to answer it.

Replace section 3 with:

> ## 3. Arm B: not tonight
> No pre-1918 teacher scans exist on the Mac (`~/Downloads/_desk-teacher-scans/` empty, 2026-10-28), and finding them is a choice of sources for Dann, not a step for the night. Do not search for or download any. Row 158's step 2 measures TrOCR as a teacher after Sunday; arm B waits for it.

### 11. Section 2 item 2: the contact sheet stays outside the tree

Evidence: r4:20 puts 20 real photocopy rows in the measure folder. Dann's ship paste ran `git add` of row 105's files (`STATE.md:98`), so images of the scans would enter an open-source repository.

Replace "as a PNG in the measure folder" with:

> as a PNG in `~/Downloads/_desk-row105/r4/`, outside the tree, with its path and md5 in the report

### 12. Section 1: 2,029 is outside r2's spread

Evidence: r3 report:12-14. The spread runs from 2,045 to 2,086, and 2,029 is 57 below 2,086, against a spread of 41. (b) 1,793 is inside (1,763 to 1,831).

Replace "Both are inside r2's own checkpoint spread (2,045 and 2,049 at 28,000 and 30,000)." with:

> Read right is 16 below the bottom of r2's checkpoint spread (2,045 and 2,049 at 28,000 and 30,000). Seating (b) is inside it (1,763 and 1,772). r2's own next chunk, 30,000, read 2,049, so against like-for-like r3's first chunk cost 20.

### 13. Section 5: the hand-off to the app, written into the report

Evidence: on `Shane` `1ee2c0aa`, no script copies the underlay model (`apps/web/scripts/` holds only `copy-metre-model.mjs`, `copy-pdfjs-wasm.mjs`, `copy-ort-wasm.mjs`, and `copy-heif-wasm.mjs`). Stage 2b's lane copies `apps/web/omr-underlay/` and names r2's md5 and 7,827,478 bytes (`report-desk-n135-stage2b-real-page_r1_2026-10-28.md:27`). The app frames with `frameRow`, not `clean.py` (`apps/web/src/lib/omr/underlay-frame.ts:1-60`). Through the app's path, r2 reads 1,880 on A2's captures (`report-desk-n135-stage2b-r5-replay_r1_2026-10-29.md:22`). A kept reading is reused until `UNDERLAY_READER` changes (`stamp.ts:36`).

Append to section 5:

> **What stands between a winning arm and the app**, as a list in the report, none of it done tonight:
> 1. The winning file's float form, with its bytes, gzipped bytes, and md5, for Dann (`CONTRACT.md` §8).
> 2. A read of the 18 songs through the app's frame (the desk's replay on A2's captures, `~/Downloads/_desk-2026-10-29/replay-scripts_2026-10-29.tgz`) against r2's 1,880 / 1,710. A gain in `clean.py`'s harness that does not hold through `frameRow` does not ship.
> 3. The file placed in `apps/web/omr-underlay/` on stage 2b's branch, in place of r2's.
> 4. `UNDERLAY_READER` raised one version, so readings kept with r2 are read again.
>
> If items 1 and 2 hold, the desk writes the ship brief. The report's last section names any of the four that the run could not check.

