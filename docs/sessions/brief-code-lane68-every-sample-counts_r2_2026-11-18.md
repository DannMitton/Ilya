# Brief to Code: lane 68, every sample counts from the first, and the lines that say so

r2, 2026-11-18 14:3x, written by the desk (Opus 5.5). It applies Fable's review of r1 (`docs/sessions/review-fable-lane68-brief_r1_2026-11-18.md`: SEND WITH AMENDMENTS, twelve amendments) in section 7, which is binding and wins over sections 1 to 6 where they differ. r1 is superseded. For a cloud Code session on branch `cloud-lane-68`, cut from the tip of `Shane` (the desk names the commit; `753f1506` plus this brief's ship). No other lane is running.

Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `tools/`, `docs/`, or are `vercel.json`. The desk read the lines it cites at `Shane` `753f1506`. Step 0 re-reads them on your tip.

## 1. What the singer gets

Lane 67 built the threshold as "below five core vowels, the recordings unlock nothing" (`voice/engine/resolve-values.ts:55`). Dann, 2026-11-18 13:42, transcribed as written: *"It was my thought that we use whatever the user provides. ... Why should wer ignore data the user offers in good faith?"*. The desk misread his 23:31 ruling; he meant the *complete* profile waits for five (`docs/memory/INBOX.md`, 2026-11-18 13:42 to 14:00).

1. **Every sampled vowel is used as sampled, from the first.** MELODY, INSIGHTS, the chart, and the VOICE pane use each sampled vowel's own values for that vowel, at any count.
2. **Below five stable core vowels, the vowels not yet sampled take the placeholder values as they are**, unscaled: the declared type's template (`stand-ins.ts`, `template(standInBucket(type))`; `middle` for "Not sure" and none). Nothing is scaled from fewer than five, so one odd take cannot move the others.
3. **At five stable core vowels, the profile completes from the singer's own voice**: the sixth core vowel from the tract scale (lane 67, unchanged), and the four hard vowels derived from sampled anchors (unchanged).
4. **"Stable"** (Dann 13:57 and 14:00: *"at least 5 stable fry samples"*, a symmetry with "unstable"): a core vowel counts toward five when it is sampled (`isSung`) and its `confidence !== 'low'`. An unstable take is still used for its own vowel (item 1); it does not count toward five.
5. **The lines a singer reads say this** (section 5, all RATIFIED).
6. **The five fixes of lane 67's as-built review** (`docs/sessions/review-fable-lane67-as-built_r1_2026-11-18.md`, Fixes 1 to 5).

## 2. Steps

Each step its own commit and report section, test first where a test applies, then pushed. Step 0 runs all eight gates as the baseline; later steps run the tests of the files they change; all eight gates and the named Playwright suites once at the end. Gate 4 baseline at `753f1506`: 6660 passed, 1 skipped (6661) with Python, numpy, scipy; 6656 passed, 5 skipped (6661) without.

Standing line: correct every comment your change makes false, in the same commit, and list them. Ceilings (`scripts/ratchets.json`): `voice/CalibrationWizard.svelte` 1124 of 1126, `markup/MarkupPane.svelte` 1353 of 1353, `insights/InsightsPane.svelte` 742 of 744, `routes/+page.svelte` 5532 of 5534. Move code out to a module first, in its own commit, if a step needs lines. No edit inside `withPlausibility`.

### Step 0. Read and report; change nothing

All eight gates. Then list every reader of `isPersonal`, `coreCount`, `PERSONAL_CORE_MIN`, `generic`, `anySung`, and `paneState`'s `core-generic` and `core` states, with what each decides for the singer, at your tip. This is Step 1's list.

### Step 1. Every sample counts; the profile completes at five stable

1. `voice/engine/sung.ts`: `coreCount` counts core vowels that are `isSung` and `confidence !== 'low'` (section 1 item 4). `isPersonal` keeps its name and threshold. Tests for unstable takes at 4 and 5.
2. `voice/engine/resolve-values.ts:55`: stop emptying `formants`. Sampled readings always enter (`:66-79` and the fR2 loop as today). Pass to `fillStandIns` whether the voice is personal.
3. `voice/engine/stand-ins.ts` `fillStandIns`: when personal, as today (`middle` times k). When not personal and anything is sampled: every missing core vowel takes `template(standInBucket(type))` unscaled, step `'template'`; sampled values untouched. When nothing is sampled: as today.
4. `generic` (`resolve-values.ts`, row 166): true only when nothing is sampled and the type has a placeholder profile, as before lane 67. With anything sampled it is false, so INSIGHTS' "These findings use placeholder values for a generic bass" lede does not show; the section 5 line shows instead.
5. A type with no placeholder profile (contralto, countertenor, bass-baritone, "Not sure", none) and 1 to 4 stable core vowels: the unsampled take `template(standInBucket(type))` (contralto and countertenor map to `tenor-mezzo`, bass-baritone to `bass`, "Not sure" and none to `middle`, `stand-ins.ts:63-70`), so INSIGHTS and MELODY draw. DESK DEFAULT; it replaces lane 67's silent page for these voices.
6. The sites lane 67 gated on `isPersonal` (`insights/InsightsPane.svelte:244` `measuredVowels`; `markup/MarkupPane.svelte:450` `hasReadings`; `voice/VowelCapture.svelte:282` the finish control): `measuredVowels` and `hasReadings` go back to "any sampled vowel" (`isSung`), so a sampled vowel is called measured and MELODY's page with no score says the profile is set. The finish control keeps `isPersonal` (it completes the profile).
7. Regenerate `analysis/__golden__/adapter-snapshots.json` by its script; list every moved entry by key with its reason. Expected: the sets under five core vowels now carry their sampled values and type-template placeholders; sets at five or six do not move.

