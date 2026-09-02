# Brief: N.103, the spacer sees ink

Written 2026-09-02 by the desk for a fresh Claude Code thread. Floor:
`bb73488`, "N.106: the turning unit keeps to the right of the sung unit".
Item: **N.103**, numbered by Dann 2026-08-27 ("measures do not re-space when
ink is added"), placed by him 2026-09-02 ahead of N.102 increment 1c.

## 1. What Dann saw

Two eighths a head apart on Without Sun song 1 (underlay «лё ко»). N.106 put
the first eighth's turning head to its right, where it now sits hard against
the second eighth's head. His words: "This feels a little cramped." His
design intent, which this brief builds: the spacer should have "some kind of
sensitivity" to the layers it does not see.

Same fault, earlier: a dot crowding the next note's accidental (N.103's
original case), and the N.102 memo's note that a courtesy cluster at a
measure opening has 2.735 units to the barline.

## 2. What exists

`packages/score-parser/src/staff-renderer.ts:758-775`, `columnAdvance`, is
the SINGLE definition of the minimum x-advance between columns, called by
the renderer's own column walk and by `page-layout.ts`'s `sliceWidth`, so
pagination and rendering cannot drift. Three terms compete and the widest
wins: `minGap`; `prevDurWhole * pxPerWhole`; and the text term, half of
each column's underlay plus half a stave-space (Gould r235's floor). It
takes the two `VocalLineEvent`s and options. **It knows nothing about
accidentals, dots, courtesy clusters, or the turning layer**, all of which
are ink the draw loop adds later.

Ink the draw loop adds, per column, read this session:
- left of the head: a required accidental (`:1372-1395` region, now via
  `advanceAccidentalState` at `:348`), or a courtesy cluster
  (`accidentalParensLeft` + accidental + `accidentalParensRight`, with
  `COURTESY_GAP_SP` each side), nudged off the barline at a measure opening;
  the turning accidental when the turning unit is aligned.
- right of the head: augmentation dots (`:1662-1715`); the turning unit
  when displaced (`:1796-1871`, `TURNING_CLEARANCE_SP`), which is the
  turning accidental (if any) plus the turning head.

## 3. What to build

A fourth term in `columnAdvance`: **ink**. `prev.right + this.left + INK_CLEAR`,
where `INK_CLEAR` is an exported constant in stave-spaces, **DESK DEFAULT
0.5 sp** (the same half stave-space Gould r235 gives text; Dann's to wave
off). The widest of the four terms wins, as today. Stretch-only
justification above it is untouched.

**And a second constant, ruled by Dann 2026-09-02, which is the point of the
item.** His words: "Lavender pitches relate to the black ink that precedes
them. When lavender is too close to a following adjacent black ink note, it
blurs this clarity. I'm looking for a way to insist on space after the
lavender to preserve its impression as a unit relating to the preceding
note." The biglyph belongs to its parent SEMANTICALLY: a turning pitch is a
property of the vowel that corresponds to the note it follows (his words). Proximity is how the page
SHOWS that, not why it is so. It sits 0.25 sp from the sung unit, so the gap
after it must be visibly larger, or the page contradicts the meaning. When the previous
column's rightmost ink is a displaced turning unit, the ink term uses
`TURNING_TRAIL_SP` in place of `INK_CLEAR`: **DESK DEFAULT 1.0 sp**, four
times the leading gap, Dann's to set by eye once he sees it. The trailing
clearance is measured from the turning unit's right ink edge to the next
column's left ink edge, whatever that ink is. A turning unit that is aligned
(a third or more) is not displaced and does not trigger it.

To compute `left` and `right`, one exported pure function,
`columnInk(ev, analysis, accState, turningState, options): { left, right }`,
in stave-space or px units matching `columnAdvance`, measured from the
column's x (the notehead's centre, `nx`). It must use the same glyph metrics
and the same clearances the draw loop uses (`sp(smufl.glyph(...).widthSp)`,
`COURTESY_GAP_SP`, `TURNING_CLEARANCE_SP`, the dot `clear`), and the same
decision about whether an accidental or a courtesy draws
(`advanceAccidentalState`). **The draw loop and `columnInk` must not
restate each other's arithmetic**: factor the shared pieces so one change
moves both, the way `advanceAccidentalState` already does for the
accidental rule. If the draw loop can consume `columnInk`'s result for its
own placement, do that.

Threading: `columnAdvance` needs the analysis (turning pitch) and the two
accidental states, which it does not receive today, and `sliceWidth` in
`page-layout.ts` calls it without them. Design the threading so both call
sites pass the same inputs; the memo says how. A column walk that carries
`measureAcc` and `turningAcc` forward is the obvious shape, and
`accidentalStateAtEndOf` already seeds per slice.

Primitive mode (no font) uses its fixed widths; do not leave it with a
zero ink term.

## 4. Definition of done

1. Tests, `staff-renderer.test.ts`: `columnInk` on a bare quarter gives
   head half-width both sides; with a flat gives the flat's width plus
   clearance on the left; with a courtesy gives the cluster's width; dotted
   gives the dot on the right; a displaced turning unit adds the unit on the
   right; an aligned turning unit with an accidental adds that accidental on
   the left. `columnAdvance`: two eighths whose first carries a displaced
   turning unit advance by at least `right + left + TURNING_TRAIL_SP`, and
   two columns with sung ink only by at least `right + left + INK_CLEAR`, and by
   exactly the rhythm term when the ink term is smaller. `page-layout`: a
   system whose columns gain ink packs fewer measures, and `sliceWidth`
   equals the rendered width.
2. Five gates at baseline, with gate 5 disclosed if it moves from
   `511 passed | 5 skipped (516)` and gate 4 from `920 passed (920)`.
   Report the new numbers and which line of `~/Downloads/ilya-ship.sh` must
   change; do not edit that file.
3. A local production build, walked by you, on Without Sun song 1 with the
   demo bass profile seeded as the N.106 memo did: the «лё ко» pair at 3×
   before and after; the narrowest ink-to-ink clearance on the page before
   and after, in units; how many measures each system holds before and
   after, and whether the page count changed. Then the control: a system
   with no displaced turning units, no courtesies, and no dots is spaced
   identically to the digit.
4. No user-facing string added or changed. No French coined.

## 5. Constraints

- `THIS DESK DOES NOT BUILD`; you do. You do not run git.
- Do not change `VocalLineEvent`. Do not touch
  `apps/web/src/lib/shane/reconciliation/`. Do not turn
  `underlay-donor.ts` into the alignment engine.
- Stretch only, never compress: the ink term is a minimum, like the
  others.
- Nothing derived is stored: ink is computed at layout, never written.
- Do not shrink the stave to fit more systems.
- House style in the memo: Canadian spelling, no em dashes, `NOT
  ESTABLISHED` never smoothed into prose.

## 6. Return format

A memo at `docs/sessions/memo-n103-ink-spacing_r1_<date>.md`: what changed
with `path:line`, the threading design, the before-and-after numbers of §4.3,
gates, citations your edit moved, and a NOT ESTABLISHED section. **"NOT
ESTABLISHED beats a complete invented answer."** Commit message for Dann:
`N.103: the spacer sees ink`.
