# Ilya codemap (draft), built from the tree at HEAD `b7c2fc6`, branch `Shane`

Read-only. Built from directory listings, `package.json` files, and import greps run this session, not from any existing doc. Shaped per matklad's ARCHITECTURE.md advice: coarse-grained, answering "where is the thing that does X" and "what does the thing I'm looking at do." Line counts are `wc -l` run this session; import edges are `grep -rl` run this session and are not exhaustive call-graph analysis.

## Packages (`packages/*`, each an independent pnpm workspace member)

| package | job | public entry point | imports from |
|---|---|---|---|
| `@ilya/phonology` | The GraysonEngine: rule-based Russian phonological analysis (stress, vowel reduction, palatalization, clitic chains) per Grayson (2012). `engine.ts` is 2,276 lines, the largest single file in this package cluster. | `src/index.ts` (barrel: `transcribeWord`, `GraysonEngine`, etc.) | `@ilya/dictionary` (`packages/phonology/package.json` `dependencies`; confirmed by `grep -rl "@ilya/dictionary" packages/phonology/src` this session hitting `engine.ts`) |
| `@ilya/dictionary` | Dictionary loading, stress lookup, gloss pipeline: EN/FR gloss extraction and curated overrides, Cyrillic stress-mark display, poetic and pre-reform (pre-1918) orthography normalizers. | `src/index.ts` | Nothing in-repo (no `@ilya/*` import found in `packages/dictionary/src` this session); depends only on its own data and `vitest`/`typescript` devDependencies |
| `@ilya/blurb` | Context-aware educational "why Ilya made this choice" explanations shown when a singer clicks a word (Identity-Process-Implication data model). | `src/index.ts` | Nothing in-repo (no `@ilya/*` import found in `packages/blurb/src` this session) |
| `@ilya/score-parser` | Dual-canonical (MNX + MusicXML) score ingestion into one `ParsedScore` type; the acoustic-analysis and engraving layer beneath Fit: parsers, tempo/phonation/tessitura measurement, transposition search, pagination, and the bespoke SVG staff renderer (`staff-renderer.ts`, 3,534 lines, the largest file in this package). Independently testable (65 source files, most with a co-located `*.test.ts`). | `src/index.ts` (types, both parsers, `renderer-output.ts`, the "E.20 measurement layer": phonation, diction-mark fold, tessitura, tempo seam) | Nothing in-repo per this session's `grep -rn "from ['\"].*apps" packages/*/src` (empty) and no `@ilya/*` cross-import found; it is the one package with no dependency on any other `@ilya/*` package |

No `packages/*` file imports from `apps/` (confirmed this session: `grep -rn "from ['\"].*apps" packages/*/src` returns nothing), so the CONTRIBUTING.md/AGENTS.md claim of clean package boundaries holds in this one direction. Dependency direction among packages: `phonology` → `dictionary`; `blurb`, `dictionary`, `score-parser` depend on nothing else in the monorepo.

## `apps/web/src/routes/` (SvelteKit routes)

| file | job | entry point | imports from |
|---|---|---|---|
| `+layout.svelte` | App shell: flex-column wrapper, print-mode override. | Svelte layout convention | trivial, no notable imports (per `memo-audit-code-catalogue-b_r1_2026-09-24.md:156`, not independently re-read this session) |
| `+layout.ts` | Disables SSR, enables prerender (denigma/dictionary/Worker need a browser). | SvelteKit `load`/config convention | none |
| `+page.ts` | Opens the song library (`openLibrary()`) in SvelteKit's `load`, ahead of the page component, racing a timeout. | SvelteKit `load` convention | `$lib/library` (per its own stated purpose; not independently re-read this session) |
| `+page.svelte` | **The single application route, 6,225 lines** (`wc -l`, this session). Orchestrates everything: the library/document/binder objects, pairings and heal, storage notices, the drawer, the header, ingest wiring. Not one module serving one feature; the aggregation point most other modules are imported into. | SvelteKit page convention | `$lib/*` broadly: confirmed importing `@ilya/phonology`, `@ilya/dictionary`, `@ilya/blurb` (grep this session), and per `memo-audit-code-catalogue-b_r1_2026-09-24.md:159`, the library/document/binder/pairings/heal/seated-text/notices/fingerprint modules under `$lib` |
| `fit-font-lab/+page.svelte` | Dev-only route comparing three notation fonts (Bravura, Leland, Finale Maestro); not linked from the app shell, reachable only by direct URL. | SvelteKit page convention | none of note; isolated dev tool |

**Docs disagreement, flagged:** `docs/memory/PRODUCT.md:459` states `+page.svelte` is "1,948 lines." It is 6,225. See `inventory.md` for the cross-check against `memo-audit-code-catalogue-b_r1_2026-09-24.md`, which independently caught the same drift one day earlier at 6,206 lines.

## `apps/web/src/lib/` (top level, no subdirectory)

One line each for the 24 top-level files (excluding `*.test.ts`), grouped by job:

| area | files | job |
|---|---|---|
| Core pipeline | `pipeline.ts` (1,064 lines), `types.ts`, `loader.ts` | Orchestrates the phonology/dictionary packages into one text-to-transcription pipeline (`pipeline.ts`); shared data interfaces used by both the pipeline and components (`types.ts`); chunked, incremental NDJSON dictionary loader against IndexedDB (`loader.ts`) |
| Internationalization | `i18n.ts` (1,597 lines) | The EN/FR string table, roughly 622+ keys; the sole source of user-facing copy in both languages |
| Text/gloss support | `gloss-resolve.ts`, `syllable-utils.ts`, `text-diff.ts`, `reconstitution.ts`, `metadata-provenance.ts`, `composers-poets.ts` | Bilateral EN/FR gloss fallback; open-syllabification re-slicing; the one word-diff primitive used everywhere ("the text is authoritative," N.112); Grayson Ch. 3 §8 vowel reconstitution for sustained notes; which score-header fields filled which metadata field, and their fate on a second score; curated composer/poet lookup tables in EN/FR/Cyrillic |
| Page layout constants | `page-config.ts` | Fixed page-box layout constants for the paginated document |
| Provenance/UI state | `provenance.ts`, `install-decline.ts`, `one-action.ts`, `destinations.ts`, `reading-aid.ts`, `wall.ts` | Provenance icon logic and legend building; how long a declined PWA-install prompt stays declined; the "Transcribe and Continue as one action" merge; the `Destination`/`TabId` types the whole app's navigation keys on; the reading aid's verse arithmetic; the seven-line `PUBLIC_INCLUDE_SHANE` build-time feature gate that hides Fit behind a flag |

Imports from: `@ilya/phonology`, `@ilya/dictionary`, `@ilya/blurb` (confirmed by grep this session, hitting `pipeline.ts`, `loader.ts`, `types.ts`); `$lib/shane/*` (confirmed: `syllable-utils.ts` imports `@ilya/phonology`; `vowel-resolver.ts` under `shane/` imports `$lib/pipeline` and `$lib/syllable-utils`, so the dependency runs both ways between this level and `shane/`, which is worth a closer look in a later phase).

## `apps/web/src/lib/components/` (four subdirectories, one flat file)

| directory/file | job | entry points | imports from |
|---|---|---|---|
| `DeskHead.svelte` (flat file) | The single line across the desk's top; replaces the old `Drawer/TabBar.svelte`. | Svelte component | `$lib/destinations`, `$lib/i18n` (typical for this layer; not individually re-read this session) |
| `HeaderBar.svelte` (flat file) | The top destination bar. | Svelte component | as above |
| `InstallPrompt.svelte` (flat file) | PWA install prompt with decline persistence. | Svelte component | `$lib/install-decline` |
| `ReadingAid.svelte` (flat file) | The non-paginated reading aid surface for portrait mobile (Learn/Guide). | Svelte component | `@ilya/phonology` (confirmed by grep this session) |
| `Paper/` (9 files: `PageFit.svelte`, `PageFooter.svelte`, `Paper.svelte`, `ReadingPaper.svelte`, `RunningHeader.svelte`, `SubsequentPage.svelte`, `TitleHeader.svelte`, `TitlePage.svelte`, `VerseLine.svelte`, `WordStack.svelte` — 10 files) | The WYSIWYG paginated study-edition document: the fitted single page, the footer (provenance legend, colophon, page number), the title page and running heads, one verse line of word-stacks, one word's stacked IPA/Cyrillic/gloss display. This is the "paper is a GUI" surface per `docs/memory/PRODUCT.md:94`. | `Paper.svelte` as the top-level composition | `@ilya/phonology`, `@ilya/dictionary`, `@ilya/blurb` (`TitlePage.svelte`, `Paper.svelte`, `VerseLine.svelte`, `WordStack.svelte`, `SubsequentPage.svelte` all confirmed importing `@ilya/phonology` by grep this session) |
| `Drawer/` (17 files, 11 `.svelte` + 6 `.ts`, several with co-located tests) | The manipulation surface: the drawer shell (`Drawer.svelte`, 1,990 lines), the drawer root composing stations (`RootPanel.svelte`), the transcription console (`AnalysisStation.svelte`), the word-stack/correction inspector (`InspectorPanel.svelte`, 2,432 lines), text intake (`IntakePanel.svelte`), shared metadata fields (`MetadataFields.svelte`), the notation-preferences section (`NotationFields.svelte`), the composer/poet picker (`SearchableSelect.svelte`), the song list/library door (`SongList.svelte`), one shared station-header row (`StationHeader.svelte`), the foot-of-drawer voice/calibration line (`VoiceAnchor.svelte`), what a closed band's summary line says (`bandState.ts`), the vertical swipe gesture (`gesture.ts`), desk-vs-phone breakpoints (`layout.ts`), the retraction/open-closed state machine (`sections.svelte.ts`). Per `docs/memory/PRODUCT.md:108`, "DRAWER MANIPULATES. PAGE DISPLAYS AND PRINTS." | `RootPanel.svelte`, `Drawer.svelte` | `@ilya/phonology`, `@ilya/dictionary`, `@ilya/blurb` (`InspectorPanel.svelte`, `NotationFields.svelte` confirmed importing at least two of the three by grep this session) |
| `Reading/` (2 files: `GuideContent.svelte`, `LearnContent.svelte` — 4,099 lines, the largest single component in `apps/web/src/lib/components`) | The Guide and Learn documents' actual prose/content, including every phonological rule explanation traced to Grayson. | Svelte components | not independently traced this session; per `memo-audit-code-catalogue-a_r1_2026-09-24.md:102-104`, "SERVES OPEN," tied to item N.84, an unscheduled Guide/Learn redo |

## `apps/web/src/lib/library/` (26 files, the storage layer)

One directory, one job: **the song-persistence vault**, built to the design in `docs/sessions/e52-fable-save-design_r1_2026-08-16.md` and the seam in `e52-fable-save-socket_r1_2026-08-16.md`.

| file | job |
|---|---|
| `library.ts` | The storage facade: plain TypeScript, no reactivity, assembles/validates/migrates records, returns outcomes, never throws or swallows |
| `driver.ts` | `StorageDriver` interface plus LEGACY (localStorage), MEMORY (test), and IndexedDB implementations; the two live in a confirmed **circular dependency** with `library.ts` (see `tool-trials.md`) |
| `document.svelte.ts` | `SongDocument`, the rune-bearing class that owns the six per-song `$state` fields and the autosave lifecycle; the "socket" between `+page.svelte` and the facade |
| `idb.ts` | A minimal hand-written IndexedDB promise wrapper (no `idb`/`dexie` dependency, per the design's explicit rejection of both) |
| `index.ts` | Boot-time library open, migration trigger, driver choice |
| `migration.ts` | One-way move of six legacy localStorage keys into the vault |
| `binder.ts`, `zip-writer.ts`, `exchange.ts` | The `.ilya` ZIP archive format: read, write, and what passes between the vault and a binder file |
| `fingerprint.ts` | SHA-256 recognition hash over the parsed vocal line, for "have I seen this music before," never for identity |
| `songs.ts` | The library door's six operations (list, open, new, rename, delete, switch) |
| `notices.ts` | What storage failure tells the singer, and when |
| `quota.ts` | `navigator.storage.persist()`/`.estimate()` wrapper |
| `channel.ts` | Cross-tab awareness via `BroadcastChannel`, notice-only, no locking |
| `types.ts` | The library record's schema |

Imports from: `$lib/metadata-provenance`, `$lib/shane/pairings`, `$lib/shane/correction`, `$lib/types` (confirmed by grep this session across `driver.ts`, `library.ts`, `types.ts`, `document.svelte.ts`); these four all resolve as `$lib/...` alias imports that dependency-cruiser could not follow without SvelteKit alias configuration (see `tool-trials.md`).

## `apps/web/src/lib/shane/` (Fit's own tree: 74 top-level files + 4 subdirectories)

The repertoire-fit voice-analysis engine, behind `PUBLIC_INCLUDE_SHANE=true`. Grouped by job (full one-line-per-file catalogue already exists in `memo-audit-code-catalogue-a_r1_2026-09-24.md §4`, not repeated file-by-file here per this task's "coarse-grained" instruction):

| area | representative files | job |
|---|---|---|
| The main pane and calibration | `VoiceProfilePane.svelte` (1,490 lines), `CalibrationWizard.svelte` (2,080 lines), `ProfileSwitcher.svelte`/`profileStore.ts` | Fit's main pane (the score/voice envelope); the "Your Resonances" guided microphone-calibration wizard; multi-voice-profile switching and persistence |
| Score ingestion and correction | `ScoreUploader.svelte` (1,340 lines), `CorrectionSurface.svelte` (1,265 lines), `correction.ts`, `entry.ts`, `clitic-seat.ts`, `score-seat.ts`, `first-seat.ts`, `reseat.ts`, `heal.ts`, `seated-text.ts`, `watchlist.ts` (591 lines) | Drag/drop score ingest; the four correction stations (duration, pitch, accidental, lyric); the syllable-to-note seating logic and its many edge cases (clitics, re-seating after edits, healing after upload); the head-of-score "places to watch" list |
| The loupe (magnified single-measure editor) | `Loupe.svelte` (3,054 lines), `LoupeSyllables.svelte`, `loupe.ts` (905 lines), `loupe-render.ts`, `loupe-render-bundle.ts` | The magnified editing frame over one held measure, independently re-spaced from the page per `docs/memory/PRODUCT.md`'s "the page and the loupe answer to different things" ruling |
| Pairings and the underlay | `pairings.ts` (1,423 lines), `underlay-donor.ts`, `vowel-resolver.ts` (624 lines) | The sparse correction map keyed by score event id, never written into `ParsedScore`; which Transcribe word donates to a score word; the GraysonEngine-to-Shane vowel-resolution seam |
| Insights | `insights.ts` (733 lines), `InsightsPane.svelte` (1,028 lines), `InsightsIntake.svelte`, `advice-resolver.ts`, `comments.ts`, `comment-text.ts`, `comment-sources.ts` | The forecasting/advice layer described at length in `docs/memory/PRODUCT.md`'s Insights sections; computed numbers, the pane, the intake form, cited-advice resolution |
| Rendering support | `engraving.ts`, `system-ground.ts`, `selection-ring.ts`, `notation-overlay.ts`, `score-metrics.ts`, `fit-legend.ts` | Notation-geometry preferences; where a mark sits in a rendered system; the selection squircle; a notation-only `AnalyzedScore` stand-in (suspected dead, see `inventory.md`); score measurements; the Fit provenance legend |
| Odds and ends | `TextualWitnesses.svelte` (unreachable, see `inventory.md`), `Tessituragram.svelte`, `NotePicker.svelte`/`note-picker.ts`, `range-offer-decline.ts`, `waiting-seat.ts`, `punctuation-slot.test.ts` (no non-test source) | A tessitura visualization; typed pitch capture for voice-characteristic fields; range-offer decline persistence; what happens when a score seat waits on the dictionary |
| `engine/` (31 files) | `analyze.ts`, `derivations.ts`, `detector.ts`, `dsp.ts`, `session.ts`, `live.ts`, `page-reader.ts` + `.worker.ts`, `score-reader.ts` + `.worker.ts`, `mscz-converter.ts`, `staff-detect.ts`, `guard.ts`, `plausibility.ts`, `divergence.ts`, `readiness.ts`, `types.ts`, `errors.ts`, `notation-fonts.ts`, `page-image.ts`, `page-pdf.ts`, `stub.ts` | The capture/analysis engine: DSP primitives, the live microphone-capture session, two Web Worker score/page readers (OMR path), the error-code taxonomy, a plausibility guard, MuseScore/PDF conversion |
| `reconciliation/` (4 files) | `types.ts`, `taxonomy.ts`, `witnesses.ts` | A divergence data model and taxonomy comparing two "witnesses" of one text (poem vs. score underlay). `types.ts` is alive (imported by `underlay-donor.ts`); `taxonomy.ts` and `witnesses.ts` are reachable only from each other and the orphaned `TextualWitnesses.svelte` (per `memo-audit-code-catalogue-a_r1_2026-09-24.md §3`, not independently re-verified this session beyond confirming the files exist) |
| `pacifier/` (2 files + test) | `Pacifier.svelte`, `contrast.ts` | The per-vowel calibration "pacifier" UI and its WCAG contrast checks |
| `ingestion/` (10 files) | `ingest.ts`, `format-detection.ts`, `poem-or-score.ts`, `ocr-guard.ts`, `clef-key-prompt.ts`, `recognized.ts`, `recognized-to-musicxml.ts`, `zip-reader.ts`, `zip-fixture.ts`, `mini-dom.ts` | Score-file format detection and dispatch; OCR-garble refusal; ZIP reading (the `.mxl`/`.ilya` precedent); a minimal in-tree DOM shim |

Imports from: `@ilya/score-parser` extensively (confirmed by grep this session across roughly 30 files under `shane/`); `@ilya/phonology` in at least `vowel-resolver.ts` and `VoiceProfilePane.svelte`.

## Summary of cross-cutting findings for phase 1

1. `+page.svelte` is the one clear "god file": 6,225 lines, importing across nearly every other area of the tree. Any dependency-boundary work in a later phase should treat it as the seam most worth tracking, not a leaf.
2. `apps/web/src/lib/` (top level) and `apps/web/src/lib/shane/` import from each other in both directions (`shane/vowel-resolver.ts` → `$lib/pipeline`, `$lib/syllable-utils`; top-level files import `shane/`-adjacent packages), so "Fit's code is at `apps/web/src/lib/shane/`" (AGENTS.md) is true as a location claim but does not imply a one-way dependency boundary.
3. `library/driver.ts` ↔ `library/library.ts` is a confirmed circular dependency (see `tool-trials.md`); this is a plausible refactor target, not necessarily a bug, since `library.ts` is the facade and `driver.ts` implements its own interface.
