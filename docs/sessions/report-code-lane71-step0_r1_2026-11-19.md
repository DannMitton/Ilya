# Report, lane 71, step 0: the baseline and the citations

2026-11-19. Branch `cloud-lane-71`, cut from `Shane` at `6c0bb4fc` (`git checkout -b cloud-lane-71 6c0bb4fc`; `git merge-base --is-ancestor 6c0bb4fc origin/Shane`, exit 0). Working tree clean before this file (`git status -s` empty).

Read in full: `docs/sessions/brief-code-lane71-voice-type-stand-ins_r4_2026-11-19.md` (484 lines) and `docs/sessions/ratified-voice-type-stand-ins_2026-11-19.md` (section 8 first). `md5sum` of the ruling: `8d3f8a4fc3c93076f868b6be7abc1776`, which matches `8d3f8a4f`. The earlier revisions and the three reviews were not read.

**Verdict: no citation in brief section 2 or section 3 fails. Step 1 may proceed. Gate 4 disagrees with the expected figure, for a cause shown below; it is said here before Step 1, as asked.**

## 1. The brief's header names a different commit than the cut

Brief line 4 says "cut from `Shane` `b79e33e9`". The cut is `6c0bb4fc`. `git diff --stat b79e33e9 6c0bb4fc -- apps packages scripts` prints nothing, so no source line moved between the two. The seven files that did move are under `docs/` (`git diff --stat b79e33e9 6c0bb4fc -- docs/memory`: `QUEUE.md`, `SCHEDULE.md`, `STATE.md`, and others).

## 2. The eight gates, verbatim, on the untouched cut

Installed with `pnpm install --frozen-lockfile` (exit 0). Logs are in the session scratchpad, not committed. Commands, from the repo root:

| Gate | Command | Result, verbatim |
| --- | --- | --- |
| 1 phonology | `pnpm --filter @ilya/phonology test` | `Tests  462 passed (462)`, 14 files |
| 2 dictionary | `pnpm --filter @ilya/dictionary test` | `Tests  248 passed (248)`, 4 files |
| 3 web-check | `pnpm --filter @ilya/web check` | `svelte-check found 0 errors and 12 warnings in 5 files` |
| 4 web-test | `pnpm --filter @ilya/web test` | `Tests  6687 passed \| 5 skipped (6692)`, 362 files, 0 failed, `real 5m22.365s` |
| 5 score-parser | `pnpm --filter @ilya/score-parser test` | `Tests  904 passed \| 5 skipped (909)`, 43 files |
| 6 blurb | `pnpm --filter @ilya/blurb test` | `Tests  178 passed (178)`, 5 files |
| 7 integration | `pnpm run test:integration` | `Tests  159 passed (159)`, 7 files |
| 8 ratchets | `pnpm run ratchets` | `ratchets: OK.` (904 source files checked) |

**Which commands are "the eight gates" is my reading.** The brief and the task name eight gates and Gate 4 only. I took the list and order from `docs/sessions/brief-code-lane70-insights-wysiwyg_r2_2026-11-19.md:193-200` and the commands from `docs/sessions/report-code-lane70-step4_r1_2026-11-19.md`. The ship script is not in this sandbox.

**Gate 4 against the expected figure.** Expected: `6691 passed | 1 skipped (6692)`. Measured: `6687 passed | 5 skipped (6692)`. Both halves of the total agree (6692). The four extra skips are the four `it.skipIf(!havePython)` tests in `apps/web/src/lib/voice/engine/burg.test.ts` (`:30`, `:31`, `:59`, `:80`), and in this sandbox `python3 -c "import numpy"` succeeds while `python3 -c "import scipy"` prints `ModuleNotFoundError: No module named 'scipy'`. The fifth skip is `reader/heic-decode.test.ts:130` (`describe.skipIf(!REAL)`). I did not read how `havePython` is computed, so that scipy is the trigger is NOT ESTABLISHED. `docs/sessions/report-code-lane70-step4_r1_2026-11-19.md` records the same `6687 | 5` form on lane 70's tree, and the 6691 | 1 form as the ship script's other baseline on Dann's word. I move no baseline.

**Gate 3's twelve warnings**, by file (`pnpm --filter @ilya/web check --output machine`, counting `WARNING` lines): `InspectorPanel.svelte` 3, `IntakePanel.svelte` 5, `ReadingPaper.svelte` 1, `LearnContent.svelte` 2, `+page.svelte` 1. One more `WARNING` line prints for a file named `1241`, which I did not trace; the five-file total in the tool's own line is `in 5 files`.

