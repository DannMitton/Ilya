# Report, Code: N.202 Step 1 (the constant, the footer, the binder), with Step 0

2026-11-15, lane `cloud-lane-58`, cut from `Shane` at `2c07ab75` ("Afternoon desk 2026-11-15: N.202 ruled…"). Brief: `brief-code-n202-name-and-version_r2_2026-11-15.md`. Every claim below carries a line read or a run in this session.

## Step 0: read and report (nothing changed)

**The eight gates on the untouched tip** (no dev server running), against the baseline:

| Gate | Baseline | Measured |
|---|---|---|
| 1 phonology | 462 passed (462) | 462 passed (462) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 svelte-check | 0 errors, 12 warnings, 5 files | found 0 errors and 12 warnings in 5 files |
| 4 web | 5817 passed, 1 skipped (5818) | 5817 passed, 1 skipped (5818) |
| 5 score-parser | 842 passed, 5 skipped (847) | 842 passed, 5 skipped (847) |
| 6 blurb | 178 passed (178) | 178 passed (178) |
| 7 root integration | 159 passed (159) | 159 passed (159) |
| 8 ratchets | OK | ratchets: OK |

**One thing the task did not say:** the local `Shane` was at `649fe49`, not `2c07ab75`. I fetched `origin/Shane` (it stood at `2c07ab7`) and cut `cloud-lane-58` from that commit.

**Every line the brief cites, re-read at `2c07ab7`.** All matched except the following. (a) The brief's pattern `(?<![A-Za-z0-9])20\d\d[a-z](?![A-Za-z0-9])` does not match the footer's source text, because `i18n.ts:1047-1048` write ` 2026a` and the character before the year is the `0` of the escape. The string sweep by value (D5) does catch it, so the sweep is not optional. (b) `HeaderBar.svelte` line numbers for the false comments are as the brief gives (`:73-74`, `:94-97`, `:105-107`, `:113`); I will re-read each when Step 2 edits it.

**D5's grep over non-test source under `apps/web/src`** (the brief's pattern): four hits, all known: `HeaderBar.svelte:49` (the attribute), `:50` (the span), `TitleHeader.svelte:17` (a comment, `"2026a" version badge`), and `:162` (the span). No other hit. In test files the pattern hits only `library/binder.test.ts`, `barline-record.test.ts`, `exchange.test.ts`, `salvage.test.ts`. None under `e2e/` or `e2e-phone/`. A looser grep without the lookbehind found `i18n.ts:1047-1048` (the footer) and, as noise, French `’a` sequences.

**Title header `offsetHeight`**, measured in the live render (1440 px wide, the one tracked engraved fixture, a stored bass voice), identical in English and French: TEXT 106 px, MELODY 155 px, INSIGHTS 128 px (the visible `.title-header`; width 624 px; the `.logo` box 67.31 by 27 px).

**Ratchet line of every file Steps 1 to 3 touch** (`scripts/ratchets.json`; lines as measured): `+page.svelte` 5508 of 5534; `MarkupPane.svelte` 1362 of 1364; `InsightsPane.svelte` 744 of 744; `Drawer.svelte` 1981 of 1990 (Step 4 only); `i18n.ts` is exempt (data). `HeaderBar.svelte` (232), `TitleHeader.svelte` (448), `PageFooter.svelte` (235), `TitlePage.svelte` (214), `binder.ts` (288), `exchange.ts` (390), and `colour-story.test.ts` (147) carry no named ceiling, so the 1000-line default for a new file applies.

**Three rows for the desk (report only, nothing built):**
1. **The 39 pictures in `apps/web/static/guide/`.** I looked at the top 90 px of all 39 and at all of steps 13 to 34 at half size, then zoomed one footer. The sigil with "2026A" stands legibly in steps 01, 03, 04, 05, 06, 10, 11, 12, 35, 36, 37, 38, and 39; steps 02, 08, and 09 show only the right edge of the bar, with no sigil. The footer sentence "FREE AND OPEN SOURCE, ILYA 2026A OPERATIONALIZES…" is legible at 2x zoom in step 17. A footer line is visible at thumbnail size in the steps that show the foot of a page (13, 14, 16 to 22, 24, 26 to 34), but I zoomed none but step 17, so "2026A" in each of those is NOT ESTABLISHED. I did not establish whether steps 15, 23, and 25 show a footer; at half size none was legible there.
2. **The vowel-space sheet** prints with no footer and no version: `voice/chart/print-sheet.ts` calls `window.print()` at `:46` on a sheet that `VowelSpaceSheet.svelte` draws; I did not print it.
3. **The recorder's files** carry the build and not the version: `voice/engine/capture-file.ts:148` writes `build: __ILYA_BUILD__` into the JSON, and `:170` names the zip `ilya-captures-${__ILYA_BUILD__}-…zip`.

