# Brief: N.144, Start placement over keeps the score's own layout, and can be undone

Revision 1, 2026-09-16. Written at the desk. Build in Claude Code.

**Item:** N.144. Spec: `docs/memory/OPEN.md`, section `N.144`. **Read it first
and in full.** Every finding in it is Dann's or read from the tree, quoted and
dated.

---

## The goal, in the singer's words

Dann, on the N.142 walk of T05, `c868540`, 2026-09-16, after pressing **Start
placement over** on a score with a melisma: m. 22's slurred pair took a second
syllable it should never have taken, every later syllable sat one note early
for the rest of the piece, and the loupe read two syllables run together with
no gap. His response: *":("*. Asked how hard a fix is: *"surely it can be
coded, no? The file contains syllable assignments."*

A singer who presses Start placement over on a score that carries its own
words should get back exactly what arriving with that score gives: one
syllable per sung note, a melisma or a tie's continuation left alone. And if
the press was a mistake, Undo should take it back, the same as every other
correction verb already does.

---

## The cause, as the spec establishes it

`handleStartPlacementOver` (`+page.svelte`) rebuilds with `firstPass`
(`pairings.ts`), which seats slot *i* on target *i* by counting: it has no
idea the file's own underlay ties two notes to one vowel. The automatic seat
that runs when a score first arrives does not have this problem, because N.134
built it to read the file's OWN mapping instead
(`seatFilledPoem` → `seatScoreWords`, `score-seat.ts`). Start placement over
was never wired to that path; it still runs the same count-based pass N.134
was built to get away from.

**Separately, `handleStartPlacementOver` never calls `pushUndo`.** Every other
correction verb in this file does. `loupe.undo.startOver` is already ruled in
both languages and already built into `i18n.ts`
(`memo-loupe-french-build_r1_2026-09-16.md`); nothing calls it.

---

## The fix, per the spec's own DESK DEFAULT

> "where the score carries words, Start placement over empties the placements
> and calls `seatFilledPoem`; a wordless score keeps `firstPass`. The press
> pushes an undo entry that reads `loupe.undo.startOver`."

---

## One thing the desk found that the spec does not say. Read this before you build

**`seatScoreWords` is increment 1 only, and on a mismatch it seats NOTHING AT
ALL, silently — it does not fall back, it does not partially seat, it returns
the map exactly as it was handed in.** Its own header says so: *"A singer's
own different poem needs alignment between two texts, which is increment 2 and
is not built."* Its own test says so too, by name:
`score-seat.test.ts`, `'seats nothing against a poem that is not the score
text'` — `seated: 0`, `map` unchanged.

**This matters here specifically because the spec's fix empties the map
FIRST.** If `doc.inputText` is not the score's own words one for one — the
singer has typed something else, or edited the poem since the score arrived —
calling `seatFilledPoem` against an already-emptied map would place nothing
back at all. That is a worse outcome than the bug this item fixes: today's
`firstPass` at least seats every note in the typed poem, in order, even when
it gets a melisma wrong. **Do not wire the new path in unconditionally.**