### Step 2. The lines (section 5)

1. INSIGHTS and MELODY: when anything is sampled and the voice is not personal, the placeholder line (`analysis/placeholder-line.ts`, `placeholderLine`) is replaced by the section 5 line (key `placeholder.line.belowCore`, and `placeholder.line.markup.belowCore` for MELODY), with {n} the stable core count, {m} = 5 minus {n}, and {vowels} the stable core vowels sampled in roster order, listed as `vowelList` lists them. The "one more" forms where {m} is 1. When personal, or nothing sampled, today's lines.
2. The VOICE pane: `calib.pane.coreGeneric`, `coreGenericOne`, `calib.pane.core`, `coreOne` (`i18n.ts:1436-1439`) are replaced by the section 5 pane line (one key, `calib.pane.belowCore`, and `calib.pane.belowCoreOne`), for every type. `paneState`'s two below-five states become one. Mark the four retired keys UNUSED in place, the file's habit.
3. The unstable note: with one vowel, `calib.summary.unstableOne` and the button `calib.summary.keepOne`; with two or more, today's `calib.summary.unstable` and `calib.summary.keepAll`.
4. Key count line and index test.

### Step 3. Lane 67's review fixes 1 to 5

As written in `docs/sessions/review-fable-lane67-as-built_r1_2026-11-18.md`, Fixes. Fix 2 (a sung [ɨ] with no usable fR2 is never far-off) is in: it stops a false message.

### Step 4. The phone flake

Run the phone project (`voice-stations`, `insights-links`) three times at your Step 0 tip and three times at the end. Report each run. Change no test for a flake.

### Step 5. Pictures, `vercel.json`, the end gates

1. Pictures, English and French, phone and desktop, bass: the VOICE pane at 3 stable core vowels; INSIGHTS at 3; MELODY with a score at 3; the unstable note with one vowel and with two. Look at each.
2. `vercel.json` names `cloud-lane-68` alone in both places.
3. All eight gates; Playwright `voice-pane`, `voice-stations`, `voice-links`, `insights-links`, `calibrate-new` (desktop), `voice-stations`, `insights-links` (phone). Change an expectation only where section 1 says the singer now sees that; list each.

## 3. Owns and leaves

Owns: `voice/engine/sung.ts`, `resolve-values.ts`, `stand-ins.ts`, their tests; `analysis/placeholder-line.ts`, `analysis/__golden__/`; `insights/InsightsPane.svelte`, `markup/MarkupPane.svelte` (within ceilings); `components/Drawer/voice-pane.ts`, `VoicePane.svelte`; `voice/outside.ts`, `voice/OutsideNote.svelte`, `voice/VowelCapture.svelte`; the files lane 67's fixes name; `i18n.ts` (section 5 keys and the four marked UNUSED only); `tools/n200-score/`; `vercel.json`. Leaves: the extractor, `docs/memory/`, every brief, every other string.

## 4. Constraints

No pull request; push only `cloud-lane-68`. Change nothing under `docs/memory/`; do not edit a brief. NOT ESTABLISHED beats a complete invented answer.

## 5. Strings, RATIFIED by Dann 2026-11-18 13:53 to 14:00. Build exactly as written

