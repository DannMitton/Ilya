# Brief to Code: lane 66, the follow-ups of lanes 63, 64, and 65

r3, 2026-11-17 22:0x, written by the desk (Fable 5.2). It applies two Fable reviews: of r1 (`docs/sessions/review-fable-lane66-brief_r1_2026-11-17.md`: SEND WITH AMENDMENTS, two blockers, twenty-two amendments) and of r2's changed steps (`docs/sessions/review-fable-lane66-brief_r2-delta_2026-11-17.md`: SEND WITH AMENDMENTS, two blockers, eleven amendments). r1 and r2 are superseded and kept. Section 8 says what changed and why. For a cloud Code session on branch `cloud-lane-66`, cut from the tip of `Shane` (the desk names the commit). No other lane is running.

Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `packages/`, `tools/`, `docs/`, or are `vercel.json`. The desk read the lines it cites at `Shane` `2201330b`. A line marked (review) was read by the Fable reviewer and not by the desk. Step 0 re-reads all of them on your tip.

## 1. What the singer gets

1. **What a singer sings is what Ilya uses.** Today a reading that sits outside Ilya's reference values is shown as Captured, and MELODY and INSIGHTS still ignore it until the singer presses Keep. After this lane every sung reading counts at once, exactly as a kept reading counts today: for its own vowel, and in what Ilya works out for the vowels not yet sung.
2. **The summary still names a reading outside the reference values, once**, with Keep or sing again. Keep does what it does today (the reading is marked "Beyond Ilya's reference values" and the note goes quiet); it no longer changes a number. A reading stored before the guard existed is named too, when it sits outside every voice type's values.
3. **On a phone, the VOICE pane's three rows open one at a time.**

Said plainly, for the record: one odd take can now move Ilya's estimates for the vowels not yet sung, until that vowel is sung again or enough vowels are sung for the fit to set it aside (three; `voice/engine/stand-ins.ts:157-168`). Dann has ruled this acceptable, twice (section 2).

For the desk's next phone walk, and never seen by a singer:

4. The recorder panel names the picker of the session in use, the picker stamped on the last take, and what the address said; a recorder build exists for this lane.

And for the people who read the code next: every comment that states a rule Dann has ruled out, or that a step of this lane makes false, is corrected.

## 2. The rulings

