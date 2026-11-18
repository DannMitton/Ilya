# Brief to Code: lane 67, how Ilya meets a voice, and a break

r2, 2026-11-18 06:0x, written by the desk (Opus 5.5). It applies Fable's review of r1 (`docs/sessions/review-fable-lane67-brief_r1_2026-11-18.md`: SEND WITH AMENDMENTS, three blockers, fifteen amendments, all applied; section 9). r1 is superseded and kept. For a cloud Code session on branch `cloud-lane-67`, cut from the tip of `Shane` (the desk names the commit; `f2b87049` at writing). No other lane is running.

Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `packages/`, `tools/`, `docs/`, or are `vercel.json`. The desk read the lines it cites at `Shane` `f2b87049`. Step 0 re-reads all of them on your tip.

## 1. What the singer gets

The design is Dann's, ruled 2026-11-17 23:21 to 23:38, `docs/memory/OPEN.md`, last section, "VOICE: HOW ILYA MEETS A VOICE, AND A BREAK" (committed before this lane is cut; read it in full first). His words, transcribed as written: (23:21) *"Yes to one calm flag at the right moment, this is the correct appraoch. Reconsider pushing the paradigm where all vowel values need to be withn our parameters. We prepare, then deal with reality whatever it is."*; (23:25) *"they all are shapes of the same tract ... The computed vowels are for the folks who can't create those four challenging v oerwels on command, but they can creatre the other six cardinal vowels reliably. I thought reference values per voice type would help us but our experience and your counsel tell us that they introduce problems"*; (23:31) *"it's valid for Ilya to refuse a complete vowel propfile for fewer than five proper vowel samples of the core six"*; (23:34) *"those who have selected generic values deliberately should have those values used. Those who dont' supply sufficient audio data can't benefit from the readings they are meant to enable."*; (23:37) *"this reading was unstable. Your sample could benefit from another try."*. In the singer's terms:

1. **Two paths, the singer's choice.** A voice type chosen with nothing recorded gives Ilya's generic values for that type, as today (`calib.pane.typedGeneric`, `i18n.ts:1422`). Recording gives the singer's own profile.
2. **The own profile needs five of the six core vowels** ([i], [e], [ɛ], [ɑ], [o], [u]). Below five, what is recorded is kept and shown in VOICE, and unlocks nothing personal: MELODY and INSIGHTS behave exactly as for a voice with nothing recorded (generic values if the type has them, otherwise the page that says nothing was measured). The VOICE pane says how many more core vowels are needed.
3. **At five or six, everything comes from the singer.** Sung values are used as sung. A missing sixth core vowel comes from one number, the singer's tract scale, applied to one fixed shape. The four hard vowels ([ɨ], [ɪ], [ʌ], [a]) are derived from the sung ones, as today, or used as sung.
4. **One calm flag, on the take's own steadiness.** The summary's note names the readings that were unstable (their own evidence, `confidence === 'low'`), once, with Keep or Re-take. It no longer compares a reading with reference values for a voice type.
5. **The voice type's values never mix with the singer's own vowels.**
6. **The far-off [ɨ]** (ruled 2026-11-13 15:13, message ratified 15:29, `docs/memory/OPEN.md:3800-3801`): for a personal voice, a sung [ɨ] far from where the singer's [i] and [u] place it gets the ratified message at the summary with three choices: keep it, Re-take, or "Use Ilya's estimate for now". Its own note, so the summary holds one note per vowel.

Principle (Dann 23:21): prepare, then meet reality; say what happened and how to move forward; do not solve every calamity. Do not add guards for rare or deliberately broken input. Dann 23:38: *"HOw do I get you to settle into a defeinsble plan without trying to serve every calamity we can imagine?"*

## 2. Definitions this lane fixes (DESK DEFAULTS, each the desk's, Dann's to strike)

