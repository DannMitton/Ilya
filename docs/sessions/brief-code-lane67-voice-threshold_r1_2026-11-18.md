# Brief to Code: lane 67, how Ilya meets a voice, and a break

r1, 2026-11-18 05:3x, written by the desk (Opus 5.5). Fable review owed before it is sent (`docs/memory/CONTRACT.md` section 1 item 19). For a cloud Code session on branch `cloud-lane-67`, cut from the tip of `Shane` (the desk names the commit; `f2b87049` at writing). No other lane is running.

Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `packages/`, `tools/`, `docs/`, or are `vercel.json`. The desk read the lines it cites at `Shane` `f2b87049`. Step 0 re-reads all of them on your tip.

## 1. What the singer gets

The design is Dann's, ruled 2026-11-17 23:21 to 23:38, `docs/memory/OPEN.md`, last section, "VOICE: HOW ILYA MEETS A VOICE, AND A BREAK" (read it in full first). In the singer's terms:

1. **Two paths, the singer's choice.** A voice type chosen with nothing recorded gives Ilya's generic values for that type, as today (`calib.pane.typedGeneric`, `i18n.ts:1422`). Recording gives the singer's own profile.
2. **The own profile needs five of the six core vowels** ([i], [e], [ɛ], [ɑ], [o], [u]). Below five, what is recorded is kept and shown in VOICE, and unlocks nothing personal: MELODY and INSIGHTS behave exactly as for a voice with nothing recorded (generic values if the type has them, otherwise the page that says nothing was measured). The VOICE pane says how many more core vowels are needed.
3. **At five or six, everything comes from the singer.** Sung values are used as sung. A missing sixth core vowel comes from one number, the singer's tract scale, applied to one fixed shape. The four hard vowels ([ɨ], [ɪ], [ʌ], [a]) are derived from the sung ones, as today, or used as sung.
4. **One calm flag, on the take's own steadiness.** The summary's note names the readings that were unstable (their own evidence, `reading === 'provisional'`), once, with Keep or Re-take. It no longer compares a reading with reference values for a voice type.
5. **The voice type's values never mix with the singer's own vowels.**
6. **The far-off [ɨ]** (ruled 2026-11-13 15:13, message ratified 15:29, `docs/memory/OPEN.md` the two bullets "THE [ɨ] DEMOTION IS SUPERSEDED" and "THE FAR-OFF [ɨ] MESSAGE, RATIFIED"): a sung [ɨ] far from where the singer's [i] and [u] place it gets the ratified message at the summary with a third choice, "Use Ilya's estimate for now".

Principle (Dann 23:21): prepare, then meet reality; say what happened and how to move forward; do not solve every calamity. Do not add guards for rare or deliberately broken input (`docs/memory/CONTRACT.md` section 5, the edge-case line).

## 2. Definitions this lane fixes (DESK DEFAULTS, each the desk's, Dann's to strike)

- **Core count**: the number of the six core vowels whose reading `isSung` (`voice/engine/sung.ts:13`). An unstable (provisional) reading counts; the flag invites a re-take. A reading the singer set aside with "Use Ilya's estimate for now" is [ɨ] only and does not affect the count.
- **Personal**: core count 5 or 6. One exported function, `isPersonal(formants)`, in `voice/engine/sung.ts`, used by every site.
- **Tract scale**: k = the geometric mean, over every sung core vowel and both resonances where sung (fR1 always, fR2 where `resolve-values.ts:140` would take it), of sung value over shape value. A missing core vowel's fR1 and fR2 are the shape's times k. **The shape is the `middle` template whatever the declared type** (`stand-ins.ts`, `template('middle')`), so the voice type plays no part above the threshold. Step 4 measures this choice against the declared type's template and against today's fit; Step 4's report decides nothing, the desk does.
- **Unstable**: `reading === 'provisional'` on a stored reading, and not kept (`plausibilityOverride !== true`; the field keeps its name, it now means "kept").

## 3. Steps

