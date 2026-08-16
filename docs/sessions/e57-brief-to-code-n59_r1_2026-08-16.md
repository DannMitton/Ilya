# BRIEF: N.59, the page reader stands up in the browser

For a fresh Claude Code session pointed at `~/Desktop/ilya-rewrite`. Written by
Fable, 2026-08-16, after reading the modules and the app on Dann's machine. Every
claim below carries a `path:line`, a run, or NOT ESTABLISHED. Where a ruling is
mine I say so and give the grounds. Line numbers were verified tonight unless
marked otherwise.

---

## 0. What you are building

Ilya today accepts MNX, MusicXML, `.mxl`, `.musx`, and `.mscz`. PDF, image, and
MIDI are in the picker (`apps/web/src/lib/shane/ScoreUploader.svelte:58`) and then
refused as "coming soon" (`ScoreUploader.svelte:239-243`, copy at
`apps/web/src/lib/i18n.ts:273-275`). N.59 makes PDF and image real by running the
existing eleven-module Python page reader (`tools/e16-harness/reader/`, 3,871
lines) in the browser under Pyodide. MIDI stays "coming soon"; N.58 is displaced,
do not touch it.

Product law you may not reopen:

- Transcribe owns every text operation; Fit owns every notation operation; verse 1 only.
- Fit reads ONE line, never the harmony.
- The notes never move; the syllables slide along them. The pairing is a
  correction layer keyed by event id and never writes to `ParsedScore`.
- Drawer manipulates; page displays and prints.
- No mark on the page saying Ilya is unsure. Struck in E.47, settled.
- Desktop keeps WYSIWYG; portrait mobile does not; print renders the paper.

Measured foundation (E.43, 12 August 2026): the reader runs unmodified in Chrome
under Pyodide; 2.9 s to load pyodide + numpy + opencv-python from CDN, 0.867 s to
read one 300 dpi page. Pyodide carries cv2 4.9.0 / numpy 1.26.4; a container at
cv2 4.13.0 / numpy 2.4.4 read 37 noteheads against 36 on the same page. Version
drift changes the answer, so every version below is pinned. The working spike is
`~/Downloads/ilya-reader-spike.html` (183,944 bytes); it pins Pyodide v0.26.4 from
`cdn.jsdelivr.net/pyodide/v0.26.4/full/` (read tonight from the file). Its
companion page is `~/Downloads/ilya-test-page.png` (PNG, 2480 x 2883, RGB; run
tonight with `file`). Read the spike before writing the worker; it is the measured
artifact, and its `loadPackage` list and FS layout are the ones known to work.

---

## 1. The rulings (Fable, 2026-08-16)

### Ruling A. Clef, key, and octave are the singer's answers, given in the drawer before the read. Piece id and measures-per-system are derived.

The reader detects none of these. `ro`'s clef and key are passed through from
config (`run_page2.py:215-216`), `pieceId` is read from a ground-truth file
(`run_page2.py:214`), and `measures_per_system` is a config list consumed at
`run_page2.py:168` and `envelope.py:103`. In a browser none of these exist.

- **Clef, key signature, octave change: ask the singer, in the uploader, when a
  picture arrives, before reading.** Grounds: E.43 measured the cost of wrong
  values at 38% against 73%, correcting only the configuration. Detection would be
  new CV work the reader does not do, with no measured floor. The values are
  singer-legible off their own paper: a singer can count seven sharps and knows
  whether they read treble, treble sounding an octave lower, or bass. The drawer
  manipulates, so the control is lawful there. Offer defaults: treble, zero sharps
  or flats, no octave change; the tenor octave clef is one tap away. I weighed the
  do-nothing option (silent defaults plus later correction) and it fails on the
  measurement; the E.43 ground truth for the test page itself is G2 with
  octaveChange -1 and seven sharps. Detection-as-prefill is later work; assign it
  no number now.
- **pieceId: derive it** from the file name stem plus a short content hash.
  Grounds: the retention ruling already records "the original's name and hash".
  Change `run_page2.py:214-215` to prefer `cfg['pieceId']` when present, falling
  back to the `gt` file so the harness is untouched.
