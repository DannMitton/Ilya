# Report: row 166, step 0 (read and report, nothing changed) (Code, cloud lane, r1, 2026-11-09)

Branch `cloud-lane-39`, cut from `origin/cloud-lane-38` at `69174bd` (tree clean when read). Brief committed first as `a572578`. Brief: `docs/sessions/brief-code-row166-generic-profiles_r2_2026-11-09.md`.

## Baselines (gates run by me on the branch, before any change)

| Gate | Command | Result at start |
| --- | --- | --- |
| 1 | `pnpm test:phonology` | pass, 14 files, 456 tests |
| 2 | `pnpm test:dictionary` | pass, 4 files, 248 tests |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | pass, 255 files, 4689 passed, 1 skipped |
| 5 | `pnpm --filter @ilya/score-parser test` | pass, 35 files, 785 passed, 5 skipped |
| 6 | `pnpm test:blurb` | pass, 4 files, 168 tests |
| 7 | `pnpm test:integration` | pass, 7 files, 125 tests |
| 8 | `pnpm ratchets` | OK, 697 files; the output says some ceilings can be lowered (not touched; ceilings are never raised) |

The Playwright projects are not run at step 0; the brief asks for them at the end of step 4, and the start-of-work red list for them is taken then (see "What Code could not establish").

## §3, line by line, on the lane's tip

| Brief's line | On `cloud-lane-38` | Verdict |
| --- | --- | --- |
| Stand-ins fill only when a vowel is sung, `analyze-score-adapter.ts:272-276` | The comment is `:267-270`; the guard and call are `:271-276` (`Object.values(fR1Source).includes('sung') ? fillStandIns(...) : undefined`) | Confirmed, range is `:267-276` |
| `fitResonance` with no sung vowel returns the template, step `'template'`, `stand-ins.ts:110` | `:110` exactly | Confirmed |
| `standInBucket`, `stand-ins.ts:63-70` | `:63-70` exactly | Confirmed |
| INSIGHTS gates on `measured`, `InsightsPane.svelte:200` on the lane | `:200` | Confirmed; the comment `:196-199` |
| `model` and `commentNotes` read `measured` | `:201-210` and `:217-224` | Confirmed |
| Withheld block `:353-366` | The `if (!model)` branch returning the withheld block is `:331-344` on the lane; `:353-366` on the lane is the `facts` and `keys` derivations | **Corrected**: the withheld block is `:331-344`. I cannot say why the brief's range differs; I did not read Shane. |
| Identity line, `identity.ts:28`, `measured` passed at `InsightsPane.svelte:276` | `identity.ts:28` is the `t(measured && date ? ...)` choice; the call is `:276` on the lane | Confirmed (`:276`) |
| `completenessOf` sets `formants: Object.keys(s.fR1).length > 0`, `:85` | `:85` | Confirmed; a generic profile therefore reads `formants: true` |
| `overlay-engine.ts:231` sets `placeholder` where `fR1Source` is `'surrogate'` | `:231` | Confirmed |
| `singer-blocks.ts:241-249`, `:325-336` | `onPlaceholder` is `:241-243`, `moment` `:244-250`; the turns row mark is `:325` | Confirmed |
| `gates.ts:319-322` | `apps/web/src/lib/analysis/gates.ts:319-322` | Confirmed |
| `key-suggest.ts:291` | `:291` (`counts = (v) => profile.fR1Source?.[v] !== 'surrogate'`) | Confirmed |
| `measuredVowels` reads sampled `formants`, `:238-244` | `:238-244` | Confirmed |
| MELODY draws with or without readings, `MarkupPane.svelte:974` | `:974` is the `{#if scorePages && scorePages.length > 0}` branch | Confirmed |
| No-score envelope line `:1108-1128`, `hasReadings` `:453` | `{#if hasReadings}` at `:1108`; `hasReadings` at `:453` reads `Object.keys(formants).length > 0` (the sampled map, not `adapted`) | Confirmed |

