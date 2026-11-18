# Report, lane 68, Step 1: every sample counts; the profile completes at five stable

2026-11-18. Branch `cloud-lane-68`. Tests run: the seven files this step changed (sung, stand-ins, resolve-values, adapter-golden, stand-ins-snapshot, identity, finish-early): 7 files, 90 tests, all passed. `svelte-check`: 0 errors, 12 warnings. Ratchets OK (no ceiling file gained a line).

## What changed

1. `voice/engine/sung.ts`: new `stableCore(formants)` (core vowels in `CORE_VOWELS` order that are `isSung` and `confidence !== 'low'` or `plausibilityOverride === true`, amendment 2). `coreCount` is its length. `isPersonal` keeps its name and threshold of 5.
2. `voice/engine/resolve-values.ts`: no longer empties `formants`; every sampled reading enters (fR1 loop, fR2 loop as before). `isPersonal(sampled)` is passed to `fillStandIns`. The derived-vowel loop runs only when personal (amendment 1).
3. `voice/engine/stand-ins.ts`: `fillStandIns(m, voiceType, personal)` (amendment 3). Scaled only when `personal` and k is finite. Not personal: every missing core vowel takes `template(standInBucket(type))` unscaled, step `'template'`, and every missing hard vowel is derived from the template's anchors alone, source `'surrogate'`, step `'derived'`. The template anchors are rounded to 0.1 as the stand-ins are, so a voice with nothing sampled derives exactly what it derived before (the first draft left them unrounded and moved the `soprano | none` and `baritone | none` golden entries; caught by the golden, fixed).
4. `generic` (`resolve-values.ts`): the expression is unchanged (`!anySung && hasPlaceholderProfile(type)`); with sampled readings now entering, `anySung` is true for anything sampled, so `generic` is false then (item 4).
5. A type with no placeholder profile and anything sampled: `anySung` runs `fillStandIns`, which uses `standInBucket` (contralto and countertenor `tenor-mezzo`, bass-baritone `bass`, "Not sure" and none `middle`). Pinned in `resolve-values.test.ts` and `stand-ins-snapshot.test.ts`.
6. `insights/InsightsPane.svelte` `measuredVowels` and `markup/MarkupPane.svelte` `hasReadings` are back to "any sampled vowel" (`isSung`). `MarkupPane` imports `{ isSung }` alone (amendment 9). `voice/VowelCapture.svelte:282` keeps `isPersonal` (it completes the profile). No line added to either ceiling file.
7. Golden regenerated with `UPDATE_ADAPTER_GOLDEN=1` (`adapter-golden.test.ts`).

## The golden, by key

144 entries; 84 moved. Every moved entry is one of the seven sets under five stable core vowels, under each of the twelve types (`(undefined)`, `''`, soprano, mezzo-soprano, mezzo, contralto, tenor, countertenor, baritone, bass, bass-baritone, not-sure):
- `i`, `i,u`, `i,e,ɑ`, `e,ɛ,ɑ,o`, `bad i (1063), no override`, `no fR2 on [e]`, `provisional [u], [ɨ] sung` (the last has one stable core vowel: its [u] is unstable).
Reason: each now carries its sampled vowels as sung and every other vowel as the type's placeholder (for the withheld types, `standInBucket`'s staff), where before it was equal to its `none` twin. Not moved: all twelve `none`, and `six`, `all ten`, `bad i kept, six`, `verdict stored` for every type. Counted from the diff of `HEAD` against the regenerated file, not from the test.

## Tests rewritten, and why

- `voice/engine/sung.test.ts`: the test "counts an unstable reading" became four tests (4 stable plus 1 unstable is 4 and not personal; 5 stable plus 1 unstable is 5; a kept unstable counts; `stableCore` order).
- `voice/engine/stand-ins.test.ts`: every `fillStandIns` call now passes `personal`. Passed `false`: the "fills all ten" test (0, 1, 2 sung and 5 sung, lines 68), "never changes a sung value" (2 sung), "flags a derivation built on a stand-in anchor" (1 sung), and "a voice with nothing sung takes the template whole". Passed `true`: the five-sung and six-sung tests (tract scale, no outlier, fR2 gap, derived vowels). New block "a voice not yet personal" (4 tests).
- `voice/engine/resolve-values.test.ts`: lane 67's "below five equals nothing sung" replaced by five tests (sampled values used for every type and mode; placeholders unscaled and `generic` false; hard vowel from template anchors alone; no-profile types draw; four stable plus one unstable).
- `analysis/adapter-golden.test.ts:57-60`'s rule rewritten (amendment 4) to the lane 68 rule, checked against `resolveVowelValues({}, type, 'always')` for the unsampled vowels and against the sampled values, in the live adapter and in the golden file.
- `analysis/stand-ins-snapshot.test.ts` (one to four stable core vowels), `insights/identity.test.ts` (`restsOnSamples` is true for four core vowels and for one under contralto), `voice/chart/finish-early.test.ts` (below five, what is recorded is usable): each pinned lane 67's rule and now pins lane 68's.

## Comments corrected (each made false by this step)
- `voice/engine/sung.ts`: the `coreCount` doc and the threshold doc.
- `voice/engine/stand-ins.ts`: header items 2, 3 and 5, and the `StandInReport.bucket` doc.
- `voice/engine/resolve-values.ts`: header, the `generic` doc, the loop comments.
- `voice/chart/finish-early.ts:11`.
- `analysis/analyze-score-adapter.ts:60-61` (the `standIns` doc).
- `tools/n200-score/lane66-core.ts:134` (`setAside`'s doc: lane 67's blanket set-aside is reversed; the function's logic reads sources and is unchanged; not re-run).
- Left for Step 2 and 3: `components/Drawer/voice-pane.ts` and `VoicePane.svelte:43` (the pane's strings), `voice/outside.ts:31` (Fix 2).

## NOT ESTABLISHED
- `tools/n200-score/lane66-core.ts` and `lane67-core.ts` were not re-run; they call `resolveVowelValues`, whose below-five output changed.
