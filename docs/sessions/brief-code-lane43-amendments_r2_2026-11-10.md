# Brief for Code: lane 43's amendments, then the merge with Shane (r2, 2026-11-10)

Written by the desk (Opus) 2026-11-10 22:3x from Fable's as-built review `docs/sessions/review-fable-lane43-as-built_r1_2026-11-10.md` (MERGE WITH AMENDMENTS). r2 applies Fable's review of r1 (`docs/sessions/review-fable-lane43-amendments-brief_r1_2026-11-10.md`, SEND WITH AMENDMENTS, nine applied). Both reviews and the rulings below are on `Shane` from Dann's ship that precedes this lane. Rulings: `docs/memory/OPEN.md`, sections "BARLINE AND TIME SIGNATURE TOOLS" (2026-11-09) and "LANE 43 AS BUILT" (2026-11-10 22:31, 22:32).

## What the singer meets now, and after

Now, on `cloud-lane-43` `68cfb9c4`: after "Rebar the notes" or after removing a barline, a note entered in the middle of a bar is filed under the wrong bar and drawn in the wrong place; "Rebar the notes" does nothing at all in any stretch holding a triplet (the card closes, no time signature, no rebar); the rebar stops at the next printed time signature ("To the end") or at the next key change, clef, repeat, ending, jump, or rehearsal mark (either scope), so the bars after it read over-full.

After: an entered note lands where the singer put it, after any rebar or join; a rebar works across triplets; "To the end of the song" rebars to the end; when a rebar cannot be done (a piece shorter than a 64th), the time signature still applies and the barlines stay (Dann 22:31).

## Branch

Cut `cloud-lane-47` from `cloud-lane-43` `68cfb9c4`. Commit and push after each step; no pull request; never push `Shane` or `main`.

## Steps

0. Read the review in full, and the lane's handover `docs/sessions/report-code-barline-ts-handover_r1_2026-11-10.md`. Run the eight gates for a baseline.
1. **Amendment 1, an entry after a rebar or a join.** `apps/web/src/lib/score/correction-verbs.svelte.ts:348` rewrites every gap's bar as `bars.toReading(songBar)`. In `#enter` (`:346-351`), find `c.after` in `this.#d.line()` (song bars). If that entry's `measureIndex` equals `c.measureIndex`, pass the cursor to `enterEntry` with no `measureIndex` (absent means the anchor's bar, `correction.ts:80`); otherwise convert as now. Leave `adoptBarMarks` as it is. Tests: a quarter entered mid-bar after a 3/4 rebar of `time-signature-barlines-wrong` lands at onset 1/2 after `m1-0-1`, not at −3/4; the same after a Remove-barline join.
2. **Amendment 2, triplets.** `rebar-notes.ts:172-173`: skip the `notatable` check where the entry stays one chunk of its own length. Test (replaces `rebar-notes.test.ts:87`): a real quarter-note triplet (`<time-modification>`, lengths of 1/6). (a) It fits whole in its new bar: eight bars add up, `syllableTargetIds` unchanged. (b) It crosses a new barline: a tuplet is never split across a barline, so the bar that holds the group stays as it is, short or long and flagged, the group's entries carry no record, and the fill continues after the group as at a blocked barline (step 4). DESK DEFAULT: continue after the group rather than end the rebar there (as built, `rebar-notes.ts:147-150`), so the rest of the song is still rebarred.
3. **Amendment 4, a refused rebar (ruled 22:31).** At `rebar-notes.ts:173`, return `signed` (the `setSignature` result, `:98`) where it returns null; correct the comment at `:87`. Change nothing in `correction-verbs.svelte.ts` or `bar-layer.ts` (one `pushUndo`, `:433`, and one `setCorrections`, `:434`, keep it one Undo step). The other nulls (`:99`, `:101`, `:103`) are cases `setSignature` refuses too; leave them. No new string. Test: one lone triplet quarter in place of bar 2's two quarters in `time-signature-barlines-wrong`; `rebarNotes` equals `setSignature` for the same arguments.
4. **Amendment 3, where the rebar stops, under both scopes.** `rebar-notes.ts:113` and `:119` stop at any `mergeBlocked` barline (`rebar.ts:178-188`: key, clef, repeat, ending, jump, rehearsal mark, and the reading's own signatures). Under both scopes, end the fill only where the signature's scope ends (`'next'`: the reading's next change of signature, or her later signature, `rebar.ts:330-341`; `'end'`: the last entry). At every other blocked barline, set the fill to zero and continue; the reading's barline stays, the bar before it may be short and flagged, and no `barline` mark is written on the entry after it (`:186-188` would write `'before'`). Tests: `time-signature-barlines-wrong` with 2/4 stated at measure 4, `'end'`; the same file with a key change at measure 4, `'next'`; eight bars add up in each; `rebar-notes.test.ts:102` still passes.
5. **Amendment 5.** `rebar-notes.ts:182` clears `barline` on standing entries only; clear it on deleted records in the scope too. Test: a deleted note carrying a hand-made barline, inside a rebar's scope: after the rebar the deleted record carries no `barline`, and every bar but the last adds up.
6. **Amendment 8.** `rebarNotesInForce` (`rebar-notes.ts:223`) has no caller outside its test. DESK DEFAULT, remove: remove it, its import (`rebar-notes.test.ts:8`), and its test (`:113`).
7. **The merge.** `git merge origin/Shane` (Shane is at or after `64d9f08f`). Two conflicts are expected, each one line (Fable's review, MERGE NOTES): `apps/web/src/lib/i18n.ts` header total, 1,219 (Shane 1,200, lane +19, no string added here; `i18n-index.test.ts` fails on a wrong total); `apps/web/src/routes/+page.svelte`, the attach line: take Shane's (its `metadata:` on `poemOffer.attach`) and replace `line: () => correctedLine` with `line: () => layer.preLine, readingLabel: (l) => layer.readingLabelOfLabel(l)`. Any other conflict: stop and report.
8. Gates on the merged tip, and Playwright: the barline and time signature specs, plus `e2e/poem-library.test.ts` and `e2e/singer-paths.test.ts`, in both projects. Report the counts.
9. Report: each amendment with `path:line` and its test, the gate table, and what you could not establish.

## Constraints

- No string changes. Every ratified string stays exactly as it is in both languages.
- One vowel per note (`docs/memory/CONTRACT.md` §0.1) holds after every rebar: keep the review's check that `syllableTargetIds` is unchanged by a rebar, and add it for the triplet fixture.
- The one-tap divide offer (A1, A2) stays out of this lane.

## What you could not establish

Every report carries this section. NOT ESTABLISHED beats a complete invented answer.
