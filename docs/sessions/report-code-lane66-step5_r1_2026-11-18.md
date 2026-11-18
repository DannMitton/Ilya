# Report: lane 66, Step 5 (every sung reading counts, as a kept reading counts today)

2026-11-18, Code (cloud session). Branch `cloud-lane-66`. One commit, which a revert removes whole. The step comes after the measure (`n200-lane66-step4-measure_2026-11-17.md`), which the desk has yet to read; nothing merges before that.

**Done when, shown:** for a reading judged outside and not kept, the adapter's snapshot, the resolution, the chart's zones and dots, the finish-early state, and the pane's count equal what the same reading kept gives, over the adapter golden's grid and under every voice type (`analysis/every-sung-reading-counts.test.ts`). The only things that still tell the two apart are the summary's note and the "Beyond Ilya's reference values" mark.

## The one predicate

`voice/engine/sung.ts`: `isSung(f)`, a number above zero that is not an estimate (`reading !== 'estimated'`, `typeof f1 === 'number'`, `f1 > 0`). It replaces four tests: `profileStore.ts` (no f1 test, no estimate test), `resolve-values.ts` (f1 > 0, no estimate test), `chart/zones.ts` (its own local `isSung`, now this one), `insights/InsightsPane.svelte` (f1 > 0), and a fifth form at `chart/finish-early.ts` (`remaining`). `analyze.ts` can write `f1: 0` for a take whose first resonance it could not place (Step 0: the line is `:177`); the predicate treats that as not sung, where `usableReadingCount` counted it before. A stored estimate does not exist in a stored profile, so that part changes nothing a singer sees.

## What each site of the census became

| Site | Before | Now |
|---|---|---|
| `plausibility.ts`, `isUsable` | false for an `implausible` reading not kept | **removed** |
| `derivations.ts`, `usableAnchor` (inline test) | the same test, inline | `isSung(f)` and a positive f2; the doc comment rewritten |
| `resolve-values.ts`, fR1 loop and fR2 loop | entered only when `isUsable` | enter when `isSung` (fR2 keeps its own `f2Quality !== 'absent'`); the §B.4 comment replaced by the 2026-11-13 ruling |
| `resolve-values.ts`, the `implausible` list and its call | listed the excluded vowels, passed to `fillStandIns` | **removed** (the field of `ResolvedValues`, the filter, the argument) |
| `stand-ins.ts`, `fillStandIns` third parameter and the `'implausible'` retake reason | one `retake` entry per excluded vowel | **removed**; `retake` holds only the fit's own `'off-shape'` entries |
| `InsightsPane.svelte:245`, `measuredVowels` | `f1 > 0 && isUsable(f)` | `isSung(f)`; `comment-text.ts`'s `leadSuggestion` reads that set, so "your own measured value" now includes such a reading |
| `profileStore.ts`, `usableReadingCount` | counted readings `isUsable` | counts `isSung`; the name is kept (`voice-pane-usable.test.ts` pins it in `+page.svelte`) |
| `voice/outside.ts`, `outsideVowels` | the stored verdict, not kept | unchanged; its header now says the note is the only reader of the verdict |
| `CalibrationWizard.svelte:329` | `outsideVowels(profile, ALL_VOWELS)` | `outsideVowels(judgeUnchecked(profile), ALL_VOWELS)` and one import line: a reading stored with no verdict is named too |
| `chart/zones.ts:93`, `chart/finish-early.ts:35-37` | read the resolution | follow rows 3 to 5; `finish-early.ts` `remaining` and zones' local test use `isSung` |
| `components/Drawer/voice-pane.ts:28-34`, `:48`, `+page.svelte:1761`, `:4185-4186`, `:4365` | read `usableReadingCount` | unchanged code; they follow it |
| `readings.ts:132` (`beyond` mark) | `plausibilityOverride` only | unchanged |

`checkPlausibility`, `outsideVowels`, `keepOutside`, `keepReading`, `judgeUnchecked`, `fitWithoutOutliers`, `withPlausibility`, and `withIghPass` are unchanged in code. `keepReading`'s comment says Keep changes no number.