- **measures_per_system: derive it from the reader's own detected barlines** when
  `cfg` omits it: `mps[i] = len(bl.get(i, [])) + 1`. The barline result `bl` is
  already in scope immediately above both consumption sites (`run_page2.py:168`,
  `envelope.py:103`; read tonight). The harness keeps supplying it explicitly, so
  fixtures are unchanged.

### Ruling B. Neither shell-out is replaced. Both Leipzig caches ship as pinned JSON, and metre ships with them.

Two modules shell out to Node and Verovio: `rest_templates.py` (`load_font` at
`:118`, cache at `~/.cache/rest_templates_leipzig.json`, `:74`) and `timesig.py`
(its own `load_font` at `:118`, cache at `~/.cache/timesig_templates_leipzig.json`,
`:47`). I read both `load_font`s tonight: **on a cache hit each returns the parsed
JSON before any subprocess is reached.** So the browser never needs Node, Verovio
WASM, or OpenCV.js; it needs the two JSON files sitting where `os.path.expanduser`
resolves inside Pyodide, which is `/home/pyodide/.cache/`. The spike already does
this (it references the leipzig cache by name; read tonight).

Generate the caches once on Dann's machine: Verovio is present at
`tools/e16-harness/node_modules/verovio` (run tonight, `ls`). The hardcoded
`VEROVIO_DIR = "/home/claude/e16/node_modules/verovio"` (`rest_templates.py:73`)
is a known wart; a scratch generation script monkeypatches
`rest_templates.VEROVIO_DIR` and `timesig.VEROVIO_DIR` (both are module globals
read at call time; read tonight) and calls each `load_font(force=True)`. Commit
the two JSONs at `tools/e16-harness/reader/fonts/` as the source of truth.

**Metre ships.** With the timesig cache a fetch, the twin liability costs nothing,
and Ruling C needs it: MusicXML is measure-structured, so the converter wants
`measures[]` (metre, measureDuration, classification, added additively at
`envelope.py`, `ro['measures']`) to emit `<time>` and well-formed measures. Product
consequence, stated plainly: a photographed page gets time signatures and measure
structure of the same kind the harness produces; where metre abstains, the measure
is emitted without a `<time>` element, which is valid MusicXML, and the abstention
is counted in the drawer's read report (Ruling D).

The OpenCV.js rewrite stays what E.43 called it: an optimisation for later, not
the route.

### Ruling C. The reader's output becomes MusicXML text and enters the app through the existing ingest seam. Nothing new touches `ParsedScore`.

`ingestScoreFile` is an injected-converter seam built for exactly this
(`apps/web/src/lib/shane/ingestion/ingest.ts:91-109`, entry at `:111`). `.mscz`
already arrives as MusicXML text out of a WASM converter, so the shape is
precedented. Therefore:

`envelope.run` per page, ctx-chained -> merged `ro` -> a new pure TypeScript
converter `recognized-to-musicxml` -> MusicXML string -> the existing
`MusicXmlScoreParser` route -> `ParsedScore`, exactly where every other score
joins. Add a provenance arm to the union at `ingest.ts:46-54`:
`{ format: 'musicxml'; via: 'reader'; sourceFormat: 'pdf' | 'image' }`, and extend
`fidelityBanner` (`ingest.ts:58`, whose own comment anticipates the OMR tier) so
the reader tier banners like denigma does.

A reader score arrives with no lyrics. That path exists end to end: the parser
warns `no-lyrics-found` and uses the first part as the vocal line
(`packages/score-parser/src/musicxml-parser.ts:335`), the app banners it
(`apps/web/src/routes/+page.svelte:819`, copy at `i18n.ts:511`), and the singer's
text then comes from Transcribe with syllables pairing onto the read notes. The
pairing law is untouched because the join happens upstream of `ParsedScore`, not
beside it. `ro` is never stored as a parallel score format inside Ilya; MusicXML
is the join.

### Ruling D. The page shows ordinary notation. The drawer carries the read report. Substitutions are counted, never marked.

