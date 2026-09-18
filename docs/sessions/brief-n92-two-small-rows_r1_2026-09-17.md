# Brief: two small rows, the semitone cells and the fill line's wording

**This brief is the desk's. Do not edit, rename, or replace it.** Write your
account in the memo it asks for.

Revision 1, 2026-09-17. Build in Claude Code, on branch `Shane`. These are the
two S rows from `memo-n92-edit-audit_r1_2026-09-17.md`, which you should read
first, along with `spec-n92-edit-surface_r1_2026-09-17.md` for what they serve.
**Nothing else in that spec is in scope tonight.** The carets, the marks and the
tempo are not this ship.

## Row 1. The semitone cells return to the Corrections surface

**What is true today**, from the audit: `semitonePitch` exists
(`correction.ts:189-195`), `handleSemitone` exists and is wired to the keyboard
only (`+page.svelte:1007-1014`, keys at `:1371-1380`), and the surface itself
records why there is no cell: *"the semitone verbs stay retired, per Dann's
ruling of 2026-08-24"* (`CorrectionSurface.svelte:596-598`).

**RULED BY DANN 2026-09-17, reversing that:** a singer on a phone cannot nudge a
semitone at all, and a phone is the surface Ilya is built for. The cells come
back.

- Two cells in the PITCH station, beside the step and octave cells, in the same
  cell shape, reading up a semitone and down a semitone.
- **No new strings**: `correct.semitoneUp` and `correct.semitoneDown` are
  already in both languages (`i18n.ts:248-249`).
- They call the same `handleSemitone` the keys call. No new logic, no new record
  shape.
- Disabled in a gap, exactly as the step and octave cells are.
- **Correct the retirement comment in place** (`CorrectionSurface.svelte:596-598`)
  so it records the reversal and its date rather than a ruling that no longer
  holds. Do not delete the history: amend it.

## Row 2. The fill line says what the numbers mean

**What is true today**: `measureFill` (`entry.ts:381-431`) computes actual
against expected and returns `null` when they agree, so a measure that adds up
already says nothing. The loupe's tag shows the raw ratio through
`loupe.measureTagFill` and `loupe.measureTagBoth` (`i18n.ts:516`, `:523`,
composed at `Loupe.svelte:1337-1369`).

**What changes**: the tag keeps its numbers and gains one word that says which
way the measure disagrees.

- Where `actual` is less than `expected`, the tag ends with the word for
  **short**. Where it is greater, the word for **over**.
- **Nothing is added for a measure that adds up**, because `measureFill` returns
  `null` there and the tag already falls back to its plain form.
- **The two new keys, RULED BY DANN 2026-09-17, in both languages. Use these
  exactly and invent nothing:**

  ```
  'loupe.fill.short':  { en: 'short', fr: 'incomplète' },
  'loupe.fill.over':   { en: 'over',  fr: 'trop pleine' },
  ```

  The word joins the existing tag with a comma and a space, so the tag reads
  `m. 2 · 4.5 of 6, short` and « mes. 2 · 4,5 sur 6, incomplète ». Both French
  words agree with *mesure*. Dann on « trop pleine »: *"when our French
  colleagues raise an eyebrow we will adopt their better suggestion."*
- **This is a user-facing string on a line Dann has ruled on twice**
  (`entry.ts:402-422`), so change the wording only as stated above.
- Over is not an error and carries no colour, no icon and no alarm. Ruled by
  Dann 2026-09-17: a sextuplet under construction is over the meter until it is
  bound, and Ilya waits.

## Constraints

- Do not change `VocalLineEvent`, and rebuild nothing in
  `apps/web/src/lib/shane/reconciliation/`.
- No new save site (N.27 is open).
- Do not touch the caret, chip, mark or tempo work. It is designed and not
  briefed.

## Definition of done

1. On a phone-width viewport, the two semitone cells appear in the PITCH station
   and move the selected note by a semitone, proven by a walk and by whatever
   unit test the existing semitone logic already has or gains.
2. The loupe's tag reads with its new word in both languages, in all three
   states: short, adds up (no word, no numbers), over.
3. All five gates green. **Baselines as of `55c04d9`: web-test 1261, web-check
   0 errors and 12 warnings in 5 files.** Report the new numbers.
4. Walked by Dann. **WRITTEN is not DONE.**

## What to return

A memo at `docs/sessions/memo-n92-two-small-rows_r1_<date>.md`: what changed by
file and line; the gate table; **a section listing what you could not
establish**; and any decision this brief did not settle, marked as yours and
reversible. List every new file to `git add`.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.**
