SEND WITH AMENDMENTS

# Review of `brief-code-row105-next-model_r1_2026-10-27.md` (r1)

Opus 5.5, adversarial review standing in for Fable, 2026-10-27. Every file named below was read this session. Probes ran in my scratchpad only; no file of the tree or the measures was written, and no git command that writes was run. Brief line numbers are from `/root/lanes/briefs/brief-code-row105-next-model_r1_2026-10-27.md`.

Ranked by how badly the night goes without each. Amendments 1 to 4 each, alone, make the night's numbers wrong or the run fail; 5 to 9 make them weaker than claimed; 10 to 13 are smaller.

## Amendments for r2

### 1. Section 2, first paragraph: there is no 29,000 checkpoint, and the only checkpoint there is 30,000

Why: row 82 says so: "the driver keeps only the latest checkpoint (30,000) and the checkpoints that improved the *training* error, so no checkpoint of exactly 29,000 exists" (`report-code-row82-retrain_r1_2026-10-15.md:54`). What sits in `models/rus_prereform_r2/` are `stop_training` outputs, one float `.traineddata` per chunk (`measure-row82-retrain_2026-10-15/train2.py:20-21`), not checkpoints. `train2.py:10,15` starts from a `.checkpoint` file; a Code session that edits only the name will continue from `rus_prereform_r2_checkpoint`, which is the 30,000 state (BCER 0.296, `report-code-row82-retrain_r1_2026-10-15.md:47`). The counter also restarts at 0 on a continued load (`:33`). Tesseract's page says `--continue_from` "can point to a training checkpoint or a recognition model", the latter only "provided it has not been converted to integer", and that when the unicharset changes "the `--old_traineddata` flag must be provided" (tessdoc `tess4/TrainingTesseract-4.00.md`, read this session through WebFetch; that page is marked deprecated for Tesseract 5, and the Mac has 5.5.3, `report-code-prereform-model_r1_2026-10-12.md:29-30`).

Replace "Continue from the 29,000 float checkpoint, ... Nothing of r2 is overwritten." with:

> Continue from the 29,000 float model. No checkpoint of 29,000 exists (`report-code-row82-retrain_r1_2026-10-15.md:54`); the file is `~/Downloads/_desk-prereform/models/rus_prereform_r2/rus_prereform_r2_29000.traineddata`. Check its md5 against `2ff2af3e33461cd64e7d2015ef21d10d` and stop if it differs. Copy it to `~/Downloads/_desk-prereform/models/rus_prereform_r3/start/`, extract its recognizer there (`combine_tessdata -e <copy> <copy-dir>/r2_29000.lstm`), and give that `.lstm` to `--continue_from` in the first chunk. Never pass `rus_prereform_r2_checkpoint` (that is the 30,000 state). Extract r2's unicharset (`combine_tessdata -u`), list every character of the new training text that it lacks, and report the list. If the list is empty, the proto keeps r2's unicharset. If it is not, build a new proto and add `--old_traineddata <the copy>`, citing the line of `lstmtraining --help` (5.5.3) or of the Tesseract documentation you read that says so. lstmtraining restarts its counter at 0 on this load (row 82, `:33`), so `--max_iterations` is `n - 29000` and n in every table is the total. Copy `docs/sessions/measure-row82-retrain_2026-10-15/train2.py` into this brief's measure folder and name each edit in its header. New model name `rus_prereform_r3`, in its own `tesstrain/data/rus_prereform_r3/` and `models/rus_prereform_r3/`. Before the first chunk, record the md5 of every file in `models/rus_prereform_r2/` and `songs/models-r2/`. At the end, check those md5 again and report that they are unchanged.

### 2. Section 2 kind 2, and section 4: train and measure through ONE frame, and pin it

Why, four facts:

