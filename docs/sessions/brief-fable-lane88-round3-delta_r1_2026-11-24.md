# Fable: as-built DELTA read of `cloud-lane-88`, `92c03cca..9c21c74e`

Written by the desk 2026-11-24 22:3x. Cap 260k tokens. One agent.

## Why this read exists

You last read this lane at `92c03cca`. Since then it has changed what a failed
gate does, added fix A with a new fixture, changed what the gate counts, and
seated a sentence Dann ratified. That is a tier 4 behaviour change nobody
independent has read. Dann merges nothing until this read lands.

## Scope

Read the delta `92c03cca..9c21c74e` in full. Four commits:

- `4e097a09` Round 3: the ruling on the count gate, fix A, fix B, pinned notes off the count
- `c63f6b58` Report: the arrival seam, round 3, r1
- `ac54b660` Seat Dann's ratified slur-evidence sentence, English and French, and pin it
- `9c21c74e` `{m}` is every sung note in the verse, pinned ones included

Twelve files, +346 and -29:

```
apps/web/src/lib/i18n.ts
apps/web/src/lib/score/ingestion/fixtures/base-5594904b-strophic-seating.json
apps/web/src/lib/score/ingestion/ingest.ts
apps/web/src/lib/score/ingestion/melisma-evidence.ts
apps/web/src/lib/score/ingestion/ratified-slur-line.test.ts
apps/web/src/lib/score/ingestion/round2.test.ts
apps/web/src/lib/score/ingestion/underlay-count.ts
apps/web/src/lib/score/ingestion/underlay-record.test.ts
apps/web/src/lib/score/ingestion/vowelless-fold.ts
docs/sessions/report-code-arrival-seam-round-3_r1_2026-11-24.md
packages/score-parser/src/fixtures/second-ending-verse-2.xml
packages/score-parser/src/types.ts
```

Read the lane's own report `docs/sessions/report-code-arrival-seam-round-3_r1_2026-11-24.md`
in full. Rounds 1 and 2 reports are on the lane for context.

You may read anything else in the tree you need. Read it; do not infer it.

## Where the tree is

The repository is on Dann's Mac, reachable through the bridge at
`$HOME/mnt/ilya-rewrite`. Use read-only git only: `status`, `log`, `diff`,
`show`, `ls-files`, always as `git --no-optional-locks`. **No agent writes with
git, ever.** Do not `add`, `commit`, `checkout`, `reset`, `stash`, `merge`, or
`rebase`. Do not run a build or a gate.

Lane tip: `9c21c74e`. Lane base: `736b1281`. `Shane` is at `16644c42`.
The lane and `Shane` share no changed file since the base, so the merge cannot
conflict; that is the desk's measurement, check it if you doubt it.

## What this round was built to do, and what it must be checked against

Each of these is a ruling. Where the code and the ruling disagree, the ruling
wins and the finding is a blocker.

1. **ONE VOWEL PER NOTE, no more and no less** (`docs/memory/CONTRACT.md`
   section 0.1). The lane claims the four `strophic-repeat` files now keep 32
   vowels and 30 IPA in EVERY verse, against 30 vowels at round 2. Check the
   claim against the code and the fixtures, not against the report.

2. **Dann's count-gate ruling of 2026-11-24 21:23** (`docs/memory/OPEN.md`, the
   RULED section under OPEN FOR DANN): the gate keeps its shape and its
   whole-verse reach. What changes is what FAILING means. A failed gate no
   longer blanks every slurred melisma in the verse. Instead the verse is seated
   as `5594904b` seats it, no per-note abstention is written for it, and ONE
   record names the verse and says the slur evidence could not be checked
   against the count. He took the named cost knowingly.

3. **The ratified melisma rule** (`../sessions/brief-code-arrival-seam-closes-up_r5_2026-11-24.md`):
   Ilya invents no melisma from absence. A surplus note is a melisma only where
   the print says so. A round that quietly reintroduces melisma-from-absence is
   a blocker.