| When | Words | What it rules |
|---|---|---|
| 2026-11-13 12:29 to 12:34, `docs/memory/PRODUCT.md:1270` | "The neighbourhood is a description set beside the reading, never applied to it. It never demotes, discards, or blocks a reading." (clause offered by the desk, ruled by Dann) | Item 1, for MELODY as for INSIGHTS (the desk's reading: the clause names no document). |
| 2026-11-13 12:16, `docs/memory/OPEN.md:3799` | Dann: "a user-provided sample is real data versus our placeholder data which is generic and impersonal" | Item 1: a stand-in never replaces a sung reading. |
| `docs/memory/PRODUCT.md:1273` | "Insights' use of \"plausible or kept\" readings changes with it and is measured before it ships." | Step 4 comes before Step 5, and the desk reads Step 4's numbers before any merge. |
| 2026-07-15, section B.4, as `voice/engine/resolve-values.ts:108-111` records it | Markup builds no acoustic mark on a number the guard judged implausible | Superseded by the ruling of 2026-11-13. Do not stop on the word RULED in that comment; rewrite the comment. |
| 2026-11-13 12:16 (`docs/memory/OPEN.md:3799`) and 2026-11-17 21:39 (`docs/memory/INBOX.md`) | Dann: "we must allow allow the user to break the system"; and, shown that one odd take would move the estimates for the other vowels: "users can break ilya and they should be able to with this kind of nonsense input." | Step 5 builds no guard for the odd take. r2 had one; it is withdrawn (section 8). |
| 2026-11-13 12:34, `docs/memory/PRODUCT.md:1271` | "Once the singer's own vowels exist, their voice is the reference." | Step 5: a sung reading also shapes what Ilya works out for the other vowels, whatever the band says of it. |
| 2026-11-13 15:11, `docs/memory/OPEN.md:3800` | Dann: "My anchor \"rule\" feels like something you imposed form somethig I said." | Step 1: no comment calls anything "Dann's locked anchor rule". |
| 2026-11-17 15:04, `docs/memory/INBOX.md:823` | three equal full-width rows | Item 3: three of a kind behave alike (DESK DEFAULT on the phone rule). |

## 3. Steps

Each step is its own commit and its own report section, test first where a test applies, then pushed. After each step run only the tests of the files that step changed, with two exceptions: Step 0 runs all eight gates as the baseline, and Step 5 ends with gate 4 whole. All eight gates and the named Playwright suites run once more at the end. Gate 4 baseline at `2201330b`: 6589 passed, 1 skipped (6590) with Python, numpy, and scipy; 6585 passed, 5 skipped without (derived, not run).

**A standing line for every step:** correct each comment your change makes false, in the same commit, and list them in the report.

**Ceilings and one trap.** `voice/CalibrationWizard.svelte` is 1120 lines against 1126 (review). `insights/InsightsPane.svelte` is 742 against 744 (review; `scripts/ratchets.json:18`). `apps/web/src/routes/+page.svelte` is 5530 against 5534 (review). No edit enters the body of `withPlausibility` in the wizard: `voice/plausibility-keeps-status.test.ts:13-22` cuts that function out of the source by brace counting (review).

### Step 0. Read and report. Change nothing.

- The eight gates with counts, as the baseline. Every cited line re-read. Line counts against `scripts/ratchets.json` for every file you will touch.
- **A census for Step 5.** Every reader of `isUsable`, `usableAnchor`, `plausibility === 'implausible'`, `plausibilityOverride`, the `implausible` list of `resolveVowelValues` (`voice/engine/resolve-values.ts:96`, review), `usableReadingCount`, and `StandInReport.retake`. For each: what it decides, and what a singer reads from it. The review found these beyond the brief's table, none read by the desk: `voice/chart/finish-early.ts:35-37`, `:67`; `voice/chart/zones.ts:93`; `components/Drawer/voice-pane.ts:28-34`, `:48`; `apps/web/src/routes/+page.svelte:1761`, `:4185-4186`, `:4365`; `insights/comment-text.ts:122-123`. The review found no reader of `standIns.retake` outside tests: confirm it.
- What `tools/n200-score/__golden__/` holds, and how lane 64 built a profile from the sets (`step5-core.ts`, review), for Step 4.

### Step 1. Comments that state a rule Dann has ruled out. No code change, no test change.

Rewrite each to say what the tree does now: the verdict and the divergence describe a reading and never change its status (`docs/memory/PRODUCT.md:1269-1270`).

- `voice/engine/types.ts:59-60`: "an implausible reading resolves to Provisional at the wizard boundary".
- `voice/engine/session.ts:38-41`: "a divergent velar-i resolves to provisional".
- `voice/CalibrationWizard.svelte:248-261`, above `withIghPass`: "resolves [ɨ] to Provisional (Dann's locked anchor rule)" and "a downgraded [ɨ]". The label goes with the rule.
- `voice/CalibrationWizard.svelte:647-648`, in `commitReading`: "a divergent [ɨ] that the pass resolved to Provisional".
- `voice/engine/plausibility.ts:322-325`, above `keepReading`: "undoing only the guard's demotion"; and `:21-23` (review).
- `voice/engine/derivations.ts:72-75`: "The locked anchor rule (a Provisional [i]/[u] resolves [ɨ] to Provisional) ... not yet wired".
- `voice/chart/readings.ts:105` (review).
- `voice/engine/stub.ts:66-69`: the outcome `provisional-divergent` scripts a state the engine no longer produces. It is the stub's default for [ɨ] (`:108`, review), so leave the outcome and correct its comment.
- `voice/engine/capture-file.ts:104`: names `?measure=open` and `?measure=path` and not the default.
- `apps/web/e2e-phone/path-picker-time.test.ts:11`: "the median without it"; without it is now the path picker.
- `components/Drawer/reveal-scroll.ts:32`: "a station under the VOICE pane's doors". The stations stand above the doors.
- `apps/web/src/routes/+page.svelte:4179-4180`: the pane's contents and order.
- `voice/chart/ratified-strings.test.ts:2`: the header says the file pins the calibration screen's and the sheet's strings; it pins the wizard's voice type line too.
- `voice/NotePicker.svelte:20-23`: the header says the clef is chosen per note by pitch.
- `tools/n200-score/vitest.config.ts`, the header's runner list: add `N200_GOLDEN=write-path` and `N200_SET=third`, which lane 64 added.
- Any other comment under `voice/` or `components/Drawer/` that states the old demotion or the old pane order (grep "Provisional", "demot", "locked anchor", "downgrad").

### Step 2. The recorder panel follows the session.

`mountRecorderPanel` returns when the panel exists (`voice/engine/capture-file.ts:224`), before it sets `panelPicker` (`:225`), and the card's line is written once (`:236`). The wizard builds a session each time it mounts (`voice/CalibrationWizard.svelte:205`), and each call reads the address again (`voice/chart/stub-switch.ts:29-32`). So the panel can name a picker that is no longer the one in use.

- Every call sets the picker and rewrites the face and the card, whether or not the panel exists.
- The card gains two lines: the picker stamped on the last held take (`rec.picker`, `:105`, held by `holdCapture`, `:145`), or "no take yet"; and the value of `measure` as the address gave it when the session was built, or "no measure in the address". The two together separate "the address lost its query" from "the picker ignored it". Read the address inside `mountRecorderPanel`: `voice/chart/stub-switch.ts` is not yours, and `voice/engine/capture-file.test.ts:174-175` pins its call (review).
- The default is `'path'` at `:198` and `:223`, and in the pin at `voice/engine/capture-file.test.ts:173`. The sidecar's fallback to `'shipped'` (`:150`) stays: a record with no picker predates lane 64 (`voice/engine/types.ts`, the `picker` comment).
- `capture-file.ts` still imports only `./analyze` and `./extract`. English only. Pure functions for the words, tested as `panelFace` is; the tree has no DOM test environment.

### Step 3. On a phone, the three rows open one at a time.

The voice type row's open state is local (`components/Drawer/VoicePane.svelte:56`), so the station tier's rule (`components/Drawer/sections.svelte.ts:420-423`) does not reach it. Lane 65 reported both open together.

- The row becomes a station of the tier: a new id `voiceType` in `STATION_IDS` (`:76-78`) and in `UNPERSISTED_STATIONS` (`:65`), read and toggled through the page's set, as the two stations are. The review found that nothing renders or iterates `STATION_IDS` but `SUCCESSOR` (`:184-187`) and tests, and that `#write` filters unpersisted ids, so the id reaches neither the screen nor storage. Do not use the id `voice` (struck: `sections.test.ts:319-320`, review).
- The row's markup keeps `data-vp-row="voiceType"` and `#voice-type-body`.
- What changes on a desk: the row's state now lives in the page's set, so it stays open across a remount of the pane within one page load, as the two stations do. It is still closed on a fresh load and never stored. Say so in the report.
- Comments this makes false: `components/Drawer/VoicePane.svelte:12-16`, `components/Drawer/sections.svelte.ts:55-57` (review).
- Tests: `sections.test.ts` (the pinned list at `:84-86` changes; opening the row under `exclusive` shuts an open station, and the reverse; the id is never written); `apps/web/e2e-phone/voice-stations.test.ts` (type row open, then Describe: the type row is closed; and type row open, then a link to a station: the station lands in view, since `components/Drawer/reveal-scroll.ts:31` assumes nothing closes before its target).
- Pictures, 390 by 844, English and French: the type row open; then Describe opened, with the type row closed.

### Step 4. Measure, before anything changes. A runner and a report.

Two questions, in numbers. (a) When a reading is judged outside, is the reading or today's replacement nearer the truth, for that vowel? (b) When that reading counts, how far do Ilya's values for the other vowels move, and toward the truth or away from it?

What the reviews established about the sets (none of it read by the desk; confirm in Step 0): the synthetic truths are the guard's own band centres (`tools/n200-score/fidelity-set.ts:12-14`, `:48-57`), so a reading judged outside under its own type is a picker error and nothing else; lane 64 counted 0 of 566 and 0 of 588 such readings (`docs/sessions/n200-lane64-step5-counts_2026-11-17.md:31`, `:75`); the goldens are `path-600.json` and `shipped-open-600.json`, primary set only, with no truth and no verdict; a take is a type, a vowel, and a rank `k`, and no take belongs to a singer; six of the 582 readings in `path-600.json` have no fR2.

- A runner under `tools/n200-score/` (a `*.run.ts`, by file name only, in no gate), reading `tools/n200-score/__golden__/path-600.json`. A profile is the takes of one type with the same `k`, judged as the wizard judges: `checkPlausibility(f1, vowel, type, anchorF1sFor(profile))` (`voice/CalibrationWizard.svelte:292`). Truth is the set's own cell (`cells(PRIMARY)`, review).
- **The cross-type run.** Judge each profile under every other declared type and under no type. These outside readings are true to the voice. For each: reading to truth, and today's replacement to truth, in semitones, for fR1 and fR2; and which is nearer.
- **What moves when the reading counts.** "Counts" is today's kept case, so the runner computes it now by setting `plausibilityOverride`. For named subsets of 1, 2, 3, and 6 sung vowels of which one is outside (the cross-type cases, and a bass with [i] at 1063 Hz): for every other vowel, how far its value moves, and whether it lands nearer the set's truth or farther. A voice sung under the wrong type is displaced as a whole, so counting its reading may help it where the 1063 Hz case harms; the report shows both.
- Two counts, defined once and used in Step 5's test: **judged outside** (`checkPlausibility`'s verdict; Step 5 does not change it) and **set aside** (a sung vowel whose `fR1Source` from `resolveVowelValues` is not `'sung'`, or whose `fR2Source` is not `'sung'` where the take read an fR2).
- The report says plainly: own-type results on these sets describe picker error only; the sets hold no contralto, countertenor, or bass-baritone bands.
- **A folder of real takes.** The runner also reads a folder of the recorder's files, named by a variable of its own (not `N200_DIR`, which starts `score.run.ts` and its Burg run; `tools/n200-score/vitest.config.ts:43`, review). A sidecar carries no voice type (`voice/engine/capture-file.ts:98-112`), so the type comes from a second variable. The profile is, for each vowel, the last take whose `sung` is empty or equals `asked`, with the reading its sidecar stored; takes whose `sung` differs are reported apart. A folder has no truth: the run reports each reading, its verdict, and what moves when it counts. It judges with the whole profile's anchors, where the wizard judges with the anchors held at capture; say so in the output. Output goes beside the folder, never into the repository. The desk runs this on Dann's takes on his Mac.
- Report: `docs/sessions/n200-lane66-step4-measure_2026-11-17.md`. Do not stop. Step 5 is one commit that a revert removes whole, and nothing merges before the desk has read these numbers.

