# Review: lane 69 as built (`cloud-lane-69`, `cb296eeb`), r1, 2026-11-18

Reviewer: Fable 5.2, as a subagent of the Opus desk. Filed verbatim by the desk from the helper's hand-back. Helper cost: 167,541 tokens by the harness count, 12 tool uses, 3.3 min, against a cap of 300k and a quoted range of 150k to 300k. The desk verified Fix 1 against the tree before filing (`insights/InsightsPane.svelte:515` passes `'insights'` to `placeholderLine`, so INSIGHTS prints `placeholder.line.belowCore`, `i18n.ts:2060`). The false clause the three fixes correct originated in the desk's brief r5, section 1, not in the lane.

---

Reviewer: Fable 5.2, as a subagent of the desk. I read the tree on Dann's Mac at `$HOME/mnt/ilya-rewrite` through the bridge, read-only: `Shane` at `00d0417d`, the lane at `origin/cloud-lane-69` `cb296eeb` (five commits, 19 files, merge base `00d0417d`). No git write was run, nothing was installed, and no gate was run. Read in full this session: the code diff (`apps`, `scripts`, `vercel.json`), brief r5, the four step reports, my delta review of r4, and the Amendments section of my review of r2. Read at the lane's tip: `voice/engine/sung.ts` whole, `analysis/placeholder-line.ts:1-89`, `components/Drawer/voice-pane.ts:1-70`, `voice/profileStore.ts:180-300` (the loader by grep), `voice/engine/types.ts:15-75`, the cited ranges of `markup/MarkupPane.svelte`, `markup/profile-status.ts`, `markup/profile-status.test.ts`, `i18n.ts`, `scripts/ratchets.json`, `scripts/ratchets.mjs:40-90`, `apps/web/playwright.config.ts:1-60`, and `apps/web/e2e/calibrate-new.test.ts:1-32`. Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `scripts/`, `docs/`, or are `vercel.json`. Line numbers are the lane's tip.

## Verdict

MERGE WITH FIXES.

The build is what brief r5 asked for, the two branches are correct for every state I could reach by reading, and nothing blocks. The fixes are one false clause, written twice by the lane, in comments.

## Blockers

None.

## Fixes

1. `markup/profile-status.ts:31-32`. The comment says the below-five line is "in the words the VOICE pane and INSIGHTS print (`calib.pane.belowCore`)". INSIGHTS does not print that key: it prints `placeholder.line.belowCore` through `placeholderLine` (`insights/InsightsPane.svelte:515`; `analysis/placeholder-line.ts:72-74`), a different sentence (`i18n.ts:2060`). Replace the text from "in the words the VOICE pane" to the end of the comment with: "in the words the VOICE pane prints (`calib.pane.belowCore`). INSIGHTS and MELODY with a score say the same in their own sentence (`placeholder.line.belowCore`)." The file has no ceiling, so the line count is free.
2. `apps/web/e2e/melody-no-score-count.test.ts:4-5`. Same clause: "the sentence the VOICE pane and INSIGHTS print". Replace with "the sentence the VOICE pane prints".
3. `markup/profile-status.test.ts:25`. The title reads "in the sentence the other surfaces print". Replace "the other surfaces print" with "the VOICE pane prints". A title change moves no test count.

All three are comment or title text. The desk can apply them on `Shane` after the merge; none needs the lane reopened.

## The checks

1. **Build against brief r5.** Step 1: the signature, the two imports, the `!personal` branch, the kept zero branch, and the untouched `countWord` comment are as prescribed (`markup/profile-status.ts:11-12`, `:33-44`). The pane's count is `isSung(formants[g])` on one line (`markup/MarkupPane.svelte:564`), the call is the prescribed line (`:945`), the import gained `isPersonal` and `stableCore` (`:64`), and the rename reached all three sites (`:446`, `:564`, `:945`). Step 2 and Step 3 are as prescribed (checks 4, 6, and 7). Built and not asked for: nothing of substance; the test file adds two small helpers, `set` and `below` (`markup/profile-status.test.ts:8-10`), and the e2e file sets a 1440 by 1000 viewport (`apps/web/e2e/melody-no-score-count.test.ts:10`) where the project default is 1440 by 900 (`apps/web/playwright.config.ts:36`). Asked for and missing: nothing found. Every amendment from both of my reviews reached the build: I traced the seven from the r4 delta one by one into r5 and the diff, and the thirteen from r2 through the delta review's carried list and then into the diff.