The read will be imperfect. The E.47 strike stands: no uncertainty mark on the
page, because a mark on everything says nothing and a wrong note shown plainly is
something a singer can see and hear against their own paper. So:

- **Pitch abstention.** `run_page2` nulls `midi` when the accidental engine
  abstains, and its comment rules "never emit a midi computed with an assumed
  natural" (`run_page2.py:150-158`, read tonight). That ruling governs `ro` and
  stands. Add one additive field: when pitch abstains, carry the pre-nulling
  geometric value as `midiAssumedNatural` (the value exists as `r['midi']` before
  the nulling; read tonight). The converter, one layer down, engraves that natural,
  and the drawer report declares the count. Grounds for engraving rather than
  dropping: a dropped event silently shifts every later syllable one note left,
  corrupting the pairing invisibly; a natural shown plainly is a visible,
  checkable error, the same logic that struck the mark.
- **Duration abstention** (`duration: null`, onset chain lost for the rest of the
  measure): the converter emits a quarter note for the abstained event and each
  onset-lost follower, and the report names the measure. There is no honest
  recoverable value here; a visible wrong rhythm in a named measure beats an
  invented policy that pretends to know.
- **The read report** renders in the uploader (drawer surface) on completion:
  systems and staves found, staff-space `s`, note count, rest count, measure count,
  and per-measure counts of each substitution where nonzero. New i18n strings,
  English and French, matching the table's style.

### Ruling E. Build order is Section 3. Two increments: images first with no new dependency, PDF second behind Dann's approval of `pdfjs-dist`.

Also ruled here, with grounds:

- **Pyodide v0.26.4, pinned, from the jsdelivr CDN URL the spike uses.** It is the
  measured configuration carrying cv2 4.9.0 / numpy 1.26.4, and E.43 proved drift
  changes the answer. A CDN pin adds no lockfile change. Self-hosting is a later
  optimisation; note that `apps/web/static/sw.js` exists, and whether the service
  worker interferes with CDN fetches is NOT ESTABLISHED, so verify in the browser.
- **The engine is a lazy Worker** mirroring the two existing converter lifecycles
  that `ScoreUploader` owns (section B.2 header comment,
  `ScoreUploader.svelte:8-18`): constructed on the first real picture, per the N.26
  law that a drop of one kind never pays for another's warm-up.
- **The brace rule replaces `select_vocal`.** It is the only algorithmic
  staff-selection site in the tree (`reader.py:269-278`) with one call site
  (`reader.py:400`); the `cfg['vocal']` bypass stays. Dann's rule is house
  authority: in a three-stave system joined at the left by the system barline, the
  bottom two are braced as the Grand Staff, and the staff NOT in the brace is the
  voice. Compute a **per-system left edge**; E.43 established that one page-wide
  edge misses the indented first system. Degenerate cases, ruled simply: a
  one-staff system's staff is the voice; if exactly one staff in a system is
  unbraced, it is the voice; if no brace is found or all staves are braced, take
  staff 0 of the system and count the fallback in the read report.
- **Working resolution and retention, reconciled.** The reader's one measured
  working point is s = 17.00 px (the 300 dpi Kabalevsky page, E.43). The ratified
  retention ruling stores a picture "as its ink, in greyscale at no less than the
  reader's working resolution with margin", floor s at least 20 px, retained near
  28 to 30, never binarized. The floor exceeds the measured point, so every stored
  page carries at least what the reader is proven on. Therefore: photographs are
  greyscaled and stored as captured, `s` measured after staff detection and
  recorded in the read report; PDFs (increment 2) rasterize at 400 dpi, which
  scales this repertoire's s of about 17 to about 23, above the floor. The read
  runs on the same greyscale that is stored, so a re-read reproduces. Accuracy at
  s other than 17 is NOT ESTABLISHED; the scale-robustness fixture
  `tools/e16-harness/b3-ledger-lines-scale/` exists and its browser run is one of
  your proofs.
- **Persistence.** Restore re-reads the stored ink through the existing restore
  seam (`ScoreUploader.svelte`, the N.67 step 2 `onMount` block); the recognized
  result is not cached in v1. The singer's clef, key, and octave answers persist
  with the stored source as an additive field, because re-asking on every reload is
  the tool forgetting, the same principle the restore comment already states. This
  touches the N.67 vault schema additively; keep it to one field.

