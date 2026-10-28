# Brief: row 105, the next underlay model, trained on the Mac for the page as Ilya frames it (r2)

Desk (Opus 5.5), 2026-10-27. For Code on Dann's Mac, Sonnet. Measures and trains; nothing enters `apps`, `packages`, `third_party`, or `static`. r2 applies all thirteen amendments of an adversarial Opus review standing in for Fable (`docs/sessions/review-opus-brief-row105_r1_2026-10-27.md`, SEND WITH AMENDMENTS), verbatim. Training keeps nothing in the tree, so under `docs/memory/CONTRACT.md` §1 item 19 it runs before Fable's review, and Fable reviews this report after its weekly reset (Sunday 2026-11-01 04:00), before any model ships. The desk's second archive for step 0b: `~/Downloads/_desk-2026-10-27/desk-measure-scripts-2_2026-10-27.tgz` (md5 `aaeba2e9244d8545128d3e892f035556`: `n135-combined/map_boxes.py`, `check_map.py`, `crop-geometry.json`, `work_framed/harness/common2.py`, and `wordlists/`). Ruled in by Dann 2026-10-27 14:27: *"Yes, train a new model on the Mac if it will help. this uses no Claude tokens so I am highly in favour of this tactic if the training is well-conceived and well-executed."* (transcribed as written; `docs/memory/INBOX.md:449`).

## 1. Why, in counts

On the 18 build songs, the float form of `rus_prereform_r2` (29,000 iterations; `docs/sessions/report-code-row82-retrain_r1_2026-10-15.md`, section 3) reads 2,086 of 2,538 printed syllables right on rows framed as Ilya will frame them (deskew, closing, ink scaled to 32 px, paper-tone padding; `docs/sessions/report-desk-row117-image-cleaning_r1_2026-10-27.md:438-443`), and the hybrid seating then puts 1,831 of 2,385 syllables letter for letter under the right note (`docs/sessions/report-desk-n135-frame-plus-c2_r1_2026-10-27.md`). The goal is 9 of 10, 2,147. Of the 452 syllables still lost after the frame, 190 are lost to letter recognition and 232 to token splitting (row 117 report, `:428` and `:450`); this row is aimed at the 190. That model was trained on 23,591 rendered lines, half of them set as underlay: syllables joined by « - », wide gaps (`report-code-prereform-model_r1_2026-10-12.md:131`). Its damage was light: 2 by 2 erosion or dilation, blur, JPEG, tilt up to 0.5 degrees, grey paper from 190 to 252, and barline stubs (`:132`). It never saw two-level ink, skew past 0.5 degrees, ink cut at the frame's edge, or the frame, and it carries no word list (`:140`). So this row's levers are kind 2 and the word list. Kind 1 renews the underlay share in the frame.

Row 117 found what the photocopies look like to the reader: two-level pixels (only 0 and 255), broken strokes that closing 3 by 3 repairs, rows tilted up to 2.4 degrees; contrast is not the problem (Sauvola changed nothing). So the training lever is the photocopy's look and the frame, not contrast.

## 2. What to train

Continue from the 29,000 float model. No checkpoint of 29,000 exists (`report-code-row82-retrain_r1_2026-10-15.md:54`); the file is `~/Downloads/_desk-prereform/models/rus_prereform_r2/rus_prereform_r2_29000.traineddata`. Check its md5 against `2ff2af3e33461cd64e7d2015ef21d10d` and stop if it differs. Copy it to `~/Downloads/_desk-prereform/models/rus_prereform_r3/start/`, extract its recognizer there (`combine_tessdata -e <copy> <copy-dir>/r2_29000.lstm`), and give that `.lstm` to `--continue_from` in the first chunk. Never pass `rus_prereform_r2_checkpoint` (that is the 30,000 state). Extract r2's unicharset (`combine_tessdata -u`), list every character of the new training text that it lacks, and report the list. If the list is empty, the proto keeps r2's unicharset. If it is not, build a new proto and add `--old_traineddata <the copy>`, citing the line of `lstmtraining --help` (5.5.3) or of the Tesseract documentation you read that says so. lstmtraining restarts its counter at 0 on this load (row 82, `:33`), so `--max_iterations` is `n - 29000` and n in every table is the total. Copy `docs/sessions/measure-row82-retrain_2026-10-15/train2.py` into this brief's measure folder and name each edit in its header. New model name `rus_prereform_r3`, in its own `tesstrain/data/rus_prereform_r3/` and `models/rus_prereform_r3/`. Before the first chunk, record the md5 of every file in `models/rus_prereform_r2/` and `songs/models-r2/`. At the end, check those md5 again and report that they are unchanged.

**Training lines, three kinds, each counted in the report:**

