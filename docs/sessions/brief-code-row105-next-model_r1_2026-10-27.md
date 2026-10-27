# Brief: row 105, the next underlay model, trained on the Mac for the page as Ilya frames it (r1)

Desk (Opus 5.5), 2026-10-27. For Code on Dann's Mac, Sonnet. Measures and trains; nothing enters `apps`, `packages`, `third_party`, or `static`. Not yet Fable-reviewed: it waits for Fable's weekly reset (Sunday 2026-11-01 04:00) and its amendments are applied before Dann pastes it (`docs/memory/CONTRACT.md` §1 item 19). Ruled in by Dann 2026-10-27 14:27: *"Yes, train a new model on the Mac if it will help. this uses no Claude tokens so I am highly in favour of this tactic if the training is well-conceived and well-executed."* (transcribed as written; `docs/memory/INBOX.md:449`).

## 1. Why, in counts

On the 18 build songs, the float form of `rus_prereform_r2` (29,000 iterations; `docs/sessions/report-code-row82-retrain_r1_2026-10-15.md`, section 3) reads 2,086 of 2,538 printed syllables right on rows framed as Ilya will frame them (deskew, closing, ink scaled to 32 px, paper-tone padding; `docs/sessions/report-desk-row117-image-cleaning_r1_2026-10-27.md:438-443`), and the hybrid seating then puts 1,831 of 2,385 syllables letter for letter under the right note (`docs/sessions/report-desk-n135-frame-plus-c2_r1_2026-10-27.md`). The goal is 9 of 10, 2,147. Of the 452 syllables still lost after the frame, 190 are lost to letter recognition and 232 to token splitting (row 117 report, `:428` and `:450`); this row is aimed at the 190, and at the token splitting a model trained on hyphenated underlay rows may also reduce (measured, not assumed, in section 4). That model was trained only on plain lines of rendered type (`report-code-prereform-model_r1_2026-10-12.md`), never on an underlay row, never on photocopy damage, and with no word list (`:140`, "No wordlist was given").

Row 117 found what the photocopies look like to the reader: two-level pixels (only 0 and 255), broken strokes that closing 3 by 3 repairs, rows tilted up to 2.4 degrees; contrast is not the problem (Sauvola changed nothing). So the training lever is the photocopy's look and the frame, not contrast.

## 2. What to train

Continue from the 29,000 float checkpoint, `~/Downloads/_desk-prereform/models/rus_prereform_r2/` (the float file md5 `2ff2af3e33461cd64e7d2015ef21d10d`), with the driver `docs/sessions/measure-row82-retrain_2026-10-15/train2.py` copied into this brief's measure folder and edited there (name the edits). New model name `rus_prereform_r3`. Nothing of r2 is overwritten.

**Training lines, three kinds, each counted in the report:**

1. **Rendered underlay rows.** Text: lines built from Ilya's own dictionary words, each word cut into syllables by Ilya's engine (`GraysonEngine.syllabify`, `packages/phonology/src/engine.ts:1030`) and set as an underlay is set: syllables of one word joined by a hyphen with space around it, words spaced as under notes, two to twelve words a line, capitals at the start of about one line in four, the punctuation the build songs' truth files show and in their proportions. Include pre-reform spellings (ѣ, і, ѳ, ѵ, final ъ, -аго) in the share the row 82 training corpus used (its report names the corpus). **No line may be taken from the text of any song in the build set (S, T, K, M, U1 to U6, P, B01 to B10) or row 114's set (the 1967 Mussorgsky collection, songs 1 to 10)**; check every line against those songs' truth text and drop any line holding a run of three or more of their words in order, and report the count dropped. Why: the measure in section 4 is on the build songs, and row 114 is the sealed target; text learned from them would make both measures lie (DESK DEFAULT).
   Fonts: the serif and text faces row 82 used, plus any engraving lyric face on the Mac that holds Cyrillic; list each with its count of lines.