Each step is its own commit and report section, test first where a test applies, then pushed. Step 0 runs all eight gates as the baseline; after each later step run the tests of the files changed; all eight gates and the named Playwright suites run once at the end. Gate 4 baseline at `f2b87049`: 6613 passed, 1 skipped (6614) with Python, numpy, and scipy.

A standing line for every step: correct each comment your change makes false, in the same commit, and list them in the report. Ceilings: `voice/CalibrationWizard.svelte` 1122 of 1126; `insights/InsightsPane.svelte` 742 of 744; `apps/web/src/routes/+page.svelte` 5531 of 5534 (Fable's as-built review of lane 66, check 3). If a step needs lines in one of them, move code out to a module first, in its own commit. No edit enters the body of `withPlausibility` in the wizard (`voice/plausibility-keeps-status.test.ts`).

### Step 0. Read and report. Change nothing.

1. All eight gates; record the counts.
2. A census, with file:line, of every reader of: `anySung`, `generic`, `standIns`, `retake` (the stand-in report's), `fitWithoutOutliers`, `fitResonance`, `OFF_SHAPE_SEMITONES`, `outsideVowels`, `outsideNote`, `judgeUnchecked`, `plausibility` (the verdict), `plausibilityOverride`, `usableReadingCount`, `hasAnyReadings`, `restsOnSamples`, `paneState`, `finishEarlyState`, `applyIghDivergence`, `isDivergent`, `calib.summary.outside*`. For each, say what it decides for the singer.
3. Every place a singer can see a different thing for a voice with 1 to 4 core vowels sung than for the same voice with none sung (MELODY, INSIGHTS, the VOICE pane, the closed Voice band's line, the chart, the summary, exported files). This is the list Step 2 changes.

### Step 1. The six fixes of lane 66's as-built review

`docs/sessions/review-fable-lane66-as-built_r1_2026-11-17.md`, section Fixes, 1 to 6, as written there (the duplicate `isSung` at `voice/chart/readings.ts:51`, and the optional one in `VowelCapture.svelte:108`; four comments; one sentence of `docs/sessions/n200-lane66-step4-measure_2026-11-17.md:40`). Fix 6 is a correction to a measure report: append a dated line under the sentence rather than rewriting it.

### Step 2. The threshold

1. `isPersonal` in `voice/engine/sung.ts`, with tests: 0 to 4 core sung false, 5 and 6 true; hard vowels and unstable readings as section 2 says.
2. `resolveVowelValues` (`voice/engine/resolve-values.ts:96`): when not personal, it resolves exactly as for a voice with nothing sung (`anySung` false, `generic` from `hasPlaceholderProfile`, `resolve-values.ts:197-200`). The stored readings are untouched and still returned in `formants` for the VOICE pane and the chart's dots.
3. Every site of Step 0's list 3 follows: below five, MELODY and INSIGHTS say what they say today for a voice with nothing sung (the ratified generic wordings, `insights.generic.lede` `i18n.ts:1877`, `insights.method.generic.*` `:1879-1880`, `insights.method.noScore.generic` `:1887`, `analysis.broad.body.generic` `:1075`, `placeholder.comment.generic` `:2052`). The chart still draws the singer's own dots.
4. Test: a golden voice with 4 core sung gives byte for byte the adapter snapshot of the same voice with none sung (same type); with 5 it does not.

### Step 3. The sixth core vowel from the tract scale

1. Replace the fit for a personal voice: no spread, no outlier removal, no `retake` list from the fit. A missing core vowel takes shape times k (section 2). Remove what then has no reader (`fitWithoutOutliers`, the spread, `OFF_SHAPE_SEMITONES`, `StandInReport.retake`), with their tests, or say why one stays.
2. A voice that is not personal never reaches this code (Step 2), and a generic voice keeps the declared type's template whole, as today (`resolve-values.ts:197-200`; row 166).
3. The four derived vowels keep `deriveFrom` (`derivations.ts`); an anchor that is a scaled core vowel makes a value whose source stays `'surrogate'`, as today (`stand-ins.ts`, the derived loop).
4. Update `adapter-snapshots.json` by its own script and report every entry that moved, by key, with the reason.

### Step 4. Measure. A runner and a report; nothing in the product changes in this step

Extend `tools/n200-score/lane66-core.ts` (or a sibling `lane67-core.ts`) on the 600 primary synthetic takes (`__golden__/path-600.json`): for each synthetic voice and each of the six ways to leave one core vowel out, estimate it three ways (shape `middle` times k; the declared type's template times k; today's fit at `f2b87049`) and report the error against the synthetic truth in semitones, fR1 and fR2, median and 90th percentile, by voice type and by vowel. Also for one odd [i] (1063 Hz, as `analysis/adapter-grid.ts:29`) among five core vowels: how far each method moves the estimate of the missing one. Report to `docs/sessions/n200-lane67-step4-measure_2026-11-18.md`. Then stop and push; the desk reads it and may change section 2's shape before you go on. If nothing is heard within 30 minutes of the push, go on with the `middle` shape.

### Step 5. One calm flag on the take's own steadiness

1. `voice/outside.ts`: `outsideVowels` becomes the list of unstable readings (section 2) among the vowels shown. `outsideNote` picks the new key (section 6). The "Beyond Ilya's reference values" mark (`voice/chart/readings.ts:132`, the `beyond` field) is retired, with its legend entry and string if any (list them).
2. Keep (`plausibility.ts:325`, `keepReading`) still marks the reading kept and quiets the note; it changes no number and no `reading` field. Re-take works as today.
3. `judgeUnchecked` and the stored verdict: if nothing singer-facing reads the verdict after this step, remove `judgeUnchecked` and its call (`CalibrationWizard.svelte:331`); the wizard may keep storing the verdict (no edit inside `withPlausibility`). Say which.
4. `calib.summary.outside` and `calib.summary.outsideNoType` retire (keys removed, key count line updated).

### Step 6. The VOICE pane below the threshold

`components/Drawer/voice-pane.ts`: `paneState` (`:28-35`) gains a state for 1 to 4 core vowels sung, before `some-fills` and `some-works-out`, and `paneSentence` prints the section 6 strings with {n} the core count, {m} = 5 minus {n}, and {voiceType} as `typedGeneric` fills it (`:54-57`). With 5 or more core vowels the existing states apply unchanged. Tests for each count 0 to 6, with and without a type that has generic values. The door names (`recordDoorKey`, `:62-64`) are unchanged.

### Step 7. The far-off [ɨ] choice

As N.200 brief r3 Step 5.10 specifies (`docs/sessions/brief-code-n200-voice-as-it-is_r3_2026-11-14.md:97`), with this lane's changes: the trigger is `applyIghDivergence`'s description (`voice/engine/divergence.ts:16-24`, `isDivergent === true`), carried to the summary (it is deleted today in `withIghPass`, lane 66 review; find where and keep it on the judged copy, not in storage, or say why storage). The summary shows `calib.summary.outsideIgh` (`i18n.ts:1345`, ratified, unchanged) with three buttons: Keep them, Re-take, and the new button (section 6). The new choice stores a mark on the [ɨ] reading (DESK DEFAULT name `useEstimate: true`), and `isSung` treats a marked [ɨ] as not sung for resolution only, so `deriveFrom` gives [ɨ] again; the reading stays stored and in the take record. A fresh take of [ɨ] clears the mark. Tests for each.

### Step 8. Strings, pictures, the recorder build, the end gates

1. Add the section 6 keys exactly as written there. Update the key count line in `i18n.ts`.
2. Pictures, English and French, phone and desktop: the VOICE pane at 3 and at 5 core vowels with a bass type; the summary with one unstable reading; the summary with a far-off [ɨ]; INSIGHTS for a voice with 3 core vowels sung. Into `docs/sessions/report-code-lane67-pictures/`.
3. `vercel.json` names `cloud-lane-67` alone in both places (as lane 66's Step 6 did).
4. All eight gates; Playwright `voice-pane`, `voice-stations`, `voice-links`, `insights-links`, `calibrate-new` (desktop) and `voice-stations`, `insights-links` (phone). A seeded store that now falls below the threshold may change a test's expectation: change the expectation only where this brief's section 1 says the singer now sees that, and list each.

## 4. Owns and leaves

Owns: `voice/engine/sung.ts`, `resolve-values.ts`, `stand-ins.ts`, `divergence.ts`, `voice/outside.ts`, `voice/OutsideNote.svelte`, `voice/chart/readings.ts`, `components/Drawer/voice-pane.ts`, the summary in `voice/CalibrationWizard.svelte` (within its ceiling), `i18n.ts` (only the keys of section 6 and the two retired), `analysis/__golden__/adapter-snapshots.json`, `tools/n200-score/`, `vercel.json`, their tests. Leaves: the extractor (`voice/engine/extract.ts`, `analyze.ts` except where Step 7 must keep `isDivergent`), `docs/memory/`, every brief, every ratified string other than the two retired keys.

## 5. Constraints

No pull request; push only `cloud-lane-67`; never `Shane` or `main`. Change nothing under `docs/memory/`, and do not edit, rename, or replace a brief. NOT ESTABLISHED beats a complete invented answer. Every report claim carries a file:line on your tip or a run.

## 6. Strings (DRAFTS, the desk's, for Dann's ratification before this lane is sent; the brief is updated with his words)

Terms: "core vowels" is Dann's (23:31, "the core six"); « voyelles de base » is the desk's, flagged. « capter », « valeurs par défaut », « voix type de », « reprise » are adopted from `i18n.ts:1422-1432` and `:1240`.

| Key | English | French |
|---|---|---|
| `calib.pane.coreGeneric` | You have recorded {n} of the six core vowels. Record {m} more, and Ilya builds your own profile. Until then, it uses generic values for a {voiceType} voice. | Vous avez capté {n} des six voyelles de base. Captez-en {m} de plus, et Ilya établit votre propre profil. D’ici là, il utilise des valeurs par défaut pour une voix type de {voiceType}. |
| `calib.pane.coreGenericOne` | You have recorded 4 of the six core vowels. Record one more, and Ilya builds your own profile. Until then, it uses generic values for a {voiceType} voice. | Vous avez capté 4 des six voyelles de base. Captez-en une de plus, et Ilya établit votre propre profil. D’ici là, il utilise des valeurs par défaut pour une voix type de {voiceType}. |
| `calib.pane.core` | You have recorded {n} of the six core vowels. Record {m} more, and Ilya builds your own profile. | Vous avez capté {n} des six voyelles de base. Captez-en {m} de plus, et Ilya établit votre propre profil. |
| `calib.pane.coreOne` | You have recorded 4 of the six core vowels. Record one more, and Ilya builds your own profile. | Vous avez capté 4 des six voyelles de base. Captez-en une de plus, et Ilya établit votre propre profil. |
| `calib.summary.unstable` | These readings were unstable: {vowels}. Another try may help. | Ces lectures étaient instables : {vowels}. Une reprise pourrait aider. |
| `calib.summary.useEstimate` | Use Ilya's estimate for now | Utiliser l’estimation d’Ilya pour l’instant |

French: no-break space before « : » (OQLF). « Utiliser l’estimation d’Ilya pour l’instant » is built from `tempo.useEstimate` (`i18n.ts:1902`) and the ratified [ɨ] message.

## 7. Reports

One per step: `docs/sessions/report-code-lane67-step<N>_r1_2026-11-18.md`. Each says what was done, the tests, the counts, every comment corrected, and what could not be established.

## 8. Not in this lane

The extractor; the bands lane (`CORE_BANDS` against PVA2 Fig. 19.1); stored data migration (a stored reading keeps its fields; Step 5's retired mark is computed, not stored); any guard for odd or broken input beyond section 1.
