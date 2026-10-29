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