2. **The two branches, by state.** The block is drawn only when `hasReadings` holds (`markup/MarkupPane.svelte:450`, `:1093`).
   - Nothing sampled: the block is not drawn; the page prints `profile.emptyState` (`:1113`; `i18n.ts:1514`). True.
   - Only a hard vowel sampled: `stableCore` is empty because it filters `CORE_VOWELS` (`voice/engine/sung.ts:18`, `:26-30`), so the page prints "You have sampled 0 of the 6 core vowels so far. ... Until you provide 5 more, unsampled vowels are assigned placeholder values." (`analysis/placeholder-line.ts:53-56`). True.
   - Five sampled, four stable: `isPersonal` is false (`voice/engine/sung.ts:41`), so the page prints "You have sampled 4 of the 6 core vowels so far ([...]). ... Until you provide 1 more ...". True by the ratified meaning of the sentence, which counts stable core vowels; the fifth, unstable vowel is not mentioned. The VOICE pane prints the same for the same voice (`components/Drawer/voice-pane.ts:38`, `:57`).
   - Ten sampled: with five or more stable core vowels, "Your profile is now set with ten vowels measured." True. With fewer than five stable (for example, all ten at low confidence), the below-five sentence, down to "0 of the 6". Consistent with the VOICE pane (`components/Drawer/voice-pane.ts:36-38`), and true by the same ratified meaning.
   - `useEstimate` true: the reading is not sung (`voice/engine/sung.ts:15`), so it is not counted, does not open the block alone, and cannot be a stable core vowel. A voice with five stable core vowels and [ɨ] set aside reads "five vowels measured". True.
   - When `personal` is true the count is five or more, so the zero and singular forms are unreachable from the pane, as the brief says.

3. **The count against `usableReadingCount`.** `sampledVowels` filters the ten keys of `ROSTER_ORDER` (`markup/MarkupPane.svelte:442`, `:564`); `usableReadingCount` filters every value of the object (`voice/profileStore.ts:196-198`). `ROSTER_ORDER` and `VOWELS` (`voice/engine/types.ts:26`) hold the same ten vowels. The two differ for exactly one kind of input: a stored reading that passes `isSung` on a key outside the ten. The loader accepts any object as `formants` (`voice/profileStore.ts:226-236`, `:253`). Whether the app ever writes such a key is NOT ESTABLISHED. On that input the pane prints the below-five sentence, which is true, so no guard is needed.

4. **The comment move in `i18n.ts`.** One line moved. `:1349-1356` now read: the lane 67 comment, `calib.summary.unstable`, the lane 68 comment, `calib.summary.unstableOne`, the two-buttons comment, `calib.summary.keepOne`, `calib.summary.useEstimate`, `calib.summary.keepAll`. Keys and their order are unchanged, the file is 2725 lines before and after, and each of the three comments sits directly above the keys it describes.

