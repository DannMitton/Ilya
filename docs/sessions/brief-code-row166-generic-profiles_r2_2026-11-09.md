# Brief: row 166, INSIGHTS and MELODY from a declared voice type alone, every value a placeholder (Code, cloud lane, r2, 2026-11-09)

Written by the desk (Opus) 2026-11-09. r2 applies all nine amendments of Fable's review (`docs/sessions/review-fable-three-briefs_r1_2026-11-09.md`, "Brief 2") and Dann's ratified line (16:13). Code facts were read on `Shane` at `4d73284b`; on the landing lane `InsightsPane.svelte` reads +3 from `:196` on, and step 0 re-confirms every line on the lane's tip. NOT ESTABLISHED beats a complete invented answer.

## 1. What the singer gets

A colleague drops a score, names her voice type in VOICE as soprano, mezzo-soprano, tenor, baritone, or bass, and does not calibrate. Today INSIGHTS says "No voice has been measured, so this page does not compare this piece with your voice" and withholds every finding. After this build she gets INSIGHTS and MELODY's vowel marks computed from that voice type's placeholder values. The header says "not calibrated", one line says the findings are not her voice and tells her how to sample, and every number that rests on a placeholder is marked as it is today. With contralto, countertenor, bass-baritone, "Not sure", or no type, nothing changes: the withheld page stays.

## 2. The ruling

QUEUE row 166, RATIFIED by Dann 2026-10-31 13:19 to 13:21: four curated generic profiles (Soprano; Mezzo-soprano or tenor; Baritone; Bass) from Ilya's Bozeman stand-ins (`apps/web/src/lib/voice/engine/stand-ins.ts`); every value marked; every generic view invites the singer to sing; nothing presents a generic profile as finished. Row 167 is NOT this brief.

The singer's word for these values is "placeholder" (French « valeur par défaut »). "Generic" stays an internal word only.

Departs from, each a stated default: the DESK DEFAULT at `analyze-score-adapter.ts:266-276` (a voice with no reading keeps the withheld page), replaced for the five types in §1; and the comment at `InsightsPane.svelte:192-196`, which now holds only where no eligible type is declared.

## 3. Where it lives today (Shane lines; step 0 re-reads on the lane)

- Stand-ins fill only when a vowel is sung: `analyze-score-adapter.ts:272-276`.
- `fitResonance` with no sung vowel returns the template, step `'template'` (`stand-ins.ts:110`); `standInBucket` (`stand-ins.ts:63-70`).
- INSIGHTS gates on `measured = adapted.completeness.formants` (`InsightsPane.svelte:197`; `:200` on the lane), feeding `model` and `commentNotes`; withheld block `:353-366`.
- The identity line: `composeIdentityLine` picks `insights.identity` ("… · calibrated {date}") whenever `measured && date` (`insights/identity.ts:28`), with `measured` passed at `InsightsPane.svelte:276`. A generic profile makes `completeness.formants` true (`completenessOf`, `analyze-score-adapter.ts:85`), so without a fix it would print "calibrated".
- Placeholder marks already built (row 69): `overlay-engine.ts:231` sets `placeholder` where `fR1Source` is `'surrogate'`; `singer-blocks.ts:241-249` appends the ratified placeholder sentence; `gates.ts:319-322`; `singer-blocks.ts:325-336`; `key-suggest.ts:291`. `measuredVowels` reads the sampled `formants` (`InsightsPane.svelte:238-244`).
- MELODY draws the score with or without readings (`MarkupPane.svelte:974`); the no-score envelope's line (`:1108-1128`) reads sampled `formants` (`hasReadings`, `:453`).

## 4. The build

One commit and one report per step, at `docs/sessions/report-code-row166-step<n>_r1_2026-11-09.md`.

### Step 0. Read and report, change nothing

