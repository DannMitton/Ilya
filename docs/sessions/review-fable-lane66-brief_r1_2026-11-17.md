# Fable review of the lane 66 brief r1

Filed by the desk 2026-11-17 21:5x. Fable 5.2 subagent, read only; harness count 355,550 tokens, 89 tool uses, 18.4 min (cap 370k). Applied in brief r2, where the desk took its own design on blocker B2 (r2, section 2). The memo, verbatim:

# Fable review of the lane 66 brief, r1

Read only. Clone `/home/claude/desk/m65` at `2201330b`. Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `tools/`, `docs/`, or are `vercel.json`. Every code claim carries a line I read this session.

## 1. Verdict

**SEND WITH AMENDMENTS.** Two amendments are blocking (B1, B2): sent as written, Step 5 returns an almost empty table, and Step 6 breaks tests the session will meet only at the final gate, after Step 7's build. The rest are numbered A1 to A22.

## 2. Blockers

### B1. Step 5 as posed measures almost nothing

- **The sets' truths are the guard's own band centres.** `tools/n200-score/fidelity-set.ts:12-14` and `:48-57`: the truth of each take is the stand-in template (`voice/engine/stand-ins.ts:98`, the geometric centre of the band). The third set scales each cell by 0.90 to 1.10 (`fidelity-set.ts:92`). So an outside reading in these sets is a picker error, and the stand-in is the truth by construction. "How far is the stand-in from the reading" then measures the picker's error, which is the cost of removing the exclusion, and can be read the wrong way round.
- **Lane 64 already counted, and found none.** `docs/sessions/n200-lane64-step5-counts_2026-11-17.md:31` and `:75`: 0 of 588 (third) and 0 of 566 (primary) Captured readings judged implausible by the type's window.
- **My own replication on `tools/n200-score/__golden__/path-600.json`** (Python, bands transcribed from `voice/engine/plausibility.ts:50-83`, margins `:124-125`, centres `voice/engine/derivations.ts:19-25`; mine, not the app's code): 582 readings; 0 outside judged alone, with own type or with none; 228 unchecked, because the four anchor-derived vowels have no window without anchors (`plausibility.ts:216-217`, `:241-246`). With a profile per type and take index and all anchors passed: 2 of 228, both [ʌ], both low confidence.
- **The goldens hold less than the brief says.** Two files, primary set only: `path-600.json` and `shipped-open-600.json`. Each row: `idx`, `k`, `type`, `vowel`, and per picker `outcome`, `f1`, `f2`, `confidence`, `reading`, `f2Quality`, `picker` (`golden.run.ts:26-39`). In `path-600.json`: 582 readings (455 Captured high, 111 Captured medium, 16 Provisional low) and 18 re-prompts. No truth, no verdict, no third set. The third set must be synthesised and read again (`fidelity-set.ts:115-120`); run time NOT ESTABLISHED.
- **No singer grouping exists** (answers section 7, item 4). A take is type, vowel, and rank `k` 0 to 11 (`fidelity-set.ts:5-8`, `:98-104`). Lane 64 built a profile as the takes of one type with the same `k` (`step5-core.ts:10`, `:60-61`). In the third set each vowel of a type has its own factor (`fidelity-set.ts:92`), so such a profile is not one coherent voice.

Consequence: `docs/memory/PRODUCT.md:1273` ("measured before it ships") would be met in form only, and Step 6's last test ("reports zero readings set aside") cannot fail.

Change Step 5 to:
1. Build profiles (type, `k`) from the primary golden, judged as the wizard judges: `checkPlausibility(f1, vowel, type, anchorF1sFor(profile))` (`voice/CalibrationWizard.svelte:292`).
2. Add a cross-type run: each profile judged under each of the other declared types and under none. This gives outside readings that are true to the voice. Truth comes from `cells(PRIMARY)` with no synthesis (`fidelity-set.ts:88-96`).
3. Report two distances per outside reading: reading to truth, and replacement to truth. Say which is closer.
4. Define two counts: "judged outside" (`checkPlausibility`, unchanged by Step 6) and "set aside" (a sung vowel whose `fR1Source` or `fR2Source` from `resolveVowelValues` is not `'sung'`). Step 6's test uses the second.
5. State in the report that own-type results on these sets describe picker error only.

### B2. Step 6 moves numbers the brief does not name, and its failing tests sit outside "the seven sites"

- **Stand-ins for every other vowel move.** The fit uses every `'sung'` value (`stand-ins.ts:195-201`). Today an outside reading is not `'sung'` (`voice/engine/resolve-values.ts:132-135`), so it stays out of the fit. After Step 6 it enters. Outlier removal runs only with three or more sung vowels (`stand-ins.ts:159`). My arithmetic: a bass whose one reading is [i] at 1063 Hz (template 311.1 Hz) slides every stand-in fR1 by 3.42 times, 21.3 semitones; the [ɑ] stand-in goes from 604.5 to about 2065 Hz. With two sung vowels: 10.6 semitones. `generic` turns false (`resolve-values.ts:209-210`), so the pages stop saying "placeholder values". The chart's placeholder dots move too (`voice/chart/zones.ts:93`, `:125-128`). 1063 Hz for a sung [i] is the class the guard was built for (`plausibility.ts:4-7`).
- **Derived vowels follow an outside anchor** (`derivations.ts:86`, `:105`).
- **Tests that pin the exclusion and are not "tests of the seven sites":** `analysis/analyze-score-adapter.test.ts:111`, `:247`, `:414`; `analysis/stand-ins-snapshot.test.ts:15-20`, `:98-104`; `analysis/adapter-golden.test.ts:41` with `analysis/__golden__/adapter-snapshots.json` (byte for byte, regenerated only with `UPDATE_ADAPTER_GOLDEN=1`, header `:1-9`); `voice/chart/finish-early.test.ts:54-57`, `:64-67`; `components/Drawer/voice-pane.test.ts:44-52`; `components/Drawer/voice-pane-usable.test.ts:10-14`; `voice/profileStore.test.ts:104-115`; `voice/engine/plausibility.test.ts:184-200`. I ran the first seven files: 97 passed at baseline.

Change Step 6 to:
1. Say that an outside reading enters the stand-in fit and anchors derivations, with off-shape handling as the only filter, or rule otherwise. Add the knock-on to Step 5: the largest change to any other vowel's value with 1, 2, 3, and 6 sung vowels.
2. Give one definition of done: **the documents treat an outside reading exactly as they treat a kept one today.** Templates exist: `analyze-score-adapter.test.ts:172-177`, `stand-ins-snapshot.test.ts:22-32`, `finish-early.test.ts:69`.
3. Name the test files listed here in Owns, and run gate 4 whole at the end of Step 6, before Step 7.
4. Regenerate the adapter golden in Step 6's commit and require that only the twelve "bad i (1063), no override" entries differ. That expectation is my inference from the test's header; the session confirms it.

## 3. Amendments

### Step 6

- **A1. Stored readings with no stored verdict lose their only check, and the note never names them.** The note reads the stored verdict (`voice/outside.ts:22`, `CalibrationWizard.svelte:327`). `judgeUnchecked` judges unjudged readings only inside `resolveVowelValues` (`resolve-values.ts:48-68`, `:103`). Its recorded occasion is Dann's own stored [i] at 1063 Hz, which "anchored [ɨ] and [ɪ] and Markup drew turning heads near B4" (`resolve-values.ts:33-34`). After Step 6 such a reading is used and nothing tells the singer. Whether that reading is still in his store is NOT ESTABLISHED. Recommendation: the note reads the judged copy at `CalibrationWizard.svelte:327` (no added line; the union window is the widest, so the note's sentence stays true).
- **A2. `judgeUnchecked` then feeds nothing a singer sees.** Its copy is consumed only inside `resolveVowelValues`; the adapter takes `fR1, fR2, fR1Source, fR2Source, generic, standIns` (`analysis/analyze-score-adapter.ts:132`). Nothing draws `retake` (`analyze-score-adapter.ts:64-66`; no non-test reader of `standIns.retake` or `.implausible` in my grep). This answers section 7, item 3: a singer reads nothing. Say whether `ResolvedValues.implausible` and the `'implausible'` retake reason stay as unread description or go; `stand-ins-snapshot.test.ts:19`, `:103` pin them.
- **A3. The [ɨ] third choice is not built.** `docs/memory/OPEN.md:3800` rules "use Ilya's estimate for now" for a far-off [ɨ]; `i18n.ts:1344` says "NO READER YET". Today a sung [ɨ] outside its window is replaced in the documents by the derived value (`resolve-values.ts:183-195`). After Step 6 it is used, and the singer has no way back to the estimate. Name this in the brief and carry it to Dann with Step 5's numbers.
- **A4. Name §B.4 as superseded.** `resolve-values.ts:108-111` reads "§B.4 RULED (Dann, 2026-07-15)" at the lines Step 6 changes; `derivations.ts:67-69` repeats it. `PRODUCT.md:1273` names INSIGHTS only. Add a rulings row saying whose reading extends it to MELODY, so the session does not stop on a RULED comment.
- **A5. Keep the name `usableReadingCount`.** `voice-pane-usable.test.ts:19-20` pins it in the text of `apps/web/src/routes/+page.svelte`, which is 5530 lines against 5534.
- **A6. One test of "sung" for the count, INSIGHTS, and the snapshot.** Today: `r !== undefined` (`voice/profileStore.ts:197`), `f1 > 0` (`resolve-values.ts:132`, `insights/InsightsPane.svelte:245`), not an estimate and `f1 > 0` (`zones.ts:83`, `voice/VowelCapture.svelte:108`, `finish-early.ts:34`). `voice/engine/analyze.ts:176` can write `f1: 0`.
- **A7. Indirect readers to add to the table:** `voice/chart/finish-early.ts:35-37`, `:67` (the caption prints only when `anyUsable`); `zones.ts:93`; `components/Drawer/voice-pane.ts:28-34`, `:48`; `+page.svelte:1761`, `:4185-4186`, `:4365`; `insights/comment-text.ts:122-123`.
- **A8. Comments Step 6 makes false:** `resolve-values.ts:1-7`, `:28-47`, `:86-88`, `:104-126`, `:172-179`; `derivations.ts:56-70`; `finish-early.ts:7-10`, `:25`; `voice-pane.ts:6-8`; `profileStore.ts:177-183`, `:189-194`; `+page.svelte:4181-4182`; `InsightsPane.svelte:240-241`; `analyze-score-adapter.ts:64-66`. Add a standing line: each step corrects the comments its change makes false and lists them.
- **A9. Ceiling.** `InsightsPane.svelte` is 742 lines against 744 (`scripts/ratchets.json:18`). Name it beside the wizard (1120 against 1126).
- **A10. A trap.** `voice/plausibility-keeps-status.test.ts:13-22` cuts `withPlausibility` out of the wizard by brace counting; no edit may enter that function.
- **Strings.** I found no string that becomes false, in `i18n.ts:1337-1346`, `:1421-1429`, `:2566-2572`, `:2052`, `:2539-2542`. The rest of the table: NOT ESTABLISHED.

