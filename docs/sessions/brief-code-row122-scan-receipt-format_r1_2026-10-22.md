# Brief r1: row 122, the receipt of a scanned score names what was read (2026-10-22)

Written by the desk (Sonnet) 2026-10-22 about 21:5x. NOT Fable-reviewed; it waits for Sunday 2026-10-25 05:00 and Dann's say-so (`CONTRACT.md` section 1 item 19). Found by Fable's review of row 121, amendment 4 (`review-fable-brief-row121_r1_2026-10-19.md`).

For Code in a cloud session, Sonnet, on a lane cut from `Shane` by Dann. It has no dependency on batch C, N.194, row 134, or N.195. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code carries a `path:line` the desk read on 2026-10-22, or says NOT ESTABLISHED or NOT READ. Do not write with git beyond one commit per step on the lane; no pull request; no other branch; no brief file in any commit.

Cost, a range and not measured: about 40k to 120k Sonnet tokens.

## 1. The need and the done state

A singer drops a PDF or a photograph of a score. homr reads it, and the receipt that arrives says "Format: MusicXML (direct)", which is what a dropped `.musicxml` file would say. It is not what the singer did. Done when the receipt of a homr-read PDF says "Format: PDF → MusicXML" and the receipt of a homr-read photograph says "Format: photograph → MusicXML", in both languages, and every other receipt reads as it does today.

## 2. What the desk read (read, not run)

- `formatLabel(p: IngestProvenance)` maps provenance to a string (`apps/web/src/lib/score/ScoreUploader.svelte:826-836`) and is drawn at `:989`. For `via: 'reader'` it already picks the PDF or the photograph string by `p.sourceFormat` (`:831-833`).
- The strings exist and are ratified: `upload.format.pdfReader` ("Format: PDF → MusicXML") and `upload.format.imageReader` ("Format: photograph → MusicXML") at `apps/web/src/lib/i18n.ts:1094-1095`, with French beside them. The direct strings are at `:1070-1071`.
- The homr route hands its reading back as a MusicXML file that `handleFile(xml)` ingests, so the provenance is `via: 'direct'` (`ScoreUploader.svelte:287-290`; `apps/web/src/lib/omr/scan.ts:77-79`). The provenance type is `apps/web/src/lib/score/ingestion/ingest.ts:50-57`; its `direct` variants carry no kind.
- The parser reads homr's `<software>homr</software>` stamp as `source.origin === 'homr-musicxml-from-image'` (`ingest.ts:83-86`), and the page reads it as `ingested.result.score.source.origin` (`apps/web/src/routes/+page.svelte:2800`). So the receipt can tell a homr reading, but not whether the scan was a PDF or a photograph.
- The kind is known where the scan is taken: `take()` holds `kind: 'image' | 'pdf'` when it calls `readScanAsScore(file, kind, ...)` (`ScoreUploader.svelte:287`).
- `ScoreUploader.svelte` is at its ceiling: 1358 lines today (`wc -l`, 2026-10-22), and `scripts/ratchets.json:19` records 1358. Any line added to it must be paid for in the same change.
- NOT READ: the restore path. `restore` carries `fileName`, `bytes`, `answers`, and `reading` (`ScoreUploader.svelte:112-119`). Whether `bytes` are the scan or the reading, and so whether a restored scan's receipt can know its kind, is NOT ESTABLISHED.

## 3. DESK DEFAULT, his to wave off

A pure function that decides the receipt's string key from `(provenance, origin, scanKind)`, in a new file `apps/web/src/lib/score/format-label.ts`, with its own test. `ScoreUploader.svelte` imports it and loses `formatLabel`; the component keeps one new piece of state, the scan's kind, set where `take()` holds it and cleared where the receipt clears. The reason: the ceiling forbids net growth in the component, and a pure function is testable where `+page.svelte` and the component are not. No new string and no French: the two existing reader strings are reused.

## 4. Steps

**Step 0, read, change nothing.** Read the restore path and report whether a restored homr scan can know its kind (from the file's bytes with the same sniff `take()` uses, `readableKind`, or from something stored). Read every place that draws or reads `upload.format.*` or `formatLabel` under `apps/web/src` and list them with `path:line`. Report this before you change code.

**Step 1.** Add `format-label.ts`: the pure function and its types. Cases: every current provenance variant keeps today's key; `via: 'direct'` with `origin === 'homr-musicxml-from-image'` and a scan kind of `'pdf'` gives `upload.format.pdfReader`, and `'image'` gives `upload.format.imageReader`; a homr origin with no known kind keeps today's `musicxmlDirect` key and the report says so.

**Step 2.** Wire the component: remove `formatLabel`, import the function, set the scan kind in `take()` at the `readScanAsScore` call, clear it with the receipt, and handle the restore path as step 0 allows. `ScoreUploader.svelte` must end at or under 1358 lines. If it cannot, move code out until it does; do not raise `scripts/ratchets.json`.

**Step 3.** Tests in `apps/web/src/lib/score/format-label.test.ts` for every case in step 1. State which fail before step 2 and pass after.

## 5. Constraints and the cross-site line

- No strings and no French. If a homr scan needs words the two reader strings do not say, stop and report; wording is Dann's.
- The provenance type (`ingest.ts:50-57`) does not change in this row. The fidelity banner (`ingest.ts:68`, by `via`) and the no-lyrics notice (`ingest.ts:89-90`, by `via` and `origin`) read provenance too and must read exactly as today; say in the report that you checked.
- Every other site that shows or reads the receipt's format string, and what depended on them agreeing: those listed by step 0. If one draws the format a second way (a print footer, the Insights provenance line, `provenance.ts`), name it; do not change it in this row.
- Run all eight gates before and after, and report each.

## 6. Report

`docs/sessions/report-code-row122_r1_2026-10-22.md`, with: what you changed (files and `path:line`); the step 0 findings; the tests and which failed before; the line count of `ScoreUploader.svelte` before and after; the eight gates before and after; and a section "What I could not establish" (every NOT ESTABLISHED and NOT READ above, closed or still open).
