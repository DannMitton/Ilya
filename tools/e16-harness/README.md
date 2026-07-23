# E.16 evaluation harness

Stage 0.5 of E.16 (score ingestion beyond the digital formats). This is
**evaluation tooling, not product code**: it measures candidate note
engines on Dann's own corpus in Fit units, so the note-engine choice for
the split-pipeline architecture (decision D1) is a measurement, not a
literature opinion. Nothing here is imported by `apps/web` or `packages/*`;
this directory only imports FROM `@ilya/score-parser`, read-only.

Full context: `claude/sonnet-brief-e16-harness-scaffold_2026-07-22.md`
(the spec of record), `claude/e16-phase0-options-memo_2026-07-22.md` §7,
`claude/e16-vision-and-staged-plan_2026-07-22.md` §5, decision D1 in
`claude/e16-decisions-log_2026-07-22.md`.

## What this does, in one line per stage

1. **Render** a corpus `.musx` to a full-page score image (`render.ts`).
2. **Extract ground truth** from that SAME `.musx`, independently, via the
   product's own parse path (`ground-truth.ts`).
3. **Score** a recognizer's output against ground truth in Fit units
   (`scorer.ts`), via a normalized recognizer-output schema
   (`normalized-format.ts`) any future OMR-engine adapter targets.
4. **Prove the scorer** against a perfect echo and a deliberately corrupted
   fixture (`stub-adapter.ts`, `corrupted-adapter.ts`, `self-test.ts`).
5. **Run the whole thing** over a corpus and emit a scorecard
   (`run-harness.ts`).

Running real OMR engines against the rendered images is explicitly a
**separate, later chunk**. This harness is built and proven against a
stub recognizer (steps 3-4 above) so that later chunk only has to write
one adapter function per engine.

## Prerequisites

