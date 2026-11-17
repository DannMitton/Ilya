# Fable review of briefs r1 for lanes 63 and 64

Filed verbatim by the desk 2026-11-17 10:1x. Fable 5.2 subagent, read only; harness count 220,205 tokens, 25 tool uses, 6.5 min (cap 420k). Briefs: `brief-code-lane63-cleanups_r1_2026-11-17.md`, `brief-code-n200-switch-on-lane64_r1_2026-11-17.md`.

REVIEW MEMO: briefs for lanes 63 and 64, read at origin/Shane 77555a06. Read only; nothing changed; no gate or test run.

=== LANE 63 ===
VERDICT: SEND WITH AMENDMENTS

A. Wrong cites
- Drawer.svelte:408 is :406 (`if (restoreQueued) restoreYields = true;`); the lookup is :407, not :409.
- `MIDDLE_LINE.bass` is note-picker.ts:35, not :36.
- `havePython` is burg-fixtures.ts:18 (:17 is its comment).
- Section 2 gives the bass, bass-baritone, baritone split as Dann's. OPEN.md:2986 marks it DESK DEFAULT; his words cover his own bass.
Every other cite reads as stated (NotePicker.svelte:68, :122; note-picker.ts:45-55, :54; voiceTypes.ts:86-89; VoiceTypeIntake.svelte:10, :129, :147; intake-symbols.ts:5; DescribeVoice.svelte:67; vitest.config.ts:7, :32; Drawer 1,986 of 1,990).

BLOCKERS
1. Step 2 would delete a live rule. `.charx-heading` has no match in apps/web; the rule under the comment at VoiceTypeIntake.svelte:147 is `.vt-legend`, used at :65 and :88. Replace the last sentence of the first bullet with: "`.charx-heading` no longer exists. The rule under the comment at `:147`, `.vt-legend`, is live (`:65`, `:88`): keep the rule and rewrite the comment."
2. Step 3 needs files Owns does not list and collides with lane 64. `synth-gate.run.ts` has no guard (its `test(` is unconditional) and is not owned; `golden.run.ts` is edited by lane 64 Step 0. `score.run.ts:13`, `measure.run.ts:28`, and `measure-report.run.ts:12` already skip. Replace the second sentence with: "Do it in `vitest.config.ts` alone: `include` always lists the two `*.test.ts` files, and lists a `*.run.ts` only when its file name is on the command line or its variable is set. `burg-check.run.ts` gains a skip with a printed reason where `havePython` is false (`burg-fixtures.ts:18`). Touch no other runner." Drop `golden.run.ts` from Owns. Whether the config sees the filter in `process.argv` is NOT ESTABLISHED; Step 0 checks it.
3. The Drawer test cannot be written as stated. No Drawer component test exists (seven pure test files beside it), every `revealTarget` the page sets exists (+page.svelte:1686, :1697, :2180), and Fable found no path to a missing target. Replace the test sentence with: "Move the decision into a pure function in `components/Drawer/reveal-scroll.ts` (yield only when a restore is queued and the target was found) and unit-test it there." Add `reveal-scroll.ts` and its test to Owns.

AMENDMENTS
1. Correct the four cites above.
2. Step 1, second bullet, add: "'Set an octave' means the singer changed the octave control or pressed Clear (`NotePicker.svelte:97-105`)."
3. Section 2, after the ruling: "The split by type and the treble clef for an empty picker with no type are DESK DEFAULTS."

D. The empty-clef change agrees with the ruling: the declared type is "the deciding factor" (OPEN.md:2986). One mount only: DescribeVoice.svelte:62, rendered six times (:76-77, :85-86, :94-95). Octave 3: the one repository fact is Dann's own secondary passaggio, D♯4 (OPEN.md:2986), which is octave 4. Octave 3 sits one step from the high fields and one from the low; octave 4 sits two from the low. Sound as one default. A default per field is NOT ESTABLISHED from any file.

FOR DANN: none.

=== LANE 64 ===
VERDICT: DO NOT SEND until blockers 1 to 5 are in

A. Wrong cites
- `capture.uncertain` is i18n.ts:2601; :2599 is `capture.hint.finished` (copied from plan r2).
- vercel.json: the block is :43-49; `cloud-lane-62` is :48.
- `PathOptions` is :77-85.
- R125, DP, and P3 act in `crossCheck` (:174), reached through `pathFromTracks` (:223). `scoreCeilings` and `choosePath` never run the cross-check (:209).
- The default is asserted at path-extract.test.ts:147, :148, :150 and open-extract.test.ts:28, :30.
- Other `'shipped'` defaults: analyze.ts:59, :195; live.ts:200.
The rest read as stated. L15's rungs compute to 3001, 3188, 3387, and 7000 (:40). The figures for Dann's 13 takes are outside the repository: NOT ESTABLISHED.