---

## 2. Inventory you will need (all verified tonight unless noted)

- Reader: `tools/e16-harness/reader/`, eleven modules. Entry point
  `envelope.run(cfg, ctx_in)` (`envelope.py:69`) returning
  `(ro, ctx_out, msum, G, rests, events)`; `run_page2` is a load-bearing dependency
  (`envelope.py:31`, `:87` per E.57), not a throwaway. `ro` shape:
  `run_page2.py:215-217` plus additive `measures` (`envelope.py:262` per E.57).
  Cross-page numbering: `ctx_out.measureIndexOffset`, with the id remap sitting
  directly above `envelope.py:103`.
- `cfg` surface consumed in the browser path: `png` (page image path in the Pyodide
  FS, read via `cv2.imread` at `reader.py:398` region), `clef`, `key`,
  `octaveChange`, optional `vocal`, `pieceId` (new), `measures_per_system` (now
  defaulted), `page`.
- Ingest seam: `ingest.ts` as cited in Ruling C. Format detection already
  classifies `midi`, `pdf`, `image` by bytes (`format-detection.ts:180-182`),
  including iPhone HEIC brands (`:98-100`).
- Fixtures with ground truth: `tools/e16-harness/output/mussorgsky---sunless-*/`
  (300 dpi PNGs plus `ground-truth.json`; piece 06 is the Piano-first
  counter-example, `ground-truth.json` carries `vocalPart` and
  `octaveChange: -1`). Ledger and scale fixtures at
  `tools/e16-harness/b1-ledger-lines/`, `b2-tuplets/`, `b3-ledger-lines-scale/`.
- `tools/e16-harness/src/normalized-format.ts` is a hand-written mirror of `ro` by
  naming convention only; there is no e16 adapter in the harness runner (E.57). Do
  not treat it as a wire format; it also declares `tempoBpm` and `syllableText` the
  Python never populates.
- The app already depends on `tesseract.js` and `webmscore`
  (`apps/web/package.json:24-25`). Neither is used by N.59; add nothing to that
  list in increment 1.

---

## 3. Build order, each step with its observable proof

Work increment 1 first; it needs no new dependency and no approval.

**Step 1. Generate and commit the two Leipzig caches.**
Scratch script OUTSIDE the repository (e.g. `~/tmp/n59/`). If
`python3 -c "import cv2, numpy, matplotlib"` fails on this machine (NOT ESTABLISHED
that it succeeds), create a venv under `~/tmp` and pip install there; nothing
touches the repo's lockfile. Monkeypatch both `VEROVIO_DIR`s to
`<repo>/tools/e16-harness/node_modules/verovio`, call both `load_font(force=True)`,
copy the resulting JSONs from `~/.cache/` to `tools/e16-harness/reader/fonts/`.
*Proof:* both files exist; the rest cache enumerates six rest glyphs and the
timesig cache eleven glyphs (digits 0 to 9 plus the plus sign, `timesig.py:51-60`
region); a fresh Python process with the caches in place returns from each
`load_font()` with Node renamed out of PATH.

**Step 2. The Pyodide worker and a wired harness.**
A package script copies the eleven modules and the two cache JSONs into
`apps/web/static/reader/` at dev and build; add `apps/web/static/reader/` to
`.gitignore` so generated copies never block the ship. The worker (mirror
`WorkerScoreReader`'s lifecycle shape): load Pyodide v0.26.4 from the pinned CDN
URL, `loadPackage` per the spike's exact list (verify against
`~/Downloads/ilya-reader-spike.html`; it references matplotlib, which
`rest_templates.py` and `timesig.py` import at module top), write modules under
`/home/pyodide/`, caches under `/home/pyodide/.cache/`, page bytes as greyscale
PNG, then a Python driver that builds `cfg` and calls `envelope.run` per page,
threading `ctx`.
*Proof (browser, Playwright):* scratch scripts outside the repo, Playwright
imported by absolute path from `node_modules/.pnpm/`; against the dev server, run
`~/Downloads/ilya-test-page.png` through the worker and report staves = 12,
s = 17.00, load and per-page read times against E.43's 2.9 s and 0.867 s.

