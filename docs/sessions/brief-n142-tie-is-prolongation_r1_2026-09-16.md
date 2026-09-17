# Brief: N.142, a tie is prolongation, not a new syllable target

Revision 1, 2026-09-16. Written at the desk. Build in Claude Code.

**Item:** N.142. Spec: `docs/memory/OPEN.md`, section `N.142`. **Read it first and
in full.** Every musical rule in it is Dann's, quoted and dated.

---

## The goal, in the singer's words

Dann, 2026-09-15: *"Ilya does not understand the rhythmic function of a tie. Ties
effectively extend the duration of a note. ... At the moment, Ilya will set a
syllable under any engraved note that is contiguous. This is an error. Ilya must
understand that a tie is rhythmic prolongation."*

A singer who types a poem into a score with a tied note sees the next syllable
land on the tied note. It should land on the next note that is actually sung
anew.

---

## The rule

**A note is a syllable target when it is not a rest and it does not continue a
tie.** One named helper, not a filter repeated at each site. Dann's frame: a
note either begins a syllable or continues one.

`let-ring` is not a continuation. Leave it alone (spec, "THE SHAPE OF THE FIX").

---

## Two things the desk found that the spec does not say. Read these before you design

**1. Read the continuation from the PREVIOUS note's tie, not from the note's
own `tied.type`.** The singer can add or remove a tie in the loupe, and a
correction writes only the START note: `correction.ts:490-491` sets
`tied = { type: 'start' }` or deletes `tied`, and `:524` does the same for an
entered note. Nothing writes `stop` onto the following note. So:

- a tie the singer ADDED leaves the continuation with no `tied` at all, and a
  predicate on the note's own `tied.type` would still seat a syllable there;
- a tie the singer REMOVED leaves the continuation carrying the reader's
  `stop`, and that predicate would still skip it.

**DESK DEFAULT:** a note continues a tie when the previous non-rest,
non-deleted note in the CORRECTED line carries `tied.type` of `start` or
`continue`. Establish in the memo whether that matches what the renderer
draws (`staff-renderer.ts`, the tie drawing, and its `data-tie` attribute),
and if the two disagree, stop and report before building.

**2. Only the SEATING sites change. The loupe's navigation keeps tied notes.**
A tied note is still a note the singer may correct (its duration, its pitch),
so moving through notes must still stop on it. **DESK DEFAULT:**

| site | what it builds | change? |
|---|---|---|
| `+page.svelte:596` | `firstPass` input | yes |
| `+page.svelte:1589` | `eventIds` | establish what reads it, then decide |
| `+page.svelte:2947` | `eventIds` on ingest | yes if it seats |
| `+page.svelte:3162` | `firstPass` input on arrival | yes |
| `+page.svelte:1448`, `:1456` | the loupe's held measure | no |
| `correction.ts:574`, `:583` | `neighbourId`, `firstNoteId` | no |

Line numbers read 2026-09-16 after `7abb5ae`. For each "yes" or "decide", say in
the memo what the list feeds.

---

## Build in this order

**STEP 1. The helper, and the seating sites.** Pure function beside
`firstPass` in `apps/web/src/lib/shane/pairings.ts`, with tests: a plain tie, a
tie across a barline, a chain of three tied notes, a rest between (a rest breaks
nothing, it is skipped), a singer-added tie, a singer-removed tie, and
`let-ring`.

**STEP 2. Placements already sitting on a continuation. RULED BY DANN
2026-09-15: PUSH FORWARD.** Every later syllable shifts by one, and the last
falls off the end. His reason: *"lyrics are linearly sequenced ... that order
cannot change while still representing the lyric with fidelity."*

- **Establish first whether it can happen.** On the score-words path it cannot
  (the spec measured T05: the file sets no lyric on a continuation). On the poem
  path, a song seated before this fix can hold one.
- **Before you build step 2, write your approach into the memo and stop if it
  needs a write at load.** CONTRACT §6 forbids storing anything derived and
  adding a second silent save site while N.27 is open. A pure function over the
  map, applied where the map is read, is the shape the desk expects.
- The placed count going short is how the singer sees it. **Do not add a mark
  or a notice.** CONTRACT §6.

---

## What NOT to do

- **Do not change `VocalLineEvent`**, and do not rebuild anything in
  `apps/web/src/lib/shane/reconciliation/`.
- Do not make the loupe skip tied notes.
- Do not read slurs as melisma. The phrase-mark idea in the spec is recorded,
  not ruled.
- Do not touch `let-ring`.

---

## Definition of done

1. On a poem-path song with ties, no syllable lands on a tie's continuation, and
   the placed count's denominator drops by the number of continuations.
2. A tie the singer adds or removes in the loupe changes seating the same way.
3. The loupe still stops on tied notes.
4. The step 1 tests pass; step 2 is built or its blocker is reported.
5. All five gates green. Baselines: `docs/memory/ENVIRONMENT.md` §`Gate
   baselines` (web-test 1187, score-parser 567 passed, 5 skipped, 572).
6. Walked in a browser by Dann. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-n142-tie-prolongation_r1_<date>.md`:

1. What you changed, by file and line.
2. Your expectation, stated before each measurement, and the measurement.
3. The renderer check from finding 1, and the site table from finding 2,
   completed.
4. Step 2: built, or the reason it stopped.
5. The two NOT ESTABLISHED items in the spec: whether a continuation is
   tappable for hand placement, and what a melisma spanning a tie does. Answer
   each or keep it NOT ESTABLISHED.
6. The gate results, with any baseline movement named.
7. **A section listing what you could not establish.** NOT ESTABLISHED beats a
   complete invented answer.
8. Any decision this brief did not settle, marked as yours and reversible.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.** To
measure a before state, copy the file aside and copy it back. If you create a
new file, name it in the memo so Dann can `git add` it before he ships.
