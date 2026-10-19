# Audit: deeper, not bigger (r1, 2026-10-18)

Desk (Fable 5.1), 2026-10-18 19:08 to 19:3x, on Dann's track switch of 18:35 and the brief `brief-desk-audit-deeper-not-bigger_r1_2026-10-18.md`. Read whole this session: `../memory/PRODUCT.md`; `../memory/OPEN.md` sections "THE TEXT UNDER THE NOTES", "N.135 STAGE 3", the two N.135 addenda, "N.178 AND THE SCAN READER" items 1 to 23, N.184, N.173, N.172, N.170, N.168 (to its distillation rulings); `report-desk-n135-float-form-in-chrome_r1_2026-10-15.md`; `report-code-n135-underlay-harness_r1_2026-10-15.md`; `report-code-row82-retrain_r1_2026-10-15.md` sections 1 to 6; `plan-scan-reader_r4_2026-10-01.md` sections 1 to 5; `plan-to-colleagues_r1_2026-10-18.md`. Every claim carries a path, a run, or NOT ESTABLISHED. NOT ESTABLISHED beats a complete invented answer.

**The target, ruled 18:44:** a colleague's scan, PDF, or photograph in; Text, Markup, and Insights out; 9 of 10 syllables read with no poem typed. **The two questions the brief left open are answered** (19:02, 19:06; recorded in the brief and in `../memory/OPEN.md`, "THE AUDIT OF 2026-10-18").

## 1. What a top professional would do that you are not asking for

Each item: what the tree does today, then the professional's move, then its cost.

1. **Train the lyric reader on the deployment layout, not on text lines.** Today: row 82's model was trained on 23,591 rendered text lines of plain type (`report-code-prereform-model_r1_2026-10-12.md`), never on a lyric row under a staff with the piano's reach intruding and a German row beneath; stage 1 found the row cutter merging rows and the prints' syllable joins costing every reader (harness report, section 1, findings 1 and 2); the photocopied Kabalevsky pages are the floor, 42 to 74 seated (float report, item 3). The tree already renders the truth songs as pages with Verovio and keeps the SVG beside each PNG (`tools/e16-harness/src/render.ts:19-24`; `brief-code-fitted-shapes-and-the-round-trip_r1_2026-10-02.md:48`); Sunless 1's `page1.svg` holds 413 text elements (desk grep, 2026-10-18), so every syllable's box is known without a human. The professional renders every truth song in several music and lyric fonts, degrades the renders the way the deployment damages them (photocopy: broken strokes, filled counters, speckle, toner fade, skew; phone: perspective, blur, uneven light), and trains on those rows with the truth free; the test stays real pages. Row 105 asks for "lines rendered to look like photocopies"; this widens it to whole lyric rows under staves. Cost: NOT ESTABLISHED until a first batch is counted; the renderer and the training route (`train2.py`, row 82) exist on the Mac.

2. **Decode with the lexicon, not check after.** Today: the fine-tuned model carries no dictionary data (`report-code-prereform-model_r1_2026-10-12.md:140`, "No wordlist was given"), and the dictionary is used after the read, to sew and to reject (plan r4, section 4, "The words are scan first", steps 3 and 4). The float report's own lead for why the better readers pass fewer threshold pages is this absence (item 4). Tesseract decodes against word lists compiled into the model file (`wordlist2dawg`, then `combine_tessdata`; the desk's knowledge of the tool, NOT READ this session). Ilya has 909,795 words (harness report, section 4.3). The professional compiles Ilya's dictionary, with the pre-reform forms, into the model so the recognizer prefers real words while reading. Cost: a training step on the Mac; the model file grows by the list's size, which is told to Dann before it ships (`CONTRACT.md` §8).

3. **Attribute every lost syllable to its stage.** Today: the harness prints read share and seat share and concludes "the reading limits the score" (harness report, section 1), but no table says how many of the 663 syllables the float form loses (2,538 printed, 1,875 read; float report, item 2) die at row cutting, at token splitting, at letter recognition, or at seating. The professional keeps a per-syllable ledger that names the stage of loss, so the next lever is chosen by count. Cost: one scorer column; the harness holds every input.

4. **Preprocess for the page in hand, measured on the photocopies first.** Today: a picture is decoded and re-encoded as a greyscale PNG (`apps/web/src/lib/reader/page-image.ts:43-44`); whether any adaptive binarization or per-row deskew runs before the text reader is NOT ESTABLISHED (not read this session). The professional measures a few standard steps (Sauvola thresholding, per-row deskew, stroke closing) on B01 to B10 before training anything, because photocopy damage is what those steps exist for. Cost: a measure-only row on the crops already in `~/Downloads/_desk-n135/crops2`.