**Gate 8's ratchet notices** (ceilings that could be lowered, printed under `ratchets: OK.`, none moved by me):
`Drawer.svelte` 1990 -> 1986; `InspectorPanel.svelte` 2432 -> 2396; `LearnContent.svelte` 4099 -> 4097; `pipeline.ts` 901 -> 896; `ScoreUploader.svelte` 867 -> 865; `pairings.ts` 1422 -> 1421; `CalibrationWizard.svelte` 1126 -> 1124; `routes/+page.svelte` 5534 -> 5532; `score-parser/src/musicxml-parser.ts` 1167 -> 1166. The files this lane will edit (`voice-pane.ts`, `stand-ins.ts`, `identity.ts`, `i18n.ts`, and the panes) are not on that list, so no ceiling of theirs has headroom at the baseline.

`e2e-phone/insights-links.test.ts:32` is Playwright and is not among the eight; it was not run.

## 3. Citations, brief sections 2, 3, 4, and 5

Every line below was read with `sed -n` on this tree (`6c0bb4fc`). "Holds" means the line says what the brief says it says. Paths without a directory are under `apps/web/src/lib/`.

**Section 2 and section 3 (the stop condition): all hold.**

| Brief's claim | What I read | Holds |
| --- | --- | --- |
| `voice/voiceTypes.ts:19-29` `TIER1`, nine ids | `:19-29`, the nine ids in the brief's order | yes |
| `stand-ins.ts:73` `PLACEHOLDER_PROFILE_TYPES`, five ids; comment `:64-72` | `:73` exactly; the comment `:64-72` says "left out on purpose ... until row 167 rules their staves" | yes |
| `standInBucket` `:55-62`; contralto and countertenor `:58`; bass-baritone `:60`; `middle` `:61` | `:55` the function, `:58` tenor-mezzo list, `:60` bass list, `:61` `return 'middle'` | yes |
| `template` `:89-98`; `:144` uses `template('middle')`; `:147` bucket; `:153`, `:158` write `fR1`, `fR2` | `:89`, `:144`, `:147`, `:153`, `:158` as stated | yes |
| `resolve-values.ts:154` `generic = !anySung && hasPlaceholderProfile(voiceType)`; `:156` fills | exact | yes |
| `analyze-score-adapter.ts:93` `formants: Object.keys(s.fR1).length > 0` | exact | yes |
| `voiceTypes.ts:82-97` `voiceTypePrint`; `:86-89` Other before `:90` not-sure test | `:82`, `:86-89`, `:90` | yes |
| `voiceTypes.ts:109-110` replace literals; `:104-106` purpose | the helper is `:108-111`; the two `replace` calls are `:109`, `:110`; the comment `:103-107` | yes |
| `voiceTypes.ts:38` holds haute-contre | `:38` is the `countertenor:` list with `'haute-contre'` | yes |
| `voiceTypes.test.ts:112`, `insights/identity.test.ts:36` pin Other under not-sure | `:112` and `:36` both build `voiceType: 'not-sure'` with Other text | yes |
| Stale comments: `resolve-values.ts:14-18`, `:148-152`; `analyze-score-adapter.ts:66-71`; `insights/identity.ts:55`, `:63-64`; `insights/singer-blocks.ts:116`; `components/Drawer/voice-pane.ts:77-79`; `i18n.ts:1894`, `:1903`; `stand-ins.ts:64-72`; `voice/chart/screen-logic.ts:29`; `voice/chart/zones.ts:21-23` | each is the comment the brief describes ("the five that have a placeholder profile", "one of five types", "says 'your voice type'", the withheld list, and so on) | yes, all |
| `voice-pane.ts:65-66` calls `voiceTypePrint` on the Tier 1 id | `:66` `fillVoiceType(text, voiceTypePrint({ voiceType: i.voiceType }, language) ?? '', language)` (the comment is `:65`) | yes |
| `screen-logic.ts:30` `hasDeclaredType` | exact | yes |

**Section 4: all hold.**

