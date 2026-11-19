# Brief to Code: lane 69, the count MELODY prints, and one comment's place

r2, 2026-11-18 20:3x, written by the desk (Opus 5). r2 adds section 3 (the ruling this lane departs from) and corrects one line range; r1 is superseded. For a cloud Code session on branch `cloud-lane-69`, cut from the tip of `Shane` (`74579156`). No other lane is running. Source: `docs/sessions/review-fable-lane68-as-built_r1_2026-11-18.md`, Fixes 1 and 2.

Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `packages/`, `tools/`, `docs/`, `scripts/`, or are `vercel.json`. The desk read every line it cites at `Shane` `74579156` on 2026-11-18. Step 0 re-reads them on your tip.

## 1. What the singer gets

MELODY's page with no score tells the singer how many vowels are measured. Today that count is every vowel the forecast holds a value for, placeholders included (`markup/MarkupPane.svelte:568`, `adapted.snapshot.fR1[g] !== undefined`), so a singer who has sampled one vowel reads "Your profile is now set with ten vowels measured" (`:949`, `:1103`; `markup/profile-status.ts:29-36`; `i18n.ts:1502`). The page tells that singer to stop, while every other line on it tells them to go on.

After this lane the sentence counts the vowels the singer sampled, and nothing else: one sampled reads "Your profile is now set with one vowel measured."

The line is older than lane 68. Lane 67 hid it below five stable core vowels; lane 68 shows it again from the first sample, which is what made it visible (`docs/sessions/review-fable-lane68-as-built_r1_2026-11-18.md`, Fixes).

No string changes in this lane. Fix 2 moves a comment; nothing a singer sees changes from it.

## 3. The ruling this lane departs from, and why

`markup/MarkupPane.svelte:554-558` carries the only record of Dann's section B.2 ruling of 2026-07-15, as the comment paraphrases it: *the pane's count reports what the analysis used; capture quality is the drawer's job, where Re-take lives.* The question that ruling settled was whether a provisionally captured reading should be struck from the count. It should not.

This lane keeps that answer and departs from the implementation. "What the analysis used" was built as `snapshot.fR1`, and in July the snapshot held a value only where the singer had sung one, so the two readings of the sentence agreed. Lane 68 put the declared type's template values into the snapshot for every unsampled vowel (`voice/engine/stand-ins.ts`, `template(standInBucket(type))`), so `snapshot.fR1` now holds ten values for a singer who sang one, and the sentence prints a number the singer did not earn.

The reason behind the ruling survives: capture quality never shrinks this count, and an unstable or provisional take still counts here, because `isSung` admits both (`voice/engine/sung.ts:14-15`). What leaves the count is a value the singer never gave. Reported under `CONTRACT.md` section 1 item 12, and as the drop of a stale implementation, not of the ruling.

## 4. One number, four sites

This lane changes how a number is computed, so the line `CONTRACT.md` section 4 asks for: every other site that computes "how many vowels the singer sampled" tests `isSung` on the stored readings.

- `voice/profileStore.ts:196-198`, `usableReadingCount`: `Object.values(f).filter(isSung).length`. The VOICE pane's sentence, its doors, and the Voice band's state line print it.
- `insights/InsightsPane.svelte:242-247`, `measuredVowels`: `Object.entries(formants).filter(([, f]) => isSung(f))`.
- `markup/MarkupPane.svelte:450`, `hasReadings`: `Object.values(formants).some(isSung)`, which gates the very block this count is printed in (`:1097`).
- `analysis/placeholder-line.ts:76`: `Object.values(stored.formants).some(isSung)`.

What depended on them agreeing: the sentence at `:1103` sits inside the block `hasReadings` opens, so one test decides whether the sentence appears and a different test decides the number inside it. Lane 68 made them disagree for every voice below ten sampled vowels. After Step 1 all four read `isSung` on the same stored object.

## 5. Steps

Each step is its own commit and its own report section, test first where a test applies, then pushed. Step 0 runs all eight gates as the baseline; Step 3 runs them again at the end.

Gate 4 at the parent, for your control: `docs/memory/STATE.md` records "6686 passed | 1 skipped (6687)" on the Mac at `aba5f76b`, the code tip this branch carries (`74579156` adds memory and house-style files only). Measure your own and report both.

Standing line: correct every comment your change makes false, in the same commit, and list them.

Ceilings (`scripts/ratchets.json:16`): `markup/MarkupPane.svelte` 1353 of 1353, at its ceiling. Step 1 holds the file's line count or lowers it; if it needs a line, move code to a module first, in its own commit. `i18n.ts` is exempt (`scripts/ratchets.json:5`).

### Step 0. Read and report; change nothing

1. All eight gates.
2. Read and report the line each of these sits on at your tip: `markup/MarkupPane.svelte:64` (the `isSung` import), `:444-450`, `:553-568`, `:949`, `:1097-1103`; `markup/profile-status.ts:12-37`; `voice/engine/sung.ts:14-15`; `voice/profileStore.ts:190-198`; `voice/engine/resolve-values.ts:74-83`; `analysis/analyze-score-adapter.ts:117-129`; `i18n.ts:1346-1356`, `:1498-1504`.
3. Report every reader of `analysedVowels` at your tip. The desk found one, `:949`.

### Step 1. The count names what the singer sampled

