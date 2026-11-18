# Review: lane 66 as built (`origin/cloud-lane-66`, `e7907576`), r1, 2026-11-17

Reviewer: Fable 5.2. Read at the worktree `/home/claude/rev`; base `origin/Shane`, merge base `ab67b836`. Nothing was changed and no test was run: `/home/claude/rev` has no `node_modules`, so every finding below comes from reading the tree, the diffs, and the golden's JSON.

## Verdict

MERGE WITH FIXES. No blocker. Six small fixes: one duplicate of the predicate, four comments, and one sentence of the measure that the adapter golden contradicts.

## Blockers

None.

## What holds, by the nine checks

1. **Step 5's "Done when" holds in the code.** No source file under `apps/web/src` or `tools/` reads the verdict to decide use. The readers left:
   - `voice/outside.ts:28` (the note; verdict and not kept).
   - `voice/engine/resolve-values.ts:52`, `:60` (inside `judgeUnchecked`: they make a verdict, and decide no number).
   - `voice/chart/readings.ts:132` (the mark; `plausibilityOverride` only).
   - `voice/engine/plausibility.ts:260` (writes the verdict), `:325` (`keepReading`).
   - `voice/CalibrationWizard.svelte:295` (stores the verdict).
   - `tools/n200-score/lane66-core.ts:124`, `:226`, `:258` and `step5-core.ts:46` (measurement only).
   `isUsable` appears in no non-test file. The `implausible` list is gone from `ResolvedValues` (`resolve-values.ts:80-93`). The retake reason is `'off-shape'` alone (`stand-ins.ts:183`, `:233`). `fillStandIns` takes two arguments at its one caller (`resolve-values.ts:200`).
   Site by site, against the brief's table and the Step 0 census:
   - fR1 enters on `isSung`: `resolve-values.ts:125`. fR2: `:141`.
   - Anchors: `derivations.ts:80-82`, read at `:99`.
   - INSIGHTS' measured vowels: `insights/InsightsPane.svelte:245`.
   - The count: `voice/profileStore.ts:196-197`. Its readers are unchanged code: `routes/+page.svelte:1761`, `:4186-4187`, `:4366`; `components/Drawer/voice-pane.ts:28-34`, `:48`, `:61-63`.
   - The chart: `voice/chart/zones.ts:121`, `:134`. Finish early: `voice/chart/finish-early.ts:35-38`.
   - MELODY's analysed vowels read the snapshot: `markup/MarkupPane.svelte:567`.
   Nothing in the resolution reads `plausibilityOverride` except `judgeUnchecked`, whose output (`ResolvedValues.formants`) has no reader I found outside tests (grep of `.formants` across `analysis/`, `voice/chart/`, `insights/`, `markup/`). So a kept and an unkept reading cannot give different numbers.