5. **Report the spread by source class.** Today: every result is one point score per song (`summary.txt`, stage 1). The professional reports each source class (engraving, photocopy, phone photograph) as a median with its low end, so "9 of 10 on pages like theirs" is a claim about a class with a range, and the low end is what has to clear the bar. Cost: a script.

6. **Two readers as a witness.** Today: homr reads the notes and Ilya's own reader checks them (ruled 2026-10-04 21:47, `OPEN.md` N.178 item 22); the text has one reader. The professional runs two text readers (the float form and (c), both already read on every row, `harness/ocr2/`) and treats agreement as confidence and disagreement as "unsure" (plan r4, principle 8), which is what puts the unsure mark on the right word without a second model. Cost: a comparison; no training.

7. **STRUCK by Dann 2026-10-18 19:18.** The desk wrote "score Text against Grayson's own printed transcriptions"; Dann: *"Grayson' has no printed transcriptions. I have other transcription resources but none of them will agree with Grayson's method; they are all erroneous or incomplete. This is why I chose Grayson's method. We have worked long and hard at operationalizing Grayson's work and I'm satisfied that Ilya represents it well if not perfectly."* (transcribed as written). The desk inferred the transcriptions from PRODUCT.md's mention of Grayson's appendices and presented the inference as fact; owned at 19:2x. So Text's judge is Grayson's rules as the tree encodes them, tested rule by rule (`packages/phonology/tests/*.test.ts`), and Dann's own reading; no whole-song authority exists. Row 118 is struck.

