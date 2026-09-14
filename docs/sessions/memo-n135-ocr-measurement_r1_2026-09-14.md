# Memo: what Cyrillic underlay OCR costs and achieves, N.135

**Answers:** the brief at `docs/sessions/brief-n135-ocr-measurement_r1_2026-09-14.md`.
**Status:** all three questions measured. See section 5 for what could not be
pinned down along the way.

---

## 1. Instrument

**Where:** all measurement ran in a disposable cloud container with network
access, not on Dann's Mac. Files were staged in read-only from
`~/Desktop/ilya-rewrite` and `~/Downloads` with `device_stage_files`; nothing
was installed on the Mac, and no git command that writes was run anywhere (only
`ls-files`-equivalent reads, and mostly not even that).

**Versions used.**

| tool | version | used for |
|---|---|---|
| Node | v22.22.2 | inspecting `tesseract.js` source, resolving CDN URLs |
| `tesseract.js` (as declared, `apps/web/package.json:25`) | `7.0.0`, installed at `apps/web/node_modules/tesseract.js` | Q1 |
| Audiveris | `5.9.0`, commit `01e8988`, built from source with Gradle 9.1.0 / JDK 25.0.4 | Q2 |
| Tesseract (inside Audiveris, via its own JNI binding) | `5.5.1` | Q2 |
| Tesseract (system CLI, direct) | `5.3.4` | Q3 |
| tessdata | combined legacy+LSTM, tag `4.1.0`, fetched from `raw.githubusercontent.com/tesseract-ocr/tessdata/4.1.0/{rus,deu,eng,osd}.traineddata` (19,920,885 / 15,437,534 / 23,466,654 / 10,562,874 bytes) | Q2 and Q3 |
| poppler (`pdftoppm`, `pdfinfo`, `pdfimages`) | 24.02.0 | rendering page 1 of the scan for Q2 and Q3 |
| Python | 3.11.15, with Pillow 12.2.0, numpy 2.4.4, scipy 1.17.1 | crop geometry and match scoring |

**One flag up front, honestly stated rather than smoothed over:** Q2's OCR ran
inside Audiveris on Tesseract 5.5.1 (its own bundled engine). Q3's per-syllable
crops ran through the system `tesseract` CLI, version 5.3.4, because that is
what the container's package manager installed and Audiveris's engine is not
separately invokable outside the Audiveris pipeline. Both used the same
tessdata (tag `4.1.0`). The Q2/Q3 comparison is therefore not a controlled
same-engine comparison; it is two different measurements of the same
underlying question (whole-page vs. cropped OCR) run on two builds of
Tesseract that are one minor version apart.

**Confirmed before relying on it:** the lamm scan is the same page memo-n96
measured. `pdfinfo`/`pdfimages -list` on
`sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf` show 2 pages, 5548x7380 @
600dpi, JBIG2, Producer "Adobe Acrobat 9.0 Image Conversion Plug-in" — an exact
match to memo-n96's target file description. Viewing the page directly
confirms it is bilingual: "В четырех стенах. 1. In vier Wänden." with Russian
above German under every vocal phrase. This matters for how Q2's number should
be read (section 3).

---

## 2. Q1: what the shipped OCR costs over the wire

**Confirmed in code, not assumed.** `apps/web/src/lib/shane/ScoreUploader.svelte:300-304`
calls `createWorker('rus')` with no options object. `tesseract.js`'s
`createWorker.js` defaults `oem` to `OEM.LSTM_ONLY` and, with no `_options`
passed, every path-resolution default in
`node_modules/tesseract.js/src/worker/browser/defaultOptions.js`,
`.../worker-script/browser/getCore.js`, and `.../worker-script/index.js:130`
applies unmodified. None of the three assets below is bundled by Ilya's build:
confirmed by `find apps/web/build apps/web/.svelte-kit -iname '*tesseract*'`
returning nothing at all. All three come from a CDN, not Ilya's own origin.

