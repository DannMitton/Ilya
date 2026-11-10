# Report: integration step 10, the reader banner and the blurb's lexicalGk, 2026-11-10

Branch `cloud-lane-38`. Step 9 accepted as built (the compounds, the phrase entries, and «лёгкие» (lungs) take [x]; no word list). Commits: the banner; the blurb; then two small test fixes. Nothing pushed to `Shane` or `main`; no pull request; `docs/memory/` untouched.

## The reader banner (`upload.banner.reader`)

**Where the existing banners mount:** `apps/web/src/routes/+page.svelte`, in the Drawer's input snippet right after the `{#key doc.id}` `ScoreUploader`, at the line `{#if noLyricsFile}` (about `:3984` before this change, `:3990` for the `ScanBanner`). The component is `lib/components/Drawer/ScanBanner.svelte`, which draws one `<p>` (unstyled on purpose, as its comment says). The key and file are set at `:2770` in `applyArrival` from `scanNotice(...)`, and cleared at `:2117` (`handleClearScore`) and `:3140` (a song switch).

**What I built:**
- `readerNoticeKey(origin)` in `lib/score/ingestion/ingest.ts`: `upload.banner.reader` for the origin `homr-musicxml-from-image` (a scan or photograph read by homr), null for every other origin (MusicXML, MXL, MEI, MNX, a vector PDF, MIDI). `ScanNoticeKey` gains the key so `ScanBanner` takes it.
- The page draws a `ScanBanner` with that key **on the same line, before `{#if noLyricsFile}`**, so it sits in the same slot and style, above any no-lyrics or partly-read banner when both apply. It reads the open score's origin directly, so it shows for a scan just uploaded and for a scan reopened from storage, and it goes with the score (a new scan upload sets a new score; a song switch or Clear removes it). `+page.svelte` stays at 5534 lines (the addition is on an existing line).
- **"Dismissible exactly as those are":** the existing scan banners are not dismissible (only the Finale `denigma` banner has a Dismiss button, in `ScoreUploader.svelte`). So this one is not dismissible either; it is gone when the score is. If the desk wants a Dismiss on all of them, that is a separate change.

**Tests (`lib/score/reader-banner.test.ts`, 6):** shown for a score read as a homr reading (the real Sunless MusicXML fixture with its `<software>` set to homr, ingested through `ingestScoreFile`, origin `homr-musicxml-from-image`); absent for the same fixture unchanged (`musicxml-direct`) and for every other origin; the page source puts the reader banner before `{#if noLyricsFile}` on one line (so it is above the wordless banner, which `scanNotice` still earns beside it for a scan with no words: `noLyricsScan`); and the banner prints the ratified sentence in both languages. The order is read from the page source because a rule inside a `.svelte` file cannot run under vitest.

## The blurb and `lexicalGk`

**What the Inspector said before** (read by running the engine's log entry for the г through `composeBlurb`, real blurb data):
- «мягкий»: "⟨г⟩ stays [x]: the sound right after it is not soft." (Grayson p. 206); French « ⟨г⟩ reste [x] : le son qui le suit immédiatement n'est pas palatalisé. »
- «мягкие»: "⟨г⟩ softens to [x] before the soft [kʲ]: a labial (or velar) like [ɡ] is softened only by another soft labial (or velar)." (p. 209).
Both misdescribe the sound: the г does not "stay" and does not "soften"; the root carries a plain [x]. Neither the devoicing line nor the word-final line was involved (step 9's rule sets no `devoiced` flag), so there was no devoicing sentence to correct, but the palatalization lines it fell into were wrong.

**What I changed:** `deriveRule` returns `lexical-gk` for the flag, ahead of the softening and devoicing rules; `types.ts` knows the flag; `data/blurb-composer.json` has one process, `lexical-gk:г`, citation p. 17 (Grayson's «мягкий» page). After: EN "In the roots мягк- and лёгк-/легк-, ⟨г⟩ before ⟨к⟩ is [x], not the [k] that devoicing would give." FR « Dans les racines мягк- et лёгк-/легк-, ⟨г⟩ devant ⟨к⟩ se prononce [x], et non le [k] que donnerait le dévoisement. » The composer still puts the г's identity sentence ("The default sound for the letter ⟨г⟩ is /ɡ/.") first, and the citation reads "(Grayson, pp. 145, 17)" (the identity's page and the rule's). **These two sentences are mine, PROPOSED, and not ratified;** Dann or the desk should rule them. Tests: `tests/lexical-gk.test.ts` (4: its own rule, both languages and the page, no "stays/softens", other г unaffected) and the French-parity count 193 to 194. Blurb tests: 164 to 168.

## Gates (baseline on Shane, then at the final code)

| Gate | Baseline | Now | Move |
|---|---|---|---|
| 1 phonology | 407 | 456 | +49 (steps 3, 9) |
| 2 dictionary | 248 | 248 | none |
| 3 web check | 0 errors, 12 warnings, 5 files | same | none (a typing error in my first test, caught by this gate and fixed) |
| 4 web unit | 4198, 1 skipped | 4689, 1 skipped (4690) | +491: +485 before, +6 here |
| 5 score-parser | 785, 5 skipped | same | none |
| 6 blurb | 148 | 168 | +20: +16 (row 157), +4 here |
| 7 integration | 125 | 125 | none |
| 8 ratchets | OK. | OK. | none |

## Playwright (both projects)

**160 passed, 11 failed, 2 skipped** (36.3 min), `--trace off`, Chromium `/opt/pw-browsers/chromium`. The 11 are the same ones that are red on Shane (listed in step 7's report): `glue-typed-marks` ×2, `heic-reader-path`, `insights-page`, `loupe-header`, `print-pages`, `singer-paths`, phone `input-views:134`, `phrase-ends:26`, `relining:70`, `relining:95`. None is new. No spec shows the reader banner (the e2e scans are MusicXML fixtures), so the banner is covered by the unit tests only.

## What I could not establish

- **Whether the banner reads well on the page** (not seen): it is plain text in the Drawer's slot, above the other scan banners.
- **Whether every reopened scan has origin `homr-musicxml-from-image`:** it comes from the stored reading's MusicXML, which homr stamps; I read this in the parser (`musicxml-parser.ts:1101`), not on a stored song.
- **The blurb sentences** (proposed), and whether the pair of page numbers in the citation reads well.
