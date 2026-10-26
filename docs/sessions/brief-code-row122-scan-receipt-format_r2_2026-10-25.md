# Brief r2: row 122, the receipt of a scanned score names what was read (2026-10-25)

Written by the desk (Sonnet) 2026-10-22 as r1; r2 written 2026-10-25. Fable-reviewed 2026-10-25 (`../sessions/review-fable-brief-row122_r1_2026-10-25.md`, md5 `53cef588613537ea03cabb3656272b4e` of the brief it reviewed, verdict SEND WITH AMENDMENTS), all 7 amendments applied (`CONTRACT.md` section 1 item 19). It waits for Dann's say-so to send. Found by Fable's review of row 121, amendment 4 (`review-fable-brief-row121_r1_2026-10-19.md`).

For Code in a cloud session, Sonnet, on a lane cut from `Shane` by Dann. It has no dependency on batch C, N.194, row 134, or N.195. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code carries a `path:line` the desk or Fable read (the desk on 2026-10-22; Fable and the r2 edit on 2026-10-25 at `e0f4ad9`), or says NOT ESTABLISHED or NOT READ. Do not write with git beyond one commit per step on the lane; no pull request; no other branch; no brief file in any commit.

Cost, a range and not measured: about 40k to 120k Sonnet tokens.

## 1. The need and the done state

A singer drops a PDF or a photograph of a score. homr reads it, and the receipt that arrives says "Format: MusicXML (direct)", which is what a dropped `.musicxml` file would say. It is not what the singer did. Done when the receipt of a homr-read PDF says "Format: PDF → MusicXML" and the receipt of a homr-read photograph says "Format: photograph → MusicXML", in both languages, and every other receipt reads as it does today.

## 2. What the desk read (read, not run)

