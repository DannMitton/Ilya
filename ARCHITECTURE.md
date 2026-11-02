# Architecture

**Ratified by Dann 2026-09-28**, after every claim was checked against the tree. It
follows matklad's advice for an `ARCHITECTURE.md`: a short map of where things
are and what must stay true. How each module works is in its code and comments.

Developed under the codename Shane; shown on screen as Fit until 2026-09. N.174 (2026-09-27) renamed the code to Text, Markup, and Insights; the screen says TEXT, MELODY, and INSIGHTS since 2026-11-01.

## The problem Ilya solves

A classical singer has a Russian text, and often a score. Ilya answers two
questions about it.

1. **How do I pronounce this?** Ilya transcribes the text into a singable IPA,
   following Craig Grayson, *Russian Lyric Diction* (2012). This is the
   TEXT document.
2. **Does this piece suit my voice?** Ilya reads the score, measures the
   voice the singer calibrates, and reports where the two meet. This follows
   Mitton (2020). These are the **MELODY** (« CHANT ») and **INSIGHTS**
   (« APERÇUS ») documents.

Together, TEXT, MELODY, and INSIGHTS are the **page** (its folder is
`components/Paper/`): the three documents Ilya offers for print.

Ilya's analysis is rule-based and deterministic: the same input gives the
same output, every time. No part of it is learned. The one trained component
is the OCR text recognizer, `tesseract.js`, which reads the words of a scanned
or photographed poem. The music reader (OMR) is classical computer vision, with
no trained model. That claim is load-bearing for
the project's credibility, and the approval tests in `__approved__/`
directories pin it.

The app is bilingual (English and French), runs entirely in the browser as a
progressive web app, and stores the singer's songs on their own device.

## Codemap

A pnpm workspace. The application depends on four packages. The packages never
depend on the application, and at runtime none imports another: the
application loads the data and injects it into each.

```
packages/phonology    ◄──┐
packages/dictionary   ◄──┤
packages/blurb        ◄──┤  apps/web imports each, and injects
packages/score-parser ◄──┘  the dictionary data at load
```

### `packages/phonology` (`@ilya/phonology`)

The **GraysonEngine**: stress, vowel reduction, palatalization, voicing
assimilation, and clitic chains, turning Cyrillic into Grayson's IPA
(invariant 3). Entry: `src/index.ts`.

### `packages/dictionary` (`@ilya/dictionary`)

The English and French gloss pipeline, the normalizers for poetic and
pre-1918 spelling, and a helper that marks stress in Cyrillic for display.
Stress itself is looked up in `@ilya/phonology`. Data comes from English and French
Wiktionary through kaikki.org (CC BY-SA 4.0); `scripts/build-dictionary.ts`
builds it.

### `packages/blurb` (`@ilya/blurb`)

The explanation a singer reads after tapping a word: why Ilya made this
choice.

### `packages/score-parser` (`@ilya/score-parser`)

Everything about a score that does not need a browser. MusicXML and MNX both
parse into one type, `ParsedScore`, whose sung line is a list of
`VocalLineEvent`s. Also here: phonation time, tessitura, tempo, transposition
search, page layout, and `staff-renderer.ts`, which engraves a staff as SVG.

### `apps/web` (`@ilya/web`), the SvelteKit application (Svelte 5 runes)

- `src/routes/+page.svelte` is the app's one page. It wires every surface
  together and hands the song being worked on to
  `src/lib/library/document.svelte.ts`, which alone reads and writes storage.
  (`routes/notation-font-lab/` is a development page the app does not link to.)
- `src/lib/pipeline.ts` turns text into a transcription by calling the
  packages. `src/lib/loader.ts` loads the dictionary into IndexedDB in chunks.
- `src/lib/i18n.ts` holds the interface's words, in both languages. The LEARN
  and GUIDE texts are written in each language in `components/Reading/`, and
  the word explanations come from `data/blurb-composer.json`. That file is at
  the repository root (`data/`, not `apps/web/data/`); the app fetches it as
  `/data/blurb-composer.json` (`src/lib/loader.ts`).
- `src/lib/destinations.ts` names where the singer is (Studio, LEARN, GUIDE)
  and which document Studio shows (TEXT, MELODY, INSIGHTS).
- `src/lib/components/Drawer/` is the drawer: every control that changes
  something. `Paper/` is the page: what displays and prints. `Reading/` holds
  the LEARN and GUIDE texts.