**One correction that matters to step 2, item 3.** The brief says "the existing `placeholder.line.markup.many` names all vowels, as ratified". It does not name all ten. `placeholderLine(placeholderVowels(analyzed), language, 'markup')` (`MarkupPane.svelte:740`, `placeholder-line.ts:24-28`) names the placeholder vowels the page's *events* use, in roster order. For a generic voice that is every vowel the score sings, which is "many" in practice, but not necessarily ten. No string or code change is implied; the line is right, the brief's description of it is loose.

`profileStore.ts`: the voice type is `StoredVoice.voiceType?: VoiceType` (`:99`), and `VoiceType = string` (`engine/types.ts:35`). It holds the Tier 1 id; `voiceTypeSpecific` and `voiceTypeOther` (`:107-108`) hold the finer label and the singer's own text. `VoiceTypeChoice` is the pick of the three (`:135`). `buildVoiceProfileSnapshot` takes only the Tier 1 string.

`voiceTypes.ts:19-29`: `TIER1` = soprano, mezzo-soprano, contralto, countertenor, tenor, baritone, bass-baritone, bass, not-sure. Confirmed.

How `standInBucket` treats the eight: soprano, tenor-mezzo (mezzo-soprano, contralto, tenor, countertenor), baritone, bass (bass, bass-baritone), middle (anything else). The brief's five eligible ids map to four buckets; contralto, countertenor, and bass-baritone are deliberately excluded here though they have buckets.

## Census: every reader of `completeness.formants`, `fR1`, `fR1Source`, or `standIns` outside the adapter

Method: `grep` over `apps/web/src` and `packages/score-parser/src`, tests excluded. `standIns` has **no reader** outside the adapter and its tests (nothing draws `retake` yet, as the adapter's own comment says). Nothing outside the adapter reads `AdaptedProfile.standIns`.

| Site | What it reads | What it does with an all-surrogate profile | Decision |
| --- | --- | --- | --- |
| `InsightsPane.svelte:200` `measured = completeness.formants` | gate for `model` (`:201`) and `commentNotes` (`:217`), and the identity line (`:276`) | Reads true. `model` and comments compute, as the brief intends. | Keep as the compute gate. Identity gets `!adapted.generic` (step 2). |
| `InsightsPane.svelte:276` `composeIdentityLine({measured})` | prints "calibrated {date}" when `measured && date` | Would print "calibrated {date}" over placeholders. `voiceUpdatedAt` is the voice's `updatedAt` when never calibrated (`+page.svelte:353`), so a date would print. | **Fix** (step 2, item 1). |
| `InsightsPane.svelte:288-293` `methodLine`, strings `insights.method.typed/untyped/silent` (`i18n.ts:1855-1857`) | `model` and `calibratedOn` | **Not on the brief's list.** With a model it prints "Method: computed from your calibration of {date} ...". For a generic profile that is false (there is no calibration; the date is the voice's `updatedAt`). With no `updatedAt` it prints "of ". The `silent` form ("no voice has been measured, so nothing on this page is computed from one") is the opposite lie once a generic model exists, but it is only chosen when `!model`, so it stays correct. | **New decision needed**, see "Decisions I will take" below. |
| `MarkupPane.svelte:838` `showWithheld = !completeness.formants` | feeds `NotesColumn` withheld (`:1029`, `:1045`, `:1049`) and `hasCommentaryPage` (`:887`) | Reads true, so the withheld notes column goes away for a generic voice. This is the intended MELODY behaviour: marks draw from placeholders. | Keep; no change. |
| `MarkupPane.svelte:811` `showBroadNote = hasAcousticMarks && isBroadAnalysis(completeness)`; `:853` `composeBroadNote` | `range`, `tessitura`, `passaggio` only | Unaffected by `formants`. A generic voice with no typed edges shows the broad note, which is correct (those three dimensions are still absent). | Keep; no change. |
| `MarkupPane.svelte:568` `analysedVowels` (feeds `statusLine` `:958`) | `adapted.snapshot.fR1` keys | Counts all ten for a generic voice. But `statusLine` is drawn only inside `{#if hasReadings}` (`:1108`), and `hasReadings` reads the *sampled* `formants`, so a generic voice (nothing sampled) never reaches it: it still shows `profile.emptyState`. With one vowel sung the count is already ten today (stand-ins). | Keep; the no-score envelope is out of scope and unchanged. |
| `MarkupPane.svelte:453` `hasReadings` | sampled `formants` | Unchanged by `generic`. | Keep. |
| `MarkupPane.svelte:740` `placeholderNote` | `placeholderVowels(analyzed)` | Names the vowels the page uses that carry a placeholder. For generic: all of them. | Keep. |
| `MarkupPane.svelte:408`, `:809`, `:886` | per-event `placeholder` | Crossing rings dashed, hollow heads, and gated lines flagged, for every event. | Keep; this is the existing row-69 mark. |
| `overlay-engine.ts:165` `profile.fR1[vowel]` | the forecast | A surrogate fR1 is a number; events are drawn and flagged. | Keep. |
| `overlay-engine.ts:231` | `fR1Source === 'surrogate'` → `placeholder: true` | Every event gets the mark. | Keep. |
| `overlay-engine.ts:276` | copies `p.fR1` | Copy. | n/a |
| `conditions.ts:368` `rung(fo, profile.fR1[vowel], FR1_RUNGS)` | fR1 per note | Uses the surrogate. Comments built on it carry the placeholder sentence via `onPlaceholder`. | Keep. |
| `modification-engine.ts:68-88` | `snapshot.fR1` for sourceVowel and all vowels | Uses surrogates as numbers. Only reached from the modification path. | Keep; reported. |
| `comments.ts:164` | `profile.fR1[n.vowel]` | As `conditions.ts`. | Keep. |
| `singer-page.ts:186`, `:199` `vowelTurns` | `profile.fR1[vowel]`; `placeholders.has(row.vowel)` marks rows (`singer-blocks.ts:325`) | Rows draw with the placeholder mark. | Keep. |
| `key-suggest.ts:291` | `fR1Source !== 'surrogate'` | `counts` is false for every vowel, so `rows` is empty, `time` 0, and `pastTurn` stays null: the key search counts **no** vowel past its turn for a generic voice. | Keep (rule 6 of the key search: "sung and derived vowels only"). Reported: for a generic voice the search has no vowel evidence to move the key on. |
| `gates.ts:319-322` | `placeholderAt(eventId)` | Appends the placeholder sentence to a gated line whose kind rests on fR1. | Keep. |
| `analysis-types.ts:69-71, :212` | types | n/a | n/a |

