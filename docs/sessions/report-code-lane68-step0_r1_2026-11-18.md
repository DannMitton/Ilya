# Report, lane 68, Step 0: gates and readers

2026-11-18. Branch `cloud-lane-68`, cut from `Shane` at 737228cb ("Lane 68 brief r2 ..."). Working tree clean at the start. Fresh `pnpm install --frozen-lockfile`.

## The eight gates on the untouched tip

| Gate | Baseline | This run |
|---|---|---|
| phonology | 462 passed (462) | 462 passed (462) |
| dictionary | 248 passed (248) | 248 passed (248) |
| svelte-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings, 5 files with problems |
| web | 6656 passed, 5 skipped (6661) without Python, numpy, scipy | 6656 passed, 5 skipped (6661). This sandbox has no scipy, so the "without" figure is the one that applies. |
| score-parser | 904 passed, 5 skipped (909) | 904 passed, 5 skipped (909) |
| blurb | 178 passed (178) | 178 passed (178) |
| integration | 159 passed (159) | 159 passed (159) |
| ratchets | OK | OK |

All eight match.

## Readers, at 737228cb (every line read this session)

### `coreCount` and `PERSONAL_CORE_MIN`, `isPersonal` (`voice/engine/sung.ts:24`, `:31`, `:32`)
- `voice/engine/resolve-values.ts:55`: `isPersonal(sampled) ? sampled : {}`. Decides whether any sampled reading enters the maps.
- `components/Drawer/voice-pane.ts:12`, `:36`, `:55`: `PERSONAL_CORE_MIN` and `i.core` choose `core-generic` or `core` and compute {m}.
- `routes/+page.svelte:135`, `:4187`: `core={coreCount(voiceFormants)}` into `VoicePane`; `VoicePane.svelte:44`, `:59` passes it to `paneSentence`.
- `insights/InsightsPane.svelte:87`, `:244`: `measuredVowels` is empty below five.
- `markup/MarkupPane.svelte:64`, `:450`: `hasReadings` is false below five.
- `voice/VowelCapture.svelte:25`, `:282`: the finish control shows only when personal.
- `voice/outside.ts:15`, `:37`: `farOffIgh` returns false when not personal.
- Comments only: `voice/chart/finish-early.ts:11`, `components/Drawer/VoicePane.svelte:43`, `voice/engine/stand-ins.ts:18`, `:24`, `resolve-values.ts:4`.

### `anySung` (`resolve-values.ts:40`, `:149`)
- `resolve-values.ts:152`: with `generic` and `placeholders === 'always'`, decides whether `fillStandIns` runs.
- `voice/chart/finish-early.ts:38`: `anyUsable: r.anySung`.

### `generic` (`resolve-values.ts:42`, `:150`; `AdaptedProfile.generic`, `analysis/analyze-score-adapter.ts:73`, `:129`, `:176`)
What `generic` false switches on or off for the singer:
- `insights/InsightsPane.svelte:515`, `insights/identity.ts:50-52`: the lede "These findings use placeholder values for a generic ..." (`genericLede`) shows only when `generic`.
- `insights/identity.ts:41-43` `restsOnSamples` (`completeness.formants && !generic`), read at `InsightsPane.svelte:280` (identity line, "calibrated {date}") and `:292` (method line key: `insights.method.noScore.samples`, `insights.method.generic.*`).
- `insights/InsightsPane.svelte:373`: `generic` and `placeholderLabel` into the blocks; `insights/singer-blocks.ts:254` (a placeholder finding's sentence drops its remedy when generic, via `placeholderCommentSentence` and `placeholder.comment.generic`, `analysis/placeholder-line.ts:55`), `:337` (the "against" sub line, `insights.r2.vowels.against.generic`).
- `markup/MarkupPane.svelte:552` (`profileSubtitle`, `markup/subtitle.ts:10-11`: the "whose placeholders" subtitle vs "a map of ... resonances"), `:850` (`composeBroadNote`, `analysis/analyze-score-adapter.ts:195`: `analysis.broad.body.generic`), `:870` (`filledHeads: !adapted.generic` in the legend, `markup/legend.ts:107`), `:877` (`gatedLines`).

### `paneState` states `core-generic` and `core` (`voice-pane.ts:30`, `:36`, `:43`, `:54-58`)
- `core-generic`: `usable >= 1`, `core < 5`, Tier 1 type with a placeholder profile. Prints `calib.pane.coreGeneric` / `coreGenericOne` with the voice type filled in.
- `core`: the same with any other type. Prints `calib.pane.core` / `coreOne`.
- `usable >= 10` is tested first (`:33`), so ten usable readings with fewer than five stable core vowels would print "all". Amendment 7.2 moves the below-five test ahead of that.

### Other consumers of the resolution (for Step 1)
- `voice/chart/zones.ts:89`, `:91`: the chart calls `resolveVowelValues({}, ..., 'always')` and `resolveVowelValues(profile, ..., 'always')`, so the chart's dots change with the resolver.
- `voice/chart/finish-early.ts:36`.
- `analysis/analyze-score-adapter.ts:129` is the only adapter call.
- `voice/engine/stand-ins.ts:132` `fillStandIns` has one non-test caller (`resolve-values.ts:152`).
