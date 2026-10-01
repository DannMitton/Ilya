# Memo: A17, the optimization pass, perceive phase. Overnight agent A17, 2026-10-01

Item A17: "Optimization pass: the perceive phase only; report before anything changes."
Dann's proposal of 2026-08-24: perceive, confer with Dann, then execute. This is the
perceive. Nothing in the tree changed. Every number below is either read from a file
in this run (sizes, measured with `stat` and `gzip -6` on `apps/web/build`, built
2026-10-01 02:31 against HEAD `740dfe7`) or cited from a dated report. Wire sizes
over Vercel are NOT ESTABLISHED: the local gzip ratio is the only bound I have.

Verdict for the item: **NEEDS DANN** on the ranked list in §2, plus **one BRIEF**,
`brief-code-n166-where-the-minute-goes_r1_2026-10-01.md`, which measures and changes
nothing, so that the conference on finding 1 has a cost breakdown in front of it.

## 1. How the singer's time is spent, in one view

| Moment | What the singer feels | Measured or cited | Source |
|---|---|---|---|
| Reload of a song made from a PDF or photo | « Préparation du lecteur de page » for about a minute before the score appears | 3.8 s to 61.3 s for a one-page PDF; 97.2 s for a 23-page PDF on first read | `STATE.md` N.166; `brief-reader-note-replaces-the-only-once-promise_r1_2026-09-22.md:27` |
| First visit | "Loading dictionary…", Text field disabled | 171 MB of JSON on disk, about 12.5 MB after gzip -6; time on a real network NOT ESTABLISHED | `apps/web/build/data/` |
| Every later visit | "Loading dictionary…" | about 1.6 s on a warm desktop origin; phone NOT ESTABLISHED | `ENVIRONMENT.md` §HOLD THE DICTIONARY OPEN |
| First visit | blank until the app's script lands | about 317 KB gzipped of JavaScript on the first-load path, 849 KB raw in one chunk | `apps/web/build/_app/immutable/chunks/jemNBDkc.js` |
| Typing a poem | nothing felt | pipeline 4.9 ms for 97 notes, 22.4 ms at ten times that, after a 600 ms pause | `memo-n160-the-work-and-its-views_r1_2026-09-21.md:228`; `+page.svelte:2305-2312` |
| Flipping a Markup switch | nothing felt on desktop | 8 to 30 ms click to painted frame; phone NOT ESTABLISHED | same memo, §4.4 |

## 2. Findings, ranked by what the singer feels

### Finding 1. A stored scan re-reads the page on every reload (N.166). Rank 1.

**What the singer feels.** They open Ilya, pick a song they made from a PDF or a
photograph, and wait about a minute watching « Préparation du lecteur de page » before
the score they already had draws. Dann's 23-page PDF is estimated at its full 97 s
each time (an extrapolation, `OWED.md:321-323`).

**Cause.** `apps/web/src/lib/score/ScoreUploader.svelte:779-785`: `onMount` builds a
`File` from `restore.bytes` and calls `handleFile(file, restore.answers)`. `handleFile`
at `:552-553` sees `storedAnswers` and calls `getPageReader()`, then at `:569-579`
hands the bytes to `ingestScoreFile` with `readPages`, so the Pyodide worker boots and
the page is read from ink again. Nothing of the previous read is kept: `readPages`
(`:628-676`) stores the PDF byte for byte or the greyscale PNG, by design (`:646-649`).

**Size or time.** 61.3 s measured by Code for a one-page PDF after reload (cited
above). **The breakdown is NOT ESTABLISHED and the parts do not add up:** the worker
warm-up was measured at 3.36 s and `envelope.run` at 1.96 to 2.36 s per page
(`ENVIRONMENT.md` §THE PAGE READER, N.59), which leaves about 55 s unaccounted for.
Candidates I can name but not weigh: a cold CDN fetch of Pyodide plus numpy,
opencv-python, and matplotlib's thirteen dependencies from `cdn.jsdelivr.net`
(`page-reader.worker.ts:92-94`), which the service worker never caches (`build/sw.js`
has no rule for it, so only the HTTP cache helps); pdf.js rasterizing at 400 dpi
(`page-pdf.ts:52`), roughly 3400 x 4400 px per page (`page-pdf.ts:18`); the JBIG2
decoder, which on this build runs as the `jbig2_nowasm_fallback.js` path if the WASM
fetch fails (`page-pdf.ts:138-141` names that failure mode).