### Step 5. Every sung reading counts, as a kept reading counts today. One commit.

**Done when: for a reading judged outside and not kept, MELODY, INSIGHTS, the VOICE pane, and the chart give exactly what they give today for the same reading kept.** The only things that still tell the two apart are the summary's note and the "Beyond Ilya's reference values" mark, which follow `plausibilityOverride` as today.

**Every site that decides whether a reading is used, and what depended on their agreeing** (`docs/memory/CONTRACT.md` section 4):

| Site | Today |
|---|---|
| `voice/engine/plausibility.ts:317-319`, `isUsable` | false for an `implausible` reading not kept |
| `voice/engine/derivations.ts:86`, inside `usableAnchor` | the same test, inline |
| `voice/engine/resolve-values.ts:132`, `:148` | fR1 and fR2 enter the snapshot only when `isUsable` |
| `voice/engine/resolve-values.ts:206-212` | the excluded vowels are listed, take stand-ins, and are reported for a retake (`voice/engine/stand-ins.ts:191`, `:233-236`) |
| `insights/InsightsPane.svelte:245` | the vowels INSIGHTS calls measured |
| `voice/profileStore.ts:196-197`, `usableReadingCount` | the count the VOICE pane and its doors read |
| `voice/outside.ts:22`, `outsideVowels`, read at `voice/CalibrationWizard.svelte:329` | the summary's note: the stored verdict, not kept |