### Step 5

- **A11.** `resolveValues` does not exist; the function is `resolveVowelValues` (`resolve-values.ts:96`).
- **A12.** `N200_DIR` also starts `score.run.ts` (`tools/n200-score/vitest.config.ts:43`, `score.run.ts:11`), which runs Burg by default and writes `n200-score-out/`. Give the new runner its own variable.
- **A13.** A recorder sidecar carries no voice type (`voice/engine/capture-file.ts:96-112`). Say how the folder run gets one, which take per vowel makes the profile, and that takes whose `sung` differs from `asked` are reported apart.
- **A14.** "Do not stop" is safe only with B1 fixed and Step 6 as one commit that can be reverted.

### Step 4

- **A15. The promotion is written at the next save of anything, for every voice.** `saveStore` writes the whole store (`profileStore.ts:314-329`); `persistStore` passes it whole (`CalibrationWizard.svelte:343-345`) and runs on a voice type choice, a note, a take (`:378`, `:384`, `:573`). Correct "when that voice is next saved". The lane 64 review said this "needs Dann's yes" (finding 3); the brief cites none. It is owed before merge.
- **A16.** The v1 path writes at load (`profileStore.ts:291-293`): apply the promotion after it. Promote on `confidence === 'medium' || 'high'`, so a reading with no confidence is left alone.
- **A17. Site and history.** `loadStore` is right: one caller (`CalibrationWizard.svelte:234`); the page receives readings from the wizard (`+page.svelte:3933-3934`). Take records hold the engine's own status (`voice/VowelCapture.svelte:118-120`, `voice/takes.ts:50-58`), so nothing contradicts. I found no fourth rule: status came from confidence at `ba8dbbb5` (`shane/engine/analyze.ts:22-24`), before `93bc6395` (`:58-62`), and now (`analyze.ts:173`); commits between: not read. Step 0 must search `apps/web/src/lib/shane/` too: the folder moved at `128610b3` (2026-09-27). The stub is a fourth writer at high confidence (`voice/engine/stub.ts:66-69`), development only (`voice/chart/stub-switch.ts:15-16`).

