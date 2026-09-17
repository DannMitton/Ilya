# Memo: N.144, Start placement over keeps the score's own layout, and can be undone

Revision 1, 2026-09-16. Built against
`docs/sessions/brief-n144-start-over-keeps-the-score_r1_2026-09-16.md`.

## 1. What changed

**`apps/web/src/routes/+page.svelte` only.** One function, `handleStartPlacementOver`
(`:590-635`), plus its doc comment (`:544-589`).

- New doc-comment paragraphs (`:564-589`) recording the N.144 cause, the
  guard's reasoning, and the undo addition, alongside the existing N.112
  paragraphs, which are unchanged.
- `:618-620`: a comment, then `pushUndo({ kind: 'text', key:
  'loupe.undo.startOver' })` at `:621`, placed after the existing `if (source
  === 'none') return;` and before any mutation, matching where
  `placeArmedSyllable` (`:634` of the brief-n142 build) places its own push
  for the identical reason: a press with nothing to rebuild must not leave an
  Undo pill promising to undo nothing.
- `:622-627`, the new branch:
  ```
  if (scoreText !== '' && doc.inputText === scoreText) {
      doc.pairings = {};
      seatFilledPoem(ingestedScore);
      orphanedCount = 0;
      return;
  }
  ```
- The existing `rebuildQueue`/`firstPass`/`pairingCursor` block is untouched
  below it, now reached only when the guard above is false.

No other file changed. `score-seat.ts`, `pairings.ts`, and `i18n.ts` were read
but not edited: `i18n.ts` already carries `loupe.undo.startOver` (`:395`,
ruled and built by the loupe French pass), and §3 below is why
`score-seat.ts` did not need to change.

## 2. Was the guard's two halves already covered by tests?

**Yes, both halves, by the existing `score-seat.test.ts`, unmodified. No new
test file or new case was needed**, matching the brief's own instruction not
to invent new machinery unless a gap turned up. None did.

- **The match half** (`scoreText !== '' && doc.inputText === scoreText` true):
  covered by `'places every slot of the poem exactly once'`
  (`score-seat.test.ts:71-79`), which builds `lines` from
  `scoreWordsText(collectScoreWords(score, 1))` — the same value `scoreText`
  holds in the running app — and confirms all 95 slots of the Sunless 01
  fixture seat, none twice, via the exact call `handleStartPlacementOver`'s
  new branch now makes (`seatCliticFolds(score, seatScoreWords(score, {},
  lines).map)`, which is what `seatFilledPoem` does line for line).
- **The mismatch half** (guard false, old code path unaffected): covered by
  `'seats nothing against a poem that is not the score text'`
  (`score-seat.test.ts:158-164`), which feeds `seatScoreWords` a wholly
  different poem (Pushkin's *Я помню чудное мгновенье*) against the Sunless
  01 score and asserts `seated: 0`, `map: {}` — exactly the outcome the brief
  says must never be reached from an already-emptied `doc.pairings`, and
  exactly why the guard exists.

Both tests ran clean before and after this change (§4); neither needed
touching, because the guard's whole job is to decide, in `+page.svelte`,
which of these two already-proven behaviours to call into, not to change
either one.

**One thing confirmed by reading rather than assumed: `scoreText`
(`+page.svelte:385-387`) is definitionally the same string these tests build
`lines` from**, both being `scoreWordsText(collectScoreWords(score, 1))` over
the same `ingestedScore.result.score`. So "the box still holds the score's
own words verbatim" in the guard and "the poem the test hands to
`seatScoreWords`" are the same claim, checked in two different places for two
different reasons (a Svelte reactive comparison here, a fixture assertion
there), and neither can silently drift from the other without a source
edit to `scoreWordsText` or `collectScoreWords` that would show up in both.

## 3. Why `score-seat.ts` did not need a new field

The brief flagged, as a real risk, that `seatScoreWords` returns `{map,
seated: 0, withheld: 0}` unchanged on total misalignment, indistinguishable
from the same shape a caller might expect from a valid but genuinely-empty
result. **Reading `handleStartPlacementOver`'s new branch again with that
risk in mind: the guard is evaluated BEFORE the call, not after.** The
function never calls `seatFilledPoem` and then inspects the result to decide
whether to trust it; it decides whether the two texts already agree first,
and only calls the score-seat path once they do. So the ambiguous
`seated: 0, withheld: 0` shape is never produced on this call path at all,
under the guard's own terms: it can only be produced when `align` fails,
and `align` failing is not the case the guard's `doc.inputText === scoreText`
comparison passes. **A new `aligned` field on `ScoreSeatResult` would have
been solving a problem this design does not have**, because the ambiguity
the brief worried about belongs to reading a return value after the fact,
and this fix reads the input before the call instead. Left `score-seat.ts`
untouched, per the brief's own "do not touch unless step 4 finds the return
value genuinely cannot support the guard" instruction.

## 4. Gate results

All five run in full, individually, today, against the baseline recorded in
`docs/memory/ENVIRONMENT.md` §`Gate baselines` (moved 2026-09-16 late by
N.142 and the loupe French build):

| gate | baseline | this run |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216) |
| dictionary | 235 passed (235) | 235 passed (235) |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files (same seven: two unused CSS selectors, two empty rulesets, three `tabindex` a11y warnings, all pre-existing and outside `handleStartPlacementOver`) |
| web-test | 1201 passed (1201) | 1201 passed (1201), unchanged |
| score-parser | 567 passed, 5 skipped (572) | 567 passed, 5 skipped (572), unchanged |