| Brief's claim | What I read | Holds |
| --- | --- | --- |
| 4.1 `markup/subtitle.ts:10-13`, `:11`; `i18n.ts:1487`; `MarkupPane.svelte:552` | exact | yes |
| 4.2 `identity.ts:50-53`, `:52`, `:56-58`; `i18n.ts:1895`; `InsightsPane.svelte:503` | exact | yes |
| 4.3 `singer-blocks.ts:337`; `InsightsPane.svelte:373`; `i18n.ts:2040` | exact | yes |
| 4.4 `identity.ts:66-70`; `InsightsPane.svelte:292`; `i18n.ts:1897`, `:1898`, `:1905`, `:1906`; `stand-ins-snapshot.test.ts:72` `'other-text'` | exact | yes |
| 4.5 `analyze-score-adapter.ts:188-196`, `:195`; `MarkupPane.svelte:846`; `i18n.ts:1075` | exact | yes |
| 4.6 `voice-pane.ts:35-44`, `:33`, `:43`, `:49`, `:64`, `:48`, `:50`, `:81-83`, `:77-79`; `i18n.ts:1432`, `:1433`, `:1434`, `:1437` (the "UNUSED SINCE LANE 68" convention); `VoicePane.svelte:85` renders `VoiceTypeIntake` | exact | yes |
| 4.7 `InsightsPane.svelte:189`; `placeholder-line.ts:27`, `:73-75`, `:76`; `MarkupPane.svelte:736`; `voice/engine/sung.ts:41` `isPersonal` | exact (`sung.ts:41` is `isPersonal`, `:40` is `PERSONAL_CORE_MIN = 5`) | yes |
| 4.7 `InsightsPane.svelte:294` `methodGeneric`; `identity.ts:67` `noScore.samples` | exact | yes |
| 4.8 `MarkupPane.svelte:865`, `:866`, `:873`; `legend.ts:105-108`; `gates.ts:302`, `:323`; `placeholder-line.ts:81-82`; `i18n.ts:2075` | exact | yes |
| 4.9 `GuideContent.svelte:395` English and `:91` French; `:21`, `:25` heading ids; "`guide-anchors.ts` has 18 lines and holds renamed anchors only" | `:395` and `:91` are the MELODY notation paragraphs; `:21` `id="guide-how"`, `:25` `id="guide-what"`; the file is `apps/web/src/lib/guide-anchors.ts` (not under `components/`), 18 lines (`wc -l`), a `RENAMED` map of three entries | yes (the brief gives no directory) |
| 4.10 `VowelSpaceSheet.svelte:163`; `i18n.ts:2569`, `:2619`; `screen-logic.ts:63`; `VowelCapture.svelte:220`; `ratified-strings.test.ts:29`, `:70` | the sheet is `voice/chart/VowelSpaceSheet.svelte:163` (the brief gives no directory); `VowelCapture.svelte:220` is `voice/`; the rest exact | yes |
| 4.10 "`:58` and `:60` send the three to a neighbour's staff" | `stand-ins.ts:58` (contralto, countertenor to `tenor-mezzo`), `:60` (bass-baritone to `bass`) | yes |

**Section 5 table: all hold.** `identity.ts:42` `restsOnSamples`; `singer-blocks.ts:254`; `InsightsPane.svelte:204` (`measured = adapted.completeness.formants`); `MarkupPane.svelte:831` (`showWithheld = !adapted.completeness.formants`); every other row is a line already read above.

**Section 9, items 1 to 3, read for later.** `screen-logic.ts:58-64` as stated. `plausibility.ts:135-142` `bucketFor` returns `union` for countertenor (`:142`; comment `:133-134` says "countertenor and not-sure stay union"). `plausibility.ts:211` `bands = voiceTypeBucket === 'union' ? UNION_BANDS : CORE_BANDS[...]`. `chart/zones.ts:96` is `windowFor(...)`, the call that reads it (the brief says "read by `zones.ts:96`"). `plausibility.ts:50` `CORE_BANDS`.

**`adapter-grid.ts:35`** (section 7): `TYPES` is `[undefined, '', 'soprano', 'mezzo-soprano', 'mezzo', 'contralto', 'tenor', 'countertenor', 'baritone', 'bass', 'bass-baritone', 'not-sure']`, twelve entries. Rows that should move: `contralto`, `countertenor`, `bass-baritone`.

## 4. Citations that do not say what the cited document says they say

1. **Brief section 8 and the task: `STATE.md:19`.** Line 19 is the afternoon desk's close and says "NOTHING SHIPPED THIS DESK: ... no gate ran". The `6691 passed | 1 skipped (6692)` figure is in the morning close, `docs/memory/STATE.md:21`. (`grep -n 6692 docs/memory/STATE.md` returns lines 21 and 25.) Outside sections 2 to 5, and it changes nothing.
2. **The ruling, section 1, cites "COUNTERTENOR BY THE TRACT: DESK INFERENCE" at `stand-ins.ts:55`.** In this tree the phrase is in the comment at `stand-ins.ts:52`; `:55` is `export function standInBucket`. Not in the brief.
3. **The brief header's `b79e33e9`** against the cut `6c0bb4fc`, section 1 above.

## 5. What this step changed

Nothing under `apps/`, `packages/`, or `docs/memory/`. This report is the only file added. No baseline was moved.

## NOT ESTABLISHED

1. That scipy, and not numpy alone or something else, is what turns the four `burg.test.ts` tests off here. I read the `skipIf` calls and the two import checks, not `havePython`.
2. The contents of `~/Downloads/ilya-ship.sh`, which is not in this sandbox. Which gate commands it runs, and its gate 4 baseline strings, are not read; the command list above is lane 70's.
3. What the thirteenth `WARNING` line (a file named `1241`) in the machine-format check output is.
4. Whether the 6687 | 5 form and the 6691 | 1 form differ only by the four `burg.test.ts` skips. The counts and the four skips agree, but I did not run the suite with scipy present.
5. That the three Fable reviews, the two earlier revisions, and `draft-lane71-strings-for-dann` say nothing that changes this report; they were not read, as instructed.
6. Section 7's test-file citations (`ratified-lines.test.ts`, `voice-pane.test.ts`, the e2e files, and the rest). Outside the sections Step 0 was asked to check; Step 7 reads them.
