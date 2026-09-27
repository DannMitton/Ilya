# N.174 plan r1: the change list, 2026-09-27

**A dated draft.** Step C of `spec-n174-text-markup-insights_r1_2026-09-26.md`. Merged by
the desk from step A (`n174-A-inventory_r1_2026-09-27.md`, Sonnet) and step B
(`n174-B-module-map_r1_2026-09-27.md`, Fable, with its review of A's 36 UNSURE rows in
its section 10). Read at `da3097f` on branch `Shane`; the app is identical at the floor
`7612926`. Every `path:line` is from A, B, or a desk read this session; the per-line detail
for comments lives in A's table and B's section 10, and this list does not repeat it.

Every DESK DEFAULT is reversible and Dann may wave it off. Nothing here changes a string
the singer sees, except the one dev page named in D.2.6.

## What Dann sees

- **Shown strings:** none change. One dev-only page title changes (D.2.6).
- **The Vercel setting:** no step for Dann. The Vercel project `ilya` holds one variable,
  `BLOB_READ_WRITE_TOKEN` (read with the Vercel tool this session). `PUBLIC_INCLUDE_SHANE`
  reaches every build from the tracked file `apps/web/.env`, so its rename is in the tree.
- **French:** none.

## C.2, the screenshot baseline (done 2026-09-27)

- 60 captures: Text, Markup, Insights, Learn, and Guide; desk 1440 x 900 and phone
  390 x 844 at 3x; English and French; each at the top, middle, and end of its scroll.
- Song and score: `sunless-01-engraved.musicxml`, copied outside `lib/shane/` so the moves
  cannot change it (md5 `8341a301d78abcba62098cbcee764b62`). A fresh browser, so no voice.
- **Stable:** three runs, all 60 pixel-identical. Scrollbars hidden, because one run
  differed by one pixel of scrollbar thumb.
- **Positive control:** a one-letter edit to `tab.insights` (`i18n.ts:122`, English only)
  changed all 30 English captures and none of the 30 French ones. Edit reverted.
- **Compare procedure:** the baseline is recaptured from the tag `pre-n174-2026-09-27` and
  the slice is captured in the same container, so fonts and Chromium match.
