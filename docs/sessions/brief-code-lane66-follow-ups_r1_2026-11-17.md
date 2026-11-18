# Brief to Code: lane 66, the follow-ups of lanes 63, 64, and 65

r1, 2026-11-17 21:3x, written by the desk (Fable 5.2). Not yet reviewed. For a cloud Code session on branch `cloud-lane-66`, cut from the tip of `Shane` (the desk names the commit). No other lane is running.

Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `tools/`, `docs/`, or are `vercel.json`. The desk read every cited line at `Shane` `2201330b`. Step 0 re-reads them on your tip.

## 1. What the singer gets

1. **Every vowel a singer sang reaches MELODY and INSIGHTS.** Today a reading that sits outside Ilya's reference values is shown as Captured, and MELODY and INSIGHTS still ignore it and use a stand-in until the singer presses Keep. After this lane the documents use what the singer sang. The summary still names such a reading once, with Keep or sing again; Keep quiets the note and changes nothing else.
2. **A voice recorded before lane 64 shows the status its own takes earned.** A reading that an old rule marked Provisional, on a clear take, shows Captured.
3. **On a phone, the VOICE pane's three rows open one at a time.** Opening "Describe your voice" closes an open "Choose a voice type", and the reverse.

For the desk's next phone walk, and never seen by a singer:

4. The recorder panel names the picker of the session in use and the picker stamped on the last take, and a recorder build exists for this lane.

And for the people who read the code next: every comment that still states a rule Dann has ruled out is corrected.

## 2. The rulings

| When | Words | What it rules |
|---|---|---|
| 2026-11-13 12:29 to 12:34, `docs/memory/PRODUCT.md:1270` | "The neighbourhood is a description set beside the reading, never applied to it. It never demotes, discards, or blocks a reading." (clause offered by the desk, ruled by Dann) | Item 1. |
| `docs/memory/PRODUCT.md:1273` | "Insights' use of \"plausible or kept\" readings changes with it and is measured before it ships." | Step 5 comes before Step 6, and the desk reads Step 5's numbers before any merge. |
| 2026-11-13 12:16, `docs/memory/OPEN.md:3799` | Dann: "a user-provided sample is real data versus our placeholder data which is generic and impersonal" | Item 1: a stand-in never replaces a sung reading. |
| 2026-11-13 12:34, `docs/memory/PRODUCT.md:1269` | "The status is the measurement's own." Captured or provisional comes from the quality of the evidence alone, never from a band. | Item 2. |
| 2026-11-13 15:11, `docs/memory/OPEN.md:3800` | Dann: "My anchor \"rule\" feels like something you imposed form somethig I said." | Step 1: no comment calls anything "Dann's locked anchor rule". |
| 2026-11-17 15:04, `docs/memory/INBOX.md:823` | three equal full-width rows | Item 3: three of a kind behave alike (DESK DEFAULT on the phone rule). |

## 3. Steps

Each step is its own commit and its own report section, test first where a test applies, then pushed. After each step run only the tests of the files that step changed. Run all eight gates and the named Playwright suites once, at the end. Gate 4 baseline at `2201330b`: 6589 passed, 1 skipped (6590) with Python, numpy, and scipy; 6585 passed, 5 skipped without (derived, not run).

### Step 0. Read and report. Change nothing.

- The eight gates with counts. Every cited line re-read. Line counts against `scripts/ratchets.json` for every file you will touch; `voice/CalibrationWizard.svelte` stood six lines under its ceiling at lane 64.
- **A census for Step 6.** Every reader of `isUsable`, `usableAnchor`, `plausibility === 'implausible'`, `plausibilityOverride`, `resolveValues`' `implausible` list, and `StandInReport.retake` with reason `'implausible'`; and every string a singer reads that one of those readers prints. A table: site, what it decides, what prints.
- **A history check for Step 4.** Which rules have ever written `reading: 'provisional'` on a measured reading (`git log -S`, and the tree). The desk knows three: low confidence (`voice/engine/analyze.ts:173`), the plausibility guard, and the [ɨ] pass. If you find a fourth that wrote Provisional at medium or high confidence, say so and do not build Step 4.
- Whether anything renders or lists `STATION_IDS` (`components/Drawer/sections.svelte.ts:76-78`), so that a new id would appear somewhere on screen.
- The users of the stub outcome `provisional-divergent` (`voice/engine/stub.ts:66-69`).
- Which test pins the shape of `vercel.json`.

