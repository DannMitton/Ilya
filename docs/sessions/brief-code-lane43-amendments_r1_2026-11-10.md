# Brief for Code: lane 43's amendments, then the merge with Shane (r1, 2026-11-10)

Written by the desk (Opus) 2026-11-10 22:3x from Fable's as-built review `docs/sessions/review-fable-lane43-as-built_r1_2026-11-10.md` (MERGE WITH AMENDMENTS). Fable review of this brief before Code starts (CONTRACT §1 item 19). Rulings: `docs/memory/OPEN.md`, sections "BARLINE AND TIME SIGNATURE TOOLS" (2026-11-09) and "LANE 43 AS BUILT" (2026-11-10 22:31, 22:32).

## What the singer meets now, and after

Now, on `cloud-lane-43` `68cfb9c4`: after "Rebar the notes" or after removing a barline, a note entered in the middle of a bar is filed under the wrong bar and drawn in the wrong place; "Rebar the notes" does nothing at all in any stretch holding a triplet (the card closes, no time signature, no rebar); with "To the end of the song", the rebar stops at the score's next printed time signature, so the bars after it read over-full.

After: an entered note lands where the singer put it, after any rebar or join; a rebar works across triplets; "To the end of the song" rebars to the end; when a rebar cannot be done (a piece shorter than a 64th), the time signature still applies and the barlines stay (Dann 22:31).

## Branch

Cut `cloud-lane-47` from `cloud-lane-43` `68cfb9c4`. Commit and push after each step; no pull request; never push `Shane` or `main`.

## Steps

0. Read the review in full, and the lane's handover `docs/sessions/report-code-barline-ts-handover_r1_2026-11-10.md`. Run the eight gates for a baseline.
1. **Amendment 1, an entry after a rebar or a join.** `apps/web/src/lib/score/correction-verbs.svelte.ts:348` rewrites every gap's bar as `bars.toReading(songBar)`. Where `c.after` stands inside the held song bar, write no `measureIndex` (absent means the anchor's bar, `correction.ts:80`); convert only at the head caret. Tests: a quarter entered mid-bar after a 3/4 rebar of `time-signature-barlines-wrong` lands at onset 1/2 after `m1-0-1`, not at −3/4; the same after a Remove-barline join.
2. **Amendment 2, triplets.** `rebar-notes.ts:172-173`: skip the `notatable` check where the entry stays one chunk of its own length. Test (amendment 6 replaces `rebar-notes.test.ts:90`): a fixture with a real quarter-note triplet (`duration.tuplet` and lengths of 1/6), once fitting whole in its new bar and once crossing a new barline; the first rebars and adds up, the second is refused.
3. **Amendment 4, a refused rebar (ruled 22:31).** Where `rebarNotes` returns null, `correction-verbs.svelte.ts:432` applies the time signature with barlines kept, in the same one Undo step. No new string. Test: the crossing triplet of step 2 yields the new signature and the old barlines.
4. **Amendment 3, "To the end of the song".** `rebar-notes.ts:113` and `:119` stop at any `mergeBlocked` barline, and `rebar.ts:179` blocks on the reading's own signatures. Under scope `'end'`, restart the fill at such a barline and continue to the song's end. Test: a fixture whose reading changes signature mid-song; after "To the end" with Rebar, every bar adds up in the new signature.
5. **Amendment 5.** `rebar-notes.ts:182` clears `barline` on standing entries only; clear it on deleted records in the scope too. Test: a deleted note carrying a hand-made barline, inside a rebar's scope, leaves no bar reading `2 of 3`.
6. **Amendment 8.** `rebarNotesInForce` (`rebar-notes.ts:223`) has no caller outside its test: remove it and its test, or give it its caller if the code needs one; say which.
7. **The merge.** `git merge origin/Shane` (Shane is at or after `64d9f08f`). Two conflicts are expected, each one line (Fable's review, MERGE NOTES): `apps/web/src/lib/i18n.ts` header total, recount it from the file (Fable read 1,219 at Shane `3c247013`; Shane has moved since, so count again); `apps/web/src/routes/+page.svelte`, the attach line: take Shane's (its `metadata:` on `poemOffer.attach`) and replace `line: () => correctedLine` with `line: () => layer.preLine, readingLabel: (l) => layer.readingLabelOfLabel(l)`. Any other conflict: stop and report.
8. Gates on the merged tip, and Playwright: the barline and time signature specs, plus `e2e/poem-library.test.ts` and the LEARN specs, in both projects. Report the counts.
9. Report: each amendment with `path:line` and its test, the gate table, and what you could not establish.

## Constraints

- No string changes. Every ratified string stays exactly as it is in both languages.
- One vowel per note (`docs/memory/CONTRACT.md` §0.1) holds after every rebar: keep the review's check that `syllableTargetIds` is unchanged by a rebar, and add it for the triplet fixture.
- The one-tap divide offer (A1, A2) stays out of this lane.

## What you could not establish

Every report carries this section. NOT ESTABLISHED beats a complete invented answer.
