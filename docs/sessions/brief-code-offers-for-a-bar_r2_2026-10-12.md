# Brief for Code: what Ilya can offer for a bar to confirm (Corrections slice 2, r2, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 21:58. QUEUE row 51, slice 2 of `docs/sessions/plan-corrections-build_r1_2026-10-08.md`. **For the cloud lane**, Sonnet, on branch `cloud-lane-2`, beside Code on the Mac (rows 89 and 93, the reader). Placed by Dann 2026-10-12 21:50: *"We will handle the Corrections redesign in parallel with the OCR/OMR improvements."* **r2, about 22:15: applies all ten of Fable's amendments** (`docs/sessions/review-fable-brief-row51-slice2_r1_2026-10-12.md`, SEND WITH AMENDMENTS); r1 superseded. **It is pure: a new module with tests. It changes no note, adds no string a singer sees, and touches no file in `apps/web/src/lib/omr/`, `+page.svelte`, `CorrectionSurface.svelte`, or `Loupe.svelte`.**

Displaces: nothing.

## What the singer will get from it (not in this slice)

In the review of a bar to confirm, after "Measure 9 reads as only 3 beats in 4/4.", Ilya asks one question the printed page answers: "Is the half note dotted in your score?", or "Does A or B match a triplet in your score?". **This slice builds only the list of what Ilya can offer for each bar.** Nothing on screen changes.

## 1. What was observed

- Slice 1 shipped: `barsToConfirm` names the bars whose written length differs from the metre in force, by Dann's bar rule of 2026-10-05 00:52 (`docs/sessions/report-code-bars-to-confirm_r1_2026-10-09.md`; rechecked `docs/sessions/report-code-bars-to-confirm-recheck_r1_2026-10-11.md`).
- The accepted wording of the offers, Dann 2026-10-08 16:00 to 16:02 (`docs/sessions/draft-corrections-wording_r1_2026-10-08.md`): "Is the half note dotted in your score?"; "Does A or B match a triplet in your score?" (indefinite article: the singer may answer no); "Matches my score"; "✓ Half note dotted."
- Dann, 2026-10-08 15:50 (`docs/memory/OPEN.md`, "THE CORRECTIONS REDESIGN", item 5): *"what we are looking for is not simple alignment in arithmetic... we are looking to replicate the rhythmic values assigned by the composer."*
- Dann, 2026-10-12 20:10, on set 4's 4F: *"it needs to know that triplets are not the only tuplets. Quadruplets happen."*

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-12 about 21:55; re-read each before use.

- `BarToConfirm` (`apps/web/src/lib/score/bars-to-confirm.ts:38-47`): each bar's `measureIndex`, printed `number`, `actual`, and `expected` in the signature's beat unit. `barsToConfirm(score: Pick<ParsedScore, 'measures' | 'vocalLine'>)` (`:55`). The new function takes the same `score` shape plus one `BarToConfirm`.
- `readMetre`, `Metre`, `Ratio`, `compound`, and `conventionalSpace` are exported from `apps/web/src/lib/omr/triplets.ts:119-206`. `readNote`, `isRun` (`:208-216`), `onlyRunsThatFill` (`:224-247`), and `ruleRatios` (`:277-279`) are not exported and read MusicXML text, not `VocalLineEvent`; the new module states its own run test over events and does not export anything from `triplets.ts`. `ruleRatios` gives 3:2 in every metre and adds 2:3 and 4:3 in compound metre.
- `TUPLET_COUNTS` (2 to 9) and `TUPLET_VALUES` (`apps/web/src/lib/score/entry.ts:310-313`) are the tuplets the Corrections surface can already enter.
- **`triplets.ts` is being changed tonight by Code on the Mac (QUEUE row 89, the quadruplet in simple metre).** Read it; do not edit it. DESK DEFAULT: import only the types `Metre` and `Ratio`. Copy `compound`'s one line (`triplets.ts:190`) into the new file with a comment naming its source. Do not call `conventionalSpace`.

## 3. Measure before you change anything

