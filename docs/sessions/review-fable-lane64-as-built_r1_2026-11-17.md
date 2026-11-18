# Fable review of lane 64 as built

r1, 2026-11-17. Fable 5.2 subagent, read only. Lane tip `cloud-lane-64` `781ceb30`, against `Shane` `55be2629`. Clone at `/home/claude/r64`; nothing pushed, nothing committed, no pull request. Paths are under `apps/web/src/lib/voice/` unless they begin with `apps/`, `tools/`, `docs/`, or `vercel.json`.

## Verdict

**MERGE WITH NAMED FOLLOW-UPS.** No blocker found. Two items to fix before release (findings 1 and 2), the rest later.

## What I ran and what I did not

- Read: the brief r2 whole, the desk review of the briefs, the reports of Steps 0 to 6, the Step 5 counts, the lane 65 brief (first 60 lines), and the lane's diff of every app file.
- Ran at `781ceb30`: `plausibility-keeps-status.test.ts`, `engine/divergence.test.ts`, `chart/stub-switch.test.ts`: 13 passed (3 files).
- Trial merge of `cloud-lane-65` (`f3061279`) onto `781ceb30`: clean, 0 conflicts. On the merged tree `engine/capture-file.test.ts`, `chart/ratified-strings.test.ts`, `chart/stub-switch.test.ts`, and `engine/open-extract.test.ts`: 34 passed (4 files). Merge aborted and the trial branch deleted.
- NOT ESTABLISHED by me: the eight gates, the Playwright suites, the third-set tables, the goldens' byte equality, the desk's figures for Dann's 13 takes, the phone timings. I took these from the lane's reports and `docs/memory/INBOX.md:824`.

## The eight checks, in short

1. **Steps as written.** Done, with every deviation reported and sound.
   - Step 0: bars copied before any build (Step 0 report, section 5). The third set's definition was missing from r2; the lane rebuilt it from r1 and the desk confirmed it (Step 1 report, first section).
   - Step 1: options in `crossCheck` (`engine/path-extract.ts:205`), each off by default at that step. The lane's reading of "fails R125 or DP" (a track 2 with no peak at all is not a failure, so P3 does not rescue it) is marked DESK DEFAULT and is the narrower reading. Sound.
   - Step 2: one engine edit the brief did not name, the split of `pathFromTracks` into `checkInputs` and `pathFinish` (`engine/path-extract.ts:268`, `:277`, `:291`). It is in an owned file, changes no default, and the lane reports the golden byte-equal and 597 of 597 readings equal. Sound.
   - Step 3: one run, then a stop. The two readings of the bars are stated in the tables.
   - Step 4: `PATH_DEFAULTS` (`engine/path-extract.ts:59`), read at `:175` and `:280`. The tool's `path9` column reads `pathF2` before any check (`tools/n200-score/score-core.ts:204-205`), so the new defaults did not change its meaning.
   - Step 4b: `vercel.json:3` and `:49`.
   - Step 5: as written, plus the desk's addition (recorded at `docs/memory/INBOX.md:824`). The brief's own text says "Change nothing there" of `engine/divergence.ts` and lists it under Leaves; the addition overrides that, and the lane says so.
   - Step 6: the lane merged `Shane` and reports all gates. One gate 8 failure on the way (the wizard at 1128 lines against 1126), fixed by shortening a comment; the file is 1120 lines now.
2. **The default picker.** `chart/measure-switch.ts:14` returns `'shipped'` and `'open'` only on the exact values and `'path'` otherwise. The defaults are `'path'` at `engine/analyze.ts:60`, `:141`, `:145`, `:196` and `engine/live.ts:200`. I grepped every call of `runCapture`, `analyze`, `f1Steadiness`, `new LiveCaptureSession`, `measurePicker`, and `captureSessionFor` under `apps/web/src/lib/voice`, `apps/web/src/routes`, `apps/web/e2e`, `apps/web/e2e-phone`, and `tools`. Every caller either names its picker or is one of three that mean the default: `CalibrationWizard.svelte:205`, `chart/stub-switch.ts:32`, and the new test at `engine/path-extract.test.ts:234`. **No missed caller.**
3. **No demotion.** `engine/divergence.ts:21` and `:24` set `isDivergent` only. The one assignment of a status in the engine is `engine/analyze.ts:173`, from confidence alone. Outside tests, the other writers of `'provisional'` are `engine/plausibility.ts:328` (`keepReading`, from confidence) and the test double `engine/stub.ts:64`, `:69`. Nothing demotes for a neighbour. `withIghPass` deletes the flag at `CalibrationWizard.svelte:270`: confirmed, see finding 5.
4. **The plausibility test.** Brittle, though it fails loudly. See finding 4.
5. **The new test file outside Owns.** Acceptable. See finding 4.
6. **Stale comments.** All four confirmed, and five more found. See findings 1 and 8.
7. **Lane 65.** No file in common (0 of 38 against 39), and the trial merge is clean. One meaning-level overlap, finding 6.
8. **Surprises on a walk.** Findings 2, 3, 7, and 9.

