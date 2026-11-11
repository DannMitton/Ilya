# Review: lane 43 as built, the barline and time signature tools (Fable, r1, 2026-11-10)

Read at `/root/lane43`, `cloud-lane-43` `68cfb9c4`, working tree clean before and after. Nothing changed, committed, or pushed there. Probes ran in two throwaway clones. Paths below are under `apps/web/src/lib/score/` unless given in full.

## Verdict: MERGE WITH AMENDMENTS

Every ratified string is present exactly. Two defects in what was built are reachable in ordinary use and are fixed before the merge (amendments 1 and 2). Nothing built depends on A1 or A2.

## Amendments

1. **A note entered after a rebar or a removed barline lands in the wrong place, in one probe at a negative onset. Blocking.** `correction-verbs.svelte.ts:348` rewrites every gap's bar as `bars.toReading(songBar)`, the reading bar the song bar BEGINS in. In a song bar that spans a reading barline (every bar "Rebar the notes" fills across one, and every bar joined by Remove), the anchor sits in the next reading bar, so the entry is filed under the wrong one (`correction.ts:648`) and `rebar.ts:238-242` regroups it. Probe on `time-signature-barlines-wrong` after a 3/4 rebar: a quarter entered after `m1-0-1` is drawn before it at onset −3/4. Fix: where `c.after` stands in the held song bar, write no `measureIndex` (absent means the anchor's bar, `correction.ts:80`); convert only at the head caret. The same probe with that change lands the note in place at 1/2. Add the test: enter mid-bar after a rebar, and after a join.

2. **"Rebar the notes" refuses any song with a triplet in scope, silently. Blocking (ruled "completed fully").** `rebar-notes.ts:172-173` asks `notatable` for every entry, split or not; a triplet member (1/6) is never notatable, so the function returns null. Then `correction-verbs.svelte.ts:432` returns, the card closes (`time-signature-ui.svelte.ts:87-88`), and neither the signature nor the rebar is written. Probe: a quarter triplet that fits whole in its new bar gives null. Fix: skip `notatable` where the entry is one chunk of its own length; with that one line the probe gives eight bars that add up.

3. **"To the end of the song" with Rebar stops at the reading's next change of signature.** `rebar-notes.ts:113` and `:119` stop at any `mergeBlocked` barline, and `rebar.ts:179` blocks on the READING's signatures. The signature runs to the end (correct, `rebar.ts:333-340`); the notes after the change keep the old barlines and every bar reads `4 of 3` (probe). The brief's scope is "to the end of the song". Fix: under `'end'`, restart the fill at such a barline and continue.

4. **A refused rebar says nothing. TASTE.** After amendment 2 this is left only for a crossing piece shorter than a 64th (`rebar-notes.ts:173`). Choices: apply the signature and keep the barlines, or do nothing as now. Recommendation: the first; it needs no new string.

5. **A deleted note carrying her barline survives a rebar inside its scope.** `rebar-notes.ts:182` clears marks on standing entries only; `rebar.ts:153-163` carries the deleted note's mark forward. Probe: bars read `2 of 3` and `1 of 3`. Fix: clear `barline` on deleted records in scope too.

6. **The tuplet test passes on a broken build.** `rebar-notes.test.ts:90` tags `duration.tuplet` on plain quarters, so no tuplet length is ever counted; that is why amendment 2 was not caught. Replace with a fixture carrying a real triplet, one that fits and one that does not.

7. **The card's one button and its way out. TASTE.** The button reuses `correct.tsChange` and Cancel reuses `upload.ask.cancel` (`TimeSignatureControls.svelte:166-167`). Both are ratified words, in a place Dann has not seen. Recommendation: keep.

8. **Small.** `rebarNotesInForce` (`rebar-notes.ts:223`) has no caller outside its test.

## What holds (checked)

- **Strings.** All 19 keys in English and French, and the reworded `insights.phonation.estimatedMetre`, match `rulings-2026-11-09-evening.md` and `origin/Shane:docs/memory/OPEN.md` character for character (script comparison). Apostrophes are U+2019. No ratified string calls for a no-break space; the semicolon has none before it, as ruled. No unratified string is shown; the card's remaining text is numerals. `loupe.divide*` and `loupe.undo.divided` are present and unused.
- **Ties.** The read note takes `tied: 'start'`, each remainder is an entered note of the same pitch, and the last carries the tie the read note had (probe: `start, start, none` restored correctly). A crossing rest splits with no tie.
- **One vowel per note.** `syllableTargetIds` gives the same list before and after a rebar, after a rebar there and back, and after a 5/16 rebar with chained values (`pairings.ts:297-306` reads the previous note's tie).
- **One Undo step.** One `pushUndo` and one `setCorrections` (`correction-verbs.svelte.ts:433-434`); the input map is not mutated.
- **Scope, keeping the barlines.** "To next" stops at the reading's change; "to end" overrides it; a later mark of hers bounds an earlier one (probe, and `rebar.ts:330-341`).
- **Persistence.** Both fields ride `corrections` whole through save, reload, and binder (`library/library.ts:250`; `library/barline-record.test.ts`).

## Gaps against the brief, known and left

- The unread-bars banner still lists the print's bar numbers (B2 report). After a rebar most numbers differ. Fable's B2 "done when" named it; the brief's cut order did not.
- Rebar to 3/4 and back to 4/4 leaves four tied quarter pairs where the print has half notes (probe). The music and the seats are unchanged; Undo is the clean way back.

## Merge notes

- `git merge-tree --write-tree origin/Shane HEAD`: two conflicts, both one line.
  - `apps/web/src/lib/i18n.ts`, the header total: the merged figure is **1,219** (Shane 1,200, lane +19). The per-prefix lines merge by themselves.
  - `apps/web/src/routes/+page.svelte`, the long attach line: take Shane's (it adds `metadata:` to `poemOffer.attach`) and replace `line: () => correctedLine` with `line: () => layer.preLine, readingLabel: (l) => layer.readingLabelOfLabel(l)`.
- With those two resolutions, in a throwaway clone: web unit suite 4,983 passed, 1 skipped (278 files); `svelte-check` 0 errors, 12 warnings; ratchets OK (`+page.svelte` 5,511 of 5,534). No further fix was needed.

## Tests

Mostly behaviour: bars add up, ids survive, total length is unchanged, French compared to literals in the browser tests. Wiring pins only: `correction-verbs.test.ts:365` and `:389` (a stubbed layer). Passes on a broken build: amendment 6. Missing: any entry after a rebar or join (amendment 1), and "to the end" across a reading change (amendment 3).

## What I could not establish

- Playwright, either project, on the lane or on the merged result: not run. The lane's counts are its own report.
- Gates 1, 2, 5, 6, 7 on the merged result: not run.
- How ties and beams are drawn after a rebar: data only.
- Behaviour on a real reader's output: every fixture is synthetic, as the lane says.
- Tuplet groups with fewer events than `actualNotes` (`rebar-notes.ts:140-151`, `barline-marks.ts:47-53`): read, suspected to miscount, not probed.
- Accompaniment events and `jump` tokens in a divided bar (B1 report): not probed.