**Whether LEARN and GUIDE print a footer.** Neither does, measured on printed PDFs at 1440 px (`preferCSSPageSize`): LEARN prints 63 pages and no page holds "Free and open source"; GUIDE prints 26 pages and none does (the word "operationalizes" appears once, in the acknowledgements prose on page 23, not as the footer). `Paper/ReadingPaper.svelte` has no `PageFooter`.

## Step 1: what was built

- `apps/web/src/lib/version.ts` (new): `ILYA_VERSION = '2026b'`; `ILYA_BUILD`, read through `typeof __ILYA_BUILD__ === 'string'`; `ILYA_VERSION_YEAR`, the first four characters as a number.
- `i18n.ts:1047-1048`, and only those lines: `footer.attribution` takes `{version}` where `2026a` stood, in both languages. Every other character is unchanged.
- `Paper/PageFooter.svelte`: fills it with `tv('footer.attribution', language, { version: ILYA_VERSION })`. No prop carries it (`footer-credit.test.ts` still forbids an attribution prop).
- Binder: `+page.svelte` passes `appVersion: ILYA_VERSION` and `build: ILYA_BUILD`; `exchange.ts` and `binder.ts` take an optional `build` and write it into the manifest only when given. The schema number stays 1. `version` from `$app/environment` had no other use in `+page.svelte`, so its import went; the file is now 5509 lines (ceiling 5534).
- Tests: `version.test.ts` (4); `library/binder-build.test.ts` (3: build is written, no field when none is given, a manifest with `build` and one field the reader does not know reads whole); `components/footer-credit.test.ts` (2 added: exactly one `{version}` in each stored string and the footer reads the module; the filled sentence typed out in each language).

## Rendered checks (looked at)

- `report-code-n202-pictures/step1-foot-text-en.png`: the foot of page 1 of TEXT, English. The first line reads "FREE AND OPEN SOURCE, *ILYA* 2026B OPERATIONALIZES CRAIG GRAYSON'S *RUSSIAN LYRIC DICTION*…" (small capitals, the name in italic). The rest of the sentence, the flag, and "PAGE 1 OF 1" are as before.
- `step1-foot-text-fr.png`: the same, French. "GRATUIT ET À CODE OUVERT, *ILYA* 2026B MET EN ŒUVRE *RUSSIAN LYRIC DICTION* DE CRAIG GRAYSON…", "PAGE 1 SUR 1".
- `step1-binder-manifest.json`: one binder exported in the browser from the REPERTOIRE band's "Export this song" button, its `manifest.json` read from the downloaded zip: `"appVersion": "2026b"`, `"build": "2c07ab75"` (the tip this lane was cut from), `"schema": 1`. The harness's `suggestedFilename()` returned `download`, not the `.ilya` name; I did not investigate that.

## Gates after Step 1

| Gate | Before | After |
|---|---|---|
| 1 | 462 | 462 passed (462) |
| 2 | 248 | 248 passed (248) |
| 3 | 0 errors, 12 warnings | found 0 errors and 12 warnings in 5 files |
| 4 | 5817 passed, 1 skipped (5818) | **5826 passed, 1 skipped (5827)** (+9: 4 + 3 + 2) |
| 5 | 842 | 842 passed, 5 skipped (847) |
| 6 | 178 | 178 passed (178) |
| 7 | 159 | 159 passed (159) |
| 8 | OK | ratchets: OK |

**A flake, reported.** The first run of gate 4 failed one test, `voice/engine/open-extract.test.ts` "gives the same reading whichever vowel is asked", with a 5000 ms timeout. A dev server was running beside the gates. The file passes alone (9 of 9, 10.9 s), and gate 4 passes in full with the dev server stopped (the count above). I stopped the dev server during gates from then on. The test takes about 5 s of work against a 5 s limit, so it can fail on a loaded machine.

## Not established

- Which of the guide pictures other than those named above show "2026A" in a footer (row 1).
- Whether the binder's downloaded file name is correct in a real browser (the harness read `download`).