1. **The two frames differ.** The 2,086 and the 1,831 were measured through `clean.py` with the steps `deskew,close:3,height:32,padpaper:16:16` (`report-desk-row117-image-cleaning_r1_2026-10-27.md:463`; `n135-combined/report-desk-n135-frame-plus-c2_r1_2026-10-27.md:52`). The brief trains through the TypeScript `frameRow`. I ran both on six crops of `/root/n135work/crops2/`. With the same angle, the outputs differed in 0.4 to 4.5 percent of pixels, by up to 255 grey levels:

   | Crop | Angle | Pixels that differ |
   |---|---|---|
   | B10-1-s2-r1 | 2.2 | 4.49 percent |
   | B07-5-s1-r1 | -1.4 | 2.53 percent |
   | B01-2-s2-r1 | 0.0 | 1.54 percent |

   On M-1-s1-r1, a grey-paper crop, the size differed: 77 by 2,915 against 78 by 2,995. That follows from `frameRow` filling the rotation border with the paper tone (`underlay-frame.ts:344-347`), where `clean.py` fills it with white (`clean.py:39`). So `frameRow` is not the frame that read 2,086, whatever its header says (`underlay-frame.ts:5-8`).
2. **The file is not on the Mac's tree.** `underlay-frame.ts` is on `cloud-lane-16` only: it is absent from trunk `Shane` at `7238b77` (`ls` this session). The brief forbids any git command that writes, and `CONTRACT.md` §4 leaves fetch to Dann.
3. **The target moves tonight.** Step 4 is changing the closing kernel while the brief says "as it stands", so what Code trains through depends on when it reads the file.
4. **It is slow.** `frameRow` took 1.8 s per full-width 4,400 by 90 crop here, single-threaded. At one third of about 70,000 lines, that is hours, and the brief states no cost for it.

Replace kind 2's sentence beginning "Then each damaged row is passed through Ilya's own frame..." with:

> Then every training line of all three kinds, and every held-out row, is framed by `clean.py` from the staged harness with the steps `deskew,close:3,height:32,padpaper:16:16`, the configuration that read 2,086 (`report-desk-row117-image-cleaning_r1_2026-10-27.md:463`). Edit only its paths: the crop folder, `ROOT`, and an angles cache of its own for the synthetic rows. Name those edits. The build songs are framed by the same script. Do not train or measure through `underlay-frame.ts`: it differs from `clean.py` on 0.4 to 4.5 percent of pixels (review of this brief, amendment 2), it is not on `Shane`, and step 4 is changing it. Whether a model trained on `clean.py`'s frame reads `frameRow`'s frame as well is NOT ESTABLISHED, and that check belongs to step 4's row.

