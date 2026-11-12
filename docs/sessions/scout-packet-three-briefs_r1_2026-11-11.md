# Scout packet for the Fable review of three Code briefs (Sonnet, 2026-11-11 23:0x)

Saved by the desk from the helper's returned text (subagent writes are refused). Harness count 244,033 tokens, 79 tool uses, 7.1 min. Brief: `brief-sonnet-scout-three-briefs_r1_2026-11-11.md`. Tree `ad90f5a6`.

## Findings that need Fable's attention first (the helper's words, condensed by the desk)

1. The rulings of 2026-11-11 22:10 to 23:03 are not in `docs/memory/OPEN.md` at `ad90f5a6`: they are in the Mac's working copy, uncommitted at 23:0x. Fable reads them there (or after Dann's commit).
2. "Both copies of `blurb-composer.json`" (rhyme brief, step 4) is WRONG: one file, `data/blurb-composer.json`; `apps/web/static/data` is a git symlink to `../../../data`.
3. The Inspector's Spot Reconstitution control is a single checkbox (`InspectorPanel.svelte:1009-1019`, label from `:60-64`, keys `inspector.spot.reduction` and `inspector.spot.reconstitution`, `i18n.ts:2516-2517`). The `inspector.spotRecon.*` keys (`i18n.ts:783-786`) are read by no code. (Desk error owned 23:0x: the 22:56 ruling rested on them; re-asked.)
4. `cdn.jsdelivr.net` is still reached at run time: `lib/score/ScoreUploader.svelte:372-373` calls `createWorker('rus')` with no paths (tesseract's CDN defaults; `e2e/heic-reader-path.test.ts:42-45`). `lib/omr/underlay-recognize.ts:8, 35, 108` already passes local paths, pinned by `underlay-recognize.test.ts:45`.
5. `vercel.json:37` is a `Content-Security-Policy-Report-Only` header; `lib/vercel-headers.test.ts:40` pins the origin list.

## Closing polish lane: corrections and further sites
- Step 1: other readers of "has readings": `lib/markup/MarkupPane.svelte:449` (`hasReadings = Object.keys(formants).length > 0`); `routes/+page.svelte:1731` → `scoreStateLine` (`lib/components/Drawer/bandState.ts:222-262`), which calls itself the second reader of VoiceAnchor's rule; `isUsable` users `analyze-score-adapter.ts:204, 226, 286`, `InsightsPane.svelte:86, 241`. `voiceCalibrated` has one code reader, `+page.svelte:4170`.
- Step 2: a third `voiceTypePrint` caller, `insights/identity.ts:28-32` (`composeIdentityLine`, keys `i18n.ts:1818-1819`). Further pins of the old strings: `markup/subtitle.test.ts:6-7`, `insights/identity.test.ts:89-92`. Line 334 of `singer-blocks.ts` has no `i.generic` test today; `i.generic` is read at `:251`.
- Step 3: pin test `components/install-prompt-gate.test.ts:22-28` (regex `/ios_chrome_body: '([^'\n]+)',/g` needs a single-quoted literal with no `'` inside: the French line's apostrophes must be ’).
- Step 4: French pin `text/poem-offer-metadata.test.ts:127-128` ('Пимен · Борис Годунов'); `operaLine` caller `components/Drawer/PoemLibraryCard.svelte:53`. Bytes check: Node zlib gives 247,522 gzip and 178,015 brotli (Python gzip -9 gives 247,257).
- Step 5: further sites: `lib/page-fit.ts:71, 75, 130`; `lib/provenance.ts:215`; `pipeline.ts:44, 487` (`markLatinWords`, the only caller of `isLatinWord`); Richter credit read at `Paper/TitlePage.svelte:140`, `SubsequentPage.svelte:100`, `Paper.svelte:155`, text `footer.richter` (`i18n.ts:1034`) at `PageFooter.svelte:58`; word tokenizers with `\p{L}`: `text/poem-compare.ts:87`, `poem-join-wire.ts:39`, `poem-join.ts:160`, `same-words.ts:31`, `poem-source.ts:139-140`; `splitIntoPreLines`'s `cleanWord` not read. Builder tests `tests/build-poem-library.test.ts:183, 193, 384-387`.
- Step 6: `app.html:46-51` (not 46-49); 17 files name the Source/Noto families (`page-config.ts`, `insights/tessituragram-layout.ts`, `routes/notation-font-lab/+page.svelte`, `app.css:3, 13-14, 23-24`). QUEUE row 155's cites have moved (`ScoreUploader.svelte:449-452` → `372-373`; fonts `app.html:14-17` → `46-51`, `+page.svelte:3758-3760` → `3673-3675`).
- Step 7: other `Control+` presses: `poem-library.test.ts:178, 225, 239`, `glue-typed-marks.test.ts:46`; LEARN French title also pinned at `components/Reading/learn-opening.test.ts:18`.
- Step 9: `i18n.ts` holds 78 `upload.*` keys; QUEUE says 24 unread; five drop keys marked UNUSED at `i18n.ts:830-831` and `ScoreUploader.svelte:145-147`; a comment-aware count NOT ESTABLISHED. `restoreFrom` has a second call site, `+page.svelte:3252`. `station.startOver` and `loupe.undo.startOver` have no code readers.
- Step 8: no solfège-with-octave name in shipped strings; only the comment at `i18n.ts:2068` ("la3").
- Step 11: N.17's spec is not in the tree (`docs/memory/OWED.md:698` points to `claude/e38-handover_v1_2026-08-10.md` §10, a project file); three `100vh` remain: `routes/+layout.svelte:15`, `routes/+page.svelte:5396`, `:5401`.

## Rhyme brief: corrections
- Every citation matches at `ad90f5a6` except: `composer.ts` `features.word` at `:349-359` (was 347-357), `word: features?.word || ''` at `:358`; `composeBlurb` returns null for `velar-adjectival:и` at `:341-342` (chain: `deriveRule` → `processKey` `:297`; not in `processes`; not in `IDENTITY_ONLY_RULES` `:69-71`). Fable's `+page.svelte:443` → 444, `:1805` → 1806, `:2341-2344` → 2319-2322, `:4310` → 4287, `:4393` → 4347; `composer.ts:307-340` → 309-342; `InspectorPanel.svelte:1011-1022` → 1009-1020; `LearnContent.svelte:1723-1736` → 1724-1737; `i18n.ts:2477-2478` → 2516-2517. `+page.svelte` is 5515 of its 5534 ceiling.
- Further `processText` callers: `lib/syntactic-break.support.ts:32`; `tools/n168-frequency-run/frequency-run.run.ts:774`. Readers of the velar-hard set: `palatalization.ts:44-46, 73, 86, 146, 178`. Every `WordMarks` map: `word-marks.svelte.ts:38-63`, `library/word-mark-rows.ts:33, 38, 44, 48, 69, 125, 136, 148, 166`, `word-reset.ts:21, 31, 57`, `+page.svelte:1545-1546, 2246, 2252`.

## L17: the element
- `insights.r2.yourTessitura` is drawn at `lib/insights/PitchSeconds.svelte:125` as SVG `<text class="bracket-name">` (SVG text does not wrap) and at `:133` as an HTML legend `<li>`. `insights.r2.cycles.within` is filled at `singer-blocks.ts:292`.

## What the scout could not establish
The failing assertion at `pages-without-gaps.test.ts:227`; a comment-aware count of unread `upload.*` keys; N.17's spec; how `voiced.test.ts` seeds a voice; which element clips at 390 px; how `splitIntoPreLines` forms `cleanWord`.