- `src/lib/components/Field/` is the settling of a one-line field: `settle-field.ts`
  settles it on Enter or on leaving it, and `SavedNote.svelte` says "Saved".
- `src/lib/library/` stores songs on the device (IndexedDB) and reads and
  writes `.ilya` binder files. `document.svelte.ts` is the seam between the
  page and storage.
- `src/lib/score/` is the score itself. Inside it:
  - `ingestion/` detects a score's format and routes it to a parser, and
    `reconciliation/` holds the textual-witness work.
  - `pairings.ts` joins the text's words to the score's notes, and
    `vowel-resolver.ts` asks the GraysonEngine which vowel is sung.
  - `Loupe.svelte` and the `loupe*` modules are the magnified editor for one
    measure. `CorrectionSurface.svelte` and the `correction*` modules correct
    its notes, with `undo-history.svelte.ts` as their Undo and Redo;
    `selection-ring.ts` and `stop-ring.ts` draw the mark on whatever the
    cursor holds.
  - `ScoreUploader.svelte` takes the file in, and `notation-fonts.ts` loads
    the notation font.
- `src/lib/reader/` reads a score file. It is flat, with `vendor/` for the MuseScore converter's glue. `score-reader.ts`
  and its Worker convert Finale `.musx`, `mscz-converter.ts` converts
  MuseScore, `page-pdf.ts`, `page-image.ts`, and `staff-detect.ts` prepare
  a PDF or a photograph (the homr route under `src/lib/omr/` reads it),
  `zip-reader.ts` opens
  zipped files, and `errors.ts` holds the reader's error tiers.
- `src/lib/voice/` is the singer's voice. `CalibrationWizard.svelte` is the calibration wizard ("Your
  Resonances"), `profileStore.ts` keeps the saved voices (still under the
  `shane.profiles.v2` key, by invariant 10), `engine/` is the microphone
  capture and its signal processing, and `pacifier/` is the capture's
  visual timer.
- `src/lib/text/` is the TEXT document's own logic: where lines break (`break-*.ts`),
  which of the song's two texts, Lyrics or Poem, is shown (`input-views.svelte.ts`),
  what each shows (`witness-lines.ts`, `word-marks.svelte.ts`), and how the poem is
  compared with the lyrics (`poem-compare.ts`, `relining.ts`).
- `src/lib/omr/` reads a scan. `scan.ts` turns a PDF or a picture of staves into
  MusicXML through homr (`homr-reader.ts`, from `third_party/homr-web/`);
  `metre-*.ts` reads a printed time signature, and `underlay-*.ts` reads the words
  printed under the notes.
- `src/lib/tempo/` is the singer's own tempo: `TempoControl.svelte` is the floating
  panel, `TempoReceipt.svelte` the Input band's row, and `singer-tempo.ts` puts the
  choice on a score and reads it back.
- `src/lib/approval/` holds tests only: the approval suites whose outputs sit in
  `__approved__/`, and the tests for invariants 4 and 11.
- `src/lib/markup/` is the MELODY document (`markup/` is its code name today; the
  screen says MELODY). `MarkupPane.svelte` analyzes the score, paginates it (`paginateScore`
  in `packages/score-parser`), and hands each page's SVG to
  `Paper/PageFit.svelte`. `legend.ts` builds its footer legend.
- `src/lib/insights/` is the INSIGHTS document. `insights.ts` builds the page's figures, `comments.ts`, `comment-text.ts`, and `comment-sources.ts`
  choose, word, and cite the per-note comments, and `InsightsPane.svelte`
  renders it all. `InsightsIntake.svelte` is in `voice/`, where the
  calibration wizard mounts it. `Tessituragram.svelte` is not drawn today:
  nothing imports it (`SingerBlock.svelte` mounts `PitchSeconds.svelte`), and it
  is held for the dead-code batch (consistency batch 4).
- `src/lib/analysis/` is what both documents read. `analyze-score-adapter.ts` turns the voice into the snapshot the
  analysis reads, `watchlist.ts` and `advice-resolver.ts` list and explain what
  is flagged, `gates.ts` decides which of it is said, and `score-metrics.ts`
  measures the piece.
- `src/lib/wall.ts` is the one switch that includes or removes MELODY and
  INSIGHTS at build time (`PUBLIC_INCLUDE_MARKUP_INSIGHTS`, set in the tracked
  file `apps/web/.env`).