Also delete the third "Known at briefing" bullet (brief:61): the desk ran it, and `frameRow` does run standalone under `tsx` with no web build (this review's probe, Node 22, Linux).

### 3. Section 4: the harness the brief names cannot produce 1,831, and nothing checks that it reproduces 2,086 first

Why: the staged tgz (md5 `7490b94056c839a53b0dda7ae33ddc73`, confirmed this session) holds only `n135-row117/`, `n135-lever2/`, and `n135-witness/` (`tar tzvf`). It lacks three things C2 seating on framed crops needs:

- **`map_boxes.py`.** The framed boxes are in framed pixels and must be mapped back (`report-desk-n135-frame-plus-c2_r1_2026-10-27.md:49-57`). The script is in `/root/measures/n135-combined/` and is not in the tgz.
- **The word list.** `wordlists/ru.txt` is read by `neighbours.py:6` through `common2.py:103`.
- **The priming patch.** The lever 2 copy of `common2.py` raises `KeyError` on any token not in its cache. The patch is at `n135-combined/work_framed/harness/common2.py:80-82` and is not in the tgz copy (diffed this session). A new model reads new tokens, so it will raise.

Every script also hard-codes Linux paths: `/home/claude/ilya`, `/root/n135work`, `/opt/pw-browsers/chromium-1243/...`, and `/home/claude/.npm-global/bin/tsx` (`read-dfloat-chrome.mjs:6,24`; `clean.py:20`; `lever2.py:8,12,49`; `common2.py:5`). Seating covers 16 songs, since K and M are not in lever 2's set (`report-desk-n135-frame-plus-c2_r1_2026-10-27.md:21`).

Add a new first bullet to section 4, and a stop:

> **Step 0b, positive control, before any training line is made.**
> - Unpack the tgz into the measure folder. Also unpack the desk's second archive: `n135-combined/map_boxes.py`, `work_framed/harness/common2.py`, and `wordlists/` (the desk stages it with its md5 before this brief is pasted).
> - Point every hard-coded path at the Mac's copies: the tree, `~/Downloads/_desk-n135/crops2`, the installed Chrome, and `tsx`. Name each edit.
> - Check that the 589 crops in `~/Downloads/_desk-n135/crops2` match the desk's crop list by md5, and stop if any differs.
> - Frame the 18 songs with `clean.py` (`deskew,close:3,height:32,padpaper:16:16`). Read them with r2's 29,000 float form through `read-dfloat-chrome.mjs`. Score with `score117.py`. Map the boxes with `map_boxes.py` and seat with `step1c.py`.
> - The expectation is 2,086 of 2,538 read right, and C2 1,831 / 2,032 / 1,166 on 2,385 seated notes over 16 songs (K and M are not in the seating set). The reader is deterministic: row 117 re-read 18 songs byte for byte (`report-desk-row117-image-cleaning_r1_2026-10-27.md:61`).
> - If any number differs, stop and report. Train nothing.

### 4. Section 1, last sentence of the first paragraph: the premise is false, and with it the expectation

Why: r2 WAS trained on underlay rows and on some damage. Row 82's report says: "Half the lines are set as underlay: each word cut into syllables, joined by « - », with 2 to 9 spaces between syllables in the image and one in the ground truth" (`report-code-prereform-model_r1_2026-10-12.md:131`; code at `measure-prereform-model_2026-10-12/render.py:31-44`). The same report lists the damage: 2 by 2 erosion or dilation, blur, JPEG, tilt up to 0.5 degrees, and barline stubs and slur fragments (`:132`; `render.py:58-75`). The brief copies the audit's wording (`audit-deeper-not-bigger_r1_2026-10-18.md:11`, "trained on ... plain type"), and the audit is wrong on this point. So kind 1 repeats what r2 already learned. The new levers are two-level ink, skew up to 3 degrees, ink cut at the frame's edge, and the frame. The hope that underlay training cuts token splitting has already been tried once in r2.

Replace "That model was trained only on plain lines of rendered type (...), never on an underlay row, never on photocopy damage, and with no word list (`:140`, "No wordlist was given")." with:

> That model was trained on 23,591 rendered lines, half of them set as underlay: syllables joined by « - », wide gaps (`report-code-prereform-model_r1_2026-10-12.md:131`). Its damage was light: 2 by 2 erosion or dilation, blur, JPEG, tilt up to 0.5 degrees, grey paper from 190 to 252, and barline stubs (`:132`). It never saw two-level ink, skew past 0.5 degrees, ink cut at the frame's edge, or the frame, and it carries no word list (`:140`). So this row's levers are kind 2 and the word list. Kind 1 renews the underlay share in the frame.

Also replace section 4's expectation clause with:

> The expectation, written before the run: read right rises above 2,086 by more than the larger of the two noise floors in amendment 11. The gain comes on the nine photocopies, and token splitting falls by less than letter recognition, because r2 already saw underlay rows. Likeliest failure: a gain on the photocopies with a loss on the clean nine, so report the two groups apart.

### 5. Section 2 kind 1: Ilya's syllabifier cannot cut pre-reform words, and the dictionary holds no pre-reform forms

Why:

- **No pre-reform vowels.** `GraysonEngine.vowels` is `а е ё и о у ы э ю я` (`packages/phonology/src/engine.ts:237`), with no ѣ, і, or ѵ. Probe, `tsx` on the trunk file this session: `вѣра` gives `["вѣра"]`, `бѣлый` gives `["бѣлый"]`, `мѵро` gives `["мѵро"]`, and `Россія` gives `["росс","ія"]`.
- **Case and punctuation are stripped.** `syllabify` lowercases the word and strips punctuation (`engine.ts:1031`). So the capitals and punctuation the brief asks for must be put back after the cut.
- **No pre-reform forms to compile.** "Ilya's dictionary holds modern forms only" (`packages/dictionary/src/pre-reform-normalizer.ts:21-22`). Of the dictionary's 943,106 entries, 5,454 carry ѣ, ѳ, ѵ, or і (count this session over `data/dictionary.86d83340-{a,b}.json`). No function in the tree turns a modern form into its old spelling (exports at `pre-reform-normalizer.ts:237-382`). The brief's "with their pre-reform forms" therefore has no source in the tree, and Code would invent where ѣ goes.

Replace the sentence "Include pre-reform spellings (...) in the share the row 82 training corpus used (its report names the corpus)." with:

> Pre-reform words come only from real pre-reform text: the words of row 82's Wikisource lines (`report-code-prereform-model_r1_2026-10-12.md:62-101`; the pool is in `~/Downloads/_desk-prereform/data/`), never made by rule from a modern form. Keep them in the share that corpus has, and report the share. `GraysonEngine.syllabify` has no pre-reform vowels (`engine.ts:237`; it gives `вѣра` as one syllable). So cut a pre-reform word by modernising it with `modernisePreReform`, cutting the modern form, and mapping the cut positions back letter for letter. Where the lengths differ (a dropped final ъ), the ъ joins the last syllable. Check the result on 30 words and list them in the report. `syllabify` lowercases and strips punctuation (`engine.ts:1031`): restore the capital and the punctuation after cutting.

In "The word list", replace "Compile Ilya's dictionary words, with their pre-reform forms," with:

> Compile Ilya's dictionary words (modern forms, 943,106 entries in `data/dictionary.86d83340-{a,b}.json`) together with the pre-reform word forms that occur in row 82's corpus lines after the exclusions,

### 6. Section 2 kind 1 and kind 3: the contamination check leaves out the lines that need it most

Why: kind 3 reuses row 82's lines unchanged. Those lines were excluded against S, T, K, and M and the private file's 35 titled songs only (`report-code-prereform-model_r1_2026-10-12.md:82-94`). Five listed songs could not be looked up at all (`:94`). The lines were never checked against U1 to U6, P, B01 to B10, or row 114's 1967 Mussorgsky set, which was truthed on 2026-10-18 (`docs/memory/QUEUE.md:50`), after the corpus was built. Dictionary words joined at random seldom reproduce a three-word run of a poem; Wikisource lines can, since they are poems. r2's weights have already seen those lines, so the r3 measure inherits whatever overlap exists. Only a count can say how large that is.

Replace "No line may be taken from the text of any song ... (DESK DEFAULT)." with:

> No training or held-out line of any kind may hold a run of three or more words, in order, from the truth text of the build songs or of row 114's set. That applies to kind 3, row 82's own lines, too: they were checked against S, T, K, and M and the private list only (`report-code-prereform-model_r1_2026-10-12.md:82-94`). The truth text is in the staged harness: `harness/align/<L>.json`, field `truth[].syl`, with the syllables joined into words (`common2.py:36-60`), and `poem-r81.txt` for S, T, K, and M. Row 114's truth text is in `~/Downloads/_colleague-pages/run-2026-10-19/truth-song/song*.truth.json` (`QUEUE.md:81`). Open only those JSON files there, never a PDF or photograph. Compare after `modernisePreReform` and case folding. Report three counts:
> - the lines dropped from each kind;
> - the lines of row 82's original set that would have been dropped. r2 trained on these, so this count says how far r2's own 2,086 already rests on song text.
> - the build songs and row 114 songs those lines came from.
>
> Why: section 4's measure is on the build songs, and row 114 is the sealed target (DESK DEFAULT).

DESK INFERENCE: matching row 114's truth text runs no reader on that set and so does not burn it. That is the desk's to confirm with Dann under `CONTRACT.md` §1 item 4 before r2 is pasted, if it has any doubt.

### 7. Section 2, the plain-type stop: it fires at the first noisy chunk

Why: r2's own chunks on the 722 lines ran 0.256, 0.418, 0.269, 0.186, and 0.296 from 26,000 to 30,000 (`report-code-row82-retrain_r1_2026-10-15.md:47`). That is a jump of 59 percent between adjacent chunks with no change of data. A run that changes the data rises at first, so "rises by more than a quarter" stops it in the first chunk. The brief also names no instrument: the 0.186 is `lstmeval` BCER, and the 0.83 percent is the CLI's CER (`:74`).

Replace "and if the held-out error on plain type (row 82's 722 lines) rises by more than a quarter, stop and report." with:

> Score each chunk with `lstmeval` on row 82's 722 lines (`evalckpt2.sh`'s command), BCER. Stop the run only if the plain-type BCER is above 0.42, the worst of r2's last five chunks (`report-code-row82-retrain_r1_2026-10-15.md:47`), on three chunks in a row. No checkpoint whose plain-type BCER is above 0.42 may be chosen.

