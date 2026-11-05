# Row 181: can the reader score the poem's syllables against what it sees? (helper report r1, 2026-11-04)

Read from `origin/cloud-lane-34` of `/home/claude/ilya` with `git show`. Probe scratch: `/root/c181/match/` (probe `pup.mjs`; outputs `out-*.json`, `hocr-*.html`; row image `row_pad.png`). Nothing written elsewhere. The second Mussorgsky file was not opened.

## 1. What Ilya runs today

- Library: `tesseract.js` `^7.0.0` (`apps/web/package.json:28`), locked at 7.0.0 with `tesseract.js-core@7.0.0` (`pnpm-lock.yaml:1135,1138,2183,2185,2193`).
- Core file: `tesseract-core-simd-lstm.wasm.js` (`apps/web/src/lib/omr/underlay-recognize.ts:32`), named as a file because the relaxed-SIMD core aborts on float models (`underlay-recognize.ts:9-12`).
- Model: `rus_prereform_r2_29000` float, 7,827,478 bytes, page segmentation mode 7 (`underlay-recognize.ts:2-7,31,65`). Created with `createWorker(lang, 1, {gzip:false, cacheMethod:'none', workerBlobURL:false, ...paths})` (`underlay-recognize.ts:89-94`). Browser call: `recognizeRow` (`underlay-recognize.ts:101`), in the page's thread (`:17-18`).
- What Ilya asks for: `setParameters({tessedit_pageseg_mode:'7', preserve_interword_spaces:'1'})` (`:65`) and `recognize(row, {}, {blocks:true})` (`:74`). `wordsOf` (`:55-57`) keeps, per word, only `text` and the box. Confidence, symbols and choices are dropped there. `WordBox` is `{text,x0,y0,x1,y1}` (`underlay-page.ts:46-52`). A word's text then goes through `pageTokens` -> `splitTokens` (`underlay-page.ts:207-214`; `underlay-tokens.ts:45`) and `cutUnits` (`underlay-units.ts:38`), where the engine's syllable cut is applied to the read string.
- Separate path, not examined further: `apps/web/src/lib/score/ScoreUploader.svelte:372` (a `rus` worker for poems) also imports tesseract.js.
- Model file used in the probe: `/root/m0/_desk-2026-10-28/a2-inputs/rus_prereform_r2_29000.traineddata`, 7,827,478 bytes (equals the size at `underlay-recognize.ts:6`), md5 2ff2af3e33461cd64e7d2015ef21d10d. That it is byte-identical to the shipped model is NOT ESTABLISHED (size only).

## 2. What the build can return that Ilya does not ask for

Probe: headless Google Chrome 153 (puppeteer-core), tesseract.js 7.0.0 `dist/tesseract.min.js` and `worker.min.js`, core `tesseract-core-simd-lstm.wasm.js`, the model above, same `createWorker` options as Ilya, psm 7. Engine version string returned: `5.1.0-288-g2a9c1`. Row: first lyric line of page 2 of the first Mussorgsky file, rendered at 200 dpi, cropped, halved, padded 16 px (`row_pad.png`, 1931x102). This is not Ilya's own frame preparation, so confidences are indicative only.

Reading of the row (today's call): `крас - на - я? иль ко - ки . ну - ла дру-га ми - ло - го? Дру-га`. The printed «по» was read «ко» with word confidence 32.

a) Per-symbol text, confidence and box: returned today by `blocks:true`, ignored by Ilya. Each word carries `symbols[]` (keys `bbox, text, confidence, is_superscript, is_subscript, is_dropcap`), e.g. `{"bbox":{"x0":47,"y0":43,"x1":67,"y1":64},"text":"к","confidence":98,...}` (`out-base.json`). tesseract.js's own types list the same (`node_modules/tesseract.js/src/index.d.ts` Symbol, Word).

b) Word `choices` in the JSON: one entry only, the word itself (`choices [{"text":"ко","confidence":32}]`). No alternatives, with or without the parameters below. Symbols carry no `choices` field (`out-m1.json`, `out-m2.json`: identical to base).

c) Per-symbol alternatives with scores: available through hOCR only, not through `blocks`. Set `lstm_choice_mode` = `2` (and `lstm_choice_iterations`) with `setParameters`, and ask for `{hocr:true}` (`dump.js:71` returns `api.GetHOCRText()`). With mode 2, each symbol of «ко» came back as a ranked list (`hocr-h2.html`):
   - symbol 1: к 85.97, н 78.16, х 64.33, **п 60.11**, К 59.84, т 50.89, ж 43.89, ц 42.12, и 40.39, д 38.57, Н 37.03
   - symbol 2: о 95.19, then О, ю, 0, с, е, а, и at 0.
   With `lstm_choice_iterations`=1 the same lists shrink to two entries each (к 85.97, н 78.16; о 95.19, О 0): the setting caps the list length (`hocr-h2i1.html`). The scores are not probabilities: they do not sum to 100 (к and н alone are 164). The right letter «п» is in the list at rank 4, below «к» and «н». 54 symbol lists for the 20 words of the row. Mapping a list to a symbol box needs the `symbols[]` order from `blocks`, which agrees one to one with the hOCR symbols for this row (word «ко»: 2 symbols, 2 lists); a full-row check of that agreement was not run.

