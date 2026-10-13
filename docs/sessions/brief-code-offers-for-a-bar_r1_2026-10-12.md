# Brief for Code: what Ilya can offer for a bar to confirm (Corrections slice 2, r1, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 21:58. QUEUE row 51, slice 2 of `docs/sessions/plan-corrections-build_r1_2026-10-08.md`. **For the cloud lane**, Sonnet, on branch `cloud-lane-2`, beside Code on the Mac (rows 89 and 93, the reader). Placed by Dann 2026-10-12 21:50: *"We will handle the Corrections redesign in parallel with the OCR/OMR improvements."* Fable reviews this brief before it is sent. **It is pure: a new module with tests. It changes no note, adds no string a singer sees, and touches no file in `apps/web/src/lib/omr/`, `+page.svelte`, `CorrectionSurface.svelte`, or `Loupe.svelte`.**

Displaces: nothing.

## What the singer will get from it (not in this slice)

In the review of a bar to confirm, after "Measure 9 reads as only 3 beats in 4/4.", Ilya asks one question the printed page answers: "Is the half note dotted in your score?", or "Does A or B match a triplet in your score?". **This slice builds only the list of what Ilya can offer for each bar.** Nothing on screen changes.

## 1. What was observed

- Slice 1 shipped: `barsToConfirm` names the bars whose written length differs from the metre in force, by Dann's bar rule of 2026-10-05 00:52 (`docs/sessions/report-code-bars-to-confirm_r1_2026-10-09.md`; rechecked `docs/sessions/report-code-bars-to-confirm-recheck_r1_2026-10-11.md`).
- The accepted wording of the offers, Dann 2026-10-08 16:00 to 16:02 (`docs/sessions/draft-corrections-wording_r1_2026-10-08.md`): "Is the half note dotted in your score?"; "Does A or B match a triplet in your score?" (indefinite article: the singer may answer no); "Matches my score"; "✓ Half note dotted."
- Dann, 2026-10-08 15:50 (`docs/memory/OPEN.md`, "THE CORRECTIONS REDESIGN", item 5): *"what we are looking for is not simple alignment in arithmetic... we are looking to replicate the rhythmic values assigned by the composer."* An offer names what Ilya may have missed and sends the singer to the page.
- Dann, 2026-10-12 20:10, on set 4's 4F: *"it needs to know that triplets are not the only tuplets. Quadruplets happen."*

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-12 about 21:55; re-read each before use.

- `barsToConfirm(score)` and `BarToConfirm` (`apps/web/src/lib/score/bars-to-confirm.ts:38-55`): each bar's `measureIndex`, printed `number`, `actual`, and `expected` in the signature's beat unit.
- `readMetre`, `Metre`, `Ratio`, `compound`, and `conventionalSpace` are exported from `apps/web/src/lib/omr/triplets.ts:119-201`. `ruleRatios` (`:276-279`, not exported) gives 3:2 in every metre and adds 2:3 and 4:3 in compound metre.
- `TUPLET_COUNTS` (2 to 9) and `TUPLET_VALUES` (`apps/web/src/lib/score/entry.ts:310-313`) are the tuplets the Corrections surface can already enter.
- **`triplets.ts` is being changed tonight by Code on the Mac (QUEUE row 89, the quadruplet in simple metre).** Read it; import from it only what is exported; do not edit it.

## 3. Measure before you change anything

1. For every bar `barsToConfirm` names on every tracked `.musicxml` fixture (`git ls-files '*.musicxml'`), list the bar's notes (type, dot, `<time-modification>`), its `actual` and `expected`, and by how much it is short or long.
2. Report that table before writing the module.

## 4. What to build

One function in a new file of your naming under `apps/web/src/lib/score/`: given a parsed score and one `BarToConfirm`, the offers for that bar, in this order of kinds:

1. **One note's length.** Each single change to one note that makes the bar's written length equal its metre: add a dot, remove a dot, or the next length up or down (`TUPLET_VALUES`' ladder). Each offer names the note (its index in the bar, its pitch, its printed type) and the change.
   - **An offer is made only where exactly one such change exists** (DESK DEFAULT: two or more candidates ask the singer a question the page cannot answer in one look). Where two or more exist, report them in the result and offer none of this kind.
2. **A tuplet.** Each run of consecutive notes in the bar that, read as n in the time of m, makes the bar equal its metre, for the ratios 3:2 in any metre, 2:3 and 4:3 in compound metre, and 4:3 in simple metre (Dann, 20:10). Return at most two runs, labelled A and B, ordered by where they start; a run of notes already under a `<time-modification>` is not offered again.
3. **Nothing.** The singer still has "Matches my score" and the stations.

- It changes no note, stores nothing, and adds no string.
- DESK DEFAULT, reversible: lengths in the same unit `barsToConfirm` uses, so the two agree to its `WHOLE_EPSILON` (`bars-to-confirm.ts:51-53`).

## 5. The rulings this serves

- The page is the authority, not the arithmetic (Dann 2026-10-08 15:50, quoted in section 1).
- Curation offered, never imposed (`OPEN.md`, "THE CORRECTIONS REDESIGN", items 1 to 4).
- "Does A or B match a triplet in your score?" (Dann 2026-10-08 15:53 to 16:01).
- Triplets are not the only tuplets (Dann 2026-10-12 20:10).

## 6. Constraints

- First bring `cloud-lane-2` up to `origin/Shane` by fast-forward if it is behind. Commit and push to `cloud-lane-2` only, never `Shane` or `main`; no pull request; Dann merges (`CONTRACT.md` §4).
- Do not edit anything under `docs/memory/` or in `apps/web/src/lib/omr/`.
- Gate baselines on `cloud-lane-2` at `9e1af16`: 1 `251 passed (251)`; 2 `248 passed (248)`; 3 `found 0 errors and 12 warnings in 5 files`; 4 `2428 passed (2428)`; 5 `675 passed | 5 skipped (680)`; 6 `145 passed (145)`; 7 `55 passed (55)`; 8 `ratchets: OK.` Run all eight before and after.

## 7. Done when

- Section 3's table.
- Tests: a bar short by half a half note offers "the half note, dotted"; a bar long by a dot offers that dot removed; a bar with two single-note candidates offers none of that kind and reports both; a 3/4 bar of four quarters offers a 4:3 run; a 4/4 bar of three quarters and a half reading long offers a 3:2 run; a bar already holding a tuplet is not offered it again; a bar with no candidate returns nothing.
- The function's offers for every bar section 3 lists, as a table.
- All eight gates pass; gate 4 moves only by the new tests, named.
- `WRITTEN` on the code. The table against the 17 song readings and their truth is for Code on the Mac later, because those readings are not in the repository.

## 8. Report back

`docs/sessions/report-code-offers-for-a-bar_r1_2026-10-12.md`: section 3's table first, then the module with `path:line`, the tests, the gates, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Push, and stop.
