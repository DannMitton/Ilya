# N.97: clef and key reading, ask becomes confirm

**r1, 2026-08-24. Answers `docs/sessions/brief-n97-clef-key-read_r1_2026-08-24.md`.**

Read the section headed **The re-key does not reach the corrections** before you
ship. It reports a measured fact that contradicts the brief's premise for leg 3,
and it needs your ruling.

---

## What shipped

Nothing is committed. Three legs are written, gated, and walked in a browser on
`localhost:5173`; there is no commit per ship because this session ran git for
nothing. The files needing `git add` are listed under **New files**.

### Leg 1: read the glyphs, mask the ink

`tools/e16-harness/reader/clefkey.py` is new. It renders Leipzig outlines for
four clefs and three accidentals through Verovio, the same machinery
`rest_templates.py` and `timesig.py` already use, caches them as JSON, and
matches them against the staff-line-removed raster.

Two products, kept separate on purpose:

- `read_page_clef_key` returns what each system prints and a page-level
  majority. `reader.probe_clef_key` runs the staff detection and the line
  removal and stops there, so the intake prompt can ask about the page before
  the read.
- `clefkey.spans_from` gives the x range clef and key ink occupies per system.
  `reader.read_page_geometry` drops any notehead detection whose centre falls
  inside it.

`run_page2.run` emits the page's own reading as `ro['readClefKey']`, alongside
the caller's `clef` and `keySignature`, which are untouched. Nothing in the
reader consumes its own detection: `topD` is still built from `cfg`, so a read
with the same answers is what it always was.

### Leg 2: ask becomes confirm

The uploader probes the first page before the prompt appears and pre-selects the
two controls. The frame strings become `upload.confirm.title` and
`upload.confirm.why`; every other string in that block is `upload.ask.*`,
unchanged, and an abstention shows the old two word for word.

The rule that turns a glyph into a pre-selected option is
`apps/web/src/lib/shane/ingestion/clef-key-prompt.ts`, out of the component
because vitest never compiles a `.svelte` file.

The behavioural invariant holds by construction rather than by test: the probe
is a separate Worker call that returns two numbers, and the read still runs the
path it always ran with the two numbers the singer confirmed. Confirming
unchanged values and typing them by hand reach `run_page2.run` as the identical
`cfg`.

### Leg 3: re-key correction ids to measure and x

`run_page2.py` now builds `r{measureIndex}-{x}`, with a stable ordinal suffix
`r{mi}-{x}-2` on the second and later events sharing an x in one measure,
counted in the x-sorted order the loop already walks. `migrateCorrectionIds` in
`correction.ts` re-keys a stored map at load by stripping the two onset
segments, and `orphanIds` counts the corrections the current read no longer
carries. The drawer declares that count through `notation.orphans`.

---

## The re-key does not reach the corrections

**The id a correction is keyed by is not the id `run_page2.py` builds.** The
brief's second bullet under "What the tree says now" is wrong on this point, and
the whole of leg 3 rests on it.

Measured, in a browser, on the Lamm scan, by reading IndexedDB after making one
correction in the drawer:

```
ilya-library / songs / corrections
  { "m0-3-4": { "pitch": { "step": "G", "alter": 1, "octave": 4 } } }
```

`m0-3-4` is `m{measureIndex}-{onsetNumerator}-{onsetDenominator}`, built at
[musicxml-parser.ts:701](packages/score-parser/src/musicxml-parser.ts:701) and
at [mnx-parser.ts:899](packages/score-parser/src/mnx-parser.ts:899). The path is
reader → `recognized-to-musicxml.ts` → MusicXML → the score parser, and the
parser assigns its own ids from a running duration cursor. The reader's
`r{...}` ids are discarded at the MusicXML boundary and never reach
`VocalLineEvent`.

So the fragility the ruling names is real and still live, and it lives one layer
further out than the brief located it. The parser's cursor is a running sum of
durations within a measure, so removing an event renames every event after it in
that measure, exactly as the reader's onset did.

**What this ship does to your existing corrections.** Leg 1 removes ten
detections on Lamm page 1, in measures 0, 2, and 5. Every correction stored
against a later event in one of those measures is orphaned by this ship, because
its onset moved. The drawer now says so, and that is the whole reason the orphan
report earns its place today rather than later.

