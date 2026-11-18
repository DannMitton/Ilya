# Report: lane 67, Step 0 (baseline gates, census, and the list of what changes at the threshold)

2026-11-18, Code (cloud session). Branch `cloud-lane-67`, cut from `Shane` at `2b3bde8e` (the commit whose message begins "Lane 67 brief r2"); the clone's `Shane` was at `ab67b836`, so I fetched first. Working tree clean at the cut. No pull request; nothing pushed to `Shane` or `main`; nothing under `docs/memory/` changed; no brief edited. Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `packages/`, `docs/`, or `tools/`. Every line cited below I read on this tip in this session.

## The eight gates, on the untouched tip

| Gate | Baseline (the prompt) | Result |
|---|---|---|
| 1 phonology | 462 passed (462) | 462 passed (462) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web-check | found 0 errors and 12 warnings in 5 files | `COMPLETED 1237 FILES 0 ERRORS 12 WARNINGS 5 FILES_WITH_PROBLEMS` |
| 4 web-test | 6613 passed, 1 skipped (6614) with Python, numpy, scipy; 6609 passed, 5 skipped (6614) without | **6609 passed, 5 skipped (6614)**, 358 files. This container has Python 3 and no scipy (`import scipy` fails), so it is the "without" figure. |
| 5 score-parser | 904 passed, 5 skipped (909) | 904 passed, 5 skipped (909) |
| 6 blurb | 178 passed (178) | 178 passed (178) |
| 7 integration (root) | 159 passed (159) | 159 passed (159) |
| 8 ratchets | OK | `ratchets: OK.` |

All eight match baseline. The gate order above is my reading of the baseline's order (it matches the package that gave each count); the ship script's own numbering is NOT ESTABLISHED here.

## The census (list 2)

Each reader, with file:line and what it decides for the singer. "Tests" excluded. `i18n.ts` readers are named in the strings steps.

**`anySung`** (a sung fR1 exists)
- Defined `voice/engine/resolve-values.ts:88`, set `:197`. Decides whether stand-ins fill from the fit (a sung voice) or from the whole template (`generic`), `:198-200`.
- `voice/chart/finish-early.ts:38` (`anyUsable`): whether the capture screen's "Use what I've recorded" caption prints (`finish-early.ts:68`).
- No other reader found outside tests (grep over `lib` and `routes`).

**`generic`** (`ResolvedValues.generic`, `AdaptedProfile.generic`)
- Set `resolve-values.ts:198`; carried by `analysis/analyze-score-adapter.ts:133,175`.
- `markup/MarkupPane.svelte:551` (`profileSubtitle`, `markup/subtitle.ts:10`): MELODY's subtitle names the type instead of "a map of <voice>'s resonances". `:849` (`composeBroadNote`, `analyze-score-adapter.ts:199`): the broad note's ratified generic wording. `:869`, `:876`: the legend's filled head, and the gated lines (`analysis/gates.ts:302-323`, `placeholder-line.ts:54-55`): the placeholder sentence without its remedy.
- `insights/InsightsPane.svelte:292` (`methodLineKey`, `insights/identity.ts:66-69`): which Method line prints. `:294` (L4 follows). `:373` (`generic`, `voiceTypeLabel`): `insights/singer-blocks.ts:254,337`, the placeholder sentence and "against {voice type}". `:515` (`genericLede`, `identity.ts:50-52`): the lede "values for a {type} voice".
- `insights/identity.ts:42` (`restsOnSamples`): whether the identity line says the page rests on the singer's samples.

**`standIns`** (`StandInReport`)
- Built `resolve-values.ts:199-200`; carried `analyze-score-adapter.ts:68,133,173`. **No singer-facing reader.** The adapter's comment (`:64-67`) says "nothing draws it yet", and a grep over `lib` and `routes` finds no component reading `standIns`.

