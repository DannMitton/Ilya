# Report: row 121, a scan's wordless banner knows it is a scan

Branch `cloud-lane-11`, after N.188, its own commit. Brief: `brief-code-row121-scan-banner-origin_r2_2026-10-19.md`. Cloud session, Sonnet 5.5.

## Step 1: established before any change

`tch-1.musicxml` (homr, `<software>homr</software>`, no `<lyric>`) through `readingFile` and the real `ingestScoreFile`, with the real `MusicXmlScoreParser` behind the mini-DOM shim (a scratch test, deleted; the values were written to a file because the web vitest config swallows `console.log`):

| value | result |
|---|---|
| `provenance.via` | `direct` |
| `result.score.source.origin` | `homr-musicxml-from-image` |
| `noLyricsNoticeKey(provenance)` | `upload.banner.noLyrics` |

The brief's premise holds: a dropped scan took the false line. `via` was not `'reader'`, so no stop was needed.

## The fix, by file

- `apps/web/src/lib/score/ingestion/ingest.ts`: `noLyricsNoticeKey(p, origin: SourceOrigin)` returns the scan line when `p.via === 'reader'` or `origin === 'homr-musicxml-from-image'`; `SourceOrigin` added to the `@ilya/score-parser` import; the doc comment above it rewritten (item 2a).
- `apps/web/src/routes/+page.svelte:2829`: the one caller passes `ingested.result.score.source.origin`, changed in place on the same line (the file stays at its ceiling, no line added).
- `apps/web/src/lib/i18n.ts:1408`: the stale comment now names `lib/score/ingestion/ingest.ts`, not the module that does not exist (item 2a).
- `apps/web/src/lib/score/no-lyrics-notice.test.ts`: see below.

## Tests

Existing calls that gained the origin argument (`'musicxml-direct'`, a file's origin), by name: `a MusicXML file with no lyrics draws 1a`; `a compressed or converted file is still a file, not a picture` (two calls); `a photograph draws 1b`; `a scanned PDF draws 1b`. Their expected values are unchanged.

New, in `describe('row 121 ...')`: a homr reading handed back as a `.musicxml` file (`via: 'direct'`) draws 1b, through `readingFile` and the real ingest; the same notes with the software element changed to MuseScore draw 1a; `via: 'reader'` still draws 1b whatever the origin. The file went from 9 to 12 tests.

Gates, row 121 commit (baselines from the N.188 report): phonology 267, dictionary 248, blurb 145, integration 55 (unchanged, not touched); web-check 0 errors and 12 warnings; score-parser 744 passed, 5 skipped; ratchets OK, no ceiling raised; web-test 2847 passed (163 files), 2844 plus the three new tests.

## Left alone, on purpose

- **`fidelityBanner`** (`ingest.ts:67-71`) has the same blind spot, so `upload.banner.reader` still never shows on a homr scan. Untouched: that banner's last sentence still says to type the words "into the Input field", and its rewrite is owed to Dann before it is shown more widely (row 103).
- **`formatLabel`** (`ScoreUploader.svelte:826-836`, drawn at `:989`) still reads "Format: MusicXML (direct)" for a homr scan (visible in the N.188 pictures). The homr route carries no PDF-or-image kind into `ui.ingested`, and `ScoreUploader.svelte` is at its ceiling (1358). The desk numbers it as its own row.

## Could not establish

- What a singer sees on the alias: the reader does not run in the lane. Only the code path was run, in Node. DONE is the desk's look on the alias after the merge.
- A file from another program that writes `<software>homr</software>` would also read as a scan. Nothing else writes it that I know of; not checked.