MELODY and INSIGHTS work in five stages: **calibrate** the voice, **ingest** a score,
**resolve** which vowel each note sings, **analyse** where the voice and the
music meet, and **engrave** the marked-up score.

## Names

Each named part of Ilya has one record in `apps/web/src/lib/names.ts`. This table
is that record for people, in record order: `key` is the i18n key of the name on
screen, `EN` and `FR` are what `t()` returns for it, `code today` and `folder today`
are the names the code uses now (the screen's MELODY is still `markup/` here until
consistency batch 3), and `retired` lists the patterns the guard keeps out of
what a singer reads and out of this documentation. `names-table.test.ts` fails
if a cell and its record disagree, or if either has a row the other lacks. The
rules for naming are in `docs/house-style/`.

| id | key | EN | FR | code today | folder today | retired |
|---|---|---|---|---|---|---|
| text | `tab.text` | TEXT | TEXTE | `text` | `apps/web/src/lib/text/` | `Transcribe and fit`, `click Transcribe`, `cliquez sur Transcrire`, `Transcription tab`, `l'onglet Transcription` |
| melody | `tab.markedScore` | MELODY | CHANT | `markup`, `MarkupPane` | `apps/web/src/lib/markup/` | `\bMarkup\b`, `\bAnnotation\b`, `Partition annotée` |
| insights | `tab.insights` | INSIGHTS | APERÇUS | `insights` | `apps/web/src/lib/insights/` | `\bFit\b` |
| learn | `tab.learn` | LEARN | LEÇONS | `learn` |  |  |
| guide | `tab.guide` | GUIDE | GUIDE | `guide` |  |  |
| piece | `group.piece` | PIECE | PIÈCE | `piece` |  | `\bMetadata\b`, `\bMétadonnées\b` |
| input | `group.input` | INPUT | ENTRÉE | `input` |  |  |
| voice | `group.scoreMarkup` | VOICE | VOIX | `scoreMarkup` |  |  |
| poem | `intake.view.poem` | POEM | POÈME |  |  |  |
| lyrics | `intake.view.lyrics` | LYRICS | PAROLES |  |  |  |
| corrections | `loupe.station.corrections` | CORRECTIONS | CORRECTIONS |  |  |  |
| underlay | `underlay.heading` | UNDERLAY | PLACEMENT DES PAROLES |  |  |  |
| analysis | `console.placeholder` | ANALYSIS | ANALYSE | `AnalysisStation` |  | `\bInspector\b`, `\bRibbon\b`, `\bInspecteur\b`, `Ruban syllabique` |
| drawer | `drawer.pull` | DRAWER | TIROIR | `Drawer` |  | `The Handle`, `poignée du Tiroir` |
| page | `drawer.paper` | the page | la page |  |  | `the Paper`, `le Papier` |
| spotReduction | `inspector.spot.reduction` | Spot reduction | Réduction ponctuelle |  |  | `Réduction ciblée` |
| spotReconstitution | `inspector.spot.reconstitution` | Spot reconstitution | Reconstitution ponctuelle |  |  | `Reconstitution ciblée` |

## Invariants

Each is a default. Departing from one needs a deliberate ruling from Dann, and
the ruling goes into `docs/memory/`. The ones marked *tested* fail a check when
broken.

1. **Packages never import the application.** *Tested:* `scripts/ratchets.mjs`.
2. **The application reaches a package only through its `@ilya/` name.**
   Tests may load a package's fixtures directly. *Tested:* `scripts/ratchets.mjs`.
3. **IPA comes only from the GraysonEngine.** No renderer, component, or
   analysis module writes IPA or re-derives a phonological rule of its own.
   The one exception is the thirty Latin words of «Семинарист», whose IPA is
   Richter's (2002, pp. 43–49), in `apps/web/src/lib/latin.ts` and credited on
   the page that shows it (Dann, 2026-09-27). Any other Latin word shows none.
4. **The IPA stays inside Grayson's inventory:**
   `ˈ ː a ɑ b d e ɛ f ɡ ɣ h i ɪ ɨ j ʲ k l ɫ m n ɲ o p r s ʃ t u v ʌ x z ʒ`.
   *Tested:* `apps/web/src/lib/approval/invariants.test.ts`. Two exceptions:
   a display preference the singer chooses (`applyNotationPreferences` in
   `packages/phonology` can show the reduced vowel as `ə`), and [w], in four of
   «Семинарист»'s Latin words only (invariant 3; Richter, p. xii), which the
   same test pins.