They agreed so that the note and the documents could not disagree (`voice/outside.ts:8-10`). After this step no site but the note reads the verdict.

- The verdict stops gating: the test of use becomes "a sung reading" at every site of the table but the last. With that, the `implausible` list is always empty and the `'implausible'` retake reason is never made. Remove what no longer has meaning (`isUsable`, the list, the reason) and say what you removed; `analysis/stand-ins-snapshot.test.ts:19`, `:103` pin the list today (review). Keep the name `usableReadingCount` (`components/Drawer/voice-pane-usable.test.ts:19-20` pins it in `+page.svelte`, review).
- **One test of "sung"** for the count, INSIGHTS, and the snapshot: a number above zero and not an estimate. Today three sites use three tests (`voice/profileStore.ts:197`; `voice/engine/resolve-values.ts:132`; `voice/chart/zones.ts:83`, review), and `voice/engine/analyze.ts:176` can write `f1: 0` (review). One exported predicate, used by all three.
- **The note names a reading stored with no verdict.** `judgeUnchecked` judges such a reading only inside `resolveVowelValues` (`voice/engine/resolve-values.ts:48-62`, `:103`), where after this step its verdict gates nothing. The note reads the judged copy: `outsideVowels(judgeUnchecked(profile), ALL_VOWELS)` at `voice/CalibrationWizard.svelte:329`, with one import line (the wizard goes to 1121 of 1126). The review checked that Keep then works on such a reading (`voice/engine/plausibility.ts:328`; `voice/engine/resolve-values.ts:51`) and that the typed sentence stays true, because the union window contains every type's window. `checkPlausibility`, `outsideVowels`, `keepOutside`, and `keepReading` are unchanged. No string changes.
- Each site of Step 0's census is brought to the same rule. Say what each became.
- **Tests.** The review found these pinning the exclusion; each moves to the expectation its file already holds for a kept reading: `analysis/analyze-score-adapter.test.ts:111`, `:247`, `:414-420`; `analysis/stand-ins-snapshot.test.ts:15-20`, `:98-104`; `voice/chart/finish-early.test.ts:54-57`, `:64-67`; `components/Drawer/voice-pane.test.ts:44-52`; `components/Drawer/voice-pane-usable.test.ts:10-14`; `voice/profileStore.test.ts:104-115`; `voice/engine/plausibility.test.ts:184-200`. Templates for the kept case: `analyze-score-adapter.test.ts:172-177`, `stand-ins-snapshot.test.ts:22-32`, `finish-early.test.ts:69`. Add one test of the "Done when" sentence itself, over the adapter golden's grid: for each profile with an outside reading, the snapshot equals the snapshot of the same profile with that reading kept.
- Regenerate `analysis/__golden__/adapter-snapshots.json` in this commit (`UPDATE_ADAPTER_GOLDEN=1`; `analysis/adapter-golden.test.ts:41`). Expectation, to confirm and report: only the "bad i (1063), no override" entries differ, and each now equals what the same voice gives with that [i] kept. A wider difference is a finding: stop and report.
- Step 4's runner, run again: "set aside" is zero; "judged outside" is unchanged.
- Run gate 4 whole at the end of this step.