The ruled migration cannot rescue those. It re-keys a four-segment
`r{mi}-{num}-{den}-{x}` to `r{mi}-{x}`; a stored id is three-segment
`m{mi}-{num}-{den}`, which the migration correctly leaves alone. **On today's
stored data the migration is a no-op**, and I have said so rather than let its
passing tests imply otherwise.

**What I did not do, and why.** Moving the correction id to measure-and-x means
changing `musicxml-parser.ts`, which serves every source Ilya reads, not just
the page reader. That would re-key every stored correction and every stored
`PairingMap` entry for every MusicXML, MNX, Finale, and MuseScore song in your
library, with no syntactic migration available from `m{mi}-{num}-{den}` to any
x-bearing id, because x is not recoverable from a stored id. It is a bigger
change than the one you ruled and a different migration. It is yours to rule,
not mine to assume.

Two options, with their costs:

1. **Carry the reader's id through.** MusicXML allows an `id` attribute on
   `<note>`. `recognized-to-musicxml.ts` writes the reader's own
   `r{mi}-{x}` there, and the parser uses a supplied id where present and falls
   back to `m{mi}-{num}-{den}` where absent. Additive, byte-stable for every
   existing fixture, and scoped to the reader route alone. Cost: every existing
   correction on a page-read song orphans once, with no migration; the drawer
   counts them.
2. **Leave it.** Corrections on page reads stay fragile to any future change in
   the event population, and every such ship pays the same orphaning again.

I recommend option 1, once, in its own ship, with the orphan count already in
the drawer to make the cost visible on the walk.

---

## The gate lines

All five at their `docs/memory/ENVIRONMENT.md` baselines except gate 4, which
moved because this ship added tests.

| gate | baseline | this ship |
|---|---|---|
| web-test | 754 | **784 passed, 45 files** |
| score-parser | 444 passed, 5 skipped | 444 passed, 5 skipped |
| phonology | 216 | 216 |
| dictionary | 235 | 235 |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |

`pnpm --filter @ilya/web build` is clean; `stamp-sw` wrote
`CACHE_VERSION ilya-1787623775220`.

**Gate 4's baseline is a literal string at `ilya-ship.sh:79` and it must move
from 754 to 784 before you ship, or the script refuses.** Read `:79` first and
confirm the literal, then:

```bash
sed -i '' '79s/754/784/' ~/Downloads/ilya-ship.sh && chmod +x ~/Downloads/ilya-ship.sh
```

Re-read `:79` after running it. The thirty new tests are 13 in
`correction.test.ts`, 10 in `clef-key-prompt.test.ts`, and 7 in
`reader-ids.test.ts`.

### The 23 render fixtures

They read the same music and their event ids changed, which is what leg 3 was
ruled to do. `gate06_fixture_identity.py` gained a second digest, `runMusical`,
which is the whole `run_page2.run` return with the event ids and the additive
`readClefKey` block removed, so the gate can still tell a rename from a move.

| digest | before | after |
|---|---|---|
| `nl`, `barlines`, `msum`, note count, rest count, metre, `s`, staves, vocal | 23 pages | identical on 23 of 23 |
| `runMusical` (id-blind) | 23 pages | identical on 23 of 23 |
| `run` (id-bearing) | 23 pages | differs on 23 of 23, by the re-key alone |

Run with the mask live and the re-key not yet written, `run` itself was
identical on 23 of 23, so **the mask moves nothing on a render page**. Their
first printed note sits well past the key signature, and no detection falls in
the masked span.

---

## Byte counts

`apps/web/static/reader/` is generated by `scripts/copy-reader.mjs` and
gitignored; the tracked source is `tools/e16-harness/reader/`. The two carry the
same bytes, and `reader-ids.test.ts` now asserts that for `run_page2.py`.

| served file | before | after | delta |
|---|---|---|---|
| `clefkey.py` | not present | 33,367 | +33,367 |
| `.cache/clefkey_templates_leipzig.json` | not present | 5,927 | +5,927 |
| `reader.py` | 66,731 | 70,384 | +3,653 |
| `run_page2.py` | 31,146 | 33,381 | +2,235 |
| `manifest.json` | 270 | 322 | +52 |
| **total added to the served payload** | | | **+45,234** |

