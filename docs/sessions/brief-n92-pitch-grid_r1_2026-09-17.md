# Brief: the pitch cells become a grid of six

**This brief is the desk's. Do not edit, rename, or replace it.** Write your
account in the memo it asks for.

Revision 1, 2026-09-17. Build in Claude Code, branch `Shane`. It follows
`brief-n92-two-small-rows_r1_2026-09-17.md`, shipped as `0eb0a95`, and fixes
what Dann found on its walk.

## What he found

The two new semitone cells read "Up a semitone" and "Down a semitone" in full,
because step and octave have short words and semitone had none. His words:
*"that down a semitone button is disproportionately wide."*

## What he ruled, 2026-09-17

**The PITCH station becomes a grid of six: three columns by two rows.** Columns
are the distance, rows are the direction.

```
▲ semitone   ▲ step   ▲ octave
▼ semitone   ▼ step   ▼ octave
```

His reasoning: the column says how far, the row says which way, and three cells
to a row fit a phone where six in a line do not. He asked whether "semitone,
tone, octave" would sound better in French and the desk showed why not: the
middle cell moves the notehead by a diatonic step, which is a semitone or a
whole tone depending on the key (`correction.ts:156`), so "tone" would name a
distance it does not always give. He accepted that.

## What to build

- **One new key**, in both languages, ruled by Dann. Nothing else is coined:

  ```
  'loupe.pitch.semitone': { en: 'semitone', fr: 'demi-ton' },
  ```

  It joins `loupe.pitch.step` and `loupe.pitch.octave`, whose place in
  `i18n.ts` it should take beside.
- **The six cells carry the short word as visible text**, exactly as step and
  octave do today, with the arrow glyph before it.
- **The spoken labels do not change.** `correct.semitoneUp`,
  `correct.semitoneDown`, `correct.stepUp`, `correct.stepDown`,
  `correct.octaveUp` and `correct.octaveDown` stay as the `aria-label` of their
  cell.
- **Everything else about the cells stays**: the press-and-hold repeat, the
  `disabled={inGap}` rule, the cell shape, the touch floor.
- **The layout is a grid, not two flex rows**, so the three columns line up on
  both rows at every width. Where the grid cannot fit a phone's width, the
  columns may shrink but the 44 px floor holds.
- Desk defaults are yours, named in the memo, and reversible: the gap between
  the rows, and whether the arrow sits before or above the word.

## Constraints

- Do not change `VocalLineEvent` and rebuild nothing in
  `apps/web/src/lib/shane/reconciliation/`.
- No new save site (N.27 is open).
- Do not touch the fill tag, the syllables row, or anything in
  `spec-n92-edit-surface_r1_2026-09-17.md` that is not this grid.

## Definition of done

1. The PITCH station draws six cells in three columns and two rows, in both
   languages, on a phone width and on a desk.
2. Each cell moves the selected note as it did before, and the press-and-hold
   repeat still works.
3. All five gates green. **Baselines as of `0eb0a95`: web-test 1261, web-check
   0 errors and 12 warnings in 5 files.** Report the new numbers.
4. Walked by Dann. **WRITTEN is not DONE.**

## What to return

A memo at `docs/sessions/memo-n92-pitch-grid_r1_<date>.md`: what changed by file
and line, the gate table, a section listing what you could not establish, and
any decision this brief did not settle, marked as yours and reversible. List
every new file to `git add`.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.**
