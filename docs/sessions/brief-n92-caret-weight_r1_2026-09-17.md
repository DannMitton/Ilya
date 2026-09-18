# Brief: the caret's weight, and its clearance from the squircle

Revision 1, 2026-09-17. Written by the desk for Claude Code. Builds on
`brief-n92-carets_r1_2026-09-17.md`, shipped as `f4e31a2`.

Item: **N.92, the insert reach.** Ruling: `docs/memory/OPEN.md`, section THE
CARET, clause 4, ruled by Dann 2026-09-17 from a five-plate drawing. He chose
plate C's weight with plate D's clearance.

## 1. Why

Dann walked `f4e31a2` and the carets read as a picket fence that competes with
the squircle. His words: *"functionally this is correct but look at this: it's
monstrous!... I think the squircles should remain the featured coloured element
in the Loupe."* **Nothing about the behaviour changes. This is weight, colour,
and one clearance rule.**

## 2. The weight, plate C

Four values in the caret block (`Loupe.svelte:1241-1245`, `:1283`, read by the
desk 2026-09-17):

| What | Shipped in `f4e31a2` | Plate C |
|---|---|---|
| Colour | `#9585a2`, the lavender | `#6A655F`, `--ink-tertiary`, the app's warm grey |
| Opacity | full | **0.32**, on the whole mark, line and arrowheads alike |
| Vertical stroke | `stroke-width` `1`, a flat literal | **the stave's own line width**, the value already sampled at `Loupe.svelte:990` |
| Arm past each staff line | `lineGap` | **`lineGap * 0.6`** |
| Arrowhead half-base | `lineGap * 0.8` | **`lineGap * 0.34`** |

**The hairline matters most.** A flat `1` in the clone's own units is drawn at
the loupe's magnification, which is why the mark reads as a bar. Take the stave
line's own width so the caret is a hairline at every magnification.

## 3. The clearance

Dann: *"ensure that the carets do not align with the sides of the squircle: let
them be fully expressed without that collision."*

The collision is structural. A caret stands at the boundary between two notes,
and the squircle's edge lands in the same place.

- **No caret stands closer than 1.2 line-gaps to the squircle's stroke.**
- A caret that would fall inside that band **moves outward**, away from the
  squircle's centre. It never moves into the taken note.
- **The clamp, and it is part of the rule:** if the full 1.2 would carry the
  caret onto a neighbouring note's own hit rectangle, the caret holds short of
  that note instead. **Report which measures of the fixture, if any, hit the
  clamp.**
- The caret's hit rectangle moves with the drawn mark. The gap it selects does
  not change: it still names the same `after`.
- Only one squircle exists at a time, on the taken note. Where there is none,
  no caret moves.

## 4. Constraints

- Behaviour is unchanged. `positionsInMeasure`, `handleLoupePickGap`,
  `setCursor` and the one-pool tap resolution are all as shipped.
- **Do not change `VocalLineEvent`**, and do not touch the squircle. Its
  geometry is N.141's and is ruled separately.
- No new strings.
- House style in every comment.

## 5. Done when

Report `WRITTEN`; `DONE` is Dann's walk.

1. Every caret is warm grey at 0.32, hairline, with the smaller arrowheads.
2. No caret's drawn mark stands within 1.2 line-gaps of the squircle's stroke,
   and none has moved into a note.
3. Tapping a moved caret still selects the same gap it selected before.
4. The five gates run clean. **If your own new tests move gate 4's baseline, say
   so in the memo with the new number. Do not edit `ilya-ship.sh`.**

## 6. Report back

A short memo in `docs/sessions/`, with the commit, the results against section
5, the clamp cases, and a section on **what you could not establish**. **NOT
ESTABLISHED beats a complete invented answer.**