`apps/web/static/reader/` is now 284,808 bytes across 15 files. For scale, the
pdf.js WASM payload N.96 added is 1,545,323 bytes.

The template cache holds seven glyph outlines: gClef U+E050, gClef8vb U+E052,
fClef U+E062, cClef U+E05C, accidentalFlat U+E260, accidentalNatural U+E261, and
accidentalSharp U+E262, all from verovio 6.2.0-43f8060, Leipzig, at
`raw_units_per_space` 250.0, the same calibration the other two caches carry.

---

## The N.95 decomposition, before and after

Scan page 1, `raster400-1.png`, against `ground-truth.json` measures 0 to 8,
through `gate07_scan_page1.py`. **cv2 4.11.0 on this machine, both columns.**
Memo N.95's own figures were taken at cv2 4.13.0, where the same page reads 55
detections rather than 57, so its numbers are not comparable to these and are
not mixed into them.

| channel | before | after |
|---|---|---|
| detections, systems 0 / 1 / 2 | 13 / 21 / 23 = **57** | 11 / 17 / 19 = **47** |
| detections inside the clef and key span | 2 / 4 / 4 = **10** | 0 / 0 / 0 = **0** |
| ground-truth vocal notes | 12 / 18 / 18 = 48 | 48 |
| detections the alignment could not pair | 1 / 3 / 6 = **10** | 0 / 0 / 2 = **2** |
| notes matched | 12 / 18 / 17 = 47 | 11 / 17 / 17 = **45** |
| confident durations compared, exact | 27, **20** | 28, **20** |
| pitch compared, exact after the octave correction | 46, **37** | 44, **38** |
| duration abstentions | 29 of 57 (50.9%) | 19 of 47 (40.4%) |

**The two detections still unpaired are memo N.95's own unexplained pair**, at
system 2, x=929 and x=2400, the exact coordinates that memo listed under NOT
ESTABLISHED. Every other unpaired detection on the page is gone. Systems 0 and 1
now align with nothing left over at all.

**Read the matched row with its caveat, not on its own.** It falls from 47 to
45, and no true note was removed. The ten detections the mask dropped are these,
every one inside the span the clef and key read reported:

```
sys 0  span [524, 696]  margin 20.2 px   dropped x = 515, 560
sys 1  span [268, 444]  margin 20.2 px   dropped x = 254, 254, 304, 308
sys 2  span [266, 442]  margin 20.2 px   dropped x = 250, 300, 301, 306
```

The first surviving detection on each system is at x=1266, 544, and 540, so the
nearest one clears the masked region by 78 px, 2.6 staff spaces. Pixel-confirmed
by crop on all three systems: the clef and the two sharps end where the span
says they do, and the first printed notehead sits beyond it. What fell is the
Needleman-Wunsch alignment's own
tie-breaking, which memo N.95 already documented and hand-corrected for exactly
this reason: before the mask, the alignment paired two pieces of clef ink with
real ground-truth notes and orphaned a real note in exchange, x=544 in system 1.
After the mask it has nothing spurious to pair with, and systems 0 and 1 come
out clean.

The duration and pitch channels are unchanged in kind. Twenty confident
durations are still exact, out of 28 rather than 27 compared. Pitch goes from 37
of 46 to 38 of 44.

---

## What the clef and key read actually reads

Measured over the whole corpus: 23 render fixture pages, 29 vocal systems, plus
both Lamm scan pages, 6 systems. Every system in the table is one the reader
selected for itself.

| | systems | clef correct for the staff read | key signature correct | abstained |
|---|---|---|---|---|
| Lamm scan, pages 1 and 2 | 6 | 6 | 6 | 0 |
| 23 render fixture pages | 83 | 83 | 83 | 0 |
| **total** | **89** | **89** | **89** | **0** |

Eight of those 89 read an F clef where the fixture configuration says G. They
are not errors. `select_vocal` handed the reader a piano staff on those systems
(`vocalFallbacks` is non-zero on those pages, and the README already calls that
heuristic known-weak), and the staff it read genuinely prints a bass clef with
seven sharps. Pixel-confirmed by crop on sunless-06 page 2 system 3. The clef
read is correct for the staff it was given; what it exposes is which systems
`select_vocal` got wrong, which is a diagnostic nobody had before.

