# Fable: as-built DELTA read of lane 88, round 4, `9c21c74e..<tip>`

Written by the desk 2026-11-24 23:5x. Cap 200k tokens. One agent.
You read this lane twice already: as built at `92c03cca`, and the round-3 delta
`92c03cca..9c21c74e`, where you returned MERGE WITH FIXES with five fixes and no
blocker. **Round 4 applies all five.** This read covers round 4 alone.

## Where to read

A shallow clone of `cloud-lane-88` is in this container at **`/home/claude/lane88`**.
Use ordinary read-only git there. The memory files (`CONTRACT.md`, `OPEN.md`,
`STATE.md`) are on Dann's Mac through the bridge at
`$HOME/mnt/ilya-rewrite/docs/memory/`. **Write nothing anywhere. Run no build and
no gate.**

Round 4's commits: `f82792a` step 1, `65d379e` step 2, `017a8fb` step 3,
`8f1f10b` step 4, `7fb33e7` the report, plus one later text-only commit
amending the report and correcting two claims in round 3's report. Read to the
branch tip.

## The one judgement the desk wants ruled independently

**Step 2 was built after its probe disproved its example.** The brief said to
build nothing for an item whose probe disproves its premise. Probe B on
`n188-markings.musicxml` showed the emptied tail notes take NO sustained vowel
there, because a rest ends the sustain (`vowel-resolver.ts:265-266`). The lane
built a control with no rest, which does show an emptied note sustaining a vowel
no print supports, and built step 2 on that.

**The desk ruled that the probe disproved the example and not the premise, and
told the lane to keep it.** Rule on that independently. If you find the premise
itself does not hold on any input a singer can reach, say so and call it a
blocker.

## What else to check

1. **Step 1.** The notice fires only for a failed verse with an unexplained or an
   emptied note. Probe A's case writes no record, and a kept test asserts it.
2. **Step 2.** A failed verse keeps the abstention for the emptied notes and
   drops only the unexplained. **Verify the lane's claim that the five
   failed-verse fixtures have no emptied notes, so the `5594904b` seating does
   not move.** The committed snapshot comparison is the instrument.
3. **Step 3.** Both records print `v.notes`. A kept test fails with `v.sung`.
4. **Step 4 and the amendment.** Your own fix 5 items: the `{m}` wording at
   three sites, the attribution corrected to the desk dated 2026-11-24, every
   2026-11-25 date corrected, the "Five noteheads" comment, the stale
   `melisma-evidence.ts:5-8` header, and the round-3 report's seam-gate cite
   corrected to `:73-80`. Plus the two round-3 report claims now corrected.
5. **Nothing a singer reads changed its words.** `i18n.ts:1563` and its pins at
   `ratified-slur-line.test.ts:17` and `:23` are byte-identical to `9c21c74e`.
6. **The gate's formula and its whole-verse reach are untouched**
   (`melisma-evidence.ts:79`). Dann ruled both at 21:23.
7. **`scripts/ratchets.json` untouched**, `packages/score-parser/src/types.ts`
   not grown past 1000 lines, `score/` imports nothing from `insights/`.
8. **Nothing reintroduces a melisma from absence.**
9. **The round-4 report carries no false claim**, checked against the tree.

## Gate figures

Report them as the lane reports them, with where you read each. Derive none.
The lane's run: gate 1 462, gate 2 248, gate 3 0 errors and 12 warnings, gate 4
`6893 passed, 5 skipped (6898)`, gate 5 `913 passed, 5 skipped`, gate 6 178,
gate 7 159, gate 8 ratchets OK. **These were measured on the lane's own tree,
whose base predates what `Shane` holds. The merged figure cannot be derived from
them, and you derive none.**

## Definition of done

A memo, as your final message, with a verdict of exactly **MERGE**, **MERGE WITH
FIXES**, or **DO NOT MERGE**, and under it: blockers, each with a `path:line`
read this session and the ruling it breaks, quoted and dated; fixes; your ruling
on the step 2 judgement above; what a singer meets; the gate figures with their
source; and NOT ESTABLISHED.

## Constraints

- Every claim about the code carries a `path:line` read in THIS session.
- Write nothing. Run no build and no gate.
- House style: Canadian spelling, Oxford comma, no em dashes, no `simply`,
  `just`, `easy`, no exclamation marks.
- **NOT ESTABLISHED beats a complete invented answer.**
