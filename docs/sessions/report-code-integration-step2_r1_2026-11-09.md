# Report: integration step 2, merge of cloud-lane-34 (row 181, joining POEM to LYRICS), 2026-11-09

Branch `cloud-lane-38`. Step 2 merged `origin/cloud-lane-34` (11 commits not on Shane, steps 0 to 8c). Brief `brief-code-row181-joining-poem-to-lyrics_r2_2026-11-04.md`; strings `strings-row181_r1_2026-11-04.md`. Nothing pushed to `Shane` or `main`, no pull request, `docs/memory/` untouched. **Playwright not run** (the desk's order of 12:4x: Playwright runs at step 1 and after step 7 only).

## Lane reports read first

`docs/sessions/report-code-row181-step0` to `step6`, `step8a-8b`, and `step8c`, all in the merged tree. There is no step 7 report from the lane: step 7 was the desk's measurement (row 114). Each lane report says its browser behaviour was never run; I carried that forward below.

## Conflicts

None. `git merge origin/cloud-lane-34` ran with the `ort` strategy and stopped for nothing. The merged tree's `docs/memory/` is byte-identical to Shane's (`git diff origin/Shane HEAD -- docs/memory` prints nothing).

## Where Shane changed the same code since the lane was cut (9088d26c)

I compared the files each side changed since `9088d26c` (`git log --no-merges --name-only`, Shane side against lane side).

1. **Source code: no file.** The lane merged Shane once itself (`822724b1`, Shane at `f8ae34ba`, which is the merge base now). Since `f8ae34ba` Shane changed 49 files, all under `docs/` except one data file, `tools/poems/arias-for-library_r1_2026-11-08.json`. The lane touched no file under `tools/`. So no source line was changed on both sides, and the merge has nothing to keep from two sides in code.
2. **The files both sides list since the cut are eight documents:** `docs/memory/ENVIRONMENT.md`, `INBOX.md`, `OPEN.md`, `QUEUE.md`, `STATE.md`, and under `docs/sessions/` the row 181 brief r2, `memo-fable-loupe-print-strip_r1_2026-11-04.md`, and `strings-row181_r1_2026-11-04.md`. They appear on the lane side only because its commit `f8ae34ba` is a Shane desk commit that the lane's branch contains; the lane's own commits do not edit them (`git log --no-merges 9088d26c..origin/cloud-lane-34 -- <those files>` returns only `f8ae34ba`). Shane's later commits changed them again, and the merge took Shane's later version.
3. **Shane's step 1 code (cloud-lane-35) against the lane.** The lane and step 1 both touch no common source file except by name proximity: step 1 edits `library/library.ts`, `library/types.ts`, `library/document.svelte.ts`; the lane edits `i18n.ts`, `+page.svelte`, `Loupe.svelte`, `ratified-lines.test.ts`, `scan-notice.test.ts`, `ratchets.json` and others. No file is on both lists, and the merge was clean.

## Shared files the lane edited that the later steps will also touch

I record these for steps 3 to 5, not as conflicts now: `apps/web/src/lib/i18n.ts` (lane +19 lines, the ratified keys `lyrics.receipt.*`, `lyrics.filled.note`, `loupe.*`, and the key-index line and total, 1,147 keys at the lane), `apps/web/src/routes/+page.svelte` (lane: 5586 to 5549), `apps/web/src/lib/score/Loupe.svelte` (3013 to 3012), `scripts/ratchets.json` (two ceilings **lowered**: `+page.svelte` 5549, `Loupe.svelte` 3012; no ceiling raised).

## Gates (baseline on Shane, then this branch)

| Gate | Baseline | Now | Move |
|---|---|---|---|
| 1 phonology | 407 passed (407) | 407 passed (407) | none |
| 2 dictionary | 248 passed (248) | 248 passed (248) | none |
| 3 web check | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files | none |
| 4 web unit | 4198 passed, 1 skipped (4199) | 4415 passed, 1 skipped (4416) | +217: step 1's 34, plus the lane's 183 (4381 in the lane's own last run on a 4198 base, so 4198 + 183 = 4381; 4381 + 34 = 4415) |
| 5 score-parser | 785 passed, 5 skipped (790) | same | none (the lane changed one line of `score-parser/src/types.ts`, no test) |
| 6 blurb | 148 passed (148) | 148 passed (148) | none |
| 7 integration | 125 passed (125) | 125 passed (125) | none |
| 8 ratchets | OK. | OK. (682 source files) | none; five ceilings are lowerable, listed by the script (Drawer, LearnContent, pairings, CalibrationWizard, staff-renderer). The lane lowered `+page.svelte` and `Loupe.svelte` itself, so they no longer appear |

## What a singer would now see

The lane's reports are the source for each line; none was seen in a browser by me or by the lane.

1. **A scan with printed words that Ilya read only partly now draws a banner whose bar numbers are links.** Tapping a bar opens the Loupe on it.
2. **The Loupe shows the printed bar as a picture of her own scan** (the strip), on every bar of a scan read with bands, with a pinch to enlarge. Previous and Next step through the bars still to check. The Loupe opens itself once on the first listed bar when a scan has just been read.
3. **A new button, "Fill from the poem",** on a listed bar where her poem supplies the words. One tap puts the poem's words into her lyrics, underlined with a dotted line.
4. **When she pastes or types a poem into a scan's song, Ilya now repairs and fills the lyrics from it** after a 600 ms pause, as one edit, with a receipt line («6 syllables filled from your poem») and Revert. She can tap a repaired word to see what the print read. The poem is never changed.
5. **The banner's middle sentence changes** to «Choose a bar to see your score's print there and fill the missing words.» (French as ratified).
6. **Her scan's lyrics may read differently.** The lane changed how printed long dashes and hyphens between syllables are read, and the new default is that the extender (a held syllable) is off. These changes apply under the `?words=read` reader switch.
7. **A scan kept under that switch is read again once on next opening.** The stamp moved from `underlay@3` to `underlay@4`. A singer who does not use the switch is not affected (lane step 3 report).
8. **A tied-over or slurred melisma on a scan may be read as sustained** where the printed extender marks it, only where the marks bring the note and syllable counts equal (lane step 8b).

Whether lines 6 to 8 reach a singer without the `?words=read` switch I did not establish; the lane's reports tie them to that switch and I did not trace the default path.

## What I could not establish

- **Anything in a browser.** No Playwright run in this step. The lane never ran the strip, the pinch, the self-opening Loupe, focus, the receipt, or Revert in a browser either; each is WRITTEN, not DONE.
- **Whether the lane's tests hold the same count on a fresh install.** Gate 4 matches the arithmetic (+217); I did not compare test names.
- **The row 114 counts** (the desk's step 7). The lane gave none; the lane's own step 8a and 8b report gives the desk's figures (control 369; arm a 332, arm b 331; looks off 316) and says it has no count after its last changes.
- **Whether the lane's `?words=read` default path reaches singers.** See line 6 above.
- **Bar numbers.** The lane says it did not establish that a scan's measure numbers equal the song's bars on every scan (steps 5 and 6). I did not either.
- **Playwright reds on this tree.** Not run, so I do not say whether the 14 reds of step 1 moved.