d) Per-timestep outputs: `lstm_choice_mode` = `1` returns, in hOCR, a `timestep` element per LSTM step with up to about ten scored choices each (`hocr-h1.html`; e.g. step scores 99, 96, 89 for blanks). Two problems seen in this probe: the choice list per step is truncated (it does not cover the whole alphabet), and the glyphs shown look wrong against the reading (к appears as «ӱ», а as «с̧», с as «у», н as «л»), consistent with a shifted symbol table. The cause is NOT ESTABLISHED. So the timestep dump is present but its labels cannot be trusted from this probe. Raw full-alphabet per-step probabilities are NOT available from this build (nothing in tesseract.js's API or the hOCR returns them).

e) Not run: the Tesseract C++ source for `lstm_choice_mode` was not read (the strings `lstm_choice_mode`, `lstm_choice_iterations`, `lstm_choices_` are in the core: grep of `tesseract-core-simd-lstm.wasm`); the descriptions above are from output only. Timing and size cost of the hOCR pass were not measured.

Probe note: running the same code in Node aborted with `missing function: _ZN9tesseract13DotProductSSEEPKfS1_i` even after pointing Node's core selection at the `.wasm.js` simd core in my scratch copy of `node_modules`; cause NOT ESTABLISHED. The browser run above is the evidence; it matches Ilya's recorded finding (`docs/memory/ENVIRONMENT.md`, "A FLOAT MODEL LOADS WHEN corePath NAMES THE SIMD CORE FILE").

## 3. Which design the build supports

- (a) Per-letter alternatives with confidences, scored by weighted edit distance: SUPPORTED, with hOCR + `lstm_choice_mode=2`. Probe evidence: the print's «п» sits in the alternatives of the misread «к» at 60.1 against 86.0. Caveats: scores are uncalibrated (not probabilities), so the weighting needs a monotone map and a measure; the alternative list is per symbol, so a letter the engine merged, split or dropped has no list to score against (insertions and deletions still need a gap cost).
- (b) Forced alignment on per-step probabilities, as CTC-segmentation: NOT SUPPORTED as shipped. Mode 1 gives a truncated, apparently mislabelled per-step dump. Going further would mean a custom build of the core, which is out of scope for this probe.
- (c) Letter-level global alignment of the poem against the read letters (McGill / de Reuse and Fujinaga), with a reader confusion cost: SUPPORTED with no new engine output, because the read letters and their boxes are already in `blocks` (symbols). Alternatives from (a) can be added later as a cheaper-confusion table.

Cheapest design this evidence supports: (c) first, (a) as its scoring upgrade.

What each needs in Ilya (files named; sizes in lines NOT estimated):
- Both: `underlay-recognize.ts` (`wordsOf`, `:55-57`, and the `recognize` call, `:74`) to return symbols with their boxes and confidences; `WordBox` (`underlay-page.ts:46`) or a sibling type to carry them; `pageTokens` (`underlay-page.ts:207`) and `splitTokens` (`underlay-tokens.ts:45`), which build tokens from word text and so would need to carry per-letter data; `cutUnits` (`underlay-units.ts:38`), where syllable pieces are cut from the read string and are the natural place to take a poem syllable's letters and boxes from the alignment instead. The poem text's route into the reader is NOT ESTABLISHED (I did not trace where the poem is joined; `underlay-seat.ts`, `underlay-words.ts`, `underlay-choose.ts` and the join code were only skimmed).
- (c) adds: a new pure module for global alignment with affine gaps and a confusion cost table; tests.
- (a) adds to (c): `setParameters({lstm_choice_mode:'2', lstm_choice_iterations:...})` in `makeRecognizer` (`underlay-recognize.ts:65`), `{hocr:true}` in the output request (`:74`; the `TesseractLike` interface at `:45-49` types `output` as `{blocks:boolean}` only), an hOCR parser, and the extra reader time, which is NOT MEASURED.

## Not established

- Why Node aborts; why mode 1's labels look shifted; the calibration of the choice scores; the cost in time and bytes of hOCR with choices; whether the probe's results hold on Ilya's own framed rows (the probe used a plain crop); the shipped model's identity beyond file size; the poem-join code path.
- Stopped before the 150,000-token limit; no work cut short for budget.