### Step 1. Comments that state a rule Dann has ruled out. No code change, no test change.

Rewrite each to say what the tree does now: the verdict and the divergence describe a reading and never change its status (`docs/memory/PRODUCT.md:1269-1270`). Keep each file at or under its line ceiling; a rewrite never adds lines to `voice/CalibrationWizard.svelte` or `apps/web/src/routes/+page.svelte`.

- `voice/engine/types.ts:59-60`: "an implausible reading resolves to Provisional at the wizard boundary".
- `voice/engine/session.ts:38-41`: "a divergent velar-i resolves to provisional".
- `voice/CalibrationWizard.svelte:248-261`, above `withIghPass`: "resolves [ɨ] to Provisional (Dann's locked anchor rule)" and "a downgraded [ɨ]". The label goes with the rule.
- `voice/CalibrationWizard.svelte:647-648`, in `commitReading`: "a divergent [ɨ] that the pass resolved to Provisional".
- `voice/engine/plausibility.ts:322-325`, above `keepReading`: "undoing only the guard's demotion".
- `voice/engine/derivations.ts:72-75`: "The locked anchor rule (a Provisional [i]/[u] resolves [ɨ] to Provisional) ... not yet wired".
- `voice/engine/capture-file.ts:104`: names `?measure=open` and `?measure=path` and not the default.
- `apps/web/e2e-phone/path-picker-time.test.ts:11`: "the median without it"; without it is now the path picker.
- `components/Drawer/reveal-scroll.ts:32`: "a station under the VOICE pane's doors". The stations stand above the doors.
- `apps/web/src/routes/+page.svelte:4179-4180`: the pane's contents and order.
- `voice/chart/ratified-strings.test.ts:2`: the header says the file pins the calibration screen's and the sheet's strings; it pins the wizard's voice type line too.
- `voice/NotePicker.svelte:20-23`: the header says the clef is chosen per note by pitch (stale since lane 63).
- `tools/n200-score/vitest.config.ts`, the header's runner list: add `N200_GOLDEN=write-path` and `N200_SET=third`, which lane 64 added.
- `voice/engine/stub.ts:66-69`: if Step 0 shows only tests of the old demotion use `provisional-divergent`, retire it with them and say so; otherwise correct its comment and leave it.

### Step 2. The recorder panel follows the session.

`mountRecorderPanel` returns when the panel exists (`voice/engine/capture-file.ts:224`), before it sets `panelPicker` (`:225`), and the card's line is written once (`:236`). The wizard builds a session each time it mounts (`voice/CalibrationWizard.svelte:205`), and each call reads the address again (`voice/chart/stub-switch.ts:29-32`). So the panel can name a picker that is no longer the one in use.

- Every call sets the picker and rewrites the face and the card's line, whether or not the panel exists.
- The card gains one line: the picker stamped on the last held take (`rec.picker`, `:105`, held by `holdCapture`, `:145`), or "no take yet". That stamp is the evidence itself.
- The default is `'path'` at `:198` and `:223`, and in the pin at `voice/engine/capture-file.test.ts:173`.
- `capture-file.ts` still imports only `./analyze` and `./extract`. English only. Pure functions for the words, tested as `panelFace` is; the tree has no DOM test environment.

### Step 3. On a phone, the three rows open one at a time.

The voice type row's open state is local (`components/Drawer/VoicePane.svelte:56`), so the station tier's rule (`components/Drawer/sections.svelte.ts:420-423`) does not reach it. Lane 65 reported both open together (`docs/sessions/report-code-lane65-step1_r1_2026-11-17.md`).