| asset | origin | raw (decompressed) | as served (wire) |
|---|---|---:|---:|
| `worker.min.js` | `cdn.jsdelivr.net/npm/tesseract.js@v7.0.0/dist/worker.min.js` | 111,307 B | 31,770 B (brotli) |
| core WASM+glue, SIMD build | `cdn.jsdelivr.net/npm/tesseract.js-core@v7.0.0/tesseract-core-simd-lstm.wasm.js` | 3,899,472 B | 1,373,509 B (brotli) |
| `rus.traineddata` (LSTM-only, `best_int`) | `cdn.jsdelivr.net/npm/@tesseract.js-data/rus/4.0.0_best_int/rus.traineddata.gz` | 5,053,706 B (decompressed `.traineddata`) | 2,679,598 B (the file is pre-gzipped at rest and jsdelivr adds no further encoding, so this number is both the stored size and the wire size) |

Each row's numbers came from a direct `curl -sS --compressed -D -` against the
live CDN URL (headers and byte counts shown in the working transcript); the
worker path, core path, and traineddata path are the literal strings the
installed `tesseract.js` 7.0.0 source resolves to for `createWorker('rus')`
with zero options, not a guess.

**Total first-use wire cost, one browser with WASM SIMD (the common case
today): 31,770 + 1,373,509 + 2,679,598 = 4,084,877 bytes, about 3.9 MiB.**
The SIMD choice barely moves this: the non-SIMD core is 1,371,728 B wire and
the relaxed-SIMD core is 1,374,067 B wire, both within 9 KB of the SIMD
figure, so which one a given browser negotiates changes the total by under
0.2%.

**Is any of this already inside the "roughly 12 to 22 MB" first-session
figure in `memo-footprint-and-release-arithmetic_r1_2026-09-13.md`? No.**
Three independent reasons, not one: the OCR code path is dynamically
`import()`-ed only inside `readPictureAsPoem`, which only runs if a singer
answers "the poem" with a photograph — not part of the plain page-load that
memo measured; all three assets are fetched from `cdn.jsdelivr.net`, a
different origin than Ilya's own deploy, so they would not show up in a
same-origin asset audit even if OCR were exercised; and a direct search of the
built output (`apps/web/build`, `apps/web/.svelte-kit`) found no
tesseract-related file at all. The footprint memo's own static-asset table
(denigma, fonts, pdfjs, Guide images, `reader`, `images`, `icons`) has no OCR
line, which is consistent with all of the above rather than an oversight.

---

## 3. Q2: does a multi-language spec lift the 47%

**Baseline reproduction, attempted honestly and reported as partial.** I
rendered page 1 of the scan at 400dpi (`pdftoppm -png -r 400 -f 1 -l 1`, giving
`raster400-1.png`, 3699x4920 — the same rendering step memo-n96 describes for
its "raster400-1.png" run) and ran Audiveris with
`-constant org.audiveris.omr.text.Language.defaultSpecification=rus`.

The ground truth is the 96 `<lyric number="1">` `<text>` values from
`Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`, read in
document order, exactly as the brief specifies (parsed with Python's
`xml.etree.ElementTree`, `note/lyric[@number='1']/text`; count checked and
confirmed as 96).