**Guard it exactly the way N.134's own two existing callers already guard the
same call**, rather than inventing a new signal: `+page.svelte:2346` and (near
what is today's line 3238) both check `doc.inputText === scoreWordsText
(collectScoreWords(score, 1))` before calling `seatFilledPoem`. That derived
value already has a name in this file: `scoreText`
(`+page.svelte:385-387`), and it is empty exactly when there is no score or
the score carries no words, so `scoreText !== '' && doc.inputText ===
scoreText` is both "the score carries words" and "the box still holds them
verbatim" in one comparison, with no new derived state and no change to
`score-seat.ts`.

**This also protects the exact case the spec calls out under "Constraint from
the tree."** N.112's fix (2026-09-07) made the rebuild read the POEM rather
than the score's own words, because an engraving can lose a syllable (this
alias's own fixture lost a final `я`) and the poem is where a singer corrects
that. Where the poem has been corrected away from the score's raw text, the
guard above is false, `doc.inputText !== scoreText`, and the count-based pass
runs exactly as it does today, unaffected. Only a box that STILL reads the
score's own words verbatim takes the new path. THE POEM STILL OWNS THE TEXT.

---

## Build in this order

**STEP 1. Undo.** Add `pushUndo({ kind: 'text', key: 'loupe.undo.startOver'
})`, placed after the existing `if (source === 'none') return;`, for the same
reason `placeArmedSyllable` places its own push after ITS early return: a
press that does nothing must not leave an Undo pill promising to undo nothing.

**STEP 2. The branch.** Immediately after the push, before the existing
`rebuildQueue`/`firstPass` code:

```
if (scoreText !== '' && doc.inputText === scoreText) {
    doc.pairings = {};
    seatFilledPoem(ingestedScore);
    orphanedCount = 0;
    return;
}
```

Leave the existing `firstPass` branch below it exactly as it is; it is now the
`else`, reached whenever the guard is false. `seatFilledPoem` sets its own
`pairingCursor`; do not set it again after calling it.

**STEP 3. Read, do not assume.** Confirm in the memo that `scoreText` and
`seatFilledPoem` are both already in scope at `handleStartPlacementOver`'s
call site (both are `const`/`function` declarations elsewhere in the same
component, so Svelte's function hoisting and top-to-bottom `$derived`
initialisation should make this a non-issue, but say so from having read it
rather than from this brief's say-so).

**STEP 4. Extend the existing score-seat tests, do not add new machinery.**
`score-seat.test.ts` already has a fixture (`sunless-01-engraved.musicxml`)
and a case for exactly the mismatch this brief guards against ("seats nothing
against a poem that is not the score text"). Confirm the guard's two halves
against it directly: `scoreText`-equivalent text seats every slot (already
covered by the existing "places every slot of the poem exactly once" case,
which this brief does not change); a poem that has diverged seats nothing
(already covered). If a gap is found, name it in the memo; do not invent a new
field on `ScoreSeatResult` unless the memo shows the existing return value
cannot distinguish the cases this item needs distinguished.

---

## What NOT to do

- **Do not touch `score-seat.ts` or `pairings.ts`** unless step 4 finds the
  existing return value genuinely cannot support the guard above. The guard as
  specified reads only values already computed in `+page.svelte`.
- **Do not make the new branch fall back to `firstPass` on a partial seat.**
  `seatScoreWords` withholding a word (its counts disagree) or leaving a
  melisma's continuation undecided is correct, ruled behaviour, not a
  failure to catch.
- **Do not add a mark, notice, or confirmation dialog for either branch.**
  CONTRACT §6.
- **Do not change what the button is disabled on.** `slotQueue.length > 0`
  stays the guard that shows or hides it; this brief only changes what
  pressing it does once it is showable.

---

## Definition of done

1. On a score whose box still reads the score's own words verbatim, Start
   placement over gives back the identical arrangement N.134's own arrival
   path would produce: a melisma or a tie's continuation takes no syllable of
   its own, every other note takes its file-given one.
2. On a score whose poem has been typed or edited away from the score's own
   words, Start placement over behaves exactly as it does today: unchanged.
3. The press pushes one undo entry reading "placement started over" /
   « placement recommencé », and Undo restores the prior arrangement.
4. A press with nothing to rebuild from (`source === 'none'`) still does
   nothing and still pushes no undo entry.
5. All five gates green. Baselines: `docs/memory/ENVIRONMENT.md` §`Gate
   baselines`.
6. Walked in a browser by Dann on the exact T05 melisma this item names.
   **WRITTEN is not DONE.**

---

## What to return

A memo at
`docs/sessions/memo-n144-start-over-keeps-the-score_r1_2026-09-16.md`:

1. What you changed, by file and line.
2. Whether step 4's existing tests already cover the guard's two halves, or
   what gap you found and how you closed it.
3. The two NOT ESTABLISHED items in the spec (what draws the line under
   «сту-дё», and whether the `ˈjokstu` collision survives): confirm they are
   still open and still deferred to Dann's own walk, or say what you found.
4. The gate results, with any baseline movement named.
5. **A section listing what you could not establish.** NOT ESTABLISHED beats
   a complete invented answer.
6. Any decision this brief did not settle, marked as yours and reversible.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.** If you
create a new file, name it in the memo so Dann can `git add` it before he
ships.