- DESK DEFAULT, design: the row becomes a station of the tier with its own id, in `STATION_IDS` (`:76-78`) and `UNPERSISTED_STATIONS` (`:65`), so one rule and one owner decide all three rows. It stays closed on arrival and is never stored. Its markup keeps `data-vp-row="voiceType"` and `#voice-type-body`, so no `[data-station]` selector finds a third station.
- If Step 0 shows that a new id would appear anywhere on screen or in storage, do not add the id. Close the rows against one another inside `VoicePane.svelte` and say that you did.
- On a desk nothing changes: `exclusive` is false there.
- Tests: `sections.test.ts` (opening the row under `exclusive` shuts an open station, and the reverse; the row is never written to storage); `apps/web/e2e-phone/voice-stations.test.ts` (type row open, then Describe: the type row is closed); `apps/web/e2e/voice-pane.test.ts` unchanged in meaning.
- Pictures, 390 by 844, English and French: the type row open; then Describe opened, with the type row closed.

### Step 4. A stored voice shows the status its own evidence earns.

Lane 64 stopped the guard and the [ɨ] pass from demoting, and it re-measured nothing. A voice stored before it keeps `reading: 'provisional'` on readings those two rules demoted.

- One pure function in a `.ts` module: for a reading with `source: 'measured-user'`, `reading: 'provisional'`, and `confidence` other than `'low'`, the reading is `'captured'`. It is the rule of `voice/engine/analyze.ts:173` and `voice/engine/plausibility.ts:328`. It promotes only. It never touches `'estimated'`, `confidence`, `plausibility`, or a number.
- Apply it once, where a stored voice's readings enter the app (`voice/profileStore.ts:245-258` is where the store is read; name the site you choose and why every reader passes through it). Nothing is written at load; the stored copy changes when that voice is next saved.
- Condition: Step 0's history check. A fourth rule means this step is not built.
- Tests: the function, case by case; a stored voice with a demoted [ɨ] and a demoted outside reading loads with both Captured; a low-confidence reading stays Provisional.

### Step 5. Measure what the exclusion does today. A report and a runner; nothing that ships changes.

The question, in numbers: of the readings a singer gives, how many does the guard set aside from MELODY and INSIGHTS today, by voice type and vowel, and how far is the stand-in from the reading it replaces?

- A runner under `tools/n200-score/` (a `*.run.ts`, by file name only, in no gate). Input: the path picker's readings of the 600 primary takes and of the third set (the goldens), each judged by `checkPlausibility` with its own voice type, and again with no type.
- For every reading judged `implausible`: the value `resolveValues` gives that vowel today (the stand-in) and the distance from the reading, in semitones, for fR1 and fR2.
- A table by voice type and vowel: takes, readings, judged outside, median and largest distance. Say plainly what the sets cannot show (they are synthetic; no contralto, countertenor, or bass-baritone bands exist).
- The runner also takes a folder of the recorder's files (`N200_DIR`), so the desk can run it on Dann's takes on his Mac. Its output goes beside the folder, never into the repository.
- Report: `docs/sessions/n200-lane66-step5-measure_2026-11-17.md`. Do not stop: go on to Step 6. The desk reads the numbers before any merge.

### Step 6. Every reading a singer sang reaches MELODY and INSIGHTS.

**Every site that computes "may the documents use this reading", and what depended on their agreeing** (`docs/memory/CONTRACT.md` section 4):

| Site | Today |
|---|---|
| `voice/engine/plausibility.ts:317-319`, `isUsable` | false for an `implausible` reading not kept |
| `voice/engine/derivations.ts:86`, inside `usableAnchor` | the same test, inline |
| `voice/engine/resolve-values.ts:132`, `:148` | fR1 and fR2 enter the snapshot only when `isUsable` |
| `voice/engine/resolve-values.ts:206-212` | the excluded vowels are listed and take stand-ins (`voice/engine/stand-ins.ts:191`, `:234`) |
| `insights/InsightsPane.svelte:245` | the vowels INSIGHTS calls measured |
| `voice/profileStore.ts:196-197`, `usableReadingCount` | the count the VOICE pane's sentence and doors read |
| `voice/outside.ts:22`, `outsideVowels` | the summary's note: `implausible` and not kept |

