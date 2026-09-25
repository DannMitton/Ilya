# AUDIT MEMO B — packages/, apps/web/src/routes/, tools/, scripts/

**Written 2026-09-24/25**, per `docs/sessions/brief-audit-code-catalogue_r1_2026-09-24.md`, HALF B. Read-only:
`git --no-optional-locks status`, `ls-files` only. About 65 source files (`.ts`/`.svelte`, excluding tests
and `.d.ts`) under `packages/`, `apps/web/src/routes/`, `tools/`, `scripts/`.

Method: header comment, exports, then a grep for call sites across the whole tree (`apps/web/src`, `tools`,
`scripts`, `packages`) to confirm wiring or its absence. Every claim below carries a `path:line` read in this
run.

---

## 1. Built but described as unbuilt

No item in `OPEN.md`, `STATE.md` or `SEQUENCE.md` names something as unbuilt that Half B's tree shows is in
fact built. The one close call is N.94 (the transposition control), and `SEQUENCE.md` itself already states
the true position correctly (engine built, control missing), so it is not a misdescription — it is recorded
here as confirmation, not a finding:

| item | what the plan says | what the tree has | path:line |
|---|---|---|---|
| N.94, the transposition control | `SEQUENCE.md` Tier 3: "The engine already ships... only the control is missing." | Confirmed. `suggestTranspositions` is a complete, tested, documented search over candidate transpositions (v1 cost model: range violations, then crossings). No UI calls it from `apps/web/src` or `routes/`; the empty grep for any control-side caller is the plan's own claim, not a new finding. | `packages/score-parser/src/transposition.ts:1-40`; empty grep for `suggestTranspositions` outside the package and its test |

**The inverse case, which the brief also asks for:** something the tree marks as intentionally unbuilt, and
no open item names the follow-up at all. This is Half B's real finding and sits in section 2 rather than
here, because nothing in the plan is wrong about it — nothing in the plan mentions it:

- **The diction-mark fold (`foldDictionMarks`) is complete, tested and measured, but is not called anywhere
  in `apps/web/src`.** `score-metrics.ts:43-50` (Half A, read only to confirm the wiring question, not
  audited) says outright: *"The diction-mark fold is NOT applied here (Dann's scope ruling, 2026-08-02: wire
  additively first, fold next)... Read the per-vowel breakdown as provisional until `foldDictionMarks` is in
  the resolver chain."* `foldDictionMarks` itself (`packages/score-parser/src/diction-marks.ts:141`) is
  finished: its header states a MEASURED result (per-vowel error over six songs, 18.46 percent to 8.15
  percent) that explicitly REQUIRES a second exported function, `vowelResolverAbstentions`
  (`diction-marks.ts:276`), which is also never called anywhere outside its own module, its test, and the
  barrel (`index.ts:166-167`; empty grep confirmed in `apps/web/src`, `tools`, `scripts`). **So the live app's
  per-vowel numbers are provisional by the module's own account, and "fold next" was never done.** This is not
  named in `OPEN.md`, `OWED.md`, `STATE.md`, `SEQUENCE.md`, or anywhere in `LOG.md` (all four searched,
  zero hits for "diction-mark", "foldDictionMarks", "phonation-break"). See section 2.

---

## 2. Undescribed

