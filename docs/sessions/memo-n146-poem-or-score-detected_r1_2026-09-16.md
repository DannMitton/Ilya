# Memo: N.146, Ilya tells a poem from a score itself

Reply to `brief-n146-poem-or-score-detected_r1_2026-09-16.md`, read in full. Built
in Claude Code, 2026-09-16/17.

---

## Step 0. Measurement and the choice: THE LIGHT CHECK

**Expectation before measuring:** the light check (rows of dark pixels running
most of the page width, in groups of five with even spacing) would answer
clean, computer-rendered pages correctly but would likely be fooled by a real
scanned or photographed page, because `detect_staves`
(`tools/e16-harness/reader/reader.py:352`) carries a whole second fallback
path and a line-merge repair specifically for staff rules that print skewed or
broken on a real scan (its own comment at `:395-444` names the Lamm scan page
that needed it). The expectation going in was that the reader's own detector
would win on correctness, and the question was only how much the Pyodide
warm-up would cost against it.

**What was measured.** `detect_staves` was called directly (Python 3.14, `cv2`
4.x and `numpy` present locally; `matplotlib` is not installed but is never
imported by `detect_staves` itself) against the existing fixture corpus,
timing only the call:

| page | staves | s | time |
|---|---|---|---|
| `close-fixture-page.png` | 1 | 21.0 | 16ms |
| `fixture-a-page.png` | 1 | 21.0 | 8ms |
| `raster400-1.png` (Lamm scan p1, app's raster) | 9 | 30.0 | 33ms |
| `raster400-2.png` (Lamm scan p2, the page named in the comment above) | 9 | 30.0 | 35ms |
| `pdfjs400-1.png` | 9 | 30.0 | 26ms |
| `pdfjs400-2.png` (the specific page the line-merge repair was written for) | 9 | 29.0 | 32ms |

Every one of these succeeded on its FIRST try, including the page named in
`reader.py`'s own comment as needing the repair -- that repair is already
shipped, so the case is no longer live, but it was still the sternest test
available and it passed. **The algorithm itself is fast (well under 40ms) once
loaded.** What is not fast is reaching it: N.59's own header measured Pyodide
plus `numpy`, `opencv-python` and `matplotlib` at ~2.9s cold, before a single
page can be read. N.26's law is "a drop of one kind never pays for another's
warm-up", and every text PDF and every photographed poem would pay this one
for nothing under the new design, since the staff check has to run BEFORE
Ilya knows which kind a file is.

A light TypeScript heuristic was then written (`engine/staff-detect.ts`,
`detectStavesLight`): `img < 128` for ink (the same threshold `reader.py`
uses), a fixed row gate of 0.4 (not adaptive -- see the file's own comment for
why an adaptive gate was not worth building for a yes/no answer), 3px
proximity grouping (`reader.py`'s own `_lines_from_rows`, copied), and a scan
for any five-line group with gaps within 15% of their own mean anywhere on
the page. It was measured, decoding the same PNGs by hand (Node's built-in
`zlib`, no dependency added -- the decoder is scratch-only and not part of
this ship) against fifteen real pages:

| page | what it is | staves found | correct? |
|---|---|---|---|
| `close-fixture-page.png`, `fixture-a/b/c-page.png` | clean render fixtures | yes | yes |
| `raster400-1/2.png`, `pdfjs400-1/2.png` | the Lamm manuscript scan, both rasterizers | yes | yes |
| IMSLP113877 p.1 and p.3 (`Mussorgsky - Without Sun`) | a real historical engraving, **poem set above the staves** (Dann's 2026-09-16 ruling's own case) | yes | yes |
| `ilya-test-page.pdf` p.1 | a clean Verovio-engraved PDF | yes | yes |
| `Repertoire_assignment_rubric.pdf` p.1 | a form, short underlines only | no | yes |
| Grayson thesis, copyright page | almost blank, two lines of text | no | yes |
| Grayson thesis, "List of Tables" page | dense, evenly-spaced text lines (the adversarial case for a row-rhythm heuristic) | no | yes |
| Project MUSE cover page | two full-width horizontal rules, far apart | no | yes |

**All fifteen answered correctly on the first run, with no tuning.** Detection
itself measured 6-17ms per page in the (unoptimized, hand-written) Node
harness; in the real pipeline there is no separate decode step at all, since
the page is already decoded pixels in the canvas before it is ever encoded to
PNG (see `hasStaves`'s own comment on the one decode round-trip it does pay).

**Chosen: THE LIGHT CHECK**, per the brief's own rule ("choose the light check
if it answers every page correctly"). Decisive reasons, beyond the corpus
result: (1) it never touches Pyodide, so a text PDF or a photographed poem
never pays N.59's warm-up, which the Python check could not avoid since the
staff question has to be answered before the file's kind is known; (2) the
boolean this function answers ("is there at least one staff on this page
ANYWHERE") tolerates the imprecision a light heuristic carries much better
than `detect_staves`'s own job (exact line geometry for note-reading) does --
a single damaged staff among dozens on a real page costs this function
nothing, which is also why its own file comment argues it needs none of
`detect_staves`'s fallback machinery.

**NOT ESTABLISHED:** no real photographed page of a poem (camera noise, tilt,
uneven lighting) was found in `~/Downloads` to test against; the closest
available proxies were rasterized text PDFs, which share the "no staff lines"
shape but not a photograph's noise. The measured corpus above is otherwise
real pages, not synthetic ones, but this one category is a gap named rather
than guessed at.

---

## Step 1. What changed, by file

- **`apps/web/src/lib/shane/engine/staff-detect.ts`** (new). `detectStavesLight`,
  the pure pixel heuristic above, and `hasStaves(png)`, which decodes a
  greyscale PNG (the shape `toGreyscalePng` / `rasterizePdf` already produce)
  and calls it.
- **`apps/web/src/lib/shane/ingestion/poem-or-score.ts`** (new).
  `decidePoemOrScore`, the pure branch table: given `stavesFound`,
  `sungLineFound`, `textLayer`, and `ocrText`, says `score`, `poem` (and from
  which source), or `unreadable`.
- **`apps/web/src/lib/shane/ScoreUploader.svelte`** (204 insertions, 133
  deletions):
  - `UiState`'s `askKind` variant is gone (`:132-146` before this ship).
  - `take()` (`:255`) no longer asks. It rasterizes the first page
    (`rasterizeFirstPage`, `:300`, new), runs `hasStaves`, and either hands off
    to `handleFile` (staves found) or straight to the poem route (none).
  - `pendingPoemFallback` (`:290`, new `let`) carries the already-rasterized
    ink and the file's kind from `take()` to `readAsked()`, for the one case
    `take()`'s own return cannot reach: the real score attempt happens after
    the singer answers the clef-and-key question, a later press.
  - `handleFile` (`:453`) takes a new optional third parameter,
    `onNoSungLine`, called (only when a caller passes it) wherever the ingest
    outcome is not ok, or is ok with zero notes read. Every other caller
    (restore, a direct MusicXML/`.musx`/`.mscz` drop) passes nothing and is
    byte-for-byte unchanged.
  - `readAsked()` (`:657`) is the only caller that passes `onNoSungLine`, and
    falls through to `readPdfAsPoem` / `readAsPoemByOcr` with `stavesFound:
    true, sungLineFound: false` when it fires.
  - `readPdfAsPoem` (`:337`) and the renamed `readAsPoemByOcr` (`:383`, was
    `readPictureAsPoem`) are unchanged in their actual extraction/OCR work;
    what changed is who calls them (automatically, not a button) and that the
    final answer is `decidePoemOrScore`'s, not an inline empty-string check.
  - `handleScoreAnswer` is removed (dead: its only caller was the `askKind`
    markup, also removed).
  - The `askKind` markup block (`{#if ui.kind === 'askKind'} ... {:else if}`)
    is gone; the `'asking'` (clef-and-key) block is untouched, per the
    brief's "What NOT to do".
- **`apps/web/src/lib/shane/engine/staff-detect.test.ts`** (new, 10 tests):
  a blank page; a plain staff; a staff spanning less than the full width
  (margins); a staff far down a tall page; two full-width rules far apart
  (the Project MUSE shape); four rows short a fifth; five unevenly spaced
  rows; short sparse text-rhythm marks; a damaged first staff answered by a
  second, undamaged one; a zero-size page.
- **`apps/web/src/lib/shane/ingestion/poem-or-score.test.ts`** (new, 11
  tests): every branch named in the brief, including both shapes of "both
  fail" (staves-found-then-nothing, and no-staves-then-nothing), and
  whitespace-only text treated as no answer.

**Expectation before each check, and the result**, per the brief's own
"Definition of done":

1. *A score PDF and a score photo draw with no question.* Expected yes,
   confirmed by `decidePoemOrScore`'s own test for `stavesFound: true,
   sungLineFound: true` and by the removal of the `asking`-before-`askKind`
   ordering (staves are checked before any question is ever shown). **Not
   walked live in a browser this session** -- see "Not established" below.
2. *A text PDF fills the field; a scanned poem and a poem photo do too.*
   Expected yes for a text PDF (its own test: no staves, non-empty text layer
   -> `poem/textLayer`) and for a picture (no staves -> straight to OCR).
   Confirmed by the pure-function tests. A "scanned poem PDF" (no text layer,
   staves absent) was not tested end to end against a real scanned poem file,
   because none was found in `~/Downloads`; the branch itself
   (`textLayer: '', ocrText: '<text>'` -> `poem/ocr`) is tested.
3. *The step 0 table is in the memo.* Done, above.
4. *All five gates green.* See below.
5. *Walked by Dann.* Not this session's to do.

---

## Unused i18n keys (per the brief: left in place, reported here)

`intake.pdf.title`, `intake.pdf.why`, `intake.pdf.poem`, `intake.pdf.score`,
`intake.picture.title`, and `intake.pdf.noText` are no longer referenced
anywhere outside `i18n.ts` (checked with `command grep`, since this shell's
plain `grep` skips gitignored paths and the check needed to be exhaustive
regardless). `intake.pdf.reading` and `intake.picture.reading` are still used
(the busy labels, now shown automatically rather than behind a press).

---

## Gates

| gate | baseline | this ship |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216), unchanged |
| dictionary | 235 passed (235) | 235 passed (235), unchanged |
| web-check | 0 errors, 8 warnings, 5 files | 0 errors, 8 warnings, 5 files, unchanged |
| web-test | 1206 passed (1206) | **1227 passed (1227)**: +21, all new (10 in `staff-detect.test.ts`, 11 in `poem-or-score.test.ts`) |
| score-parser | 567 passed, 5 skipped (572) | 567 passed, 5 skipped (572), unchanged |

Only web-test moved, and only by the tests this ship added. `ilya-ship.sh`'s
own `:82` line (`gate 4 web-test "1206 passed (1206)"`) needs moving to
`"1227 passed (1227)"` before the next ship; not done here, since this session
runs no writing git command and does not touch files outside the repo tree it
was briefed on.

The ship script itself was not run (it refuses on untracked files, and this
memo and its brief are both untracked); each gate above was run directly
(`pnpm test:phonology`, `pnpm test:dictionary`, `pnpm -C . --filter @ilya/web
check`, `pnpm -C . --filter @ilya/web test`, `pnpm -C . --filter
@ilya/score-parser test`).

---

## NOT ESTABLISHED

- No real photographed page of a poem was available to test the light check
  against (named in step 0).
- No real scanned or photographed POEM (as opposed to a text PDF) was
  available to exercise the `no staves -> OCR -> poem` branch end to end;
  the branch is covered by the pure-function tests but not by a real file.
- This ship was not walked in a running browser. `pnpm --filter @ilya/web
  dev` was not started this session; every check above is a gate, not a
  drop. The five gates and the corpus measurement are real; a singer's own
  eyes on the running app are not yet.
- Whether a picture's OCR result, run automatically now rather than behind a
  press, ever meaningfully differs from the same OCR run on the singer's
  press (timing, browser state) is NOT ESTABLISHED; nothing about the OCR
  call itself changed, so no difference is expected, but it was not measured.

## Decisions this brief did not settle, marked as mine and reversible

- **What "yields no sung line" means.** The brief states the rule but not the
  test. I read it as: the score attempt did not resolve `ok`, OR it resolved
  `ok` with a `readReport.notes` count of zero. This is the ingest outcome's
  own existing field, requires no new plumbing, and matches the plain
  reading of "no sung line" as "no notes were read for anyone to sing" --
  but a legitimate wordless/instrumental page (an introduction with no vocal
  line at all) would also read this way and fall through to being OCR'd as a
  poem instead of shown as a (silent) score. I judged this an acceptable,
  rare cost against the alternative of inventing a stricter "does this
  specifically carry lyric syllables" check the brief never asked for.
  Reversible: `handleFile`'s new `onNoSungLine` gate
  (`outcome.ingested.readReport?.notes ?? 0 > 0`) is the one line to change.
- **The "both fail" message.** Rather than coin anything, both cascades
  (no-staves, and staves-found-then-failed) end at the SAME existing message,
  the picture's own "No text recognised in image." / "OCR processing
  failed.", because by the time OCR has run the page IS being read as a
  picture regardless of what it started as. `upload.err.pageReadFailed` was
  the other existing candidate considered and set aside, because its wording
  ("Reading photographs is new...") narrates a fault in the READER rather
  than the plain fact that neither reading found any text.
- **Rasterizing the first page three times over, for a PDF or a picture that
  turns out to be a score with staves.** Once for the staff check
  (`take()`), once for the clef-and-key probe (`probeFile`, pre-existing),
  once for the real read (`readPages`, pre-existing). This follows the
  codebase's own stated precedent (`probeFile`'s comment: "that cost is
  named rather than traded for a cache") rather than threading the ink
  through three call sites with different signatures. Reversible by whoever
  measures that this now costs enough to be worth a cache.
- **A PDF's OCR fallback reads only its first page.** `extractPdfText`
  already reads every page for the text-layer path; a multi-page SCANNED
  poem PDF with no text layer would only have its first page read by OCR.
  This matches the existing precedent (`probeFile` reads only page 1 too)
  rather than introducing a new multi-page OCR loop this brief did not ask
  for.
