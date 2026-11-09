# Report: integration step 8, scan words on for every singer, and the two scan banners, 2026-11-09

Branch `cloud-lane-38`. Dann ruled 2026-11-09 11:56 that scan words ship to colleagues as a preview; strings ratified 14:19 to 14:24. Commits: 8a and 8b together in one (they share the stamp and the pins), then one small fix. Nothing pushed to `Shane` or `main`; no pull request; `docs/memory/` untouched.

## 8a. The `?words=read` switch is gone

- **Callers found** (grep over `src`, `e2e`, `e2e-phone`, and the packages): `underlayOn()` was read in one place, `omr/homr-reader.ts` (the `underlay:` part of `makeReader`); `scanStamp(search)` in `omr/scan.ts:98`, `omr/restore.ts:41,51`; the rest were tests. `kept-bands.test.ts` passes `'?words=read'` as a search string to the `?strips=measure` helper, which ignores it; I left it.
- **What I did:** `underlay-switch.ts` no longer has `underlayOn`, `WORDS_QUERY`, `WORDS_ON`; its header says the switch is gone and why. `homr-reader.ts` builds the underlay reader wherever a Worker and an `OffscreenCanvas` exist (as before, none in a test or an old browser, so the scan is then read for notes alone). The desk's measure switches stay as they were: `?looks=off` and `?extender=a|b` (`looksOn`, `extenderArm`), still changing no stamp. `scanStamp()` stays as the one name callers read the stamp by; it takes no argument now.
- **The stamp:** `UNDERLAY_READER` (`underlay@4`) now joins `READER_STAMP` in `stamp.ts`, as the switch's own comment said it would (`homr-web@0.2.0-ilya.7/465+underlay@4`). The block comment above `UNDERLAY_READER` now says it is joined.
- **Tests:** `stamp.test.ts` (the "does not yet carry" test inverted to pin that they are joined; the version test expects the joined form). `underlay-switch.test.ts` rewritten: the `underlayOn` tests are gone (11); new ones pin that one stamp names both readers, that a reading kept with the homr stamp alone is read again once and kept with the joined stamp, that readings under `underlay@0` to `@3` are read again, and that the measure switches change no stamp. `underlay-integration.test.ts` calls `scanStamp()`. Web unit moved 4694 to 4683 (the removed `underlayOn` cases outnumber the new).
- **A slip, fixed:** the first gate run showed svelte-check at 6 errors (I had cut the address helper `here` out with the switch, and the integration test still passed an argument); I restored `here` and the argument and re-ran: 0 errors, 12 warnings.

### What a singer with a stored scan sees on first reopen

Every scan kept before this change carries the homr stamp alone (`homr-web@0.2.0-ilya.7/465`), which no longer equals the current stamp, so `isCurrent` is false and the scan is **read once more on its next opening**, through the reading wait, now with the words under the notes read; the new reading is kept with the joined stamp, and later openings use it as they do now. The scan's bytes are kept, so nothing is re-uploaded. How long the one re-read takes per page is not measured (lane 34's step 3 report says the same). A singer with no stored scan sees the reader read the words on her first scan. A reading made with the old switch on under `underlay@3` or earlier is also read again once (pinned).

## 8b. The two strings, and the pins

`upload.banner.reader` and `upload.banner.noLyricsScan` replaced in `i18n.ts`, English and French, exactly as in the message (U+2019 apostrophes; the French has no space before the semicolon in the first). **Pinned** in `apps/web/src/lib/insights/ratified-lines.test.ts` (a new block, 3 tests: all four texts character by character, and the typography). `score/no-lyrics-notice.test.ts` pinned the old text of the same two keys from the banner's side; I updated those two assertions to the new text (and renamed the second, "replaced 2026-11-09"). `upload.banner.wordsPartlyRead*` are untouched.

### Which banner shows when (read in the code)

The drawer's scan banner is `ScanBanner` fed by `noLyricsKey`/`noLyricsFile`, set from `scanNotice(warnings, provenance, origin, fileName)` (`+page.svelte:2770`, `score/ingestion/ingest.ts`):
- **No words read at all** (the parse has a `no-lyrics-found` warning): for a scan (origin `homr-musicxml-from-image`) `upload.banner.noLyricsScan`, now "Ilya could not read any words from this image…"; for any other score, `upload.banner.noLyrics` ("This score has no words in it…"). This wins over the next case if both warnings are present (`scan-notice.test.ts:47`).
- **Some bars unread** (a `words-partly-read` warning with bars): `upload.banner.wordsPartlyReadOne` for a single bar, `upload.banner.wordsPartlyRead` for several, with the bars named and linked.
- **All read:** no banner (`scanNotice` returns null).

**One finding the desk should see:** `upload.banner.reader` ("This score is Ilya's synthesis from an image…") **is not shown anywhere.** The key exists, is pinned, and nothing in the page, `ScanBanner`, or `ScoreUploader` reads it (grep over `src`). So the sentence telling a singer to check Ilya's reading against her original, which Dann ratified, does not reach her yet; the banners she does see are the three above. I did not wire it (not asked); where it should show (on every scan? beside the others?) is the desk's call. I also did not find any other text in `src` saying Ilya does not read printed words (grep).

## Gates (baseline on Shane, then at the code tip of this step)

| Gate | Baseline | Now | Move |
|---|---|---|---|
| 1 phonology | 407 | 435 | +28 (row 157) |
| 2 dictionary | 248 | 248 | none |
| 3 web check | 0 errors, 12 warnings, 5 files | same | none |
| 4 web unit | 4198, 1 skipped | 4683, 1 skipped (4684) | +485: 496 after step 7, then −11 here |
| 5 score-parser | 785, 5 skipped | same | none |
| 6 blurb | 148 | 164 | +16 |
| 7 integration | 125 | 125 | none |
| 8 ratchets | OK. | OK. | none |

## Playwright (both projects, this tree)

**160 passed, 11 failed, 2 skipped** (37.1 min). The 11 are the same 11 that are red on Shane (step 7's report lists each): `glue-typed-marks` ×2, `heic-reader-path`, `insights-page`, `loupe-header`, `print-pages`, `singer-paths`, phone `input-views:134`, `phrase-ends:26`, `relining:70`, `relining:95`. **No new red from this step.** The five that step 7 fixed stay green. Note that no spec here reads a real scan through the words reader: the e2e scans are MusicXML fixtures, so the reader's own path is covered by unit tests only.

## What I could not establish

- **How long the one re-read takes** per page, and whether the model files fetch for a colleague on a first scan (nothing in this sandbox reaches them).
- **That the words reader works in a browser end to end** for a real scan; the desk's row 114 measure is the evidence, not a run of mine.
- **Where `upload.banner.reader` should show** (above).