Two things that matter for the domain:

- **The 8 is detected on its own ink, never inferred.** gClef8vb contains the
  whole plain gClef, so the two templates score within 0.02 of each other and
  the argmax between them is a coin toss, measured rather than feared: on
  sunless-03 the 8-bearing glyph won by 0.004 on one system and lost by 0.007 on
  the next. The numeral is matched separately, and the two populations separate
  by a mile: 0.880 to 0.925 where an 8 is printed, 0.132 to 0.255 where it is
  not.
- **Sunless-06 proves a plain G clef does not establish sounding octave.** Its
  fixture configuration carries `octaveChange` -1 and its pages print a PLAIN G
  clef, no 8. A reader that inferred the octave from the glyph would be wrong on
  every system of it. The glyph is reported and the octave stays your answer.

### The constants, and where they came from

Every one is derived by the midpoint rule this codebase already uses for
`FLAG_AREA_MAX` and `ONE_MARGIN`, with both sides measured.

| constant | value | derivation | guards |
|---|---|---|---|
| `GLYPH_ROW_TOLERANCE` | 0.6 s | largest measured clef row deviation 0.167 s; structurally must stay under 1.0 s or a template slides onto the next line | 3.6x the measurement, 40% under the ceiling |
| `CLEF_MATCH_MIN` | 0.36 | lowest correct 0.391, highest wrong 0.334, midpoint 0.3625 | 0.026 and 0.031 |
| `EIGHT_MATCH_MIN` | 0.57 | 8 absent up to 0.255, 8 printed from 0.880, midpoint 0.5675 | 0.315 both sides |
| `ACCIDENTAL_ROW_TOLERANCE` | 0.15 s | residual after the clef row calibration, 3 px worst case, 0.10 s; must stay under half a staff step, 0.25 s | 50% above the measurement, 40% under the ceiling |
| `KEY_FIRST_GAP_MAX` | 1.4 s | measured clef-to-first-accidental gap 0.87 to 1.14 s | 1.23x |
| `KEY_GAP_MAX` | 0.8 s | measured accidental-to-accidental gap 0.10 to 0.47 s | 1.70x |
| `KEY_MATCH_RATIO_MIN` | 0.67 | lowest true ratio 0.698, highest false ratio 0.635, midpoint 0.6665 | 0.028 and 0.035 |
| `CLEF_KEY_MASK_MARGIN` | 0.675 s | half of `detect_heads`' own 1.35 s kernel width | not a fitted value |

Three of these deserve their reasoning stated here rather than only in the file.

**The key signature is accepted as a RATIO to this system's own clef match, not
as an absolute score.** No absolute bar can serve both corpora, for the reason
the flag threshold already found: a 1931 plate correlates far worse against a
clean font outline than a rendered page does. Measured, the two populations
overlap outright on absolute score, true scan accidentals 0.298 to 0.492 against
false render matches up to 0.600. The page supplies its own calibration and it
is already computed: the clef is the same font, the same rasterizer, and the
same ink a few staff spaces to the left. Dividing by its score asks whether this
glyph matches as well as the clef beside it did, which the page can answer about
itself with no ground truth and no per-corpus constant. Same species of move as
`run_page2._derive_flag_boundary`.

**The accidental row tolerance is five times tighter than the clef's, and it had
to be.** A sharp is a lattice of repeating strokes, so its template correlates
with itself shifted by a staff step. At 0.6 s the seven-sharp signatures of
sunless-06 derailed on their second accidental, dy -8 px, and read 4 sharps
instead of 7 on 8 of 26 systems. The bound is structural.

**Naturals are not matched, and that is a decision.** Matching them produced the
worst false population in this work: on the Lamm scan a natural template scored
0.997 of the clef's own score on ink that is a printed sharp. Dropping the
branch is also the more correct read, not merely the safer one. A cancellation
printed as naturals announces a key with fewer accidentals, so counting only the
sharps or flats that remain gives the new key's own fifths, and a signature of
naturals alone is C major, which reads here as 0.

---

## The collision answer

**The corpus hits it, on one piece.** Across 25 pages, the two Lamm scan pages
and the 23 render fixtures, the reader emits **1,118 ids**, of which **47 carry
the ordinal suffix** and **0 are duplicates**.