1. **Rendered underlay rows.** Text: lines built from Ilya's own dictionary words, each word cut into syllables by Ilya's engine (`GraysonEngine.syllabify`, `packages/phonology/src/engine.ts:1030`) and set as an underlay is set: syllables of one word joined by a hyphen with space around it, words spaced as under notes, two to twelve words a line, capitals at the start of about one line in four, the punctuation the build songs' truth files show and in their proportions. Pre-reform words come only from real pre-reform text: the words of row 82's Wikisource lines (`report-code-prereform-model_r1_2026-10-12.md:62-101`; the pool is in `~/Downloads/_desk-prereform/data/`), never made by rule from a modern form. Keep them in the share that corpus has, and report the share. `GraysonEngine.syllabify` has no pre-reform vowels (`engine.ts:237`; it gives `вѣра` as one syllable). So cut a pre-reform word by modernising it with `modernisePreReform`, cutting the modern form, and mapping the cut positions back letter for letter. Where the lengths differ (a dropped final ъ), the ъ joins the last syllable. Check the result on 30 words and list them in the report. `syllabify` lowercases and strips punctuation (`engine.ts:1031`): restore the capital and the punctuation after cutting. No training or held-out line of any kind may hold a run of three or more words, in order, from the truth text of the build songs or of row 114's set. That applies to kind 3, row 82's own lines, too: they were checked against S, T, K, and M and the private list only (`report-code-prereform-model_r1_2026-10-12.md:82-94`). The truth text is in the staged harness: `harness/align/<L>.json`, field `truth[].syl`, with the syllables joined into words (`common2.py:36-60`), and `poem-r81.txt` for S, T, K, and M. Row 114's truth text is in `~/Downloads/_colleague-pages/run-2026-10-19/truth-song/song*.truth.json` (`QUEUE.md:81`). Open only those JSON files there, never a PDF or photograph, and only by script for this comparison; run no reader on any of them. One of row 114's songs is also listed in the exclusions file (its set 3 section); its truth text is compared here and nothing else is done with it. Compare after `modernisePreReform` and case folding. Report three counts:
- the lines dropped from each kind;
- the lines of row 82's original set that would have been dropped. r2 trained on these, so this count says how far r2's own 2,086 already rests on song text.
- the build songs and row 114 songs those lines came from.

Why: section 4's measure is on the build songs, and row 114 is the sealed target (DESK DEFAULT).

   Fonts: the serif and text faces row 82 used, plus any engraving lyric face on the Mac that holds Cyrillic; list each with its count of lines.
2. **The same lines, damaged as the photocopies are damaged.** Two-level threshold; broken strokes (random erosion), filled counters (random dilation), speckle, toner fade along the row, rotation within plus or minus 3.0 degrees, a row of staff-line or stem ink entering from above or below in a share of lines. Then every training line of all three kinds, and every held-out row, is framed by `clean.py` from the staged harness with the steps `deskew,close:3,height:32,padpaper:16:16`, the configuration that read 2,086 (`report-desk-row117-image-cleaning_r1_2026-10-27.md:463`). Edit only its paths: the crop folder, `ROOT`, and an angles cache of its own for the synthetic rows. Name those edits. The build songs are framed by the same script. Do not train or measure through `underlay-frame.ts`: it differs from `clean.py` on 0.4 to 4.5 percent of pixels (review of this brief, amendment 2), it is not on `Shane`, and step 4 is changing it. Whether a model trained on `clean.py`'s frame reads `frameRow`'s frame as well is NOT ESTABLISHED, and that check belongs to step 4's row. Report the parameter ranges as numbers.
   Before damage, scale each rendered row so its ink height (`clean.py`'s `ink_rows_extent`, 2 to 98 percent) is drawn from the build crops' distribution (`results/inkheights.txt`: median 48, photocopies 23 to 51 for single rows). State every damage size as a share of that ink height or of the stroke width, never in pixels, and report the ranges both ways. Rotation is uniform within ±3.0 degrees. In 9 rows of 10, cut the row through its own ascenders and descenders, or through intruding staff and stem ink, at the top and bottom edges, as the real crops are cut. Two-level output applies to kind 2 only; the clean songs carry grey (`report-desk-row117-image-cleaning_r1_2026-10-27.md:115`).
3. **Unchanged:** row 82's original training lines, so the plain type it reads well today is kept; say the mix.

Mix DESK DEFAULT: one third each; report it. Score each chunk with `lstmeval` on row 82's 722 lines (`evalckpt2.sh`'s command), BCER. Stop the run only if the plain-type BCER is above 0.42, the worst of r2's last five chunks (`report-code-row82-retrain_r1_2026-10-15.md:47`), on three chunks in a row. No checkpoint whose plain-type BCER is above 0.42 may be chosen.