1. `markup/MarkupPane.svelte:568`. `analysedVowels` filters on `isSung(formants[g])` in place of `adapted.snapshot.fR1[g] !== undefined`. `isSung` is already imported (`:64`), so the line count holds. Keep the name or rename it to `sampledVowels` if the rename fits inside the ceiling; the desk prefers `sampledVowels`, because the word the pane prints is "measured" and the old name says "analysed".
2. Rewrite the two comments the change makes false, in the same commit:
   - `:444-446` points at `analysedVowels` as "what the forecast is built on". After this step it is what the singer sampled; the forecast still rests on placeholders as well.
   - `:554-567` justifies reading the snapshot so the count "can never drift from what `analyzeScore` is actually given". That is the fault, not the safeguard: the sentence says "measured", and a placeholder was never measured. The new comment names `usableReadingCount` (`voice/profileStore.ts:196-198`) as the same count, and `isSung` (`voice/engine/sung.ts:14-15`) as the one test.
3. Test, in `markup/profile-status.test.ts`: read `markup/MarkupPane.svelte` as text and assert the count is built with `isSung` and that `snapshot.fR1[` appears in no count. The pattern exists: `components/Drawer/voice-pane-usable.test.ts:23-24` asserts on `+page.svelte`'s source the same way. Name the reason in the test's title.

**The form, DESK DEFAULT.** Fable's review prescribes `adapted.snapshot.fR1Source?.[g] === 'sung'`. It selects the same vowels: `voice/engine/resolve-values.ts:78-83` flags `'sung'` exactly where `isSung(formant)` holds, and `analysis/analyze-score-adapter.ts:129` passes the pane's own `formants` as `sampled` (`:117-118`). Build `isSung(formants[g])` instead, for three reasons: it is the form INSIGHTS and the placeholder line already use (section 4); it needs no optional chaining, since `fR1Source` is optional on the snapshot (`packages/score-parser/src/analysis-types.ts:69`); and it reads the stored readings the pane was handed rather than a snapshot field computed from them. Importing `usableReadingCount` was considered and dropped: `voice/profileStore.ts` is persistence, and MELODY's paper has no business importing it. If your Step 0 read contradicts any of this, report it and build nothing until the desk answers.

**One consequence to report, not to fix.** With the change, `analysedVowels.length` is zero only when `hasReadings` is false, and the block at `:1097` is then not drawn, so `profile.statusSetPlain` (`i18n.ts:1500`) can no longer be reached from this pane. `markup/profile-status.ts:14-17` says index 0 "could never render" for the old reason; the new reason is the `hasReadings` gate. Correct that comment too, and leave the key and its branch in place.

### Step 2. The comment order in `i18n.ts`

`i18n.ts:1351-1354`, comment order only, no string touched. The comment at `:1351` ("the far-off [ɨ]'s two buttons") now sits above `calib.summary.unstableOne` (`:1353`), not above its own keys, because lane 68 inserted `:1352-1353` under it. Move `:1352-1353` above `:1351`, so the file reads: the lane 68 comment, `calib.summary.unstableOne`, the two-buttons comment, `calib.summary.keepOne` (`:1354`), `calib.summary.useEstimate` (`:1355`). Same line count, same keys, same order of keys.

### Step 3. Pictures, `vercel.json`, the end gates

1. Pictures, with one core vowel sampled and no score attached, of MELODY's page: English and French, phone and desktop. Four pictures. No picture of this page exists; it is the page Fix 1 is about (`docs/sessions/review-fable-lane68-as-built_r1_2026-11-18.md`, "What I could not establish"). Look at each and say what the sentence reads.
2. `vercel.json` names `cloud-lane-69` alone, in both places (`:3`, `:47`).
3. All eight gates, and Playwright `voice-pane`, `voice-links`, `insights-links`, `calibrate-new` (desktop), `voice-stations`, `insights-links` (phone). Change an expectation only where section 1 says the singer now sees that, and list each.
4. Report the phone runs: `voice-stations.test.ts:62` and `insights-links.test.ts:32` flaked 2 of 3 runs at `737228cb`, before lane 68, cause NOT ESTABLISHED. Run the phone project three times and report each run. Change no test for a flake.

## 6. Owns and leaves

Owns: `markup/MarkupPane.svelte` (within its ceiling), `markup/profile-status.ts` comments and `markup/profile-status.test.ts`, `i18n.ts` (the comment move of Step 2 only), `vercel.json`. Leaves: every string's text, every other count, `voice/`, `analysis/`, `insights/`, `packages/`, `docs/memory/`, every brief.

## 7. Constraints

No pull request; push only `cloud-lane-69`. Change nothing under `docs/memory/`; do not edit a brief. One vowel per note is not in scope here and no path in this lane touches seating. NOT ESTABLISHED beats a complete invented answer.

## 8. What the desk could not establish

- Whether the four pictures of Step 3 show the sentence whole on a phone. Fable read Fix 1 from the code, not from a screen, and no picture of MELODY with no score exists.
- The cause of the two phone flakes, and whether lane 68's longer pane sentence makes them more frequent (2 of 3 before, 3 of 3 after, from the lane's own runs).
- Whether a layering rule in this repository forbids `markup/` importing from `voice/profileStore.ts`. The desk dropped that import on design grounds, not on a rule it read.
