# Review: lane 67 as built (`cloud-lane-67`, `ce423092`, on `Shane` `2b3bde8e`), r1, 2026-11-18

Reviewer: Fable 5.2. Read at `/home/claude/rev67`. Nothing changed; no test run (no `node_modules`), so every finding is from reading, plus one independent recomputation in Python. Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `docs/`, `tools/`, or are `vercel.json`.

## Verdict

MERGE WITH FIXES. The threshold, the tract scale, the unstable note, and the far-off [ɨ] choice are built as the brief and the ruling (`docs/memory/OPEN.md:3991-4003`) say. No blocker. Five small fixes, none of which changes a ratified string. One open question on the phone Playwright suite is to be settled before the merge (last section).

## Blockers

None.

## What I checked, and found sound

1. **Below five core vowels, every value site behaves as for nothing recorded.**
   - The resolver empties its input when the voice is not personal: `voice/engine/resolve-values.ts:55`; `anySung` and `generic` follow at `:149-150`.
   - MELODY with a score and INSIGHTS read only the adapter: `markup/MarkupPane.svelte:550`, `insights/InsightsPane.svelte:163`, both through `analysis/analyze-score-adapter.ts:129`.
   - MELODY with no score: `markup/MarkupPane.svelte:450`, read at `:1097`.
   - INSIGHTS' measured vowels: `insights/InsightsPane.svelte:244`.
   - The VOICE pane: `components/Drawer/voice-pane.ts:36` (a hard vowel alone, `usable >= 1` and `core` 0, lands here too), fed from `apps/web/src/routes/+page.svelte:4187`.
   - The chart's placeholders: `voice/chart/zones.ts:91`, `:121-123`, through the resolver; with nothing passed in, `fillStandIns` takes the declared template whole (`voice/engine/stand-ins.ts:139-143`).
   - The finish control: `voice/VowelCapture.svelte:282`.
   - Readers of the stored readings that remain, none of which treats 1 to 4 vowels as personal: the closed band's count (`components/Drawer/bandState.ts:246-249`, `+page.svelte:1762`; the brief says unchanged), the door name (`+page.svelte:4367`, `voice-pane.ts:74-76`; unchanged by the brief), the chart's own dots (`zones.ts:131-136`), the wizard's opening phase (`voice/CalibrationWizard.svelte:311`), and the unstable note, which shows below five (`voice/outside.ts:25`; section 1 item 4 sets no threshold on it). `restsOnSamples` reads the adapter only (`insights/identity.ts:41-43`).