### Step 6. A recorder build for this lane. The last change.

`vercel.json:3` and `:47-49` name `cloud-lane-52`, `cloud-lane-62`, and `cloud-lane-64`. Replace the three with `cloud-lane-66` in both places. The review read the pin at `voice/engine/capture-file.test.ts:135-139` as accepting one branch; confirm it. Push this step and the last report together, so the lane makes one build.

## 4. Owns and leaves

**Owns:** the comment sites of Step 1; `voice/engine/capture-file.ts` and its test (the panel only); `components/Drawer/sections.svelte.ts`, `sections.test.ts`, and `components/Drawer/VoicePane.svelte` (Step 3 only); the new runner under `tools/n200-score/` and that folder's `vitest.config.ts`; for Step 5: the sites of its table and of Step 0's census, the one new predicate, `voice/engine/stand-ins.ts` (the list and the reason only), the header of `voice/outside.ts`, two lines of `voice/CalibrationWizard.svelte` (one import, and `:329`) with its comments, the test files Step 5 names, and the adapter golden; `vercel.json`; the e2e files named; this lane's reports and pictures.

**Leaves:** every string in `i18n.ts` (no new key, no changed word); `voice/engine/divergence.ts`, `path-extract.ts`, `analyze.ts`, `live.ts`, `extract.ts`; `voice/chart/measure-switch.ts` and `stub-switch.ts`; the bands, `checkPlausibility`, and the fit itself (`fitWithoutOutliers`); the bodies of `withPlausibility` and `withIghPass`; stored data (nothing is rewritten at load); everything under `docs/memory/`.

