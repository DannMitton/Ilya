# Fable review of the row 121 brief r1, 2026-10-19

Provenance: the final message of a Fable helper spawned by the desk (Opus) 2026-10-19 20:3x, read-only, against a clone of `Shane` at `ba6f064`; returned 20:4x; 175,170 tokens, 58 tool uses, 9 minutes (the desk had stated a worst case of 150k). Transcribed by script, unedited below the rule. All five amendments are applied in `brief-code-row121-scan-banner-origin_r2_2026-10-19.md`.

---

**SEND WITH AMENDMENTS**

**Amendments**

1. **Step 1 and test 1 will throw as written.** `apps/web` vitest runs in Node with no `DOMParser` (`apps/web/vite.config.ts:36-41`, no environment set). `ingestScoreFile` hands the string to the real parser (`ingest.ts:306`), which throws "String MusicXML needs a DOM parser" (`packages/score-parser/src/musicxml-parser.ts:865-868`). Code would stall here. Replacement wording for step 1 and test 1: *"Feed the real parser through the test shim, as `apps/web/src/lib/analysis/diction-fold-live.test.ts:29-52` does: `musicxmlParser: { canParse: () => true, parse: (input) => new MusicXmlScoreParser().parse({ ...input, data: parseXml(input.data as string) as unknown as Document }) }` with `parseXml` from `$lib/score/ingestion/mini-dom`, passed as `deps.musicxmlParser`. Dispatch (`via: 'direct'`), `readingFile`, and `resolveOrigin` all run for real."* The fixture carries `<software>homr</software>` at line 8 and no `<lyric>`, so it is the right one.

2. **Wrong test file named.** The existing `noLyricsNoticeKey` tests are in `apps/web/src/lib/score/no-lyrics-notice.test.ts:13-27`; `ingest.test.ts` never imports it. Four calls there pass a bare provenance and change with the signature. Recommend the two-argument form, `(p: IngestProvenance, origin: SourceOrigin)`, so each existing call grows by one argument and `+page.svelte:2829` stays one line: `noLyricsNoticeKey(ingested.provenance, ingested.result.score.source.origin)`. `score` is always present (`types.ts:902-908`); `SourceOrigin` is exported (`index.ts:21`, `types.ts:216-223`). Put the homr fixture test in the same file.

3. **Two comments go stale.** The doc comment at `ingest.ts:74-81` says the two are told apart by `provenance.via === 'reader'`; `i18n.ts:1408` names `lib/score/no-lyrics-notice.ts`, a module that does not exist. One clause each; `i18n.ts` is ratchet-exempt.

4. **Add to "Not in this row":** `formatLabel` (`ScoreUploader.svelte:826-836`, drawn at `:989`) shows "Format: MusicXML (direct)" on a homr scan in the arrived receipt. A singer sees it. The reader strings exist (`i18n.ts:1056-1057`), but the homr route carries no PDF-or-image kind into `ui.ingested`, and `ScoreUploader.svelte` is at its ceiling (1358 of 1358). Have Code name it in the report; a QUEUE row for the desk.

5. **Citations not on the branch.** `docs/sessions/review-fable-brief-n188_r1_2026-10-19.md` is absent at `ba6f064`, and `QUEUE.md` ends at row 119 (no 120 or 121). The brief carries the finding, so nothing is lost; say "not on the branch" so Code does not look. Cosmetic: `resolveOrigin` runs `:1098-1107`, not `:1104`.

**On the fix itself (check 2).** Right, and origin is the better signal than a `via` change for this row, because it rides in the bytes and survives storage. Every scan path lands on it:

- Upload, image or PDF: `take` (`ScoreUploader.svelte:284-292`) to `readScanAsScore` to `readingFile` (`scan.ts:102, 114-117`) to `handleFile` to `ingestScoreFile` with `via: 'direct'` (`:576-586`, `ingest.ts:191-195`).
- Reopened from the library: `onMount` (`ScoreUploader.svelte:786-797`) to `restoreStoredScan`, same `readingFile` (`restore.ts:108`). A kept reading is used only when its stamp equals the installed reader's (`restore.ts:40-42, 52`), which writes the tag (`generate-main.ts:1143-1146`); a mismatch is re-read.
- Replace: the receipt hands the new file back to `take` (`+page.svelte:4037`). A binder import restores through the same `onMount`.
- HEIC: decodes and follows the image path, or fails before homr as `IMAGE_UNDECODABLE` (`:601-602`). No third case.
- Every homr result goes through `joinPages` (`homr-reader.ts:379-383`), which keeps `identification` (`join-pages.ts:173-175, 583`).
- `?reader=ilya` writes no `<software>` (`recognized-to-musicxml.ts:209` is the only header line), so the `via === 'reader'` half of the OR still earns its place.

False positive: a singer uploading MusicXML that homr wrote. Ilya offers no such download (the binder is a zip of records, `+page.svelte:3015-3019`), so this is a singer running homr themselves, and the string is still true in substance: the words were not read from the print. `includes('homr')` is a substring match over all `<software>` text (`:1052, 1102`); no real collision known. Nothing to do.

**Ceiling and caller (check 3).** Workable. `+page.svelte` is 5641 of 5641; the ratchet counts newline-split lines (`ratchets.mjs:63`); the change is in place on line 2829.

**`fidelityBanner` and other readers of `via` (check 4).** Leaving it is right; the row 103 debt is real (`QUEUE.md:38`, "Owed to Dann before the flag comes off"). Other readers: `formatLabel` (amendment 4, matters mildly); `pageFor` (`ScoreUploader.svelte:761-764`), by design, since homr sets no `lastPage`, no singer-visible effect; `:913` is `fidelityBanner`'s caller. Nothing in `apps/web` reads `source.origin` today; this row is its first consumer.

**Tests (check 5).** Checkable in the cloud after amendment 1. `readFileSync` of `apps/web/src/lib/omr/fixtures/tch-1.musicxml` and Node's `File` are both already used in web tests (`join-pages.test.ts:19-26`, `diction-fold-live.test.ts:49`).

**Dann's to decide:** none.

**Could not establish:** whether homr-web versions before `0.2.0-ilya.7` wrote the `<software>` tag (history is one squashed commit, `f06c1af`); it does not matter because a stale stamp forces a re-read. Whether any notation program's `<software>` text contains "homr". What a singer sees on the alias (the brief marks this itself).