1. List the fields of `VocalLineEvent` (`packages/score-parser/src/types.ts`, with `path:line`) that the rules need: printed type, dots, tuplet, rest, grace, pitch, `duration.fraction`. Where one is absent, mark the rule that needs it NOT ESTABLISHED and build the rest.
2. For every bar `barsToConfirm` names on every tracked `.musicxml` fixture (`git ls-files '*.musicxml'`), list the bar's notes (type, dot, `<time-modification>`), its `actual` and `expected`, and by how much it is short or long.
3. Report that table before writing the module.

## 4. What to build

One function in a new file of your naming under `apps/web/src/lib/score/`: given a parsed score and one `BarToConfirm`, the offers for that bar, in this order of kinds:

1. **One note's length.** A candidate is one sounding event (not a grace note) that carries no tuplet. Four changes, each tried alone: add a dot to an undotted note; remove the dot from a note with exactly one dot; step its printed type one rung longer or one rung shorter along `TUPLET_VALUES` (`entry.ts:313`), stopping at `16th` and `whole` (do not use `stepValue`, which wraps, `:333`). A rest is a candidate; its offer carries no pitch. `index` is the event's 0-based position among the bar's events in `vocalLine` order. A change is a candidate where it makes the bar's written length equal its metre.
   - **An offer is made only where exactly one such change exists** (DESK DEFAULT: two or more candidates ask the singer a question the page cannot answer in one look). Where two or more exist, report them in the result and offer none of this kind.
2. **A tuplet.** A run is n consecutive sounding events of one printed type, none dotted, none under a tuplet, n being the ratio's n; a rest may stand in a run. Its span is m of its notes, and it begins at a time from the bar's start that is a whole number of spans (`triplets.ts:187`, `:241-242`), so no run straddles a beat. One run at a time: a bar that fits only under two runs gets no offer of this kind and says so in the result. Ratios: 3:2 in any metre; 2:3 and 4:3 in compound metre; 4:3 in simple metre only where `beats` is 3 (DESK DEFAULT, the desk's reading of Dann 20:10; Dann may widen it). Where one or two runs fit, return them as A and B by start, then by n ascending. Where three or more fit, offer none and report them all.
3. **Nothing.** The singer still has "Matches my score" and the stations.

- It changes no note, stores nothing, and adds no string.
- Equality is exact. Sum each event's `duration.fraction` (`entry.ts:424-431`) as a fraction in lowest terms and compare it with `beats/beatType`. No epsilon. `actual` and `expected` in the tables are `BarToConfirm`'s own.
- The result's shape, DESK DEFAULT: `{ kind: 'note' | 'tuplet' | 'none'; note?: { index, pitch?, type, dots }; change?: { what: 'dot' | 'undot' | 'longer' | 'shorter'; to: NoteBase; dots: number }; runs?: { label: 'A' | 'B'; start; n; ratio: Ratio }[]; rejected: string[] }`, where `rejected` lists the candidates set aside and why, in plain words for the report, not for the singer.

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
- Tests, one per bar: (a) 4/4 half, eighth, eighth: one offer, the half dotted; (b) 3/4 dotted half, quarter: one offer, the dot removed; (c) 4/4 half, quarter: no kind 1 offer, both candidates reported; (d) 3/4 four quarters: A 3:2 over quarters 0 to 2, B 4:3 over all four; (e) 4/4 three quarters, half: kind 1 offers the half as a quarter, and kind 2 offers one 3:2 run; (f) 4/4 five quarters: A 3:2 at quarter 0, B 3:2 at quarter 2, none at quarter 1; (g) 6/8 two quarters: one 2:3 run, no kind 1 offer (two candidates reported); (h) 4/4 four quarters plus a quarter under 3:2 already marked: not offered again; (i) a bar whose only fix is a grace note's length: nothing; (j) a bar with no candidate: nothing.
- The function's offers for every bar section 3 lists, as a table.
- All eight gates pass; gate 4 moves only by the new tests, named.
- `WRITTEN` on the code. The table against the 17 song readings and their truth is for Code on the Mac later, because those readings are not in the repository.

## 8. Report back

`docs/sessions/report-code-offers-for-a-bar_r1_2026-10-12.md`: section 3's table first, then the module with `path:line`, the tests, the gates, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Push, and stop.
