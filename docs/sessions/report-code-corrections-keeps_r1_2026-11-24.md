# Report: Corrections keeps what the singer did (Code, cloud lane), r1

Written 2026-11-24 on `cloud-lane-89`, from `brief-code-corrections-keeps-what-she-did_r2_2026-11-24.md`. Base: `Shane` at `5594904b`, working tree clean. Five commits, one per defect, in the brief's order. Nothing was pushed to `Shane` or `main`, and no pull request was opened.

| # | Commit | Defect |
|---|---|---|
| 1 | `4bcf793c` | A second tuplet erases the first |
| 2 | `4a71e1fb` | A note added after a grace note vanishes with the main note |
| 3 | `3f8bed42` | Deleting a hand-added note leaves the cursor nowhere |
| 4 | `0f8f118b` | A press that changes nothing leaves a correction behind |
| 5 | `c8ba51ee` | A key change is lost when the bar's first note is deleted |

The commit for defect 2 was amended once before any push, to give its test's pitches an octave (svelte-check caught `P('C')` called with one argument). Commits 3 to 5 were replayed on it, which is why their hashes are the ones above.

Every "before" in this report was run: the new tests were run against the old source with `git stash` on the source files only, and some of the failures are quoted.

## 1. A second tuplet erases the first

**Change.** `score/tuplet-row.svelte.ts`. `#base` is now keyed to the taken entry (`#baseId`) and is retaken when the map is no longer the one the row last wrote (`#written`). `#written` is read back from the store after each write, because `doc.corrections` is a `$state` and may hand back a proxy of what it was given.

**Proof.** Three cases in `score/tuplet-row.test.ts`: a second tuplet on a new entry keeps the first and a correction made between (two undo steps); a return to the same entry keeps a correction made between; nudges on one entry with nothing between still push one undo step. The first two failed on the old code; the third is the guard and held on both.

**Checked past the unit harness.** A throwaway test, since deleted and never committed, ran the row against a real `$state` map. Three nudges pushed one undo; a correction and a second tuplet then pushed a second, and the map held `a` to `f`. So the proxy-identity worry did not bite.

## 2. A note added after a grace note vanishes when the main note is deleted

**Change.** `score/correction.ts`, the branch for a principal that no longer stands. It now emits the read grace notes' entries, before-graces first (seated with `stubAt`, as the standing branch does), then what hangs on the principal, then after-graces. This is not `carried`: the entries belong to notes that still exist.

**Proof.** Six cases in `score/correction.test.ts`. Three held before and hold after: the entry sits before a standing principal; a note entered after the deleted principal itself still stands; with the grace note also deleted, its entry is not drawn. Three failed on the old code and pass now: principal deleted gives `a, hand:1, c` (old: `a, c`); principal made a grace note gives the same; an after-grace entry follows the principal's own entries. `score/grace-layer.test.ts` passes untouched as the guard.

**On the orphan claim.** The brief says Ilya "does not count it among the corrections that failed to land". That is true and stays true: `orphanIds` treats a grace id as live, so `hand:1` was never reported, before or after. The test therefore asserts that `hand:1` is not an orphan, and the repair's effect is that the line draws it. The deleted principal's own record is reported as an orphan by `orphanIds` both before and after; I did not change that.

## 3. Deleting a hand-added note leaves the cursor nowhere

**Change.** `score/correction-verbs.svelte.ts`, `handleDeleteNote`. The neighbour is looked up in `line()` (the drawn line, with grace stops) for every entry, not `readLine()`.

**Where the selection lands beside a grace stop (amendment 3).** On the grace stop. Deleting read note `b` in `a, b, c~g1, c` leaves the selection on `c~g1`. The old lookup skipped grace stops and landed on `c`. I took the drawn line's own order as the answer because the arrow keys walk the same stops. This is a DESK DEFAULT and a visible change for a singer who deletes a note just before a grace note. It is the one place this commit moves a selection that was not null before.

