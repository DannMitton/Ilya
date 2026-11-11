# Review: the Code brief for lane 43's amendments (Fable, r1, 2026-11-10)

Read at `/root/lane43` (`68cfb9c4`, untouched) against `origin/Shane` `64d9f08f`. Probes and trial fixes: `/root/scratch43` only (`zz-probe4.test.ts`); with every trial fix in, `src/lib/score` passes 1,334 tests. Paths are under `apps/web/src/lib/score/` unless given in full.

## VERDICT: SEND WITH AMENDMENTS

Steps 1, 5, 6, and 7 are right in substance. Steps 2, 3, and 5 each name a test that cannot pass; step 3 names the wrong place; step 4 leaves the same defect under the other scope.

## AMENDMENTS

1. **Step 2: a crossing triplet is not refused.** The rebar ends before it (`rebar-notes.ts:147-150`; header `:7-8`). Probe: `2 of 3, 2 of 3, 4 of 3...`, with a barline added before the group (`:191`). Replace the test sentence with:
   "Test (replaces `rebar-notes.test.ts:87`): a real quarter-note triplet (`<time-modification>`, lengths of 1/6). (a) It fits whole in its new bar: eight bars add up, `syllableTargetIds` unchanged. (b) It crosses a new barline: as built, the rebar ends before the group; the bars before it add up, the bar before the group stays short and flagged, the group's entries carry no record."

2. **Step 3: the place and the fixture.** Replace the step with:
   "At `rebar-notes.ts:173`, return `signed` (the `setSignature` result, `:98`) where it returns null; correct the comment at `:87`. Change nothing in `correction-verbs.svelte.ts` or `bar-layer.ts`. Test: one lone triplet quarter in place of bar 2's two quarters in `time-signature-barlines-wrong`; `rebarNotes` equals `setSignature` for the same arguments."
   Evidence: the other nulls (`:99`, `:101`, `:103`) are cases `setSignature` refuses too. Path: `time-signature-ui.svelte.ts:87`, `correction-verbs.svelte.ts:429-435`, `bar-layer.ts:117-121`. One Undo step holds: one `pushUndo` (`:433`), one `setCorrections` (`:434`). Probe: the lone triplet gives null after step 2 alone, and exactly the keep-barlines map with this line.

3. **Step 4: the same defect under "To the next change".** New finding. The signature's scope ends only at a reading change of signature or her later one (`rebar.ts:330-341`); the notes stop at any `mergeBlocked` barline (`rebar.ts:178-188`: key, clef, repeat, ending, jump, rehearsal mark). Probe: a key change at measure 4, `'next'`, gives 3/4 throughout and `4 of 3` after it. Replace the second sentence with:
   "Under both scopes, end the fill only where the signature's scope ends (`'next'`: the reading's next change of signature, or her later signature; `'end'`: the last entry). At every other blocked barline, set the fill to zero and continue; the reading's barline stays, the bar before it may be short and flagged, and no `barline` mark is written on the entry after it (`:186-188` would write `'before'`). Tests: `time-signature-barlines-wrong` with 2/4 stated at measure 4, `'end'`; the same file with a key change at measure 4, `'next'`; eight bars add up in each."
   Probe with this in: both pass, as does `rebar-notes.test.ts:102`.

4. **Step 5: the test cannot pass as worded.** With the fix simulated, the last bar reads `2 of 3` because a quarter was deleted. Replace with: "Test: the deleted record carries no `barline` after the rebar, and every bar but the last adds up."

5. **Step 1: add the how.** "In `#enter` (`correction-verbs.svelte.ts:346-351`), find `c.after` in `this.#d.line()` (song bars). If that entry's `measureIndex` equals `c.measureIndex`, pass the cursor to `enterEntry` with no `measureIndex`; otherwise convert as now. Leave `adoptBarMarks` as it is." Probe (join): the entry lands at 3/2 after its anchor; with `toReading` it lands at 0.

6. **Step 6: decide it.** DESK DEFAULT, remove: "remove it, its import (`rebar-notes.test.ts:8`), and its test (`:113`)."

7. **Two sources are on no branch.** The review file is absent from `cloud-lane-43` and `origin/Shane`; `OPEN.md` at `64d9f08f` has no "LANE 43 AS BUILT" section. Push both first, or quote them in the brief.

8. **Step 7: the count.** Shane's two new commits touch only `docs/` and `tools/cursive/`; `git merge-tree` at `64d9f08f` gives the same two conflicts and no other. Replace the parenthesis with: "(1,219: Shane 1,200, lane +19, no string added here; `i18n-index.test.ts` fails on a wrong total)."

9. **Step 8: "the LEARN specs" names no file.** The word appears only in `e2e/singer-paths.test.ts` and `e2e-phone/loupe-scan.test.ts`. Name the files or drop the phrase.

## Does the brief now cover it

- Tuplet groups with fewer entries than `actualNotes`: yes, through amendment 2; it is the refusal case.
- Playwright, and gates on the merged tip: yes, step 8.
- The banner's print bar numbers; tied pairs after 3/4 and back: no, neither is ruled.
- How ties and beams are drawn; a real reader's output: no, a cloud session cannot judge either.
- Accompaniment events and `jump` tokens in a divided bar: no; outside these amendments.

## WHAT I COULD NOT ESTABLISH

- Whether the 22:31 ruling is meant to reach the crossing complete triplet (amendment 1b). As worded it does not; as built stands.
- Whether a `'before'` mark on an entry that already opens a reading bar does harm.
- Step 5's fix in code: simulated, not written.
- Step 1 inside `CorrectionVerbs`: probed through `enterEntry` and `rebar` only.
- Playwright and gates 1, 2, 5, 6, 7: not run.
- Which specs the desk meant by "LEARN specs".