### Step 3

- **A18. Name the id, and not `voice`** (struck: `sections.test.ts:319-320`). `sections.test.ts:84-86` pins the exact list and must change.
- **A19. Drop the fallback condition.** Nothing renders or iterates `STATION_IDS` except `SUCCESSOR` (`components/Drawer/sections.svelte.ts:184-187`) and tests (`sections.test.ts:86`, `:91`, `:200`). `#write` filters unpersisted ids. The id appears neither on screen nor in storage.
- **A20.** "On a desk nothing changes" is NOT ESTABLISHED: the row's state moves from the component (`components/Drawer/VoicePane.svelte:56`) to the page's set, so it may stay open across a remount. `VoicePane.svelte:12-16` and `sections.svelte.ts:55-57` become false. Add one phone test: type row open, then a link to a station lands in view (`reveal-scroll.ts:31` assumes nothing closed before the target).

### Steps 1, 2, and 7

- **A21. Step 1.** Missing: `plausibility.ts:21-23`; `voice/chart/readings.ts:105`. "No code change" contradicts retiring the stub outcome, which is the stub's default for [ɨ] (`stub.ts:108`) and runs in every stub tour. Leave it; correct the comment.
- **A22. Step 2.** The sidecar falls back to `'shipped'` (`capture-file.ts:150`): say whether it stays. Optional: one card line with the address as read when the session was built, which separates "the query was lost" from "the picker ignored it".
- **Step 7.** The lines are `vercel.json:47-49`, not `:49-51`. The pin (`voice/engine/capture-file.test.ts:135-139`) accepts one branch and needs no edit. For one build, the last report goes in the same push as Step 7.
- **Instruction.** "Gates once, at the end" conflicts with Step 0's gates: say baseline and end. Lane 63's fix 2 is left without a word.

### Section 1, sentence by sentence

- **Item 1:** false for a reading with no stored verdict (A1) and for fR2 when the take read none (`resolve-values.ts:148`). "Changes nothing else" is false: Keep prints "Beyond Ilya's reference values" (`voice/chart/VowelSpaceSheet.svelte:124`) and moves the calibration date (`CalibrationWizard.svelte:388-393`).
- **Items 2 to 4:** true once built.
- **The comments sentence:** false without A8 and A21.

## 4. What I ran

- `vitest run` on seven test files (named in B2): 7 files, 97 passed.
- Read-only Python on `path-600.json` (counts in B1).
- `git log -S` and `-G` over both folder names.

## 5. What I could not establish

- Run time of the path picker on the third set.
- Whether Vercel reads `deploymentEnabled` from the pushed commit.
- Whether the Drawer measures after a row closes.
- Whether a preview build shares storage with production.
- Tokens: I cannot see the harness count; my estimate is 230k.

## 6. Terms

"Cross-type run", "knock-on", and "indirect reader" are mine. The house-style rules in memory shaped the wording; nothing else came from memory, and nothing new is worth saving.