5. **The tests.** `markup/profile-status.test.ts` pins every string the brief names, the French of the below-five sentence matches `i18n.ts:1443` character for character, and the wiring guard's three assertions match the pane (`:49-54`). By reading, the file fails on the pre-lane code: the old function took a number, and the old pane has no `sampledVowels`. The e2e file seeds as `apps/web/e2e/calibrate-new.test.ts:11-18` does, with `confidence: 'high'` and soprano, and reads the first `.profile-status`. The lane's positive control (both e2e cases failing on the pre-lane files with "ten vowels measured") is consistent with the code; I could not run it. Unreachable in the app, and labelled so or known so: `set(0)`, `set(1)` (asserted twice, at `:15` and `:47`, the second by the brief's request), and `set(11)` (the roster caps at ten). The three below-five cases are reachable. None is wrong.

6. **The ratchet.** `markup/MarkupPane.svelte` is 1349 lines at the lane's tip and 1353 at `00d0417d` (`wc -l` on both). `scripts/ratchets.json:16` reads 1349. The drop is the comment: twelve lines out, eight in.

7. **`vercel.json`.** `cloud-lane-69` at `:3` and `:47`, and no other lane name in the file (`:45-46` are `Shane` and `main`).

8. **Comments.** All four rewrites are done: `markup/MarkupPane.svelte:444-446` (three lines), `:554-563`, `markup/profile-status.ts:7-8`, and `:27-32`. The `:554-563` comment names section B.2, `cfcd0ba6`, `usableReadingCount`, and `isSung`, and the pane holds no `snapshot.fR1[`. One clause the lane wrote is false (Fixes 1 to 3). Outside the lane's files I found no comment the change makes false: a grep of `apps`, `packages`, and `scripts` for `analysedVowels`, `analysedCount`, and the status keys returns only the lane's files. The feature index at the top of `i18n.ts` lists the files that use a prefix "most" (`i18n.ts:15-17`), so its `calib.` row (`:30`) is not made false by a new reader.

9. **The reports.** Verified from the tree: every line number in the Step 1 report except two; the 2725 lines of Step 2; `vercel.json` `:3` and `:47`; the test count going from 4 to 9 (`it(` counted at both commits); and the arithmetic, 6682 plus 5 is 6687 passed, 6687 plus 5 is 6692 in all, skipped unchanged at 5. By the same arithmetic the Mac with Python would read 6691 passed, 1 skipped (6692); that is my sum, not a measurement. Two small errors in the Step 1 report: the pane comment is `:554-563`, ten lines with its delimiters and eight of text, where the report says "`:554-561` ... now 8" against an old count of 14 that included delimiters; and the `profile-status.ts` comment is `:27-32`, where the report says `:27-33`. Numbers I cannot verify are listed under "What I could not establish".

10. **Blocking, and for the walk.** Nothing blocks. The walk items are below. The DRAWER "on the left" strings are untouched by this lane and not made worse by it.

## For Dann's eye

- With one vowel sampled, MELODY with no score now reads "You have sampled 1 of the 6 core vowels so far ([i]). ..." where it read "ten vowels measured".
- With five stable core vowels it reads "Your profile is now set with five vowels measured."
- With five sampled and one of them unstable, it reads "sampled 4 of the 6 ... 1 more". That is your ratified sentence, and the VOICE pane says the same.
- With only a hard vowel sampled, or with every take unstable, it reads "You have sampled 0 of the 6 core vowels so far."
- The third line, "You can update these values anytime ...", now follows a sentence ending in "placeholder values".
- The lane reports the long sentence sits whole on a phone, three lines in English and four in French, in small type. I did not see the pictures.
- "measured" still carries its "DRAFT copy, flagged for Dann" marker (`markup/profile-status.ts:27`).

## What I could not establish

- Every gate figure and every Playwright figure in the Step 0 and Step 3 reports (462, 248, 904, 178, 159, 6682, 6687, 83 passed, the six phone runs, the timings). Nothing is runnable from the bridge.
- The positive control. It is consistent with the code as read; it was not run.
- What the eight pictures show. The files exist in the lane (`docs/sessions/pictures-lane69/`, eight PNGs), but the session has no scratch folder to stage them through, and I did not write into a connected folder to view them.
- Whether the app can write a reading on a key outside the ten vowels.
- The Step 0 report's statement that local `Shane` was at `ab67b836` in the sandbox.
- Whether the two phone files still flake on the Mac. The lane's clean runs were on other hardware.
- That stand-ins fill all ten entries of `snapshot.fR1` before the lane. I confirmed it in my earlier reviews; `voice/engine/resolve-values.ts` and `stand-ins.ts` were not reopened this session.

## Terms

Coined here: none.

Adopted: "wiring guard" (coined in my review of r2), "positive control" (the lane's Step 3 report), and from the tree and the brief "sampled", "stable core", "placeholder", "personal", "below-five sentence", "ceiling", "DESK DEFAULT", and "NOT ESTABLISHED".

Nothing in this report came from the memory store. For the main session's memory, if wanted (source: the tree, this session): INSIGHTS and MELODY with a score print `placeholder.line.belowCore`; only the VOICE pane and, after this lane, MELODY with no score print `calib.pane.belowCore`.

---

## The desk's note on the pictures, 2026-11-18 22:2x

The desk staged four of the eight into `~/Downloads/_desk-2026-11-18/pictures-lane69/` and looked at them: `1core-phone-en`, `1core-phone-fr`, `1core-desk-en`, and `5core-phone-en`. The below-five sentence sits whole on the phone, three lines in English and four in French, nothing clipped. The desktop page at one vowel shows the DRAWER open down the left with its sections REPERTOIRE, PIECE, INPUT, ANALYSIS, and VOICE, and the word "DRAWER" nowhere on the screen; that occasioned Dann's ruling of 22:28 (`OPEN.md`, "THE DRAWER ADVICE IS DEVICE-DEPENDENT") and is not lane 69's work.
