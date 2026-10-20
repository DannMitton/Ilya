# Brief for Code, cloud lane: row 121, a scan's wordless banner knows it is a scan, r1

Written by the desk (Opus) 2026-10-19 20:3x. QUEUE row 121. For a cloud session, Sonnet 5.5, on branch `cloud-lane-11`, after row 120 (N.188) in the same branch. Fable reviews this brief before Code gets it (`CONTRACT.md` §1 item 19). No new strings: both are ratified and in the tree.

## What the singer sees

A singer drops a scan or a photograph of a song. The reading carries no words, the singer has typed the poem, and Ilya seats it one syllable a note. The courtesy line under the receipt says *"Ilya does not read the words printed in an image. …"* (`upload.banner.noLyricsScan`), never *"This score has no words in it. …"* (`upload.banner.noLyrics`), which is false for a printed song. A MusicXML file the singer uploads with no lyrics keeps `upload.banner.noLyrics`, as today.

## Why

- Dann 2026-10-14 02:14, on «Средь шумного бала» from a scan: *"laughably false: the evidence is right there"*. Row 95 (shipped `0b0c52a` 2026-10-14, accepted on tests, never walked) built `noLyricsNoticeKey` to choose between the two lines (`apps/web/src/lib/score/ingestion/ingest.ts:85-86`, read at `apps/web/src/routes/+page.svelte:2829`).
- **It keys on `provenance.via === 'reader'`, which the singer's scan route never sets.** Found by Fable's review of row 120 (`docs/sessions/review-fable-brief-n188_r1_2026-10-19.md`, amendment 1) and read by the desk 2026-10-19 at `ba6f064`: the homr route (`apps/web/src/lib/score/ScoreUploader.svelte:287-289`, `readScanAsScore`) hands the reading to `handleFile` as a `.musicxml` file (`apps/web/src/lib/omr/scan.ts:102`, `:114-117`), which `ingestScoreFile` ingests with `via: 'direct'` (`ingest.ts:191-195`). `via: 'reader'` is set only on the E.16 reader behind `?reader=ilya` (`ingest.ts:228-244`). So a dropped scan takes `upload.banner.noLyrics`.
- **The score knows it is a scan:** homr writes `<software>homr</software>` (`third_party/homr-web/src/musicxml/generate-main.ts:1144-1146`), the join keeps `identification` (`apps/web/src/lib/omr/join-pages.ts:173-175`, `:583`), and the parser sets `source.origin = 'homr-musicxml-from-image'` (`packages/score-parser/src/musicxml-parser.ts:1050-1052`, `resolveOrigin` at `:1098-1104`), on `ParseResult.score.source`.
- What a singer sees on the alias today: NOT ESTABLISHED (code read only). The first step below establishes it.

## The work

1. **Establish it first.** The reader does not run in the lane, so establish it one level down: pass `apps/web/src/lib/omr/fixtures/tch-1.musicxml` (a homr reading) through `readingFile` (`scan.ts:114-117`) and then `ingestScoreFile`, as the singer's route does, and record `provenance.via`, `result.score.source.origin`, and what `noLyricsNoticeKey` returns. Report the three values before changing anything. If `via` is already `'reader'`, stop and report: the brief's premise is wrong.
2. **The fix:** `noLyricsNoticeKey` decides "scan" when the provenance says reader **or** the parsed score's `source.origin` is `'homr-musicxml-from-image'`. Change its signature to take what it needs (the provenance and the origin, or the `IngestedScore`) and update its one caller (`+page.svelte:2829`). `+page.svelte` is at its ceiling (`scripts/ratchets.json`); the call site line must not grow the file.
3. **Not in this row:** `fidelityBanner` (`ingest.ts:67-71`) has the same blind spot, so `upload.banner.reader` never shows on a homr scan. Do not change it: that banner's last sentence still says to type the words "into the Input field", and its rewrite is owed to Dann before it is shown more widely (`docs/memory/QUEUE.md`, row 103). Say in the report that it is untouched and why.

## Tests and the done state

1. `noLyricsNoticeKey`: a homr-stamped score (`tch-1.musicxml` through the real ingest) with `via: 'direct'` returns `upload.banner.noLyricsScan`; a plain MusicXML file returns `upload.banner.noLyrics`; `via: 'reader'` still returns `upload.banner.noLyricsScan`. Existing tests in `ingest.test.ts` pass unchanged or are changed on purpose and named.
2. All eight gates at baseline, with web-test counted. No ceiling raised.
3. **DONE** is a look on the alias after the merge: the desk drops a wordless scan with a typed poem and reads the line, then Dann when convenient.

## The lane

Branch `cloud-lane-11`, after row 120, its own commit and push. Never `Shane` or `main`; no pull request; Dann merges. Do not edit `docs/memory/`. Report: `docs/sessions/report-code-row121_r1_2026-10-19.md`, with the three values from step 1, the diff by file and line, the test counts, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