**Step 3. The brace-rule selector.**
Replace `select_vocal` (`reader.py:269-278`) per Ruling E, per-system left edge
included. The `cfg['vocal']` bypass at `reader.py:400` is untouched.
*Proof:* (a) on the test page, selection is staff 0 of each of the four systems,
that is `[0, 3, 6, 9]`, where the old heuristic returned `[0, 1, 4, 7, 10]` (E.43);
(b) on the Mussorgsky fixtures, the derived selection equals each fixture's
explicitly configured vocal staff, piece 06's Piano-first order included (locate
the harness run configs beside `output/`; only `ground-truth.json` was confirmed
tonight); (c) any fixture run with `cfg['vocal']` supplied is byte-identical to
before.

**Step 4. Module deltas for the browser `cfg`.**
Three small changes, from Rulings A and D: `pieceId` preference at
`run_page2.py:214-215`; `measures_per_system` default from `bl` at
`run_page2.py:168` and `envelope.py:103`; additive `midiAssumedNatural` in the
events loop (`run_page2.py:150-158` region).
*Proof:* one full-config fixture run before and after; `ro` byte-identical except
that abstained notes may carry the one additive key; state which fixtures had zero
abstentions.

**Step 5. `recognized-to-musicxml`.**
Pure TypeScript, `apps/web/src/lib/shane/ingestion/recognized-to-musicxml.ts`.
Inputs: merged `ro` plus the singer's clef, key, and octave. Output: MusicXML with
one part, the singer's clef (including `<clef-octave-change>`), key from fifths,
`<time>` from confident metre, divisions from the LCM of duration denominators,
pitch spelling from fifths, and Ruling D's substitution policies. Nothing testable
in a `.svelte.ts`; runes are inert under this vitest suite.
*Proof (vitest):* a hand-built `ro` fixture and one captured from the Step 2
browser run (committed as a test fixture file) both convert, and
`MusicXmlScoreParser` returns ok with exactly the `no-lyrics-found` warning
(`musicxml-parser.ts:335`). Report new test counts.

**Step 6. Ingest route, the two questions, and the read report.**
Route `image` (and in increment 2, `pdf`) from `format-detection.ts:180-182` into
the reader engine instead of the `soon` branch; `midi` keeps its note
(`ScoreUploader.svelte:243`, `i18n.ts:275`). The clef and key form appears in the
uploader when a picture arrives, before the read, defaults per Ruling A. Read
report per Ruling D. Provenance `via: 'reader'`, fidelity banner tier, format
label, i18n strings in English and French. HEIC: attempt `createImageBitmap`; on
failure, a typed error asking for JPEG or PNG (Chromium does not decode HEIC;
whether iOS transcodes on upload is NOT ESTABLISHED).
*Proof (Playwright, end to end, real clicks; a dispatched click is a finding, not a
workaround):* feed `~/Downloads/ilya-test-page.png` through the picker, answer
treble sounding an octave lower and seven sharps (the E.43 ground truth for this
page), continue to analysis; the paper shows engraved notes, the no-lyrics banner
shows, pasted text pairs syllables onto read notes. Report the note count against
E.43's 36.

**Step 7. Persistence.**
Per Ruling E: store greyscale ink under the retention ruling (never binarize,
record name and hash, floor s at least 20), persist the singer's answers
additively, restore by re-read. `$state.snapshot()` before every IndexedDB write or
the write throws `DataCloneError`.
*Proof:* reload; the song returns with the same read and no re-asking of the two
questions.

**Step 8 (increment 2, only after Dann approves `pdfjs-dist`).**
Rasterize PDFs at 400 dpi, one page at a time, ctx-chained through `envelope.run`
so measure numbering is global. A true vector-PDF fixture is NOT ESTABLISHED on
this machine; prove the plumbing with a generated PDF and have Dann supply a real
one at the walk.