## Findings

### 1. FIX BEFORE RELEASE. Five comments state the old rule as the contract

Each one tells the next lane that a neighbour or a band makes a reading Provisional, which is the behaviour Dann ruled out (`docs/memory/PRODUCT.md:1269-1270`). A comment-only commit, no test change:

- `engine/types.ts:59-60`: "an implausible reading resolves to Provisional at the wizard boundary". The lane owned this file for the `picker` comment only.
- `engine/session.ts:38-41`: "a divergent velar-i resolves to provisional".
- `CalibrationWizard.svelte:253-254` and `:260-261` (above `withIghPass`): "resolves [ɨ] to Provisional" and "a downgraded [ɨ]".
- `CalibrationWizard.svelte:647-648` (in `commitReading`): "a divergent [ɨ] that the pass resolved to Provisional". Not on the lane's list.
- `engine/plausibility.ts:322-325` (above `keepReading`): "undoing only the guard's demotion". Not on the lane's list. The code at `:328` is still right, since status is confidence's alone (`engine/analyze.ts:173`).

Fix: rewrite each to "describes, never changes the status", citing `PRODUCT.md:1269-1270`.

### 2. FIX BEFORE RELEASE, or a recorded ruling that it ships as it is. A reading outside the band is now Captured and is still left out of Markup and Insights

`isUsable` (`engine/plausibility.ts:317`) and `usableAnchor` (`engine/derivations.ts:86`) still exclude a reading judged implausible, and `engine/resolve-values.ts:206-212` then gives that vowel a stand-in. Before the lane the singer saw Provisional and the summary note; now the singer sees Captured and the summary note (`outside.ts:22`), and the documents still ignore the reading until Keep is pressed. Clause 3 of the ruling says the neighbourhood "never demotes, discards, or blocks" (`PRODUCT.md:1270`), and `PRODUCT.md:1273` names this as owed: "Insights' use of 'plausible or kept' readings changes with it and is measured before it ships". For the four vowels with no published band the window comes from the singer's own anchors (`engine/types.ts:55-57`, `CalibrationWizard.svelte:292`), so a neighbour can still set a reading aside from the documents. The exact window is NOT ESTABLISHED; I did not read the body of `engine/plausibility.ts`. All of this is outside the lane's Owns list and is not a fault of the lane.

Fix: a lane that measures and then removes the exclusion, or Dann's word that it ships as it stands.

### 3. LATER (for Dann to know before a walk). Readings stored before the lane keep the old demotion

The lane re-measures nothing and rewrites no stored status. An [ɨ] the old pass made Provisional, or a reading the old band made Provisional, stays Provisional in a stored voice until it is sung again or kept. On a walk with an existing voice, [ɨ] can still show Provisional and look like the fix failed. A fresh voice shows the new behaviour.

Fix, if wanted: at hydration, for `source: 'measured-user'`, set `reading` from `confidence` (low is Provisional, anything else Captured), the same rule as `engine/analyze.ts:173` and `engine/plausibility.ts:328`. Whether older stored readings always followed that rule is NOT ESTABLISHED, and it rewrites stored data, so it needs Dann's yes.

### 4. LATER. The plausibility test is brittle; its file is acceptable

`plausibility-keeps-status.test.ts` cuts `withPlausibility` out of the `.svelte` source by brace counting (`:13-19`), removes two type annotations by exact string (`:21-22`), and runs the text through `new Function` with seven hand-listed closure names (`:26-27`).

- It fails loudly, never silently: a renamed function throws at `:14`; a changed signature leaves TypeScript in the text and `new Function` throws; a new closure variable throws a ReferenceError.
- It breaks on harmless edits: a reformatted signature, any `as` or type annotation in the body, a brace inside a string or comment, a new helper in scope.
- It tests the function with `anchorF1sFor` stubbed to return nothing and an empty profile (`:27`), so the anchor path is not covered.
- Its fourth test (`:52-55`) asserts on source text, not behaviour.