Read in full `analyze-score-adapter.ts`, `stand-ins.ts`, `InsightsPane.svelte`, `insights/identity.ts`, `voice/profileStore.ts`'s voice type, `voiceTypes.ts`, and `MarkupPane.svelte`'s placeholder and envelope paths. Confirm or correct each line in §3 on the lane's tip. Census (`CONTRACT.md` §4, "every other site"): every reader of `completeness.formants`, `fR1`, `fR1Source`, or `standIns` outside the adapter, and what each does with an all-surrogate profile. Starting list: `InsightsPane.svelte:200`, `MarkupPane.svelte:838`, `overlay-engine.ts:165`, `:231`, `key-suggest.ts:291`, `singer-page.ts:200`, `MarkupPane.svelte:568` (feeds `statusLine` at `:958`), `gates.ts:319`.

### Step 1. The placeholder profile

In `buildVoiceProfileSnapshot`, where no vowel is sung and the declared type is one of the Tier 1 ids `soprano`, `mezzo-soprano`, `tenor`, `baritone`, `bass` (`voiceTypes.ts:19-29`), fill every vowel from the template flagged `'surrogate'`, as `fillStandIns` does with zero sung vowels. `contralto`, `countertenor`, `bass-baritone`, `not-sure`, and none keep today's empty profile; the comment says row 167 lifts this (DESK DEFAULT). Mark the snapshot `generic: true` on `AdaptedProfile`; its comment says it is a view of `standIns`, computed per snapshot and never stored (`analyze-score-adapter.ts:236-240`; `CONTRACT.md` §8). Range, tessitura, and passaggio stay as typed. Tests: each of the five ids yields the template, all `'surrogate'`, `generic: true`; the other three ids and none yield today's empty profile; one sung vowel yields today's fit, `generic` false.

### Step 2. INSIGHTS and MELODY say so

1. With `generic: true`, INSIGHTS computes as for a measured voice. The identity line receives a sung-based flag (`!adapted.generic`), not `completeness.formants`, so a generic profile prints the existing `insights.identityUncalibrated` (`i18n.ts:1788`). Test: a generic baritone prints the uncalibrated form, never "calibrated". Apply the same decision to every other census site where `completeness.formants` now reads true for a generic profile, and list each.
2. Above the first finding, one line: the new string `insights.generic.lede` (step 3), shown only when `generic: true`.
3. MELODY: no new string. With `generic: true` the existing `placeholder.line.markup.many` names all vowels, as ratified. The envelope page with no score is unchanged.
4. Check, do not build: confirm that every comment naming a resonance carries the placeholder mark (`singer-blocks.ts:241-249`, keyed on `placeholderVowels(analyzed)`, `InsightsPane.svelte:185`, `:376`) and that a surrogate vowel stays outside `measuredVowels`. Report the lines.
5. Treble comments stay hidden as today (`InsightsPane.svelte:210-213`). For a generic soprano with no typed passaggio, report the `isTreble` value (`comments.ts:112-115`) and the count of comments computed and hidden.

### Step 3. The string

Seat exactly, behind a pin in the ratified-lines test (typographic apostrophe U+2019):

`insights.generic.lede`
- EN (Dann, 2026-11-09 16:13): These findings use placeholder values for a {voiceType}, not your specific voice. You can offer samples of your own vowels in vocal fry using Calibrate in the Voice section of the Drawer.
- FR (Dann, 2026-11-09 16:13): Ces constats reposent sur des valeurs par défaut pour le type {voiceType}, et non sur votre voix en particulier. Vous pouvez fournir des échantillons de vos propres voyelles en friture vocale à l’aide de Calibrer, dans la section Voix du Tiroir.

`{voiceType}` takes the type's label as the identity line already renders it, lower-cased in English if capitalized there; report what each of the five prints in both languages.

### Step 4. Gates and report

All eight gates and both Playwright projects. A screenshot of INSIGHTS and MELODY for a generic baritone and a generic soprano on song 1, from a first visit with no stored data, and one for a declared contralto showing the withheld page.

## 5. Out of scope

Row 167's types; any change to calibration; a generic range, tessitura, or passaggio; treble comments; the no-score envelope line.

## 6. What Code could not establish

Every report carries a section of this name. NOT ESTABLISHED beats a complete invented answer.