| module | what it does | proposed title |
|---|---|---|
| `packages/score-parser/src/diction-marks.ts` (`foldDictionMarks`, `vowelResolverAbstentions`, `phonationBreakEventIds`) | Complete, tested repair for the `#` phonation-break mark eating a syllable slot in the underlay; MEASURED to cut per-vowel disagreement from 18.46% to 8.15% over the six-song corpus, but never called from `apps/web/src` (confirmed by empty grep for all three exports outside the package, its tests, and the barrel). `score-metrics.ts:43-50` names this exact gap in its own header ("wire additively first, fold next") and dates the scope ruling to 2026-08-02, over seven weeks before this audit. | Wire the diction-mark fold into the live resolver chain (the per-vowel Insights numbers are provisional until this lands) |
| `packages/score-parser/src/renderer-output.ts` (`generateRendererMusicXml`) | A stub for exporting `ParsedScore` to simplified MusicXML for a Verovio-based renderer. The function's body is entirely a `TODO` comment and it ends `throw new Error('generateRendererMusicXml() not yet implemented')`. Exported from the barrel (`index.ts:27`) but called from nowhere (empty grep, whole tree). `staff-renderer.ts`'s own header says Verovio was rejected in favour of the bespoke renderer at "the renderer spike (2026-07-12)". | Retire `renderer-output.ts` as a superseded Verovio-era spike (candidate for N.86's dead-code list, see section 3) |
| `packages/score-parser/src/tessitura.ts` (`optimalRegion`) | A second tessitura function beside the wired `pachecoTessitura`; narrows a `TessituraResult` to a best single region. Exported from the barrel (`index.ts:175`) but not called anywhere outside its own file and test (empty grep). | Either wire `optimalRegion` into a consumer or fold it into the dead-code list |
| `tools/e16-harness/` (`run-harness.ts`, `scorer.ts`, `denigma-convert.ts`, `render.ts`, `ground-truth.ts`, `normalized-format.ts`, `self-test.ts`, `stub-adapter.ts`, `corrupted-adapter.ts`, `adapters/homr-adapter.ts`, `adapters/oemer-adapter.ts`, `adapters/run-homr-score.ts`, `adapters/run-oemer-score.ts`) | A full OMR-accuracy benchmarking harness, independent of the shipped Pyodide page reader (N.59): converts `.musx` to ground truth via denigma, renders full-page images through a separate musx2mxl/Verovio chain, and scores third-party OMR engines (homr, oemer) against that ground truth on pitch/rhythm precision-recall, mean shift, tessitura delta, and alignment error rate. Real output exists for all six Sunless pieces (homr) and one page (oemer). Only reference in the plan docs is indirect: `OWED.md:668` names N.37, "the stale `e16-harness` README," which is about the harness's documentation, not its function or whether it is still wanted. | A cardinal for "what the E.16 OMR-accuracy harness is for now, and whether it still matters against N.83's walkthrough datum" |
| `packages/score-parser/src/pickup.ts` (the pickup-meter rule) | Implements the exact rule Dann ruled in on the 2026-09-24 walk that produced N.169: when bar 1 is shorter than bar 2's meter and differs from it, bar 1 is a pickup under bar 2's meter (`pickup.ts:14-19`). This is a DESK DEFAULT rule already built and wired into both parsers (`mnx-parser.ts`, `musicxml-parser.ts`, confirmed by the module's own header). N.169's spec (`OPEN.md:419-434`) records the ruling and says the notation finding "moved to the Code brief... fifth finding; no longer part of this item," but does not say the fix shipped; it reads as still open. **NOT ESTABLISHED from this half alone** whether `pickup.ts` is the shipped fix N.169's finding refers to or a separate, later build — the commit is not named in `pickup.ts` and I did not read `LOG.md` block-by-block for it. Worth a one-line confirmation before N.169 is walked. | (existing item, not a new title — flagging the ambiguity for N.169) |

---

## 3. Dead or orphaned

- **`packages/score-parser/src/renderer-output.ts`**: `generateRendererMusicXml` is exported from the barrel
  and imported by nothing. `grep -rn "generateRendererMusicXml" --include=*.ts --include=*.svelte .` (repo
  root, excluding `node_modules`) returns only the function's own definition, its own `throw`, and the barrel's
  doc comment and re-export.
- **`packages/score-parser/src/tessitura.ts:204`, `optimalRegion`**: exported from the barrel
  (`index.ts:175`), called from nowhere. `grep -rn "optimalRegion" apps/web/src tools scripts` (excluding
  tests) is empty.
- **`packages/score-parser/src/diction-marks.ts:276,286`, `vowelResolverAbstentions` and
  `phonationBreakEventIds`**: exported from the barrel (`index.ts:166-167`), called from nowhere outside the
  module and its own test. `grep -rln "vowelResolverAbstentions\|phonationBreakEventIds" apps/web/src tools
  scripts` (excluding tests) is empty. (`foldDictionMarks` itself, the function these two support, is also
  uncalled — see section 1 and section 2; grouped there rather than repeated here because it carries a live
  scope ruling, not silent orphaning.)
- **`apps/web/src/routes/fit-font-lab/+page.svelte`**: a dev-only route (its own header: "DEV ROUTE... Not
  linked from the app shell"), comparing Bravura/Leland/Finale Maestro. Not dead in the sense of unreachable
  code — it is a real page, reachable by direct URL — but it is not part of the product surface and nothing
  links to it (confirmed: `grep -rn "fit-font-lab" apps/web/src` finds only the route folder itself).

**Not dead, despite looking isolated on a first grep:** `sliceScore`/`sliceWidth` (`page-layout.ts:98,129`)
and `clefFromSource` (`clef-select.ts:33`) are called only from within their own files, by `paginateScore`
and `chooseClef` respectively — internal helpers exported for testability, not orphaned. `lookupTempoLexicon`
(`tempo-lexicon.ts:164`) is called only from `tempo-seam.ts:457,462` — same pattern. `estimateCyrillicWidthPx`
/ `estimateIpaWidthPx` (`underlay-widths.ts:826,843`) are called from `staff-renderer.ts:1081-1082,3434`.

---

## 4. The full catalogue

### `packages/score-parser/src/` (the biggest cluster; production layout, parsing and analysis engine)

| path | purpose | class | item |
|---|---|---|---|
| `types.ts` | Canonical `ParsedScore` types shared by both parsers and every downstream consumer. | Foundational | infra, not item-specific |
| `analysis-types.ts` | The `AnalyzedScore` overlay model (forecast, not declaration; section 7.2 spec). | Foundational | infra |
| `index.ts` | Public barrel: types, both parsers, renderer-output, and the "E.20 measurement layer" (phonation, diction-mark fold, tessitura, tempo seam). | Foundational | infra |
| `mnx-parser.ts` | MNX reader, built against real denigma output; direct `.mnx`/`.json` uploads and `.musx` via denigma. | SERVES CLOSED | foundational, wired everywhere |
| `musicxml-parser.ts` | MusicXML reader for `.xml`/`.mxl`, MuseScore, PDFtoMusic, homr, MIDI-converted paths. | SERVES CLOSED | foundational, wired everywhere |
| `pickup.ts` | Pickup-meter rule ruled in 2026-09-24, wired into both parsers (`pickup.ts:1-24`). | See section 2 | N.169 (ambiguous — see section 2 note) |
| `clef-select.ts` | Clef choice: printed clef wins, else a tessitura heuristic (treble/treble-8vb/bass), v37 A.17. Mid-score clef changes NOT yet honoured per system (`clef-select.ts:13-17`, self-documented gap). | SERVES CLOSED, one self-declared partial gap | v37 ruling; the mid-score gap is not named by any open item |
| `vocal-octave.ts` | Recovers the sounding octave for a `.musx`/MNX vocal line notated in treble-8vb; disambiguates a plain treble line against the singer's own range. Called from `InsightsPane.svelte:40,110`, `VoiceProfilePane.svelte:67,559`, and `tools/n168-frequency-run/frequency-run.run.ts:45,486`. MNX-uploaded-as-MNX's octave-clef convention is explicitly `NOT ESTABLISHED` in its own comment (`vocal-octave.ts:60-65`), tied to a 2026-09-23 Dann ruling. | SERVES CLOSED (the denigma/MusicXML branch); one self-declared gap (hand-written MNX) | 2026-09-23 ruling, unnumbered |
| `unfold.ts` | Performance-order unfolding: repeats, voltas, D.C./D.S./Coda/Fine jumps. Feeds `performance-order.ts`. | SERVES CLOSED + feeds OWED | ties to D3's Job A (per-verse reprints), `OWED.md:612`, ruled in E.36, still unnumbered |
| `performance-order.ts` | Projects a `ParsedScore` into sung order for analysis, leaving the engraved score untouched. Wired into `insights.ts`, `score-metrics.ts`, `InsightsPane.svelte`, `VoiceProfilePane.svelte`, `frequency-run.run.ts`. | SERVES CLOSED | foundational for Insights/analysis |
| `verses.ts` (`sungVerseNumbers`) | Enumerates verse numbers that actually sing. Wired into `analyze-per-verse.ts` and the E.16 harness (`ground-truth.ts`). | SERVES CLOSED | foundational |
| `overlay-engine.ts` (`analyzeScore`) | The core acoustic forecast: turning pitch, timbre, crossing, `aboveFirstResonance`. Cited directly in N.169's spec (`OPEN.md:421`, `overlay-engine.ts:169`). | SERVES CLOSED + SERVES OPEN | N.169 (the fR1/2 head positions under dispute) |
| `conditions.ts` (`noteConditions`) | Per-note condition record (harmonic rungs, approach, phrase, cumulative phonation) for the N.168 frequency run. Its own header: "nothing in the app reads it yet." Wired only into `tools/n168-frequency-run/frequency-run.run.ts`. | SERVES OPEN | N.168 step 2 (built, run, not yet read by the app) |
| `modification-engine.ts` (`modificationTarget`) | General vowel-modification target search, superseding the v1 hardcoded `[i]` to `[ɪ]` case. Confirmed wired into `advice-resolver.ts:48,374` (Half A), which explicitly states the supersession and shows no stale hardcoded path left. | SERVES CLOSED | section A.162 |
| `transposition.ts` (`suggestTranspositions`) | Transposition search minimizing range violations, then crossings. Not called from any UI. | SERVES OPEN | N.94 — engine built, control missing (confirms `SEQUENCE.md`) |
| `diction-marks.ts` | `#` phonation-break-mark fold. Complete and tested, not wired into the live resolver chain. | See section 1/2 | undescribed gap, self-acknowledged in `score-metrics.ts` |
| `phonation.ts` | Phonation-time aggregation (sounding length cross-checked against the bar's own metre). Feeds tessitura and the watch list. | SERVES CLOSED | E.19/E.20 measurement layer |
| `tessitura.ts` | Pacheco's duration-weighted tessitura method (`pachecoTessitura`, wired into `insights.ts`, `score-metrics.ts`) plus `optimalRegion` (orphaned, section 3). | SERVES CLOSED + one orphan | E.20 layer |
| `sustain.ts` | Long-sustain test (fermata or 2.5s or more), a de-duplicated copy shared with the overlay engine's cover-exposure predicate. Carries its own private `activeTempoAt` (`sustain.ts:61-84`), which is the exact duplication N.128's still-open "two other consumers" question asks about (`OWED.md:52-60`) — whether this and `watchlist.ts:229-244`'s identical private copy read the corrected (post-N.128) line or the reader's raw events. Not resolved by this half alone: the call sites that decide it live in Half A (`overlay-engine.ts`, my half, does call it; the question is which array it's handed). | SERVES CLOSED (N.128 itself) + feeds an OWED question | N.128's open remainder, `OWED.md:52` |
| `tempo-seam.ts` | The single `activeTempoAt`/`resolveTempo` seam the 2026-07-17 design called for; MEASURED 2026-07-30 as never built until this module. `resolveTempo` is wired into `score-metrics.ts` (Half A) and `frequency-run.run.ts`. Internal helpers (`feltBeat`, `timeSignatureAt`, `readModifiers`, `bandPosition`, `classifyCue`, `classifyGradualCue`, `rampSeconds`, `tempoCaveats`) are used only inside `resolveTempo` itself or tests — not orphaned, just not part of the public surface anyone else needs. | SERVES CLOSED | 2026-07-17 design; touched by N.138 (closed, `LOG.md:4636`) |
| `tempo-terms.ts` (`resolveTempoTerm`) | Steady-tempo-word tier resolver (Quantz tiers via Schilling, music21 representative bpm). Used inside `tempo-seam.ts`. | SERVES CLOSED | tempo seam infra |
| `tempo-lexicon.ts` (`lookupTempoLexicon`) | Five-language (EN/FR/DE/IT/RU) tempo-word lexicon, Unicode-aware matching. Used inside `tempo-seam.ts`. | SERVES CLOSED | tempo seam infra |
| `underlay-widths.ts` | Measured per-glyph advance-width tables for Cyrillic/IPA underlay sizing (the "ruler"). Used in `staff-renderer.ts`. | SERVES CLOSED | N.129 (closed 2026-09-20, the ruler dependency) |
| `smufl-metadata.ts` | SMuFL font-metadata loader/glyph cache with Bravura fallback. Used in `staff-renderer.ts` and `demo-fixture.ts`. | SERVES CLOSED | Kimi glyph-pass, 2026-07-12 |
| `page-layout.ts` | Multi-system pagination onto the letter page: slices, packs, renders, stacks pages. `paginateScore` wired into `loupe.ts`, `loupe-render.ts`, `loupe-render-bundle.ts`, `VoiceProfilePane.svelte`, `clitic-seat.ts`. | SERVES CLOSED | Kimi's pagination step, 2026-07-12 |
| `staff-renderer.ts` | The bespoke SVG staff renderer, 3,534 lines: rhythmic spacing, barlines, clef/key, accidentals, ledger lines, beaming, the analytical marks, turning-layer heads, the squircle. Production layout engine, increment 4. Not read line-by-line at this size; header and exports read, call sites confirmed throughout `apps/web/src/lib/shane`. | SERVES CLOSED, and is the live substrate for several open items (N.140, N.141, N.165) that this audit did not re-derive since Half A owns those call sites | multiple; see Half A's memo for the open-item detail on the loupe/squircle |
| `renderer-output.ts` | Verovio-MusicXML export stub, never implemented, never called. | DEAD/ORPHANED | superseded Verovio spike |
| `demo-fixture.ts` | Shared four-measure demo fixture for `staff-renderer.test.ts` and the font lab. Not production data (own header). | Dev/test fixture | n/a |
| `page-layout.test.ts`, `staff-renderer.test.ts`, etc. | Test files, excluded from this catalogue per the brief. | — | — |

### `packages/blurb/src/` (IPI educational-blurb composer)

| path | purpose | class | item |
|---|---|---|---|
| `types.ts` | Types for the Identity-Process-Implication blurb data. | Foundational | infra |
| `cluster-breakdowns.ts` | Expands a cluster string (e.g. сч, зч) into per-character rows for the inspector ribbon. | SERVES CLOSED | inspector ribbon |
| `composer.ts` | Assembles bilingual educational blurbs from `blurb-composer.json` data via `deriveRule`/`composeBlurb`/`buildDisplayLog`. | SERVES CLOSED | inspector ribbon |
| `index.ts` | Public barrel. | Foundational | infra |

Package is wired: 4 non-test files in `apps/web/src` import `@ilya/blurb`.

### `packages/dictionary/src/` (gloss pipeline, normalisers, Cyrillic display)

| path | purpose | class | item |
|---|---|---|---|
| `types.ts` | Shared gloss/dictionary types. | Foundational | infra |
| `gloss.ts` | Extraction, cleaning, truncation and formatting of glosses; curated-gloss override and lemma fallback. | SERVES CLOSED | word stack |
| `curated-glosses.ts` | Hand-written bilingual gloss overrides for common words. | SERVES CLOSED | word stack |
| `cyrillic.ts` | Combining-acute stress marks for Cyrillic display (skips yo). | SERVES CLOSED | word stack |
| `poetic-normalizer.ts` | Fallback normaliser for poetic contracted forms (e.g. vosstanye to vosstaniye) when a direct dictionary lookup misses. Wired into `pipeline.ts`. | SERVES CLOSED | dictionary lookup pipeline |
| `pre-reform-normalizer.ts` | Pre-1918 orthography normaliser (yat, fita, decimal-i, izhitsa, terminal hard sign). | SERVES CLOSED | N.12 (`LOG.md:6014`, confirmed `DONE`) |
| `index.ts` | Public barrel. | Foundational | infra |

Package is wired: 4 non-test files in `apps/web/src` import `@ilya/dictionary`.

### `packages/phonology/src/` (the Grayson engine)

| path | purpose | class | item |
|---|---|---|---|
| `engine.ts` | `GraysonEngine`, the sole phonological authority (Grayson 2012 dissertation), 2,276 lines, extracted from the pre-rewrite prototype. Not read line-by-line at this size; header, public API and call sites confirmed. | SERVES CLOSED | foundational, wired everywhere (15 non-test importers) |
| `clitics.ts` (`resolveCliticChain`) | Proclitic/enclitic chain resolution against the host word's stress. Wired into `pipeline.ts`. | SERVES CLOSED | Grayson 2012 pp. 248-257 |
| `index.ts` | Public barrel (`transcribeWord`, `GraysonEngine`, etc.). | Foundational | infra |

### `apps/web/src/routes/`

| path | purpose | class | item |
|---|---|---|---|
| `+layout.svelte` | App shell: flex column, print-mode override. Trivial. | SERVES CLOSED | infra |
| `+layout.ts` | Disables SSR, enables prerender; comment names the engine/dictionary/Worker as the reason. | SERVES CLOSED | infra |
| `+page.ts` | Opens the library (`openLibrary()`) in SvelteKit's `load`, before the component exists, per N.67 step 1's own reasoning (race against a timeout so a rejection never blanks the page). | SERVES CLOSED | N.67 step 1 |
| `+page.svelte` | The single route, 6,206 lines (grown from the 1,948 `PRODUCT.md` section "Where the code lives" still cites — that section is now stale by a factor of three). Main orchestrator: wires the library/document/binder (N.67), pairings and heal (N.161), notices, drawer, header. Not read line-by-line at this size; its imports were read and traced (library, pairings, heal, seated-text diff, notices, binder, fingerprint). This is the aggregation point for nearly every closed item in Half A's domain; it is not itself one module serving one item. | SERVES CLOSED (many, via its imports) | N.67, N.157, N.161, and others; see Half A's memo for the component-level detail |
| `fit-font-lab/+page.svelte` | Dev-only three-font (Bravura/Leland/Finale Maestro) taste-test route, not linked from the app shell. Finale Maestro is the ratified product default (2026-07-12). | Dev tool, reachable by URL only | not release surface; not dead code but not a plan item either |

### `packages/score-parser/` and `tools/n168-frequency-run/` config

| path | purpose | class | item |
|---|---|---|---|
| `packages/score-parser/vitest.config.ts` | Test runner config, 15 lines. | infra | n/a |
| `tools/n168-frequency-run/vitest.config.ts` | Test runner config for the frequency-run tool, 40 lines. | infra | N.168 |

### `scripts/`

| path | purpose | class | item |
|---|---|---|---|
| `build-dictionary.ts` | Three-pass streaming dictionary build from Kaikki.org Wiktionary JSONL (English plus French cross-reference), per `DICTIONARY_REBUILD_PLAN_FINAL.md`. Build-time tool, not shipped in the app bundle. | SERVES CLOSED | dictionary build pipeline |

### `tools/n168-frequency-run/`

| path | purpose | class | item |
|---|---|---|---|
| `frequency-run.run.ts` | N.168 step 2: reads Dann's sixteen Finale files read-only, resolves every sung vowel, computes `NoteCondition` per note for eight voices (Mitton, Godin, six literature test voices), writes per-voice CSVs and P1a candidate counts to `out/`. Output confirmed present for all eight voices (`out/notes-*.csv`, `out/p1a-counts.csv`, `out/frequency-run.md`) — matches `STATE.md`'s "step 2 shipped `10e090c`." | SERVES OPEN | N.168 step 2 (done); steps 3+ (coverage audit, targeted extraction) are Half A / product-side |

### `tools/e16-harness/`

| path | purpose | class | item |
|---|---|---|---|
| `_rhythm_spike/*.ts` (5 files: `score.ts`, `score_e264_fixed.ts`, `score_e264_v2.ts`, `score_pitch.ts`, `score_rng.ts`, `scorer_local.ts`) | An earlier, self-contained rhythm-scoring spike, separate from the main harness's `scorer.ts`. Not imported by the main harness (`run-harness.ts` imports `./scorer`, not `_rhythm_spike/scorer_local`). | DEAD/ORPHANED relative to the shipped harness | pre-E.16-harness spike; candidate for N.86 |
| `src/denigma-convert.ts` | Headless `.musx` to MNX conversion for the harness, reusing the product's own denigma WASM artifact read-only. | SERVES OPEN | see section 2, E.16 harness |
| `src/ground-truth.ts` | Extracts the harness's answer key via the product's real parse path (denigma to MNX to `MnxScoreParser`), reusing `sungVerseNumbers`. | SERVES OPEN | see section 2 |
| `src/normalized-format.ts` | The `RecognizedOutput` schema every OMR-engine adapter converts into. | SERVES OPEN | see section 2 |
| `src/render.ts` | `.musx` to full-page image, via a musx2mxl/Verovio/rsvg-convert chain independent of the denigma/MNX ground-truth path (deliberately, to avoid circularity). | SERVES OPEN | see section 2 |
| `src/run-harness.ts` | The harness's single entry point, wiring convert, ground-truth, render, recognize (stub), score. | SERVES OPEN | see section 2 |
| `src/scorer.ts` | Scores a recognizer's output against ground truth: pitch/rhythm precision-recall-F1, mean shift, tessitura delta, Alignment Error Rate. | SERVES OPEN | see section 2 |
| `src/self-test.ts` | The scorer's own positive/negative control against a synthetic fixture, no external tool dependency. | SERVES OPEN | see section 2 |
| `src/stub-adapter.ts` | The "perfect recognizer" positive-control fixture (echoes ground truth). | SERVES OPEN | see section 2 |
| `src/corrupted-adapter.ts` | The negative-control fixture: three deliberate corruptions (drop a note, shift a pitch, mis-attach a syllable). | SERVES OPEN | see section 2 |
| `src/adapters/homr-adapter.ts` | Adapts homr's real MusicXML output (v0.6.2, all six Sunless pieces, 22 pages) to `RecognizedOutput`. | SERVES OPEN | see section 2 |
| `src/adapters/oemer-adapter.ts` | Adapts oemer's real MusicXML output (v0.1.5, one page verified) to `RecognizedOutput`. | SERVES OPEN | see section 2 |
| `src/adapters/run-homr-score.ts` | Scores the archived homr output against the archived ground truth; does not re-render or re-extract. | SERVES OPEN | see section 2 |
| `src/adapters/run-oemer-score.ts` | Scores the archived oemer output (one page) against ground truth. | SERVES OPEN | see section 2 |

---

## 5. NOT ESTABLISHED

- **Whether `pickup.ts` is the shipped fix N.169's fifth-finding note refers to, or a separate build.** The
  rule and the ruling match exactly; the commit hash is not named in the file or cross-checked against
  `LOG.md` block-by-block in this run. See section 2.
- **Whether `sustain.ts:61-84`'s and `watchlist.ts:229-244`'s (Half A) duplicated `activeTempoAt` read the
  corrected (post-N.128) line or the reader's raw events.** `OWED.md:52-60` states this exact question is
  still open; resolving it needs tracing the call sites that hand each function its `tempos`/`ev` arguments,
  which cross into Half A's `overlay-engine.ts` callers and `watchlist.ts` itself. Not resolved here.
  Additionally not established: whether either duplicate should instead call `tempo-seam.ts`'s own
  `resolveTempo`/seam machinery, which was built specifically to replace both. That module exists and is
  wired elsewhere (`score-metrics.ts`), but `sustain.ts`'s own local `activeTempoAt` was not refactored onto
  it — NOT ESTABLISHED whether that is deliberate (different contract) or a miss.
- **Whether `staff-renderer.ts`'s open-item ties (N.140, N.141, N.165) are current.** This half traced the
  module's wiring and size only; the open-item detail for the loupe/squircle/blank-loupe defects lives in
  call sites under `apps/web/src/lib/shane` and `apps/web/src/lib/components`, which are Half A's assignment.
- **Whether the E.16 harness (`tools/e16-harness/`) is still wanted, superseded, or feeds N.83's walkthrough
  datum.** No open item names its current purpose beyond N.37 (the stale README). NOT read: whether any
  session decided to retire it or fold its OMR comparisons into N.83's own accuracy measurement.
- **`PRODUCT.md` section "Where the code lives" is stale.** It states `+page.svelte` is 1,948 lines; it is
  6,206. Not fixed here (read-only), flagged for whoever next edits `PRODUCT.md`.
- **`_rhythm_spike/` inside `tools/e16-harness/`** was classified DEAD relative to the harness's own current
  entry point by one import check (`run-harness.ts` imports `./scorer`, not `_rhythm_spike/scorer_local`);
  a second entry point elsewhere in the repo that imports it directly was not exhaustively ruled out beyond
  the whole-tree grep already run.
