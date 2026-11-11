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

## Step 5: Amendment 5, a deleted note's barline

`apps/web/src/lib/score/rebar-notes.ts:86-110` (new `withoutDeletedBarlines`) and its call in the write half (`let next = withoutDeletedBarlines(read, line, signed, start, stop)`). It walks the read line with the deletions undone, the way `effectiveMarks` (`rebar.ts:135-165`) does, and clears `barline` on each deleted record whose mark would carry to a standing entry strictly between the held opener and the end of the scope. The record keeps `deleted: true`. It returns the map untouched when no deleted record carries a barline.

Test, `rebar-notes.test.ts`: a deleted quarter in read bar 3 carrying `barline: 'before'`, inside a 3/4 rebar "to the end": the record is exactly `{ deleted: true }` afterwards, and every bar but the last adds up (the last is not null, a quarter being gone). A deleted record with a barline OUTSIDE the scope (before the held bar) keeps it. With the code removed the test fails at the first assertion (`{ deleted: true, barline: 'before' }`); I did not separately confirm that the bar-sums assertion alone would fail on the old code. `src/lib/score`: 1321 passed.

## What I could not establish (step 5)

- A deleted record whose next standing entry is the held opener or the entry at the end of the scope: left alone by design (the opener keeps its own marks, and the scope's end is outside the clear), not tested.
- A deleted hand-entered record: covered by the same walk, not tested.

## Step 6: Amendment 8, `rebarNotesInForce` removed (DESK DEFAULT)

Removed `rebarNotesInForce` from `apps/web/src/lib/score/rebar-notes.ts` (it was the last export, with its comment), its import from `rebar-notes.test.ts`, and its test ("Rebar again with the signature already in force…"). `git grep rebarNotesInForce -- apps packages` finds nothing. `src/lib/score`: 75 files, 1320 passed (one test fewer than step 5). `pnpm ratchets` OK.

## What I could not establish (step 6)

- `svelte-check` was not run for this step alone; it runs on the merged tip in step 8.

## Step 7: the merge

`git merge origin/Shane` (`47284e24`, after `64d9f08f`), commit `a5513cba`. Exactly the two expected conflicts, each one hunk, and no others:
- `apps/web/src/lib/i18n.ts:19-23`, the header total: set to **1,219** (HEAD said 1,205, Shane 1,200). `i18n-index.test.ts` passes, 5 of 5.
- `apps/web/src/routes/+page.svelte:2318-2322`, the attach line: Shane's, which carries `metadata: { get: () => doc.metadata, set: (m) => handleMetadataChange(m) }` on `poemOffer.attach`, with `line: () => correctedLine` replaced by `line: () => layer.preLine, readingLabel: (l) => layer.readingLabelOfLabel(l)`. Both are present in the merged line.

## Step 8: gates and Playwright on the merged tip

Gates on `a5513cba` (run on the Mac), then one fix:

| gate | command | baseline (`68cfb9c4`) | merged tip |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 456 | 456 passed |
| 2 | `pnpm test:dictionary` | 248 | 248 passed |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings | 1 error on first run (see below), then 0 errors, 12 warnings (5 files) |
| 4 | `pnpm --filter @ilya/web test` | 4796 passed, 1 skipped (266 files) | 5189 passed, 1 skipped (280 files) |
| 5 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped | 785 passed, 5 skipped |
| 6 | `pnpm test:blurb` | 168 | 168 passed |
| 7 | `pnpm test:integration` | 125 | 151 passed |
| 8 | `pnpm ratchets` | OK (719 files) | OK (743 files) |

The gate 3 error was mine: a cast in `entry-after-rebar.test.ts` (step 1's test) that `svelte-check` rejected. Fixed in the commit that carries this report (a narrowing through a function instead of a cast); the file's three tests still pass and `svelte-check` is 0 errors, 12 warnings. Gates 4 and the others were run before that fix; only that test file changed after them.

The merged gate 4 and 7 counts are higher than the baseline because Shane's own work arrived with the merge, not because of this lane.

Playwright, run by `pnpm dev` on `localhost:5173`, `apps/web`:

| project | specs | result |
|---|---|---|
| chromium | `barline-head-caret` 1, `barline-verb` 4, `time-signature-card` 7 | 12 of 12 passed |
| chromium | `singer-paths` 7 | 6 passed, 1 failed |
| chromium | `poem-library` 21 | 4 passed, 17 failed |
| phone | `e2e-phone/time-signature-card` 1 | 1 passed |

The 18 failures are not from this lane:
- **`poem-library`, 17 of 21.** Every failure waits for `poem-library-card` after a paste, and the page snapshot shows the Lyrics box empty. The tests paste with `Control+V`; on this Mac's Chromium that does not paste and `Meta+V` does (a probe on a plain textarea: `Control+V` gave `""`, `Meta+V` gave `"hello"`). A temporary copy of the spec with `Control+V` replaced by `Meta+V` passed **21 of 21** against the merged tip, so the merged `poemOffer.attach` line works. The copy was deleted; no spec was changed.
- **`singer-paths`, 1 of 7**, "Learn and Guide open…": the spec expects the French title "La diction lyrique russe pour chanteurs"; the page shows "…pour chanteuses et chanteurs". `origin/Shane`'s own i18n holds the longer title and its own spec the shorter, and neither file differs between `origin/Shane` and this branch (`git diff origin/Shane HEAD` on both specs is empty).
- The phone project has no `poem-library` or `singer-paths` spec (its `testDir` is `e2e-phone`), so "both projects" for those two means chromium only. I ran the one phone time signature spec.

## Step 9: the amendments, with where and how they were tested

Line numbers are at the tip, `rebar-notes.ts` unless given; the earlier step sections cite lines as they stood then.

| amendment | where | test |
|---|---|---|
| 1, an entry after a rebar or a join | `correction-verbs.svelte.ts:346-358` (`#enter`; `anchor` at `:353`) | `entry-after-rebar.test.ts`: mid-bar after a 3/4 rebar; after a Remove-barline join; head caret unchanged |
| 2, triplets | `:178-200` (group head), `:220-224` (no `notatable` for an entry that stays one chunk of its own length) | `rebar-notes.test.ts:105` (fits whole), `:124` (crosses a barline) |
| 4, a refused rebar | `:226` (`return signed`); comment `:86-93` | `rebar-notes.test.ts:146` |
| 3, where it stops | `:152-166` (scope), `:180` (fill resets at a blocked barline), `:238-243` (no mark at a blocked barline) | `rebar-notes.test.ts:173` (2/4 at measure 4, "to the end"), `:183` (key change at measure 4, "to the next change"), `:192` (key change mid-bar), `:206` (her later signature); `:162` still passes |
| 5, a deleted note's barline | `:93-117` (`withoutDeletedBarlines`), called at `:234` | `rebar-notes.test.ts:223` |
| 8, `rebarNotesInForce` | removed | its test removed |

Each new test was shown to fail with its code taken out: amendment 1 (2 of 3 fail), 2 (both fail), 3 (the three brief-or-added tests fail; `:206` passes either way), 5 (fails). Amendment 4's test failed before the change (null). Amendment 1's old code was restored from `git show HEAD:` and put back from a copy; nothing was stashed or checked out. One-vowel-per-note: `syllableTargetIds` unchanged is asserted in the triplet tests, the two scope tests, and the mid-bar key-change test; it was not added to the pre-existing eight-bar test.

Branch `cloud-lane-47`, one commit per step plus this one, all pushed; no pull request; `Shane` and `main` not pushed. The working tree in `~/Desktop/ilya-rewrite` is now on `cloud-lane-47`, not `Shane`.

## What I could not establish (steps 7 to 9)

- **Playwright baselines.** I did not run the 18 failing tests on `68cfb9c4` or on `origin/Shane`. The causes above (a keyboard modifier on macOS, and a title mismatch present on Shane) rest on the failure text, a probe, a passing `Meta+V` rerun, and a diff of the specs, not on a baseline run. The lane's own handover counted eleven baseline failures on Linux (chromium 7, phone 4); I did not run the rest of either project, so I have no figure to compare.
- **`singer-paths` was not run with `Meta+V`**; its one failure is a title mismatch, not a paste.
- **The whole Playwright suite**, either project: not run, only the specs the brief names.
- **Beams, ties, and how a rebarred triplet or a divided bar is drawn:** data only, no screenshot taken.
- **A real reader's output:** every fixture is synthetic, as before.
- **The `OPEN.md` rulings** (22:31, 22:32): not on this branch; I used the brief's quotation.
- **`jump` tokens and accompaniment events in a divided bar:** not probed (outside these amendments).
- **Whether the merge touches the Vercel preview or any deployed build:** nothing was deployed; everything ran on localhost.
