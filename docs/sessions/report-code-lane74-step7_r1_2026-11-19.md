# Report, lane 74, step 7: the eight gates and both Playwright projects

Every figure below was printed by the command named, in this sandbox, on this branch. The branch is `cloud-lane-74`, cut from the commit the brief names (`ca2a4e5`, then the brief's own commit `20c9a48`). Dependencies: `pnpm install --frozen-lockfile`. This sandbox has numpy and no scipy, so gate 4 is on the brief's second baseline.

## 1. The eight gates

| Gate | Step 0 baseline | After this lane | Moved? |
| --- | --- | --- | --- |
| 1 phonology | `462 passed (462)`, 14 files | `462 passed (462)`, 14 files | no |
| 2 dictionary | `248 passed (248)`, 4 files | `248 passed (248)`, 4 files | no |
| 3 web check | `0 errors and 12 warnings in 5 files` | `0 errors and 12 warnings in 5 files` | no |
| 4 web test | `6723 passed \| 5 skipped (6728)`, 363 files | **`6739 passed \| 5 skipped (6744)`**, 363 files | **yes, +16** |
| 5 score-parser | `904 passed \| 5 skipped (909)`, 43 files | `904 passed \| 5 skipped (909)`, 43 files | **no** |
| 6 blurb | `178 passed (178)`, 5 files | `178 passed (178)`, 5 files | no |
| 7 integration | `159 passed (159)`, 7 files | `159 passed (159)`, 7 files | no |
| 8 ratchets | `ratchets: OK.`, 905 files | `ratchets: OK.`, 905 files | no (the printed output is identical to the baseline's, line for line) |

### Gate 4: +16, and what added each

6723 to 6739 passed, total 6728 to 6744. The sixteen tests are all new tests of this lane, and no existing test was removed:

- `components/Drawer/voice-pane.test.ts`: +5 (the new "lane 74, item 1" block).
- `stand-in-borrowing.test.ts`: +10 (the picker note: 6; the bass on every page: 4).
- `markup/subtitle.test.ts`: +1 (the one elision test became two: the bass reading "bass", and the elision rule on `fillVoiceType` itself).
- Other files: 0.

If the ship script's scipy path is the one Dann's Mac takes, the matching figure is `6743 passed | 1 skipped (6744)`. **That is DERIVED from the brief's `6727 | 1 (6728)` plus my +16, not measured here.**

### Gate 5 did not move

The brief expected gates 4 and 5 to move. Gate 5 is `@ilya/score-parser` and this lane touches nothing under `packages/` and adds no score-parser test, so it stayed at `904 passed | 5 skipped (909)`.

### One gate-4 failure this lane caused and the brief did not name

The first full run of gate 4 read `2 failed | 6737 passed | 5 skipped (6744)`. Both failures were in `src/lib/i18n-index.test.ts`: "states each prefix's count as it is in the file" (`voiceType: stated 45, actual 46`) and "states the total as it is in the file" (`expected 1347 to be 1348`). The cause is the one new key, `voiceType.borrowing` (step 3), which the hand-kept key index at the head of `i18n.ts` does not count. I changed two lines in that index (`voiceType.` 45 to 46, and "This file holds 1,347 keys." to "1,348") and ran gate 4 in full again: `6739 passed | 5 skipped (6744)`. The brief's section 6 list did not include this test, and says "it is not a promise the list is complete".

### The ship script

**NOT DONE: moving the baselines in `~/Downloads/ilya-ship.sh`.** `ls ~/Downloads` in this sandbox fails ("No such file or directory"), so the script is not here, and I could not keep a backup named for the old figure. Dann's Mac holds it. The figures to set, for the script's two forms: gate 4 with scipy `6743 passed | 1 skipped (6744)` (derived) and without scipy `6739 passed | 5 skipped (6744)` (measured). Gate 5 and every other gate stay at their old figures.

### Ratchets

`pnpm run ratchets` printed `ratchets: OK.` and the same nine "ceilings can be lowered" notices it printed at the baseline, none for a file this lane touched. `scripts/ratchets.json` was not edited.

## 2. Both Playwright projects

Command, from `apps/web`, both projects in one run, one worker, `--trace off`, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`:

`pnpm exec playwright test --project=chromium --project=phone`

Two runs, 363 tests each, 2 skipped in each (`e2e/heic-offline.test.ts:43` and `e2e-phone/loupe-scan.test.ts:409`):

- **Control: the untouched tree.** A pristine `git archive HEAD` copy (before any change), so this lane's edits cannot reach it. **355 passed, 6 failed, 2 skipped (1.0 h).**
- **The changed tree.** **352 passed, 9 failed, 2 skipped (1.1 h).**

The two runs shared the machine with each other and with my other work for part of their time, which makes timeouts more likely; I say so because the failures below are mostly timeouts.

### Failures on the untouched tree (the control), six

1. `e2e/loupe-header.test.ts:47`
2. `e2e/time-signature-card.test.ts:114`
3. `e2e-phone/input-views.test.ts:134`
4. `e2e-phone/phrase-ends.test.ts:26`
5. `e2e-phone/relining.test.ts:70`
6. `e2e-phone/relining.test.ts:95`

All six fail on the changed tree too.

### The three that failed on the changed tree and not in the control's full run

| Test | What I did | Reading |
| --- | --- | --- |
| `e2e/time-signature-card.test.ts:78` | Reran the file alone on both trees | Fails again on the changed tree, **and fails on the untouched tree when the file runs alone** (that run: 3 failed, 4 passed; `:78`, `:98`, and `:114` failed). Same wait in the changed-tree failure: `locator('.loupe .loupe-body')` to be visible, 180 s |
| `e2e/time-signature-card.test.ts:192` | Reran the file alone on the changed tree | **Passed** on the rerun. It failed once in the full run, with the same `.loupe .loupe-body` wait. On the untouched tree it passed both times |
| `e2e-phone/voice-stations.test.ts:62` | Reran with the four phone files alone | **Passed** on the rerun. This is the line the brief names as a known flake |

So the time-signature file hangs at the loupe's body on the untouched tree as well, and which of its tests hangs differs from run to run: `:114` in the control's full run; `:78`, `:114`, and `:192` in the changed tree's full run; `:78` and `:98` in the changed tree's rerun; `:78`, `:98`, and `:114` in the control's rerun. None of those tests touch a voice type, and none of the failing waits is for anything this lane changed. **NOT ESTABLISHED: why that file hangs.** I did not read the loupe code. The `voice-stations.test.ts:62` failure is the brief's known flake, and it passed on its rerun.

### Every file this lane changed or could reach

- `e2e/voice-pane.test.ts`: all 24 tests passed in the changed tree's full run (Playwright's numbered results 252 to 275), including `:86` (the one holding the contralto expectation the brief names, which I changed to the borrowing line) and the bass line, unchanged.
- `e2e/voice-stations.test.ts` (chromium): all 8 passed.
- `e2e/insights-links.test.ts` and `e2e-phone/insights-links.test.ts`: all passed in the full run (the brief's other known flake, `e2e-phone/insights-links.test.ts:32`, passed both of its cases).
- Nothing under `e2e/` or `e2e-phone/` that mentions a contralto, a borrowing, or the picker failed.

### What is not covered

No Playwright test opens the wizard's first question (`VoiceTypeFirst`) or picks a borrowing type in a picker and reads the note. I added none, because the brief asks for unit tests and renders. The note's presence in both pickers is covered by the source-reading test in `stand-in-borrowing.test.ts` and by the measurements in step 6, which ran in a real browser but are not a committed test.

## 3. Housekeeping

- A temporary Playwright config for a second port was created in `apps/web` to run the changed tree beside the control. It is deleted. `git status` shows no untracked file outside `docs/sessions/`.
- A temporary vitest file for the step 2 equivalence check was deleted before the first commit.
- No `.bak` file was created (`find . -name "*.bak"`, outside `node_modules`, finds none).
- The dev servers started for step 6 and for the Playwright runs are stopped.