**Likely remedy.** Two shapes, and the choice is Dann's because it touches invariant 9
("store what the singer said, never what Ilya derived") and his own precedent at
`ScoreUploader.svelte:646-649` ("storing the conversion would freeze the song at
today's rasterizer").

- (a) **A versioned derived cache.** Keep the reader's output (the recognized score
  the ingest seam already receives) beside the ink, keyed by the ink's hash, the
  singer's answers, and a reader version string. On restore, a key match skips the
  reader; a mismatch (new reader, new answers) re-reads and rewrites. This does not
  freeze the song: a reader change invalidates the cache on the next open. It does
  store something Ilya derived, which is why it needs a ruling. Cost: medium, one to
  two Code passes, with a migration-free schema (an optional field on the song record).
- (b) **Hide the wait rather than remove it.** Start the page reader's warm-up at boot
  when the library's active song is scan-derived, in parallel with the dictionary
  load, and draw the Text document while the score is still being read. Cost: small to
  medium. Gain: at most the 3.4 s warm-up unless the missing 55 s turns out to be
  CDN time, which the brief measures.

**Recommendation.** Rule (a) in principle as a *cache*, not a *store*, consistent with
invariant 9's purpose, and run the measurement brief first so the second pass knows
whether (b) is also worth having.

**The one question for Dann.** May a song record hold a versioned cache of the
reader's output, invalidated whenever the reader, the ink, or the answers change, so
that opening a stored scan costs a second instead of a minute?

### Finding 2. The dictionary is re-parsed from text on every visit. Rank 2.

**What the singer feels.** "Loading dictionary…" and a disabled Text field on every
open, about 1.6 s on a warm desktop (cited), and NOT ESTABLISHED on a phone, where the
loader's own comments say the long-running-script kill was once a crash
(`loader.ts:5-7`).

**Cause.** `loader.ts:717-754` reads the cached NDJSON back from IndexedDB as text,
about 630 chunk transactions of 1,500 lines each (`:68`, `:196-206`), splits it, then
`mergeNDJSON` (`:384-408`) calls `JSON.parse` once per line: 943,104 lines across the
two core shards (471,552 in shard a, measured; shard b is the same size class), on the
main thread, yielding every 1,500 entries. The gloss tier then does it again in the
background for 389,812 more lines per shard (`:425-487`), also on the main thread, while
the singer may be typing. The parsed object is built from scratch each visit; nothing
structured is cached.

**Size.** On disk: core shards 47.5 MB + 48.9 MB, gloss shards 36.9 MB + 38.0 MB,
homographs 2.0 MB. gzip -6 of shard a: 3.18 MB (15 to 1); gloss shard a: 2.99 MB.
Whether Vercel serves them compressed is NOT ESTABLISHED from here; `vercel.json` sets
no header for `/data/`. The service worker deliberately does not intercept
`dictionary.*.json` (`build/sw.js`, "Never intercept dictionary files").

**Likely remedy, in order of gain per cost.**
- (a) **Move the parse off the main thread** into a Worker that posts the finished
  object back (structured clone of a ~1M-key object is itself a cost, NOT MEASURED).
  Small to medium; no taste.
- (b) **Cache the parsed structure, not the text.** IndexedDB can store the parsed
  object (or per-chunk arrays of parsed entries) so a later visit skips 943k
  `JSON.parse` calls. Medium; needs a cache-format version so an old cache is
  discarded. No taste.
- (c) **Load only what the Text document needs first**: stress and part of speech,
  which is the `s`/`p`/`l` part of each entry, and defer short glosses with the full
  ones. Medium; changes the build script in `packages/dictionary`.
- (d) **Confirm compression on the wire** and, if absent, add a `Content-Encoding`
  or pre-compressed variant for `/data/`. Small; measurement first.

**Recommendation.** (d) is a measurement and belongs with the N.166 brief's method,
not its scope. (a) and (b) are reversible and taste-free, but the loader has a history
of iOS heap trouble (`loader.ts:1-20`), so I did not write a brief: a loader change
needs a phone measurement first, which is NOT ESTABLISHED and cannot be made from here.

**Question for Dann.** Is the dictionary wait something singers have remarked on, or is
it the reader's minute that they feel? That decides whether this is item 2 or item 5.

### Finding 3. Matplotlib ships with the page reader for one function. Rank 3.

**What the singer feels.** A longer first « Préparation du lecteur de page » and more
to download on a phone.