### 8. Section 2, "The word list": the documentation requires a punctuation dawg, and with and without must be two files

Why: Tesseract's page says "if any of the dawgs are provided, the punctuation dawg must also be provided" and names `combine_lang_model` as the tool that builds a starter traineddata "from a `unicharset` and optional wordlists" (tessdoc page as in amendment 1, deprecated for 5.x). `wordlist2dawg` takes a unicharset (`wordlist2dawg` usage, Tesseract 5.3.4 here, not the Mac's 5.5.3). Whether `lstmeval` applies a dawg is NOT ESTABLISHED. Whether tesseract.js can switch the dictionary off after load is NOT ESTABLISHED. Two files settle the comparison either way.

Replace the paragraph's first two sentences with:

> Build the word dawg AND a punctuation dawg against the chosen model's own LSTM unicharset (extract it with `combine_tessdata -u`). Use `combine_lang_model` or `wordlist2dawg` with `combine_tessdata -o`, following the documentation for Tesseract 5.5.3 (cite the page or `--help` line you read). Choose the checkpoint first, with no word list. Then make two files from it: one without dawgs, and one with them. Read both through the same harness. Report each file's bytes, gzipped bytes, and md5, and the number of words in the list.

### 9. Section 2 kind 2: the damage is unsized, and the owner ruled proportion