Every one of the 47 is on sunless-06, and three of them are three-way
(`r2-804-2` and `r2-804-3` on page 2, `r5-1967-2` and `r5-1967-3` on page 3,
`r7-1807-2` and `r7-1807-3` on page 6). That is the piece where `select_vocal`
hands the reader piano staves, which carry chords: two noteheads at one x on one
stem. The Lamm scan and sunless-01 through -05 produce no suffix at all.

So the suffix is not decoration. Without it those 47 ids would collide, and a
correction on one of them would silently apply to the other.

---

## Cost

The probe adds 0.02 s to `read_page_geometry` on the Lamm scan natively, and the
probe pass itself is 0.13 to 0.31 s on a page. In the browser the confirm prompt
appeared after Pyodide's warm-up, and the read that followed reported 7.9 s for
the page.

**A PDF now rasterizes its first page twice, once for the probe and once for the
read.** `rasterizePdf` gained a `maxPages` argument so the probe renders only
page one. For a one-page PDF that is double the rasterizing; for a ten-page
score it is about a tenth more. I did not restructure to share the raster: the
read needs every page from one open document, and holding a pdf.js worker open
while you read the prompt is worse than rendering one page twice.

---

## What was walked, in a browser

`pnpm --filter @ilya/web dev` on `localhost:5173`, in the in-app browser pane,
Pyodide v0.26.4 with **cv2 4.9.0**.

1. The Lamm scan page 1 PNG went in through the dropzone. The prompt came up
   reading **"Two things Ilya read from the page"**, with **Treble** and
   **2 sharps** already selected. That is what the page prints.
2. Changing nothing and pressing **Read this page** produced **47 notes, 0
   rests, 8 measures, staff spacing 30.0 px, read in 7.9 s**, the same 47 the
   harness reads natively at cv2 4.11.0. Before this ship the same page read 57
   under Pyodide.
3. In French the prompt reads **"Deux choses qu'Ilya a lues sur la page"** with
   **Clé de sol** and **2 dièses** selected.
4. A pitch correction made in the drawer, then a full page reload: the score
   re-read to 47 notes and the drawer said **"You have corrected one note"**. The
   correction landed.
5. Two deliberately unresolvable corrections written into IndexedDB, then a
   reload: the drawer said **"2 corrections no longer find their note"**, and in
   French **"2 corrections ne retrouvent plus leur note"**. One of the two was a
   four-segment old-scheme id, which proves the migration ran.

**The constants were derived at cv2 4.11.0 and they hold at Pyodide's 4.9.0 on
this page.** That was the largest risk in this work and the browser closed it
for the Lamm scan. It is not closed for any other page.

**The PDF route could not be walked in this session's browser pane.**
`rasterizePdf` on the Lamm PDF did not settle in 60 seconds. It fails the same
way with and without the new `maxPages` argument, tested both ways from the page
console, so it is not this ship's doing; it is the pane, the JBIG2 decode, or
both. Your own walk on a deploy is the test.

---

## Walk script for Dann, on a deploy

Do these in order. Numbers 2 and 5 are the ones this ship exists for.

1. Open Studio, drop `sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf` on the
   score dropzone. Expect a wait while the reader warms up, then a prompt.
2. **The prompt should say "Two things Ilya read from the page" and show Treble
   and 2 sharps already chosen.** If it says "Two things Ilya cannot see"
   instead, the read abstained and the fallback fired; tell me, that is a
   result.
3. Change nothing. Press **Read this page**. The read report should say 3
   systems, 9 staves for page 1, and no page should be named as failed.
4. Open the **Score markup** tab. Pick a note in the middle of a system, nudge
   it up a step, and give the save a moment.
5. Reload the whole page. **The correction should still be there and the drawer
   should say you have corrected one note.** If it also says corrections no
   longer find their note, that is this ship orphaning corrections you made
   before it, which is expected and is the thing I need you to rule on.
6. Switch to French and check the prompt on a second upload reads "Deux choses
   qu'Ilya a lues sur la page".

---

## New files, for `git add`