Lines: 23,591 of kind 3 (row 82's, less the drops of amendment 6), and as many each of kinds 1 and 2, built from new text. Before building them all, build, damage, and frame 200 lines. Time each stage, write the projected total for each kind to the report, and stop if the projection exceeds 3 hours for line making. The 8-hour ceiling covers making, training, and the measure together.

**The word list.** Build the word dawg AND a punctuation dawg against the chosen model's own LSTM unicharset (extract it with `combine_tessdata -u`). Use `combine_lang_model` or `wordlist2dawg` with `combine_tessdata -o`, following the documentation for Tesseract 5.5.3 (cite the page or `--help` line you read). Choose the checkpoint first, with no word list. Then make two files from it: one without dawgs, and one with them. Read both through the same harness. Report each file's bytes, gzipped bytes, and md5, and the number of words in the list. Measure the model with and without the list (section 4), and report the file size of each. The size reaches Dann before any model ships (`CONTRACT.md` §8, last bullet).

**Iterations:** in 1,000-iteration chunks from 29,000; stop when the held-out error has not improved for 5,000, or at 8 hours, whichever comes first; choose by the error on the held-out rendered underlay rows (section 3), not by any song.

## 3. Held-out sets

- 722 plain lines (row 82's set), as before.
- New: 1,000 rendered underlay rows of kinds 1 and 2, built from words none of whose lines enter training, kept apart before training starts.
- No song is read to choose a checkpoint. Read `~/Downloads/_desk-heldout-exclusions_2026-10-12.md` first and open nothing it lists.

## 4. The measure

**Step 0b, positive control, before any training line is made.**
- Unpack the tgz into the measure folder. Also unpack the desk's second archive: `n135-combined/map_boxes.py`, `work_framed/harness/common2.py`, and `wordlists/` (the desk stages it with its md5 before this brief is pasted).
- Point every hard-coded path at the Mac's copies: the tree, `~/Downloads/_desk-n135/crops2`, the installed Chrome, and `tsx`. Name each edit.
- Check that the 589 crops in `~/Downloads/_desk-n135/crops2` match the desk's crop list by md5, and stop if any differs.
- Frame the 18 songs with `clean.py` (`deskew,close:3,height:32,padpaper:16:16`). Read them with r2's 29,000 float form through `read-dfloat-chrome.mjs`. Score with `score117.py`. Map the boxes with `map_boxes.py` and seat with `step1c.py`.
- The expectation is 2,086 of 2,538 read right, and C2 1,831 / 2,032 / 1,166 on 2,385 seated notes over 16 songs (K and M are not in the seating set). The reader is deterministic: row 117 re-read 18 songs byte for byte (`report-desk-row117-image-cleaning_r1_2026-10-27.md:61`).
- If any number differs, stop and report. Train nothing.

On the 18 build songs, through the recovered harness the desk staged (`~/Downloads/_desk-2026-10-27/desk-measure-scripts_2026-10-27.tgz`, md5 `7490b94056c839a53b0dda7ae33ddc73`; unpack it into this brief's measure folder; `clean.py` for the frame, `read-dfloat-chrome.mjs` for the reader in Chromium, `score117.py` for read right, `step1c.py` with `lever2.py` for seating):

- Read right of 2,538 on the framed crops, against r2's 2,086. The expectation, written before the run: read right rises above 2,086 by more than the larger of the two noise floors in amendment 11. The gain comes on the nine photocopies, and token splitting falls by less than letter recognition, because r2 already saw underlay rows. Likeliest failure: a gain on the photocopies with a loss on the clean nine, so report the two groups apart.
- C2 seating, (b), (a), (c), against 1,831 / 2,032 / 1,166.
- Both with the word list and without.
- Per song, and the photocopies (B01 to B10 less B05) apart from the other nine.
- The model loads in headless Chromium through the real `createWorker` with `corePath` naming `tesseract-core-simd-lstm.wasm.js`, and its text on three rows equals Node's.

Model noise floor: read the 18 framed songs with r2's 28,000 and 30,000 float forms as well (`models/rus_prereform_r2/rus_prereform_r2_{28000,30000}.traineddata`). Their spread from 2,086 is r2's checkpoint noise. Read r3's chosen checkpoint and its two neighbours, and report all five. Call a gain real only if it exceeds both this spread and the pixel floor of about 20.

Serve each form under the file name `rus_prereform.traineddata` from a folder of its own (the reader requests that name, `read-dfloat-chrome.mjs:30`). Record the folder and md5 beside each reading.

## 5. Stops

- Step 0: `ps` for `lstmtraining`, `python`, `torch`, `tesseract`, and anything on `localhost:5173`; if training is running, stop and report.
- No held-out song is opened; row 114's PDFs and photographs are never opened.
- No git command that writes. `git --no-optional-locks status --short -- apps packages third_party static` is empty at the end.

## 6. Report

`docs/sessions/report-code-row105-next-model_r1_<date>.md`, measure folder `docs/sessions/measure-row105-next-model_<date>/`. Answer first: read right and (b) seated against 2,086 and 1,831, with and without the word list. Then each step with its output file; the training curve; the bytes and md5 of every model form. Outside the tree, in `~/Downloads/_desk-prereform/`: the checkpoints and working folders.

Say which form a singer would download, its bytes and gzipped bytes with and without the word list, and that nothing ships until Dann has the byte count (`CONTRACT.md` §8, last bullet). Do not convert or measure an integer form unless the float form gains.

## 7. What you could not establish

A section of its own. NOT ESTABLISHED beats a complete invented answer.

Known at briefing:
- Whether a word list compiled into the model helps a reader that sees one syllable at a time between hyphens; it may hurt on split words. That is why section 4 measures both.
- Which engraving lyric faces on the Mac hold Cyrillic.