Why: the brief gives "random erosion", "random dilation", "speckle", and "rotation" with no size. Dann's ruling is quoted at `underlay-frame.ts:39-43`: "PROPORTION, NEVER A PIXEL COUNT (Dann, 2026-10-27 14:27)". `clean.py`'s 3 by 3 closing works in page pixels (`clean.py:45-49`). So the synthetic rows must reach the frame at the real crops' scale, or the closing does something to them that it never does to a scan. Real crops are cut through ink: 207 of the 208 photocopy crops have ink on the top row and 207 on the bottom (`report-desk-row117-image-cleaning_r1_2026-10-27.md:346`). The brief also gives ±2.5 degrees, while real crops reach the sweep's edge at 3.0 (`:120`).

Add to kind 2:

> Before damage, scale each rendered row so its ink height (`clean.py`'s `ink_rows_extent`, 2 to 98 percent) is drawn from the build crops' distribution (`results/inkheights.txt`: median 48, photocopies 23 to 51 for single rows). State every damage size as a share of that ink height or of the stroke width, never in pixels, and report the ranges both ways. Rotation is uniform within ±3.0 degrees. In 9 rows of 10, cut the row through its own ascenders and descenders, or through intruding staff and stem ink, at the top and bottom edges, as the real crops are cut. Two-level output applies to kind 2 only; the clean songs carry grey (`report-desk-row117-image-cleaning_r1_2026-10-27.md:115`).

### 10. Section 2: cost unstated; time each stage before committing to it

Why: the brief gives no line count per kind and no time for rendering, damage, framing, `lstmf` making, or reading. Row 82 measured these figures (`report-code-prereform-model_r1_2026-10-12.md:250-258`; `report-code-row82-retrain_r1_2026-10-15.md:34`):

| Stage | Measured |
|---|---|
| Render | 6 minutes per 24,000 lines on 8 processes |
| `lstmf` files | 6 minutes per 23,591 |
| Training | about 140 s per 1,000 iterations, scoring included |

Under the 5,000-flat rule, training is the cheap part. The unknowns are framing and reading.

Add after "Mix DESK DEFAULT":

> Lines: 23,591 of kind 3 (row 82's, less the drops of amendment 6), and as many each of kinds 1 and 2, built from new text. Before building them all, build, damage, and frame 200 lines. Time each stage, write the projected total for each kind to the report, and stop if the projection exceeds 3 hours for line making. The 8-hour ceiling covers making, training, and the measure together.

### 11. Section 4: the noise floor of "about 20" is a pixel-shift floor, not a model floor

Why: the 20 comes from shifting crops by a pixel under one model (`report-desk-row117-image-cleaning_r1_2026-10-27.md:136-137`; photocopies +6 and +19, clean nine +3 and 0, `:153-154`). Two checkpoints of one run differ by more than that on held-out type (`report-code-row82-retrain_r1_2026-10-15.md:47`). r2's 28,000 and 30,000 float forms exist (`train2.py:20`).

Add to section 4:

> Model noise floor: read the 18 framed songs with r2's 28,000 and 30,000 float forms as well (`models/rus_prereform_r2/rus_prereform_r2_{28000,30000}.traineddata`). Their spread from 2,086 is r2's checkpoint noise. Read r3's chosen checkpoint and its two neighbours, and report all five. Call a gain real only if it exceeds both this spread and the pixel floor of about 20.

### 12. Section 4, last bullet: the reader takes the model by one fixed name

Why: `read-dfloat-chrome.mjs:30` asks for `['rus_prereform']`, so every form must be served as `rus_prereform.traineddata` from its own folder. The float form aborts on the relaxed-SIMD default core (`report-code-prereform-model_r1_2026-10-12.md:168`), which is why the reader names `tesseract-core-simd-lstm.wasm.js`.

Add:

> Serve each form under the file name `rus_prereform.traineddata` from a folder of its own (the reader requests that name, `read-dfloat-chrome.mjs:30`). Record the folder and md5 beside each reading.

### 13. Section 6, report: name what ships and what does not

Why: what was measured is the float form at 7,827,478 bytes. Its integer form lost 14 points of character error in r1 and r2 (`report-code-row82-retrain_r1_2026-10-15.md:74-75`). The word list adds an unmeasured size to the float form.

Add to section 6:

> Say which form a singer would download, its bytes and gzipped bytes with and without the word list, and that nothing ships until Dann has the byte count (`CONTRACT.md` §8, last bullet). Do not convert or measure an integer form unless the float form gains.

## The checklist, one line per item

1. **False claims about the tree.**
   - Two claims are false. "Continue from the 29,000 float checkpoint": none exists (`report-code-row82-retrain_r1_2026-10-15.md:54`; amendment 1). "Never on an underlay row, never on photocopy damage": also false (`report-code-prereform-model_r1_2026-10-12.md:131-132`; `render.py:31-44,58-59`; amendment 4).
   - These check out: 2,086 (row 117 `:421,438`); 1,831 / 2,032 / 1,166 (combined `:11-13`); 190 and 232 (row 117 `:428-429`; the brief cites `:450` for the 232, which also holds it); md5 `2ff2af3e...` (row 82 `:59`); tgz md5 (`md5sum` this session); `engine.ts:1030` is `syllabify`; `:140` "No wordlist was given".
   - Verdict: FAIL, two false premises.
2. **Built thing differs from the measured configuration.** `clean.py` (`:36-49,63-68,102`) against `frameRow` (`underlay-frame.ts:339-363`) differ by 0.4 to 4.5 percent of pixels, and in size on grey paper (probe). Training and measuring through different frames: FAIL (amendment 2). Seating on framed crops needs `map_boxes.py`, which is not staged: FAIL (amendment 3).
3. **A measure that cannot tell the truth.**
   - Kind 3 and r2 itself are unchecked against U, P, B, and row 114 (`report-code-prereform-model_r1_2026-10-12.md:82-94`).
   - There is no positive control reproducing 2,086 and 1,831 on the Mac, and the noise floor is pixel-shift only (row 117 `:136`).
   - The checkpoint is chosen on a synthetic held-out set from the same generator, as row 82's was (`:280`), and no song chooses it. That last part passes.
   - Verdict: FAIL as written (amendments 3, 6, 11).
4. **Absolute pixels.** Damage is unsized. 32 px is the one ruled absolute (`underlay-frame.ts:39-43`). `clean.py`'s close:3 and pad 16 equal `frameRow`'s 3 by 3 and 0.5 × 32 at that height (`underlay-frame.ts:28-29,45-50`). Verdict: PARTIAL (amendment 9).
5. **What a singer meets.** Size goes to Dann before shipping: present (brief:24, `CONTRACT.md` §8 last bullet, read). The dictionary adds an unmeasured size, and the integer form is unaddressed. Verdict: PASS with amendment 13.
6. **Cost and time.** No line counts and no timings. `frameRow` takes 1.8 s per full-width crop (probe), so kind 2 through it alone is hours. Training is cheap (`train2.out`: about 140 s per 1,000). The 8-hour ceiling is present. Verdict: FAIL (amendments 2, 10).
7. **Instructions Code cannot follow.**
   - `underlay-frame.ts` is not on `Shane` (`ls`), and git fetch is Dann's (`CONTRACT.md` §4).
   - The truth-file and dictionary paths are unnamed. The dictionary is at `data/`, symlinked from `apps/web/static/data` (`ENVIRONMENT.md:3141`).
   - Pre-reform forms have no source (`pre-reform-normalizer.ts:21-22`).
   - Linux paths are hard-coded (amendment 3), and the priming patch is missing.
   - Verdict: FAIL.
8. **What walls the work in.** The plain-type stop fires on noise (`report-code-row82-retrain_r1_2026-10-15.md:47`; amendment 7). Nothing of r2 is overwritten given a new name (`train2.py:7-11`), but the start file is ambiguous (amendment 1); md5 before and after is added. Verdict: FAIL as written.
9. **Tesseract specifics.**
   - `--continue_from` takes a float recognition model, and `--old_traineddata` is required when the unicharset changes: tessdoc (deprecated page, read via WebFetch) and `lstmtraining --help` 5.3.4 here (`--old_traineddata`: "When changing the character set, this specifies the old character set that is to be replaced").
   - A punctuation dawg is required with any dawg (tessdoc).
   - The Mac's 5.5.3 docs: NOT ESTABLISHED here.
   - Whether a dawg helps a reader of hyphen-split syllables: NOT ESTABLISHED; the brief measures both, which is right.
   - Whether continuing after a unicharset change forces a restart: the documentation describes it as supported with `--old_traineddata`. Not run here.
   - Verdict: PARTIAL (amendments 1, 8).
10. **Probes run, about 30k tokens.**
    - (a) `clean.py` against `frameRow` on six crops: they differ.
    - (b) `GraysonEngine.syllabify` on pre-reform words: wrong cuts.
    - (c) Dictionary count, 943,106, of which 5,454 hold old letters.
    - (d) `frameRow` timing, 1.8 s per 4,400 by 90 crop.
    - (e) tgz md5 and contents.
    - (f) The lever 2 `common2.py` diffed against the combined copy.
    - Scripts in `/tmp/claude-0/-home-claude/1fb3a645-8f14-5f64-8fc1-7deb9dad61e8/scratchpad/p1/`.

## What I could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Tesseract 5.5.3** (the Mac's) documentation and `--help`. I read 5.3.4's help here and the tessdoc page, which is marked deprecated for 5.x.
- **The file on the Mac.** Whether `models/rus_prereform_r2/rus_prereform_r2_29000.traineddata` is byte-identical to the md5 `2ff2af3e...` file in `songs/models-r2/float/`. Row 82 implies it (`:54`) but does not print the chunk file's md5.
- **The frame difference in reading.** Whether the 0.4 to 4.5 percent pixel difference between `clean.py` and `frameRow` changes what the reader reads. No reading was run on the `frameRow` crops.
- **r2's unicharset**, and so whether the build songs' punctuation is already in it. The Mac's files are not here.
- **The Mac's archives.** Whether `~/Downloads/_desk-n135/crops2` on the Mac equals `/root/n135work/crops2` here, and whether the Mac holds `wordlists/`.
- **Tesseract behaviour.** Whether `lstmeval` applies a dawg. Whether tesseract.js can turn the dictionary off after load.
- **Row 114 under the exclusions file.** Whether row 114's set is listed in `~/Downloads/_desk-heldout-exclusions_2026-10-12.md`, which is not in this workspace.
- **The Mac's other work tonight.** Batch D and HEIC are named as running in trunk's last commit message (`git log -1`, `7238b77`). Where they run is not established, and step 0's `ps` covers it.
- **Speed on the Mac.** How much faster `frameRow` and the damage run there than in this container (2 cores here).

## Sources read outside the tree

- [TrainingTesseract 4.00 (tessdoc)](https://github.com/tesseract-ocr/tessdoc/blob/main/tess4/TrainingTesseract-4.00.md)