## 5. Constraints

No new dependency; no new key; line ceilings hold. Push only `cloud-lane-66`; open no pull request; never push `Shane`. Do not edit, rename, or replace a brief. NOT ESTABLISHED beats a complete invented answer.

## 6. Reports

`docs/sessions/report-code-lane66-step<N>_r1_<date>.md`; pictures in `docs/sessions/report-code-lane66-pictures/`; look at every picture before you push it. The last report carries the eight gates and, with `PW_CHROMIUM_PATH` set to the pre-installed Chromium, the Playwright suites: desktop `voice-pane`, `voice-stations`, `voice-links`, `insights-links`, `calibrate-new`; phone `voice-stations`, `insights-links`.

## 7. Not in this lane, and what the desk could not establish

- **The far-off [ɨ] choice.** Dann ruled a third choice at the summary for a far-off [ɨ], "use Ilya's estimate for now" (`docs/memory/OPEN.md:3800-3801`); `calib.summary.outsideIgh` has no reader (`i18n.ts:1344-1345`). After Step 5 a sung [ɨ] is used wherever it falls, and until that choice is built the singer's way back to the estimate is to sing [ɨ] again. Its own lane follows this one. Build none of it here.
- **Stored statuses.** A voice stored before lane 64 keeps `reading: 'provisional'` on readings the old rules demoted. Nothing rewrites it: the mark clears when the vowel is sung again, and a rewrite at load would be written for every voice at the next save (`voice/profileStore.ts:314-329`). DESK DEFAULT: left as it is.
- **Lane 63's second fix** (a phone word tap with the ANALYSIS head missing): whether any path reaches it is NOT ESTABLISHED. Not in this lane.
- Why `?measure=shipped` gave `path` on Dann's iPhone on 2026-11-17. Step 2 makes the next walk able to show it.
- The bands themselves (`voice/engine/plausibility.ts:1-279`, not read by the desk). A separate lane checks them against Bozeman's second edition.
- Whether the adapter golden holds a kept twin for each "bad i (1063), no override" entry, and whether its difference is confined as Step 5 expects.
- Whether any seeded e2e store gains a summary note once the note reads the judged copy (the second review could not establish it). If one does, report it; the note is then telling the truth.

## 8. What changed from r1, and why

- **Step 5 (r1's Step 6).** r1 removed the exclusion and named too few of the things it moved. r2 answered the first review with a guard: an outside reading counted for its own vowel only, and Ilya's estimates for the other vowels stayed off it until Keep. The second review found that guard needed four more special cases (a second derivation loop at `voice/engine/stand-ins.ts:214-232`; two meanings of "any vowel sung"; the pane's sentence and its door following different counts; a caption). Dann, shown the case the guard was for, said that such input may break Ilya (section 2). So r3 takes the first review's own prescription: the documents treat an outside reading exactly as they treat a kept one today. The behaviour already exists and is already tested.
- **Step 4 (r1's Step 5) re-posed** on the first review's blocker B1 and the second review's amendments 4 to 6: the cross-type run, truth from the set, what moves and in which direction, two counts, a variable of its own for the folder run.
- **r1's Step 4 (stored statuses) removed:** doing nothing costs a stale mark on a few devices, and the rewrite could not be undone.
- The note reads the judged copy; one predicate for "sung"; the tests that pin the exclusion named; gate 4 whole at the end of Step 5; the wizard trap and three ceilings named.
- Step 3: the id named, the fallback dropped, one more phone test, what changes on a desk said.
- Step 1: two more sites, the stub outcome kept, a standing line on comments.
- Step 2: the sidecar's fallback said to stay; card lines for the last take's picker and for what the address said, read inside `mountRecorderPanel`.
- Corrected desk errors in r1: `vercel.json:47-49`, not `:49-51`; the function is `resolveVowelValues`, not `resolveValues`.
