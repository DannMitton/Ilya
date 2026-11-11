# Report: lane 43's amendments, then the merge with Shane (Code, cloud lane 47, r1, 2026-11-11)

Branch `cloud-lane-47`, cut from `origin/cloud-lane-43` at `68cfb9c4`. Brief: `docs/sessions/brief-code-lane43-amendments_r2_2026-11-10.md` (read from `Shane` at `47284e24`), with the two Fable reviews it names. Written step by step; each step is its own commit.

## Step 0: reading and baseline

Read in full: the brief; `review-fable-lane43-as-built_r1`; `review-fable-lane43-amendments-brief_r1`; `report-code-barline-ts-handover_r1`; `rebar-notes.ts` and `rebar-notes.test.ts`; `correction-verbs.svelte.ts:325-445`; `rebar.ts:150-200, 320-345`. The brief's "LANE 43 AS BUILT" rulings in `OPEN.md` are not on this branch and were not read; I used the brief's own quotation of them.

Baseline, working tree clean at `68cfb9c4`, run on the Mac that holds the repository:

| gate | command | result |
|---|---|---|
| 1 | `pnpm test:phonology` | 456 passed |
| 2 | `pnpm test:dictionary` | 248 passed |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings (5 files) |
| 4 | `pnpm --filter @ilya/web test` | 4796 passed, 1 skipped (266 files) |
| 5 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped |
| 6 | `pnpm test:blurb` | 168 passed |
| 7 | `pnpm test:integration` | 125 passed |
| 8 | `pnpm ratchets` | OK (719 source files) |

These equal the lane's own handover figures.

## What I could not establish (step 0)

- Playwright baselines: not run yet; step 8.
- The `OPEN.md` sections "BARLINE AND TIME SIGNATURE TOOLS" and "LANE 43 AS BUILT": not on this branch.

## Step 1: Amendment 1, an entry after a rebar or a join

`apps/web/src/lib/score/correction-verbs.svelte.ts:346-358` (`#enter`). Where `c.after` is found in `this.#d.line()` (song bars) and that entry's `measureIndex` equals `c.measureIndex`, the cursor goes to `enterEntry` as `{ kind: 'gap', after }` with no `measureIndex`; otherwise the bar is converted with `bars.toReading` as before. `adoptBarMarks` is untouched (it still receives the original cursor).

Tests, new file `apps/web/src/lib/score/entry-after-rebar.test.ts` (through `CorrectionVerbs`, the layer's own `line` and `bars`):
1. After a 3/4 rebar of `time-signature-barlines-wrong` (song bar 1 begins in reading bar 0 and holds `m1-0-1`), a quarter entered after `m1-0-1` sits directly after it at onset 1/2, in the same song bar.
2. After a Remove-barline join in `barline-clean-4-4`, a quarter entered after the first note of the joined bar's second half sits directly after it, at its onset plus its length, in joined bar 0.
3. A head-caret entry (anchor in the previous song bar) is still converted to the reading bar: B5 behaviour unchanged.

With the old line restored, tests 1 and 2 fail (the note lands after `hand:1` and after `m0-3-4`, before the anchor); with the fix all three pass. `src/lib/score`: 75 files, 1314 tests pass. `pnpm ratchets` OK.

## What I could not establish (step 1)

- Whether the live Loupe, in the browser, now draws the note in place: the unit tests go through the verbs, the layer, and `rebar`, not the page. Playwright is step 8.
- The test's "1/2" is read from the fixture as parsed here; I did not compare it with the review's probe output beyond its quoted figure.

## Step 2: Amendment 2, triplets

`apps/web/src/lib/score/rebar-notes.ts:129-157` (the fill loop) and `:172-176` (the parts). Two changes:
- The `notatable` check is skipped where an entry stays one chunk of its own length (`:173-176`). A triplet member (1/6) never has a note-value chain, so this is what unblocks the rebar.
- A group that does not fit whole into the bar it falls in no longer ends the rebar. It is left as read (no plan, no record of ours, no barline mark), the fill goes to zero, and the loop resumes at the first entry after it (`:147-157`). The group's extent is now tracked as `groupEnd` rather than the old `groupLeft` count, so a group with fewer entries than `actualNotes` cannot carry its count into the next group. The header comment (`:1-20`) says so.

Tests, `rebar-notes.test.ts` (replaces the old tuplet test; the `triplet()` helper builds a real `<time-modification>` triplet at 6 divisions to the quarter, each member 1/6):
- (a) Bar 2's two quarters become a triplet of three: eight bars add up, total length unchanged, no member re-valued, split, or tied, no remainder entered after one, and `syllableTargetIds` of the rebarred line equals that of the read line.
- (b) Bar 4's second half note becomes a triplet crossing the 3/4 barline at quarter 15: bars 0 to 3 add up, the bar holding the half note and the group reads `4 of 3`, the group is in one bar and carries no record, the two bars after it add up, eight bars in all, total length and syllable seats unchanged.
Both fail on the old code and pass on the new. `src/lib/score`: 1315 passed.

One reading of the brief to flag: in (a), a member that sits mid-bar loses the reading's barline before it (a `barline: 'none'` record on the group's first note). That is the ordinary rebar removing a reading barline, not a split or a re-valuing; the brief's "carry no record" is asserted in (b), the crossing case, where it holds.

