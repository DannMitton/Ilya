# Brief: row 166, INSIGHTS and MELODY from a declared voice type alone, every value a stand-in (Code, cloud lane, r1, 2026-11-09)

Written by the desk (Opus) 2026-11-09. NOT Fable-reviewed; it goes to Fable with the B0 brief (`brief-code-row181-b0-vowel-boxes-and-skipped-notes_r1_2026-11-09.md`) and the row 182 brief in one session (`CONTRACT.md` §4; §1 item 19). Every code line below was read by the desk on `Shane` at `4d73284b` this session. NOT ESTABLISHED beats a complete invented answer.

## 1. What the singer gets

A colleague drops a score, names her voice type in VOICE (soprano; mezzo-soprano or tenor; baritone; bass), and does not calibrate. Today INSIGHTS then says "No voice has been measured, so this page does not compare this piece with your voice" and withholds every finding (seen by the desk 2026-11-09 14:3x on `ilya-acmkbyrnq-dannmittons-projects.vercel.app`, a first visit with no stored data, song 1). After this build she gets INSIGHTS and MELODY's vowel marks computed from that voice type's generic values. Every one of them is marked as a stand-in. The page says plainly that these are not her voice, and it invites her to sing. Nothing presents a generic profile as finished. With no voice type declared, or "Not sure", nothing changes: the withheld page stays.

## 2. The ruling

QUEUE row 166, RATIFIED by Dann 2026-10-31 13:19 to 13:21: four curated generic profiles (Soprano; Mezzo-soprano or tenor; Baritone; Bass), built from Ilya's existing Bozeman stand-ins (`apps/web/src/lib/voice/engine/stand-ins.ts`); every value marked as a stand-in; every generic view invites the singer to sing; nothing presents a generic profile as finished. Bespoke values are the priority; generic values are offered reluctantly, for exploration and demonstration. Row 167 (seven types, each from its own published values) is NOT this brief.

Rulings it departs from, each a stated default: the DESK DEFAULT at `apps/web/src/lib/analysis/analyze-score-adapter.ts:266-276` ("Only once a vowel is sung: a voice with no reading keeps the page that says nothing was measured"), which row 166 replaces for a declared type; and the comment at `apps/web/src/lib/insights/InsightsPane.svelte:192-196` (the page prints no number without a measured voice, "brief §7"), which now holds only where no voice type is declared.

## 3. Where it lives today

- Stand-ins are filled only when at least one vowel is sung: `standIns = Object.values(fR1Source).includes('sung') ? fillStandIns(...) : undefined` (`analyze-score-adapter.ts:272-276`).
- `fitResonance` with no sung vowel returns the template unchanged, step `'template'` (`stand-ins.ts:110`, `if (used.length === 0) return { predict: { ...tmpl }, step: 'template', used }`); `standInBucket` maps the declared type to one of the four staves, and anything else to `'middle'` (`stand-ins.ts:63-70`).
- INSIGHTS gates every finding on `measured = adapted.completeness.formants` (`InsightsPane.svelte:197`), feeding `model` (`:198-207`) and `commentNotes` (`:214-221`); with no model the withheld block is drawn (`:353-366`).
- MELODY draws the score with or without readings (`MarkupPane.svelte:974`); the vowels it rests on that were never sung are named under the title and drawn hollow or dashed (`placeholderLine`, `MarkupPane.svelte:740`).

## 4. The build

Lane: a new branch `cloud-lane-39` from `origin/Shane` after the integration branch `cloud-lane-38` is merged (the desk gives the tip in the prompt). One commit and one report per step, at `docs/sessions/report-code-row166-step<n>_r1_2026-11-09.md`. Do not edit `docs/memory/`.

### Step 0. Read and report, change nothing

Read in full `analyze-score-adapter.ts`, `stand-ins.ts`, `InsightsPane.svelte`, `MarkupPane.svelte`'s placeholder and withheld paths, `insights/identity.ts`, and `voice/profileStore.ts`'s voice type. Confirm or correct each line in section 3. Name every other site that reads `completeness.formants`, `fR1Source`, or `standIns` and say what each does with an all-stand-in profile (`CONTRACT.md` §4, the "every other site" line). Report the eight gates' baselines from the prompt.

### Step 1. The generic profile

In `buildVoiceProfileSnapshot`, where no vowel is sung and the declared voice type maps to `soprano`, `tenor-mezzo`, `baritone`, or `bass` (not `middle`), fill every vowel from the template, flagged `'surrogate'`, as `fillStandIns` does with zero sung vowels, and mark the result `generic: true` on `AdaptedProfile`. Nothing is written to the stored profile (the rule at `analyze-score-adapter.ts:236-240`). Range, tessitura, and passaggio stay whatever the singer typed; no generic value is supplied for them (DESK DEFAULT: Bozeman gives resonances only, and row 167 is where sourced ranges belong). Tests: each of the four types yields the template values, all `'surrogate'`; `middle` and no type yield today's empty profile; one sung vowel yields today's fit, not `generic`.

### Step 2. INSIGHTS and MELODY say so

1. With `generic: true`, INSIGHTS computes as for a measured voice. Its identity line names the generic profile (string A). Above the first finding, one line says these findings rest on generic values for the declared type and invites her to sing (string B, with a link that opens calibration, as `onrange`'s "Add your range" does, `InsightsPane.svelte:110`).
2. MELODY's placeholder line, with `generic: true`, is one line (string C) instead of a list of every vowel.
3. Every comment that names a resonance carries the stand-in mark already used for a surrogate value; read how `measuredVowels` (`InsightsPane.svelte:235-243`) feeds `renderComments` and keep a surrogate vowel out of `measuredVowels`.
4. Treble comments stay hidden as today (`InsightsPane.svelte:210-213`); say in the report how much a generic soprano sees.

### Step 3. Strings, as desk drafts for Dann's ratification

Seat them behind a test that fails until each matches Dann's ratified text; the desk sends the ratified wording. Drafts (EN; FR follows from the desk):
- A: "INSIGHTS for a generic {voiceType} · not your voice"
- B: "These findings use generic values for a {voiceType}, not your own voice. Sing your vowels to make them yours."
- C: "Every vowel here uses generic values for a {voiceType}, drawn hollow or dashed until you sing it."

### Step 4. Gates and report

All eight gates and both Playwright projects; a picture of INSIGHTS and MELODY for a generic baritone and a generic soprano on song 1, from a first visit with no stored data.

## 5. Done when

Steps 0 to 4 pushed; the strings ratified by Dann and seated; the desk's walk on a first visit, as in section 1, shows the generic page for a declared type and today's withheld page for none; Fable as built; Dann's ship.

## 6. Out of scope

Row 167's seven types; any change to calibration; a generic range, tessitura, or passaggio; treble comments.

## 7. What Code could not establish

The report carries a section of this name. NOT ESTABLISHED beats a complete invented answer.