**`retake`** (the stand-in report's, `stand-ins.ts:233,237`)
- **No reader outside `stand-ins.ts` and tests.** It decides nothing for the singer today. (The summary's note comes from `outside.ts`, not from it.)

**`fitWithoutOutliers`** (`stand-ins.ts:151`): called `:200-201` only. **`fitResonance`** (`:125`): called `:158` only. **`OFF_SHAPE_SEMITONES`** (`:51`): read `:165` only. All three decide which sung vowels shape the stand-ins for the vowels not sung. Singer-visible: the values MELODY, INSIGHTS, and the chart's hollow dots show for unsung vowels.

**`outsideVowels`** (`voice/outside.ts:22`): called `voice/CalibrationWizard.svelte:331`. Decides which readings the summary's one note names: `plausibility === 'implausible'`, not kept, not an estimate.
**`outsideNote`** (`outside.ts:37`): called `voice/OutsideNote.svelte:29`. Picks `calib.summary.outside` (with the type) or `outsideNoType`.

**`judgeUnchecked`** (`resolve-values.ts:49`)
- Called `resolve-values.ts:102`; re-exported `analysis/analyze-score-adapter.ts:42`; imported `voice/CalibrationWizard.svelte:61`, called `:331`.
- Decides: gives a stored reading with no verdict one, for the summary's note. After lane 66 nothing else reads the verdict of the judged copy (the comment at `resolve-values.ts:111-118`); `ResolvedValues.formants` (`:81`) carries the judged copy but I found no reader of `.formants` among the singer-facing sites. Step 5 removes it if nothing reads the verdict.

**`plausibility`** (the verdict field): written by the wizard (`withPlausibility`, `CalibrationWizard.svelte:292-302`), read by `outside.ts:28`, `resolve-values.ts:52,60`, `analysis/adapter-grid.ts:30`. For the singer: only the summary's note and the "Beyond" mark.

**`plausibilityOverride`** (Keep): written `voice/engine/plausibility.ts:325`; read `outside.ts:28` (quiets the note), `voice/chart/readings.ts:132` (the mark, `beyond`), `resolve-values.ts:43,52,60`. For the singer: the note stops, and the roster row shows `calib.roster.kept` (`voice/chart/VowelSpaceSheet.svelte:124`).

**`usableReadingCount`** (`voice/profileStore.ts:196`, all sung readings): `routes/+page.svelte:1761` (the closed Voice band's "n of 10", through `components/Drawer/bandState.ts:246-249`), `:4186` (the VOICE pane's sentence), `:4366` (the Record door's name, `recordDoorKey`).

**`hasAnyReadings`** (`profileStore.ts:185`, any stored key): wizard `:312,325,427,443,464,676,875` (which phase opens: summary or Welcome); `routes/+page.svelte:4187` (`hasStoredReading`: whether "Your vowel space" shows, `voice-pane.ts:75`); `voice/seam.ts:62` (comment).

**`restsOnSamples`** (`insights/identity.ts:41`): `insights/InsightsPane.svelte:280,292`. Decides the identity line "measured" and the Method line's `samples` branch.

**`paneState`** (`components/Drawer/voice-pane.ts:28`): called `:46` (`paneSentence`). Decides which of seven sentences the VOICE pane prints, from `usable`, the type, and `restWorkedOut`.

**`finishEarlyState`** (`voice/chart/finish-early.ts:34`): `voice/VowelCapture.svelte:281` (whether the quiet "Use what I've recorded" / "Work out the rest" link shows, and its caption); `routes/+page.svelte:4187` (`restWorkedOut` for the pane's sentence).

**`applyIghDivergence`** (`voice/engine/divergence.ts:17`): `voice/CalibrationWizard.svelte:271` (`withIghPass`, on a clone; `:272` strips `isDivergent`). **`isDivergent`**: set `divergence.ts:21,24`; read nowhere else outside tests (the wizard strips it). So no singer-facing reader today.

**`calib.summary.outside*`**: `voice/outside.ts:39-40` only.

## What the lane's changes must reach: the sung-readers outside `resolveVowelValues` (list for Step 2)

Three sites read the stored readings and bypass the resolver (brief r2, Step 2.3; each confirmed on this tip):
1. `insights/InsightsPane.svelte:242-246`, `measuredVowels` by `isSung`.
2. `markup/MarkupPane.svelte:449`, `hasReadings`, read at `:1096` (`{#if hasReadings}`).
3. `voice/chart/finish-early.ts:36-38`, read at `voice/VowelCapture.svelte:281`.

And `voice/chart/zones.ts:121,134` and `voice/chart/model.ts:27` (the chart's own dots) read stored readings. The brief says these stay.

## Every place a singer sees a different thing for 1 to 4 core vowels sung than for none sung (list 3, today)

Today, one sung vowel turns `anySung` true, so the resolver (`resolve-values.ts:197-200`) stops being `generic` and fits the stand-ins to the singer. For each surface:

| Surface | Reads | Differs today for 1 to 4 core sung |
|---|---|---|
| MELODY, the page with a score | `adaptProfile` → `resolveVowelValues` (`analyze-score-adapter.ts:133`) | Values come from the fit to the sung vowels, not the type's template; subtitle, broad note, legend, gated lines drop their generic wording (`MarkupPane.svelte:551,849,869,876`). |
| MELODY, the page with no score | `hasReadings` (`MarkupPane.svelte:449,1096`) | `profile.lede` ("Your profile is now set") instead of `profile.emptyState`. |
| INSIGHTS | the adapter, `restsOnSamples` (`identity.ts:41`), `measuredVowels` (`InsightsPane.svelte:242`) | Method line `samples`, identity line "measured", "your own measured value" wording (`comment-text.ts:123`), no generic lede. For a type with no generic values (contralto, countertenor, bass-baritone, "Not sure", none): numbers instead of `insights.silence.unmeasured`. |
| The VOICE pane's sentence | `paneState` (`voice-pane.ts:28-35`) | `some-fills` or `some-works-out` ("Ilya fills the other {m} from what you have recorded") instead of `typed-generic` / `typed-none` / `not-sure` / `none`. A voice with only a hard vowel sung is also `usable >= 1`. |
| The Record door | `recordDoorKey(usable)` (`voice-pane.ts:61-63`) | `carryOn` instead of `record`. The brief leaves the door names unchanged. |
| The closed Voice band's line | `scoreStateLine` (`bandState.ts:246-249`), `+page.svelte:1761` | "n of 10". The brief leaves it unchanged (it counts every sung vowel). |
| The capture screen's finish control | `finishEarlyState` (`finish-early.ts:34`) | "Use what I've recorded" / "Work out the rest" show from the first vowel; Step 2 hides the control below five core vowels. |
| The chart | `zones.ts`, `model.ts:27` | The singer's own dots draw for every sung vowel (unchanged by the brief). The hollow placeholder dots for unsung vowels follow `resolveVowelValues(..., { placeholders: 'always' })` (`zones.ts:121-125`): after Step 2 they follow the type's template whole below five (for no type: the `middle` template). |
| The summary | `outsideVowels(judgeUnchecked(profile))` (`CalibrationWizard.svelte:331`) | Independent of the count; Step 5 replaces the test. |
| Exported files | NOT ESTABLISHED. I found `voice/engine/capture-file.ts` (the recorder's capture file) and did not read it for vowel values; I did not find another export of the vowel profile. |

## Things Step 0 found that the brief does not state

1. `resolve-values.ts:81` returns the judged copy as `formants`, and no singer-facing site reads `.formants`. Step 5's `judgeUnchecked` removal only has to cover the wizard, the re-export, and the call at `:102`.
2. `standIns` and `retake` have no singer-facing reader today; Step 3's removal of `StandInReport.retake` removes nothing a singer sees.
3. `finishEarlyState` calls the resolver with `'always'` (`finish-early.ts:36`). After Step 2 makes a non-personal profile resolve as nothing sung, `anyUsable` (`:38`) is false below five, so the caption already goes quiet there; the control itself (the link) still needs Step 2's gate.

## What I could not establish

- Whether an exported file carries vowel values (see the table).
- The ship script's numbering of the eight gates.
- Gate 4 with Python, numpy, and scipy (not installed here): the with-scipy count of 6613 | 1 skipped is not re-measured; the without-scipy count matches its baseline.