2. **`isSung`** (`voice/engine/sung.ts:13`) is used at every site in check 1. Two sites hold their own copy of the same test: `voice/chart/readings.ts:51` (identical text) and `voice/VowelCapture.svelte:108` (same meaning, no `typeof`). See Fix 1. On `f1: 0`: `analyze.ts:216` returns an error when `f1` is falsy, so the live capture path stores no such reading; only older or outside data can hold one. For such a reading the count (`profileStore.ts:197`), the chart (`zones.ts:121`), the readings table (`readings.ts:58`, `:92`), the capture buttons (`VowelCapture.svelte:108`), and finish early (`finish-early.ts:35`) now all say "not sung". Before the lane the count alone could say otherwise. Two wider tests remain, both older than the lane: `hasAnyReadings` (`profileStore.ts:185-187`, by design per its comment at `:174-183`) and MELODY's `hasReadings` (`markup/MarkupPane.svelte:449`, read at `:1096`). I found no new disagreement.
3. **The note** reads `outsideVowels(judgeUnchecked(profile), ALL_VOWELS)` at `CalibrationWizard.svelte:331`, with the import at `:61`. The whole-lane diff of the wizard touches `:61`, the comment above `withIghPass` (`:251-264`), `:331`, and the comment at `:649-650`; nothing inside `withPlausibility` (`:292-302`). Keep works on a reading stored with no verdict: `keepReading` sets the override (`plausibility.ts:325`), and `judgeUnchecked` skips an overridden reading (`resolve-values.ts:52`), so `outside.ts:28` goes quiet. Line counts: wizard 1122 of 1126, `InsightsPane.svelte` 742 of 744, `+page.svelte` 5531 of 5534 (`wc -l`; ceilings at `scripts/ratchets.json:14`, `:18`, `:8`). The brief expected 1121; the extra line is Step 1's comment.
4. **The adapter golden.** Compared by key between `origin/Shane` and the tip: 144 keys in both, the same key set, 12 entries differ, and all 12 are `"<type> | bad i (1063), no override"`, one per entry of `TYPES` (`analysis/adapter-grid.ts:35`). No other entry moved. "Each equals its kept twin": the golden holds no twin entry to compare against; the equality is asserted by `analysis/every-sung-reading-counts.test.ts:41-50` and follows from check 1. I did not run that test.
5. **Step 3.** The id is in `STATION_IDS` (`components/Drawer/sections.svelte.ts:79`) and `UNPERSISTED_STATIONS` (`:66`). The row reads and toggles the page's set (`VoicePane.svelte:78-79`, `:82`); the local `typeOpen` is gone. The phone rule is per tier in `toggle` (`sections.svelte.ts:424-427`), and `reveal` goes through `toggle` (`:441`), so `openStation` (`+page.svelte:1690-1700`) shuts the type row. The only iteration of `STATION_IDS` outside tests is `SUCCESSOR` (`sections.svelte.ts:188`); every other use names one id (`RootPanel.svelte:149-153`, `VoicePane.svelte:78-113`, `+page.svelte:1695`, `:4083-4084`). The markup keeps `data-vp-row="voiceType"` and `#voice-type-body` (`VoicePane.svelte:75`, `:83`). All four Step 3 pictures show what their names say, English and French.
6. **Step 2.** `mountRecorderPanel` sets the picker and reads the address before it looks for a panel, and an existing panel is rewritten (`voice/engine/capture-file.ts:253-257`). A new panel is filled by `refreshPanel()` at `:304`. The default is `'path'` at `:207` and `:253`. The sidecar's fallback is kept at `:152`. Both card pictures show the three lines.
7. **Step 1's comments** are true to the tree where I checked them: `clefFor` exists (`voice/note-picker.ts:105`, used at `NotePicker.svelte:129`); the picker rule matches `voice/chart/measure-switch.ts:14`; `withPlausibility` changes no status (`CalibrationWizard.svelte:295`). Comments Step 5 left false or loose are Fixes 2 to 5.
8. **Step 6.** `vercel.json:3` and `:47` name `cloud-lane-66` and no other lane (`grep cloud-lane vercel.json`: two lines).
9. **Leaves.** `git diff --name-only origin/Shane...origin/cloud-lane-66` lists no `i18n.ts`, nothing under `docs/memory/`, and no brief.

## Fixes