2. **Tract scale.** `tractScale` is a geometric mean over sung core vowels, fR1 always and fR2 where its source is `sung` (`stand-ins.ts:104-111`, `:133-139`). A missing resonance on a sung core vowel takes shape times k for that resonance alone (`:151-155`). The shape is `middle` whenever k is finite (`:141`). I recomputed the golden's `verdict stored` case from `CORE_BANDS` (`voice/engine/plausibility.ts:50-90`) and `MITTON_FR2` (`stand-ins.ts:44`): k = 0.8879, [o] = 459.3 Hz and 827.2 Hz, equal to `analysis/__golden__/adapter-snapshots.json`, key `(undefined) | verdict stored`. No code reader of the removed fit remains: grep for `fitWithoutOutliers`, `OFF_SHAPE_SEMITONES`, `shift-and-spread`, `standIns.retake`, `judgeUnchecked`, `marks.beyond` over `apps`, `tools`, `packages` finds one negative assertion (`analysis/every-sung-reading-counts.test.ts:100`).
3. **Unstable note.** `confidence === 'low'`, sung, not kept, and not the far-off [ɨ]: `outside.ts:25`. One note per vowel: `outside.ts:25` with `:37-40`, drawn at `CalibrationWizard.svelte:864-865`. The mark sits inside `isSung` (`voice/engine/sung.ts:15`), so the count (`voice/profileStore.ts:197`), the chart (`zones.ts:121`, `:134`), the table (`voice/chart/readings.ts:57`, `:91`), and the resolution (`resolve-values.ts:77`, `:93`) all drop the reading, and [ɨ] is derived (`resolve-values.ts:126-138`). A fresh take replaces the object (`CalibrationWizard.svelte:645-647`); a less clear one is rolled back (`voice/capture-ritual.svelte.ts:300-304`). `farOffIgh` clones [ɨ] before the pass, and the pass writes to [ɨ] alone (`outside.ts:38-39`, `voice/engine/divergence.ts:21`, `:24`).
4. **The six desktop Playwright changes** (`apps/web/e2e/`, the lane's diff). None is bent.
   - `calibrate-new.test.ts:191-192`, and the new test at `:195`: the finish control is absent below five and present at five. Sanctioned by Step 2.3.
   - The rolled-back re-take (`:233-253`): the seed no longer earns a note (section 1 item 4), so the test reaches the same rollback from the capture screen, with six core vowels. Its assertions on the rollback, the error, and the take record are unchanged. Cost: no end-to-end test now rolls back a re-take started from a summary note.
   - The two re-take tests (`:258`, `:267`): the seed is `confidence: 'low'`. Sanctioned by section 1 item 4.
   - `insights-links.test.ts:111-113`: the seed holds five core vowels, and the title says so. Sanctioned by section 1 item 2.
   - `voice-pane.test.ts:303`: a selector, not an expectation; INSIGHTS below five offers a link with the door's words.
5. **Strings.** All seven equal the brief's table, English and French, compared by script with `’` and ` ` decoded: `i18n.ts:1350`, `:1352`, `:1353`, `:1436-1439`. The three retired keys carry a dated UNUSED comment in place: `i18n.ts:1337-1338`, `:1342-1345`.
6. **Ceilings and limits.** `CalibrationWizard.svelte` 1124 of 1126, `InsightsPane.svelte` 742 of 744, `MarkupPane.svelte` 1353 of 1353, `+page.svelte` 5532 of 5534 (`wc -l` against `scripts/ratchets.json:8`, `:14`, `:16`, `:18`; the file is not in the diff). The wizard's hunks are at `:57`, `:328`, `:678`, `:860`; `withPlausibility` (`:291-302`) is untouched. The diff touches nothing under `docs/memory/`, no brief, and not `extract.ts`, `analyze.ts`, or `divergence.ts`. `vercel.json` names `cloud-lane-67` in the build command and in `git.deploymentEnabled`, beside `Shane` and `main` as before.

## Fixes

1. `markup/MarkupPane.svelte:448`. A Provisional [ɨ] set aside with "Use Ilya's estimate for now" is still listed on MELODY's page with no score as a vowel to re-take. Change the filter to `isSung(formants[g]) && formants[g]?.reading === 'provisional'`, and widen the import at `:64` to `{ isPersonal, isSung }`. No line added (the file is at its ceiling).
2. `voice/outside.ts:37`. A sung [ɨ] with no usable fR2 is always far-off, because the pass reads a missing fR2 as 0 (`divergence.ts:23`). The singer then reads that [ɨ] sits away from [i] and [u] when only its second resonance is missing, and the table already says so (`voice/chart/VowelSpaceSheet.svelte:128`). Add to the early return: `|| !(typeof igh.f2 === 'number' && igh.f2 > 0) || igh.f2Quality === 'absent'`, with one test in `voice/outside-igh.test.ts`. This is a guard; the desk may strike it under the brief's section 1 principle. How often a take has no fR2: NOT ESTABLISHED.
3. `voice/CalibrationWizard.svelte:862`. The comment says "the note on readings outside Ilya's values". Change to "the note on unstable readings, and the far-off [ɨ]'s". Same line count.
4. `voice/engine/resolve-values.ts:5` and `:141-142`, `voice/chart/zones.ts:20` and `:64`. Four comments still say "fitted to the singer" or "the fit". Change each to "scaled to the singer (the tract scale, `stand-ins.ts`)".
5. `docs/sessions/report-code-lane67-step8_r1_2026-11-18.md`, section 5. Append a dated line: the rolled-back re-take test failed once after its re-route and passed alone; say whether it passes three times in a row.

## For Dann's eye

1. With three core vowels recorded, INSIGHTS says "Your [i], [e], [ɛ], [ɑ], [o], [u], [ɨ], [ɪ], and [ʌ] use placeholder values until you sample them in vocal fry", to a singer who has sampled [i], [e], and [u] (picture `insights-3core-phone-en.png`). This is the ruling as built. The VOICE pane explains; INSIGHTS does not.
2. The unstable note with one reading reads "These readings were unstable: [e] close-e." with a "Keep them" button (picture `summary-unstable-phone-en.png`; `voice/OutsideNote.svelte:41`). The plural is the ratified string. A singular form would be a new string, English and French.
3. After "Use Ilya's estimate for now", [ɨ] shows as not recorded. If the singer then sings [ɨ] and the take is unsteady, Ilya says "new sample was less certain, so the previous one was kept" (`i18n.ts:1403`), and the estimate stays in use. The only way back to the singer's own [ɨ] is a steady new take. The brief says so; you have not seen it.
4. The phone pictures I looked at are sound: the far-off note's three buttons stand two and one with no word broken (`summary-far-igh-phone-fr.png`), and the pane's French sentence reads as ratified (`pane-3core-phone-fr.png`).

## What I could not establish

- Any gate or Playwright count. Nothing was run here.
- Whether the two intermittent phone failures (`insights-links` L1, `voice-stations` "Add your range", a station's `y` of -0.06 against `>= 0`) predate the lane. The Step 8 report offers a cause in the lane (the pane's sentence is three lines where it was two) and did not test it. Run the phone suite three times at `2b3bde8e` before the merge; if it is clean there, the lane caused it.
- Whether the chart's zones for the four hard vowels are meant to follow the singer's [i], [ɑ], and [u] below five. They do (`zones.ts:88`, `:96`), and the lane did not touch that file. A zone is a drawn neighbourhood, not a value.
- The 84 and 88 moved golden entries, key by key. I checked one group C entry by recomputation and no others.
- Step 1's six fixes beyond the duplicate `isSung` (`readings.ts:11`, `VowelCapture.svelte:109`), and the Step 4 measure's numbers.
- Pictures not looked at: all desktop ones, the `pane-5core` set, and the phone ones other than the four named above.
- Whether an exported file carries vowel values, and behaviour for stored readings with `confidence` unset (both carried from the lane's own reports).

## Terms

Adopted from the brief: "core count", "personal", "tract scale", "unstable", "the mark", "far-off [ɨ]". Coined here: none.