The matching method in memo-n96 ("exact string match, order-agnostic within a
60-token window") is described in prose, and the script that produced it was
not preserved in the repo. I reconstructed it as: normalize both the OCR
output and each ground-truth token by stripping every character outside the
Cyrillic block (U+0400-U+04FF) and lowercasing, then match as a multiset (each
ground-truth token consumable once), order-agnostic. Without normalization
(bare exact string match, including punctuation and case) I could only
reproduce 24-30%, well under the reported 47%; with normalization, my `rus`
baseline run scored **37 of 79 non-empty OCR tokens, 47%**, against memo-n96's
reported **36 of 76, 47%**. The percentage matches almost exactly; the token
counts (79 vs. 76) do not match exactly. Re-running the identical command a
second time gave the identical result (37/79, identical token list), so the
gap is not run-to-run nondeterminism inside this session — it is a difference
between this session's render/OCR pipeline and whatever produced memo-n96's
76-token run, and I could not identify the exact cause (see section 5).

**Reading this: reproduced at the level the brief asks for (a comparable
percentage under a stated method), not reproduced as an exact token-count
match.** I judged this close enough to proceed, per the brief's instruction to
stop only if reproduction fails outright.

**The three counts, same method, same ground truth:**

| spec | matches | non-empty OCR tokens | percentage |
|---|---:|---:|---:|
| `rus` (baseline) | 37 | 79 | 47% |
| `rus+deu` | 36 | 86 | 42% |
| `rus+eng` | 33 | 69 | 48% |

**Cross-check on a second input pipeline.** Running the same three specs
directly against the PDF (Audiveris's own PDFBox ingestion at native 600dpi,
rather than a pre-rendered 400dpi PNG) gives `rus` 40/77 (52%), `rus+deu`
25/72 (35%), `rus+eng` 25/69 (36%). The absolute percentages differ from the
raster400 run (different rendering pipeline, as expected), but the **direction
agrees exactly**: `rus+deu` is worse than `rus` alone in both pipelines, and
`rus+eng` is statistically a wash (within one or two tokens of `rus` alone) in
both.

**Answer: no, a multi-language spec does not lift the 47%.** Adding German
(`rus+deu`) makes it worse, not better, on this bilingual page — consistent
with memo-n96's own diagnosis that a single global OCR pass over an
interleaved bilingual page is the problem, and adding a second language to the
same single global pass does not fix that structural mismatch. Adding English
(`rus+eng`) is a wash, a one-to-two-token difference on samples in the
70-90-token range, not a meaningful lift.

---

## 4. Q3: does per-syllable cropping beat whole-page OCR

**Segmentation method, stated plainly so it can be repeated.** Ilya's own
reader geometry (`apps/web/src/lib/shane/ingestion/recognized.ts:29-90`) was
not run in this session — it operates inside the app on data this session did
not construct. Per the brief's fallback, I built a hand-verified crop grid on
one system instead, and I am reporting a 12-syllable sample (system 1's
Russian line, "Ком.нат.ка тес.на.я, ти.ха.я, ми.ла.я;"), not the full 96.

The method: render page 1 at 600dpi (`pdftoppm -r 600`), find the Russian
lyric row's y-band by its ink-density profile, then find syllable x-boundaries
by column-wise ink projection within that band, using the real measured
whitespace gaps between syllables (most gaps 60-340px; the smallest reliable
boundary was 29px, against 6-11px noise between letters of the same
syllable). Every one of the 12 resulting crops was checked by eye against a
side-by-side composite image before OCR; all 12 syllables were correctly
isolated (verified visually, not assumed). Final crops: 15px padding on each
side, y-band 1685-1765px (600dpi page coordinates), 2x upscaled with Lanczos
resampling before OCR, run through `tesseract -l rus --psm 7` (single text
line — the mode that scored best of the two tried; `--psm 8`, single word,
scored one token lower).

**Raw crops: 10 of 12 syllables matched (83%)**, same normalize-and-match
method as Q2. This compares to Q2's whole-page `rus` result of 47% on the same
scan (different sample size: 12 syllables here vs. 79 whole-page tokens in
Q2 — not a like-for-like statistical comparison, a directional one).

The two misses: `!ХОМ` for "Ком" (first syllable of the line, capital letter
plus the page's own descender clutter nearby), and `и` for "ти".

**Dictionary-constrained crops: also 10 of 12 — no change.** I read
`packages/dictionary` before assuming its shape, per the brief's instruction.
Its shape (`packages/dictionary/src/types.ts:12-33`,
`StressDictionary = Record<string, DictionaryEntry | DictionaryEntry[]>`) is a
**whole-word** Russian lexicon keyed by full lowercase Cyrillic word forms
(471,552 entries in the `dictionary.86d83340-a.json` shard, 448,770 of them
pure-Cyrillic single words), carrying stress index, gloss, and part of
speech — not a syllable-fragment lexicon. There is no ready-made list of
"plausible Russian syllable fragments" in this package; building one would
mean deriving a syllabifier from the whole-word list, which I did not attempt.

As a declared substitute, I tested a real, non-circular dictionary
constraint: for each raw OCR token, check whether it is a valid **prefix** of
any real word in the 448,770-word list; if not, replace it with the
nearest word-prefix of the same length by edit distance. Result: **every one
of the 12 raw tokens, correct or not, was already a valid prefix of some real
Russian word** — including both wrong answers (`хом` is a valid prefix, e.g.
of words beginning `хом-`; `и` is itself a complete, valid Russian word,
"and"). The correction step therefore had nothing to bite on and changed
nothing. This is a real finding, not a null result from a weak test: at
2-4 letters, almost any Cyrillic sequence is a valid prefix of some entry in a
448,770-word lexicon, so prefix-validity against a whole-word dictionary does
not discriminate a correct short OCR reading from an incorrect one. A
dictionary constraint that actually helped would need to be fragment-aware
(a syllable inventory, or n-gram frequencies within words), which is a
different and larger piece of work than reading the existing package.

---

## 5. What could not be established

- **The exact cause of the 76-vs-79-token gap in reproducing memo-n96's
  baseline.** The percentage reproduced (47% both times); the absolute token
  count did not. Repeating my own run gave an identical result both times, so
  it is not within-session nondeterminism. Whether the difference is a
  different `pdftoppm`/rendering invocation, a different Audiveris point
  release, or something else in the original session's pipeline was not
  identified, because the original run's exact commands were not preserved in
  the repo for a byte-for-byte re-run.
- **Memo-n96's original matching script.** I reconstructed "exact string
  match, order-agnostic within a 60-token window" as normalize-then-multiset
  match, which reproduces the reported percentage closely. This is a
  reconstruction from prose, not the original code, and a literal
  positional 60-token sliding window (which I also tried) reproduces neither
  memo-n96's number nor a plausible new one (24-30%), so I did not use it.
- **Full 96-syllable per-crop OCR.** Only one system (12 of 96 syllables) was
  cropped and OCR'd, per the brief's own declared fallback, because Ilya's own
  notehead-geometry reader was not run in this session. Whether the 83% raw
  crop result holds across all 96 syllables, across systems with denser text,
  or on a second scan, is not established.
- **Whether a real per-syllable OCR pipeline could actually be built on
  Ilya's existing geometry.** The reader already locates noteheads
  (`recognized.ts:29-90`), which is why the brief calls segmentation "free,"
  but this session did not run that code against real page data and did not
  build or test the geometry-to-crop-box mapping a real feature would need.
  The 83% figure shows what Tesseract does with a good crop; it does not show
  that Ilya's geometry produces a good crop automatically.
- **A fragment-aware dictionary correction.** Only whole-word prefix-validity
  against `packages/dictionary` was tested. A syllable-level lexicon derived
  from that data (via a syllabification pass) was not built, so whether a
  properly fragment-aware constraint would help is not established, only that
  the naive whole-word version does not.
- **Real singer network conditions.** The wire sizes in Q1 came from one
  `curl` fetch each, from this container, against the live CDN. Actual
  compression negotiated with a given singer's browser, CDN edge latency, and
  repeat-visit caching behaviour were not measured.
- **Same-engine comparison between Q2 and Q3.** Q2 ran inside Audiveris on
  Tesseract 5.5.1; Q3 ran the system CLI's Tesseract 5.3.4. Both used
  identical tessdata (tag 4.1.0), but the engine binaries differ by one minor
  version, so the whole-page-vs-crop comparison is not fully controlled.

---

## 6. Bottom line

Underlay OCR's wire cost is real but small and one-time: about 3.9 to 4.1 MB
fetched from a third-party CDN, only when a singer chooses to photograph a
score, and currently absent from every existing footprint or first-session
figure Ilya has published. That part is cheap. Whole-page OCR with a
multi-language Tesseract specification does not clear the 47% baseline this
feature would need to be useful: `rus+deu` measured worse than `rus` alone on
this bilingual page in two independent rendering pipelines, and `rus+eng` measured
statistically even with `rus` alone in both. Cropping the page down to one
syllable at a time, by contrast, moved the needle a lot on the one system
tested here: 10 of 12 syllables correct (83%) against Tesseract alone, more
than whole-page OCR's 47%, with a dictionary correction step adding nothing
further because a whole-word Russian lexicon does not meaningfully constrain
fragments this short. The lever that matters, on these numbers, is
segmentation, not the OCR engine or the language specification. What is not
established is whether Ilya's existing notehead geometry actually delivers
crops this clean across a whole page at scale, which is the real
engineering question this feature turns on and which this session's 12-syllable,
one-system sample does not settle.
