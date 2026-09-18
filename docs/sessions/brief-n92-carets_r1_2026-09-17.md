# Brief: N.92's insert reach, the carets

Revision 1, 2026-09-17. Written by the desk for Claude Code. **Build this in
Code, pointed at the repository, where the gates run.**

Item: **N.92, the insert reach.** Spec `spec-n92-edit-surface_r1_2026-09-17.md`
section 4.1, as amended. Rulings: `docs/memory/OPEN.md` section THE CARET,
clauses 1 to 3.

---

## 1. Why this exists

Insertion is already built. It is N.92 slice 3, and a singer reaches it today
only by walking the stepper beside the readout until the bar lands in a gap
(`memo-n92-edit-audit_r1_2026-09-17.md` section 2, the audit's citations, not
re-read by the desk). **Nothing in the measure shows a singer that a gap is a
place they can stand.** This slice gives every gap a mark and a tap target.
It adds no editing capability.

## 2. What Dann ruled, 2026-09-17

1. **The caret is terminated, not a bare line.** A vertical mark that runs past
   the top and bottom staff lines, with an arrowhead at each end pointing
   inward toward the staff. His reason: so it reads as an insertion
   opportunity rather than an erratic barline.
2. **Carets are drawn only when the editing panel is showing.** A mark that
   appears when it cannot be used is noise.
3. **There is no chip row.** The measure is never drawn a second time as chips.
   The caret goes on the engraved measure itself. This struck
   `spec-n92-edit-surface_r1_2026-09-17.md:57-59`, which is now marked
   superseded in place.

## 3. What is in the tree, read by the desk 2026-09-17

Every line below was opened this session.

- **The cursor model already has the gap.** `entry.ts:35` declares
  `Cursor = { kind: 'entry'; id } | { kind: 'gap'; after: string | null }`, and
  `entry.ts:52-58` (`positions`) enumerates every place the bar can stand, in
  order: the head gap, then each entry with the gap that follows it. `after:
  null` is the gap before the first entry. **Do not invent a second way to name
  a gap. Use `positions`.**
- **The loupe's body is a clone of the page's SVG**, and the clone renames
  `data-hit` to `data-loupe-hit` so that the page's tap grammar and the loupe's
  stay apart (`Loupe.svelte:1157-1166`, comment and code).
- **The tap resolves to the nearest target, not to `closest`.**
  `Loupe.svelte:1310-1321` collects `.loupe-body [data-loupe-hit]`, takes each
  centre, picks the nearest to the pointer, and calls `onpick(id)`.
- **`onpick` carries an event id only** (`Loupe.svelte:108`, `:147`).
- **The loupe knows whether the syllables row is showing**: props
  `syllablesOpen` and `ontogglesyllables` (`Loupe.svelte:131-132`, `:154-155`).

## 4. The gate, DESK DEFAULT, reversible

The ruling names the Corrections panel, and that panel arrives with **N.149**,
which is open, not small, and carries a question of Dann's
(`docs/memory/OPEN.md`, N.148 to N.150). **Do not wait for it and do not build
a temporary panel.**

**Draw carets when `syllablesOpen` is false, and never while it is true.** That
satisfies the ruling's own reason today, and when N.149 lands the gate becomes
the panel state in one line.

## 5. The work

1. **Enumerate the gaps in the measure the loupe holds**, from `positions`
   (`entry.ts:52-58`), filtered to that measure.
2. **Draw a caret at each**, including the head gap before the first entry and
   the gap after the last. Shape per ruling 1: vertical, running past the top
   and bottom staff lines, an arrowhead at each end pointing inward.
3. **Give each caret its own hit target** inside `.loupe-body`, in the same
   nearest-target pool as the notes, so one tap has one winner and a tap
   between a note and a caret cannot resolve to both. Name the attribute
   distinctly: the desk proposes `data-loupe-gap`, carrying the gap's `after`
   value, with the head gap carrying an empty string. **Establish for yourself
   whether one pool or two reads better in the code, and say which you chose
   and why.**
4. **Carry the tap out of the component.** `onpick` takes an event id only, so
   add a sibling callback rather than overloading that string. The desk
   proposes `onpickgap: (after: string | null) => void`. Its handler sets the
   same cursor the stepper sets, so the readout and the armed duration cells
   need no change.
5. **Phone width.** The caret is a new tap target. State what hit area you gave
   it, and how you kept the drawn mark from growing to match the target.

**Slice it if it will not fit one sitting:** carets drawn and tappable on a
computer first, phone hit area and the walk second. Say where you stopped.

## 6. Constraints

- **Do not change `VocalLineEvent`**, and do not rebuild anything in
  `apps/web/src/lib/shane/reconciliation/`.
- **No new save site**, and nothing derived is stored.
- Only `.loupe-body` targets count. The head and the carried band each hold a
  whole copy of the clone with its hit rectangles, and a rectangle's client box
  is not cut by the crop that hides it (`Loupe.svelte:1301-1310`, comment).
- The loupe surface is `aria-hidden` and the keyboard path to every place is
  the stepper. **The caret is an additional pointer affordance. Do not make it
  the only way to reach a gap, and do not remove the stepper.**
- Nothing is drawn on the page itself. The carets live inside the loupe.
- No new strings and no French in this slice. If you find you need a string,
  stop and say so.
- House style applies to every comment you write.

## 7. Done when

Report `WRITTEN` when the code is in, and leave `DONE` to Dann's walk.

1. With a note selected and the syllables row closed, the loupe's measure draws
   a caret in every gap, including before the first note and after the last.
2. Each caret runs past the top and bottom staff lines and carries an arrowhead
   at each end, pointing inward.
3. Tapping a caret stands the cursor in that gap: the readout reads "after X,
   the next duration enters here" and the duration cells show the armed value.
4. Tapping a note still selects that note, and no tap resolves to the wrong
   kind of place.
5. With the syllables row open, no caret is drawn.
6. The stepper still reaches every place it reached before.
7. The five gates run clean.

## 8. Report back

One memo, short, in `docs/sessions/`. State the commit, what shipped against
section 7, the hit area you chose, and a section listing **what you could not
establish**. **NOT ESTABLISHED beats a complete invented answer.**