**Cause.** `page-reader.worker.ts:94` loads `['numpy', 'opencv-python', 'matplotlib']`.
The Python modules use matplotlib only for `matplotlib.path.Path`
(`build/reader/rest_templates.py:71`, `build/reader/timesig.py:44`), a point-in-path
containment test with nonzero winding (`rest_templates.py:51`).

**Measured.** Warm-up 2.46 s with numpy + opencv alone, 3.67 s with matplotlib
(`ENVIRONMENT.md` §THE PAGE READER): 1.2 s, and thirteen extra packages
(Pillow, fonttools, kiwisolver, and friends) on the first download.

**Likely remedy.** Replace the containment test with `cv2.pointPolygonTest` or a numpy
nonzero-winding test over the already-flattened vertices. Cost: small to medium.
**Risk, and why no brief:** the reader is pinned because version drift changed a
reading (37 noteheads against 36, `page-reader.worker.ts:11-13`), and a containment
test with a different edge rule could move a rest or a time signature. It needs the
harness fixtures in `tools/e16-harness/` run before and after, which is a gate I did
not run. Taste-free, but not small enough to brief blind.

### Finding 4. One 849 KB script carries the whole app. Rank 4.

**What the singer feels.** A longer blank on the first visit, mostly on a phone.

**Cause.** `build/_app/immutable/nodes/2.D67EgczE.js` imports a single chunk,
`chunks/jemNBDkc.js`, 849,229 bytes (269,871 gzipped), which holds Text, Markup,
Insights, the loupe, and the calibration wizard together (it contains `Tessituragram`
and `i18n`). The whole first-load path is about 317 KB gzipped of JavaScript plus
21 KB of CSS. The heavy readers are already lazy: pdf.js (`ScoreUploader.svelte:636`),
tesseract (`:442`), denigma and webmscore (`:550-551`), Pyodide (worker).

**Size.** As above. Parse and compile time on a phone NOT ESTABLISHED.

**Likely remedy.** Dynamic `import()` of `MarkupPane`, `InsightsPane`, `Loupe`, and
`CalibrationWizard` from `+page.svelte` so a singer who opens Text pays for Text.
Cost: small to medium; no taste; but `wall.ts` already gates Markup and Insights at
build time, and splitting them interacts with it. Memo only.

### Finding 5. Markup and Insights each run the same analysis. Rank 5.

**What the singer feels.** Nothing measurable today: a Markup switch flip paints in
8 to 30 ms on desktop (cited).

**Cause.** `MarkupPane.svelte:695` and `InsightsPane.svelte:156` each compute
`resolveAdvice(analyzeScore(analysisScore, adapted.snapshot, vowelResolver))` from the
same inputs, and each builds its own `readingScore`, `performanceOrder`, and
`vowelResolver` chain (`MarkupPane.svelte:517-582`, `InsightsPane.svelte:139-156`).

**Likely remedy.** Lift the shared chain into one module in `analysis/` that both
panes read. Cost: small to medium; invariant 13 allows it (`analysis` sits before
`markup` and `insights`). Worth doing for shape, not for speed, so it is not an
optimization item and I rank it last.

### Not findings

- **Transcription on a keystroke pause** is already right: a 600 ms quiet timer
  (`+page.svelte:2305-2312`), the pipeline at 4.9 ms for the largest real score. Leave it.
- **The loupe** measures ink with canvas `measureText` and `getBBox`
  (`Loupe.svelte:307-318, 349-472`) and re-lays out on a `ResizeObserver`
  (`:531-534`). I found no per-frame loop. Its cost on a phone is NOT ESTABLISHED and
  no report measures it.

## 3. Verdicts

- Finding 1, N.166: **BRIEF** (measurement only), `brief-code-n166-where-the-minute-goes_r1_2026-10-01.md`, and **NEEDS DANN** on the versioned cache, one question in §2.
- Findings 2 to 5: **NEEDS DANN** to pick which, if any, proceed to a brief; my ranking is the recommendation.

## 4. What I could not establish

- Where 55 of N.166's 61 s go. The brief measures it.
- Any time on a phone: dictionary load, first-load parse, the loupe, Markup paint.
- Whether `/data/*.json` leaves Vercel compressed.
- Shard b's line count (not counted; same size class as shard a).
- Whether anything stored on a singer's device would need a migration for remedy 1(a); I read the restore path, not `library/`.