INSIGHTS, `placeholder.line.belowCore` (English Dann's own words, 13:53; French ratified 13:56):
- EN: To complete your personal vowel space, Ilya needs you to sample at least 5 of these 6 core vowels: [i], [e], [ɛ], [ɑ], [o], and [u]. You have sampled {n} so far ({vowels}). Until you provide {m} more, unsampled vowels are assigned placeholder values. Findings that rest on a placeholder are drawn dashed. You can add new fry samples anytime through the DRAWER on the left.
- FR: Pour compléter votre espace vocalique personnel, Ilya a besoin que vous échantillonniez au moins 5 de ces 6 voyelles de base : [i], [e], [ɛ], [ɑ], [o] et [u]. Vous en avez échantillonné {n} jusqu’ici ({vowels}). D’ici à ce que vous en fournissiez {m} de plus, les voyelles non échantillonnées reçoivent des valeurs par défaut. Les constats qui en dépendent sont tracés en pointillé. Vous pouvez ajouter de nouveaux échantillons en friture vocale à tout moment depuis le TIROIR de gauche.

MELODY, `placeholder.line.markup.belowCore`: the same, with "drawn dashed" as "drawn hollow or dashed" and « tracés en pointillé » as « tracés évidés ou en pointillé » (the ratified ending of `placeholder.line.markup.many`, `i18n.ts:2057`).

"One more" forms (`…belowCoreOne`), where {m} is 1: EN "Until you provide 1 more"; FR « D’ici à ce que vous en fournissiez une de plus ».

VOICE pane, `calib.pane.belowCore` (Dann 13:57 and 14:00):
- EN: You have sampled {n} of the 6 core vowels so far ({vowels}). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide {m} more, unsampled vowels are assigned placeholder values.
- FR: Vous avez échantillonné {n} des 6 voyelles de base jusqu’ici ({vowels}). Pour compléter votre espace vocalique personnel, Ilya a besoin d’au moins 5 échantillons stables en friture vocale. D’ici à ce que vous en fournissiez {m} de plus, les voyelles non échantillonnées reçoivent des valeurs par défaut.
- `calib.pane.belowCoreOne`: "Until you provide 1 more" / « D’ici à ce que vous en fournissiez une de plus ». With {n} 0 and anything sampled (a hard vowel alone), the line prints "0" and an empty list is left out with its parentheses.

The unstable note, one vowel, `calib.summary.unstableOne` (Dann 14:00):
- EN: This reading was unstable: {vowels}. Another try may help.
- FR: Cette lecture était instable : {vowels}. Une reprise pourrait aider.
- Button: `calib.summary.keepOne` (exists, `i18n.ts:1352`).

## 6. Reports

One per step: `docs/sessions/report-code-lane68-step<N>_r1_2026-11-18.md`.

## 7. Amendments from Fable's review of r1, binding (each a DESK DEFAULT unless it says otherwise)

1. **Hard vowels below five.** Below five stable core vowels, an unsampled hard vowel ([ɨ], [ɪ], [ʌ], [a]) is a placeholder: derived from the declared type's template anchors alone (`template(standInBucket(type))`), source `'surrogate'`, step `'derived'`. No value below five is built from a mix of a sampled anchor and a template anchor. The resolver's derived loop (`resolve-values.ts:126-138`) runs only when personal; when not personal, `fillStandIns`'s derived loop (`stand-ins.ts:157-175`) reads its anchors from the template, not the maps. A sampled hard vowel is still used as sampled (section 1 item 1).
2. **Kept counts as stable.** A core reading the singer kept (`plausibilityOverride === true`, "Keep it" or "Keep them") counts toward five whatever its confidence. So `coreCount` counts core vowels that are `isSung` and (`confidence !== 'low'` or kept). `paneState` tests the below-five state before `usable >= 10` (`voice-pane.ts:33`, `:36`).
3. **Signature.** `fillStandIns(m, voiceType, personal)`; the resolver passes `isPersonal(sampled)`. Scaled only when `personal` and k is finite (`stand-ins.ts:139-143`). Tests that scale from fewer than five sung values (`voice/engine/stand-ins.test.ts:68-156`) pass `personal` true or are rewritten; list each.
4. **The golden.** Regenerate with `UPDATE_ADAPTER_GOLDEN=1` on `analysis/adapter-golden.test.ts` (`:8`, `:32`). Rewrite lane 67's test at `adapter-golden.test.ts:57-60` (sets under five equal their `none` twins) to the new rule.
5. **Where the line swap lives.** Inside `placeholderLine` (`analysis/placeholder-line.ts:47-51`), with the stored readings as a new last argument; the two call sites change in place (`insights/InsightsPane.svelte:515`, `markup/MarkupPane.svelte:740`), no line added. The below-five line shows whenever the page has an analysis and anything is sampled and the voice is not personal, including a song that uses no placeholder vowel; with no analysis, nothing.
6. **`vowelList`** is `analysis/placeholder-line.ts:31` (not `voice/chart/finish-early.ts:45`); core vowels in `CORE_VOWELS` order.
7. **{n} 0.** "An empty list is left out with its parentheses" applies to every section 5 line, not only the pane.
8. **Owns, added:** `routes/+page.svelte:4187` only, changed in place: `core` becomes the list of stable core vowels from a new `stableCore(formants)` in `sung.ts`, of which `coreCount` is the length; `VoicePane.svelte` takes the list. Comments only: `voice/chart/finish-early.ts:11`, `tools/n200-score/lane66-core.ts:134`; `lane67-strings.test.ts:10-13` (the four retired pane strings, pins updated with their UNUSED marks).
9. **Fix 1's import** in `MarkupPane.svelte:64` is `{ isSung }` alone (after Step 1.6 the file no longer reads `isPersonal`).
10. **`generic` false brings back the lines of a sampled voice** (`restsOnSamples`, `insights/identity.ts:41-43`: "calibrated {date}", "computed from your calibration of {date}", "your measured resonances", MELODY's subtitle). This is intended. Add to Step 0's list each line `generic` false switches on, and to Step 5's pictures INSIGHTS with one vowel sampled.
11. **Citations:** `standInBucket` is `stand-ins.ts:53-60`; the fR1 loop is `resolve-values.ts:76-81`.
12. **End suites:** add `pages-without-gaps` (desktop) to Step 5.3.
