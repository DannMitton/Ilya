# Brief to Code: lane 63, the clean-ups owed by the reviews of lanes 61 and 62

r1, 2026-11-17 10:0x, written by the desk (Opus 5.5) from Fable's two reviews as built: `docs/sessions/review-fable-lane61-as-built_r1_2026-11-16.md` (fixes after merge 1 to 4) and `docs/sessions/review-fable-lane62-as-built_r1_2026-11-17.md` (fix 4). For a cloud Code session on branch `cloud-lane-63`, cut from the tip of `Shane` (the desk names the commit in the prompt; `77555a06` or later).

Paths are under `apps/web/src/lib/` unless they begin with `tools/`, `docs/`, or `e2e`. The desk read every cited line at `Shane` `77555a06`. Step 0 re-reads them on your tip.

## 1. What the singer gets

1. An empty note picker in "Describe your voice" draws the clef of the singer's declared voice type, so a bass sees a bass clef before he picks a note, as he does after.
2. A bass who picks a letter first starts in octave 3, not octave 4.

Nothing else changes for a singer.

## 2. The ruling behind item 1

Dann 2026-10-09, "THE NOTE PICKER'S CLEF FOLLOWS THE SINGER'S VOICE TYPE" (`docs/memory/OPEN.md`; quoted at `voice/note-picker.ts:45-55`): bass, bass-baritone, and baritone take the bass clef; tenor and the treble voices take the treble clef; no type, "Not sure", or a type this build does not know keeps the pitch rule. Today the rule reaches only a picker that holds a note: `voice/NotePicker.svelte:122` reads `let clef = $derived(value ? clefFor(value, voiceType) : 'treble');`, so an empty picker is treble for every type. Fable found this in lane 61's picture `step2-desk-en-range-link-landing.png` (INSIGHTS reads BASS beside six treble clefs); it was equally true before lane 61.

## 3. Steps

Each step is its own commit and report section, test first where a test applies, then pushed. After each step run only the tests of the files that step changed; run all eight gates and the named Playwright suites once, at the end (the desk rule of 2026-11-16 02:4x, `docs/memory/ENVIRONMENT.md`, "LEARNED BY THE 2026-11-16 OPUS DESK"). Baseline gate 4 on the tip: 6544 passed, 1 skipped (6545) with Python, numpy, and scipy present; 6540 passed, 5 skipped without them (`tools/n200-score/burg-fixtures.ts:17`).

### Step 0. Read and report. Change nothing.

The gates with counts; every cited line re-read on your tip.

### Step 1. The empty picker's clef and starting octave.

- `voice/NotePicker.svelte:122`: the empty state takes `clefForVoiceType(voiceType) ?? 'treble'` (`voice/note-picker.ts:54`, exported).
- `voice/NotePicker.svelte:68` (`let stagedOctave = $state(4);`): start at 3 when `clefForVoiceType(voiceType)` is `'bass'`, otherwise 4. DESK DEFAULT: octave 3 is the middle of the bass clef's own staff (`MIDDLE_LINE.bass` is D3, `note-picker.ts:36`). If the voice type changes while the picker is empty, the staged octave follows it; once the singer has set an octave, it stays.
- Put the decision in a pure function in `voice/note-picker.ts` with unit tests: for each declared type (bass, bass-baritone, baritone, tenor, mezzo-soprano, soprano, contralto, countertenor, "Not sure", none, an unknown type) the empty clef and the starting octave.
- Out of scope, listed for the desk: a "Not sure" singer who typed "bass" in Other prints BASS on INSIGHTS (`voice/voiceTypes.ts:86-89`) while `clefForVoiceType` returns null. The 2026-10-09 ruling keeps the pitch rule there; change nothing.
- Pictures: 390 by 844 and 1440 by 900, English: "Describe your voice" open and empty for a bass, a tenor, and a voice with no type; the same bass with one note set.

### Step 2. Stale comments and one guard.

- Comments naming the deleted `InsightsIntake.svelte` or the removed `.charx-heading`: `voice/VoiceTypeIntake.svelte:10`, `:129`, `:147`; `voice/intake-symbols.ts:5`. Rewrite each to name what is there now (`DescribeVoice.svelte`, `InsightsShares.svelte`, `IntakeScale.svelte`), or delete it if it no longer explains anything. If `.charx-heading` styles nothing, remove the rule it labels.
- `components/Drawer/Drawer.svelte:408`: `if (restoreQueued) restoreYields = true;` runs before the target is looked up (`:409`). Set it only when the target element is found, so a link whose target is missing does not cancel the takeover's scroll restore. Unit or e2e test: a reveal whose selector finds nothing leaves the restore to run. `Drawer.svelte` has 4 free lines (1,986 of 1,990, `scripts/ratchets.json`); raise no ceiling.

### Step 3. The scoring tool's config.

`tools/n200-score/vitest.config.ts:7` documents an unfiltered command, and `:32` now includes `golden.run.ts` (468 s) and `burg-check.run.ts` (needs Python with numpy and scipy, no skip guard). Make the unfiltered command run only the tool's tests: each `*.run.ts` runs when named on the command line or when its environment variable is set (follow `score.run.ts`'s `N200_DIR` pattern), and `burg-check.run.ts` skips with a printed reason where `havePython` is false (`tools/n200-score/burg-fixtures.ts:17`). Correct the header to list every runner and how to start it. Not a gate.

### Step 4. Lane 61's two pictures.

`docs/sessions/report-code-n203-lane61-pictures/step1-desk-en-both-open.png` and `step1-desk-fr-both-open.png` show "Describe your voice" closed. Retake both at 1440 by 900 with both stations open, under the same names. Look at each before you push.

## 4. Owns and leaves

**Owns:** `voice/NotePicker.svelte`, `voice/note-picker.ts` and its test; `voice/VoiceTypeIntake.svelte` and `voice/intake-symbols.ts` (comments and the dead CSS rule only); `components/Drawer/Drawer.svelte` (the line at `:408` and its test); `tools/n200-score/vitest.config.ts`, `golden.run.ts`, `burg-check.run.ts`; the two pictures; this lane's reports and pictures.

**Leaves:** every string; `voice/voiceTypes.ts`; `voice/DescribeVoice.svelte` beyond what passing `voiceType` needs (it passes it today, `DescribeVoice.svelte:67`); everything under `docs/memory/`; every engine file.

## 5. Constraints

- No new dependency, no new English or French, no key added. Line ceilings hold.
- Push only `cloud-lane-63`; open no pull request.
- Do not edit, rename, or replace a brief.

## 6. Reports

`docs/sessions/report-code-lane63-step<N>_r1_<date>.md`, pictures in `docs/sessions/report-code-lane63-pictures/`. Each: what changed with file and line, tests, the changed files' test counts, what you could not establish. The last report carries the eight gates and the Playwright suites `voice-pane`, `voice-stations`, `voice-links`, `calibrate-new`, and the phone `voice-stations`.

## 7. What the desk could not establish

- Whether any other screen draws an empty `NotePicker` (grep `NotePicker` on your tip and list each mount).
- Whether octave 3 suits a baritone's first pick as well as a bass's; the ruling gives the baritone the bass clef, so the brief treats them alike.