2. **The same lines, damaged as the photocopies are damaged.** Two-level threshold; broken strokes (random erosion), filled counters (random dilation), speckle, toner fade along the row, rotation within plus or minus 2.5 degrees, a row of staff-line or stem ink entering from above or below in a share of lines. Then each damaged row is passed through Ilya's own frame as it stands on `cloud-lane-16` (`apps/web/src/lib/omr/underlay-frame.ts`, `frameRow`, with step 4's closing kernel; run it under `npx --yes tsx`, or port it in Python and prove the port on 20 rows against the TypeScript), so the model trains on exactly what it will read. Report the parameter ranges as numbers.
3. **Unchanged:** row 82's original training lines, so the plain type it reads well today is kept; say the mix.

Mix DESK DEFAULT: one third each; report it, and if the held-out error on plain type (row 82's 722 lines) rises by more than a quarter, stop and report.

**The word list.** Compile Ilya's dictionary words, with their pre-reform forms, into the model with `wordlist2dawg` and `combine_tessdata`, following the Tesseract training documentation for the version installed (cite the page or the man page you read). Measure the model with and without the list (section 4), and report the file size of each. The size reaches Dann before any model ships (`CONTRACT.md` §8, last bullet).

**Iterations:** in 1,000-iteration chunks from 29,000; stop when the held-out error has not improved for 5,000, or at 8 hours, whichever comes first; choose by the error on the held-out rendered underlay rows (section 3), not by any song.

## 3. Held-out sets

- 722 plain lines (row 82's set), as before.
- New: 1,000 rendered underlay rows of kinds 1 and 2, built from words none of whose lines enter training, kept apart before training starts.
- No song is read to choose a checkpoint. Read `~/Downloads/_desk-heldout-exclusions_2026-10-12.md` first and open nothing it lists.

## 4. The measure

On the 18 build songs, through the recovered harness the desk staged (`~/Downloads/_desk-2026-10-27/desk-measure-scripts_2026-10-27.tgz`, md5 `7490b94056c839a53b0dda7ae33ddc73`; unpack it into this brief's measure folder; `clean.py` for the frame, `read-dfloat-chrome.mjs` for the reader in Chromium, `score117.py` for read right, `step1c.py` with `lever2.py` for seating):

- Read right of 2,538 on the framed crops, against r2's 2,086 (the expectation, written before the run, is above 2,086 by more than the noise floor of about 20; the likeliest failure is a gain on the photocopies with a loss on the clean songs, so report the two groups apart).
- C2 seating, (b), (a), (c), against 1,831 / 2,032 / 1,166.
- Both with the word list and without.
- Per song, and the photocopies (B01 to B10 less B05) apart from the other nine.
- The model loads in headless Chromium through the real `createWorker` with `corePath` naming `tesseract-core-simd-lstm.wasm.js`, and its text on three rows equals Node's.

## 5. Stops

- Step 0: `ps` for `lstmtraining`, `python`, `torch`, `tesseract`, and anything on `localhost:5173`; if training is running, stop and report.
- No held-out song is opened; row 114's PDFs and photographs are never opened.
- No git command that writes. `git --no-optional-locks status --short -- apps packages third_party static` is empty at the end.

## 6. Report

`docs/sessions/report-code-row105-next-model_r1_<date>.md`, measure folder `docs/sessions/measure-row105-next-model_<date>/`. Answer first: read right and (b) seated against 2,086 and 1,831, with and without the word list. Then each step with its output file; the training curve; the bytes and md5 of every model form. Outside the tree, in `~/Downloads/_desk-prereform/`: the checkpoints and working folders.

## 7. What you could not establish

A section of its own. NOT ESTABLISHED beats a complete invented answer.

Known at briefing:
- Whether a word list compiled into the model helps a reader that sees one syllable at a time between hyphens; it may hurt on split words. That is why section 4 measures both.
- Which engraving lyric faces on the Mac hold Cyrillic.
- Whether the frame's TypeScript runs under `tsx` on the Mac without the web app's build.