1. `apps/web/src/lib/voice/chart/readings.ts:51`. A local `isSung`, the same text as `voice/engine/sung.ts:13`. The brief asked for one exported predicate. Change: delete line 51 and add `import { isSung } from '../engine/sung';`. Then correct `readings.ts:80`, which says `"sung" is the chart's own test, `zones.ts` `isSung``: `zones.ts:28` now imports it. New words: `"sung" is the one test, `engine/sung.ts` `isSung``. Optional, same commit: `voice/VowelCapture.svelte:108` to `VOWELS.filter((v) => isSung(profile[v]))`.
2. `apps/web/src/lib/analysis/analyze-score-adapter.ts:64-65`. The comment says `retake` "lists sung vowels the fit left out (off its shape) or the guard failed". The second half is false since Step 5 (`stand-ins.ts:233`). Change to: "lists sung vowels the fit left out (off its shape)".
3. `apps/web/src/lib/voice/engine/resolve-values.ts:168-170`. "the derived reading carries no f2Quality and no plausibility, both of which mean "not assessed" and pass": plausibility is no longer a gate to pass. Change to: "the derived reading carries no f2Quality, which means "not assessed" and passes, so the live condition is a positive number."
4. `apps/web/src/lib/voice/engine/resolve-values.ts:101` and `:118-119`. `:101` says "every gate below, and `deriveFrom`, reads the judged copy", and `:118-119` says a reading with no verdict "is judged first (`judgeUnchecked`, above), so the note can name it". No gate below reads the verdict, and the note calls `judgeUnchecked` itself (`CalibrationWizard.svelte:331`), not through this function. Change `:101` to: "QUEUE row 11: the judged copy is returned as `formants`; no gate below reads its verdict." Change `:118-119` to: "`plausibility` absent means the guard never ran. Such a reading counts like any other; the summary's note judges it for itself (`judgeUnchecked`, `CalibrationWizard.svelte`)."
5. `apps/web/src/lib/voice/engine/sung.ts:11`. "`analyze.ts` can write `f1: 0` for a take whose first resonance it could not place, which two of them counted." `analyze.ts:175` writes it, and `analyze.ts:216` then refuses the take, so no reading with `f1: 0` leaves `runCapture`. Change the clause to: "`analyze.ts:175` can set `f1: 0`; `runCapture` refuses such a take (`:216`), so only data stored by other means can hold one, and two of the four tests counted it."
6. `docs/sessions/n200-lane66-step4-measure_2026-11-17.md:40`, repeated at `docs/sessions/report-code-lane66-step5_r1_2026-11-18.md` under "A pointer for the desk" and in the Step 6 report's "For the desk". The sentence "From three, the fit sets the odd [i] aside for the six Bozeman values" is true of the runner's cut and not in general. The runner's three are [i] with the first two of `COMPANION_ORDER` (`tools/n200-score/lane66-core.ts:215`, `:226`), which are [e] and [ɛ] (pinned at `lane66-core.test.ts:73`). The adapter golden's own entry `"bass | bad i (1063), no override"` is [i], [u], [ɑ] (`adapter-grid.ts:29`), and there the fit sets aside the true [u] (`retake: [{vowel: 'u', reason: 'off-shape', semitones: -9.9}]`) and the stand-ins follow the odd [i]: [e] 821.6 Hz, [ɛ] 1005.7 Hz, [o] 821.6 Hz for a bass. Change: add one sentence at measure `:40`: "This holds for the cut [i], [e], [ɛ]; with [i], [u], [ɑ] the fit sets the true [u] aside and the stand-ins follow the odd [i] (adapter golden, `bass | bad i (1063), no override`)." The desk reads Step 4's numbers before merging (`PRODUCT.md:1273`), so this is the one fix to make before the merge. The other five can follow in the same small commit.

## For Dann's eye

Singer-visible changes only.

1. A vowel sung outside Ilya's reference values now counts at once, with no press of Keep. MELODY and INSIGHTS use its numbers. The VOICE pane's sentence counts it, the Record door's name follows that count, and the closed Voice band's line counts it.
2. INSIGHTS' "your own measured value" wording can now appear for such a vowel.
3. The vowels worked out from [i] and [u] follow the sung values wherever they fall. An [i] sung at 1063 Hz gives a worked-out [ɨ] at 1451 Hz.
4. One odd take moves Ilya's estimates for the vowels not yet sung. You ruled this acceptable. One case is stronger than the brief told you: a bass who has sung an odd [i] and a true [u] and [ɑ] gets estimates near 822, 1006, and 822 Hz for [e], [ɛ], and [o], and the true [u] is the one the fit leaves out. In the calibration order ([i], [e], [ɛ] first) the fit does leave the odd [i] out at three vowels.
5. The summary's note ("Beyond Ilya's reference values", Keep or sing again) can now appear on a voice saved long ago whose readings were never judged. Before, such a voice showed no note.
6. Keep now changes no number. It marks the reading and quiets the note.
7. On a phone, the VOICE pane's three rows open one at a time. On a desk, the voice type row now stays open if you leave the pane and come back within one page load; a fresh load closes it.

## What I could not establish

- Any test result. No dependencies are installed in `/home/claude/rev`. The counts in the lane's reports (6613 passed, 1 skipped; Playwright 88 and 11) are the lane's own; the desk's trial merge decides.
- That each of the 12 changed golden entries equals its kept twin, by running. Established by reading only (check 4).
- Whether any seeded e2e store outside the brief's named suites gains a summary note now that the note reads the judged copy. The Step 6 report says the same.
- Whether a stored profile with `f1: 0` exists on any device. NOT ESTABLISHED; the code path that could store one from a live take is closed at `analyze.ts:216`.
- `voice/engine/divergence.ts:6`, `:21` has its own `usable` test for [i] and [u]. I did not read its body. It is in the brief's "Leaves" list and holds no verdict reader (grep of `plausib` in that file: none).
- The folder run on real takes: not run by the lane, and not by me.

## Terms

Adopted from the brief: "judged outside", "set aside", "kept twin", "the note", "the mark". Coined here: none.