- **Gap, DESK DEFAULT to close before D.2.1:** no stored voice, so the calibrated Markup
  legend and the calibrated Insights tables are not pictured. Seed a voice for the capture
  from a real export (Dann's library, read-only) rather than a hand-built one.
- Files: `docs/sessions/n174-c2/` (script, config, and the 60 PNGs, 11 MB).

## D.1, the document ids (one slice, Code)

1. `destinations.ts:36` `StudioDocument`: `'transcription' | 'shane' | 'insights'` to `'text' | 'markup' | 'insights'`.
2. `destinations.ts:46` `TabId`: the same two members.
3. `destinations.ts:58-75` `tabIdFor` and `surfaceFor`: the new ids.
4. `destinations.ts:98-113` `restoreSurface`: add `'text'` and `'markup'`; keep `'transcription'` and `'shane'` as read-only aliases that land on the same document.
5. `+page.svelte:2810`, `:4117`: write the new ids to `ilya:activeTab`. The read at `:4309` goes through `restoreSurface` and needs no change.
6. `+page.svelte:339`, `:1558`, `:1564`, `:2093`, `:2129`, `:2224`, `:2279`, `:2806`, `:2808`, `:4994`: id literals to the new ids (B found `:339`, `:2093`, `:2129`, which A had missed).
7. `HeaderBar.svelte:42`, `:45`: `class:tab-transcription` and `class:tab-shane` to `tab-text` and `tab-markup`, with the rules at `:73`, `:93`, `:147`, `:163`, `:210`, `:223`.
8. `+page.svelte:4507`, `:4983`: `tab-{activeTab}` builds new class names; rename the rules at `:5716`, `:5735`.
9. `DeskHead.svelte:58`: the `case` to `'text'`.
10. `i18n.ts`: key `tab.transcription` to `tab.text` (value unchanged; used at `DeskHead.svelte:58`); delete `tab.fit` (no user, A section 2).
11. `wall.ts:6-7`: read `PUBLIC_INCLUDE_MARKUP_INSIGHTS`, falling back to `PUBLIC_INCLUDE_SHANE`; export `INCLUDE_MARKUP_INSIGHTS`. DESK DEFAULT name.
12. `INCLUDE_SHANE` importers to the new name: `destinations.ts:30`, `:103`, `:105`; `DeskHead.svelte:26`, `:53`; `+page.svelte:97`, `:1562`, `:2366`, `:4558`, `:4636`, `:4828`.
13. `apps/web/.env` and `.env.example:3-4`: the new name.
14. **Tests:** a stored `'transcription'` and a stored `'shane'` each restore to the same document; the new ids round-trip; the flag's fallback.
15. `ARCHITECTURE.md:131`, invariant 10, "Stored ids never change": amend to "change only with a read-both migration". The invariant is the audit desk's draft r1 wording; N.174 is Dann's later instruction.

## D.2, the module moves (six slices, Code, B's order)

Every slice: move the files, rewrite imports, rename that module's keys in
`scripts/ratchets.json:11-20` in the same slice (a moved file otherwise loses its ceiling
silently, `ratchets.mjs:65-67`), run every gate, capture and compare.

**D.2.0, with slice 1:** ratchet rule 4, "MODULES", in `scripts/ratchets.mjs`, per B
section 8: the allowed-imports table, rule 4 applied to tests too, a second pattern for
`new URL(..., import.meta.url)`, and a breach for any file left under `lib/shane/` once
slice 6 closes.

**The sixth module, `lib/analysis/`.** DESK DEFAULT, from B section 0: four files are read
by both Markup and Insights (`VoiceProfilePane.svelte:87-94`, `InsightsPane.svelte:58-60`,
`insights.ts:43`), and in either document's folder one imports the other.

1. **`markup/`**, 3 files: `VoiceProfilePane.svelte` to `MarkupPane.svelte` (DESK DEFAULT, the twin of `InsightsPane`); `fit-legend.ts` to `legend.ts`, `FitLegendType` and `buildFitLegend` and `FIT_LEGEND_ORDER` and `FIT_WITHHELD_COPY` renamed; the discriminants `'fit-captured'` and kin (`fit-legend.ts:52-55`, `:159`) to `'markup-…'`, with `PageFooter.svelte:70` and `provenance.ts`; `.fit-paper-container` to `.markup-paper-container` (`VoiceProfilePane.svelte:989`, `:1091`, `:1303`; `Loupe.svelte:527`, `:739`). Importer: `+page.svelte:122`.
2. **`insights/`**, 10 files. `InsightsIntake.svelte` waits for slice 4. Importers: `+page.svelte:123`, two tools files. Keys `insights.fit.*` and `insights.verdict.fit` stay: "fit" there is the ordinary noun (B section 10).
3. **`analysis/`**, 14 files. `diction-fold-live.test.ts:25` fixture URL becomes `../score/ingestion/fixtures/…`. Keys `fit.broad.*` to `analysis.broad.*` (`analyze-score-adapter.ts:253-258`). `analyzePerVerse` moves and is not deleted (`CONTRACT.md` §6).
4. **`voice/`**, 27 files, with `InsightsIntake.svelte` (mounted at `CalibrationWizard.svelte:48`). Split `engine/errors.ts`: `CaptureError` to `voice/errors.ts`; narrow `ShaneEngineError` to `CaptureError` at its six sites if `tsc` stays clean, else rename the union `VoiceEngineError`. `'shane-capture-tap'` to `'voice-capture-tap'` and the log tags (`live.ts:133`, `:175`; `CalibrationWizard.svelte:316`). Token `--surround-shane` to `--surround-voice` (`app.css`, `contrast.ts` 13 sites, `contrast.test.ts`, `+page.svelte:5741`, `Pacifier.svelte:758`). `pacifier/` stays a subfolder (`contrast.test.ts:277`). Storage keys `shane.profile.v1` and `shane.profiles.v2` (`profileStore.ts:66-67`) **stay**, with a comment: DESK DEFAULT, because a singer's saved voices sit under them.
5. **`reader/`**, 19 files, with the rest of `errors.ts`, `zip-reader.ts`, `zip-fixture.ts`, `recognized.ts`. Fix `engine/reader-ids.test.ts:28` to three `../`: at the new depth it would otherwise skip its assertion with a green run (`:96`). Importers: `library/binder.ts:21`, `binder.test.ts:18`.
6. **`score/`**, 66 files, with `notation-fonts.ts` and `engraving.ts`; `ingestion/` stays a subfolder. 27 importers, plus the four fixture path strings (`e2e/singer-paths.test.ts:25`, `e2e-phone/loupe-scan.test.ts:42`, `staff-renderer-real-fixture.approval.test.ts:66`, `packages/score-parser/src/approval/musicxml-parser.approval.test.ts:140`). Keys `fit.witness.*` to `witness.*`. In the same slice: `.shane-provenance` to `.markup-provenance` (`+page.svelte:4550`, `:5317`); drop `shane-no-lyrics` and `shane-storage-notice`, which no rule styles and no test selects; `data-fit-page` to `data-score-page` (`page-layout.ts:406`, `page-layout.test.ts:267`); `SHANE_T08_MNX` to `MNX_T08_PATH` (`mnx-parser.test.ts:648`, local only); the route `fit-font-lab` to `notation-font-lab`, whose `<title>` and `<h1>` (`:50`, `:54`) read "Notation font lab" (dev page, the one shown-text change); the Guide anchors `guide-fit-*` to `guide-markup-*` (`GuideContent.svelte:58`, `:65`, `:71`, `:335`, `:342`, `:348`; `Drawer.svelte:299`, `:749-750`), with the old hashes accepted in `handleHashNavigation` (`+page.svelte:4226`). `lib/shane/` ends empty and is removed.

Moved as they are, deletion left to `OWED.md` "Dead code found by the audit": `notation-overlay.ts`,
`TextualWitnesses.svelte` with `reconciliation/`, and the stray
`sunless-01-engraved.musicxml.bak-before-ja-2026-09-20`.

## D.3, words (one slice, Code or a desk subagent on the `audit` branch)

1. The REWORD-COMMENT rows: A's table plus B section 10. A quotation of Dann stays verbatim, with its date in the frame (`CalibrationWizard.svelte:1122`, `:1745`).
2. `ARCHITECTURE.md`: the one historical line ("developed under the codename Shane; shown on screen as Fit until 2026-09"), and the module table redrawn to six.
3. `AGENTS.md`, `README.md`, `CONTRIBUTING.md`.
4. The Correction Station brief's paths, and the other queued briefs that name `lib/shane/`.
5. Drop the `PUBLIC_INCLUDE_SHANE` fallback from `wall.ts`.
6. `tools/e16-harness/` prose, last and lowest.

## E, the check

A fresh agent greps for `shane`, `Shane`, `'transcription'` as an id, and `'fit'` and
`Fit` as a document name, and finds only the historical line and the KEEP rows. Dann opens
a song saved before D.1 and confirms it opens on the same document.

## Held, not N.174

- The Guide still shows "Fit" in two headings each way (`GuideContent.svelte:58`, `:71`,
  `:335`, `:348`). They are shown strings, so they stay; N.154 already owes the Guide's
  "Fit" wording (`STATE.md`, N.154 line).
- A had the Guide's languages the wrong way round: `:58` is French, `:335` English.