## Comments corrected in this commit

`resolve-values.ts` (the file header, the §B.4 block, the fR2 and derivation comments), `derivations.ts` (the `usableAnchor` doc), `plausibility.ts` (`keepReading`), `stand-ins.ts` (the `retake` type), `profileStore.ts` (`hasAnyReadings`, `usableReadingCount`), `outside.ts`, `voice-pane.ts` (the header), `bandState.ts`, `markup/MarkupPane.svelte:562`, `analysis/analyze-score-adapter.ts:111`, `+page.svelte:1628`, `InsightsPane.svelte` (the measured-vowels comment), and the header of `analysis/adapter-golden.test.ts` is unchanged in words.

## Files

Wizard 1122 lines (ceiling 1126), `InsightsPane.svelte` 742 (744), `+page.svelte` 5531 (5534): all three within their ceilings, none raised.

## Tests

Moved to the kept-case expectation, each to what its file already held for a kept reading: `analysis/analyze-score-adapter.test.ts` (the three the brief names, and two it did not: the "judges a reading the guard never judged" test and the "derives no [ɨ] or [ɪ] from an unjudged [i]" test, found by running); `analysis/stand-ins-snapshot.test.ts` (both); `voice/chart/finish-early.test.ts` (both; the kept test's title now covers both); `components/Drawer/voice-pane.test.ts`, `voice-pane-usable.test.ts`, `voice/profileStore.test.ts`, `voice/engine/plausibility.test.ts`. Each now also compares against the kept twin where it can.

New: `analysis/every-sung-reading-counts.test.ts` (11 tests): the Done-when sentence over the grid; the resolution, zones, finish-early, and count agreeing; no `isUsable` and no `'implausible'` reason in any source file; the note naming a reading stored with no verdict; Keep quieting it without changing a number; the mark following the override alone; the judged copy written nowhere. `analysis/adapter-grid.ts` holds the grid (the sets and types) that `adapter-golden.test.ts` used to hold inline, so the new test reads the same grid; the golden test imports it. `tools/n200-score/lane66-core.test.ts` gains the grid's two counts as they stand after the step.

Run: svelte-check 0 errors, 12 warnings. Gate 4 whole at the end of this step: 358 files, **6613 passed | 1 skipped (6614)** (baseline 6590; 24 more: Step 2 +5, Step 3 +4, Step 5 +15). Ratchets: OK.

## The adapter golden (the tripwire)

Regenerated in this commit (`UPDATE_ADAPTER_GOLDEN=1`). Compared before and after by key: 144 entries in both; **12 differ, and all 12 are "bad i (1063), no override"** (one per voice type, the twelve types of the grid). No other entry moved. Each equals what the same voice gives with that [i] kept: the new test checks it under every type. The tripwire did not fire. The grid has no "kept twin" entry for that set of readings (the golden's "bad i kept, six" is a different set); the test builds the twin.

## The Step 4 runner again

Run on the same golden: **judged outside is unchanged** (72 in all; 2 under the own type, 60 cross-type cases; the same groups); **set aside is zero** in every group (72 before); of the 198 cross-type cuts and the 45 bass cuts, every value equals its kept twin (0 of 243 before) and nothing moves when the reading counts. Today's value for the outside vowel is sung in 60 of 60 cases (a stand-in in 60 of 60 before). The tables are in the runner's output; `lane66-core.test.ts` pins them (72, 0, 198, 45).

## A pointer for the desk, from Step 4

With three or six sung vowels the fit sets an odd [i] aside for the six Bozeman vowels, and a derived [ɨ] still follows it (1451 Hz from [i] at 1063 Hz). That is the lane's rule as written (`stand-ins.ts:214-232` builds a derived stand-in from the anchors that stand); nothing here changes it.

## Not established

- Whether any seeded e2e store gains a summary note now that the note reads the judged copy: the Playwright suites at the end of the lane say.