Other readers of `AdaptedProfile`: only `MarkupPane.svelte:553` and `InsightsPane.svelte:159` call `buildVoiceProfileSnapshot`. `MarkupPane` passes the Tier 1 string (`+page.svelte:4404`, `voiceTypeChoice?.voiceType`); INSIGHTS passes `voiceType?.voiceType` (`:159`).

## Decisions I will take (each reversible; stated so Dann can overrule)

1. **Method line.** The brief's census asks me to apply the same decision wherever `completeness.formants` reads true for a generic profile. The method line is that case, by another route (`model` non-null, so the calibration clause prints). Leaving it would print a false calibration date under a header that says "not calibrated". I will add two strings, `insights.method.generic.typed` and `insights.method.generic.untyped`, naming placeholder values and no date, and choose them when `adapted.generic`. These are **my words, not Dann's, and unratified**: they are flagged DESK DEFAULT in the code and in the step 2 report, and are NOT pinned in `ratified-lines.test.ts`. French is mine and wants Dann's eye.
2. **Eligibility.** The five Tier 1 ids exactly (`soprano`, `mezzo-soprano`, `tenor`, `baritone`, `bass`). A finer label (e.g. "lyric baritone") does not change eligibility: the Tier 1 id routes.

## What Code could not establish

- **Playwright baseline.** Not run yet; it is a step-4 item and I will take its start-of-work red list on `cloud-lane-38` before the final run, by running the projects on a clean checkout of the lane tip, so each red test can be called red-at-start or not.
- **The lane's tip may move.** `cloud-lane-38` is `69174bd` now. I will re-fetch and merge before the final report, as the brief says.
- **Whether the French in this step 0 is right.** None is written here.