4. **Dann's ratified sentence**, seated as `upload.banner.slurEvidenceUnchecked`
   and pinned character for character in
   `apps/web/src/lib/score/ingestion/ratified-slur-line.test.ts`, both
   languages, with a check that the French carries no straight apostrophe.
   Verify the pin is character for character and that the French follows OQLF
   typography (no-break space before « : », guillemets, U+2019 apostrophes).
   **He struck the desk's derived figure at 21:42**: the ratified pair names
   only the two counts a singer can count on her own page. A third derived
   number reaching the sentence is a blocker.

5. **A desk ruling at the close, which you are asked to test rather than
   accept**: `{m}` is every sung note in the verse, PINNED ones included,
   because the sentence promises two numbers a singer counts on her own page and
   she counts noteheads. Say whether the code matches that and whether the
   reading holds.

6. **A desk default**: a note pinned as a mark alone, or as a token with no
   Cyrillic letter, comes out of the note count BEFORE the gate, as
   extender-held notes now do. Check it is applied once and consistently.

7. **Fix A** (with its new fixture `second-ending-verse-2.xml`) and **fix B**
   from your round-2 review. Confirm each is built as you asked, or say how it
   differs.

8. **The snapshot proof.** The lane committed
   `apps/web/src/lib/score/ingestion/fixtures/base-5594904b-strophic-seating.json`
   as what `5594904b` seats, compared against the current seating for all ten
   strophic files, identical. Check that the snapshot is what it claims and that
   the comparison is real rather than self-confirming.

9. **Ratchets.** `scripts/ratchets.json` ceilings must be LEFT ALONE by this
   lane; the desk told both tier 4 lanes to touch none until both land. Also
   `score/` may not import `insights/`; that ratchet stopped two of Dann's ship
   runs tonight on the sibling lane, so check this lane does not break it.

10. **Two gates differ and the lane set out how** (scope, notes taken off first,
    which syllable count, what a failure writes, where each runs). The seating
    gate serves wordless scores with a typed poem, so a lyric-bearing song is
    decided by the seam alone. Confirm the lane did not collapse the two.

## The gate figures

Report what the lane's own run says, with where you read it. Do not derive.

- The lane's last run, per the desk's record: gate 4 `6890 passed, 5 skipped
  (6895)`, ratchets OK, `svelte-check` 0 errors.
- Gate 5 is NOT ESTABLISHED in the desk's records. At round 2 you read
  `913 passed, 5 skipped` in `packages/score-parser` against the shipped
  baseline `911 passed | 5 skipped (916)`.
- The shipped baselines today, `~/Downloads/ilya-ship.sh:183-185`: gate 4
  `6857 passed | 1 skipped (6858)` with scipy, `6853 passed | 5 skipped (6858)`
  without; gate 5 `911 passed | 5 skipped (916)`.
- **The lane's figures were measured on the lane's own tree, whose base
  predates lane 89's merge into `Shane`.** Say plainly that the merged figure
  cannot be derived from the lane's run, and do not derive one.

## Definition of done

A memo with a verdict of exactly one of **MERGE**, **MERGE WITH FIXES**, or
**DO NOT MERGE**, and under it:

1. **Blockers**, each with `path:line` read this session and the ruling it
   breaks, quoted and dated.
2. **Fixes**, each with `path:line` and what to change.
3. **What a singer meets**, in a singer's terms: what this round changes on the
   page for someone who opens a strophic song.
4. **Gate figures as the lane reports them**, with where you read each.
5. **NOT ESTABLISHED**: everything you could not settle, and what would settle
   it.

## Constraints

- Every claim about the code carries a `path:line` read in THIS session, from
  this tree. A report, a brief, an earlier review, or a memory file is not a
  line read.
- Do not write to the repository. Do not run git write commands. Do not build.
- Do not propose work outside this delta.
- House style: Canadian spelling, Oxford comma, no em dashes, sentence case
  headings, no `simply`, `just`, `easy`, no exclamation marks.
- **NOT ESTABLISHED beats a complete invented answer.**

## Return

Return the memo as your final message, in full. The desk files it as
`docs/sessions/review-fable-lane88-round3-delta_r1_2026-11-24.md`.