## What I could not establish (step 2)

- A group whose members are not contiguous in `line` (a rest or another voice between them) is outside what I tested.
- How the rebarred triplet is drawn: data only.

## Step 3: Amendment 4, a refused rebar (ruled 22:31)

`apps/web/src/lib/score/rebar-notes.ts:182-184`: where a crossing piece has no note value (`notatable` returns null), `rebarNotes` returns `signed` (the `setSignature` result, `:98`) instead of null. The doc comment at `:86-93` is corrected: null only where `setSignature` refuses. The other nulls (`:99`, `:101`, `:103`, now shifted a few lines) are left as the brief says. Nothing changed in `correction-verbs.svelte.ts` or `bar-layer.ts`; one `pushUndo` and one `setCorrections` keep it one Undo step. No new string.

Test, `rebar-notes.test.ts`: one lone triplet quarter in place of bar 2's two quarters in `time-signature-barlines-wrong` (the fill is then off by a sixth and a later note crosses a barline with an un-notatable remainder). `rebarNotes` equals `setSignature` for the same arguments (deep equality), the signature record is there with `through: 'end'`, and no entered remainder and no `barline` mark were written. Before the change this returned null (the first run of the test, with only the comment edited, failed with `expected null to deeply equal {...}`). `src/lib/score`: 1316 passed.

## What I could not establish (step 3)

- That "one Undo step" holds in the page: argued from the single `pushUndo` and `setCorrections` in `handleTimeSignature`, not exercised there.
- Which real song would meet this branch: the fixture is synthetic.

## Step 4: Amendment 3, where the rebar stops, under both scopes

`apps/web/src/lib/score/rebar-notes.ts:106-132` (the scope), `:150-151` (the fill), `:207-212` (the write); `rebar.ts` exports `sameSignature` (one word). The fill now ends only where the signature's scope ends: at a later signature of hers (`owners`), or, "to the next change", where the reading's next measure has a different signature (`readingChangesSignatureAt`, the same comparison `rebar.ts:326` uses); "to the end" runs to the last entry. At any other blocked barline (key, clef, repeat, ending, jump, rehearsal mark, a gap of bars) the fill goes to zero and continues (`:151`). The reading's barline stays, the bar before may be short and flagged, and no `barline` mark is written on the entry after it: a `'before'` is written only where the reading has no barline (`before === 'none'`, `:209`), a `'none'` only where it has a removable one. The header comment is rewritten to say so.

Tests, `rebar-notes.test.ts`:
- `time-signature-barlines-wrong` with 2/4 stated at measure 4, "to the end": eight bars, all 3/4, all add up, `syllableTargetIds` unchanged.
- The same file with a key change at measure 4, "to the next change": eight bars that add up, seats unchanged.
- (added) A key change at measure 3, which falls at quarter 8, inside the new bar from 6 to 9: nine bars, the third reads `2 of 3` and the last `1 of 3`, the rest add up; the opener of measure 3 carries no `barline` mark and sits at onset 0; seats unchanged.
- (added) A later signature of hers: "to the next change" stops at it (four bars of three, then her 2/4, and her records from there on untouched); "to the end" takes her later signature away first (`setSignature`, `time-signature.ts:145`) and runs to the end, eight bars.
- `rebar-notes.test.ts` "to the next change ends at the reading's own next change of signature" still passes, unchanged.
With the step-4 code removed, the first three fail and the others pass. `src/lib/score`: 1320 passed.

A reading to flag: the brief says "'end': the last entry". I stop at her own later signature under both scopes, as `rebar.ts:333` does, but for "to the end" that case cannot arise: `setSignature` has already removed her later marks. So the two readings give the same result today.

## What I could not establish (step 4)

- A repeat, ending, jump, or rehearsal mark at a blocked barline: they take the same code path as the key change (`mergeBlocked`), but only the key change is exercised.
- Whether a note that crosses a blocked barline in the READING (a tie across a repeat) is rebarred sensibly: not probed.
