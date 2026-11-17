# Fable review of lane 63 (clean-ups) as built

Filed verbatim by the desk 2026-11-17 11:0x. Fable 5.2 subagent, read only; harness count 143,215 tokens, 20 tool uses, 3.6 min (cap 300k). Lane `cloud-lane-63` at `57a01271` on `Shane` `240fe5ab`.

REVIEW OF LANE 63 AS BUILT (origin/cloud-lane-63 57a01271 on origin/Shane 240fe5ab). Read only; scratch in /tmp/l63 and /tmp/l63-nopy.

VERDICT: MERGE

BLOCKERS
None.

WHAT I CHECKED

A. Step 1.
- Empty clef: `NotePicker.svelte:126` reads `value ? clefFor(value, voiceType) : start.clef`; `start` is `emptyPickerStart(voiceType)` (`:72`). `note-picker.ts:81-84` returns `clefForVoiceType(voiceType) ?? 'treble'` and octave 3 for bass, otherwise 4. This matches the ruling (`docs/memory/OPEN.md:2986`, quoted at `note-picker.ts:44-53`) and the brief's section 2.
- Octave: `stagedOctave` is `null` until set (`:71`); `curOctave` is `value ? value.octave : (stagedOctave ?? start.octave)` (`:75`). Only `setOctave` (`:101-104`) and `clear` (`:105-110`) assign it, so it follows a type change exactly until the octave control or Clear is used.
- A picker that holds a value: the `value` branches at `:75` and `:126` are the pre-lane expressions; unchanged.
- Run: `vitest run note-picker.test.ts reveal-scroll.test.ts intake-symbols.test.ts` in /tmp/l63: 3 files, 54 passed.
- Picture viewed: `step1-desk-en-bass-empty.png` shows a bass clef and octave 3 on an empty picker for a bass.

B. Step 2.
- Comments: `VoiceTypeIntake.svelte:10`, `:129-131`, `:148` and `intake-symbols.ts:5` now name `IntakeScale.svelte`, `DescribeVoice.svelte`, `InsightsShares.svelte`. Confirmed true: `IntakeScale.svelte:7` gives the radio-group reason, `:12` imports `stemParts`, `:66` has `.intake-option`; `DescribeVoice.svelte:75` uses `.dv-heading`. No `InsightsIntake` or `charx` remains in either file (grep). `.vt-legend` rule kept at `:149`, used at `:65` and `:88`.
- Guard: `reveal-scroll.ts:57-59` returns `restoreQueued && targetFound`; `Drawer.svelte:406-407` looks the target up first, then sets `restoreYields`.
- Word tap: unchanged whenever the ANALYSIS head exists. The head is rendered by `Drawer.svelte:477` (`data-band-head={id}`). See fix 2 for the one edge.
- Ceiling: `Drawer.svelte` is 1,986 lines; ceiling 1,990 (`scripts/ratchets.json:15`).

C. Step 3 (all run in /tmp/l63/apps/web with `node_modules/.bin/vitest`).
- `list --filesOnly`: bare gives the two tests only; `golden.run.ts`, `burg-check.run.ts`, `measure-report.run.ts`, and a path to `measure.run.ts` each give that runner alone; the filter `score` gives `score-core.test.ts` only; `N200_DIR`, `N200_GOLDEN`, `N200_SYNTH_OUT` each add their own runner to the two tests.
- Bare `run`: 2 files, 16 passed, 30.7 s. (The lane's report says 15 passed, 1 skipped; that container had no scipy.)
- `burg-check.run.ts` with a failing `python3` first on PATH: prints the SKIPPED reason, 1 skipped. With scipy present: 1 passed, 37 s.
- Only `vitest.config.ts` and `burg-check.run.ts` changed under `tools/` (diff stat).
- Header: the measure pair's "skips unless both are set" matches `measure.run.ts:28` and `measure-report.run.ts:12`.

D. Step 4. Both pictures viewed (2880 by 1800). Each shows the tail of the Describe station's questions, then the INSIGHTS station header with its chevron open and its body. The "Describe your voice" header is out of frame in both, so that station is shown open by its body only. The lane's Step 4 report says so.

E. Scope and merges.
- Files changed outside reports and pictures: the ten in Owns, no others. No change under `i18n`, `docs/memory`, or any engine file (name-only diff). No string changed (diff read whole: comments, code, tests).
- `git merge-tree --write-tree` onto origin/Shane: clean (tree 652af508). Onto origin/cloud-lane-64 (5e71b591): clean (tree 6e5f7cf4). Lane 64 does not touch `vitest.config.ts` or `burg-check.run.ts`, and adds no new `*.run.ts`.

FIXES AFTER MERGE
1. `tools/n200-score/vitest.config.ts` header, once lane 64 lands: lane 64 adds `N200_GOLDEN=write-path` (lane 64 `golden.run.ts:46-55`) and a third set (`N200_SET=third`, lane 64 Step 2 report line 9). The header names only `write` and `primary|held`. Add both. The `RUNNERS` table needs no change: `N200_GOLDEN` set to any value already includes the golden.
2. Phone word tap with the ANALYSIS head missing in the frame a takeover exits: before, the tap's `scrollTop = 0` stood; now the queued restore overwrites it (`reveal-scroll.ts:44` returns 0 before looking at the head; `Drawer.svelte:407` no longer yields). Raised by the lane's own Step 2 report. Whether any path reaches it is NOT ESTABLISHED. If the desk wants it closed: pass "a scroll will be written" (`to !== null`) into the yield decision in place of `!!head`.
3. `NotePicker.svelte:20-23` (header) still says the clef is chosen per note by pitch. Stale since 2026-10-09, not this lane's doing; one comment line.

FOR DANN (taste only)
1. Octave 3 as the starting octave for every picker of a bass-clef voice, including "Highest comfortable note" and both passaggi, where a bass or baritone often wants octave 4. One start for all six pickers, or a start per field?
2. The two retaken pictures show Describe open by its questions, with its header out of frame. Enough, or a taller shot with both headers?

WHAT I COULD NOT ESTABLISH
- The full gates and the Playwright suites: not run, by instruction. The lane reports gate 4 at 6556 passed, 5 skipped without scipy; not verified here.
- The other seven lane 63 pictures (I viewed one of eight) and the phone layouts.
- The component's behaviour in a browser when the voice type changes while a picker is empty: read from code only (`NotePicker.svelte:71-75`), no component test exists.
- Whether `pnpm --filter @ilya/web exec vitest` passes argv to the config the same way; I ran the binary directly.
- Whether a missing ANALYSIS head is reachable on a phone (fix 2).

Tokens used: not known; roughly 75k by my estimate.
