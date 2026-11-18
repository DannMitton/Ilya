# Review: lane 68 as built (`cloud-lane-68`, `7efa7fcd`), r1, 2026-11-18

Reviewer: Fable 5.2. Read at `/home/claude/rev68` (`7efa7fcd`) against `origin/Shane` `737228cb`. Nothing changed, no test run (no `node_modules`); every finding is from reading, from the diff, and from the pictures. Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `tools/`, `docs/`, `scripts/`, or are `vercel.json`.

## Verdict

MERGE WITH FIXES. The ruling is built as written at every value site, and section 7 is honoured. One fix: MELODY's page with no score, which this lane switches back on for a voice under five, says "ten vowels measured" to a singer who sampled one.

## Blockers

None.

## Fixes

1. `markup/MarkupPane.svelte:568`. `analysedVowels` counts every vowel with an fR1 in the snapshot, placeholders included. Since `hasReadings` is now "any sampled vowel" (`:450`), a voice with one vowel sampled reads, on MELODY with no score, "Your profile is now set with ten vowels measured." (`:949`, `:1103`; `markup/profile-status.ts:29-36`; `i18n.ts:1502`). The singer is told to stop where the pane tells them to go on. Change the filter to `adapted.snapshot.fR1Source[g] === 'sung'`. Same line count (the file is at 1353 of 1353). The line is older than the lane (unchanged from `737228cb`); lane 67 hid it under five and lane 68 shows it again at one to four. No string changes.
2. `i18n.ts:1351-1354`, comment order only. The comment "the far-off [ɨ]'s two buttons" (`:1351`) now sits above `calib.summary.unstableOne` (`:1353`), not above `calib.summary.keepOne` (`:1354`). Move `:1352-1353` above `:1351`.

## The eight checks

1. **Every sampled vowel used as sampled, at any count.** Resolver: `voice/engine/resolve-values.ts:56` (no emptying), fR1 loop `:78-83`, fR2 loop `:94-99`. Chart: `voice/chart/zones.ts:91` reads the same resolver, sung dots by `isSung` (`:121`, `:134`). INSIGHTS: `insights/InsightsPane.svelte:242-247`. MELODY with a score: `analysis/analyze-score-adapter.ts:129`, the one adapter call. MELODY with no score: `markup/MarkupPane.svelte:450`. No other caller of the resolver exists (`voice/chart/finish-early.ts:36` is the third). Sound.
2. **Below five, nothing scaled, no mixed hard vowel.** `voice/engine/stand-ins.ts:144` (k is NaN unless personal), `:153`, `:158` (times 1), `:168` (template anchors alone), `:171` (`'surrogate'`); the resolver's derived loop runs only when personal (`resolve-values.ts:130`). Tests: `voice/engine/resolve-values.test.ts:88`, `voice/engine/stand-ins.test.ts:189`. In the golden, `bass | i,u` holds [ɨ] 424.7 and 1101.3, the same as with nothing sampled. At five: the personal branch is lane 67's code path, and every set at five or more is unmoved in the golden.
3. **"Stable", one function.** `voice/engine/sung.ts:26-30` (`stableCore`: sampled, and confidence not low or kept); `coreCount` `:33`, `isPersonal` `:41`. Pane: `routes/+page.svelte:4187`, `components/Drawer/voice-pane.ts:38`. Line: `analysis/placeholder-line.ts:73-74`. Resolver: `resolve-values.ts:57`. The unstable note states the complement in its own words (`voice/outside.ts:25`); the two agree for every sampled core vowel.
4. **The lines.** Swap inside `placeholderLine` (`analysis/placeholder-line.ts:66-78`), both call sites in place (`InsightsPane.svelte:515`, `MarkupPane.svelte:740`). Pane tests below-five before ten (`voice-pane.ts:38`, `:39`; test `voice-pane.test.ts:92-93`). One-vowel note and "Keep it": `voice/outside.ts:55-56`, `voice/OutsideNote.svelte:31`, `:41`.
5. **Lane 67's five fixes.** Fix 1 `MarkupPane.svelte:448`, import `:64` `{ isSung }`. Fix 2 `voice/outside.ts:37-39`, test `voice/outside-igh.test.ts:36`. Fix 3 `voice/CalibrationWizard.svelte:862`. Fix 4 `resolve-values.ts:5`, `:145-146`, `voice/chart/zones.ts:20`, `:64` (no "fitted" left in either file). Fix 5: the dated line is in `docs/sessions/report-code-lane67-step8_r1_2026-11-18.md`, section 5. All in.
6. **The golden.** 144 keys at base and tip, same key set; 84 differ. They are exactly seven sets times twelve types: `i`, `i,u`, `i,e,ɑ`, `e,ɛ,ɑ,o`, `bad i (1063), no override`, `no fR2 on [e]`, `provisional [u], [ɨ] sung` (`analysis/adapter-grid.ts:21-33`; the last has one stable core vowel). Unmoved: `none`, `six`, `all ten`, `bad i kept, six`, `verdict stored`, twelve each. Computed this session from the two files.
7. **Ceilings and leaves.** 1124, 1353, 742, 5532 lines against `scripts/ratchets.json:14`, `:16`, `:18`, `:8`. The diff touches nothing under `docs/memory/`, `scripts/`, `apps/web/e2e/`, `apps/web/e2e-phone/`, and no brief. `vercel.json:3` and `:47` name `cloud-lane-68`; no other lane branch is named.
8. **Strings.** The seven keys (`i18n.ts:1353`, `:1443-1444`, `:2060-2061`, `:2067-2068`) match section 5 character for character, with one difference: U+00A0 before each French colon where the brief shows a plain space, the file's habit (`i18n.ts:1350`). Not a fix. With {n} 0 the list and its parentheses drop in every line (`placeholder-line.ts:56`).