5. **Same input, same output.** *Tested:* the approval suites.
6. **The drawer hosts the controls. The page is WYSIWYG: it displays,
   and it prints what it displays.** Tapping a word shows it in the drawer.
   Tapping a note raises the loupe, an inspection and correction surface that
   floats above the page and never prints.
7. **The notes never move.** A correction to how text meets music is a side
   map keyed by event id (`pairings.ts`); it never writes into `ParsedScore`.
8. **`VocalLineEvent` does not change shape.** Much of MELODY and INSIGHTS is built on it.
9. **Store what the singer said, never what Ilya derived.** Everything derived
   is recomputed on open. The one ruled exception is R8's vowel glyph.
10. **A stored id changes only with a migration.** The destination ids in
    `destinations.ts` and the library's record keys are written to the
    singer's device, so an id changes only with a migration that reads both
    the old and the new value: `restoreSurface` in `destinations.ts` is the
    example. Amended by N.174, 2026-09-27.
11. **Every word the singer reads exists in both languages.** Interface words
    live in `i18n.ts`, and the word explanations in `data/blurb-composer.json`
    (at the repository root, not under `apps/web/`).
    *Tested:* `apps/web/src/lib/approval/i18n-keys.test.ts` checks every
    literal key, and `packages/blurb/tests/french-parity.test.ts` checks every
    explanation.
12. **Large files do not grow.** A file with a ceiling in
    `scripts/ratchets.json` may shrink and never grow; a file without one stays
    under 1,000 lines. New work goes into a new module. *Tested:*
    `scripts/ratchets.mjs`.
13. **Six modules under `src/lib/` import only from the ones before them:**
    `reader`, then `score`, `voice`, and `analysis`, then `markup` and
    `insights`, which do not import each other. Other folders are not checked.
    *Tested:* `scripts/ratchets.mjs`.

## Cross-cutting concerns

- **Testing has four layers.** Unit tests sit beside the code
  (`*.test.ts`) in `apps/web` and `packages/score-parser`, and in a `tests/`
  folder in the other three packages. Integration tests are in the root
  `tests/` folder (`pnpm test:integration`). Approval tests pin whole outputs as plain files in
  `__approved__/`; a diff there means the output changed, and `vitest -u`
  re-approves only a reviewed, intended change. The Playwright suite in
  `apps/web/e2e/` checks what a singer sees on the desktop layout, and
  `apps/web/e2e-phone/` checks the phone layout. `scripts/ratchets.mjs` guards
  structure. CI (`.github/workflows/ci.yml`) runs them on every push to any
  branch, with zero type errors allowed. The phone Playwright project is not in
  CI yet.
- **French is ratified by Dann before it ships.**
- **The dictionary** is large. `loader.ts` streams it into IndexedDB once, and
  the text field stays disabled until it has landed.
- **Offline.** `apps/web/scripts/stamp-sw.mjs` versions the service worker
  cache at every build.

## Where to start

- To name anything, on screen or in code: the Names table above, then
  `docs/house-style/interface-text.md` and `docs/house-style/code-conventions.md`.
- To change a pronunciation rule: `packages/phonology`, with its tests, and
  Grayson's text at hand.
- To change what a singer reads: `apps/web/src/lib/i18n.ts`. Its key prefixes
  are the feature index: the block at the top of that file lists each prefix
  and the module it belongs to.
- To find the code behind something on screen: search `apps/web/src/lib/i18n.ts`
  for the words on screen and follow the key.
- To change the voice analysis: `packages/score-parser` for anything that needs no
  browser, `apps/web/src/lib/analysis/` for the rest.
- Before any change: `pnpm test`, `pnpm ratchets`, and, in `apps/web`,
  `pnpm check` and `pnpm exec playwright test --project=chromium`.

## Where decisions are recorded

- `docs/memory/` is the project's working memory: `README.md` says what to
  read. `PRODUCT.md` holds settled product decisions, and `CONTRACT.md` §6
  states several of the invariants as working rules.
- `docs/sessions/` holds the dated designs, briefs, and memos behind them.
  Nothing there is authoritative on its own: the code beats `docs/memory/`,
  and `docs/memory/` beats `docs/sessions/`.