**No gate moved.** This item added no new test file, because §2 established
the existing `score-seat.test.ts` already proves both halves of the guard
the new branch relies on, and `+page.svelte` itself carries no automated
coverage for either branch to extend (§6). `docs/memory/ENVIRONMENT.md`'s
table needs no edit.

## 5. The spec's two NOT ESTABLISHED items

Both left exactly as the spec and the brief left them, per the brief's own
instruction that they are "checked on this item's walk":

1. **What draws the line under «сту-дё».** Not investigated. The rendering
   code (`staff-renderer.ts`'s underlay drawing) was not opened for this
   build; the fix changes which note a syllable lands on, not how a landed
   syllable is drawn, so whatever draws that line should simply have nothing
   to draw once the melisma's second note stops receiving a syllable of its
   own. Still NOT ESTABLISHED whether that reasoning holds against the actual
   drawing code.
2. **Whether the `ˈjokstu` collision survives.** Not investigated for the
   same reason: it is a rendering-layer question, and the fix is a seating
   fix. The expectation the reasoning above gives is that it does not
   survive, because the collision was two syllables landing on adjacent notes
   of one melisma that should have carried one syllable between them; once
   only the first note takes it, there is only one syllable in that span to
   collide with anything. **Still NOT ESTABLISHED from code alone; both wait
   for Dann's walk, per the brief.**

## 6. What could not be established

- **Whether the fix behaves correctly in the running app, on the actual T05
  melisma Dann found.** `+page.svelte` carries no automated test coverage
  (confirmed this session: `find apps/web/src/routes -iname "*.test.*"`
  returns nothing), the same boundary `memo-n142-tie-prolongation_r1_2026-09-16.md`
  §9 already named for `placeArmedSyllable`. This memo's confidence rests on
  `seatFilledPoem` being the exact, unmodified, already-proven function N.134
  built and already runs live on every score's arrival, called here under a
  guard built from the same comparison its own two existing callers already
  use — not on a fresh reproduction of Dann's own walk.
- **Whether any song in Dann's own library has its poem box holding text that
  is CLOSE to but not byte-identical to its score's own words** (a stray
  space, a smart quote where the score used a straight one, and so on) in a
  way that would make the guard read false and fall back to `firstPass` when
  a singer might expect the new path. Not measured; no access to his
  library's stored records from this coding session, the same limit
  `memo-n142-tie-prolongation_r1_2026-09-16.md` §5 and §9 named for a related
  question.
- **Whether `pushUndo`'s snapshot correctly restores the PRE-rebuild
  arrangement when the new branch runs.** Read through `snapshot`/`restore`
  (`+page.svelte:872-889`) and reasoned that it must, because `snapshot`
  captures `doc.pairings` by reference before this function reassigns it to
  `{}`, the identical pattern every other `pushUndo` call in this file
  already relies on; not walked live.

## 7. Decisions this brief did not settle, and are reversible

- **No new field was added to `ScoreSeatResult`** (§3), reversing what the
  brief flagged as a live possibility ("unless the memo shows the existing
  return value cannot distinguish the cases this item needs distinguished").
  Reversible: if a future caller of `seatScoreWords` needs to distinguish "no
  score words" / "poem not one line" / "alignment failed" from each other
  rather than from "aligned but seated nothing" (which cannot arise against
  an empty base map, per §3), that caller can still add the field then.
- **`orphanedCount = 0` was kept in the new branch**, matching what the old,
  single-branch function always did, rather than leaving it to whatever
  `seatFilledPoem`'s other callers do (neither of which resets it around
  their own call). Reversible: if a future reading finds `orphanedCount`
  should track something narrower than "any rebuild just ran," this line
  moves with it.

## Files touched

- `apps/web/src/routes/+page.svelte` (tracked, modified)
- `docs/sessions/brief-n144-start-over-keeps-the-score_r1_2026-09-16.md`
  (this session, new, untracked)
- `docs/sessions/memo-n144-start-over-keeps-the-score_r1_2026-09-16.md` (this
  file, new, untracked)

Not committed and not staged. No git command that writes was run.
