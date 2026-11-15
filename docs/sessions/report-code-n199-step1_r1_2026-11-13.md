# Report, N.199 Step 1: one window, one set of values, and the chart's numbers

2026-11-13, cloud lane, branch `cloud-lane-51`. Pure code with tests. Nothing a singer sees: no component renders any of it yet, and the app behaves as before with or without `?calibrate=new`.

## What changed, with path:line

**1. The one window** (`apps/web/src/lib/voice/engine/plausibility.ts`)
- `applyMargins` `:170`, the one place the floor and ceiling ratios are used.
- `anchorF1sFor(profile)` `:179`: the loop that stood inline in `CalibrationWizard.svelte`'s `withPlausibility`.
- `GuardWindow` `:188`, `windowFor(vowel, voiceType, anchorF1s)` `:202`: the six Bozeman vowels' band by bucket (union with no type), margins applied; the four personal vowels' window centred on `expectedF1`; `null` where the guard says `unchecked`.
- `checkPlausibility` `:234` now calls `windowFor`. Its result is unchanged in every field (`window-for.test.ts`, 116 tests; the older `plausibility.test.ts` passes untouched).
- `CalibrationWizard.svelte:313` calls `anchorF1sFor(profile)`; import at `:69`.

**2. One set of values** (`apps/web/src/lib/voice/engine/resolve-values.ts`, new)
- `judgeUnchecked` `:48` moved here; `resolveVowelValues(sampled, voiceType, { placeholders })` `:96`; `ResolveOptions` `:70`; `ResolvedValues` `:79`. The adapter's body from `judgeUnchecked(sampled)` through the `fillStandIns` call moved here unchanged, comments included.
- The flag: `placeholders: 'declared-types'` (default; today's rule, stand-ins for a voice that has sung nothing only when its type is one of the five) or `'always'` (the chart).
- `analysis/analyze-score-adapter.ts:132` calls it with `'declared-types'`. `judgeUnchecked` is re-exported at `:42` because `analyze-score-adapter.test.ts` imports it from there. The file went from 358 to 199 lines.
- **Proof of byte-identical output.** `analysis/adapter-golden.test.ts` + `analysis/__golden__/adapter-snapshots.json` (169,580 bytes): 12 voice types (including none and the empty string) by 12 sung sets (none; [i]; [i u]; [i e ɑ]; [e ɛ ɑ o]; the six; all ten; a 1063 Hz [i] the guard fails; the same kept; a reading with no fR2; a Provisional [u] with [ɨ] sung; stored verdicts), 144 snapshots, the whole `AdaptedProfile` per case. **The golden was written from the adapter before any edit** (the first run with `UPDATE_ADAPTER_GOLDEN=1`, on the unmodified file) and passes now without regeneration. The existing `analyze-score-adapter.test.ts` and `stand-ins-snapshot.test.ts` also pass untouched. The grid is mine; "the existing fixtures" I took to mean those two files plus this grid.

**3. Zones** (`apps/web/src/lib/voice/chart/zones.ts`, new)
- `computeZones(profile, voiceType)` `:81` returns ten `Zone`s in Grayson's order and a `PlaceholderDot` for every vowel with no stored reading.
- `FR2_HALF_SPAN_SEMITONES = 2.5` `:40`, commented as JUDGEMENT and the desk's placeholder, citing Bozeman PVA 2nd ed. p. 35 and Fig. 5.3 p. 31, and that he charts no fR2 band per vowel by voice type.
- `basis: 'guard' | 'placeholder'` `:43`.

**4. Placeholders for every voice.** `computeZones` calls `resolveVowelValues(..., { placeholders: 'always' })`. **This is the one computation the brief said it changes**: the chart gets placeholders for contralto, countertenor, bass-baritone, "Not sure", and no type. The forecast's own behaviour does not change (golden). Pinned in `zones.test.ts` ("the chart shows a placeholder for every voice") and `resolve-values.test.ts`.

**5. Geometry** (`voice/chart/geometry.ts`, new): `fullView` `:58`, `zoomTarget` `:93`, `ease` `:124`, `mixView` `:130`, `zoomFactor` `:136`, `project` `:139`, `hull` `:144`. Log axes; fR2 across high to low, fR1 down. `EXTRACTOR_FR1_HZ`/`EXTRACTOR_FR2_HZ` `:34-35` are copies of `extract.ts:9`, which does not export them and which this brief does not let me touch; `geometry.test.ts` reads `extract.ts` and fails if they drift.

**6. Tour** (`voice/chart/tour.ts`, new): `nextVowel(sung, last, pass?)` `:22`. The order is the wizard's `DEFAULT_VOWELS` then `CHALLENGING_VOWELS` (`CalibrationWizard.svelte:102-103`), which I read.

**7. Names and symbol.**
- `voice/vowel-names.ts` (new) holds `spokenName` `:24` and `spoken` `:25`, moved from `Pacifier.svelte`'s module script. Importers: `CalibrationWizard.svelte:46`, `markup/MarkupPane.svelte:63`, `pacifier/Pacifier.svelte:5`.
- **`Pacifier.svelte` is touched beyond the one import line, and I want that said.** Its `<script module>` block held only those two exports and two imports; removing the exports left the block empty, so I deleted it and put the `t`, `Language`, and `spoken` imports into the instance script (`Pacifier.svelte:3-5`) and `Vowel` into the existing types import (`:8`). No logic in it changed. 972 lines became 949.
- `voice/FrSym.svelte` (new): the `frSym` snippet's markup and its two style rules, verbatim. `CalibrationWizard.svelte:1148-1149` use `<FrSym n={1} />`, `<FrSym n={2} />`; the snippet and its rules are gone from the wizard (2112 to 2086 lines). The change to small capitals is Step 7's, as the brief says.

## Decisions I made, for Dann to strike

1. **Which zones stay.** The brief says zones do not move and also says the fR2 centre comes "from the resolved values", which shift as vowels are sung. I read ruling 5 as governing. So: a Bozeman zone's fR2 centre is the type's template with nothing sung (`resolveVowelValues({}, type, 'always')`), and **the six Bozeman zones are identical after one, two, and three sung vowels** (`zones.test.ts`, which fails if the centre follows the fit: I mutated it and four tests failed). A placeholder dot is the value the fit gives now, so it moves.
2. **The four personal zones are not fixed by the type, and I say so.** The guard centres their window on the singer's own anchors, so a zone that equals the guard's window must move when its anchor is sung. Until then it is `basis: 'placeholder'`, drawn around the type's template value with the guard's margins; the moment the anchor ([i] for [ɨ], [e] for [ɪ], [ɑ] for [a] and [ʌ]) is sung it becomes `basis: 'guard'` and jumps to the guard's window. That jump happens once per vowel. If Dann wants those zones still, the choice is between a still zone that is not the guard's window and the one-window rule; the brief chose the guard.
3. **The union bands apply with no type**, so [e] and [o] share one zone there (the guard's behaviour, `plausibility.ts:96-108` as the brief says).
4. **Which inputs the values use.** `resolveVowelValues` judges unjudged readings with no voice type (the adapter's rule, which I kept so the golden holds), where the wizard judges with the declared type. Stored readings from the wizard already carry their verdict, so this matters only for a reading stored without one. The brief names the two sites' differing inputs; I did not unify them.
5. **The two bucket functions are pinned, not merged.** `window-for.test.ts` lists every Tier 1 id plus no type: `bucketFor` and `standInBucket` differ for countertenor (`union` against `tenor-mezzo`), "Not sure" and no type (`union` against `middle`), and for the spelling "mezzo soprano" (accepted by the guard only). They agree on the five declared types.
6. **Zoom, margin, and fill constants** in `geometry.ts` (`VIEW_MARGIN` 0.06, `ZOOM_MIN` 1.4, `ZOOM_MAX` 3.2, the half-fill 0.5, the widening margin 0.1, a minimum span of 0.25 in ln units) are JUDGEMENT; the zoom bounds and fill are board D's. Each is commented.

## Gates after Step 1

| Gate | Baseline | After Step 1 |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | **5451 passed, 1 skipped** (292 files) |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

web-test rose by 199 and nothing else moved. The 199 are exactly my new tests, counted per file: `adapter-golden` 2, `vowel-names` 3, `geometry` 19, `tour` 9, `zones` 44, `resolve-values` 6, `window-for` 116.

## Could not establish

- Whether the 144-case grid covers every fixture the brief means by "the existing fixtures". It covers the cases I could name from the adapter's code and its two test files; a case outside it is not proved.
- Whether a retired caller still reads `judgeUnchecked` from the adapter: I kept the re-export rather than search every note and doc for a name.
- The fR2 half-height of 2.5 semitones as a true width for any vowel: it is the desk's placeholder, and no source in this repository gives a band per vowel by voice type.
- How the zones look: nothing renders them yet (Step 4a).
- Whether `resolveVowelValues` is cheap enough to call on every frame; I did not measure it. `computeZones` calls it twice. Step 4 will call `computeZones` per profile change, not per animation frame, and I will measure there if that changes.