**Proof.** Three cases in `score/correction-verbs.test.ts`: hand-added note deleted with a neighbour after it (lands on it); hand-added last note (falls back to the one before); the grace-stop case. All three failed on the old code (the first two selected null; the third selected `c`).

**Not confirmed.** That the Loupe closes when the selection is null is established by reading (`routes/+page.svelte:896`, `:4513`), as the brief says. I did not run the page to see it, so I do not claim it. See the last section.

## 4. A press that changes nothing leaves a correction behind

**Change.** `score/correction.ts` gains `settleAgainstRead(map, id, read)`: it takes out of a note's record whatever the read already says (type, pitch, base, dots, tie) and removes the record if nothing is left. It is applied in `toggleTie` and `toggleRest` (`score/entry.ts`, new optional last argument `read`) and in the verbs' shared `#correct`, which every pitch, dot, length, and accidental press goes through. The verbs pass `readLine().find(...)`.

Left alone on purpose: a record with `entered` (it is the entry), a note with no read event (entered, or a grace stop), a pitch on a note the singer made a rest (it is the memory `toggleRest` returns to), and base or dots on a record holding a tuplet.

**A correction to the brief's reasoning.** The brief says the dot, pitch, and length verbs write "without `withCorrection`". They do go through `withCorrection`, via `#correct`. It prunes only a record with no fields at all, so a field equal to the read survives it. The repair covers every verb the brief names, by the route above, not by the route the brief states.

**Proof.** `score/entry.test.ts` (eight cases) and `score/correction-verbs.test.ts` (eight cases), one per verb: tie on and off; tie off and on where the reader found a tie; note to rest and back; rest to note and back; dot on and off; pitch stepped up and back; length changed and changed back; pressing the length the note already has (nothing written, no undo step). Characterization cases that held before: a tie on is still recorded, a conversion to a rest is still recorded with its remembered pitch, a different length is recorded and lights Restore, a real correction beside a settled one is kept. The round-trip cases failed on the old code, for example `expected { b: { tied: 'none' } } to deeply equal {}` and `expected { b: { dots: +0 } } to deeply equal {}`.

## 5. A key change is lost when the bar's first note is deleted

**Change.** `score/key-signature.ts`. `marksIn` takes the read score as an optional argument. A mark on a deleted note, or on a note made a grace note (amendment 5), is carried to the next entry standing, by the walk `rebar.ts` uses for the time signature (`effectiveMarks`). A standing entry's own mark is placed after the carried ones and wins the bar. `applyKeyLayer` takes `read` as a new last argument; `BarLayer` (`score/bar-layer.ts`) and `heldKey` pass it, so the card and the clearing rules see the carried mark and replacing it in that bar clears the old record. Without `read`, behaviour is as before.

**Proof.** Seven cases in `score/key-signature.test.ts` on the `key-changes.musicxml` fixture. Three characterize: opener standing; a deleted note carrying no mark changes no key; without `read` a mark on an entry that left the line is not placed. Four for the repair: deleted opener (keys `2,2,2,2,2,2,2,2,2,2,3,3` as with the opener standing, and B respelled to natural); a note made a grace note; the standing note's own mark wins over a carried one; the card finds the carried mark and setting a key in that bar replaces it. On the old code three of these four failed. The "own mark wins" case held on both, since it does not need the carry.

## Gates

Measured on this Linux container from a fresh `pnpm install --frozen-lockfile`. "Base" is `5594904b` in a second worktree.

