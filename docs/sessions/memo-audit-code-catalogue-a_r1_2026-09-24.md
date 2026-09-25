# Code catalogue, half A: apps/web/src/lib/

Audit run 2026-09-24, read-only. 140 source files (`.ts`, `.svelte`, `.js`; tests and
`.d.ts` excluded) under `apps/web/src/lib/`. Method: header comment, exports, and
call-site greps, per the brief; not every body line was read. Canadian spelling, no
em dashes, as instructed.

## 1. Built but described as unbuilt

| Item | What the plan says | What the tree has | Evidence |
|---|---|---|---|
| **N.140.** The loupe guarantees a stave space and scrolls rather than shrinking below it. | Tracked `[ ]` open, "UNPLACED" (`OPEN.md:552`, `STATE.md` under "Numbered 2026-09-14"). Dann's design of 2026-09-14, never marked built anywhere read in `STATE.md` or `SEQUENCE.md`. | The core mechanism is already shipped, as a side effect of the now-CLOSED N.153 stage 3b. `Loupe.svelte:1215-1223`: "THE SCALE IS NO LONGER FITTED... The loupe now widens its own engraving to reach the tap floor... Clause 8: the notation's point size is the fixed quantity and the window is the variable one. The strip may now be wider than the window, which scrolls it." And `Loupe.svelte:2818-2826`, the `.loupe-window` rule: "The strip is no longer scaled down to fit the window (clause 8), so a measure whose derived spacing is wider than the room scrolls sideways instead," with `overflow-x: auto; touch-action: pan-x`. **What genuinely remains open**, per the same comment: "whether the scroll may keep a horizontal gesture on a surface where a tap places a syllable is N.140's question" -- narrower than the tracker entry implies. | `apps/web/src/lib/shane/Loupe.svelte:1215-1223,2818-2826` |

No other case surfaced in half A where an item's own tracked state ("open"/"unplaced")
flatly contradicts a grep of the code. Two near misses, checked and ruled out: N.151
(measure edit surface with insert) had already corrected itself in `OPEN.md` on
2026-09-17 ("insertion is BUILT... the item is tether 22, not a missing capability")
before this audit began, so it is not a new finding here. N.164 (Insights prints two
contradictory sentences) was checked directly against the live strings,
`i18n.ts:1498` (`insights.verdict.cannotSay`) and `i18n.ts:1500`
(`insights.findings.none`); both are still present verbatim, so that item is
accurately open, not a false negative.

## 2. Undescribed