Better form: move the pure part to a `.ts` module, for example `withVerdict(vowel, formant, voiceType, anchors)` in `outside.ts` or beside `checkPlausibility`, returning the clone and the event; the wizard calls it and logs. The test then imports it, covers the anchors, and the wizard loses about ten lines against a ceiling it sits six lines under (`scripts/ratchets.json:14`). `engine/plausibility.ts` was under Leaves, so the lane could not do this.

The file outside Owns: acceptable. The brief requires the test (Step 5, third bullet), no component test exists, the stub's readings are all inside the bands, and the lane reported the file in two reports. It collides with nothing in lane 65.

### 5. LATER. `withIghPass` now does nothing a reader can see

It clones [ɨ], sets `isDivergent`, and deletes it (`CalibrationWizard.svelte:268-270`). No file reads the field (grep: only `engine/divergence.ts`, its test, and the two comments). So the deletion costs nothing today. It will matter when `calib.summary.outsideIgh` (`apps/web/src/lib/i18n.ts:1344`, used by no component yet) is wired: the summary will need the description.

Fix, at that lane: compute the description where it is shown, from the profile at that moment, and drop the stored flag and the per-mutation pass. A stored flag can go stale; a computed one cannot.

### 6. LATER. After both lanes merge, lane 65's recorder panel defaults to `'shipped'`

Lane 65 adds `let panelPicker: Picker = 'shipped'` and `mountRecorderPanel(picker: Picker = 'shipped')` in `engine/capture-file.ts`, and pins the second in `engine/capture-file.test.ts` (lane 65 diff). The one caller passes `measurePicker(search)`, so the panel names the right picker today. A caller that leaves the argument out would name `shipped` while the path picker reads.

Fix, after both merge: default `'path'` in both places and in the pinned test. Lane 65 also owns the stale line at `engine/capture-file.ts:104`.

### 7. LATER. The re-take rule now protects a Captured reading the band calls outside

`capture-ritual.svelte.ts:301-303`: a Provisional re-take never replaces a Captured reading. Before the lane an outside reading or a divergent [ɨ] was stored Provisional, so any re-take replaced it. Now it is stored Captured, so a less clear re-take is rolled back and the first reading stays. This follows the ruling (status is the measurement's own), and it is a change a singer can meet after "sing them again" (`apps/web/src/lib/i18n.ts:1340`).

Fix: none needed; Dann is told.

### 8. LATER. Other stale lines

- `engine/capture-file.ts:104`: names `?measure=open` and `?measure=path` and not the default. Confirmed.
- `engine/derivations.ts:72-75`: "a Provisional [i]/[u] resolves [ɨ] to Provisional ... not yet wired". Confirmed; wrong twice now.
- `apps/web/e2e-phone/path-picker-time.test.ts:11`: "the median without it"; without it is now path.
- `engine/stub.ts:65-69`: `provisional-divergent` scripts high confidence with a Provisional status, a state the engine can no longer produce. A test double; rename or retire it with the tests that use it.
- `vercel.json:3`, `:49`: `cloud-lane-64` stays in the build command and the branch list after the merge, beside 52 and 62. Harmless; remove the three together.

### 9. LATER. Two things nobody has seen on a phone

- `?measure=shipped` selecting the shipped picker: on 2026-11-17 five takes sung after opening it were read by path, cause NOT ESTABLISHED (`docs/memory/INBOX.md:824`). The picker is fixed when the wizard mounts (`CalibrationWizard.svelte:205`). Lane 65's panel will show which picker is in use.
- The time bar: met by bound only. The path median was 258.5 ms, so path cannot exceed shipped by 1,000 ms whatever shipped is. The reasoning holds; the shipped median is NOT MEASURED.

## What I could not establish

- Anything about a real voice: whether R125, DP, or P3 helps or harms one, and the plausibility count on Dann's takes.
- The eight gates and the Playwright suites on `781ceb30` (another helper measures them).
- The desk's message to the lane; I read its record at `docs/memory/INBOX.md:824` only.
- Tokens used: not known exactly; my estimate is 150k, under the cap.

Terms: "by bound" is the desk's; R125, DP, and P3 are Fable's from the earlier review; "meaning-level overlap" is mine.
From memory: the house-style rules shaped the wording; nothing else was used. Nothing new worth saving.