They agreed so that the note and the documents could not disagree (`voice/outside.ts:8-10`). After this step the note describes, and the documents never consult the verdict.

- The verdict no longer gates a number: a sung reading's fR1 and fR2 enter the snapshot with source `'sung'`; no stand-in replaces a sung reading; a sung anchor anchors; INSIGHTS counts it as measured; the pane's count includes it.
- `outsideVowels`, `keepOutside` (`voice/CalibrationWizard.svelte:658-668`), and `keepReading` stay as they are: the note names an outside reading until the singer presses Keep or sings it again. No string changes. Rewrite the header of `voice/outside.ts` to say what is now true.
- `judgeUnchecked` (`voice/engine/resolve-values.ts:48-62`) and `checkPlausibility` are not changed: they make the description.
- If Step 0's census finds a line a singer reads that says a reading was set aside or replaced, it is now false. List it with its key. Do not reword it. Stop printing it only where it would be false, and say where.
- Remove `isUsable` if nothing meaningful still calls it; say what you removed.
- Tests: each site, before and after; an `implausible` reading, not kept, reaches `fR1` and `fR2` as `'sung'` and takes no stand-in; Step 5's runner, run again, reports zero readings set aside.

### Step 7. A recorder build for this lane. The last change.

`vercel.json:3` and `:49-51` name `cloud-lane-52`, `cloud-lane-62`, and `cloud-lane-64`. Replace the three with `cloud-lane-66` in both places, and update the test that pins the file. Do it last, so the lane makes one build.

## 4. Owns and leaves

**Owns:** the comment sites of Step 1; `voice/engine/capture-file.ts` and its test (the panel only); `components/Drawer/sections.svelte.ts`, `sections.test.ts`, and `components/Drawer/VoicePane.svelte` (Step 3 only); the new status function, its one call site, and their tests; the new runner under `tools/n200-score/` and that folder's `vitest.config.ts`; the seven sites of Step 6's table and their tests, and the header of `voice/outside.ts`; `vercel.json` and its test; the e2e files named; this lane's reports and pictures.

**Leaves:** every string in `i18n.ts` (no new key, no changed word); `voice/engine/divergence.ts`, `path-extract.ts`, `analyze.ts`, `live.ts`, `extract.ts`; `voice/chart/measure-switch.ts`; the bands and `checkPlausibility` in `voice/engine/plausibility.ts`; `withPlausibility` and `withIghPass` beyond their comments; everything under `docs/memory/`.

## 5. Constraints

No new dependency; no new key; line ceilings hold. Push only `cloud-lane-66`; open no pull request; never push `Shane`. Do not edit, rename, or replace a brief. NOT ESTABLISHED beats a complete invented answer.

## 6. Reports

`docs/sessions/report-code-lane66-step<N>_r1_<date>.md`; pictures in `docs/sessions/report-code-lane66-pictures/`; look at every picture before you push it. The last report carries the eight gates and, with `PW_CHROMIUM_PATH` set to the pre-installed Chromium, the Playwright suites: desktop `voice-pane`, `voice-stations`, `voice-links`, `insights-links`, `calibrate-new`; phone `voice-stations`, `insights-links`.

## 7. What the desk could not establish

- Why `?measure=shipped` gave `path` on Dann's iPhone on 2026-11-17. Step 2 makes the next walk able to show it.
- Whether a rule other than the three named ever wrote Provisional at medium or high confidence (Step 0).
- What a singer reads when `StandInReport.retake` carries `'implausible'` (Step 0's census).
- Whether the synthetic sets group their takes by singer, so that a ten-vowel profile can be built for one synthetic voice. If they do not, judge each take alone and say so.
- The bands themselves (`voice/engine/plausibility.ts:1-279`, not read by the desk). A separate lane checks them against Bozeman's second edition.