| Gate | Base | Lane | Reading |
|---|---|---|---|
| 3 web-check | not run at base | `0 errors, 12 warnings, 5 files` | equals the baseline in `ENVIRONMENT.md` |
| 4 web-test | `6806 passed \| 5 skipped (6811)` | **`6841 passed \| 5 skipped (6846)`** | rises by 35: tuplet 3, correction 6, verbs 11, entry 8, key 7 |
| 5 score-parser | not run at base | `911 passed \| 5 skipped (916)` | equals `DANN.md:51` |
| 2 dictionary | not run at base | `248 passed (248)` | equals the figure in the 2026-10-12 scratch script |
| 1 phonology | not run at base | `462 passed (462)` | NOT ESTABLISHED against a baseline: the 216 and 251 in `ENVIRONMENT.md` are stale |
| blurb | not run at base | `178 passed (178)` | no baseline figure found |
| integration | not run at base | `159 passed (159)` | no baseline figure found |
| ratchets | output saved | output identical to base's | `ratchets: OK`; no ceiling raised |

**The new gate 4 figure is `6841 passed | 5 skipped (6846)` on Linux.** The Mac's recorded figure is `6804 passed | 1 skipped (6805)` (`DANN.md:51`), and base here counts `6806 | 5`. Why Linux counts two more passes and four more skips than the Mac is NOT ESTABLISHED. The ship script's literal moves by the same 35 on the Mac, taken from its own count and not from mine. The packages under `packages/` were not touched, so gates 1, 2, 5, blurb, and integration are unchanged by construction, and I ran them once on the lane only.

## The behaviour baseline, families 1 and 4

The committed baseline is of `b2869772`, and `Shane` has moved since: the MELODY legend change (`melody/legend.ts`, `i18n.ts`) is in `5594904b`. So I captured `5594904b` as a control, with the harness's own `capture.sh`, and compared the lane to it.

- **Family 1, MELODY SVG: byte-identical.** 219 files, no difference between the control and the lane.
- **Family 4, printed pages: the six sheet-HTML files are byte-identical** between the control and the lane. **The six PDFs differ in bytes** between the control and the lane, as they differ between two runs of one commit in `run2-differences/diff-run1-vs-run2.txt`. Their text layers (`pdftotext`) are identical between the control and the lane in all six.
- Against the committed baseline, `markup.en.sheets.html` and `markup.fr.sheets.html` differ, and the same two differ between the baseline and the control. The first difference is in the header legend's layout class (`below` in the baseline, `stacked` in the control). That is the legend change already on `Shane`, not this lane.

**What this does not show.** Every capture input is an unedited score with an empty correction map. The five defects live in the correction map, so the baseline does not exercise them, and "no differences" says only that the lane changes nothing for a singer who has corrected nothing. A capture on a song with corrections would show differences, and the lane has none. That capture is NOT ESTABLISHED.

## What I could not establish

1. **The Loupe's closing in defect 3, on the rendered page.** I did not run the page and drive a deletion. Established by reading only, as the brief says. The desk confirms it after the merge.
2. **Gate baselines at base for gates 1, 2, 3, 5, blurb, and integration.** Run on the lane only. Phonology, blurb, and integration have no current baseline figure in the files I read.
3. **The Mac's gate 4 figure from here.** Linux and Mac differ at base (`6806 | 5` against `6804 | 1`), and I do not know why.
4. **Playwright, both projects.** The plan's per-lane list asks for both; I did not run them. The brief's "done when" does not name them, and the capture's live pass (families 3, 4, 5) ran in Chromium and completed.
5. **A capture with corrections in it** (see the capture section).
6. **The tuplet row's behaviour on a real page.** The unit harness and a throwaway `$state` test agree. I did not exercise the Loupe's triangles in a browser.
7. **What the Loupe does when the selection lands on a grace stop after a delete.** Defect 3's third test pins where the selection goes. I did not look at what the page draws there.
8. **Whether any string a singer reads changed.** None was edited and no i18n file was touched (`git diff --stat 5594904b..HEAD` lists eleven files, all under `apps/web/src/lib/score/`). I did not need to stop.

## Conduct

No subagents, no artifact, no `.bak` file, no `git reset --hard`. Staged by explicit path every time. Two throwaway files for the `$state` check were written inside `apps/web` and deleted before any commit; `git status` was clean after. Scratch worktree and captures are in the session's scratchpad, not the repository.
