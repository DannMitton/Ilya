# Report: lane 66, Step 0 (read and report; nothing changed)

2026-11-18, Code (cloud session). Brief: `brief-code-lane66-follow-ups_r3_2026-11-17.md`. Branch `cloud-lane-66`, cut from `Shane` at `ab67b836` (the brief's commit; `origin/Shane` fetched, the clone was not behind). Working tree clean when read. A fresh clone with `pnpm install --frozen-lockfile`; Python 3.13 with numpy 2.5.3 and scipy 1.18.1.

## The eight gates on the untouched tip

The list of eight is the one in `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117`.

| Gate | Command | Baseline | Result |
|---|---|---|---|
| 1 phonology | `pnpm test:phonology` | 462 passed (462) | 462 passed (462) |
| 2 dictionary | `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) |
| 3 web-check | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files |
| 4 web-test | `pnpm --filter @ilya/web test` | 6589 passed, 1 skipped (6590) with Python, numpy, scipy | 6589 passed, 1 skipped (6590), 357 files |
| 5 score-parser | `pnpm --filter @ilya/score-parser test` | 904 passed, 5 skipped (909) | 904 passed, 5 skipped (909) |
| 6 blurb | `pnpm test:blurb` | 178 passed (178) | 178 passed (178) |
| 7 integration | `pnpm test:integration` | 159 passed (159) | 159 passed (159) |
| 8 ratchets | `pnpm ratchets` | OK | ratchets: OK |

All eight at baseline. Gate 4 ran with Python, numpy, and scipy present.

## Line counts against `scripts/ratchets.json`

| File | Lines | Ceiling |
|---|---|---|
| `voice/CalibrationWizard.svelte` | 1120 | 1126 |
| `insights/InsightsPane.svelte` | 742 | 744 |
| `apps/web/src/routes/+page.svelte` | 5530 | 5534 |

These agree with the brief. No other file I will touch has a ceiling. Others: `voice/engine/capture-file.ts` 267, `components/Drawer/sections.svelte.ts` 532, `components/Drawer/VoicePane.svelte` 181, `voice/profileStore.ts` 341, `voice/engine/resolve-values.ts` 215, `voice/engine/stand-ins.ts` 238, `voice/engine/plausibility.ts` 329, `voice/engine/derivations.ts` 109.

## Cited lines, re-read on this tip

Every cited line was read. They agree with the brief except these, each off by a line or two, none changing a step:

- `voice/engine/analyze.ts:176` is the `confidence, reading, source` line; the `f1: ex.f1 ?? 0` that can write `f1: 0` is the line beside it (`:177`).
- `components/Drawer/sections.test.ts:84` is blank; the pinned list is `:85-86`.
- `tools/n200-score/vitest.config.ts:43` is the `golden.run.ts` entry; the `N200_DIR` entry is `:42`.
- `voice/engine/capture-file.ts:198` and `:223` carry the default `'shipped'`, and `capture-file.test.ts:173` pins `picker: Picker = 'shipped'`. Step 2 changes the default to `'path'` in all three, as the brief says.
- `capture-file.test.ts:135-139` pins `vercel.json`'s build command with `^if [ "$VERCEL_GIT_COMMIT_REF" = "cloud-lane-\d+" ]( || [ ... = "cloud-lane-\d+" ])*; then export PUBLIC_RECORDER=1; fi; pnpm --filter @ilya/web build$`. That accepts one branch or several; the review's "one branch" reading is too narrow. Step 6 confirms with the real file.
- Beyond the brief: the wizard's `plausibility-keeps-status.test.ts:13` finds `function withPlausibility(` and cuts by brace counting, as the brief says (`:13-22`).

Two of the brief's expectations are already true on this tip, and I note them so Step 1 does not look for them: `voice/CalibrationWizard.svelte:284-285` (the comment above `withPlausibility`) already says the status never changes; the old "demotion" wording survives in the other sites Step 1 lists.

## The census for Step 5

"Reads" below means the code reads the verdict (`plausibility === 'implausible'`, with or without `plausibilityOverride`), directly or through a helper. Where the same helper is read by many sites, the helper is listed once with its readers.

| # | Reader | What it decides | What a singer reads from it |
|---|---|---|---|
| 1 | `voice/engine/plausibility.ts:317-319`, `isUsable` | whether a stored reading may be used: false for `implausible` not kept | nothing itself; its readers below |
| 2 | `voice/engine/derivations.ts:86`, inline in `usableAnchor` (`:77`) | whether a reading may anchor a derived vowel ([ɪ], [ɨ], [ʌ], [a]); read by `deriveFrom` (`:105`), which `resolveVowelValues` calls (`resolve-values.ts:185`) | the derived value of those four vowels, in MELODY, INSIGHTS, the chart's dots, the pane's sentence ("works out") |
| 3 | `voice/engine/resolve-values.ts:132`, `:148` | whether fR1 and fR2 enter the snapshot as `'sung'` | every number MELODY and INSIGHTS use for that vowel; its source label (`fR1Source`, `fR2Source`) |
| 4 | `voice/engine/resolve-values.ts:206-212` | the `implausible` list, handed to `fillStandIns` | nothing directly. The list only feeds `StandInReport.retake` |
| 5 | `voice/engine/stand-ins.ts:233-236` | the `retake` list: `'implausible'` entries then `'off-shape'` entries | nothing. See "retake" below |
| 6 | `insights/InsightsPane.svelte:245` | `measuredVowels`, the set INSIGHTS calls measured (`f1 > 0 && isUsable(f)`); `leadSuggestion` (`insights/comment-text.ts:122-123`) reads that set to choose which suggestion leads | which suggestion leads a finding ("your own measured value") |
| 7 | `voice/profileStore.ts:196-197`, `usableReadingCount` | how many readings the app may use | the pane's sentence and its door (`+page.svelte:4185`, `:4365`), the state line (`+page.svelte:1761`), the drawer anchor's "calibrated" (`components/Drawer/bandState.ts:231`) |
| 8 | `voice/outside.ts:22`, `outsideVowels`, read at `voice/CalibrationWizard.svelte:329` | the summary's note: the stored verdict, not kept | the "Beyond Ilya's reference values" note, with Keep or sing again |
| 9 | `voice/chart/readings.ts:132` | the roster's `beyond` mark: `plausibilityOverride` only | the "Beyond Ilya's reference values" mark. Does not read the verdict. Unchanged by Step 5 |
| 10 | `voice/chart/zones.ts:93`, `now = resolveVowelValues(...)` | the chart's placeholder dots (`src === 'derived'` or surrogate) for vowels with no stored reading (`isSung`, `:82`) | the chart's grey dots. It reads the resolution, so rows 3 to 5 reach it; its own `isSung` already means "a positive fR1 that is not an estimate" |
| 11 | `voice/chart/finish-early.ts:35-37`, `:67` | `kind` (work-out or use-recorded) from `fR1Source` and `remaining`, and `anyUsable: r.anySung` | the finish-early link and its caption. `remaining` already counts a stored reading, usable or not; `anySung` and `standIn` come from the resolution, so rows 3 to 5 reach them |
| 12 | `components/Drawer/voice-pane.ts:28-34`, `:48` | `paneState` and `paneSentence` from `usable` (row 7) | the pane's one sentence ("N of ten recorded...") |
| 13 | `routes/+page.svelte:1761` | `scoreStateLine(voiceName, usableReadingCount(...), ...)` | the Voice band's state line |
| 14 | `routes/+page.svelte:4185-4186` | passes `usable=usableReadingCount(...)` and `restWorkedOut=finishEarlyState(...)` to the pane | the pane's sentence and which state it is in |
| 15 | `routes/+page.svelte:4365` | `recordDoorKey(usableReadingCount(...))`: which word the Record door carries | the Record door's name |
| 16 | `analysis/analyze-score-adapter.ts:132`, `resolveVowelValues` | the snapshot MELODY and INSIGHTS read | everything they print about the voice; MELODY's `analysedVowels` (`markup/MarkupPane.svelte:562-566`) reads `snapshot.fR1`, so it follows row 3 |
| 17 | `voice/engine/resolve-values.ts:48-62`, `judgeUnchecked` | judges a reading stored with no verdict, as a union-band judge with anchors that are plausible or kept; read by row 3 through `formants` (`:103`) | nothing itself |

Not readers of the verdict, and unchanged: `voice/chart/zones.ts:83` and `voice/chart/finish-early.ts:34` use their own test of "sung" (a positive fR1, not an estimate); Step 5's one predicate makes these one test.

**`StandInReport.retake`: no reader outside tests, confirmed.** `grep -rn "retake" apps/web/src` outside `i18n.ts` finds `stand-ins.ts` (the type and the list), `screen-logic.ts` and `OutsideNote.svelte` (both the unrelated Re-take button), and tests only: `analysis/stand-ins-snapshot.test.ts:19`, `:29`, `:66`, `:103`. The same holds for `ResolvedValues.implausible`: no reader but tests (`analysis/stand-ins-snapshot.test.ts:19`, `:103`, and `voice/engine/plausibility.test.ts`'s `isUsable` cases).

The brief names three tests of "sung" at three sites; I found the same three, and a fourth form at the INSIGHTS site: `voice/profileStore.ts:197` (no f1 test, no estimate test), `voice/engine/resolve-values.ts:132` (`f1 > 0`, no estimate test), `voice/chart/zones.ts:82` (`f1 > 0` and not an estimate), and `insights/InsightsPane.svelte:245` (`f1 > 0`). Step 5's one predicate is `reading !== 'estimated'` and `typeof f1 === 'number'` and `f1 > 0`.

## What `tools/n200-score/__golden__/` holds

- `path-600.json` (105 KB): `{ takes: 600, rows: [...] }`. Each row is `{ idx, k, type, vowel, path: { outcome, f1, f2, confidence, reading, f2Quality, picker } }`: the path picker's reading on the primary set's 600 takes (`cells(PRIMARY)`, seeds 5000 and 7000). 582 rows are readings (566 Captured, 16 Provisional), 18 are `reprompt`. Six readings have no fR2 (`f2` null or absent). No truth and no verdict in the file.
- `shipped-open-600.json` (183 KB): the shipped and open pickers on the same takes. Not used by this lane.
- A take is a cell (`idx`: five types by ten vowels) and a rank `k` (0 to 11); no take belongs to a singer. The truths are `cells(PRIMARY)[idx].truth`, in Hz, lowest first, and are Ilya's own stand-in values per bucket (`tools/n200-score/fidelity-set.ts:12-14`, `:48-57`): the guard's own band centres, so a reading judged outside under its own type is a picker error and nothing else. Lane 64 counted 0 of 566 and 0 of 588 such readings (`docs/sessions/n200-lane64-step5-counts_2026-11-17.md:31`, `:75`). The set has four distinct buckets (tenor and mezzo-soprano share one), and no contralto, countertenor, or bass-baritone cells.
- How lane 64 built a profile from the sets (`tools/n200-score/step5-core.ts`, `divergenceTable`): the [i], [ɨ], and [u] takes of one voice type with the same `k` (12 per type), each as its default reading. Step 4 uses the same idea for a profile: the takes of one type with the same `k`, all ten vowels where the take read.

## What Step 4 needs from this

- `path-600.json` has no `v` (variants) and no verdict, so the runner judges each reading itself with `checkPlausibility(f1, vowel, type, anchorF1sFor(profile))`, as `CalibrationWizard.svelte:292` does.
- A profile with 10 vowels in a profile of one type and one `k`: 5 types by 12 `k` = 60 profiles. A profile misses a vowel when its take was a `reprompt`.

## Not established in Step 0

- Whether any seeded e2e store gains a summary note once the note reads the judged copy. Established at the end of Step 5, by the Playwright suites.
- Whether the adapter golden holds a kept twin for each "bad i (1063), no override" entry. The golden's `bad i kept, six` is a different set (the [i] with five other vowels, not [u] and [ɑ]). So the golden holds no twin. Step 5's new test builds the twin.
