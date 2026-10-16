# Brief: row 82, the pre-reform model trained again, then measured in N.135's harness (r1)

Desk (Opus 5.5, reviewed by Fable 5.1 at 16:10 with two amendments applied: step 0 and the harness-edit rule in step 5), 2026-10-15 about 16:15. For Code on Dann's Mac, Sonnet. Measures only; nothing enters the tree except this brief's report and its measure folder in `docs/sessions/`. Under `docs/memory/CONTRACT.md` §1 item 19, a brief that keeps nothing may start while Fable's review runs; the review goes over the report.

Read whole before starting: `docs/sessions/report-code-prereform-model_r1_2026-10-12.md` (row 82's first model) and `docs/sessions/report-code-n135-underlay-harness_r1_2026-10-15.md` (N.135 stage 1).

## Why

N.135 needs a reader that loads in Chrome and seats 9 of 10 underlay syllables per song. The first `rus_prereform` model's integer form, the only form that loads on Ilya's core, reads held-out type at 15.06 percent character error against 1.67 for its float form (row 82 report, section 6). Row 82's report names the change: train past 10,000 iterations.

## Steps

0. **Check what is running.** `ps` for `lstmtraining`, `python`, `torch`, `tesseract`, and anything on `localhost:5173`. If a training process is running, stop and report it; start nothing.
1. **Continue training** the existing model in `~/Downloads/_desk-prereform/` from its 10,000-iteration checkpoint (`models/rus_prereform/`) to 30,000 iterations, same data, same learning rate (0.0005), same driver (`train.py` in `docs/sessions/measure-prereform-model_2026-10-12/`), in 1,000-iteration chunks. Write every new checkpoint beside the old ones under new names; do not overwrite the 10,000 checkpoint or the two shipped forms in `songs/models/`.
2. **Score every checkpoint** on the 722-line held-out set with `evalckpt.sh` (BCER, BWER), and choose the lowest BCER. No song is read to choose.
3. **Convert the chosen checkpoint to integers** with the `lstmtraining --stop_training --convert_to_int` line in row 82's report, section 5b. Write both forms to a new folder `songs/models-r2/{float,int}/`.
4. **Measure the integer and float forms** as row 82's report did: the held-out CER table (section 6, last table) and the S, T, K, M syllable table, with row 82's scripts unchanged except the model path.
5. **Measure the integer form as reader (d) in N.135's harness**, the R2 rows and the split tokens, on every song stage 1 ran (U1, U4, U5, U6, P, B01 to B04, B06 to B10, S, T, K, M), with the seating rule that won for Tesseract (rule 2). Print the table of stage 1's section 1 with (d) beside (a) and (c): syllables right per group, syllables seated right per song, and the pages passing section 5's threshold. Whether the harness scripts take a reader (d) without an edit is NOT ESTABLISHED by the desk; if an edit is needed, make it in a copy of the script inside this brief's measure folder and name the edit in the report. The stage 1 folder stays as it is.
6. **Load the integer form in headless Chrome** through the real `createWorker` on the default core, as stage 1 did for (a) in `chrome-load.json`, and read the same three rows. Say whether it loads and whether the text equals Node's.

## Stops

- No held-out song is opened. Read `~/Downloads/_desk-heldout-exclusions_2026-10-12.md` first, as stage 1 did.
- If the held-out error stops falling for 5,000 iterations running, stop training there and say so.
- If row 82's ceiling of 8 hours is reached, stop and report what exists.
- No git command that writes. Nothing in `apps`, `packages`, `third_party`, or `static`: `git --no-optional-locks status --short -- apps packages third_party static` is empty at the end.

## Report

`docs/sessions/report-code-row82-retrain_r1_2026-10-15.md`, measure folder `docs/sessions/measure-row82-retrain_2026-10-15/`. Answer first: the integer form's held-out CER against 12.27 percent ((c), mapped lines), and (d)'s seated share per song against stage 1's best. Then each step with its output file. Then the bytes and md5 of both forms.

## What you could not establish

A section of its own. NOT ESTABLISHED beats a complete invented answer.