**Step 9. Gates, stated before any ship.**
Run all five gates on this machine and report the numbers: phonology (baseline
216), dictionary (235), web-check (0 errors, 7 warnings, 4 files), web-test (537),
score-parser (444 passed, 5 skipped). The baseline lives at
`~/Downloads/ilya-ship.sh:79` and moves only with Dann's explicit permission; state
every new number BEFORE he ships, never after. List every new file explicitly,
because the ship script refuses untracked files and Dann must `git add` each one:
`tools/e16-harness/reader/fonts/*.json` (2), the worker and its owner module,
`recognized-to-musicxml.ts`, test fixture files, and the `.gitignore` line.

Hard rules for you, Code: **never run `git`, not even status.** Keep every scratch
script outside the repository; `.claude/` is not gitignored, so a `launch.json`
would block the ship too. No lockfile operation without Dann's yes. Canadian
spelling, Oxford comma, no em-dashes, in code comments and copy alike. WRITTEN is
not DONE: every step's proof above is a browser observation or a run, and you
report the observation, not the intention.

---

## 4. To Dann (short)

1. **One approval: add `pdfjs-dist` so PDFs import.** Recommendation: yes. Cost of
   no: photographs work, PDFs stay "coming soon". Nothing else needs a decision;
   images ship without it.
2. When Code reports, you `git add` the listed new files and ship with
   `sh ~/Downloads/ilya-ship.sh "N.59: ..."`. If web-test or score-parser counts
   moved, Code will have stated the new numbers first; the baseline moves only on
   your say-so.
3. **Your walk:** drop `~/Downloads/ilya-test-page.png` into Ilya yourself, answer
   the two questions (treble sounding an octave lower, seven sharps), paste a line
   of text, and watch syllables sit under notes Ilya read off a picture. Then
   reload and watch it come back without asking again.

---

## 5. WHAT I COULD NOT ESTABLISH

- Whether the Leipzig caches already exist at `~/.cache/` on Dann's machine. The
  session's VM cannot see his real home directory; only the mounted folders. Step
  1's generation path was verified feasible instead (Verovio present in the
  harness's `node_modules`; both `load_font`s monkeypatchable).
- Whether `~/Downloads/ilya-test-page.png` (2480 x 2883) is pixel-identical to the
  page of E.43's measurements, which E.43 records as 2550 x 3300. It is the
  spike-era companion page; if its numbers differ from 12 staves and s = 17.00,
  that is a finding to report, not to paper over.
- Whether `python3` with cv2, numpy, and matplotlib exists on Dann's machine. Step
  1 carries the venv fallback; every other proof is a browser observation
  regardless.
- The exact `loadPackage` list the spike uses beyond `['numpy', 'opencv-python']`;
  it references matplotlib seven times, and the modules import `matplotlib.path` at
  top level, so verify against the spike before writing the worker.
- Where the harness's per-fixture run configs (the `cfg` carrying explicit `vocal`
  and `measures_per_system`) live. `ground-truth.json` was confirmed; the config
  files were not located tonight. Step 3(b) requires finding them.
- Reader accuracy at any staff spacing other than the single measured point
  s = 17.00, including the 400 dpi PDF raster (s of about 23). The
  `b3-ledger-lines-scale` fixture exists; its results were not read tonight.
- What fraction of notes abstain on real pages, and therefore how often Ruling D's
  substitutions will show.
- Whether the app's service worker (`apps/web/static/sw.js`) interferes with CDN
  Pyodide fetches.
- Whether iOS transcodes HEIC to JPEG on upload through the unfiltered picker
  (N.70 removed the `accept` filter on mobile, `ScoreUploader.svelte:63-85`).
- Carried from E.57, still open: the precise top-level exception shape of
  `envelope.run` (traced by reading, never triggered), and whether ground truth's
  `vocalPart` is cross-checked against `select_vocal` anywhere in the scoring path.

---
*Commissioned by the coordinating desk, E.57, 2026-08-16, on Dann's instruction.
Fable read the modules and the app on Dann's machine before ruling. The E.43
measurements and Dann's brace rule are quoted, not re-measured. The E.57 inventory
is cited where it is the source.*