- **Core count**: the number of the six core vowels whose reading `isSung` (`voice/engine/sung.ts:13`). An unstable reading counts; the flag invites a re-take (DESK DEFAULT on his word "proper", from `PRODUCT.md:1269-1270`: a status never blocks a reading). A reading the singer set aside with "Use Ilya's estimate for now" is [ɨ] only and does not affect the count.
- **Personal**: core count 5 or 6. One exported function, `isPersonal(formants)`, in `voice/engine/sung.ts`, used by every site.
- **Tract scale**: k = the geometric mean, over every sung core vowel and both resonances where sung (fR1 always, fR2 where `resolve-values.ts:141` would take it), of sung value over shape value. A missing core vowel's fR1 and fR2 are the shape's times k. A sung core vowel with no usable fR2 takes shape fR2 times k for that resonance only, as `stand-ins.ts:208` does today (grid case 'no fR2 on [e]', `analysis/adapter-grid.ts:31`). **The shape is the `middle` template whatever the declared type** (`stand-ins.ts`, `template('middle')`), so the voice type plays no part above the threshold. Step 4 measures shape differences and the odd-[i] case; it decides nothing.
- **Unstable**: `confidence === 'low'` on a sung reading (`isSung`), and not kept (`plausibilityOverride !== true`; the field keeps its name, it now means "kept"). Not `reading === 'provisional'`: before lane 64 the guard and the [ɨ] pass wrote `provisional` on readings with good evidence (`OPEN.md:3800`), and `keepReading` already treats `confidence` as the truth (`plausibility.ts:325`).

## 3. Steps

**Run the steps in this order: 0, 1, 4, 2, 5, 6, 7, 3, 8** (Step 4 measures on the untouched engine). Each step is its own commit and report section, test first where a test applies, then pushed. Step 0 runs all eight gates as the baseline; after each later step run the tests of the files changed; all eight gates and the named Playwright suites run once at the end. Gate 4 baseline at `f2b87049`: 6613 passed, 1 skipped (6614) with Python, numpy, and scipy.