| Module | What it does | Proposed title |
|---|---|---|
| `apps/web/src/lib/shane/reconciliation/` (`types.ts`, `taxonomy.ts`, `witnesses.ts`) plus `apps/web/src/lib/shane/TextualWitnesses.svelte` | A four-piece "reconciliation shell" (the component's own phrase, `TextualWitnesses.svelte:8`) comparing two witnesses of one text, the poem and the score's underlay: a divergence data model, a taxonomy classifying each disparity, a drawer view-model, and a collapsed drawer section listing surfaced divergences by measure. Built to a real spec (`kimi-brief-lyric-reconciliation`, Kimi's Q1-Q6, handover v39 §A.36), but `TextualWitnesses.svelte` is never imported anywhere in the repository (empty grep in §3), so the whole shell is unreachable from the running app. | "The reconciliation shell was built and never wired into the drawer" |
| `apps/web/src/lib/shane/notation-overlay.ts` | `notationOnlyOverlay(parsed)` builds a typed `AnalyzedScore` stand-in with no acoustic marks, for the 2026-07-13 "notation first" slice-1 scope. `VoiceProfilePane.svelte` now carries its own comment at three sites (`:117`, `:531`, `:984`) saying its live code "replaces notationOnlyOverlay." Only the module's own test file still calls the export. | "Retire or reconnect the superseded notation-only overlay" |

Neither module has an entry under any item number surfaced by this audit's reading of
`OPEN.md`, `STATE.md`, or the `LOG.md` sections grepped for related terms
("reconciliation shell", "textual witness": zero hits in all three). Both feed N.86,
the dead-code and structure audit, as much as they are undescribed: nothing names
them, and neither is reachable from the app today.

## 3. Dead or orphaned

- **`apps/web/src/lib/shane/TextualWitnesses.svelte`.** Empty grep, whole repository:
  `grep -rn "TextualWitnesses" --include='*.svelte' --include='*.ts' .` returns exactly
  one hit, a comment inside `reconciliation/witnesses.ts:4` naming the file in prose.
  No `.svelte` mounts it and no route or component imports it.
- **`apps/web/src/lib/shane/reconciliation/witnesses.ts`.** Reachable only through the
  orphaned component above and its own test file
  (`reconciliation/witnesses.test.ts:2`). `grep -rn "reconciliation/witnesses\|from '\./witnesses'"`
  outside those two files returns nothing.
- **`apps/web/src/lib/shane/reconciliation/taxonomy.ts`.** Reachable only through the
  orphaned `witnesses.ts` above (`witnesses.ts:18`) and its own test
  (`taxonomy.test.ts:2`). Same empty grep outside those two files.
- (`reconciliation/types.ts` is NOT dead: `underlay-donor.ts`, a live production
  module, imports it directly. It stays out of this list.)
- **`apps/web/src/lib/shane/notation-overlay.ts`, suspect.** `grep -rn "notationOnlyOverlay"`
  across the whole tree returns only the module's own definition, its own test file,
  and two comments in `VoiceProfilePane.svelte` (`:117`, `:531`) that name it as
  something the live code *replaces*. No production caller remains.
- **`apps/web/src/lib/shane/analyze-per-verse.ts`, suspect, not confirmed.**
  `grep -rn "analyzePerVerse"` across the whole tree returns only the module's own
  definition and its own test file (`analyze-per-verse.test.ts`). NOT ESTABLISHED
  whether a live caller reaches it indirectly through a path this grep missed (a
  dynamic import, or a re-export from a barrel file this audit did not expand); flagged
  for the next reading of `pipeline.ts`'s callers rather than asserted dead.

All five feed N.86, the dead-code audit, per the brief.

## 4. The full catalogue

One row per module, or a folder of tightly related files where the brief allows
grouping. "Item" cites the plan number where the header comment or a call-site
cross-check supports it; CLOSED means the item's own tracker row is `[x]` or it does
not appear among the sixteen `[ ]`/`[D]`/`[~]` rows read in `STATE.md` §THE TRACKER.

| Module | Purpose | Class | Item |
|---|---|---|---|
| `components/DeskHead.svelte` | One line across the desk's top, replacing the old `Drawer/TabBar.svelte`. | SERVES CLOSED | N.73 S1 |
| `components/Drawer/AnalysisStation.svelte` | The transcription console, extracted into a Text-group station. | SERVES CLOSED | N.108 increment 1 |
| `components/Drawer/Drawer.svelte` (1,990 lines) | The drawer shell: bands, stations, retraction, the path. | SERVES CLOSED | N.65, N.108, N.115 |
| `components/Drawer/InspectorPanel.svelte` (2,432 lines) | Word-stack and correction inspector surface. | SERVES CLOSED | N.121 (general drawer surface; precise number NOT ESTABLISHED beyond that) |
| `components/Drawer/IntakePanel.svelte` | The Input band's text intake, placeholder and hint copy. | SERVES CLOSED | N.121 |
| `components/Drawer/MetadataFields.svelte` | Song-metadata block, shared by Transcription and Fit drawers. | SERVES CLOSED | N.114b (handover v35 §E.5b) |
| `components/Drawer/NotationFields.svelte` | The Notation section, extracted from `RootPanel`. | SERVES CLOSED | N.7 |
| `components/Drawer/RootPanel.svelte` | Drawer root composing the stations. | SERVES CLOSED | general drawer grammar |
| `components/Drawer/SearchableSelect.svelte` | Composer/poet searchable picker. | SERVES CLOSED | general (number NOT ESTABLISHED) |
| `components/Drawer/SongList.svelte` | The library door: song list inside the drawer. | SERVES CLOSED | N.67 step 4b |
| `components/Drawer/StationHeader.svelte` | One owner for every station's header row. | SERVES CLOSED | N.65 |
| `components/Drawer/VoiceAnchor.svelte` | Foot-of-drawer voice state line and calibration link. | SERVES CLOSED | N.73 S3 |
| `components/Drawer/bandState.ts` | What a closed band's one summary line says. | SERVES CLOSED | N.115 |
| `components/Drawer/gesture.ts` | The vertical swipe that raises/lowers the drawer on phone. | SERVES CLOSED | N.108 increment 1a |
| `components/Drawer/layout.ts` | Desk-vs-phone width breakpoints for the drawer. | SERVES CLOSED | N.108 increment 1a |
| `components/Drawer/sections.svelte.ts` | The drawer's one retraction mechanism (open/closed state). | SERVES CLOSED | N.65 ship B |
| `components/HeaderBar.svelte` | The top destination bar. | SERVES CLOSED | general (destinations model) |
| `components/InstallPrompt.svelte` | PWA install prompt, decline persistence. | SERVES CLOSED | N.105, N.70 |
| `components/Paper/PageFit.svelte` | The fitted single page, portrait and marked-score. | SERVES CLOSED | N.73 portrait C, C2 |
| `components/Paper/PageFooter.svelte` | Footer: provenance legend, colophon, page number. | SERVES CLOSED (existing colophon) / touches OPEN | N.89 (document furniture redesign is a separate, still-unbuilt ratified drawing; NOT ESTABLISHED whether this file already reflects any part of it beyond what predates N.89) |
| `components/Paper/Paper.svelte` | Top-level page-rendering composition. | SERVES CLOSED | general paper layout |
| `components/Paper/ReadingPaper.svelte` | The Guide/Learn reading surface's paper chrome. | SERVES CLOSED | general |
| `components/Paper/RunningHeader.svelte` | The running head on pages 2+. | SERVES CLOSED | general |
| `components/Paper/SubsequentPage.svelte` | Pages after the title page. | SERVES CLOSED | general |
| `components/Paper/TitleHeader.svelte` | Page-one title block. | SERVES CLOSED | general |
| `components/Paper/TitlePage.svelte` | The title page layout. | SERVES CLOSED | general |
| `components/Paper/VerseLine.svelte` | One verse line of word-stacks. | SERVES CLOSED | general |
| `components/Paper/WordStack.svelte` | One word's stacked notation/IPA/gloss display. | SERVES CLOSED | general |
| `components/Reading/GuideContent.svelte` (610 lines) | The Guide document's content. | SERVES OPEN | N.84 (Guide redo), unscheduled per `SEQUENCE.md:163` ("after N.114") |
| `components/Reading/LearnContent.svelte` (4,099 lines) | The Learn document's content, largest file in half A. | SERVES OPEN | N.84 |
| `components/ReadingAid.svelte` | The non-page reading aid surface. | SERVES CLOSED | N.73 portrait C, rulings 4 and 5 |
| `composers-poets.ts` | Curated composer/poet lookup tables, EN/FR/Cyrillic. | data table | general, undated |
| `destinations.ts` | The `Destination`/`TabId` types Studio's documents key on. | SERVES CLOSED | N.73 S1 |
| `gloss-resolve.ts` | Bilateral EN/FR gloss fallback. | SERVES CLOSED | decision E, 2026-06-12 |
| `i18n.ts` (1,597 lines) | The EN/FR string table, ~622+ entries. | SERVES CLOSED + OPEN | CLOSED: N.130 (Insights French). OPEN: N.131 (parity elsewhere, ~64 entries); small unplaced strings for N.82, N.94, N.89 per `OPEN.md:331-333` |
| `install-decline.ts` | How long a declined install stays declined. | SERVES CLOSED | N.105 |
| `library/binder.ts` | The `.ilya` archive format, read and written. | SERVES CLOSED | N.67 step 5 |
| `library/channel.ts` | Cross-tab awareness (no locking yet). | SERVES CLOSED | N.67 step 1 addendum |
| `library/document.svelte.ts` | Per-song document object, Fable's save socket. | SERVES CLOSED | N.67 step 0 |
| `library/driver.ts` | LEGACY, MEMORY and IndexedDB storage drivers. | SERVES CLOSED | N.67 steps 0-1 |
| `library/exchange.ts` | What passes between the vault and a binder file. | SERVES CLOSED | N.67 step 5 |
| `library/fingerprint.ts` | SHA-256 recognition hashes, not identity. | SERVES CLOSED | N.67 step 2 |
| `library/idb.ts` | Minimal hand-written IndexedDB promise wrapper. | SERVES CLOSED | N.67 step 1 |
| `library/index.ts` | Boot-time library open, migration, driver choice. | SERVES CLOSED | N.67 step 1 |
| `library/library.ts` | The storage facade, plain TypeScript. | SERVES CLOSED | N.67 step 0 |
| `library/migration.ts` | One-way move of six legacy localStorage keys into the vault. | SERVES CLOSED | N.67 step 1 |
| `library/notices.ts` | What storage tells the singer, and when. | SERVES CLOSED | N.67 step 6 |
| `library/quota.ts` | `navigator.storage.persist()`/`.estimate()` wrapper. | SERVES CLOSED | N.67 step 1 |
| `library/songs.ts` | The library door's six operations. | SERVES CLOSED | N.67 step 4b |
| `library/types.ts` | The library record's schema. | SERVES CLOSED | N.67 step 0 |
| `library/zip-writer.ts` | Byte-honest ZIP writer, promoted from a test fixture. | SERVES CLOSED | N.67 step 5 |
| `loader.ts` | Chunked, incremental NDJSON dictionary loader. | infra | CLOSED, undated in this reading |
| `metadata-provenance.ts` | Which score-header fields filled metadata, and their fate on a second score. | SERVES CLOSED | E.24 |
| `one-action.ts` | Transcribe-and-Continue as one action. | SERVES CLOSED | N.108-5 |
| `page-config.ts` | Fixed page-box layout constants. | infra | general |
| `pipeline.ts` (1,064 lines) | Core text-to-transcription pipeline, orchestrates the phonology/dictionary packages. | infra | general, core |
| `provenance.ts` | Provenance icon logic and legend building. | infra | general |
| `reading-aid.ts` | The reading aid's verse arithmetic. | SERVES CLOSED | N.73 portrait C, ruling 5 |
| `reconstitution.ts` | Grayson Ch. 3 §8 vowel reconstitution for slow/sustained notes. | SERVES CLOSED | Grayson-rule implementation, undated |
| `shane/CalibrationWizard.svelte` (2,080 lines) | The "Your Resonances" guided calibration wizard. | SERVES CLOSED | 2026-06-30 spec |
| `shane/CorrectionSurface.svelte` (1,265 lines) | The four correction stations: duration, pitch, accidental/entry, lyric. | SERVES CLOSED + OPEN | CLOSED: N.92 slices 2-4. OPEN remainder: N.92's four singer's marks, tie-to-note-before, page flag for a measure left over (`STATE.md` "Numbered 2026-09-16" row) |
| `shane/InsightsPane.svelte` (1,028 lines) | Insights, Studio's third document, page one. | SERVES CLOSED + OPEN | CLOSED: N.127 increment 1. OPEN: N.164 (contradictory verdict text, confirmed still present, see §1) |
| `shane/Loupe.svelte` (3,054 lines) | The magnified editing frame over a held measure, largest half-A component. | SERVES CLOSED + OPEN | CLOSED: N.92 mobile slice 2, N.153 (all 5 stages). OPEN: N.140 (see §1, largely built already), N.165 (loupe draws no notes, bug), N.162 (caret/note thumb conflict, spec not yet written) |
| `shane/LoupeSyllables.svelte` | The syllable accordion row under the loupe's notes. | SERVES CLOSED | N.147 |
| `shane/NotePicker.svelte` / `shane/note-picker.ts` | Typed pitch capture for the six voice-characteristics fields. | SERVES CLOSED | E.5 slice 3 |
| `shane/ProfileSwitcher.svelte` / `shane/profileStore.ts` | Voice-switcher header and multi-profile persistence. | SERVES CLOSED | v1/v2, 2026-07-11 |
| `shane/ScoreUploader.svelte` (1,340 lines) | The Fit ingest widget: drag/drop, auto-detect, provenance treatment. | SERVES CLOSED + OPEN | CLOSED: N.59 base. OPEN: N.166 (stored scan re-reads the whole reader on reload, measured and NOT fixed), N.167 (reader-wait copy can stay English for a French singer) |
| `shane/Tessituragram.svelte` (361 lines) | The tessituragram, joined to the phonation-time section. | SERVES CLOSED | N.123 (built and placed in, per `OPEN.md:159-178`; design shipped `ccb790c`) |
| `shane/TextualWitnesses.svelte` | Collapsed "Textual witnesses" drawer section. | DEAD OR ORPHANED | see §3 |
| `shane/VoiceProfilePane.svelte` (1,490 lines) | The Shane tab's main pane, the score/voice envelope. | SERVES CLOSED | multiple, handover v30 §C.1/§R, 2026-07-11 |
| `shane/advice-resolver.ts` | Fit's prescriptive advice layer, pure post-pass. | SERVES CLOSED | framework §4 |
| `shane/analyze-per-verse.ts` | Per-verse acoustic overlay, one `AnalyzedScore` per sung verse. | DEAD OR ORPHANED, suspect | see §3 |
| `shane/analyze-score-adapter.ts` | Voice profile to overlay-engine snapshot adapter. | SERVES CLOSED | E.5 slice 4 |
| `shane/clitic-seat.ts` | A vowelless clitic seated alone under a pitch, forbidden. | SERVES CLOSED | N.111 |
| `shane/correction.ts` | Hand correction of a read, as pure data (ALTER/DELETE). | SERVES CLOSED | N.92 first slice |
| `shane/engine/*` (22 files: `analyze.ts`, `derivations.ts`, `detector.ts`, `divergence.ts`, `dsp.ts`, `errors.ts`, `extract.ts`, `guard.ts`, `live.ts`, `mscz-converter.ts`, `notation-fonts.ts`, `page-image.ts`, `page-pdf.ts`, `page-reader.ts`, `page-reader.worker.ts`, `plausibility.ts`, `readiness.ts`, `score-reader.ts`, `score-reader.worker.ts`, `session.ts`, `staff-detect.ts`, `stub.ts`, `types.ts`, `vendor/webmscore.js`) | The Shane capture/analysis engine: DSP primitives, live capture session, score and page reader Workers, error model, plausibility guard, MuseScore/PDF conversion. | SERVES CLOSED | Shane engine spec v1 (2026-06-09), N.59 (page reader), N.146 (`staff-detect.ts`) |
| `shane/engraving.ts` | User-adjustable notation-geometry preferences. | SERVES CLOSED | Appendix B/C proportions, 2026-07-13 |
| `shane/entry.ts` | Note-entry grammar: insert, convert, extend. | SERVES CLOSED | N.92 mobile slice 3 |
| `shane/first-seat.ts` | Whether a first transcription over an attached score seats at once. | SERVES CLOSED | N.145 |
| `shane/fit-legend.ts` | The Fit provenance legend, minimal form. | SERVES CLOSED | item 1.6, E.22 |
| `shane/heal.ts` | Dry run only: how the heal would re-find each seat's word. Writes nothing. | SERVES CLOSED (dry run) / feeds OPEN | N.160 step 2 built; steps 4-5 wait until after 2026-10-30 |
| `shane/ingestion/*` (9 files: `clef-key-prompt.ts`, `format-detection.ts`, `ingest.ts`, `mini-dom.ts`, `ocr-guard.ts`, `poem-or-score.ts`, `recognized-to-musicxml.ts`, `recognized.ts`, `zip-fixture.ts`, `zip-reader.ts`) | Score-file format detection and dispatch, OCR-garble refusal, ZIP/MusicXML handling. | SERVES CLOSED | N.59, N.146 |
| `shane/insights.ts` (733 lines) | Insights' computed numbers, page one, nothing else. | SERVES CLOSED + OPEN | CLOSED: N.127 increment 1. OPEN: N.164 |
| `shane/loupe-render-bundle.ts` | What the loupe needs to render one measure, as data. | SERVES CLOSED | N.153 stage 2 |
| `shane/loupe-render.ts` | The loupe's own single-measure render at its own spacing. | SERVES CLOSED | N.153 stage 3b (also builds N.140's mechanism, see §1) |
| `shane/loupe.ts` (905 lines) | Pure arithmetic behind the loupe's view transform. | SERVES CLOSED | N.92 mobile slice 2 |
| `shane/notation-overlay.ts` | Notation-only `AnalyzedScore` stand-in, no acoustic marks. | DEAD OR ORPHANED, suspect / UNDESCRIBED | see §2, §3 |
| `shane/note-picker.ts` | See `NotePicker.svelte` row. | SERVES CLOSED | E.5 slice 3 |
| `shane/pacifier/Pacifier.svelte`, `shane/pacifier/contrast.ts` | The per-vowel calibration "pacifier" UI and its WCAG contrast checks. | SERVES CLOSED | pre-N.92 pacifier feature |
| `shane/pairings.ts` (1,423 lines) | The sparse correction map, score event ID to singer decision. | SERVES CLOSED + OPEN | CLOSED: N.55b. OPEN: `mergeOnUpload` (`:389`) still hands back the map untouched on a score replacement, which is N.157's defect, confirmed still true at `clitic-seat.ts:442` |
| `shane/reconciliation/taxonomy.ts` | Disparity taxonomy for the reconciliation shell. | DEAD OR ORPHANED / UNDESCRIBED | see §2, §3 |
| `shane/reconciliation/types.ts` | The reconciliation shell's divergence data model. | SERVES CLOSED (alive via `underlay-donor.ts`) | N.10 (its live consumer) |
| `shane/reconciliation/witnesses.ts` | Drawer view-model for the reconciliation shell. | DEAD OR ORPHANED / UNDESCRIBED | see §2, §3 |
| `shane/reseat.ts` | The seats follow the diff. | SERVES CLOSED + touches OPEN | CLOSED: N.112 increment 2, amended by N.113a. Cited in N.157's account of `mergeOnUpload` (`reseat.ts:185`) |
| `shane/score-metrics.ts` | Parsed score to the four E.20 measurement quantities. | SERVES CLOSED | E.20 measurement layer |
| `shane/score-seat.ts` | A score that arrives carrying words seats them on its own notes. | SERVES CLOSED + touches OPEN | CLOSED: N.134. `seatScoreWords` (`:78`) "runs only into an EMPTY map," part of N.157's defect |
| `shane/seated-text.ts` | The re-seat diffs against the seated text, not the session grid. | SERVES CLOSED | N.160 step 3 |
| `shane/selection-ring.ts` | The squircle that marks the taken note. | SERVES CLOSED + OPEN | CLOSED: N.141 height rule (`6101e01`, walked). OPEN: squircle-across-a-tie, waits on N.142; viewBox clamp on two notes |
| `shane/system-ground.ts` | Where a mark sits in a rendered system. | SERVES CLOSED | N.133 |
| `shane/underlay-donor.ts` | Which Transcribe word donates to a score word. | SERVES CLOSED | N.10 |
| `shane/vowel-resolver.ts` (624 lines) | The GraysonEngine vowel resolver, the Shane/Ilya seam. | SERVES CLOSED | v38 §E.5 |
| `shane/waiting-seat.ts` | What `transcribeText` does when a score seat is waiting on the dictionary. | SERVES CLOSED | N.161b |
| `shane/watchlist.ts` (591 lines) | The head-of-score "Places to watch" list. | SERVES CLOSED + OPEN | CLOSED: Fit design C. OPEN: watch band's English header at `watchlist.ts:92`, printed in French mode (`STATE.md` "visible list", unnumbered) |
| `syllable-utils.ts` | Open-syllabification re-slicing and IPA display recompute. | infra | general |
| `text-diff.ts` | One word diff, used everywhere; the text is authoritative. | SERVES CLOSED | N.112 |
| `types.ts` | Shared data interfaces, pipeline to components. | infra | general |
| `wall.ts` (7 lines) | The `PUBLIC_INCLUDE_SHANE` build-time feature gate. | SERVES OPEN | its fate ("whose fate this audit rules") is explicitly handed to N.86, `LOG.md:639,663` |

## 5. NOT ESTABLISHED

- Several rows above are marked SERVES CLOSED "general" with no item number: `HeaderBar.svelte`,
  most of `Paper/*`, `loader.ts`, `page-config.ts`, `pipeline.ts`, `provenance.ts`,
  `syllable-utils.ts`, `types.ts`, `composers-poets.ts`, `SearchableSelect.svelte`,
  `RootPanel.svelte`. These are plainly built and in active use (import counts confirm
  it), but no item number in `OPEN.md`/`STATE.md`/`LOG.md` was found, in the reading
  done for this audit, naming them individually. They are core infrastructure rather
  than undescribed features, so they are not listed in §2.
- `components/Paper/PageFooter.svelte` against N.89: NOT ESTABLISHED whether the
  existing colophon (`i18n.ts:732-734`, the CC BY-SA attribution and Canada flag SVG)
  is what N.89's "two-tier colophon... MIT licence joins the secondary line" is meant
  to replace, or a different, earlier piece of furniture N.89 leaves alone. No "MIT"
  string exists anywhere in `i18n.ts` or `PageFooter.svelte`, so N.89's specific design
  does not appear built, but this audit did not read `OPEN.md`'s N.89 section in full
  (only the `LOG.md` 2026-08-24 ratification and the "open and unplaced" note at
  `OPEN.md:331-333`) and did not open the two cited drawing files.
- `shane/analyze-per-verse.ts`: NOT ESTABLISHED whether it is truly unreachable in
  production, only that a text grep for its export found no caller outside its own
  test file. A caller reached through a re-export or a dynamic string was not ruled
  out.
- Exact item numbers for several "general" SERVES CLOSED rows in `library/*` (which
  step of N.67 each individual file serves) come from each file's own header comment,
  not cross-checked against `OPEN.md`'s N.67 spec text; NOT ESTABLISHED against the
  plan document itself, only against the code's own account of itself.
- This audit did not open `docs/memory/OWED.md`, which `STATE.md` says now carries the
  "OWED" and "STILL UNSETTLED" sections verbatim; some small open items possibly
  touching half-A modules (the watch band's French, N.82; N.94) may have fuller
  accounts there than what `OPEN.md`'s small mentions gave.