- `formatLabel(p: IngestProvenance)` maps provenance to a string (`apps/web/src/lib/score/ScoreUploader.svelte:826-836`) and is drawn at `:989`. For `via: 'reader'` it already picks the PDF or the photograph string by `p.sourceFormat` (`:831-833`).
- The strings exist and are ratified: `upload.format.pdfReader` ("Format: PDF → MusicXML") and `upload.format.imageReader` ("Format: photograph → MusicXML") at `apps/web/src/lib/i18n.ts:1094-1095`, with French beside them. The direct strings are at `:1070-1071`. (QUEUE row 122's own cell cites `i18n.ts:1056-1057`, which is stale; the desk corrects it when filing.)
- The homr route hands its reading back as a MusicXML file that `handleFile(xml)` ingests, so the provenance is `via: 'direct'`. The handoff is `hooks.ingest(readingFile(...))` at `apps/web/src/lib/omr/scan.ts:102`, with `readingFile` at `:114-117` (`:77-79` is the signature of `readScanAsScore`); in the component, `readScanAsScore(file, kind, ...)` is `ScoreUploader.svelte:287` and its `ingest` hook is `:289`. The provenance type is `apps/web/src/lib/score/ingestion/ingest.ts:50-57`; its `direct` variants carry no kind.
- The parser reads homr's `<software>homr</software>` stamp as `source.origin === 'homr-musicxml-from-image'` (`packages/score-parser/src/musicxml-parser.ts:1101`; the constant `READ_SCAN_ORIGIN`, `packages/score-parser/src/printed-marks.ts:15`; the type, `packages/score-parser/src/types.ts:225`; `ingest.ts:83-86` describes it), and the page reads it as `ingested.result.score.source.origin` (`apps/web/src/routes/+page.svelte:2800`). So the receipt can tell a homr reading, but not whether the scan was a PDF or a photograph.
- The kind is known where the scan is taken: `take()` holds `kind: 'image' | 'pdf'` from `ScoreUploader.svelte:268`, and passes it to `readScanAsScore(file, kind, ...)` at `:287`.
- `ScoreUploader.svelte` is at its ceiling: 1358 lines today (`wc -l`, 2026-10-25), and `scripts/ratchets.json:19` records 1358. Any line added to it must be paid for in the same change. Removing `formatLabel` (`:826-836`, eleven lines) pays for the import and the two-line state change.
- The restore path shows no receipt: `onMount` (`ScoreUploader.svelte:786-816`) calls `oningested` with origin `'restore'` and then `reset()` (`:811-812`), so `ui` is `idle` and the format label at `:989` is never drawn for a restore (the comment at `:614-617` says so on purpose). `restore.bytes` are the scan, not the reading (`+page.svelte:3342-3344`, `:3361-3362`). Nothing in this row touches the restore path.

## 3. DESK DEFAULT, his to wave off

A pure function that decides the receipt's string key from `(provenance, origin, scanKind)`, in a new file `apps/web/src/lib/score/format-label.ts`, with its own test. `ScoreUploader.svelte` imports it and loses `formatLabel`. The scan's kind rides on the state the receipt already lives in: the `arrived` variant of `UiState` (`ScoreUploader.svelte:177`) gains an optional `scanKind?: 'image' | 'pdf'`; the scan route's `ingest` hook (`:289`) sets it after `handleFile(xml)` succeeds (`if (ui.kind === 'arrived') ui = { ...ui, scanKind: kind }`), and nothing clears it, because it leaves with the state. The draw at `:989` passes `ui.ingested.provenance`, `ui.ingested.result.score.source.origin`, and `ui.scanKind`.

Fact for Code, not a design: `pendingPoemFallback` already holds `kind` from `:285` through arrival and is cleared only by `reset()` (`:309`, `:821`). Do not read it for the receipt; its name and comment say what it is for.

The reason for the function: the ceiling forbids net growth in the component, and a pure function is testable where `+page.svelte` and the component are not. No new string and no French: the two existing reader strings are reused.

## 4. Steps

**Step 0, read, change nothing.** Confirm by reading that the restore path draws no `arrived` receipt (`ScoreUploader.svelte:811-812`, `:980`, `:989`); report the lines. Confirm by grep that `upload.format.*` and `formatLabel` are read only at `ScoreUploader.svelte:826-836` and `:989`, and that `+page.svelte:3454-3462` reads `provenance.format` alone; report the result. Report this before you change code.

**Step 1.** Add `format-label.ts`: the pure function and its types. Cases: every current provenance variant keeps today's key; `via: 'direct'` with `origin === 'homr-musicxml-from-image'` and a scan kind of `'pdf'` gives `upload.format.pdfReader`, and `'image'` gives `upload.format.imageReader`; a homr origin with no known kind keeps today's `musicxmlDirect` key and the report says so.

**Step 2.** Wire the component: remove `formatLabel`, import the function, and set `scanKind` in the `ingest` hook at `:289` as section 3 says; the restore path is untouched (section 2, last bullet). `ScoreUploader.svelte` must end at or under 1358 lines. If it cannot, move code out until it does; do not raise `scripts/ratchets.json`.

**Step 3.** Tests in `apps/web/src/lib/score/format-label.test.ts` for every case in step 1. One case feeds the real parser: ingest `apps/web/src/lib/omr/fixtures/tch-1.musicxml` through `ingestScoreFile` with the mini DOM, as `no-lyrics-notice.test.ts:36-48` does, and pass its `result.score.source.origin` to the function with each kind, so the origin signal is the parser's (`packages/score-parser/src/musicxml-parser.ts:1101`) and not a string literal. The tests do not compile before step 1 and pass after it; say so. The wiring at `:989` is proved by reading, and the desk walks it on the alias with a scan; write NOT ESTABLISHED for the drawn receipt in the report.

## 5. Constraints and the cross-site line

- No strings and no French. If a homr scan needs words the two reader strings do not say, stop and report; wording is Dann's.
- The provenance type (`ingest.ts:50-57`) does not change in this row. The fidelity banner (`fidelityBanner`, `ingest.ts:67-71`, by `via`) and the no-lyrics notice (`noLyricsNoticeKey`, `ingest.ts:89-90`, by `via` and `origin`) read provenance too and must read exactly as today; say in the report that you checked.
- Every other site that shows or reads the receipt's format string, and what depended on them agreeing: those listed by step 0. If one draws the format a second way (a print footer, the Insights provenance line, `provenance.ts`), name it; do not change it in this row.
- Report, do not change: the drawer receipt and the wordless notice show the reading's name (`song.musicxml`), not the scan's (`scan.ts:114-117`, `ingest.ts:323`, `+page.svelte:2800`, `:4000`). The desk opens a row.
- Run all eight gates before and after, and report each.

## 6. Report

`docs/sessions/report-code-row122_r1_2026-10-22.md`, with: what you changed (files and `path:line`); the step 0 findings; the tests, and that they do not compile before step 1 (step 3); the line count of `ScoreUploader.svelte` before and after; the eight gates before and after; and a section "What I could not establish" (every NOT ESTABLISHED and NOT READ above, closed or still open, including the drawn receipt).

## Owed to Dann

Nothing. Fable's review has no question for Dann; the file-name finding (section 5, fourth bullet) is a desk default when its row is written.

## Appendix: amendments of Fable's review and where r2 applies them

| No. | Applied | Where in r2 |
|---|---|---|
| 1 | yes | Section 2 last bullet; section 4 step 0 first sentence |
| 2 | yes | Section 3; section 4 step 2 |
| 3 | yes | Section 4 step 3; section 6 (consequential edit, the "which failed before" wording) |
| 4 | yes | Section 2 fourth bullet; section 5 second bullet (`fidelityBanner` at `:67-71`) |
| 5 | yes | Section 4 step 0 second sentence |
| 6 | yes | Section 5 fourth bullet |
| 7 | yes | Section 2 second and third bullets (handoff cite, stale QUEUE cite), fifth bullet, ratchet bullet |

## What I could not establish

- The r2 edit read every cite in `/root/shane` at `e0f4ad9` and ran nothing; the test and the drawn receipt are unrun.
- Whether `format-label.test.ts` with the parser-fed case runs green in the lane (Fable: read, not run).
- What the receipt reads on the alias after the change (the desk's walk with a real scan).
- The eight gate baselines at Code's start.
- The amendment 7 cite "`ingest.ts:323`" was confirmed as the line that returns `fileName` in `ingested`; that `fileName` comes from the reading file was taken from Fable and `scan.ts:114-117`.