## The 11 pictures the lane did not look at

All looked at this session. Each shows the ratified line, whole and unclipped: pane 3core desk-fr and phone-en; INSIGHTS 3core desk-fr and phone-fr; INSIGHTS 1core desk-fr and phone-en; MELODY 3core desk-en and phone-fr; unstable one desk-fr and phone-en ("Keep it", « Le garder »); unstable two desk-fr, phone-en, phone-fr ("Keep them", « Les garder »). The summary chart draws the unsampled vowels as dashed dots at the bass template values (ɨ 425 and 1101, ɪ 454 and 1600), which agrees with check 2. No clef card over a line, no overlap.

## For Dann's eye

1. **A sampled vowel that is unstable is left out of "You have sampled {n}".** With [i] unstable and [e], [u] stable, the summary names [i] as a reading, and INSIGHTS, MELODY, and the pane say "sampled 2 so far ([e] and [u])". With all six sampled and two unstable, the line says "Until you provide 1 more", when the way forward is Re-take or Keep on the two it does not name. Keep makes the count right at once. The strings are yours; this is what they print (`sung.ts:26-30`, `placeholder-line.ts:53-57`).
2. **One unstable re-take un-completes a complete profile.** A singer at five stable who re-takes one and gets an unstable take drops to four: every placeholder returns to the voice type's values, and the hard vowels stop following the singer's own, until Keep or a better take. This follows from "stable"; it is a visible jump.
3. **A voice with one vowel sampled reads as calibrated.** INSIGHTS prints "CALIBRATED 2026-11-01" (pictured, `insights-1core-phone-en.png`), and MELODY's footnote says the forecast reflects "vos résonances mesurées" (`melody-3core-phone-fr.png`). Amendment 10 intended this. MELODY with no score also says "Your profile is now set" (`i18n.ts:1500-1502`), brief Step 1.6; Fix 1 corrects only its count.
4. **Contralto, countertenor, bass-baritone, "Not sure", and no type now get findings from the first sample**, with nine vowels from a neighbouring type's placeholders (`stand-ins.ts:147`). Before, these voices saw a page that said nothing was measured. A DESK DEFAULT of the brief (section 2, Step 1.5).
5. **The line is long on a phone**: fifteen lines in French on INSIGHTS, beside the clef figure (`insights-3core-phone-fr.png`).

## What I could not establish

- Any gate or Playwright count: nothing was run here. The lane reports 6682 passed, 5 skipped, and 120 desktop Playwright passed.
- The two phone failures' cause (`voice-stations.test.ts:62`, `insights-links.test.ts:32`). The lane's own runs show them at the untouched tip, so they are not new; whether the longer pane sentence makes them more frequent is open (2 of 3 before, 3 of 3 after).
- Fix 1's effect on screen: read from the code, not seen. No picture shows MELODY with no score.
- Whether a layering rule forbids `components/Drawer/voice-pane.ts:15` importing from `analysis/`.
- `tools/n200-score/lane66-core.ts` and `lane67-core.ts` were not re-run by the lane; their below-five figures are stale.
- How often a take is `confidence: 'low'`, so how common items 1 and 2 are.

## Terms

Adopted: "stable", "personal", "below five", "placeholder", "tract scale". Coined: none.