8. **Judge Insights on the colleagues' own voices.** Ruled by Dann 2026-10-18 19:18: *"The colleagues I select to participate will be knowledgeable voice pedagogues with extensive librarires of their own. I am confident that m y colleagues will offer helpful feedback, and I think Ilya should perform with their formant valies from their own fry samples."* (transcribed as written). So each colleague calibrates their own voice in Ilya, runs one song, and answers the three questions in writing. The desk's control version (the same advice with the singer's values removed) was the desk's amenity, put to Dann at 19:1x in a form he could not parse; DROPPED, DESK DEFAULT, 19:2x.

## 2. The rawest material

- **Your phone photographs**, in HEIC, the poem named for each (answered 19:02). This is the only material that is what colleagues bring.
- **The scan at its native resolution**, and the lyric-row crops at that resolution (`~/Downloads/_desk-n135/crops2`), not the page as Ilya resizes it.
- **The readers' raw output before Ilya's checks:** Tesseract's word boxes and confidences (`recognize(..., { blocks: true })`, float report, "What was done", step 2) and homr's output before `apps/web/src/lib/omr/` acts on it.
- **Your Finale engravings rendered by Verovio with their SVG** (item 1 of section 1): the rawest truth, because every syllable's box is known without a human.
- **Pre-1918 lyric rows from IMSLP** read by the teacher and kept where every word passes the dictionary (row 82 step 3b, blocked by IMSLP's redirect form; the desk fetches them in your Chrome, `CONTRACT.md` §4).
- **LiederNet's poems**, by hand, for the words (your ruling, `STATE.md`, the 2026-10-16 handover).
- **The colleagues' own measured voices**, from their calibration, for Insights; not your profile standing in.

## 3. The methods and tools, named

- Render and degrade: Verovio (in the tree) for the pages; degradation as functions over the render (blur, threshold jitter, salt-and-pepper, erosion and dilation for broken strokes, perspective warp, uneven lighting). Named tools the desk knows and has NOT RUN this session: `ocrodeg`, DocCreator's degradation models.
- Lexicon in the model: `wordlist2dawg` and `combine_tessdata`, on the Mac beside `lstmtraining` (row 82 used `combine_tessdata -e`, retrain report, section 3).
- Preprocessing: Sauvola thresholding (`skimage.filters.threshold_sauvola` or OpenCV's `ximgproc`), per-row deskew by projection on narrow slices (`ENVIRONMENT.md`, "MEASURING STAFF SPACE ON A TILTED PHOTOGRAPH"), morphological closing for broken strokes.
- Error attribution: a per-syllable ledger in the harness scorer, one row per truth syllable, one column naming the stage of loss.
- Alignment of poem to lyrics: the two papers already named (Yalniz and Manmatha, ICDAR 2011; Fremerey, Müller, and Clausen, ISMIR 2010), read in full and filed before stage 3 is designed.
- Spread: per-source medians and low ends, bootstrapped over songs.
- Two-reader agreement: character-level comparison of the float form and (c) per token; disagreement becomes "unsure".
- Insights: three questions in writing, one song, the colleague's own calibrated voice.

None of these adds a dependency to Ilya except the list inside the model file (bytes to report) and the HEIF decoder (row 113).

## 4. What, other than you or me, shows the result is right

1. The truth files, written by you from the print before any reading runs, scored by the harness on the sealed photographs (19:06).
2. For Text, Grayson's rules as the tree encodes them, tested rule by rule, and Dann's reading; no outside whole-song authority exists (Dann, 19:18).
3. LiederNet's poem, for the words.
4. Ilya's own checks that fire without anyone looking: the bar arithmetic (`apps/web/src/lib/score/bars-to-confirm.ts`), the dictionary pass rate, and, when built, two readers' agreement.
5. Two colleagues' written answers, for Insights, on their own calibrated voices.
6. The low end of each source class clearing 9 of 10, not the median.

## 5. The prompt, rewritten

> Make Ilya read at least 9 of 10 syllables on the photographs and photocopies colleagues bring, measured on a sealed set Dann photographed, against truth files Dann wrote before any reading ran, reported per source class with its low end. Before choosing the next lever, attribute every lost syllable to the stage that lost it. Train the lyric reader on degraded renders of the truth songs' own pages, with Ilya's dictionary compiled into the model, and keep the test on real pages. Carry two readers' disagreement to the page as unsure. Score the words against LiederNet's poem; Text answers to Grayson's rules as encoded and to Dann. Judge Insights by two colleagues' written answers, each on their own calibrated voice. Nothing is called working without its score against the truth file, taken on the path the singer used.

## 6. The path forward, as QUEUE rows (DESK DEFAULT order; measure before build, plan r4 principle 9)

| # | Row | Lane | Done when |
|---|---|---|---|
| 114 | Dann's sealed set: phone photographs in HEIC of songs from his shelf, poem named for each, in `~/Downloads/_colleague-pages/`; truth files written by Dann from the print | Dann | the folder holds the photographs and their truth files; no model has seen them |
| 113 | HEIF decoder in Ilya (recorded 19:04) | cloud, after rows 109 and 110 merge | a HEIC dropped on the alias reads as a picture; byte count reported |
| 115 | The per-syllable loss ledger and the per-source spread in the harness (section 1, items 3 and 5); measure only | cloud, on the harness copy | a table naming where each of the 663 lost syllables dies, and a median with its low end per source class |
| 116 | Two-reader agreement measured on the harness's existing readings (section 1, item 6); measure only | cloud | a count of tokens where the two readers agree and are right, agree and are wrong, and disagree |
| 117 | Preprocessing measured on B01 to B10 (section 1, item 4); measure only | Mac (the crops are in Downloads) | read share before and after each step, per song |
| 105, widened | The reader's next model: lyric rows rendered from the truth pages and degraded, plus real pre-1918 rows, with the dictionary compiled in (section 1, items 1 and 2) | Mac | held-out error and the harness's seated share, against the float report's cells |
| 119 | The Insights questions for two colleagues, each on their own calibrated voice (section 1, item 8) | desk drafts; Dann sends | two sets of answers returned |

Rows 115, 116, and 117 run before row 105 so the model is trained at the lever the ledger names. Row 119 is independent of the reader. This changes nothing in `plan-to-colleagues_r1_2026-10-18.md`'s groups except that row 105 widens and three measures precede it.

## What I could not establish

- Whether Verovio's renders carry the lyric fonts and the hyphen and underscore joins the prints use; the SVG holds text elements, and the join marks are NOT READ.
- Whether the retrain's `tesstrain` route accepts a wordlist in its current configuration on the Mac.
- Whether any preprocessing already runs before the text reader in Ilya.
- The byte cost of the dictionary inside the model file.

## How the rows are executed, ruled by Dann 2026-10-18 19:18

*"As we execute, can you walk me through step by step in sequerntial increments? ... I can follow simple directions, and your multi-valence itens above need to be simplified with my tolerance (lack thereof) in mind."* (transcribed as written). So every row above reaches Dann as one step at a time: one action, who does it, what arrival looks like, then stop (`CONTRACT.md` §5 and tether 8). The desk holds the whole; he never holds more than the current step.
