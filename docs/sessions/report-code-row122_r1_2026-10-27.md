# Report: row 122, the receipt of a scanned score names what was read (2026-10-27)

Brief: `brief-code-row122-scan-receipt-format_r2_2026-10-25.md`, with `review-fable-brief-row122_r1_2026-10-25.md`, both read in full. Branch `cloud-lane-17`, cut from `origin/Shane` at `234eff3f`, working tree clean at the start. Cloud session, Sonnet. Nothing here was walked in a browser.

## What I changed

- New `apps/web/src/lib/score/format-label.ts`: `formatLabelKey(p, origin, scanKind?)`, a pure function returning an `upload.format.*` key. Every provenance keeps today's key. `via: 'direct'` with `origin === 'homr-musicxml-from-image'` gives `upload.format.pdfReader` for `'pdf'` and `upload.format.imageReader` for `'image'`. A homr origin with no kind keeps `upload.format.musicxmlDirect` (the brief's step 1 rule; a homr-stamped `.musicxml` dropped directly is the case).
- `apps/web/src/lib/score/ScoreUploader.svelte`: the `arrived` variant of `UiState` gains `scanKind?: 'image' | 'pdf'` (`:177`); the scan route's `ingest` hook sets it after `handleFile(xml)` when `ui.kind === 'arrived'` (`:289-293`); the draw at the old `:989` is now `T(formatLabelKey(ui.ingested.provenance, ui.ingested.result.score.source.origin, ui.scanKind))`; `formatLabel` is removed; the `IngestProvenance` import, now unused, is removed. The restore path is untouched.
- New `apps/web/src/lib/score/format-label.test.ts`, 14 tests.
- `scripts/ratchets.json:19`: `ScoreUploader.svelte` lowered 1358 to 1350, the new line count. Nothing raised. The ratchet tool also lists three other ceilings that could be lowered (`LearnContent.svelte`, `InsightsPane.svelte`, `Loupe.svelte`); I left them, as they are not this row's.
- No string and no French. The two reader strings are reused (`i18n.ts:1104-1105` at this tip; the brief's `:1094-1095` has moved).

## Step 0 findings

- The restore path draws no receipt. `onMount` calls `oningested(ui.ingested, ui.file, 'restore')` then `reset()` (`ScoreUploader.svelte:811-812` before the edit), `reset()` sets `idle`, and the format line sits only inside `{:else if ui.kind === 'arrived'}` (`:980`, drawn at `:989`). The comment at `:608-617` says it is on purpose.
- Grep of `apps/web/src` and `packages` for `upload\.format\.` and `formatLabel`, excluding `i18n.ts`: readers only at `ScoreUploader.svelte:826-836` (the function) and `:989` (the draw). Confirmed.
- `+page.svelte` reads `s.provenance.format` alone for the arranger line (`PROVENANCE_FORMAT_LABELS[s.provenance.format]`, near `:3453`). Confirmed.
- The `i18n.ts` cites have moved since the brief: the direct strings are at `:1081`, the reader strings at `:1104-1105`.

## Tests

`format-label.test.ts` covers: all seven provenance variants keep today's key; a scan kind changes nothing for a non-homr file; a homr origin with `'pdf'` and with `'image'` gives the two reader keys; a homr origin with no kind keeps the direct key; the resolved English and French strings equal the ratified ones; and two cases fed by the real parser (`tch-1.musicxml` through `readingFile` and `ingestScoreFile` with the mini DOM, as `no-lyrics-notice.test.ts` does), so the origin is the parser's and not a literal. The same notes restamped `MuseScore` keep the direct key whatever kind is passed.

Before step 1 the file does not compile: with `format-label.ts` moved aside, vitest fails the suite with `Cannot find module './format-label'` and reports no tests. With it in place, 14 passed. The wiring at the draw is proved by reading only.

## Checks the brief asked me to state

- `fidelityBanner` (`ingest.ts:67-71`, by `via`) and `noLyricsNoticeKey` (`ingest.ts:89-90`, by `via` and `origin`) are not edited and the provenance type (`ingest.ts:50-57`) is not edited; `git diff` touches neither file.
- No other site draws the format string a second way (grep above). Nothing was found in a print footer, the Insights provenance line, or `provenance.ts`.
- Report, do not change: the drawer receipt and the wordless notice show the reading's name (`song.musicxml`), not the scan's, per the brief (`scan.ts` `readingFile`, `ingest.ts` `fileName`). I did not re-trace that path this session beyond the test, where `readingFile(new File([''], 'song.pdf'), ...)` is what ingests. The desk opens the row.

## Line count and gates

`ScoreUploader.svelte`: 1358 before, 1350 after.

| Gate | Before (measured at `234eff3f`) | After |
|---|---|---|
| `pnpm test:phonology` | 291 passed (291) | 291 passed (291) |
| `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) |
| `pnpm --filter @ilya/web check` | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| `pnpm --filter @ilya/web test` | 3231 passed (3231), 180 files | 3245 passed (3245), 181 files |
| `pnpm --filter @ilya/score-parser test` | 775 passed, 5 skipped (780) | 775 passed, 5 skipped (780) |
| `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| `pnpm ratchets` | OK | OK |

No baseline differed from the one stated. The web-test rise of 14 is the new file's tests.

## What I could not establish

- The drawn receipt. Nothing was rendered; vitest does not render the component. NOT ESTABLISHED until the desk walks a PDF and a photograph on the alias. Run for this report: unit tests and gates only.
- Whether `scanKind` survives every route to `arrived`. By reading, `ingest` runs `handleFile(xml)`, which lands `arrived` (`handleFile`), and then my line spreads it into the same state; I did not run a scan, and homr did not finish in the lane before (QUEUE row 104 per the brief), so the scan route is unrun.
- The drawer receipt's file name (`song.musicxml`) was reported as the brief states, not re-read to the end this session.