A standing line for every step: correct each comment your change makes false, in the same commit, and list them in the report. Ceilings: `voice/CalibrationWizard.svelte` 1122 of 1126; `insights/InsightsPane.svelte` 742 of 744; `apps/web/src/routes/+page.svelte` 5531 of 5534 (Fable's as-built review of lane 66, check 3). If a step needs lines in one of them, move code out to a module first, in its own commit. No edit enters the body of `withPlausibility` in the wizard (`voice/plausibility-keeps-status.test.ts`).

### Step 0. Read and report. Change nothing.

1. All eight gates; record the counts.
2. A census, with file:line, of every reader of: `anySung`, `generic`, `standIns`, `retake` (the stand-in report's), `fitWithoutOutliers`, `fitResonance`, `OFF_SHAPE_SEMITONES`, `outsideVowels`, `outsideNote`, `judgeUnchecked`, `plausibility` (the verdict), `plausibilityOverride`, `usableReadingCount`, `hasAnyReadings`, `restsOnSamples`, `paneState`, `finishEarlyState`, `applyIghDivergence`, `isDivergent`, `calib.summary.outside*`. For each, say what it decides for the singer.
3. Every place a singer can see a different thing for a voice with 1 to 4 core vowels sung than for the same voice with none sung (MELODY, INSIGHTS, the VOICE pane, the closed Voice band's line, the chart, the summary, exported files). This is the list Step 2 changes.

### Step 1. The six fixes of lane 66's as-built review

`docs/sessions/review-fable-lane66-as-built_r1_2026-11-17.md`, section Fixes, 1 to 6, as written there (the duplicate `isSung` at `voice/chart/readings.ts:51`, and the optional one in `VowelCapture.svelte:108`; four comments; one sentence of `docs/sessions/n200-lane66-step4-measure_2026-11-17.md:40`). Fix 6 is a correction to a measure report: append a dated line under the sentence rather than rewriting it.

### Step 2. The threshold

1. `isPersonal` in `voice/engine/sung.ts`, with tests: 0 to 4 core sung false, 5 and 6 true; hard vowels and unstable readings as section 2 says.
2. `resolveVowelValues` (`voice/engine/resolve-values.ts:95`): when not personal, it resolves exactly as for a voice with nothing sung (`anySung` false, `generic` from `hasPlaceholderProfile`, `resolve-values.ts:197-200`). The stored readings are untouched (the VOICE pane and the chart read the stored profile, `voice/chart/zones.ts:121`, `:134`).
3. Sites that read stored readings and bypass `resolveVowelValues`, each gated on `isPersonal`: `insights/InsightsPane.svelte:242-246` (`measuredVowels`, read at `insights/comment-text.ts:123`); `markup/MarkupPane.svelte:449` (`hasReadings`, read at `:1096`: below five MELODY shows `profile.emptyState` as for nothing recorded, not "Your profile is now set"; the file is 1352 of 1353 lines, `scripts/ratchets.json:16`, so move code out first if needed); `voice/chart/finish-early.ts:36-38` (read at `voice/VowelCapture.svelte:281`: below five core vowels the "Use what I've recorded" control does not show; DESK DEFAULT, no new string). Unchanged, say so in the report: the closed band's count of all sung vowels (`components/Drawer/bandState.ts:246-249`, `routes/+page.svelte:1761`). Every other site of Step 0's list 3 follows: below five, MELODY and INSIGHTS say what they say today for a voice with nothing sung (the ratified generic wordings, `insights.generic.lede` `i18n.ts:1877`, `insights.method.generic.*` `:1879-1880`, `insights.method.noScore.generic` `:1887`, `analysis.broad.body.generic` `:1075`, `placeholder.comment.generic` `:2052`). The chart still draws the singer's own dots.
4. Test: a golden voice with 4 core sung gives byte for byte the adapter snapshot of the same voice with none sung (same type); with 5 it does not. Regenerate `adapter-snapshots.json` by its script and list every moved entry (the grid entries under five core vowels collapse to their none-sung twins: `analysis/adapter-grid.ts:25-33`).
5. For a type with no generic values, INSIGHTS below five says what it says for nothing recorded (`insights.silence.unmeasured`, `i18n.ts:1881`); the VOICE pane explains why (Step 6). DESK DEFAULT: no new INSIGHTS string.

### Step 3. The sixth core vowel from the tract scale

1. Replace the fit for a personal voice: no spread, no outlier removal, no `retake` list from the fit. A missing core vowel takes shape times k (section 2). Remove what then has no reader (`fitWithoutOutliers`, the spread, `OFF_SHAPE_SEMITONES`, `StandInReport.retake`), with their tests, or say why one stays.
2. A voice that is not personal never reaches this code (Step 2), and a generic voice keeps the declared type's template whole, as today (`resolve-values.ts:197-200`; row 166).
3. The four derived vowels keep `deriveFrom` (`derivations.ts`); an anchor that is a scaled core vowel makes a value whose source stays `'surrogate'`, as today (`stand-ins.ts`, the derived loop).
4. Update `adapter-snapshots.json` by its own script and report every entry that moved, by key, with the reason.

### Step 4. Measure, on the untouched engine (runs right after Step 1). A runner and a report; nothing in the product changes

A sibling `tools/n200-score/lane67-core.ts` on the 600 primary synthetic takes (`__golden__/path-600.json`): for each synthetic voice and each of the six ways to leave one core vowel out, estimate it three ways (shape `middle` times k; the declared type's template times k; today's fit, the tree's own `fillStandIns`) and report the error in semitones, fR1 and fR2, median and 90th percentile, by type and vowel. Also, one odd [i] (1063 Hz, `analysis/adapter-grid.ts:29`) among five core vowels: how far each method moves the missing one. The report's first lines say: "The truths are Ilya's own templates by type (`fidelity-set.ts:12-14`). The declared-type arm is exact by construction. This run measures how far Bozeman's staves differ in shape from their middle, and how far one odd [i] moves a missing vowel. It does not test `middle` against a real voice." Report to `docs/sessions/n200-lane67-step4-measure_2026-11-18.md`. Push it and go on; Step 3 uses `middle`.

### Step 5. One calm flag on the take's own steadiness

1. `voice/outside.ts`: `outsideVowels` becomes the list of unstable readings (section 2) among the vowels shown. `outsideNote` picks `calib.summary.unstable` (section 6). The "Beyond Ilya's reference values" mark is retired: `voice/chart/readings.ts:132` (the `beyond` field), `voice/chart/VowelSpaceSheet.svelte:124`, the string `calib.roster.kept` (`i18n.ts:1337`), and pins at `voice/outside.test.ts:55-63`, `voice/chart/VowelSpaceSheet.test.ts:107-110`, `voice/chart/readings.test.ts:149`.
2. `keepReading` (`plausibility.ts:325`) is unchanged: it marks the reading kept and quiets the note. Re-take works as today.
3. `judgeUnchecked`: if nothing singer-facing reads the verdict after this step, remove it at every site: the definition `resolve-values.ts:49`, its call `:102`, the re-export `analysis/analyze-score-adapter.ts:42`, the wizard's import `:61` and call `:331`. The wizard may keep storing the verdict (no edit inside `withPlausibility`). Say which.
4. Retired keys (`calib.summary.outside`, `calib.summary.outsideNoType`, `calib.roster.kept`) are kept and marked in place with a dated UNUSED comment, the file's habit (`i18n.ts:1347`).

### Step 6. The VOICE pane below the threshold

`components/Drawer/voice-pane.ts`: `PaneSentenceInput` (`:15-25`) gains a `core` field (the core count), passed through `components/Drawer/VoicePane.svelte:42`, `:54`, `:57` from `routes/+page.svelte:4186`. `paneState` (`:28-35`) gains a state for "anything sung and core count under 5" (a voice with only a hard vowel sung has `usable >= 1` and core 0), before `some-fills` and `some-works-out`; `paneSentence` prints the section 6 strings with {n} the core count, {m} = 5 minus {n}, and {voiceType} as `typedGeneric` fills it (`:54-57`). With 5 or more core vowels the existing states apply unchanged. Tests for core counts 0 to 6, with and without a type that has generic values, and for a hard vowel alone. The door names (`recordDoorKey`, `:61-63`) are unchanged.

### Step 7. The far-off [ɨ] choice

As N.200 brief r3 Step 5.10 specifies (`docs/sessions/brief-code-n200-voice-as-it-is_r3_2026-11-14.md:97`), with this lane's changes. The trigger: a pure function in `voice/outside.ts` calls `applyIghDivergence` (`voice/engine/divergence.ts:17-25`) on a clone of the profile, `isDivergent === true` (it is stripped only at `CalibrationWizard.svelte:272`; leave that). Only for a personal voice. The summary shows `calib.summary.outsideIgh` (`i18n.ts:1345`, ratified, unchanged) with three buttons: `calib.summary.keepOne`, Re-take (`calib.common.retake`), and `calib.summary.useEstimate` (section 6). An [ɨ] both unstable and far-off appears in the [ɨ] note only. The new choice stores a mark on the [ɨ] reading (DESK DEFAULT name `useEstimate: true`, in `voice/engine/types.ts` with its comment) and `isSung` returns false for a marked [ɨ], so every site (the count, the chart, INSIGHTS, resolution) shows Ilya's estimate; the reading stays stored and in the take record. The note goes quiet on Keep (`plausibilityOverride`), on the mark, or on a fresh take, which replaces the reading object (`CalibrationWizard.svelte:647`) and so clears the mark; a less clear re-take does not replace (`i18n.ts:2595`), so the mark stays. Logic in `outside.ts` and `OutsideNote.svelte`; the wizard's four free lines only for wiring. Tests for each.

### Step 8. Strings, pictures, the recorder build, the end gates

1. Add the section 6 keys exactly as written there. Update the key count line in `i18n.ts`.
2. Pictures, English and French, phone and desktop: the VOICE pane at 3 and at 5 core vowels with a bass type; the summary with one unstable reading; the summary with a far-off [ɨ]; INSIGHTS for a voice with 3 core vowels sung. Into `docs/sessions/report-code-lane67-pictures/`.
3. `vercel.json` names `cloud-lane-67` alone in both places (as lane 66's Step 6 did).
4. All eight gates; Playwright `voice-pane`, `voice-stations`, `voice-links`, `insights-links`, `calibrate-new` (desktop) and `voice-stations`, `insights-links` (phone). A seeded store that now falls below the threshold may change a test's expectation: change the expectation only where this brief's section 1 says the singer now sees that, and list each.

## 4. Owns and leaves

Owns: `voice/engine/sung.ts`, `resolve-values.ts`, `stand-ins.ts`, `divergence.ts`, `types.ts` (the new field and the comment at `:65-73`), `plausibility.ts` (the comment at `:315-323`), `voice/outside.ts`, `voice/OutsideNote.svelte`, `voice/chart/readings.ts`, `voice/chart/VowelSpaceSheet.svelte`, `voice/chart/finish-early.ts`, `voice/VowelCapture.svelte`, `components/Drawer/voice-pane.ts`, `components/Drawer/VoicePane.svelte`, `insights/InsightsPane.svelte` (within its ceiling), `markup/MarkupPane.svelte` (within its ceiling), `routes/+page.svelte` (one prop), `analysis/analyze-score-adapter.ts`, the summary in `voice/CalibrationWizard.svelte` (within its ceiling), `i18n.ts` (only the keys of section 6 and the three marked UNUSED), `analysis/__golden__/adapter-snapshots.json`, `tools/n200-score/`, `vercel.json`, their tests. Leaves: the extractor (`voice/engine/extract.ts`, `analyze.ts` except where Step 7 must keep `isDivergent`), `docs/memory/`, every brief, every ratified string other than the two retired keys.

## 5. Constraints

No pull request; push only `cloud-lane-67`; never `Shane` or `main`. Change nothing under `docs/memory/`, and do not edit, rename, or replace a brief. NOT ESTABLISHED beats a complete invented answer. Every report claim carries a file:line on your tip or a run.

## 6. Strings (RATIFIED by Dann 2026-11-18 10:49, English and French, all seven: *"I ratify them all"*. Build them exactly as written)

Terms: "core vowels" is Dann's (23:31, "the core six"); « voyelles de base » is the desk's, flagged. « capter », « valeurs par défaut », « voix type de », « reprise » are adopted from `i18n.ts:1422-1432` and `:1240`.

| Key | English | French |
|---|---|---|
| `calib.pane.coreGeneric` | You have recorded {n} of the 6 core vowels. Record {m} more, and Ilya builds your resonance profile. Until then, it uses generic values for a {voiceType} voice. | Vous avez capté {n} des 6 voyelles de base. Captez-en {m} de plus, et Ilya établit votre profil de résonances. D’ici là, il utilise des valeurs par défaut pour une voix type de {voiceType}. |
| `calib.pane.coreGenericOne` | You have recorded 4 of the 6 core vowels. Record one more, and Ilya builds your resonance profile. Until then, it uses generic values for a {voiceType} voice. | Vous avez capté 4 des 6 voyelles de base. Captez-en une de plus, et Ilya établit votre profil de résonances. D’ici là, il utilise des valeurs par défaut pour une voix type de {voiceType}. |
| `calib.pane.core` | You have recorded {n} of the 6 core vowels. Record {m} more, and Ilya builds your resonance profile. | Vous avez capté {n} des 6 voyelles de base. Captez-en {m} de plus, et Ilya établit votre profil de résonances. |
| `calib.pane.coreOne` | You have recorded 4 of the 6 core vowels. Record one more, and Ilya builds your resonance profile. | Vous avez capté 4 des 6 voyelles de base. Captez-en une de plus, et Ilya établit votre profil de résonances. |
| `calib.summary.unstable` | These readings were unstable: {vowels}. Another try may help. | Ces lectures étaient instables\u00a0: {vowels}. Une reprise pourrait aider. |
| `calib.summary.keepOne` | Keep it | Le garder |
| `calib.summary.useEstimate` | Use Ilya's estimate for now | Utiliser l’estimation d’Ilya pour l’instant |

French: U+00A0 before « : » (OQLF), written `\u00a0` as its neighbours are (`i18n.ts:1341`). « Le garder »: a vowel named alone is masculine (`CONTRACT.md` section 7). "Resonance profile" / « profil de résonances » and "{n} of the 6" match `i18n.ts:1421`, `:1425`, `:1429`. « Utiliser l’estimation d’Ilya pour l’instant » is built from `tempo.useEstimate` (`i18n.ts:1902`) and the ratified [ɨ] message.

## 7. Reports

One per step: `docs/sessions/report-code-lane67-step<N>_r1_2026-11-18.md`. Each says what was done, the tests, the counts, every comment corrected, and what could not be established.

## 8. Not in this lane

The extractor; the bands lane (`CORE_BANDS` against PVA2 Fig. 19.1); stored data migration (a stored reading keeps its fields; Step 5's retired mark is computed, not stored); any guard for odd or broken input beyond section 1.

## 9. What changed from r1, and why

Fable's review of r1 (`docs/sessions/review-fable-lane67-brief_r1_2026-11-18.md`). Blocker 1 (the ruling not in the tree): Dann's words quoted in section 1; `OPEN.md` and `CONTRACT.md` are committed before the lane is cut. Blocker 2 (unstable on stored data): `confidence === 'low'`, amendment 2. Blocker 3 (Step 4 could not run after Step 3, and its truths are the type templates): new order, Step 4's caveat in its report, no wait, amendments 4 and 5. Amendments 3, 6 to 14 applied in sections 2 and 3 and 4. Amendment 15: strings revised ("resonance profile", "6", U+00A0, a "Keep it" for the one-vowel [ɨ] note). The INSIGHTS sentence for a type with no generic values below five (amendment 8, last bullet): DESK DEFAULT, no new string; the VOICE pane explains.