```
tools/e16-harness/reader/clefkey.py
tools/e16-harness/reader/fonts/clefkey_templates_leipzig.json
apps/web/src/lib/shane/ingestion/clef-key-prompt.ts
apps/web/src/lib/shane/ingestion/clef-key-prompt.test.ts
apps/web/src/lib/shane/engine/reader-ids.test.ts
docs/sessions/memo-n97-clef-key_r1_2026-08-24.md
.claude/launch.json
```

`.claude/launch.json` is a convenience I wrote so the browser pane can start the
dev server by name. It is not part of the ship. Add it or delete it; either way
it must not be left untracked, because `ilya-ship.sh:45-50` scans the whole
repository and an untracked file stops the ship before a gate runs.

Modified, all already tracked: `tools/e16-harness/reader/reader.py`,
`tools/e16-harness/reader/run_page2.py`,
`tools/e16-harness/e16_scratch_2026-07-28/gate06_fixture_identity.py`,
`apps/web/scripts/copy-reader.mjs`, `apps/web/src/lib/i18n.ts`,
`apps/web/src/lib/library/library.ts`, `apps/web/src/lib/shane/correction.ts`,
`apps/web/src/lib/shane/correction.test.ts`,
`apps/web/src/lib/shane/CorrectionControls.svelte`,
`apps/web/src/lib/shane/ScoreUploader.svelte`,
`apps/web/src/lib/shane/engine/page-pdf.ts`,
`apps/web/src/lib/shane/engine/page-reader.ts`,
`apps/web/src/lib/shane/engine/page-reader.worker.ts`,
`apps/web/src/routes/+page.svelte`.

**Your localhost dev library now holds the walk.** `ilya-library` on
`localhost:5173` carries the Lamm scan page 1 as a stored source, and one
correction I made on it, `m0-3-4`, a pitch nudge from F♯4 to G♯4. I left both
rather than delete data on your machine. Clear them when you like; nothing
depends on them.

---

## NOT ESTABLISHED

- **Whether the correction id should move to measure and x at the parser.** The
  measurement is established, the decision is not. See the section headed
  "The re-key does not reach the corrections".
- **Whether the ruled migration ever does anything.** On today's stored data it
  is a no-op, because a stored id has three segments and the migration only
  touches four-segment ids. It is correct, tested, and idempotent, and it
  rescues an id nothing currently writes.
- **The flat key signature.** The corpus prints sharps or nothing: fifths 0, 2,
  and 7 only. Every flat number in this memo is a false-positive measurement.
  The flat run has never been exercised on a printed flat signature, so its
  accuracy is unmeasured, and only its threshold is shared with the sharp run.
- **The C clef.** Rendered, matched, and scored as a wrong-clef rival on 89
  systems, never as the printed clef. No page of this corpus prints one. It also
  cannot pre-fill the prompt, which offers three options and not four, so a page
  that prints one falls back to asking.
- **The natural cancellation.** Not matched at all, by decision. A key signature
  printed as naturals reads as fifths 0, which is right for a full cancellation
  and unverified for anything else.
- **The PDF route in a browser.** Not walked. `rasterizePdf` did not settle in
  60 seconds in the pane, identically before and after this ship's change to it.
- **cv2 drift beyond the Lamm scan.** The constants were derived at cv2 4.11.0
  and confirmed at Pyodide's 4.9.0 on `raster400-1.png` only. The guards on
  `CLEF_MATCH_MIN` and `KEY_MATCH_RATIO_MIN` are thin, 0.026 to 0.035, and a
  toolchain that shifts the staff-line removal by that much would push a scan
  page under the bar. What happens then is an abstention and the old prompt, not
  a wrong clef.
- **`min_members`-style grounding for the key run's length.** The run stops at
  the first position whose glyph is not there. Nothing tests whether the
  resulting count is a legal key signature, the way `timesig`'s V5 tests
  `beat_type in {2,4,8,16}`. It never fired wrong on 89 systems, which is an
  observation, not a guarantee.
- **Mid-piece clef and key changes.** Out of scope, not detected, and the reader
  never attempted them either. A change after the first system of a page is
  invisible to both the read and the mask.
- **Whether the 0.675 s mask margin is the right one on a page with a very
  tight first note.** It is derived from `detect_heads`' own kernel width, not
  fitted, and on this corpus it drops 10 of 10 clef-and-key false positives and
  no true note. A page whose first note is engraved closer than 0.675 s past its
  key signature would lose it, and no page of this corpus is.