- **Node ≥ 22.6** for direct `.ts` execution (see "Why plain `.ts` files
  run directly" below). Verified against Node 22.22.2/22.22.3.
- **`musx2mxl`** (Python, MIT licence, `pip install musx2mxl`) for the
  render path only (ground truth does not need it). Its declared
  dependency `lxml~=4.8.0` fails to BUILD from source against Python
  3.10/3.11 (a `PyFrameObject` incompatibility with newer CPython
  internals). Fix: `pip install lxml` (a modern lxml, tested with 6.1.0,
  works fine at runtime despite the older pin) THEN
  `pip install musx2mxl --no-deps`. Building `lxml` from source also
  needs the `libxml2`/`libxslt` development headers
  (`apt install libxml2-dev libxslt1-dev`, or platform equivalent) if no
  prebuilt wheel is available for your Python version.
- **`rsvg-convert`** (from `librsvg`) for the render path's SVG-to-PNG
  step. Debian/Ubuntu: `apt install librsvg2-bin`. macOS: `brew install
  librsvg`.
- `npm install` inside this directory (`tools/e16-harness/`) for the
  `verovio` JS dependency. Nothing else in this directory needs an npm
  install: ground truth extraction, the scorer, and the self-test are
  pure Node + relative imports into `@ilya/score-parser`'s TypeScript
  source, no build step.

## Running it

```sh
cd tools/e16-harness
npm install                     # only needed for render.ts (verovio)

# The scorer's self-test (hermetic; no corpus, no musx2mxl/verovio needed):
node src/self-test.ts

# The full harness against real corpus pieces (paths are outside this
# repo, so they are CLI args, not hard-coded):
node src/run-harness.ts \
  "/path/to/Finale Files/Mussorgsky - Sunless 01 - Within four walls.musx" \
  "/path/to/Finale Files/Mussorgsky - Sunless 02 - You did not recognize me.musx" \
  "/path/to/Finale Files/Mussorgsky - Sunless 03 - Finished is the noisy idle day.musx" \
  "/path/to/Finale Files/Mussorgsky - Sunless 04 - Be bored.musx" \
  "/path/to/Finale Files/Mussorgsky - Sunless 05 - Elegy.musx" \
  "/path/to/Finale Files/Mussorgsky - Sunless 06 - On the river.musx"
```

Output lands in `output/<piece-id>/` (ground truth JSON, rendered SVG/PNG
pages, the stub's score) plus an aggregate `output/scorecard.json` and
`output/scorecard.md`. `output/` and `node_modules/` are gitignored; both
are regenerable from a clean checkout plus the prerequisites above.

## Why plain `.ts` files run directly, no build step

Node ≥ 22.6 strips TypeScript type syntax natively (no `tsx`, `ts-node`,
or `esbuild` needed). It only supports "erasable" syntax, though: NOT
`enum`, NOT constructor parameter properties (`constructor(public x)`),
NOT namespaces. Every file in this directory deliberately avoids those
three, verified by running each file directly with plain `node`. Keep
that constraint if you extend this harness, or Node will throw
`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` at load time.

This also drove the choice of WHICH files this harness imports from
`@ilya/score-parser`: only `mnx-parser.ts` and `verses.ts`, whose own
internal imports are all `import type` (erased entirely, no runtime
resolution needed). `overlay-engine.ts`, for contrast, has one real value
import (`from './sustain'`, no extension) that Node's ESM loader cannot
resolve un-transpiled; this harness does not import it, and re-implements
the one trivial helper it would have needed (`pitchToMidi`) instead of
pulling that file in.

## The render path: what the brief expected vs. what actually works

The brief expected **denigma → MNX → Verovio** (Verovio was believed to
have MNX import support, per `claude/e16-phase0-options-memo_2026-07-22.md`
§7). **SOURCED, this session (2026-07-22): that is not correct.** Verovio
6.2.0 (current npm `verovio`, and its GitHub README) has no MNX import.
Tested directly: `toolkit.loadData(mnxJsonText)` on real denigma-derived
MNX returns `0` (failure) with `[Warning] PAE: A clef is required.` (it
misdetects the JSON as Plaine & Easie Code); a search of the WASM/JS build
for any real `mnx` token turned up nothing but coincidental base64
substrings. Verovio's own README lists its import formats as MEI,
MusicXML, Humdrum, Plaine & Easie, Musedata, EsAC, and ABC. No MNX.

This is **not** the brief's anticipated blocker ("denigma is browser-only
and cannot run headless"): denigma runs headless in plain Node with no
DOM shim needed (see `denigma-convert.ts`'s doc comment; verified against
a real corpus piece before anything else was built). The blocker is
specifically that MNX has nowhere to render TO. The working chain instead
uses a different, independent tool for the image side:

```
.musx --[musx2mxl 0.2.9, MIT]--> .mxl (MusicXML 4.0)
     --[unzip]--> score.musicxml
     --[Verovio 6.2.0, scale=100, pageWidth=2100, pageHeight=2970,
        adjustPageHeight=true, breaks='auto']--> SVG per page
     --[rsvg-convert -w 2480 -b white]--> PNG
```

`pageWidth`/`pageHeight` are in **tenths of a millimetre** (verified
empirically: at `scale=100` the SVG's declared pixel width equals the
option value exactly, e.g. `pageWidth: 2100` → `width="2100px"`), so
2100 × 2970 = 210mm × 297mm = A4. Rendering at 2480px wide against a
210mm page gives 2480 / (210 / 25.4) = **299.96 DPI**, computed from the
actual output, not assumed. Verified against all six *Sunless* pieces:
every one renders at exactly this DPI, page counts 2, 2, 5, 2, 5, and 6
respectively.

**Known limitation, not hidden:** musx2mxl's own README calls it "still a
work in progress" and warns it "does not guarantee the exact preservation
of bar positions, note placements, and other advanced notations." On
every corpus piece this session, its piano/accompaniment staff came out
wrong (Verovio logs `Staff 2 cannot be found` / cross-staff-reference
warnings during import, and the rendered piano part visibly drops its
lower staff). **The vocal line — what this harness actually scores — came
out correct on every piece**, including a bonus discovery: the source
`.musx` files already carry a SECOND lyric verse that reads as IPA
transcription (e.g. verse 1 `Ком-нат-ка тес-на-я`, verse 2 `ˈko-mnɑ-tkɑ
tʲɛs-nɑ-jɑ`), independent of Ilya's own IPA machinery. Whoever adapts a
real OMR engine next should treat the rendered image as a reasonable
vocal-line test image, not a faithful full-score facsimile, until a
better musx→MusicXML/MNX path exists.

**Also not hidden:** `render.ts`'s attempt to capture Verovio's import
warnings as structured data (`RenderResult.verovioWarnings`) did not work
in this session — neither overriding `console.error` nor passing a
`printErr` callback to the WASM module factory intercepted them; they
print straight to stderr instead. The render itself is unaffected (the
PNGs are correct), but `verovioWarnings` will read back as an empty array
in the current code. Worth another 20 minutes for whoever picks this up
next; not worth more of this session's budget for a cosmetic logging gap.

## Ground truth: what it actually reuses

`ground-truth.ts` imports `MnxScoreParser` and `sungVerseNumbers` directly
from `@ilya/score-parser`'s TypeScript source (read-only; nothing product
is edited). Per piece, verified against all six *Sunless* pieces with
zero parser errors (one non-fatal warning on piece 03, a genuine
`measure-duration-mismatch` at measure 22 the product's own parser
flagged, not something this harness invented):

- **Vocal-line notes**: pitch (MIDI, converted via the same C4=60
  convention the product's `overlay-engine.ts` uses),
  duration/onset (both as whole-note fractions AND as a precomputed
  absolute onset in whole notes from the piece start, via
  `measureStartOffsets`, so the scorer does not need to re-derive
  cumulative measure timing).
- **Lyric syllable events**: per verse (via `SyllableInfo.versesInfo`,
  the product's own per-verse record, not re-derived), so a strophic
  piece's ground truth is genuinely per-verse, not just verse 1.
- **Tempo**: REAL BPM from the source's own `tempoMarkings`, not a
  guess and not limited to a single value (sunless05 has six tempo
  changes, all captured).
- **Clef and key**: from the source's own `clefs`/`keySignatures`.

All six *Sunless* pieces sing exactly two verses (Cyrillic + IPA, see
above). Ground truth JSON is per-piece at `output/<piece>/ground-truth.json`
when you run the harness.

## The normalized recognizer-output schema (`normalized-format.ts`)

```ts
interface RecognizedNote {
  id: string;                 // the recognizer's own id; NEVER compared to ground-truth ids
  type: 'note' | 'rest';
  measureIndex: number;
  onset: { numerator: number; denominator: number };    // whole-note fraction, within the measure
  duration: { numerator: number; denominator: number };  // whole-note fraction
  midi?: number;               // absent for rests
  syllableText?: string;       // absent = no lyric on this note (melisma continuation, or none)
}

interface RecognizedVerse {
  verseNumber: number;
  notes: RecognizedNote[];
}

interface RecognizedOutput {
  pieceId: string;
  clef?: { sign: string; line: number };
  keySignature?: { fifths: number; mode?: string };
  tempoBpm?: number;            // ONE representative tempo; v1 does not require mid-piece tempo tracking
  verses: RecognizedVerse[];
}
```

This is a deliberately DIFFERENT shape from `GroundTruth` (not a re-export
of the product's internal `ParsedScore`): it mirrors what a
MusicXML-emitting OMR engine (oemer, homr, SMT++, all MusicXML- or
MusicXML-like output per the phase-0 survey) would naturally produce, so
a future adapter's whole job is "engine's native output → this shape,"
and the scorer never has to change when a new engine is added.

**Documented assumption, not solved here:** the scorer places a
recognizer's `(measureIndex, onset)` on the SAME absolute timeline as
ground truth, using ground truth's OWN measure durations (see
`measureStartOffsets` in `ground-truth.ts`, reused by `scorer.ts`). This
assumes the recognizer's measure numbering agrees with the source's. A
recognizer that miscounts measures (a barline it added or missed) is not
handled; that is a separate, real OMR-evaluation problem, not something
this scorer pretends to solve.

## The scorer (`scorer.ts`)

**Note-matching**: greedy nearest-onset, monotonic. Both sequences are
walked once, in onset order; each ground-truth note takes the closest
not-yet-used recognized note within `ONSET_TOLERANCE` (0.2 whole notes,
roughly a 32nd note) of its onset, never matching out of order. This is
simpler than full monotonic DTW; it was sufficient for the perfect and
corrupted fixtures below, and is flagged as needing revisiting once real
OMR output (which can insert/delete notes in bursts) is measured, rather
than solved speculatively now.

**Four metric families** (per the brief's task 3):

- (a) note-level **precision / recall / F1**, separately for pitch match
  (exact MIDI equality on matched note-type pairs) and rhythm match
  (onset AND duration within tolerance, also restricted to matched
  note-type pairs — an earlier version of this scorer let rest-to-rest
  matches inflate the rhythm denominator, producing an F1 > 1 on the
  PERFECT fixture; caught by the self-test before this file shipped, and
  fixed by requiring both sides be `type: 'note'` for a rhythm match, the
  same guard pitch match already had).
- (b) **mean pitch shift** (semitones), **mean onset shift**, **mean
  duration shift** (whole notes), over matched notes only.
- (c) **tessitura delta**: (min, max, mean) MIDI of the vocal line,
  recognized vs. truth, and the delta of each.
- (d) **Alignment Error Rate (AlER)**: among ground-truth notes carrying
  a syllable for the verse being scored, the fraction that did NOT end up
  correctly aligned — either because the ground-truth note had no
  matching recognized note at all (counted as misaligned, not excluded:
  a dropped note IS a lyric re-association failure from Fit's
  perspective), or because the matched recognized note carries different
  syllable text.

## Self-test (`self-test.ts`, `stub-adapter.ts`, `corrupted-adapter.ts`)

Hermetic: runs against a small synthetic 8-note ground truth built right
in `self-test.ts`, no corpus or external tool needed. Two fixtures:

- **Perfect** (`stub-adapter.ts`): re-shapes ground truth into
  `RecognizedOutput` verbatim, no recognition performed. Must score EXACT
  zero error on every metric family. Verified: pitch/rhythm F1 = 1,
  all shifts = 0, all tessitura deltas = 0, AlER = 0.
- **Corrupted** (`corrupted-adapter.ts`): starts from the perfect echo,
  then applies three independent, deterministic corruptions to three
  DIFFERENT notes (so each effect is individually visible, not masked by
  another): drops a note (recall must fall), shifts a pitch by +2
  semitones (precision must fall, mean pitch shift must move positive),
  and swaps the syllable text between two other notes (AlER must become
  nonzero). Verified: pitch recall 0.75, mean pitch shift +0.286
  semitones, AlER 0.75, on the synthetic fixture; also re-verified against
  all six real *Sunless* pieces (AlER ranged 0.008-0.074 there, since a
  single swapped syllable is a much smaller fraction of a ~100-300 note
  piece than of an 8-note synthetic one).

Run: `node src/self-test.ts`.

## What the "run the real engines" next chunk needs

1. One adapter function per engine: engine's native output (MusicXML,
   or whatever it emits) → `RecognizedOutput`. Nothing else changes.
2. A decision on how an engine's OWN measure/barline detection maps onto
   ground truth's measure numbering (the "documented assumption" above);
   real engines may not agree with the source on measure count.
3. A decision on how a lyric-position-only signal (no engine survey
   candidate emits usable text; see decision D1) turns into
   `syllableText` for AlER scoring: today the stub trivially copies
   ground truth's text, which real recognition will not do. The AlER
   metric is ready; feeding it real (non-ground-truth) syllable text is
   the split-pipeline's actual open problem, correctly deferred past this
   harness.
4. The musx2mxl piano-staff limitation does not block this (ground truth
   does not depend on the render path), but a better render path would
   make the test IMAGES more representative of a real piano-vocal page.

## Could-not-confirm / open items

- `RenderResult.verovioWarnings` reads back empty; the warnings print to
  stderr directly and were not captured programmatically this session
  (see "The render path" above).
- musx2mxl's own limitations beyond the piano staff (it self-describes as
  "basic notations only... still a work in progress") were not
  exhaustively catalogued; only what surfaced on these six pieces is
  documented.
- The scorer's note-matching (greedy nearest-onset) has not been
  stress-tested against note INSERTIONS/DELETIONS in bursts (real OMR
  failure mode), only single-note corruptions. Flagged above, not solved.