BLOCKERS
1. The pre-registration has a gap. Bars are committed at Step 3, after Steps 1 and 2 are built and the tool is handed to the desk; no bar for Dann's takes is written; no rule says which passing variant wins. Move the bars into Step 0 as item 3, and add: "On Dann's 13 takes a variant passes when no take in both bars under the lane 62 picker leaves them, both [u] stay in both bars, and R125 changes none of the 12 readings; [ɪ], [ɛ], and take 09 are reported. Among variants that pass the third set and Dann's takes, the desk takes the one with the most third-set takes in both bars; a tie goes to the fewest options, then to L15. Dann's takes can refuse a variant; they cannot choose one that failed the third set."
2. The bars lack denominators. Add: "The definitions of `measure-core.ts:5-8` stand: every take generated is in the denominator; an absent fR2 is a miss. Bars are judged on all takes pooled; per type and the second-pulse split are reported. Bar 1: of takes whose track-2 fR2 before any check is within 12 percent, the final fR2 differs from the same ladder with every option off on at most 1 percent. Bar 2: of takes whose track-2 fR2 before any check is outside 12 percent, at least half end absent or within 12 percent, and more than with every option off. Bar 3: no promotion means P3 does not pass. Bar 4: 'in both bars' is the final reading, same options on both ladders."
3. Step 5 as written changes the meaning of unowned tests and tool columns. Callers with no picker: analyze.test.ts:187-405, detector.test.ts:150, :155, i-extractor.test.ts:47, :87, live.test.ts:140-313, open-extract.test.ts:63, path-extract.test.ts:189, score-core.ts:107, measure.run.ts:35. The tool's shipped column would become path without a word. The singer's chain is one line: CalibrationWizard.svelte:205, stub-switch.ts:32, measure-switch.ts:12, live.ts:740. Replace the second bullet with: "The defaults at `engine/analyze.ts:59`, `:140`, `:144`, `:195` and `engine/live.ts:200` become `'path'`. In the same commit, every caller that relied on the old default passes `'shipped'` explicitly (list above). `shipped-open-600.json` stays byte-equal." Add those files to Owns, "the picker argument only".
4. The time gate can be skipped, and "without it" loses its meaning once the default is path. Replace section 5's third sentence and split Step 6: "Step 4b: add `cloud-lane-64` to `vercel.json`, push, stop. The desk times at least five takes at `?harness=1&measure=path` and five at `?harness=1` on Dann's iPhone. Step 5 begins only when the desk types both medians and 'the time bar is met' into this session."
5. Section 1 is untrue of the status. `CalibrationWizard.svelte:294-299` still makes a Captured reading Provisional from a vowel and voice-type band, against PRODUCT.md:1269-1270; plan P5 names "status from evidence". Either add the step, or add to section 1: "The band at `CalibrationWizard.svelte:298` still makes a reading Provisional; a later lane removes it", and to Leaves.

AMENDMENTS
1. Correct the cites above.
2. P3 alone never fires (it needs a failed R125 or DP). Use one list in Steps 2 and 3: off, R125, DP, R125+DP, R125+DP+P3, on three ladders. Name `measure.run.ts` in Step 2; an unknown `N200_SET` throws (today it falls to PRIMARY, :29).
3. Add to Step 3: "If every option off misses the 80 percent bar for any type on the third set, stop for the desk." Soprano fR2 was 81.7 percent on the held-out set (report step 3, line 33).
4. Step 5: "Only the exact values `shipped` and `open` select the other pickers; anything else reads as path."
5. Weighting: `fitTrack` is not exported (:122). "Behind a `PathOptions` field, default off; counted on the third set in the same run."
6. Owns: "`tools/n200-score/` except `vitest.config.ts` and `burg-check.run.ts`"; add the header comments at analyze.ts:9-14, types.ts:74-75, live.ts:199.

C. The third set's seeds collide with neither earlier set (15000 to 15991, 17001 to 18520, 19000 to 19049 against fidelity-set.ts:67-69). No file outside the engine reads `picker`. Keeping `?measure=shipped` does not contradict the words quoted ("for everybody"). It does sit against plan r2 section 3.1 ("`MITTON` leaves measurement at P5 and stays in the scoring tool"), and a reading taken under it stores no `picker` (analyze.ts:180), so it looks like an old reading.

FOR DANN
- Does `?measure=shipped` stay reachable in the released app, or in the tool only?
- May one real take outvote a failed synthetic bar, or do real takes only refuse?
- Does the band's demotion (blocker 5) leave before the switch or after?

=== JOINT ===
E. Overlap as written: `tools/n200-score/golden.run.ts` and `vitest.config.ts`. With lane 63 blocker 2 and lane 64 amendment 6 the Owns lists are disjoint and the lanes can run together. Merge 63 first; lane 64's gate 4 baseline then moves by lane 63's new tests.
F. House style: both clean. The only "shouldn't" and exclamation mark are inside Dann's quotations (lane 64 lines 18, 22).

WHAT I COULD NOT ESTABLISH
- Any gate count (6544, 6540); no run made.
- Whether a vitest config sees the file filter in `process.argv`.
- The desk's figures for Dann's 13 takes.
- Whether a branch's own `vercel.json` governs its deployment (lane 62 precedent only).
- Lane 62's Step 0, 1, 2, and 4 reports: not opened; Step 3 report and the time file were.
- Octave habits per field for baritone and bass-baritone.

Terms: "refuse, not choose" is mine; R125, DP, P3 are Fable's.
From memory: house-style rules shaped the wording; nothing else used. Nothing new worth saving.
Tokens: not known exactly; my estimate is 170k, under the cap.
